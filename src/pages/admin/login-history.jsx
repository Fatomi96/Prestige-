import {useEffect, useState} from 'react'
import AuthGuard from '@/components/guards/AuthGuard'
import Layout from '@/components/layout/Layout'
import AdminNav from '@/components/AdminNav'
import NoFiles from '@/components/errors/NoFiles'
import Error from '@/components/errors/Error'
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const LoginHistory = () => {
  const [pageNum, setPageNum] = useState(1)
  const [history, setHistory] = useState({
    data:null,
    status: '',
    error:''
  })

    const formatDate = (date)=>{
    const timezoneOffset = date.getTimezoneOffset() * 60000
    const adjustedDate = new Date(date.getTime() - timezoneOffset)
    return adjustedDate.toISOString().split('T')[0]
  }

  const [selectedFilter, setSelectedFilter] = useState('All')
  const [calendarPopUp, setCalendarPopUp] = useState(false)
  const [dateRange, setDateRange] = useState({
    startDate:'2022-01-01', endDate:formatDate(new Date())
  })
  const [calendarInput, setCalendarInput] = useState({
    start:formatDate(new Date()),
    end:formatDate(new Date())
  })

  useEffect(()=>{
    var requestOptions = {
      method: 'GET',
     redirect: 'follow'
     };
     setHistory(prev=>({...prev, status:'loading'}))

     fetch(`../api/auth/users/login-history/?page=${pageNum}&fromDate=${dateRange.startDate}&toDate=${dateRange.endDate}`, requestOptions)
       .then(response => response.json())
       .then(result => {
        if(result.success){
          console.log(result)
          setHistory({
            data: result.data.admins,
            error: result.error,
            status: 'succeeded'
          })
        }
        else{
          setHistory({
            data: null,
            error: result.error,
            status: 'failed'
          })
        }
       }).catch(error => console.log('error', error));

  }, [pageNum, dateRange])

  const setAllFiles = ()=>{
    setSelectedFilter('All')

    setDateRange({startDate:'2022-10-10', endDate:formatDate(new Date())})
    setPageNum(1)
  }



  const filterDays = (days) =>{
    
    setSelectedFilter(days)

    let endDate = new Date()
    endDate = formatDate(endDate)
  
    let startDate = new Date()
    startDate.setDate(startDate.getDate() - days);  // Subtracting days from the current date
    startDate =  formatDate(startDate);

    setPageNum(1)
    setDateRange({startDate, endDate})
  }

  const submitCustomDate = (e) =>{
    e.preventDefault()
    setDateRange({startDate:calendarInput.start, endDate:calendarInput.end})
    setCalendarPopUp(false)
    
  }

  // 


  return (
    <AuthGuard> 
 {calendarPopUp && <section className="absolute z-[9999999] h-screen w-full flex justify-center items-center bg-black/75">

<form onSubmit={submitCustomDate} className=' min-h-[300px] p-10 flex flex-col gap-8 rounded-xl bg-white'>
<div className='flex justify-between '>
  <h5 className='font-bold'>Select a date range</h5> <button onClick={()=>{setCalendarPopUp(false)}}>close</button>
  </div>

  <div className='flex gap-24 date_picker min-h-[350px]'>
    <article className='start_calendar'>
    <Calendar value={calendarInput.start} onChange={(date)=> setCalendarInput(prev=>({...prev, start:formatDate(date)}))}/>
    </article>
    <article className='end_calendar'>
    <Calendar value={calendarInput.end} onChange={(date)=> setCalendarInput(prev=>({...prev, end:formatDate(date)}))}/>
    </article>
  </div>
<button onClick={submitCustomDate} className='bg-[#FCCC04] rounded-md p-2 px-3 mt-auto self-end'>Filter</button>
</form>



</section>}


    <Layout>
   
    <section className='flex'>
       <AdminNav />
       <main className='grow py-5 px-10'>

<div className='flex justify-between mt-4 items-center'>
<div className='flex w-full justify-between items-center px-3'>
  <h4 className='font-bold text-[20px]'>Login history</h4>

  <button className='relative drop-down font-bold bg-[#ffffff] py-2 px-8 rounded-lg shadow-md inline-flex gap-2 items-center'>
            <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" 
            d="M4.66634 8.66667H11.333L11.9997 7.33333H3.99967L4.66634 8.66667ZM2.66167 4C2.29634 4 2.135 4.27 2.29767 
            4.59667L2.66634 5.33333H13.333L13.7017 4.59667C13.8663 4.26667 13.703 4 13.3377 4H2.66167ZM7.185 11.704C7.23363 
            11.7908 7.30375 11.8635 7.38863 11.9154C7.47351 11.9672 7.57029 11.9964 7.66967 12H8.32967C8.51567 12 8.733 11.8667 
            8.81434 11.704L9.333 10.6667H6.66634L7.185 11.704Z" fill="#44546F"/>
            </svg>
              Filter 
              <ul className='absolute z-30 drop-down-option top-[100%] text-start font-light bg-[#ffffff] p-3 flex flex-col gap-2 whitespace-nowrap left-0 rounded-lg shadow-md'>
                <li className={`${selectedFilter == 'All' ? 'border-b-4 font-bold border-black' : 'border-b-4 border-[rgb(0,0,0,0)]'}`} onClick={setAllFiles}>All</li>
                <li className={`${selectedFilter == '7' ? 'border-b-4 font-bold border-black' : 'border-b-4 border-[rgb(0,0,0,0)]'}`} onClick={()=>filterDays(7)}>Last 7 days</li>
                <li className={`${selectedFilter == '30' ? 'border-b-4 font-bold border-black'  : 'border-b-4 border-[rgb(0,0,0,0)]'}`}onClick={()=>filterDays(30)}>Last 30 days</li>
                <li className={`${selectedFilter == '90' ? 'border-b-4 font-bold border-black'  : 'border-b-4 border-[rgb(0,0,0,0)]'}`} onClick={()=>filterDays(90)}>Last 90 days</li>
                <li className={`${selectedFilter == 'Custom' ? 'border-b-4 font-bold border-black'  
                : 'border-b-4 border-[rgb(0,0,0,0)]'}`} onClick={()=>{
                  setSelectedFilter('Custom')
                  setCalendarPopUp(true)}}>Custom</li>
              </ul>
            </button>
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
                <p className="pr-2 text-[14px] font-bold"> Time</p>
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
          {history.status === 'loading' ? (
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


          ) : history.status === 'failed' ? (
            // error state 
            <tr>
              <td colSpan={8} className='mb-0 text-center'>
                <Error />
              </td>
            </tr>
          ) : history.data?.length === 0 ? (
            // no files returning from the backend component 
            <tr>
              <td colSpan={8} className='mb-0 text-center'>
                <NoFiles />
              </td>
            </tr>
          )  : (
            <>
              {history.data &&
                history.data.map((el,index) => (
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
                        <div title={el?.name} className="flex items-center">
                          <p className='text-sm font-medium lg:block pl-2 max-w-[400px]'>
                            {el?.name} 
                          </p>
                        </div>
                      </div>
                    </td>

                     {/* date */}
                     <td className='font-mtnwork mt-7  text-xs text-[#667085]'>
                     <p className=''>
                     {el?.date}
                      </p>
                    </td>

                    {/* time */}
                    <td className='font-mtnwork mt-7  text-xs text-[#667085]'>
                      <p>{el?.time}</p>
                    </td>

                   
                    
                  </tr>
                ))}
            </>
          )}

        </tbody>
       
      </table>

      { history &&
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

</main>
       
    </section>
</Layout>
</AuthGuard>
  )
}

export default LoginHistory