import { compare } from 'bcrypt-ts';
import NextAuth, { type User, type Session } from 'next-auth';
import Github from 'next-auth/providers/github';
import { createSSOUser, getUser } from '@/lib/db/queries';

import { authConfig } from './auth.config';

interface ExtendedSession extends Session {
  user: User;
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  providers: [
    Github({
      allowDangerousEmailAccountLinking: true,
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token, user, profile }) {
      if (token.email) {
        const [githubUser_id] = await getUser(token.email);

        if (githubUser_id) {
          token.id = githubUser_id;
        }
      }

      if (profile) {
        token.email = profile.email || null;
      }
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({
      session,
      token,
    }: {
      session: ExtendedSession;
      token: any;
    }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
    async signIn({ user, account }) {
      if (account?.provider === 'github') {
        if (user && user.id && user.email && user.name) {
          const [githubUser] = await getUser(user?.email);
          if (githubUser) {
            return true;
          } else {
            //create User if uset not exists
            await createSSOUser(user.id, user.email, user.name);
          }
        }
      }
      return true;
    },
  },
});
