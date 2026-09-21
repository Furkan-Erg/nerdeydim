import type { NextAuthConfig } from "next-auth";

// Edge-safe config: no providers here that touch Node-only APIs (Prisma/pg),
// since this file is imported by middleware.ts, which runs on the Edge runtime.
export const authConfig = {
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [],
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) token.id = user.id;
      return token;
    },
    session: ({ session, token }) => {
      if (session.user) session.user.id = token.id as string;
      return session;
    },
  },
} satisfies NextAuthConfig;
