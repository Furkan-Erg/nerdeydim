import type { NextAuthConfig } from "next-auth";

// Edge-safe config: no providers here that touch Node-only APIs (Prisma/pg),
// since this file is imported by middleware.ts, which runs on the Edge runtime.
export const authConfig = {
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  // Required for self-hosted deployments behind a reverse proxy (Nginx):
  // Auth.js rejects the forwarded Host header as untrusted otherwise.
  trustHost: true,
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
