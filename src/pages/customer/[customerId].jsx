import React, { useState, useEffect } from 'react'
import Layout from '@/components/layout/Layout'
import { useDispatch, useSelector } from 'react-redux';
import AuthGuard from '@/components/guards/AuthGuard'

import SuccessModal from '@/components/modal/successModal';
import FailureModal from '@/components/modal/FailureModal';

import { editCustomer } from '@/Redux/feature/editCustomerSlice';
import { fetchSingleCustomer } from '@/Redux/feature/singleCustomerSlice';

import { useRouter } from "next/router";

const EditCustomer = () => {

  const singleCustomer = useSelector((state) => state.single.singleCustomer);

  const router = useRouter();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const [loading, setLoading] = useState(false);
  const [send, setSend] = useState(false);
  const [fail, setFail] = useState(false);

  const dispatch = useDispatch();

  const cusId = router.query.customerId;
  useEffect(() => {
    if (cusId !== undefined) {
      console.log('route', cusId)
      dispatch(fetchSingleCustomer(cusId));
    }
  }, [dispatch, cusId]);

  useEffect(() => {
    setFirstName(singleCustomer?.fname);
    setLastName(singleCustomer?.lname);
    setEmail(singleCustomer?.email);
    setPhone(singleCustomer?.telephone);
  }, [singleCustomer]);

  const handleSubmit = (cusId, payload) => {
  payload.cusId = cusId, 
    console.log({handleSubmit: payload})
    dispatch(editCustomer({ payload }));
  }

  const submitHandler = (e) => {
    console.log({submitHandler: cusId})
    e.preventDefault();
    let payload = {
      fname: firstName,
      lname: lastName,
      email: email,
      telephone: phone,
    };
    try {
      setLoading(true)
      setSend(true)
      setLoading(false)
      handleSubmit(cusId, payload)
    } catch (error) {
      setFail(true)
    }
  }

  return (
    <AuthGuard>
    <Layout>
      <SuccessModal
        send={send}
        setSend={setSend}
        message='updated customer'
      />
      <FailureModal
        fail={fail}
        setFail={setFail}
        message='update customer'
      />
      <div className="w-[50rem] mx-auto p-5 relative">
        <div onClick={() => router.push(`/Prestige-Customers`)} className='flex items-center justify-center mb-5 rounded-lg border border-[#D0D5DD] w-20 p-2 cursor-pointer'>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.8332 6.99999H1.1665M1.1665 6.99999L6.99984 12.8333M1.1665 6.99999L6.99984 1.16666" stroke="#344054" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className='pl-3 text-sm'>Back</span>
        </div>
        <h4 className='text-[24px] font-bold mb-4'>Update a prestige user</h4>
        <form onSubmit={submitHandler} className='border p-5 rounded-md w-full'>

          <div className='pb-3'>
            <label className='text-[14px]'>First name</label>
            <input
              required
              className='border w-full py-2 px-4 rounded-md bg-[#F6F6F6]'
              type="text"
              name="fname"
              id="fname"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>

          <div className='pb-3'>
            <label className='text-[14px]'>Last name</label>
            <input
              required
              className='border w-full py-2 px-4 rounded-md bg-[#F6F6F6]'
              type="text"
              name="lname"
              id="lname"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
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
            className={`py-2 px-10 text-[12px] rounded-md ${!firstName || !lastName || !email || !phone
              ? 'cursor-not-allowed bg-[#F6ECD0]'
              : loading === true
                ? 'cursor-wait bg-[#F6ECD0]'
                : 'bg-[#FBCC04]'
              }`}
            // onClick={(e) => {
            //   e.preventDefault();
            //   onSubmit()
            // }}
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
              'Update Customer'
            )}
          </button>

        </form>
      </div>
    </Layout>
</AuthGuard>

  )
}

export default EditCustomer