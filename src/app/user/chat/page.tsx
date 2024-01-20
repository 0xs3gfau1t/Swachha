'use client';

import Message from '@/components/MsgComponent';
import { useRouter } from 'next/navigation';
import { AiFillBackward, AiOutlineSearch, AiOutlineSend } from 'react-icons/ai';
import { useEffect, useRef, useState } from 'react';
import { askBot } from '@/lib/serverActions/bot';
import { BsDot } from 'react-icons/bs';

export default function Chat() {
  const router = useRouter();
  const [messages, setMessages] = useState([
    { content: 'Hello, how can I help you today?', me: false },
  ]);
  const [asking, setAsking] = useState(false);
  const [qsn, setQsn] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  function handleSubmit() {
    setAsking(true);

    setMessages((msg) => [...msg, { content: qsn, me: true }]);

    askBot(qsn)
      .then((r) => {
        console.log(r);
        setQsn('');
        setMessages((msg) => [
          ...msg,
          ...r.map((i: { text: string }) => ({ content: i.text, me: false })),
        ]);
      })
      .catch(() => {
        alert("Couldn't ask ");
      })
      .finally(() => setAsking(false));
  }
  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, [messages]);

  return (
    <div className='flex flex-col justify-between items-center gap-4 w-full h-full bg-gray-50 px-2 p-2'>
      <div className='w-full h-16 py-2 flex flex-row justify-between items-center'>
        <AiFillBackward onClick={() => router.back()} size={32} />
        <h2 className='text-2xl font-extrabold'>Rasa Chat Bot</h2>
        <AiOutlineSearch size={32} />
      </div>
      <div className='w-full gap-5 flex flex-col flex-grow h-[calc(100%-4rem)] overflow-scroll'>
        <div
          className='flex flex-col gap-2 w-full px-5 flex-grow h-[calc(100%-3rem)] overflow-scroll'
          ref={ref}
        >
          {messages.map((i, idx) => (
            <Message key={idx} content={i.content} me={i.me} />
          ))}
        </div>
        <div className='flex justify-between h-12 bg-inherit rounded-lg gap-2 px-3 items-center'>
          <input
            placeholder='Type Message'
            className='w-full px-3 h-full focus:outline-none bg-slate-200 rounded-lg'
            value={qsn}
            onChange={(e) => setQsn(e.target.value)}
            onKeyUp={(e) => {
              e.key === 'Enter' && handleSubmit();
            }}
          />
          {!asking && <AiOutlineSend size={30} onClick={handleSubmit} />}
          {!!asking && <BsDot size={30} />}
        </div>
      </div>
    </div>
  );
}
