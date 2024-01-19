import AdminNav from '@/layouts/admin';
import { ReactNode } from 'react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminNav>{children}</AdminNav>;
}
