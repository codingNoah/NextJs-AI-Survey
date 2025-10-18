export const runtime = "nodejs";

import NextAuth, { type AuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth/authOptions";

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error("Missing GitHub OAuth environment variables");
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
