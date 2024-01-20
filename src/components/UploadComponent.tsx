/* eslint-disable react/prop-types */

import { ChangeEventHandler } from 'react';

export default function UploadVideoComponent({
  handleChange,
  image,
  accept,
}: {
  handleChange: (file: FileList | null) => void;
  image: string;
  accept: string;
}) {
  return (
    <div className='h-full w-full flex items-center justify-center'>
      <input
        type='file'
        accept={accept}
        hidden
        id='imageUpload'
        onChange={(e) => handleChange(e.target.files)}
      />
      <label htmlFor='imageUpload' className='h-1/2 w-3/4 flex flex-col items-center'>
        <img src={image} className={accept.includes('image') ? 'w-full' : 'w-1/3'} />
        <div className='px-4 py-2 rounded-md cursor-pointer border border-black'>Upload</div>
      </label>
    </div>
  );
}
