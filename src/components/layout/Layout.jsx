import React, { useState } from 'react'
import Header from './Header';
import Image from 'next/image';
import {useRouter} from 'next/router'
import DeleteModal from "../modal/DeleteModal";


const Layout = ({ children }) => {
  
  const router = useRouter();


  return (
    <>
      <DeleteModal />
      <div className="w-full min-h-screen flex">
          <aside className='w-[7rem] flex flex-col h-screen fixed bg-[#FBCC04]'> 
          <Image
              className='w-32 md:w-40 cursor-pointer'
              src='/images/Logo.png'
              width='180'
              height='160'
              alt='Icon'
              onClick={() => router.push('/')}
            /> 
            <ul className='mt-16 font-bold'>
            <li className={`cursor-pointer p-3 flex flex-col text-center items-center gap-1 ${router.pathname == '/' && 'bg-[#fef2c0]'} `}  onClick={() => router.push('/')}>
            <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M21.5 11.4V4.6C21.5 3.1 20.86 2.5 19.27 2.5H15.23C13.64 2.5 13 3.1 13 4.6V11.4C13 12.9 13.64 13.5 15.23 13.5H19.27C20.86 13.5 21.5 12.9 21.5 11.4Z" fill="#100D00"/>
<path d="M11 13.6V20.4C11 21.9 10.36 22.5 8.77 22.5H4.73C3.14 22.5 2.5 21.9 2.5 20.4V13.6C2.5 12.1 3.14 11.5 4.73 11.5H8.77C10.36 11.5 11 12.1 11 13.6Z" fill="#100D00"/>
<path d="M21.5 20.4V17.6C21.5 16.1 20.86 15.5 19.27 15.5H15.23C13.64 15.5 13 16.1 13 17.6V20.4C13 21.9 13.64 22.5 15.23 22.5H19.27C20.86 22.5 21.5 21.9 21.5 20.4Z" fill="#100D00"/>
<path d="M11 7.4V4.6C11 3.1 10.36 2.5 8.77 2.5H4.73C3.14 2.5 2.5 3.1 2.5 4.6V7.4C2.5 8.9 3.14 9.5 4.73 9.5H8.77C10.36 9.5 11 8.9 11 7.4Z" fill="#100D00"/>
</svg>
               Dashboard </li>
    
              <li className={`cursor-pointer p-3 flex flex-col text-center items-center gap-1 ${router.pathname == '/Prestige-Customers' && 'bg-[#fef2c0]'} `}  onClick={() => router.push('/Prestige-Customers')}>
              <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16.19 2.5H7.81C4.17 2.5 2 4.67 2 8.31V16.69C2 20.33 4.17 22.5 7.81 22.5H16.19C19.83 22.5 22 20.33 22 16.69V8.31C22 4.67 19.83 2.5 16.19 2.5ZM9.97 15.4L7.72 17.65C7.57 17.8 7.38 17.87 7.19 17.87C7 17.87 6.8 17.8 6.66 17.65L5.91 16.9C5.61 16.61 5.61 16.13 5.91 15.84C6.2 15.55 6.67 15.55 6.97 15.84L7.19 16.06L8.91 14.34C9.2 14.05 9.67 14.05 9.97 14.34C10.26 14.63 10.26 15.11 9.97 15.4ZM9.97 8.4L7.72 10.65C7.57 10.8 7.38 10.87 7.19 10.87C7 10.87 6.8 10.8 6.66 10.65L5.91 9.9C5.61 9.61 5.61 9.13 5.91 8.84C6.2 8.55 6.67 8.55 6.97 8.84L7.19 9.06L8.91 7.34C9.2 7.05 9.67 7.05 9.97 7.34C10.26 7.63 10.26 8.11 9.97 8.4ZM17.56 17.12H12.31C11.9 17.12 11.56 16.78 11.56 16.37C11.56 15.96 11.9 15.62 12.31 15.62H17.56C17.98 15.62 18.31 15.96 18.31 16.37C18.31 16.78 17.98 17.12 17.56 17.12ZM17.56 10.12H12.31C11.9 10.12 11.56 9.78 11.56 9.37C11.56 8.96 11.9 8.62 12.31 8.62H17.56C17.98 8.62 18.31 8.96 18.31 9.37C18.31 9.78 17.98 10.12 17.56 10.12Z" fill="#100D00"/>
       </svg>
                Prestige customers </li>
              <li className={`cursor-pointer p-3 flex flex-col text-center items-center gap-1  ${router.pathname == '/recent-guests' && 'bg-[#fef2c0]'} `}  onClick={() => router.push('/recent-guests')}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21.0169 7.99175C21.4148 8.55833 20.9405 9.25 20.2482 9.25H3C2.44772 9.25 2 8.80228 2 8.25V6.42C2 3.98 3.98 2 6.42 2H8.74C10.37 2 10.88 2.53 11.53 3.4L12.93 5.26C13.24 5.67 13.28 5.72 13.86 5.72H16.65C18.4546 5.72 20.0516 6.61709 21.0169 7.99175Z" fill="#100D00"/>
                <path d="M20.9834 10.75C21.5343 10.75 21.9815 11.1957 21.9834 11.7466L22 16.6503C22 19.6003 19.6 22.0003 16.65 22.0003H7.35C4.4 22.0003 2 19.6003 2 16.6503V11.7503C2 11.198 2.44771 10.7503 2.99999 10.7503L20.9834 10.75Z" fill="#100D00"/>
                </svg>
                Guests </li>

              <li className={`cursor-pointer p-3 flex flex-col text-center items-center gap-1  
              ${router.pathname === '/admin/admin-users' ? 'bg-[#fef2c0]' : router.pathname == '/login-history' 
              ? 'bg-[#fef2c0]' : router.pathname == '/deleted-customers' &&  'bg-[#fef2c0]'} `} 
                onClick={() => router.push('/admin/admin-users')}>
                  <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.19 2.5H7.81C4.17 2.5 2 4.67 2 8.31V16.69C2 20.33 4.17 22.5 7.81 22.5H16.19C19.83 22.5 22 20.33 22 16.69V8.31C22 4.67 19.83 2.5 16.19 2.5ZM9.97 15.4L7.72 17.65C7.57 17.8 7.38 17.87 7.19 17.87C7 17.87 6.8 17.8 6.66 17.65L5.91 16.9C5.61 16.61 5.61 16.13 5.91 15.84C6.2 15.55 6.67 15.55 6.97 15.84L7.19 16.06L8.91 14.34C9.2 14.05 9.67 14.05 9.97 14.34C10.26 14.63 10.26 15.11 9.97 15.4ZM9.97 8.4L7.72 10.65C7.57 10.8 7.38 10.87 7.19 10.87C7 10.87 6.8 10.8 6.66 10.65L5.91 9.9C5.61 9.61 5.61 9.13 5.91 8.84C6.2 8.55 6.67 8.55 6.97 8.84L7.19 9.06L8.91 7.34C9.2 7.05 9.67 7.05 9.97 7.34C10.26 7.63 10.26 8.11 9.97 8.4ZM17.56 17.12H12.31C11.9 17.12 11.56 16.78 11.56 16.37C11.56 15.96 11.9 15.62 12.31 15.62H17.56C17.98 15.62 18.31 15.96 18.31 16.37C18.31 16.78 17.98 17.12 17.56 17.12ZM17.56 10.12H12.31C11.9 10.12 11.56 9.78 11.56 9.37C11.56 8.96 11.9 8.62 12.31 8.62H17.56C17.98 8.62 18.31 8.96 18.31 9.37C18.31 9.78 17.98 10.12 17.56 10.12Z" fill="#100D00"/>
                </svg>
                    Admins </li>
            </ul>
          </aside>
          <section className='grow ml-[7rem] overflow-hidden flex flex-col relative'>
          <Header />
        <div>
          {children}
        </div>
        </section>
       
      </div>
    </>
  )
}

export default Layout