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

        // Updated to use user.password matching the new schema
        const isPasswordMatch = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordMatch) {
          throw new Error('Incorrect password.');
        }

        // The object returned here is saved in the NextAuth JWT token
        return {
          id: user._id.toString(),
          email: user.college_email,
          name: user.full_name,
          role: user.role,
          college_id: user.college_id, // Added to pass into JWT
          department: user.department, // Added to pass into JWT
          full_name: user.full_name    // Added to pass into JWT
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      // When the user logs in, 'user' will contain the data returned by your authorize function
      if (user) {
        token.id = user.id || user._id;
        token.role = user.role;
        token.college_id = user.college_id; 
        token.department = user.department;
        token.full_name = user.full_name;
      }
      return token;
    },
    async session({ session, token }: any) {
      // This passes the data from the token to the frontend session object
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.college_id = token.college_id; 
        session.user.department = token.department;
        session.user.full_name = token.full_name;
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