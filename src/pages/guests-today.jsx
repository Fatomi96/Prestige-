import React, { useRef, useState } from 'react';
import { useEffect } from 'react';
import Layout from '@/components/layout/Layout'
import { useRouter } from 'next/router';
import AuthGuard from '@/components/guards/AuthGuard';
import {guestsByDate} from '@/Redux/feature/guestsByDateSlice'
import NoFiles from '@/components/errors/NoFiles'
import Error from '@/components/errors/Error'
import SuccessModal from '@/components/modal/successModal';
import FailureModal from '@/components/modal/FailureModal';


export default function TodayGuests() {

  const router = useRouter();

  const [fail, setFail] = useState({
    open:false,
    message: '',
    failMessage: ''
  })
  const [success, setSuccess] = useState({
    open:false,
    message: ''
  })
  const [todayGuests, setTodayGuests] = useState({
    data:null,
    status: '',
    error:''
  })
  const [openPopup, setOpenPopup] = useState('')
  const [pageNum, setPageNum] = useState(1)

  async function getTodayGuests(page){

    setTodayGuests(prev=>({...prev, status:'loading'}))

      try  { 
        let response = await fetch(`../api/guests?page=${page}&per_page=20`);
        response = await response.json()
        console.log(response)
        if(response.success){
            setTodayGuests({
                data: response.data.guestToday,
                error: response.error,
                status: 'succeeded'
              })
        }
        else{
            setTodayGuests({
                data: null,
                error: response.error.message,
                status: 'failed'
              })
        }
  
      } catch (error) {
        console.log(error)
      }

  }


  useEffect(() => {
getTodayGuests(pageNum);
  }, [pageNum]);



const checkOut = async (msnid) => {
    
  const url = `../api/customers/check-out/${msnid}`;

  const options ={
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
  } 

  try {
    let response = await fetch(url, options);
    console.log(response)
    
    response = await response.json()
    

     if(response.success){
        setSuccess({
          open:true,
          message: 'Checked out user'
        })
        dispatch(guestsByDate({dateRange, pageNum}));

      }
      else{
        console.log(response)
        setFail({
          open:true,
          message: 'check out user',
          failMessage: response.error
        })
      }

    // response.success ? setSuccess(true) : console.log('error')
  }
  catch(err){
    // setFail(true)
    console.log(err)
  }


};


  return (
      <AuthGuard>
     
        <>
<SuccessModal send={success.open} setSend={setSuccess} message={success.message}/>
<FailureModal fail={fail.open} setFail={setFail} message={fail.message} failMsg={fail.failMessage}/>
        

   <Layout>
      
   <div className="lg:py-10 lg:px-12 p-5">
        {/* <div className='flex justify-between items-center'> */}
          
        <div className='flex items-center mt-4 gap-3'>
            <div className='font-bold text-[20px]'>Today Guests</div>
            <div className='mx-7 bg-[#F5F5F5] py-1 px-6 rounded-lg'>{todayGuests?.data?.length}</div>
            <div className="flex space-x-4">
            </div>
          </div>
        
        {/* table */}

        <div className='mt-[15px]'>

<table className='w-full z-[9999999]'>
<thead className="bg-[#F6F6F6] z-10 sticky top-0">
         <tr className='h-14 border-b border-[#eaecf0] w-full'>
           <th className='Work Sans normal h-[18px] w-[40px] pl-4 text-left text-[12px] font-[500] leading-[18px] text-[#667085]'>
             <input
               className='form-checkbox h-[20px] w-[20px] cursor-pointer rounded-[6px] border-[#d0d5dd] bg-transparent text-[#FCCC04] outline-none focus:outline-none focus:ring-0'
               type='checkbox'
               id=''
               name='allSelect'
               disabled
             />
           </th>
           <th className='font-mtnwork h-4 text-left text-xs font-medium text-[#111111]'>
             <div className="flex items-center pl-2">
               <p className="pr-2 text-[14px] font-bold"> Name </p>
               <p>
                 <svg width="10" height="10" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                   <path d="M1.03996 1.47469L4.29996 4.73469C4.68496 5.11969 5.31496 5.11969 5.69996 4.73469L8.95996 1.47469" stroke="#111111" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                 </svg>
               </p>
             </div>
           </th>
           <th className='font-mtnwork  h-4 text-left text-xs font-medium text-[#111111]'>
             <div className="flex items-center">
               <p className="pr-2 text-[14px] font-bold">Phone Number</p>
               <p>
                 <svg width="10" height="10" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                   <path d="M1.03996 1.47469L4.29996 4.73469C4.68496 5.11969 5.31496 5.11969 5.69996 4.73469L8.95996 1.47469" stroke="#111111" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                 </svg>
               </p>
             </div>
           </th>

           {/* <th className='font-mtnwork  h-4 text-left text-xs font-medium text-[#111111]'>
             <div className="flex items-center">
               <p className="pr-2 text-[14px] font-bold"> Email </p>
               <p>
                 <svg width="10" height="10" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                   <path d="M1.03996 1.47469L4.29996 4.73469C4.68496 5.11969 5.31496 5.11969 5.69996 4.73469L8.95996 1.47469" stroke="#111111" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                 </svg>
               </p>
             </div>
           </th> */}


          
           <th className='font-mtnwork  h-4 text-left text-xs font-medium text-[#111111]'>
             <div className="flex items-center">
               <p className="pr-2 text-[14px] font-bold"> Check in </p>
               <p>
                 <svg width="10" height="10" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                   <path d="M1.03996 1.47469L4.29996 4.73469C4.68496 5.11969 5.31496 5.11969 5.69996 4.73469L8.95996 1.47469" stroke="#111111" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                 </svg>
               </p>
             </div>
           </th>

          <th className='font-mtnwork  h-4 text-left text-xs font-medium text-[#111111]'>
             <div className="flex items-center">
               <p className="pr-2 text-[14px] font-bold"> Check out </p>
               <p>
                 <svg width="10" height="10" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                   <path d="M1.03996 1.47469L4.29996 4.73469C4.68496 5.11969 5.31496 5.11969 5.69996 4.73469L8.95996 1.47469" stroke="#111111" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                 </svg>
               </p>
             </div>
           </th>

          
           <th></th>
         </tr>
       </thead>
       <tbody className="mb-10 h-full overflow-y-auto">
         {todayGuests.status === 'loading' ? (
           // loading components
           <tr>
             <td colSpan={8} className='text-center '>
               <div className='m-auto mt-6 flex flex-col items-center justify-center text-center md:w-4/12'>
           <svg
           aria-hidden="true"
           className=" h-20 w-20 animate-spin fill-[#FFCB03] text-gray-200"
           viewBox="0 0 100 101"
           fill="none"
           xmlns="http://www.w3.org/2000/svg"
         >
           <path
             d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
             fill="currentColor"
           />
           <path
             d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
             fill="currentFill"
           />
          </svg>
          </div>
             </td>
           </tr>

         ) : todayGuests.status === 'failed' ? (
           // error state 
           <tr>
             <td colSpan={8} className='mb-0 text-center'>
               <Error />
             </td>
           </tr>
         ) : todayGuests.data?.length === 0 ? (
           // no files returning from the backend component 
           <tr>
             <td colSpan={8} className='mb-0 text-center'>
               <NoFiles />
             </td>
           </tr>
         ) : (
           <>
             {todayGuests.data &&
               todayGuests.data?.map((el) => (
                 <tr
                   key={el?.uuid}
                   className='relative h-[58px] cursor-pointer border-b border-[#eaecf0] hover:bg-[#F6F6F6]'
                 >
                   <td className='pl-4'>
                     <input
                       className='form-checkbox h-5 w-5 cursor-pointer rounded-[6px] border-b border-[#d0d5dd] bg-transparent bg-[#FCCC04] outline-none focus:outline-none focus:ring-0'
                       type='checkbox'
                       name={el.uuid}
                       disabled
                     />
                   </td>

                   {/* name  */}
                   <td className='text-sm font-medium leading-[20px] text-[#101828]'>
                     <div className='flex items-center'>
                       <div className="flex items-center">
                         <p className='text-sm font-medium lg:flex gap-4 iem-center pl-2 max-w-[400px]'>
                           {el?.fname}  {el?.lname}
               {/* <svg onClick={(e)=>console.log(e)} title='view user companions' className= 'mr-2' width="11" height="16" viewBox="0 0 11 16" fill="none" xmlns="http://www.w3.org/2000/svg">
             <path d="M9.83317 13H7.1665" stroke="#333333" stroke-width="1.2" stroke-linecap="round" strokeLinecap="round"/>
             <path d="M8.5 14.3333V11.6667" stroke="#333333" stroke-width="1.2" stroke-linecap="round" strokeLinecap="round"/>
             <path d="M5.60673 7.24668C5.54006 7.24001 5.46006 7.24001 5.38673 7.24668C3.80006 7.19334 2.54006 5.89334 2.54006 4.29334C2.5334 2.66001 3.86006 1.33334 5.4934 1.33334C7.12673 1.33334 8.4534 2.66001 8.4534 4.29334C8.4534 5.89334 7.18673 7.19334 5.60673 7.24668Z" stroke="#333333" stroke-width="1.2" stroke-linecap="round" strokeLinecap="round"/>
             <path d="M5.49336 14.54C4.28003 14.54 3.07336 14.2333 2.15336 13.62C0.540026 12.54 0.540026 10.78 2.15336 9.70668C3.98669 8.48002 6.99336 8.48002 8.82669 9.70668" stroke="#333333" stroke-width="1.2" stroke-linecap="round" strokeLinecap="round"/>
             </svg> */}
                         </p>
                       </div>
                     </div>
                   </td>

                   {/* phone  */}
                   <td className='font-mtnwork text-xs text-[#667085]'>
                     <p className=''>
                       {el?.telephone}
                       {/* {truncatePhone(el?.telephone)} */}
                     </p>
                   </td>

                   {/* check in */}
                   <td className='font-mtnwork mt-7  text-xs text-[#667085]'>
                     <p>{el?.checkin?.split("T")[0]}
                     <br />
                  <span className='font-bold'> {el?.checkin?.split("T")[1].slice(0,8)}</span> 
                     </p>
                   </td>
                    {/* check out */}
                   <td className='font-mtnwork mt-7  text-xs text-[#667085]'>
                     <p>{el?.checkout?.split("T")[0]}
                     <br />
                     <span className='font-bold'>{el?.checkout?.split("T")[1].slice(0,8)}</span>
                     </p>
                   </td>

                   <td onClick={() => setOpenPopup((oldState) => {
                     return oldState === el?.uuid ? null : el?.uuid
                   })}>
                     <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                       <circle cx="7.99984" cy="3.33333" r="1.33333" fill="#888888" />
                       <circle cx="7.99984" cy="8.00033" r="1.33333" fill="#888888" />
                       <ellipse cx="7.99984" cy="12.6663" rx="1.33333" ry="1.33333" fill="#888888" />
                     </svg>
                     
                     
                     {/* More component */}
                     {openPopup == el?.uuid &&
                       <div className='absolute right-0 z-[9999999] w-32 rounded-lg bg-white shadow-lg'>
                          <p onClick={() => checkOut(el?.uuid)} className='cursor-pointer rounded-y-lg border-gray-300 bg-lime-500 p-2 text-xs text-white'>
                           Check out
                         </p>
                         
                       </div>
                     }
                   </td>


                 </tr>
               ))}
           </>
         )}

       </tbody>
     </table>

    {todayGuests.status !== "loading" && todayGuests.data?.length > 0   && <div className='flex justify-center mt-5'>
      <button onClick={()=>setPageNum(prev=> prev - 1)} disabled={pageNum === 1} className='mr-auto flex justify-between 
      items-center w-32 font-bold border-2 p-2 rounded-md disabled:opacity-25'>
         <svg
                  aria-hidden='true'
                  className='h-5 w-5'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    fillRule='evenodd'
                    d='M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z'
                    clipRule='evenodd'
                  ></path>
                </svg>  Previous 
      </button>

      <p className='font-bold flex justify-center items-center text-sm'>
        <span>
          Page {pageNum}
        </span>
      </p>

      {<button disabled={todayGuests.data?.length !== 20} onClick={()=>setPageNum(prev=> prev + 1)} className='ml-auto flex font-bold items-center 
      justify-between w-32 border-2 p-2 rounded-md disabled:opacity-25 items-baseline'>
        Next  <svg
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
      </button>}
     </div> }
     
         </div>

        
      </div>
    </Layout>
        </>
    </AuthGuard>  
  )
}
