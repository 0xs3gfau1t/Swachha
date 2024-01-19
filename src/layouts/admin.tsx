'use client';
import { Button, Stack, Typography } from '@mui/material';
import { signOut } from 'next-auth/react';
import { ReactNode } from 'react';
import NavComponent from '@/components/admin-nav';

const navEntries = [
  { name: 'Home', link: '/admin/dashboard' },
  { name: 'Reports', link: '/admin/dashboard/reports' },
  { name: 'Requests', link: '/admin/dashboard/requests' },
  { name: 'Register User', link: '/admin/dashboard/register' },
];

export default function AdminNav({ children }: { children: ReactNode }) {
  const renderSideNav = (
    <Stack direction={'row'}>
      <Stack direction={'column'} sx={{ width: '20em', height: '100vh' }} gap={1}>
        {navEntries.map((i) => (
          <NavComponent name={i.name} link={i.link} key={i.name} />
        ))}
      </Stack>
      <Stack width={'100%'}>{children}</Stack>
    </Stack>
  );

  const renderTopNav = (
    <Stack
      direction={'row'}
      display={'flex'}
      justifyContent={'space-between'}
      paddingX={10}
      alignItems={'center'}
      paddingY={3}
    >
      <Typography>Logo</Typography>
      <Button variant='outlined' color='warning' onClick={() => signOut()}>
        SignOut
      </Button>
    </Stack>
  );

  return (
    <Stack direction={'column'} gap={1}>
      {renderTopNav}
      {renderSideNav}
    </Stack>
  );
}
