'use server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../authOptions';

export async function verifyToken(token: string, amount: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return false;

    const response = await fetch('https://khalti.com/api/v2/payment/verify/', {
      method: 'post',
      headers: {
        Authorization: `Key ${process.env.KHALTI_PRIVATE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: Number(amount),
        token,
      }),
    });
    const data = await response.json();
    console.log(data);

    if (response.status !== 200) return false;

    await prisma.billing.create({
      data: {
        amount: Number(amount),
        user: { connect: { id: session.user.id } },
        txId: data.type.idx || 'N/A',
        payer: data.user.name || 'N/A',
      },
    });

    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

export async function getBillings(userId: string) {
  const g = await prisma.billing.findMany({ where: { userId } });
  return [...g, ...g, ...g, ...g, ...g];
}

export async function getBillingStatus(userId: string) {
  const latest = await prisma.billing.findFirst({
    orderBy: { createdAt: 'asc' },
    where: { userId },
  });
  if (!latest) return { latest: null, due: 10000 };
  return {
    latest,
    due: Math.ceil((new Date().getTime() - new Date(latest.createdAt).getTime()) / (1000 * 60)),
  };
}
