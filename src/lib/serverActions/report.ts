'use server';
import prisma from '@/lib/prisma';
import { randomUUID } from 'crypto';

export async function reportLitteringServer(formData: FormData) {
  const video = formData.get('vid') as File;
  const fileName = '../../../public/videos/' + randomUUID();
  // TODO: Save file

  await prisma.report.create({
    data: {
      path: fileName,
      from: formData.get('from') as unknown as number,
      to: formData.get('to') as unknown as number,
    },
  });
}
