import React from 'react'
import Image from 'next/image';
import { useRouter } from 'next/router';

const AdmitSuccessModal = ({open, uuid, setSuccessModal, number}) => {
    const router = useRouter()

    if(open)
  return (
    <div className="z-[99999] fixed h-screen w-full bg-gray-700  bg-opacity-50">
    <div className="flex justify-center items-center h-screen">
      <div className="flex flex-col gap-2 justify-center min-w-48 bg-white p-5 rounded-md">
      <Image
          src='/images/checked.png'
          alt="Image"
          className=" h-auto mt-4 self-center"
          width={30}
          height={30}
      />
      <p className="text-center font-bold w-full">Guest admitted</p>

      <p className="text-center"><span style={{ fontWeight: 'bold' }}></span>{number} is a prestige user</p>

      <button onClick={()=>{
        router.push({pathname:'/add-companion', query: {uuid}})
      setSuccessModal({open:false, uuid:''})
      
    }
      }
      className='p-2 px-3 gap-6 text-sm flex justify-between items-center text-black/80
     rounded-md font-bold bg-[#fef2c0] mt-3'>
          Admit companion
          <svg
              aria-hidden='true'
              className='h-5 w-5'
              fill='currentColor'
              viewBox='0 0 20 20'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                fillRule='evenodd'
                d='M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z'
                clipRule='evenodd'
              ></path>
            </svg>
        </button>

      <button onClick={()=>setSuccessModal({open:false, uuid:''})}
       className=" hover:bg-black/40 text-black font-bold py-2 px-4 rounded-md border-2 my-4">
          Close
      </button>
          
      </div>
  </div>
</div>
  )
}

export default AdmitSuccessModal;