'use client';
import '@/app/global.css';
import { getProfile } from '@/lib/serverActions/profile';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Profile() {
  const session = useSession();
  const router = useRouter();

  const [profile, setProfile] = useState<Awaited<ReturnType<typeof getProfile>>>();

  useEffect(() => {
    if (session.status == 'authenticated') getProfile(session.data.user.id).then(setProfile);
    else if (session.status == 'unauthenticated') router.push('/api/auth/signin');
  }, [session]);

  if (!profile) return <div>Loading...</div>;

  return (
    <div className='flex flex-col justify-between items-center gap-4 w-full h-full bg-gray-50 px-2'>
      <h1 className='w-full font-mono font-semibold text-2xl h-16 border-b py-2 flex justify-center items-center'>
        Profile
      </h1>
      <div className='flex flex-col h-[calc(100%-4rem)] gap-2 justify-around items-center w-full py-4'>
        <img
          src='illustrations/add-user.svg'
          className='rounded-full overflow-hidden border border-slate-400 w-1/3'
        />
        <div className='flex flex-col w-full'>
          <span>Full Name</span>
          <input
            type='text'
            value={profile.name || ''}
            className='bg-gray-300 border border-slate-400 rounded-md p-2 focus:outline-none'
          />
        </div>
        <div className='flex flex-col w-full'>
          <span>House Number</span>
          <input
            type='text'
            value={profile.homeNumber}
            className='bg-gray-300 border border-slate-400 rounded-md p-2 focus:outline-none'
          />
        </div>
        <div className='flex flex-col w-full'>
          <span>Email</span>
          <input
            type='email'
            value={profile.email || ''}
            className='bg-gray-300 border border-slate-400 rounded-md p-2 focus:outline-none'
          />
        </div>
        <button className='ml-auto cursor-pointer border border-slate-400 rounded-md p-2'>
          Change Password
        </button>
        <button className='ml-auto cursor-pointer border border-slate-400 rounded-md p-2'>
          Save
        </button>
      </div>
    </div>
  );
}
