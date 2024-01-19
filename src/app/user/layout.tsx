import BottomNav from '@/layouts/bottomnav';
import { Container, Stack } from '@mui/material';
import { ReactNode } from 'react';

export default function UserLayout({ children }: { children: ReactNode }) {
  return (
    <Container sx={{ height: '95vh' }}>
      <Stack direction={'column'} justifyContent={'space-between'} display={'flex'} height={'100%'}>
        {children}
        <BottomNav />
      </Stack>
    </Container>
  );
}
