import React, { useEffect, useState } from 'react'
import Layout from '@/components/layout/Layout'
import { useDispatch, useSelector } from 'react-redux';

import { useRouter } from "next/router";

import SuccessModal from '@/components/modal/successModal';
import FailureModal from '@/components/modal/FailureModal';
import Image from 'next/image';


const UpdateAdmin = () => {

  const router = useRouter()

  const [username, setUsername] = useState(router.query.username);
  const [email, setEmail] = useState(router.query.email);
  const [phone, setPhone] = useState(router.query.telephone);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [fail, setFail] = useState(false);

  useEffect(()=>{
if(!router.query){
  router.push('/admin/admin-users')
}

  }, [router])

  useEffect(()=>{
    setUsername(router.query.username);
     setEmail(router.query.email);
    setPhone(router.query.telephone);
  }, [router])

  const onSubmit = async () => {
    setLoading(true)

    const url = `../api/auth/users/${router.query.uuid}`;

    let data = {
      username,
      email,
      telephone: phone,
    };

    console.log(JSON.stringify(data))

    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(data)
    } 
  
    try {
      let response = await fetch(url, options);
      response = await response.json()
      
      if(response.success){
        setSuccess(true)
        setUsername('')
        setPhone('')
        setEmail('')
      }
      
      else{
        setFail({
          open:true,
          message:'update admin',
          fullMsg:response.error
        })
      }
      setLoading(false)
     
    }
    catch(err){
      console.log(err)
      alert(err.message) 
    }
  };



  const isInvalid = !username || !email || !phone;

  return (
    <>
    <FailureModal fail={fail.open} setFail={setFail} failMsg={fail.fullMsg} message={fail.message}/>
    {success && <div
        className="absolute z-[9999999] flex h-screen w-screen items-center justify-center bg-gray-700  bg-opacity-25"
        
      >
        <div className=" min-w-[20rem] flex flex-col rounded-md bg-white px-5 py-8 text-center">
        <Image
          src='/images/checked.png'
          alt="Image"
          className="self-center"
          width={50}
          height={50}
      />
          <h4 className="font-mtnwork font-bold">
            Admin updated
          </h4>

<button onClick={()=>{
  setSuccess(false)
  router.push('/admin/admin-users')
}
}
  className='p-2 border-2 text-sm text-black/80
     rounded-md font-bold mt-3 text-center'>Close</button>
        </div>
      </div> }


     <Layout>

      <section className='mt-10 flex justify-center'>
      <div className="relative min-w-[43rem] mt-10">
        <div className='text-[24px] font-bold mb-4'>Update Admin</div>
        <form className='border p-5 rounded-md w-full'>

          <div className='pb-3'>
            <label className='text-[14px]'>Username</label>
            <input
              required
              className='border w-full py-2 px-4 rounded-md bg-[#F6F6F6]'
              type="text"
              name="username"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className='pb-3'>
            <label className='text-[14px]'>Email</label>
            <input
              required
              className='border w-full py-2 px-4 rounded-md bg-[#F6F6F6]'
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className='pb-3'>
            <label className='text-[14px]'>Phone number</label>
            <input
              required
              className='border w-full py-2 px-4 rounded-md bg-[#F6F6F6]'
              type="phone"
              name="phone"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <button
            disabled={isInvalid || loading}
            className={`py-2 px-10 text-[14px] font-bold rounded-md ${isInvalid
              ? 'cursor-not-allowed bg-[#F6ECD0]'
              : loading === true
                ? 'cursor-wait bg-[#FBCC01]'
                : 'bg-[#FBCC04]'
              }`}
            onClick={(e) => {
              e.preventDefault();
              onSubmit();
            }}
            type='submit'
          >
            {loading ? (
              <svg
                aria-hidden='true'
                className='mx-[23px] h-5 w-5 animate-spin fill-[#FCCC04] text-gray-200 dark:text-gray-600'
                viewBox='0 0 100 101'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                  fill='currentColor'
                />
                <path
                  d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                  fill='currentFill'
                />
              </svg>
            ) : (
              'Update Admin'
            )}
          </button>

        </form>
      </div>
      </section>
      
    </Layout></>
   
  )
}

export default UpdateAdmin