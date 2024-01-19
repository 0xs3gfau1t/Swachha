import prisma from '@/lib/prisma';
import { AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { Adapter } from 'next-auth/adapters';

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    CredentialsProvider({
      id: 'register-user',
      name: 'Register User',
      credentials: {
        name: { type: 'text', label: 'Name', value: '', placeholder: 'User name' },
        house_number: {
          type: 'text',
          label: 'House number',
          value: '',
          placeholder: 'House number',
        },
        phone_number: {
          type: 'text',
          label: 'Phone number',
          value: '',
          placeholder: 'Phone number',
        },
      },
      authorize: (creds) => {
        prisma.user.create({ data: { name: creds?.name } });

        creds;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session }) {
      if (session && session.user) {
        const user = await prisma.user.findFirst({
          where: {
            email: session?.user?.email,
          },
        });
        session.user = { ...session.user, ...user };
      }
      return session;
    },
  },
};
