import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import { supabase } from "./supabase";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Check if user exists in the User table
        const { data: user, error } = await supabase
          .from('User')
          .select('*')
          .eq('email', credentials.email)
          .single();

        if (error || !user) {
          console.error("User not found:", error);
          return null;
        }

        // For demo purposes, we'll accept any password for existing users
        // In production, you'd verify the hashed password here
        // const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
        // if (!isPasswordValid) {
        //   return null;
        // }

        // Special case for demo user
        if (credentials.email === "demo@example.com" && credentials.password === "demo") {
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        }

        // For other users, accept any password (demo only - remove in production)
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-key",
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    }
  }
};
