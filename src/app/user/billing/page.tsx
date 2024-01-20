'use client';

import { getBillingStatus, getBillings, verifyToken } from '@/lib/serverActions/billing';
import { Card, Stack, Typography } from '@mui/material';
import KhaltiCheckout from 'khalti-checkout-web';
import { FaRupeeSign } from 'react-icons/fa';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Billing() {
  const [status, setStatus] = useState<Awaited<ReturnType<typeof getBillingStatus>>>({
    due: 0,
    latest: null,
  });
  const [pastBill, setPastBill] = useState<Awaited<ReturnType<typeof getBillings>>>([]);

  const router = useRouter();
  const session = useSession();

  let config = {
    publicKey: 'test_public_key_dc01532ce7554fa89770af2b5b4af531',
    productIdentity: session.data?.user.id || '1',
    productName: 'Fohor Bill',
    productUrl: 'https://localhost:8000/mycard',
    eventHandler: {
      async onSuccess(payload: { amount: string; token: string }) {
        console.log('Success', payload);
        const res = await verifyToken(payload.token, payload.amount);
        console.log(res);
      },
      onError() { },
      onClose() { },
    },
  };

  if (session.status === 'unauthenticated') router.push('/api/auth/signin');

  useEffect(() => {
    if (session.data) {
      getBillingStatus(session.data.user.id).then(setStatus);
      getBillings(session.data.user.id).then(setPastBill);
    }
  }, [session]);

  return (
    <div className='flex flex-col justify-between items-center gap-4 h-full bg-gray-50 py-2'>
      <h1 className='w-full font-semibold text-4xl'>Billing</h1>
      <div className='flex flex-row gap-2 justify-between w-full'>
        <div className='flex-grow p-6 border border-gray-200 rounded-lg shadow flex flex-col justify-around gap-2 text-slate-800 font-semibold'>
          <span className='block text-2xl text-slate-800'>Due Bill</span>
          <span className='block text-xl font-normal'>
            <FaRupeeSign className='aspect-square inline-block h-full mr-2' />
            {(status.due / 100).toFixed(2)}
          </span>
          {status.due ? (
            <button
              className='block text-sm bg-[#5C2D91] cursor-pointer text-white rounded-md p-2'
              onClick={() => {
                let checkout = new KhaltiCheckout(config);
                checkout.show({ amount: status.due });
              }}
            >
              Pay with khalti
            </button>
          ) : (
            <span className='block text-sm font-normal opacity-0'>.</span>
          )}
        </div>
        <div className='flex-grow p-6 border border-gray-200 rounded-lg shadow flex flex-col justify-around gap-2 text-slate-800 font-semibold'>
          <span className='block text-2xl text-slate-800'>Last Bill</span>
          <span className='block text-xl font-normal'>
            <FaRupeeSign className='aspect-square inline-block h-full mr-2' />
            {((status.latest?.amount || 0) / 100).toFixed(2)}
          </span>
          <span className='block text-sm font-normal'>
            {status.latest ? new Date(status.latest.createdAt).toDateString() : 'N/A'}
          </span>
        </div>
      </div>
      <div className='relative flex-grow w-full overflow-x-auto shadow-md sm:rounded-t-sm'>
        <h1 className='m-auto font-semibold text-md'>Billing History</h1>
        <table className='w-full text-sm text-left rtl:text-right'>
          <thead className='text-xs text-gray-700 uppercase'>
            <tr>
              <th scope='col' className='px-6 py-3'>
                Payed At
              </th>
              <th scope='col' className='px-6 py-3'>
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {pastBill.map((bill) => (
              <tr className='bg-white border-b hover:bg-gray-50' key={bill.id}>
                <th scope='row' className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap'>
                  {bill.createdAt.toISOString()}
                </th>
                <td className='px-6 py-4'>
                  <FaRupeeSign className='aspect-square inline-block h-full mr-2 font-thin size-4' />
                  {(bill.amount / 100).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
