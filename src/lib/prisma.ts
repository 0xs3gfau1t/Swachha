import { PrismaClient } from '@prisma/client';

const prismaGlobal = global as typeof global & {
  db?: PrismaClient;
};

const db: PrismaClient =
  prismaGlobal.db ||
  new PrismaClient({
    log: ['info'],
  });

if (process.env.NODE_ENV !== 'production') {
  prismaGlobal.db = db;
}

export default db;
