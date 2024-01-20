'use server';

import prisma from '@/lib/prisma';

export async function getNotifications(userId: string) {
  const g = await prisma.notification.findMany({ where: { OR: [{ userId }, { userId: null }] } });
  return [...g, ...g, ...g, ...g];
}
