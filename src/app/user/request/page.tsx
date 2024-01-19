'use client';

import { lastRequests } from '@/_mock/user/lastrequests';
import { MAX_REQUEST } from '@/constants';
import { Box, Button, Card, Stack, Typography } from '@mui/material';
import { useState } from 'react';

export default function Request() {
  const requests = lastRequests;
  const [loading, setLoading] = useState(false);
  function requestCollection() {
    setLoading(true);
    console.log('Requesting collection');
    setLoading(false);
  }

  return (
    <Stack direction={'column'} gap={5} paddingY={5}>
      <Typography variant='h3'>Your analytics</Typography>
      <Stack direction={'row'} gap={2} justifyContent={'center'}>
        <Card sx={{ padding: 2, display: 'flex', borderRadius: '10px' }}>
          <Stack direction={'column'} alignItems={'center'}>
            <Typography fontSize={15}>Requests Made</Typography>
            <Typography fontSize={20}>{requests.length}</Typography>
          </Stack>
        </Card>

        <Card sx={{ padding: 1, display: 'flex', alignItems: 'center', borderRadius: '10px' }}>
          <Stack direction={'column'} alignItems={'center'}>
            <Typography fontSize={15}>Request Addressed</Typography>
            <Typography fontSize={20}>
              {requests.reduce((prev, current) => {
                if (current.completedAt) prev++;
                return prev;
              }, 0)}{' '}
              / {requests.length}
            </Typography>
          </Stack>
        </Card>
      </Stack>
      <Card sx={{ padding: 1, borderRadius: '10px' }}>
        <Stack direction={'column'} gap={2} alignItems={'center'}>
          <Typography variant='h5'>Recent Requests</Typography>
          {/* TODO: Include calendar*/}
        </Stack>
      </Card>
      <Card sx={{ padding: 2, borderRadius: '10px' }}>
        <Stack direction={'column'} justifyContent={'center'} alignItems={'center'} gap={2}>
          <Typography variant='h5'>You have used</Typography>

          <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '2em',
              position: 'relative',
            }}
          >
            <Box
              sx={{
                width: `${Math.ceil((requests.length / MAX_REQUEST) * 100)}%`,
                background: '#34eb80',
                height: '100%',
                left: 0,
                position: 'absolute',
                borderRadius: '10px',
              }}
            />
            <Typography position={'absolute'} zIndex={99}>
              {requests.length}/{MAX_REQUEST} requests
            </Typography>
          </Box>
        </Stack>
      </Card>

      <Button
        variant='contained'
        sx={{ alignSelf: 'center' }}
        onClick={requestCollection}
        disabled={loading}
      >
        Request for collection
      </Button>
    </Stack>
  );
}
