'use client';

import { useSession } from 'next-auth/react';
import { CiSquareCheck } from 'react-icons/ci';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getNotifications } from '@/lib/serverActions/notification';

export default function Billing() {
  const [notifications, setNotifications] = useState<Awaited<ReturnType<typeof getNotifications>>>(
    []
  );

  const router = useRouter();
  const session = useSession();

  if (session.status === 'unauthenticated') router.push('/api/auth/signin');

  useEffect(() => {
    if (session.data) {
      getNotifications(session.data.user.id).then(setNotifications);
    }
  }, [session]);

  return (
    <div className='flex flex-col justify-between items-center gap-4 w-full h-full bg-gray-50 px-2'>
      <h1 className='w-full font-mono font-semibold text-2xl h-16 border-b py-2 flex justify-center items-center'>
        Notifications
      </h1>
      <div className='relative flex-grow w-full overflow-x-hidden'>
        <ul className='flex flex-col gap-2'>
          {notifications.map((notif) => (
            <li className='flex flex-row gap-4 items-center border-b bg-slate-200 rounded-md p-2'>
              <img
                src={notif.thumbnail}
                className='rounded-full h-10 aspect-square border border-black'
              />
              <div className='flex flex-col flex-grow shadow-sm'>
                <p className='font-semibold'>{notif.title}</p>
                <p className='text-slate-800'>{notif.body}</p>
                <p className='text-slate-700 font-normal'>{notif.createdAt.toDateString()}</p>
              </div>
              <CiSquareCheck
                size={30}
                className='cursor-pointer'
                onClick={() => {
                  setNotifications((o) => o.filter((n) => n.id !== notif.id));
                }}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
