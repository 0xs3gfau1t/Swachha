'use client';

import Link from 'next/link';

export default function NavComponent({ name, link }: { name: string; link: string }) {
  return (
    <button className='w-4/5 rounded-sm py-4 border-y-2'>
      <Link href={link}>{name}</Link>
    </button>
  );
}
