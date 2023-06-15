import Image from 'next/image';
import { useRouter } from 'next/router';
import React from 'react';

import errorImg from '../../assets/images/error.png'; 

const Error = () => {
  const router = useRouter();
  return (
    <div className='m-auto mt-6 flex flex-col items-center justify-center text-center md:w-4/12'>
      <Image src={errorImg} alt='Error' />

      <h3 className='mt-2 mb-1 text-base font-medium text-gray-900'>
        No Customer found
      </h3>
      <p
        onClick={() => router.reload(window.location.pathname)}
        className='my-2 cursor-pointer font-mtnwork text-sm text-[#FCCC04] hover:underline'
      >
        Refresh page
      </p>
    </div>
  );
};

export default Error;
