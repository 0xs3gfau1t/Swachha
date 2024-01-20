'use client';
import { signOut } from 'next-auth/react';
import { ReactNode } from 'react';
import NavComponent from '@/components/admin-nav';
import SiteLogo from '@/components/SiteLogo';

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
          <SiteLogo />
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
