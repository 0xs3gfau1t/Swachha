'use client';

import { MAX_REQUEST } from '@/constants';
import { getUserRequestSummary } from '@/lib/serverActions/collectionRequest';
import { Box, Button, Card, Stack, Typography } from '@mui/material';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Request() {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState({ total: 0, pending: 0, dispatched: 0, fulfilled: 0 });

  const router = useRouter();

  const session = useSession();

  function requestCollection() {
    setLoading(true);
    console.log('Requesting collection');
    setLoading(false);
  }

  useEffect(() => {
    if (session.status === 'unauthenticated') {
      router.push('/api/auth/signin');
      return;
    }
    if (session.data) getUserRequestSummary(session.data.user.id).then(setSummary);
  }, [session]);

  return (
    <Stack direction={'column'} gap={5} paddingY={5}>
      <Typography variant='h3'>Your analytics</Typography>
      <Stack direction={'row'} gap={2} justifyContent={'center'}>
        <Card sx={{ padding: 2, display: 'flex', borderRadius: '10px' }}>
          <Stack direction={'column'} alignItems={'center'}>
            <Typography fontSize={15}>Requests Made</Typography>
            <Typography fontSize={20}>{summary.total}</Typography>
          </Stack>
        </Card>

        <Card sx={{ padding: 1, display: 'flex', alignItems: 'center', borderRadius: '10px' }}>
          <Stack direction={'column'} alignItems={'center'}>
            <Typography fontSize={15}>Request Addressed</Typography>
            <Typography fontSize={20}>
              {summary.fulfilled} / {summary.total}
            </Typography>
          </Stack>
        </Card>
      </Stack>
      <Card sx={{ padding: 2, borderRadius: '10px' }}>
        <Stack direction={'column'} gap={2} alignItems={'center'}>
          <Typography variant='h5'>Recent Requests</Typography>
          <Image src={'/cal.png'} width={200} height={200} alt='calendar requests' />
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
                width: `${Math.ceil((summary.total / MAX_REQUEST) * 100)}%`,
                background: '#34eb80',
                height: '100%',
                left: 0,
                position: 'absolute',
                borderRadius: '10px',
              }}
            />
            <Typography position={'absolute'} zIndex={99}>
              {summary.total}/{MAX_REQUEST} requests
            </Typography>
          </Box>
        </Stack>
      </Card>
      <Button
        variant='contained'
        sx={{ alignSelf: 'center' }}
        color='primary'
        onClick={requestCollection}
        disabled={loading || !!summary.pending}
      >
        {!!summary.pending ? 'Request opened' : 'Request for collection'}
      </Button>
    </Stack>
  );
}
