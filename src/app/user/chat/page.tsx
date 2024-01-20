'use client';

import Message from '@/components/MsgComponent';
import { useRouter } from 'next/navigation';
import { AiFillBackward, AiOutlineSearch, AiOutlineSend } from 'react-icons/ai';
import { useState } from 'react';
import { askBot } from '@/lib/serverActions/bot';
import { BsDot } from 'react-icons/bs';

export default function Chat() {
  const router = useRouter();
  const [messages, setMessages] = useState([
    { content: 'Hello, how can I help you today?', me: false },
  ]);
  const [asking, setAsking] = useState(false);
  const [qsn, setQsn] = useState('');

  function handleSubmit() {
    setAsking(true);

    setMessages((msg) => [...msg, { content: qsn, me: true }]);
    setQsn('');

    askBot(qsn)
      .then((r) => {
        console.log(r);
        setMessages((msg) => [...msg, ...r.map((i: any) => ({ content: i.text, me: false }))]);
      })
      .catch(() => {
        alert("Couldn't ask ");
      })
      .finally(() => setAsking(false));
  }

  return (
    <div className='flex flex-col justify-between items-center gap-4 w-full h-full bg-gray-50 px-2 p-2'>
      <div className='flex flex-row justify-between w-full'>
        <AiFillBackward onClick={() => router.back()} size={32} />
        <h2 className='text-2xl font-extrabold'>Rasa Chat Bot</h2>
        <AiOutlineSearch size={32} />
      </div>
      <div className='w-full gap-5 flex flex-col'>
        <div className='flex flex-col gap-2 w-full px-5'>
          {messages.map((i) => (
            <Message content={i.content} me={i.me} key={i.content} />
          ))}
        </div>
        <div className='flex justify-between h-12 bg-inherit rounded-lg gap-2 px-3 items-center'>
          <input
            placeholder='Type Message'
            className='w-full px-3 h-full bg-slate-200 rounded-lg'
            onChange={(e) => setQsn(e.target.value)}
          />
          {!asking && <AiOutlineSend size={30} onClick={handleSubmit} />}
          {!!asking && <BsDot size={30} />}
        </div>
      </div>
    </div>
  );
}
