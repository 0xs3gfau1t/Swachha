'use client';

import BottomNav from '@/layouts/bottomnav';
import { Container, Stack } from '@mui/material';
import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

export default function UserLayout({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <Container sx={{ height: '95vh' }}>
        <Stack
          direction={'column'}
          justifyContent={'space-between'}
          display={'flex'}
          height={'100%'}
        >
          {children}
          <BottomNav />
        </Stack>
      </Container>
    </SessionProvider>
  );
}
