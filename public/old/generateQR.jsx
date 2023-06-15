import React from 'react'
import Image from "next/image";
import CustomerQRCode from '../components/CustomerQRCode.jsx';
import { useState } from 'react';

export default function generateQR() {

  const [isReady, setIsReady] = useState(true);

  return (
    <div className='w-screen h-screen flex justify-center items-center'>
      <div className='text-center'>

        <div className='grid-rows-3 text-center'>
          {!isReady && <>
          
          {/* <p className='text-lg mb-6'>Babatunde Fatai</p> */}
          {/* <Image
              className='mb-6 mt-6 text-center'
              src='/images/badgeTag.png'
              width='144'
              height='42'
              alt='Icon'
              
            />
          <CustomerQRCode /> */}

        <div className='pop-up'>
                
          <div className="flex justify-center items-center h-screen">
                <div className="flex flex-col justify-center items-center">
                <img
                    src='/images/checked.png'
                    alt="Image"
                    className=" h-auto mt-4"
                />
            

                <Image
                  className='mb-6 mt-6 text-center'
                  src='/images/badgeTag.png'
                  width='67'
                  height='19'
                  alt='Icon'
                  
                />
              <CustomerQRCode />

                    
                </div>
            </div>

            
        </div>



          </>}
       
       {isReady && <>

        <button className='bg-[#F5F5F5] px-5 py-3 rounded-3xl' onClick={()=>setIsReady(false)}>Generate QR Code</button>
       
       </>}
        </div>

      </div>
    </div>
  )
}

