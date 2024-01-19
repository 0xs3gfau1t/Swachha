'use client';

import { API_URL } from '@/constants';
import { LoadingButton } from '@mui/lab';
import { Box, Button, Container, Input, Stack, Typography } from '@mui/material';
import Image from 'next/image';
import { useState } from 'react';

export default function RegisterNewUser() {
  const [submitting, setSubmitting] = useState(false);
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    homeNumber: '',
  });

  async function onSubmit() {
    setSubmitting(true);
    try {
      const r = await fetch(API_URL + '/auth/register', {
        method: 'POST',
        body: JSON.stringify(userDetails),
      });
      if (!r.ok) throw new Error();

      alert('User registered');
    } catch (e) {
      alert('Couldnt register: ');
    }

    setSubmitting(false);
  }

  function handleChange(e: any) {
    setUserDetails((stat) => {
      return { ...stat, [e.target.name]: e.target.value };
    });
  }

  return (
    <Container
      sx={{
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography variant='h3' textAlign={'center'} paddingY={5}>
        Register New User
      </Typography>
      <Box
        sx={{
          width: '15em',
          height: '15em',
          position: 'relative',
        }}
      >
        <Image src='/illustrations/add-user.svg' alt='add-user' fill />
      </Box>
      <Stack direction={'column'} gap={5}>
        <Stack direction={'row'} gap={5} alignItems={'center'}>
          <Typography>Name</Typography>
          <Input type='text' name='name' placeholder='Name of user' onChange={handleChange} />
        </Stack>
        <Stack direction={'row'} gap={5} alignItems={'center'}>
          <Typography>Email</Typography>
          <Input type='email' name='email' placeholder='Email' onChange={handleChange} />
        </Stack>
        <Stack direction={'row'} gap={5} alignItems={'center'}>
          <Typography>Phone Number</Typography>
          <Input
            type='text'
            name='phoneNumber'
            placeholder='Phone number'
            onChange={handleChange}
          />
        </Stack>
        <Stack direction={'row'} gap={5} alignItems={'center'}>
          <Typography>Home Number</Typography>
          <Input
            type='text'
            name='homeNumber'
            placeholder="User's home number"
            onChange={handleChange}
          />
        </Stack>
        {!submitting && (
          <Button variant='contained' onClick={onSubmit} sx={{ alignSelf: 'center' }}>
            Submit
          </Button>
        )}
        {submitting && (
          <LoadingButton loading={submitting} sx={{ padding: 2, alignSelf: 'center' }} />
        )}
      </Stack>
    </Container>
  );
}
