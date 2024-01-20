'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import { FaRegTrashAlt } from 'react-icons/fa';
import { CiWallet } from 'react-icons/ci';
import { AiOutlineHome, AiOutlineUser } from 'react-icons/ai';
import BottomNavItem from '@/components/bottom-nav-item';

const navItems = [
  {
    icon: <AiOutlineHome size={40} />,
    link: '/user',
  },
  {
    icon: <CiWallet size={40} />,
    link: '/user/billing',
  },
  {
    icon: <FaRegTrashAlt size={40} />,
    link: '/user/dustbins',
  },
  {
    icon: <AiOutlineUser size={40} />,
    link: '/user/profile',
  },
];

export default function UserLayout({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <div className='flex flex-col w-screen h-screen'>
        <div className='h-[calc(100%-5rem)]'>{children}</div>
        <div className='flex flex-row h-20 justify-around items-center border'>
          {navItems.map((i) => {
            return <BottomNavItem icon={i.icon} link={i.link} key={i.link} />;
          })}
        </div>
      </div>
    </SessionProvider>
  );
}
