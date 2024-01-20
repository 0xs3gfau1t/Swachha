import Link from 'next/link';

const SiteLogo = () => {
  return (
    <Link href='/' className='text-center flex flex-row items-center justify-center'>
      <img
        src={'/icon.png'}
        className='h-14 aspect-square object-contain'
        alt='Swachha'
        title='Swachha'
      />
      <p>Swachha</p>
    </Link>
  );
};

export default SiteLogo;
