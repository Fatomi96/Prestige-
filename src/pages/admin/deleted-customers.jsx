import {useEffect, useState} from 'react'
import AuthGuard from '@/components/guards/AuthGuard'
import Layout from '@/components/layout/Layout'
import AdminNav from '@/components/AdminNav'
import NoFiles from '@/components/errors/NoFiles'
import Error from '@/components/errors/Error'

const DeletedCustomers = () => {
  const [pageNum, setPageNum] = useState(1)
  const [deletedData, setDeletedData] = useState({
    data:null,
    status: '',
    error:''
  })

  useEffect(()=>{
    var requestOptions = {
      method: 'GET',
     redirect: 'follow'
     };
     setDeletedData(prev=>({...prev, status:'loading'}))

     fetch(`../api/customers/deleted-customers/?page=${pageNum}`, requestOptions)
       .then(response => response.json())
       .then(result => {
        if(result.success){
          setDeletedData({
            data: result.data.customers,
            error: result.error,
            status: 'succeeded'
          })
        }
        else{
          setDeletedData({
            data: null,
            error: result.error,
            status: 'failed'
          })
        }
       }).catch(error => console.log('error', error));

  }, [pageNum])


  return (
    <AuthGuard>
    <Layout>
    <section className='flex'>
       <AdminNav />
       <main className='grow py-5 px-10'>

<div className='flex justify-between mt-4 items-center'>
<div className='flex items-center'>
  <div className='font-bold text-[20px]'>Deleted customers</div>
  {/* <div className='mx-7 bg-[#F5F5F5] py-1 px-6 rounded-lg'>{totalRecords ? totalRecords : 0}</div> */}
</div>

    </div>

    <div className='mt-[15px]'>
 <table className='w-full z-[9999999]'>
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

         
          </tr>
        </thead>

        <tbody className="mb-10 h-full overflow-y-auto">
          {deletedData.status === 'loading' ? (
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


          ) : deletedData.status === 'failed' ? (
            // error state 
            <tr>
              <td colSpan={8} className='mb-0 text-center'>
                <Error />
              </td>
            </tr>
          ) : deletedData.data?.length === 0 ? (
            // no files returning from the backend component 
            <tr>
              <td colSpan={8} className='mb-0 text-center'>
                <NoFiles />
              </td>
            </tr>
          )  : (
            <>
              {deletedData.data &&
                deletedData.data?.map((el) => (
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
                        <div title='name' className="flex items-center">
                          <p className='text-sm font-medium lg:block pl-2 max-w-[400px]'>
                            {el?.fname} {el?.lname} 
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* band  */}
                    <td className='text-sm font-medium leading-[20px] text-[#101828]'>
                      <div className='flex items-center'>
                        <div title={el?.band} className="flex items-center">
                          <p className='text-sm font-medium lg:block pl-2 max-w-[400px]'>
                            {el?.band} 
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
                     {el?.lastvisit?.split("T")[0].split(",")[0]}
                      </p>
                    </td>

                 
                   
                    
                  </tr>
                ))}
            </>
          )}

        </tbody>
       
      </table>
      </div>

    { deletedData &&
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

export default DeletedCustomers