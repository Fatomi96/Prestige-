import {useEffect, useState} from 'react'
import AuthGuard from '@/components/guards/AuthGuard'
import Layout from '@/components/layout/Layout'
import AdminNav from '@/components/AdminNav'
import NoFiles from '@/components/errors/NoFiles'
import Error from '@/components/errors/Error'
import {useRouter} from 'next/router'
import FailureModal from '@/components/modal/FailureModal'
import SuccessModal from '@/components/modal/successModal'


const AdminUsers = () => {

  const router = useRouter()

  const [users, setUsers] = useState({
    data:null,
    status: '',
    error:''
  })
  const [openPopup, setOpenPopup] = useState(null);
  const [deletePopUp, setdeletePopUp] = useState(false)

  const [pageNum, setPageNum] = useState(1)
  const [totalPage, setTotalPage] = useState(30)
  const [success, setSuccess] = useState(false);
  const [fail, setFail] = useState(false);


  function getAdminUsers(){
    var requestOptions = {
      method: 'GET',
     redirect: 'follow'
     };
     setUsers(prev=>({...prev, status:'loading'}))

     fetch(`../api/auth/users?page=${pageNum}&per_page=20`, requestOptions)
       .then(response => response.json())
       .then(result => {
        if(result.success){
          setUsers({
            data: result.data.users,
            error: result.error,
            status: 'succeeded'
          })
          setTotalPage(result.data.pagination.total_page)

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
   getAdminUsers()

  }, [pageNum])

const deleteAdmin = async (uuid) =>{

  var requestOptions = {
    method: 'DELETE',
    headers:  {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: '',
    redirect: 'follow'
  };
  
  try{
    let response = await fetch(`../api/auth/users/${uuid}`, requestOptions)
    response = await response.json()
    setdeletePopUp(false)
    if(response.success){
      setSuccess({
        open: true, 
        message: 'Admin deleted'
      })
      getAdminUsers()
    }
    else{
      setFail({
        open:true,
        message:'update admin',
        fullMsg: response.error
      })
    }

  }
  catch(error){

  }
 
}


  return (
<AuthGuard>
{deletePopUp && <div className='fixed z-[9999999] flex h-screen w-screen items-center justify-center bg-gray-700  bg-opacity-25'>
        <div
          className='absolute h-screen w-screen'
          onClick={() => setdeletePopUp(false)}
        ></div>
        <div className='z-[9999] mx-4  w-[300px] rounded-xl bg-white p-10 text-center'>
          <h3 className='text-base font-semibold'>
            Are you sure you want to delete this Admin?
          </h3>
          <div className='button-group mt-6 grid grid-cols-2 gap-2'>
            <button
              className='cursor-pointer rounded-lg border border-gray-400 bg-white py-2 px-4 font-semibold text-gray-800 shadow hover:bg-gray-100'
              onClick={() => setdeletePopUp(false)}
            >
              Cancel
            </button>
            <button
              className='relative flex items-center justify-center rounded-lg border-2 border-red-600 bg-red-600 px-4 py-2 font-mtnwork 
              text-sm font-semibold text-white cursor-pointer opacity-100' 
              onClick={() => deleteAdmin(deletePopUp.id)}
            >
              Delete
            </button>
          </div>

        </div>
        
      </div> }

<FailureModal fail={fail.open} setFail={setFail} failMsg={fail.fullMsg} message={fail.message}/>
<SuccessModal send={success.open} setSend={setSuccess} message={success.message}/>

<Layout>
         <section className='flex'>
            <AdminNav />
            <main className='grow py-5 px-10'>

            <div className='flex justify-between mt-4 items-center'>
            <div className='flex items-center'>
              <div className='font-bold text-[20px]'>Admin users</div>
              {/* <div className='mx-7 bg-[#F5F5F5] py-1 px-6 rounded-lg'>{totalRecords ? totalRecords : 0}</div> */}
            </div>

            <div className="flex space-x-4">

             <button onClick={() => router.push('/admin/add-admin')} 
            className='bg-[#FCCC04] font-bold py-2 px-8 rounded-lg shadow-md inline-flex items-center'>
              <svg className= 'mr-2' width="12" height="18" viewBox="0 0 11 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.83317 13H7.1665" stroke="#333333" stroke-width="1.2" stroke-linecap="round" strokeLinecap="round"/>
              <path d="M8.5 14.3333V11.6667" stroke="#333333" stroke-width="1.2" stroke-linecap="round" strokeLinecap="round"/>
              <path d="M5.60673 7.24668C5.54006 7.24001 5.46006 7.24001 5.38673 7.24668C3.80006 7.19334 2.54006 5.89334 2.54006 4.29334C2.5334 2.66001 3.86006 1.33334 5.4934 1.33334C7.12673 1.33334 8.4534 2.66001 8.4534 4.29334C8.4534 5.89334 7.18673 7.19334 5.60673 7.24668Z" stroke="#333333" stroke-width="1.2" stroke-linecap="round" strokeLinecap="round"/>
              <path d="M5.49336 14.54C4.28003 14.54 3.07336 14.2333 2.15336 13.62C0.540026 12.54 0.540026 10.78 2.15336 9.70668C3.98669 8.48002 6.99336 8.48002 8.82669 9.70668" stroke="#333333" stroke-width="1.2" stroke-linecap="round" strokeLinecap="round"/>
              </svg>
              Add Admin User
            </button>
</div>
                </div>
           
                <div className='w-full mt-[15px]'>
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
                <p className="pr-2 text-[14px] font-bold"> Date </p>
                <p>
                  <svg width="10" height="10" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.03996 1.47469L4.29996 4.73469C4.68496 5.11969 5.31496 5.11969 5.69996 4.73469L8.95996 1.47469" stroke="#111111" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </p>
              </div>
            </th>

            <th className='font-mtnwork  h-4 text-left text-xs font-medium text-[#111111]'>
              <div className="flex items-center">
                
              </div>
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
          ) : users.data?.length === 0 ? (
            // no files returning from the backend component 
            <tr>
              <td colSpan={8} className='mb-0 text-center'>
                <NoFiles />
              </td>
            </tr>
          )  : (
            <>
              {users.data &&
                users.data?.map((el) => (
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
                        <div title={el?.fullname} className="flex items-center">
                          <p className='text-sm elipsis_text font-medium lg:block pl-2'>
                            {el?.fullname} 
                          </p>
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

                     {/* date */}
                     <td className='font-mtnwork mt-7  text-xs text-[#667085]'>
                     <p className=''>
                     {el?.created_at?.split("T")[0].split(",")[0]}
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
                        
                        <p onClick={()=>router.push({pathname:'/admin/update-admin', query: {...el}})}  className='cursor-pointer rounded-t-xl  border-b-2 border-gray-100 p-2 text-xs hover:bg-gray-300'>
                          Update
                        </p>
                        <p onClick={() => setdeletePopUp({id:el?.uuid,open:true})} className='cursor-pointer rounded-b-xl border-gray-300 bg-red-600 p-2 text-xs text-white'>
                          Delete
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
     
      
    </div>

{ users &&
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
            </main>
           
         </section>
    </Layout>
</AuthGuard>
  )
}

export default AdminUsers
