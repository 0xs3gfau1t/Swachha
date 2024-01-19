'use client';

import BottomNavItem from '@/components/bottom-nav-item';
import { Stack } from '@mui/material';
import { AiOutlineHome, AiOutlineUser } from 'react-icons/ai';

const navItems = [
  {
    icon: <AiOutlineHome size={40} />,
    link: '/user',
  },
  {
    icon: <AiOutlineUser size={40} />,
    link: '/user/profile',
  },
];

export default function BottomNav() {
  return (
    <Stack
      direction={'row'}
      display={'flex'}
      justifyContent={'space-around'}
      borderTop={1}
      paddingTop={2}
      borderRadius={10}
    >
      {navItems.map((i) => (
        <BottomNavItem icon={i.icon} link={i.link} key={i.link} />
      ))}
    </Stack>
  );
}
