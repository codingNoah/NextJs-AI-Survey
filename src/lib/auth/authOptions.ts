import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";
import { type AuthOptions } from "next-auth";
import { compare, hash } from "bcryptjs";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      credentials: {
        email: {
          type: "email",
          label: "Email",
          placeholder: "johndoe@gmail.com",
        },
        password: {
          type: "password",
          label: "Password",
          placeholder: "*****",
        },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Please enter both email and password.");
          }

          const email = credentials.email.toLowerCase();

          let user = await prisma.user.findUnique({
            where: { email },
          });

          if (user) {
            if (!user?.password)
              throw new Error("User must sign in with Google.");

            const isValid = await compare(credentials.password, user.password);
            if (!isValid) throw new Error("Invalid email or password.");

            return {
              id: user.id,
              name: user.name,
              email: user.email,
              image: user.image,
            };
          } else {
            const hashedPassword = await hash(credentials.password, 10);

            user = await prisma.user.create({
              data: {
                email,
                name: email.split("@")[0],
                password: hashedPassword,
              },
            });

            return {
              id: user.id,
              name: user.name,
              email: user.email,
              image: user.image,
            };
          }
        } catch (error) {
          console.error("Authorize error:", error);
          throw new Error("Authentication failed");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.image = user.image;
      }

      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.image = token.image as string;
      }

      return session;
    },
  },
};
