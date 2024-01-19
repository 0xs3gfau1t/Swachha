import prisma from '@/lib/prisma';
import { AuthOptions, DefaultSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { Adapter } from 'next-auth/adapters';
import { hashSync, compareSync } from 'bcryptjs';

declare module 'next-auth' {
  interface Session {
    user: {
      provider?: string;
      id?: string;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    provider?: string;
    id?: string;
  }
}

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    CredentialsProvider({
      id: 'login-user',
      name: 'Login User',
      credentials: {
        email: {
          type: 'text',
          label: 'Email',
          value: '',
          placeholder: 'Email',
        },
        password: {
          type: 'password',
          label: 'Password',
          value: '',
          placeholder: 'Password',
        },
      },
      async authorize(creds) {
        if (!creds) return null;
        const user = await prisma.user.findUnique({ where: { email: creds.email } });
        if (user && user.password && compareSync(creds.password, user.password)) return user;
        return null;
      },
    }),
    CredentialsProvider({
      id: 'register-user',
      name: 'Register User',
      credentials: {
        token: {
          type: 'text',
          label: 'Verification Token',
          value: '',
          placeholder: 'Verification Token',
        },
        password: {
          type: 'password',
          label: 'Password',
          value: '',
          placeholder: 'Password',
        },
      },
      async authorize(creds) {
        if (!creds) return null;
        try {
          const tok = await prisma.verificationToken.findUnique({
            where: { token: creds.token },
          });
          if (!tok) return null;

          const hashedPassword = hashSync(creds.password, 10);
          const user = await prisma.user.update({
            where: { id: tok.identifier },
            data: { password: hashedPassword },
          });

          if (user) await prisma.verificationToken.delete({ where: { token: tok.token } });
          return user;
        } catch (err) {
          console.error(err);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (account) token.provider = account.provider;
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      session.user.provider = token.provider;
      session.user.id = token.id;
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
  theme: {
    colorScheme: 'dark',
  },
};
