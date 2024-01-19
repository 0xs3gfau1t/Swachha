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
      signIn("register-")
      if (res?.ok) {
        router.push('/admin/dashboard');
      }
    } catch (e) {
      alert('Invalid creds');
    }
  }

  return (
    <Container sx={{ padding: 10 }}>
      <Grid container gap={5}>
        <Grid item xs={12}>
          <Typography variant='h3' textAlign={'center'}>
            Admin Login
          </Typography>
        </Grid>
        <Grid item xs={12} display={'flex'} gap={2} justifyContent={'center'}>
          <Typography textAlign={'left'}>Email</Typography>
          <input type='email' onChange={(e) => setEmail(e.target.value)} />
        </Grid>
        <Grid item xs={12} display={'flex'} gap={2} justifyContent={'center'}>
          <Typography textAlign={'left'}>Password</Typography>
          <input type='password' onChange={(e) => setPassword(e.target.value)} />
        </Grid>
        <Grid item xs={12} display='flex' justifyContent={'center'}>
          <Button onClick={onSubmit} variant='contained'>
            Submit
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}
