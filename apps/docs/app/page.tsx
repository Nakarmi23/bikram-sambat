import { buttonVariants } from '@/components/ui/button';
import { page_routes } from '@/lib/routes-config';
import { MoveUpRightIcon, TerminalSquareIcon } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className='flex sm:min-h-[91vh] min-h-[88vh] flex-col items-center justify-center text-center px-2 py-8'>
      <Link
        href='https://github.com/Nakarmi23/bikram-sambat/tree/main/packages/react/bs-ad-calendar'
        target='_blank'
        className='mb-5 sm:text-lg flex items-center gap-2 underline underline-offset-4'>
        Follow along on GitHub{' '}
        <MoveUpRightIcon className='w-4 h-4 font-extrabold' />
      </Link>
      <h1 className='text-3xl font-bold mb-4 sm:text-7xl'>
        The Headless Bikram Sambat Calendar Solution.
      </h1>
      <p className='mb-8 sm:text-xl max-w-[800px] text-muted-foreground'>
        Easily integrate a fully customizable, accessible calendar component
        with support for both Bikram Sambat and Gregorian dates.
      </p>
      <div className='flex flex-row items-center gap-5'>
        <Link
          href={`/docs${page_routes[0].href}`}
          className={buttonVariants({ className: 'px-6', size: 'lg' })}>
          Get Stared
        </Link>
      </div>
      <span className='flex flex-row items-start sm:gap-2 gap-0.5 text-muted-foreground text-md mt-7 -mb-12 max-[800px]:mb-12 font-code text-base font-medium'>
        <TerminalSquareIcon className='w-5 h-5 mr-1 mt-0.5' />
        {'npm @nakarmi23/bikram-sambat @nakarmi23/react-bs-ad-calendar'}
      </span>
    </div>
  );
}
