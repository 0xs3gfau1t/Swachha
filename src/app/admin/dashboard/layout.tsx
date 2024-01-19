import AdminNav from '@/layouts/admin';
import { Stack } from '@mui/material';
import { ReactNode } from 'react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminNav>{children}</AdminNav>;
}
