import Link from 'next/link';

const SiteLogo = () => {
  return (
    <Link href='/' className='text-center flex flex-row items-center justify-center'>
      <img
        src={'/icon.png'}
        className='h-14 aspect-square object-contain'
        alt='Fohor Malai'
        title='Fohor Malai'
      />
      <p>Fohor Malai</p>
    </Link>
  );
};

export default SiteLogo;
