import {useState} from 'react'
import SuccessModal from '@/components/modal/successModal';
import FailureModal from '@/components/modal/FailureModal';
import NoFiles from '@/components/errors/NoFiles'
import Error from '@/components/errors/Error'

const UserCompanionsTable = ({userCompanions, setUserCompanions}) => {

  console.log(userCompanions)

  const [fail, setFail] = useState({
    open:false,
    message: '',
    failMessage: ''
  })
  const [success, setSuccess] = useState({
    open:false,
    message: ''
  })

  const checkOut = async (msnid) => {
    
    const url = `../api/companions/check-out/${msnid}`;
  
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

           fetch(`../api/guests/${userCompanions.data.uuid}`)
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

  const [openPopup, setOpenPopup] = useState(null);


  if(userCompanions)
  return (

<>

<SuccessModal send={success.open} setSend={setSuccess} message={success.message}/>
<FailureModal fail={fail.open} setFail={setFail} message={fail.message} failMsg={fail.failMessage}/>

<section className='bg-black/50 z-[99999] flex flex-col items-center fixed h-screen w-full'>
<div className='mt-[50px] bg-white w-[75vw] h-[70vh] overflow-y-scroll p-10 rounded-md'>

<div className='flex sticky bg-white p-3 z-[9999] top-0 justify-between items-center mb-4'>
    { userCompanions.data?.companions && <h2 className='capitalize'>{userCompanions?.data?.fname}  {userCompanions?.data?.lname} Companions</h2> }
    <button className='font-bold h-10 w-10 text-black rounded-full bg-[#FFCC04]' onClick={()=>setUserCompanions(null)}><span>X</span></button>
    </div>
 {userCompanions.data?.companions &&

 <table className='w-full z-[99] '>
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
                <p className="pr-2 text-[14px] font-bold">Companion Name </p>
                <p>
                  <svg width="10" height="10" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.03996 1.47469L4.29996 4.73469C4.68496 5.11969 5.31496 5.11969 5.69996 4.73469L8.95996 1.47469" stroke="#111111" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </p>
              </div>
            </th>


            <th className='font-mtnwork  h-4 text-left text-xs font-medium text-[#111111]'>
              <div className="flex items-center">
                <p className="pr-2 text-[14px] font-bold"> Phone </p>
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
            <th className='font-mtnwork  h-4 text-left text-xs font-medium text-[#111111]'>
              <div className="flex items-center">
                <p className="pr-2 text-[14px] font-bold">Check out</p>
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
          {userCompanions.status === 'loading' ? (
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


          ) : userCompanions.status === 'failed' ? (
            // error state 
            <tr>
              <td colSpan={8} className='mb-0 text-center'>
                <Error />
              </td>
            </tr>
          ) : userCompanions.data?.companions.length === 0 ? (
            // no files returning from the backend component 
            <tr>
              <td colSpan={8} className='mb-0 text-center'>
                <NoFiles />
              </td>
            </tr>
          )  : (
            <>
              {userCompanions.data?.companions &&
                userCompanions.data?.companions.map((el,index) => (
                  <tr
                     key={index}
                    className='relative h-[58px] cursor-pointer border-b border-[#eaecf0] hover:bg-[#F6F6F6]'
                  >
                    <td className='pl-4'>
                      <input
                        className='form-checkbox h-5 w-5 cursor-pointer rounded-[6px] border-b border-[#d0d5dd] bg-transparent bg-[#FCCC04] outline-none focus:outline-none focus:ring-0'
                        type='checkbox'
                        // name={el.uuid}
                        disabled
                      />
                    </td>

                    {/* name  */}
                    <td className='text-sm font-medium leading-[20px] text-[#101828]'>
                      <div className='flex items-center'>
                        <div title={`${el?.firstname} ${el?.lastname}`} className="flex items-center">
                          <p className='text-sm font-medium lg:block pl-2 max-w-[400px]'>
                            {el?.firstname} {el?.lastname} 
                          </p>
                        </div>
                      </div>
                    </td>

                     {/* phone */}
                     <td className='font-mtnwork mt-7  text-xs text-[#667085]'>
                     <p className=''>
                     {el?.telephone}
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
                   <td className='font-mtnwork mt-7 text-xs text-[#667085]'>
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
       
  </table>}

    </div>

    </section>
</>
    
  )
}

export default UserCompanionsTable