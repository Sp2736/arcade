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
        await dbConnect();

        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter both email and password.');
        }

        const user = await User.findOne({ college_email: credentials.email });

        if (!user) {
          throw new Error('No user found with this email.');
        }

        const isPasswordMatch = await bcrypt.compare(credentials.password, user.password_hash);

        if (!isPasswordMatch) {
          throw new Error('Incorrect password.');
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
  callbacks: {
    // Attach the role and ID to the JWT token
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
      }
      return token;
    },
    // Pass the role and ID from the token into the active session
    async session({ session, token }) {
      if (session?.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
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