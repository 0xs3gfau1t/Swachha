'use client';
import CountBox from '@/components/CountBox';
import { dashboardReports } from '@/lib/serverActions/report';
import { useEffect, useState } from 'react';
import { AiOutlineUser, AiOutlineCarryOut } from 'react-icons/ai';
import { CiRoute, CiMoneyBill } from 'react-icons/ci';

export default function AdminDashboard() {
  const [reports, setReports] = useState<Awaited<ReturnType<typeof dashboardReports>>>({
    user_count: 0,
    request_count: 0,
    route_count: 0,
    billing_count: 0,
  });
  useEffect(() => {
    dashboardReports().then(setReports);
  }, []);

  return (
    <div className='w-full h-full p-2 flex flex-col max-h-full'>
      <div className='h-8 relative'>
        <h2 className='text-2xl font-mono font-bold'>Dashboard</h2>
      </div>
      <div className='flex flex-row gap-2 justify-around col-span-full h-36 py-4'>
        <CountBox
          title='Users'
          count={reports.user_count}
          Icon={AiOutlineUser}
          info={`Number of users`}
          style={{
            background: 'linear-gradient(200deg, rgba(77,77,191,1) 0%, rgba(54,53,223,1) 69%)',
          }}
        />
        <CountBox
          title='Collection Requests'
          count={reports.request_count}
          Icon={AiOutlineCarryOut}
          info={`Number of collection requests`}
          style={{
            background: 'linear-gradient(200deg, rgba(37,205,43,1) 0%, rgba(36,175,41,1) 69%)',
          }}
        />
        <CountBox
          title='Routes'
          count={reports.route_count}
          Icon={CiRoute}
          info={`Number of reports detected`}
          style={{
            background: 'linear-gradient(200deg, rgba(237,167,145,1) 0%, rgba(245,128,90,1) 69%)',
          }}
        />
        <CountBox
          title='Bills'
          count={reports.billing_count}
          Icon={CiMoneyBill}
          info={`Number of times bills was paid`}
          style={{
            background: 'linear-gradient(200deg, rgba(70,197,241,1) 0%, rgba(99,156,218,1) 69%)',
          }}
        />
      </div>
    </div>
  );
}
