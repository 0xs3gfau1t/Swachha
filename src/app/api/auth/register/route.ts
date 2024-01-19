import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { User } from '@prisma/client';
import { getTransporter } from '@/lib/mailer';
import path from 'path';
import fs from 'fs';
import { generateToken } from '@/lib/jwt';

export type RegisterResponse = {
  message: string;
  data: User | null;
};

export type RegisterRequest = {
  name: string;
  email: string;
  phoneNumber: string;
  homeNumber: string;
};

async function handler(req: NextRequest) {
  const creds: RegisterRequest = await req.json();

  console.log(creds);

  if (!creds.name || !creds.email || !creds.phoneNumber || !creds.homeNumber) {
    return NextResponse.json({ message: 'Missing credentials', data: null }, { status: 400 });
  }

  const user = await prisma.user.create({
    data: {
      name: creds.name,
      email: creds.email,
      phoneNumber: creds.phoneNumber,
      homeNumber: creds.homeNumber,
    },
  });
  if (!user) return NextResponse.json({ message: 'User not created', data: null }, { status: 500 });

  const expires = new Date();
  expires.setDate(expires.getDate() + 1);

  const token = await prisma.verificationToken.create({
    data: {
      identifier: user.id,
      token: generateToken({ id: user.id }, '1d'),
      expires: expires,
    },
  });
  console.log(token);

  const transporter = await getTransporter();

  const htmlFilePath = path.resolve(__dirname, '../../../../public/templates/register.html');
  const logoFilePath = path.resolve(__dirname, '../../../../public/assets/logo.png');

  const html = fs
    .readFileSync(htmlFilePath, 'utf8')
    .replace('{{URL}}', `${process.env.DOMAIN_URL}/register?token=${token.token}`);

  await transporter.sendMail({
    from: process.env.MAILER_ADD,
    to: creds.email,
    subject: `Fohor Malai: User Registration`,
    html,
    attachments: [
      {
        filename: 'logo.png',
        path: logoFilePath,
        cid: 'logo',
      },
    ],
  });

  return NextResponse.json({ message: 'User created', data: user }, { status: 201 });
}

export { handler as POST };
