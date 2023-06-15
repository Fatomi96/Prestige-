import Image from 'next/image';
import React from 'react';

import noFiles from '../assets/images/Nodoc.png';

const NoFiles = () => {
  return (
    <div className='m-auto flex flex-col items-center justify-center pt-[10px] text-center md:w-3/12'>
      <Image src={noFiles} alt='noFiles' />

      <h3 className='mt-2 mb-1 text-base font-medium text-gray-900'>
        No User Found
      </h3>
    </div>
  );
};

export default NoFiles;
