import Link from 'next/link';

const SiteLogo = () => {
  return (
    <Link href='/' className='text-center'>
      <img src={'/public/assets/bin.png'} className='w-44' alt='Fohor Malai' title='Fohor Malai' />
      <p>Fohor Malai</p>
    </Link>
  );
};

export default SiteLogo;
