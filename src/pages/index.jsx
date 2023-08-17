import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/layout/Layout';
import { useSelector } from 'react-redux';
import NoFiles from '../components/errors/NoFiles'
import Error from '../components/errors/Error'
import UserCompanionsTable from '@/components/UserCompanionsTable'
import SuccessModal from '@/components/modal/successModal';
import FailureModal from '@/components/modal/FailureModal';


export default function Home() {
  const authState = useSelector((state) => state.auth);
  let { isLoading, user } = authState;
  const [userCompanions, setUserCompanions] = useState(null)
  const [fail, setFail] = useState({
    open:false,
    message: '',
    failMessage: ''
  })
  const [success, setSuccess] = useState({
    open:false,
    message: ''
  })

  const [users, setUsers] = useState({
    data:null,
    status: '',
    error:''
  })
  const [openPopup, setOpenPopup] = useState(null);

  const [pageNum, setPageNum] = useState(1)
  const [totalPage, setTotalPage] = useState(30)

const router = useRouter();
const videoRef = useRef();

  // //Route to necessary page
  useEffect(() => {
    // const {pathname} = router
    // if(pathname == '/' ){
    //   router.push('/Prestige-Customers')
    // }
    console.log(user)
    if(!user){
      router.push('/auth/login')
    }

  }, []);


  function getRecentGuests(){
    setUsers(prev=>({...prev, status:'loading'}))

    fetch(`../api/guests/current-guest?page=${pageNum}&per_page=20`)
      .then(response => response.json())
      .then(result => {
       if(result.success){
         setUsers({
           data: result.data,
           error: result.error,
           status: 'succeeded'
         })
         // setTotalPage(result.data.pagination.total_page)
         console.log(result)
       }
       else{
         setUsers({
           data: null,
           error: result.error,
           status: 'failed'
         })
       }
      }).catch(error => console.log('error', error));
  }


  useEffect(()=>{
     getRecentGuests()

  }, [pageNum])

  
  const handleCameraButtonClick = async () => {
    try {
      const constraints = { video: true };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      videoRef.current.srcObject = stream;
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const getUserCompanions = async (uuid)=> {

    setUserCompanions({
      data:null,
      status: '',
      error:''
    })

     fetch(`../api/guests/${uuid}`)
       .then(response => response.json())
       .then(result => {
        if(result.success){
          setUserCompanions({
            data: result.data,
            status: 'succeeded'
          })
         
          // console.log(result)
        }
        else{
          setUserCompanions({
            data: null,
            error: result.error,
            status: 'failed'
          })
        }
       }).catch(error => console.log('error', error));

  }

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
      
      response = await response.json()
      
       if(response.success){
          setSuccess({
            open:true,
            message: 'Checked out user'
          })
          getRecentGuests()
        }
        else{
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
    <>
 <UserCompanionsTable userCompanions={userCompanions} setUserCompanions={setUserCompanions}/>
 <SuccessModal send={success.open} setSend={setSuccess} message={success.message}/>
<FailureModal fail={fail.open} setFail={setFail} message={fail.message} failMsg={fail.failMessage}/>


  <Layout>
  <main className='p-10 py-5 overflow-hidden'>
  <section className='h-48 flex gap-5'>
    <article onClick={()=>router.push('/guests-today')} className='flex flex-col min-w-[20rem] cursor-pointer ease-in-out 
    duration-100 hover:-translate-y-2 justify-between p-5 rounded-lg bg-[#fef2c0]'>
    <span className='rounded-full flex gap-5 items-center px-3 bg-white/80 font-bold text-sm self-start'>Today   <svg width="10" height="10" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.03996 1.47469L4.29996 4.73469C4.68496 5.11969 5.31496 5.11969 5.69996 4.73469L8.95996 1.47469" stroke="#111111" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
          </svg></span>


    <p className='font-bold text-3xl flex gap-1 flex-col'>{users?.data?.totalGuestToday}  
      <span className='text-gray-700 text-sm'>TOTAL GUESTS</span>
    </p>
    
    </article>

    <article className='flex flex-col min-w-[20rem] justify-end p-5 rounded-lg border-[1px]'>
    <p className='font-bold text-3xl flex flex-col gap-1'>{users?.data?.totalCurrentGuest}   
      <span className='text-gray-700 text-sm'>CURRENT GUESTS</span>
    </p>
    
    </article>
  </section>

  <div className="mt-7">
        {/* <div className='flex justify-between items-center'> */}
          
        <div className='flex items-center mt-4 gap-2'>
            <div className='font-bold text-[20px]'>Current Guests</div>
            <div className='mx-7 bg-[#F5F5F5] py-1 px-6 rounded-lg'>{users?.data?.totalCurrentGuest}</div>
            <div className="ml-auto flex space-x-4">


            <div className='relative drop-down cursor-pointer bg-[#FFCC04] font-bold py-2 px-8 rounded-lg shadow-md inline-flex gap-2 items-center'>
            <svg className= 'mr-2' width="17" height="17" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.6663 6.50001C14.393 6.50001 14.1663 6.27334 14.1663 6.00001V4.66668C14.1663 2.94668 13.053 1.83334 11.333 1.83334H4.66634C2.94634 1.83334 1.83301 2.94668 1.83301 4.66668V6.00001C1.83301 6.27334 1.60634 6.50001 1.33301 6.50001C1.05967 6.50001 0.833008 6.27334 0.833008 6.00001V4.66668C0.833008 2.37334 2.37301 0.833344 4.66634 0.833344H11.333C13.6263 0.833344 15.1663 2.37334 15.1663 4.66668V6.00001C15.1663 6.27334 14.9397 6.50001 14.6663 6.50001Z" fill="#444444"/>
                <path d="M11.333 15.1667H4.66634C2.37301 15.1667 0.833008 13.6267 0.833008 11.3333V10C0.833008 9.72667 1.05967 9.5 1.33301 9.5C1.60634 9.5 1.83301 9.72667 1.83301 10V11.3333C1.83301 13.0533 2.94634 14.1667 4.66634 14.1667H11.333C13.053 14.1667 14.1663 13.0533 14.1663 11.3333V10C14.1663 9.72667 14.393 9.5 14.6663 9.5C14.9397 9.5 15.1663 9.72667 15.1663 10V11.3333C15.1663 13.6267 13.6263 15.1667 11.333 15.1667Z" fill="#444444"/>
                <path d="M14.6663 8.5H1.33301C1.05967 8.5 0.833008 8.27333 0.833008 8C0.833008 7.72667 1.05967 7.5 1.33301 7.5H14.6663C14.9397 7.5 15.1663 7.72667 15.1663 8C15.1663 8.27333 14.9397 8.5 14.6663 8.5Z" fill="#444444"/>
                <path d="M11.0003 6.00001H5.00033C4.81366 6.00001 4.66699 5.85334 4.66699 5.66668V4.33334C4.66699 3.78001 5.11366 3.33334 5.66699 3.33334H10.3337C10.887 3.33334 11.3337 3.78001 11.3337 4.33334V5.66668C11.3337 5.85334 11.187 6.00001 11.0003 6.00001Z" fill="#444444"/>
                <path d="M11.0003 10H5.00033C4.81366 10 4.66699 10.1467 4.66699 10.3333V11.6667C4.66699 12.22 5.11366 12.6667 5.66699 12.6667H10.3337C10.8803 12.6667 11.3337 12.22 11.3337 11.6667V10.3333C11.3337 10.1467 11.187 10 11.0003 10Z" fill="#444444"/>
                </svg>
                Admit Guest

             <div className='absolute z-30 drop-down-option min-w-[19rem] top-[100%] bg-white
              p-4 flex flex-col gap-2 whitespace-nowrap text-sm right-0 rounded-lg shadow-md'>
              <p className='font-bold text-[17px]'>Choose a method to admit guest</p>
              <button onClick={handleCameraButtonClick}  className='text-start p-2 px-4 rounded-md text-gray-900 bg-[#fef2c0]'>
                <span className='font-bold text-black'>Scan QR Code</span> <br />
                Admit guest using QR code
              </button>
              <button onClick={()=>router.push({pathname:'/Prestige-Customers', query: {show:true}})} className='text-start mt-2 text-gray-900 rounded-md p-2 px-4 border-2'>
                <span className='font-bold text-black'>Admit manually</span> <br />
                Admit guest without QR code
              </button>
             </div>

            </div>

              <video ref={videoRef} autoPlay muted style={{ display: 'none' }} />
            </div>
          </div>
        
        {/* table */}

        <div className='w-full mt-[10px]'>
 <table className='w-full'>
 <thead className="bg-[#F6F6F6] z-10 sticky top-0">
          <tr className='h-11 border-b border-[#eaecf0]'>
            <th className='Work Sans normal h-[18px] w-[50px] pl-4 text-left text-[12px] font-[500] leading-[18px] text-[#667085]'>
              <input
                className='form-checkbox  h-[20px] w-[20px] cursor-pointer rounded-[6px] border-[#d0d5dd] bg-transparent text-[#FCCC04] outline-none focus:outline-none focus:ring-0'
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
                <p className="pr-2 text-[14px] font-bold"> Email </p>
                <p>
                  <svg width="10" height="10" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.03996 1.47469L4.29996 4.73469C4.68496 5.11969 5.31496 5.11969 5.69996 4.73469L8.95996 1.47469" stroke="#111111" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </p>
              </div>
            </th>

            <th className='font-mtnwork  h-4 text-left text-xs font-medium text-[#111111]'>
              <div className="flex items-center">
                <p className="pr-2 text-[14px] font-bold"> Phone number </p>
                <p>
                  <svg width="10" height="10" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.03996 1.47469L4.29996 4.73469C4.68496 5.11969 5.31496 5.11969 5.69996 4.73469L8.95996 1.47469" stroke="#111111" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </p>
              </div>
            </th>


            <th className='font-mtnwork  h-4 text-left text-xs font-medium text-[#111111]'>
              <div className="flex items-center">
                <p className="pr-2 text-[14px] font-bold"> Band </p>
                <p>
                  <svg width="10" height="10" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.03996 1.47469L4.29996 4.73469C4.68496 5.11969 5.31496 5.11969 5.69996 4.73469L8.95996 1.47469" stroke="#111111" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </p>
              </div>
            </th>

            <th className='font-mtnwork  h-4 text-left text-xs font-medium text-[#111111]'>
              <div className="flex items-center">
                <p className="pr-2 text-[14px] font-bold"> Check in</p>
                <p>
                  <svg width="10" height="10" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.03996 1.47469L4.29996 4.73469C4.68496 5.11969 5.31496 5.11969 5.69996 4.73469L8.95996 1.47469" stroke="#111111" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </p>
              </div>
            </th>

            {/* <th className='font-mtnwork  h-4 text-left text-xs font-medium text-[#111111]'>
              <div className="flex items-center">
                <p className="pr-2 text-[14px] font-bold"> Check out</p>
                <p>
                  <svg width="10" height="10" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.03996 1.47469L4.29996 4.73469C4.68496 5.11969 5.31496 5.11969 5.69996 4.73469L8.95996 1.47469" stroke="#111111" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </p>
              </div>
            </th> */}


            <th>
            </th>

          </tr>
        </thead>

        <tbody className="mb-10 h-full overflow-y-auto">
          {users.status === 'loading' ? (
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


          ) : users.status === 'failed' ? (
            // error state 
            <tr>
              <td colSpan={8} className='mb-0 text-center'>
                <Error />
              </td>
            </tr>
          ) : users.data?.currentGuest?.length === 0 ? (
            // no files returning from the backend component 
            <tr>
              <td colSpan={8} className='mb-0 text-center'>
                <NoFiles />
              </td>
            </tr>
          )  : (
            <>
              {users.data &&
                users.data?.currentGuest?.map((el) => (
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
                        <div className="flex gap-5 items-center">
                          <p title={el?.name} className='text-sm elipsis_text font-medium lg:block pl-2'>
                            {el?.name} 
                          </p>
                          <span title='View Guest Companions' className='bg-[#fef2C0] px-2 rounded-full' onClick={()=> getUserCompanions(el.uuid)}>view</span>
                        </div>
                      </div>
                    </td>

                    {/* email  */}
                    <td className='text-sm font-medium leading-[20px] text-[#101828]'>
                      <div className='flex items-center'>
                        <div title={el?.email} className="flex items-center">
                          <p className='text-sm font-medium lg:block pl-2 max-w-[400px]'>
                            {el?.email} 
                          </p>
                        </div>
                      </div>
                    </td>

                     {/* phone number  */}
                     <td className='text-sm font-medium leading-[20px] text-[#101828]'>
                      <div className='flex items-center'>
                        <div title= {el?.telephone}  className="flex items-center">
                          <p className='text-sm font-medium lg:block pl-2 max-w-[400px]'>
                            {el?.telephone} 
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className='text-sm font-medium leading-[20px] text-[#101828]'>
                      <div className='flex items-center'>
                        <div title= {el?.band}  className="flex items-center">
                          <p className='text-sm font-medium lg:block pl-2 max-w-[400px]'>
                            {el?.band} 
                          </p>
                        </div>
                      </div>
                    </td>

                     {/* check in */}
                     <td className='font-mtnwork mt-7  text-xs text-[#667085]'>
                     <p>{el?.checkin?.split(" ")[0]}
                     <br />
                   <span className='font-bold'> {el?.checkin?.split(" ")[1]} {el?.checkin?.split(" ")[2]}
                   </span> 
                     </p>
                   </td>

                   {/* check out */}
                     {/* <td className='font-mtnwork mt-7  text-xs text-[#667085]'>
                     <p>{el?.checkout?.split(" ")[0]}
                     <br />
                   <span className='font-bold'> {el?.checkout?.split(" ")[1]} {el?.checkout?.split(" ")[2]}
                   </span> 
                     </p>
                   </td> */}

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
                        
                        <p onClick={()=> router.push({pathname:'/add-companion', query: {uuid:el?.uuid}})}  className='cursor-pointer rounded-t-xl  border-b-2 border-gray-100 p-2 text-xs hover:bg-gray-300'>
                          Add companion
                        </p>
                        <p onClick={() => checkOut(el?.uuid)} className='cursor-pointer rounded-b-xl border-gray-300 bg-green-600 p-2 text-xs text-white'>
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
     
      { users?.data?.currentGuest &&
<div className='rounded-md items-center bg-gray-800 inline-flex mt-5'>
{pageNum > 1 && <button  onClick={()=>setPageNum(prev=>prev - 1)}  className='ml-0 block rounded-l-lg border border-gray-300 bg-white 
py-2 px-3 leading-tight text-gray-500 hover:bg-[#FCCC04] hover:text-gray-700
 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
              >
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
                </svg>
    </button> }
  <p className='px-3 text-white'>Page {pageNum}</p>
  <button onClick={()=>setPageNum(prev=>prev + 1)} className='block rounded-r-lg border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-500
 hover:bg-[#FCCC04] hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400
  dark:hover:bg-gray-700 dark:hover:text-white' >
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
</div>}
      
    </div>




      

        
      </div>


  </main>
  </Layout>

  </>
  )
}
