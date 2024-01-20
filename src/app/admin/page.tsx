'use client';

import { API_URL } from '@/constants';
import { Button, Container, Grid, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { signIn } from 'next-auth/react';

export default function Admin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const router = useRouter();

  async function onSubmit() {
    try {
      const res = await signIn('login-user', { email, password, redirect: false });
      if (res?.ok) {
        router.push('/admin/dashboard');
      }
    } catch (e) {
      alert('Invalid creds');
    }
  }

  return (
    <Container
      sx={{ padding: 10, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
    >
      <Grid
        container
        gap={5}
        border={2}
        width={'50%'}
        borderRadius={'0.5rem'}
        paddingY={4}
        paddingX={10}
      >
        <Grid item xs={12}>
          <Typography variant='h3' textAlign={'center'} fontFamily={'monospace'}>
            Admin Login
          </Typography>
        </Grid>
        <Grid item xs={12} display={'flex'} gap={2} justifyContent={'space-between'}>
          <Typography textAlign={'left'}>Email</Typography>
          <input
            type='email'
            onChange={(e) => setEmail(e.target.value)}
            className='border-b border-black focus:outline-none'
          />
        </Grid>
        <Grid item xs={12} display={'flex'} gap={2} justifyContent={'space-between'}>
          <Typography textAlign={'left'}>Password</Typography>
          <input
            type='password'
            onChange={(e) => setPassword(e.target.value)}
            className='border-b border-black focus:outline-none'
          />
        </Grid>
        <Grid item xs={12} display='flex' justifyContent={'center'}>
          <Button onClick={onSubmit} variant='outlined'>
            Submit
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}
