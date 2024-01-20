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
    include: { Route: { include: { CollectionRequest: true } } },
    orderBy: { createdAt: 'desc' },
  });
  const dispatchedRoute = requests.find((r) => r.Route?.status == 'Dispatched')?.Route || undefined;
  const total = requests.length;
  const pending = requests.filter((r) => r.status === 'Pending').length;
  const dispatched = requests.filter((r) => r.status === 'Dispatched').length;
  const fulfilled = requests.filter((r) => r.status === 'Fulfilled').length;
  console.log(requests);
  return { total, pending, dispatched, fulfilled, requests };
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
  const route = await prisma.routes.create({
    data: { status: 'Dispatched' },
  });
  await prisma.collectionRequest.updateMany({
    where: { id: { in: requestIds } },
    data: { status: 'Dispatched', routesId: { set: route.id } },
  });
  return route;
};

export const getDispatchedRoutes = async () => {
  return prisma.routes.findMany({
    select: {
      CollectionRequest: true,
      createdAt: true,
      id: true,
      status: true,
    },
  });
};

export const getRoute = async (id: string) => {
  return prisma.routes.findUnique({ where: { id }, select: { CollectionRequest: true } });
};
