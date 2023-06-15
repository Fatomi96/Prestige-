import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import SearchComponent from '../SearchComponent';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import axios from "axios"

export default function Header() {
  const router = useRouter();
  const userState = useSelector((state) => state.auth.user);
  const [userDetails, setUserDetails] = useState();
  const [logOutPop, setLogOutPop] = useState(false);
  // console.log({userDetails})

  useEffect(() => {
    setUserDetails(userState?.data?.user);
  }, [userDetails]);
  // const getAcronym = (fname, lname) => {
  //   if (fname && lname) {
  //     return fname.slice(0, 1) + lname.slice(0, 1);
  //   }
  //   else {
  //     return 'NA';
  //   }
  // }

  const handleLogout = async () => {

    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    }
    const response = await axios
      .post("/api/auth/logout", { }, headers)
      .catch((error) => {
      })
    if (response) {
      const { success, data } = response.data
      console.log({ data })
      if (success){
        setLogOutPop(false)
        router.push("/auth/login")
      }
    }
  };


  return (
    <>
    {logOutPop && <div className="fixed p-4 w-full h-screen grid place-items-center bg-black/50 z-50">
      <article className='rounded-xl w-full flex flex-col justify-center gap-5 text-center max-w-[18rem] bg-white p-10'> 
        <div className='mx-auto w-[40px] uppercase h-[40px] bg-[#507B96] flex items-center justify-center text-white rounded-[10px] font-bold cursor-pointer z-50'>
          {userDetails?.username && userDetails?.username.slice(0, 2)}
        </div>
            <p className='font-bold'>{userDetails?.fname} {userDetails?.lname}</p>
            <button onClick={handleLogout} className='bg-[#ED213A] p-3 rounded-lg text-white'>
              Log out
            </button>
            <button onClick={()=> setLogOutPop(false)} className='bg-[#F5F5F5] p-3 rounded-lg'>
              Cancel
            </button>
      </article>
    </div> }
      <header className="w-full bg-[#FFFFFF] fixed border-b lg:block hidden z-40">
        <div className='flex items-center justify-between pr-10 md:flex h-[72px] relative'>
          <div>
            <Image
              className='w-32 md:w-40 cursor-pointer'
              src='/images/Logo.png'
              width='180'
              height='160'
              alt='Icon'
              onClick={() => router.push('/')}
            />
          </div>
          <div className=''>
            <SearchComponent />
          </div>
          <div className='flex justify-between items-center'>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 5.72363V8.28517" stroke="#ADA7A7" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" />
              <path d="M10.0158 2.30762C7.18499 2.30762 4.89268 4.59992 4.89268 7.43069V9.04608C4.89268 9.56916 4.6773 10.3538 4.40806 10.7999L3.43114 12.4307C2.83114 13.4384 3.24653 14.5615 4.35422 14.9307C8.03114 16.1538 12.0081 16.1538 15.685 14.9307C16.7234 14.5845 17.1696 13.3692 16.6081 12.4307L15.6311 10.7999C15.3619 10.3538 15.1465 9.56146 15.1465 9.04608V7.43069C15.1388 4.61531 12.8311 2.30762 10.0158 2.30762Z" stroke="#ADA7A7" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" />
              <path d="M12.5616 15.2461C12.5616 16.6538 11.4077 17.8076 10 17.8076C9.30001 17.8076 8.65386 17.5153 8.19232 17.0538C7.73078 16.5922 7.43848 15.9461 7.43848 15.2461" stroke="#ADA7A7" strokeWidth="1.5" strokeMiterlimit="10" />
            </svg>
            <div className='ml-4 text-[14px]'>{userDetails?.fname} {userDetails?.lname} </div>
            <div onClick={()=> setLogOutPop(true)} className='ml-4  w-[40px] uppercase h-[40px] bg-[#507B96] flex items-center justify-center text-white rounded-[10px] font-bold cursor-pointer z-50'>
              {userDetails?.username && userDetails?.username.slice(0, 2)}
            </div>
          </div>
        </div>

        {/* Dialogue */}
        {/* {openPopup && <ProfileDialogue user={user} openPopup={openPopup} setOpenPopup={setOpenPopup} />} */}
      </header>


      {/* MOBILE HEADER */}
      <header className='lg:hidden mt-10'>
        <div className='flex items-center justify-between mx-5 relative'>
          {/* <div>{userDetails.fname} {userDetails.lname} </div> */}
          <div onClick={()=> setLogOutPop(true)} className='ml-4 w-[40px] h-[40px] bg-[#507B96] flex items-center justify-center text-white rounded-[10px] font-bold'>
          {userDetails?.username && userDetails?.username.slice(0, 2)}
          </div>
        </div>
        {/* Dialogue */}
        {/* {openPopup && <ProfileDialogue user={user} openPopup={openPopup} setOpenPopup={setOpenPopup} />} */}

      </header>
    </>
  );
}