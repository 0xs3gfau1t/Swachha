'use client';

import { getBillingStatus, getBillings, verifyToken } from '@/lib/serverActions/billing';
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
    <div className='flex flex-col justify-between items-center gap-4 w-full h-full bg-gray-50 px-2'>
      <h1 className='w-full font-mono font-semibold text-2xl h-16 border-b py-2 flex justify-center items-center'>
        Billing
      </h1>
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
      <div className='relative flex-grow w-full overflow-x-hidden'>
        <h1 className='m-auto font-semibold text-md py-2 mb-2'>Billing History</h1>

        <ul className='flex flex-col gap-2'>
          {pastBill.map((bill) => (
            <li className='flex flex-row justify-between items-center border-b bg-slate-200 rounded-md p-2'>
              <div className='flex flex-col shadow-sm'>
                <p className='font-semibold'>{bill.payer}</p>
                <p className='text-slate-800'>{bill.txId}</p>
                <p className='text-slate-700 font-normal'>{bill.createdAt.toDateString()}</p>
              </div>
              <div className=''>
                <FaRupeeSign className='aspect-square inline-block font-thin h-full mr-1' />
                {(bill.amount / 100).toFixed(2)}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
