'use server';

import { BOT_API_URL } from '@/constants';

export async function askBot(question: string) {
  return await fetch(BOT_API_URL, {
    method: 'POST',
    body: JSON.stringify({ message: question }),
  })
    .then((r) => r.json())
    .then((r) => r)
    .catch((e) => {
      console.error('Bot error: ', e);
    });
}
