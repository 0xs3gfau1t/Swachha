'use client';
import { signOut } from 'next-auth/react';
import { ReactNode } from 'react';
import NavComponent from '@/components/admin-nav';

const navEntries = [
  { name: 'Home', link: '/admin/dashboard' },
  { name: 'Reports', link: '/admin/dashboard/reports' },
  { name: 'Requests', link: '/admin/dashboard/requests' },
  { name: 'Register User', link: '/admin/dashboard/register' },
  { name: 'Video Demo', link: '/admin/dashboard/video' },
];

export default function AdminNav({ children }: { children: ReactNode }) {
  return (
    <div className='flex flex-col w-screen h-screen'>
      <div className='w-full flex flex-row h-20 items-center border-b-2 px-4'>
        <h1 className='h-full flex flex-col items-center justify-around'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='w-6 h-6'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0'
            />
          </svg>
          <span className='font-semibold'>Fohor Malai</span>
        </h1>
        <button
          className='ml-auto border border-black px-4 py-2 rounded-md'
          onClick={() => signOut()}
        >
          SignOut
        </button>
      </div>
      <div className='w-full h-[calc(100%-5rem)] flex flex-row'>
        <div className='w-40 h-full flex flex-col items-center justify-center border-r-2'>
          {navEntries.map((i) => (
            <NavComponent name={i.name} link={i.link} key={i.name} />
          ))}
        </div>
        <div className='w-[calc(100%-10rem)] h-full p-4 overflow-hidden'>{children}</div>
      </div>
    </div>
  );
}
