import Link from 'next/link';

export default function BottomNavItem({ link, icon }: { link: string; icon: any }) {
  return (
    <Link href={link} className='flex flex-col items-center'>
      {icon}
    </Link>
  );
}
