/* eslint-disable react/prop-types */

export default function UploadVideoComponent({ handleChange, image }: any) {
  return (
    <div className='h-full w-full flex items-center justify-center'>
      <input
        type='file'
        accept={'video/*'}
        hidden
        id='imageUpload'
        onChange={(e) => handleChange(e.target.files)}
      />
      <label htmlFor='imageUpload' className='h-1/2 w-3/4 flex flex-col items-center'>
        <img src={image} className='w-1/3' />
        <div className='px-4 py-2 rounded-md cursor-pointer border border-black'>Upload</div>
      </label>
    </div>
  );
}
