'use client';
import CountBox from '@/components/CountBox';
import { AiOutlineUser, AiOutlineCarryOut } from 'react-icons/ai';
import { CiRoute, CiMoneyBill } from 'react-icons/ci';

export default function AdminDashboard() {
  return (
    <div className='w-full h-full p-2 flex flex-col max-h-full'>
      <div className='h-8 relative'>
        <h2 className='text-2xl font-mono font-bold'>Dashboard</h2>
      </div>
      <div className='flex flex-row gap-2 justify-around col-span-full h-36 py-4'>
        <CountBox
          title='Users'
          count={20}
          Icon={AiOutlineUser}
          info={`Users count`}
          style={{
            background: 'linear-gradient(200deg, rgba(77,77,191,1) 0%, rgba(54,53,223,1) 69%)',
          }}
        />
        <CountBox
          title='Collection Requests'
          count={20}
          Icon={AiOutlineCarryOut}
          info={`Users count`}
          style={{
            background: 'linear-gradient(200deg, rgba(37,205,43,1) 0%, rgba(36,175,41,1) 69%)',
          }}
        />
        <CountBox
          title='Routes'
          count={20}
          Icon={CiRoute}
          info={`Users count`}
          style={{
            background: 'linear-gradient(200deg, rgba(237,167,145,1) 0%, rgba(245,128,90,1) 69%)',
          }}
        />
        <CountBox
          title='Unpaid bills'
          count={80}
          Icon={CiMoneyBill}
          info={`Comments count`}
          style={{
            background: 'linear-gradient(200deg, rgba(70,197,241,1) 0%, rgba(99,156,218,1) 69%)',
          }}
        />
      </div>
    </div>
  );
}
