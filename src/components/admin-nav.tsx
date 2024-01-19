'use client';
import { Button, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

export default function NavComponent({ name, link }: { name: string; link: string }) {
  return (
    <Button variant={'contained'} href={link}>
      <Stack direction={'column'} paddingX={3} paddingY={1}>
        {/* Icon */}
        <Typography textAlign={'center'}>{name}</Typography>
      </Stack>
    </Button>
  );
}
