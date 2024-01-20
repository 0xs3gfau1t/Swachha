'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import { CiRoute, CiBellOn, CiChat1, CiTrash, CiUser, CiWallet, CiImageOn } from 'react-icons/ci';
import BottomNavItem from '@/components/bottom-nav-item';

const navItems = [
  {
    icon: <CiRoute size={30} />,
    link: '/user/collection',
  },
  {
    icon: <CiWallet size={30} />,
    link: '/user/billing',
  },
  {
    icon: <CiChat1 size={30} />,
    link: '/user/chat',
  },
  {
    icon: <CiUser size={30} />,
    link: '/user/',
  },
  {
    icon: <CiBellOn size={30} />,
    link: '/user/notifications',
  },
  {
    icon: <CiImageOn size={30} />,
    link: '/user/classification',
  },
  {
    icon: <CiTrash size={30} />,
    link: '/user/dustbins',
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
