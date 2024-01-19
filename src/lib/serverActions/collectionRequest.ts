'use server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../authOptions';
import prisma from '@/lib/prisma';

export const addRequest = async (latitude: number, longitude: number) => {
  const session = await getServerSession(authOptions);
  if (!session) return { message: 'Unauthorized', data: null };

  const request = await prisma.collectionRequest.create({
    data: {
      User: { connect: { id: session.user.id } },
      latitude,
      longitude,
    },
  });

  return { message: 'Added collection request', data: request };
};

export const getRequests = async (
  from: { lat: number; lng: number },
  to: { lat: number; lng: number }
) => {
  console.log({ from, to });
  return prisma.collectionRequest.findMany({
    where: {
      AND: [
        {
          latitude: { gte: from.lat, lte: to.lat },
          longitude: { gte: from.lng, lte: to.lng },
        },
      ],
    },
  });
};

export const getAll = async () => {
  return prisma.collectionRequest.findMany({});
};
