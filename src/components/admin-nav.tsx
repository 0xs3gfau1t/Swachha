'use client';

export default function NavComponent({ name, link }: { name: string; link: string }) {
  return (
    <button className='w-4/5 rounded-sm py-2 border border-slate-200 shadow-sm hover:shadow-lg'>
      <a href={link}>{name}</a>
    </button>
  );
}
