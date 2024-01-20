'use client';

import { useState } from 'react';
import UploadVideoComponent from '@/components/UploadComponent';
import { AiOutlineCloudUpload, AiOutlineSync } from 'react-icons/ai';
import { GrClear } from 'react-icons/gr';
import { ML_URL } from '@/constants';

export default function Image() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imgStr, setImgStr] = useState<string>('');
  const [predicting, setPredicting] = useState(false);
  const [predicted, setPredicted] = useState('');

  const predict = () => {
    if (!imageFile) return;
    setPredicting(true);

    const vidForm = new FormData();
    vidForm.append('img', imgStr);
    fetch(`${ML_URL}/api/predict`, { method: 'POST', body: vidForm })
      .then(async (res) => {
        if (res.status == 200) {
          const data = await res.text();
          setPredicted(data);
          setPredicting(false);
        }
      })
      .finally(() => setPredicting(false));
  };

  return (
    <div className='flex flex-col justify-between items-center gap-4 w-full h-full bg-gray-50 px-2'>
      <h1 className='w-full font-mono font-semibold text-2xl h-16 border-b py-2 flex justify-center items-center'>
        Garbage Classification
      </h1>
      <div className='flex flex-row h-[calc(100%-4rem)] gap-2 justify-between w-full'>
        {!imageFile && (
          <UploadVideoComponent
            image='/illustrations/imageHolder.svg'
            handleChange={(f1) => {
              if (f1 && f1?.length) {
                setImageFile(f1[0]);

                let reader = new FileReader();
                reader.onload = (e) => setImgStr(e.target?.result as string);
                reader.readAsDataURL(f1[0]);
              }
            }}
            accept={'image/*'}
          />
        )}
        {imgStr && imageFile && (
          <div className='w-full h-full flex flex-col gap-2 justify-center items-center'>
            <img src={imgStr} className='rounded-md h-1/2 aspec-ratio' />
            <div className='flex gap-x-5 self-center shadow-md border border-black rounded-md px-2 py-1'>
              {!predicting ? (
                <AiOutlineCloudUpload size='2em' className='cursor-pointer' onClick={predict} />
              ) : (
                <AiOutlineSync size='2em' className='animate-spin' />
              )}
              <GrClear
                size='2em'
                onClick={() => {
                  setImageFile(null);
                  setImgStr('');
                }}
              />
            </div>

            {!!predicted && <span className='flex-grow'>{predicted}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
