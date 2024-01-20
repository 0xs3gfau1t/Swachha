'use client';
import '@/app/global.css';
import { useEffect } from 'react';

export default function Profile() {
  useEffect(() => { }, []);

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
          <span>Fulll Name</span>
          <input
            type='text'
            className='bg-gray-300 border border-slate-400 rounded-md p-2 focus:outline-none'
          />
        </div>
        <div className='flex flex-col w-full'>
          <span>House Number</span>
          <input
            type='text'
            className='bg-gray-300 border border-slate-400 rounded-md p-2 focus:outline-none'
          />
        </div>
        <div className='flex flex-col w-full'>
          <span>Email</span>
          <input
            type='email'
            className='bg-gray-300 border border-slate-400 rounded-md p-2 focus:outline-none'
          />
        </div>
        <div className='flex flex-col w-full'>
          <span>Password</span>
          <input
            type='text'
            className='bg-gray-300 border border-slate-400 rounded-md p-2 focus:outline-none'
          />
        </div>
        <button className='cursor-pointer border border-slate-400 rounded-md p-2'>Save</button>
      </div>
    </div>
  );
}
