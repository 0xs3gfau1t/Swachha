'use server';
import prisma from '@/lib/prisma';
import { randomUUID } from 'crypto';
import fs from 'node:fs/promises';

export async function reportLitteringServer(formData: FormData) {
  const video = formData.get('vid') as File;
  const fileName = '/videos/' + randomUUID();

  await fs.appendFile('public' + fileName, Buffer.from(await video.arrayBuffer()));

  await prisma.report.create({
    data: {
      path: fileName,
      from: parseInt(formData.get('from') as unknown as string),
      to: parseInt(formData.get('to') as unknown as string),
    },
  });
}

export async function fetchReports() {
  return await prisma.report.findMany({});
}

export async function dashboardReports() {
  const user_count = await prisma.user.count();
  const request_count = await prisma.collectionRequest.count();
  const route_count = await prisma.routes.count();
  const billing_count = await prisma.billing.count();

  return {
    user_count,
    request_count,
    route_count,
    billing_count,
  };
}
