import { getServerSession } from 'next-auth';
import { authOptions } from '../authOptions';
import prisma from '@/lib/prisma';

export default async function addRequest(coord: string) {
  'use server';
  const session = await getServerSession(authOptions);
  if (!session) return { message: 'Unauthorized', data: null };

  const request = await prisma.collectionRequest.create({
    data: {
      User: { connect: { id: session.user.id } },
      coord,
    },
  });

  return { message: 'Added collection request', data: request };
}
