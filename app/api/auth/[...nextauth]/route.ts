import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/src/lib/mongodb";
import { User } from "@/src/models";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const user = await User.findOne({ college_email: credentials.email });

if (!user) {
  throw new Error("No user found with this email.");
}

// Safely grab the password, checking both possible field names from your migration
const dbPassword = user.password || user.password_hash;

// THE GUARDRAIL: Prevent the bcrypt crash if the password field is missing
if (!dbPassword) {
  throw new Error("This account exists but has no password set in the database. Please contact an administrator.");
}

const isPasswordValid = await bcrypt.compare(credentials.password, dbPassword);

if (!isPasswordValid) {
  throw new Error("Invalid credentials.");
}

        // The object returned here is saved in the NextAuth JWT token
        return {
          id: user._id.toString(),
          email: user.college_email,
          name: user.full_name,
          role: user.role,
        };
      }
    })
  ],
  // Inside your authOptions object
callbacks: {
  async jwt({ token, user }: any) {
    // When the user logs in, 'user' will contain the data returned by your authorize function
    if (user) {
      token.id = user.id || user._id;
      token.role = user.role;
      token.college_id = user.college_id; // CRITICAL: This fixes "ID PENDING"
      token.department = user.department;
      token.full_name = user.full_name;
      token.is_hod = (user as any).is_hod;
    }
    return token;
  },
  async session({ session, token }: any) {
    // This passes the data from the token to the frontend session object
    if (token && session.user) {
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.college_id = token.college_id; // CRITICAL: This fixes "ID PENDING"
      session.user.department = token.department;
      session.user.full_name = token.full_name;
      session.user.is_hod = token.is_hod as boolean;
    }
    return session;
  }
},
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  // We need a secret to encrypt the JWT. 
  // Add NEXTAUTH_SECRET to your .env.local file!
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };