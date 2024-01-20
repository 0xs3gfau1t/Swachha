'use server';

import prisma from '@/lib/prisma';

export async function getNotifications(userId: string) {
  return prisma.notification.findMany({ where: { OR: [{ userId }, { userId: null }] } });
}
