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
      status: 'Pending',
      latitude,
      longitude,
    },
  });

  return { message: 'Added collection request', data: request };
};

export const getUserRequestSummary = async (userId: string) => {
  const requests = await prisma.collectionRequest.findMany({
    where: { userId },
    select: { id: true, status: true, Routes: true },
  });
  const total = requests.length;
  const pending = requests.filter((r) => r.status === 'Pending').length;
  const dispatched = requests.filter((r) => r.status === 'Dispatched').length;
  const fulfilled = requests.filter((r) => r.status === 'Fulfilled').length;
  console.log(requests)
  return { total, pending, dispatched, fulfilled };
};

export const getRequests = async (
  from: { lat: number; lng: number },
  to: { lat: number; lng: number }
) => {
  console.log({ from, to });
  return prisma.collectionRequest.findMany({
    where: {
      latitude: { gte: from.lat, lte: to.lat },
      longitude: { gte: from.lng, lte: to.lng },
    },
  });
};

export const getAllRequest = async () => {
  return prisma.collectionRequest.findMany({ where: { status: 'Pending' } });
};

export const DispatchRoute = async (requestIds: string[]) => {
  await prisma.collectionRequest.updateMany({
    where: { id: { in: requestIds } },
    data: { status: 'Dispatched' },
  });
  return prisma.routes.create({
    data: { status: 'Dispatched', requests: { connect: requestIds.map((id) => ({ id })) } },
  });
};

export const getDispatchedRoutes = async () => {
  return prisma.routes.findMany({ include: { _count: { select: { requests: true } } } });
};

export const getRoute = async (id: string) => {
  return prisma.routes.findUnique({ where: { id }, select: { requests: true } });
};
