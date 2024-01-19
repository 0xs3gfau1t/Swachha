'use client';

import { Container, Link, Stack, Typography } from '@mui/material';
import { BsFillArrowRightCircleFill } from 'react-icons/bs';

const HomePage = () => {
  return (
    <Container>
      <Stack justifyContent={'center'} direction={'column'} gap={1}>
        <Typography variant='h2' textAlign={'center'} paddingY={5}>
          फोहोर मलाइ
        </Typography>
        <img src='/illustrations/garbage.gif' className='rounded-2xl' />
        <Typography variant='body2' paddingY={3}>
          Digitizing the complete waste management flow from collection to developing more efficient
          waste management habits by utilizing machine learning technologies. Transitioning to more
          echo friendly way of managing waste in developing countries like Nepal is hard and we aim
          to make it more seemless. Be it by reporting those who litter without remorse or by
          classifying waste according to degradation nature. Or be it by optimizing waste collection
          routines and routes rather than currently implemented timely collection.
        </Typography>
        <Link href={'/user'}>
          <Stack
            direction={'column'}
            display={'flex'}
            justifyContent={'center'}
            alignItems={'center'}
            gap={2}
          >
            <BsFillArrowRightCircleFill size={40} />
            <span>Get Started</span>
          </Stack>
        </Link>
      </Stack>
    </Container>
  );
};

export default HomePage;
