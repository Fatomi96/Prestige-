import React, { useEffect } from 'react'
import { useState } from 'react';
import { useRouter } from 'next/router';
// import QRScanner from '../components/QRScanner.jsx';


export default function scanResult() {

  const router = useRouter();
 

  return (<>
  
  <div className='pop-up'>
        
  <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col justify-center items-center">
        <p className="text-center">Scan QR code</p>
        <p className="text-center">Capture the QR code within the box to scan it.</p>
        <img
            src='/images/img_box.png'
            alt="Image"
            className=" h-auto mt-4"
         />
        {/* <QRScanner /> */}
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full my-4" onClick={() => router.push('/recent')}>
            Open Camera to Scan QR Code
        </button>
        {/* <input accept='image/*' id='icon-button-file' type='file' capture='environment'/> */}
            
        </div>
    </div>

     
   </div>
  
  </>)
}

