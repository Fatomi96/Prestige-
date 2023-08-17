import React, { useRef, useState } from 'react';
import { useEffect } from 'react';
import Layout from '@/components/layout/Layout'
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import axios from "axios"
import AuthGuard from '../components/guards/AuthGuard';
import {guestsByDate} from '@/Redux/feature/guestsByDateSlice'
import Calendar from 'react-calendar';
import {emptyFilesDateType} from '@/Redux/feature/guestsByDateSlice'
import NoFiles from '../components/errors/NoFiles'
import Error from '../components/errors/Error'
import SuccessModal from '@/components/modal/successModal';
import FailureModal from '../components/modal/FailureModal';
import UserCompanionsTable from '@/components/UserCompanionsTable'

// calendar styles
import 'react-calendar/dist/Calendar.css';

export default function RecentUser() {

  const router = useRouter();
  const dispatch = useDispatch();
  const videoRef = useRef();

  const formatDate = (date)=>{
    const timezoneOffset = date.getTimezoneOffset() * 60000
    const adjustedDate = new Date(date.getTime() - timezoneOffset)
    return adjustedDate.toISOString().split('T')[0]
  }


  const [isSubmitting, setIsSubmitting] = useState(false)
  const [calendarPopUp, setCalendarPopUp] = useState(false)

  const [dateRange, setDateRange] = useState({
    startDate:'2022-01-01', endDate:formatDate(new Date())
  })
  
  const [selectedFilter, setSelectedFilter] = useState('All')
  const filteredCustomers = useSelector((state) => state.guestsByDate?.guestDateResult?.guests)
  const getDateStatus = useSelector((state) => state.guestsByDate?.status)

  const [data, setData] = useState(filteredCustomers)
  const [openPopup, setOpenPopup] = useState(null);
  const [fail, setFail] = useState({
    open:false,
    message: '',
    failMessage: ''
  })
  const [success, setSuccess] = useState({
    open:false,
    message: ''
  })
  const [pageNum, setPageNum] = useState(1)
  const [userCompanions, setUserCompanions] = useState(null)

  useEffect(() => {
dispatch(guestsByDate({dateRange, pageNum}));
  }, [dateRange, pageNum]);


useEffect(() => {  
setData(filteredCustomers)  
}, [filteredCustomers]);

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



  const handleCameraButtonClick = async () => {
    try {
      const constraints = { video: true };
      console.log(constraints)
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      videoRef.current.srcObject = stream;
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const handleLogout = async () => {

    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    }
    const response = await axios
      .post("/api/auth/logout", { }, headers)
      .catch((error) => {
        setIsSubmitting(false)
        const { data } = error.response
        setErrors((prev) => ({ ...prev, form: data.error }))
        console.log({ error })
      })
      .finally(() => {
        setIsSubmitting(false)
      })
    if (response) {
      const { success, data } = response.data
      console.log({ data })
      if (success) router.push("/auth/login")
    }

  };

  const filterDays = (days) =>{
    setPageNum(1)
    setSelectedFilter(days)

    let endDate = new Date()
    endDate = formatDate(endDate)
  
  
    let startDate = new Date()
    startDate.setDate(startDate.getDate() - days);  // Subtracting days from the current date
    startDate =  formatDate(startDate);

    setDateRange({startDate, endDate})
  }


  const submitCustomDate = () =>{
  setCalendarPopUp(false)
  dispatch(guestsByDate({dateRange, pageNum})) 
  }

  const setAllFiles = ()=>{
    setPageNum(1)
    setSelectedFilter('All')
    setDateRange({startDate:'2022-10-10', endDate:formatDate(new Date())})
  }

  // download csv file
  const downloadAsCSV = (csvData, fileName) =>{
    console.log(csvData)
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });

    // Create a temporary download link
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = fileName;
  
    // Trigger the download by clicking the link
    downloadLink.click();
  } 

  const downloadFiles = () =>{
   var requestOptions = {
   method: 'GET',
  redirect: 'follow'
  };
  fetch(`../api/guests/recent-guest/download?page=${pageNum}&per_page=20&fromDate=${dateRange.startDate}&toDate=${dateRange.endDate}`, requestOptions)
    .then(response => response.text())
    .then(result => downloadAsCSV(result, 'data.csv'))
    .catch(error => console.log('error', error));
  }


  return (
      <AuthGuard>
     
        <>
      <UserCompanionsTable userCompanions={userCompanions} setUserCompanions={setUserCompanions}/>
      <SuccessModal send={success.open} setSend={setSuccess} message={success.message}/>
      <FailureModal fail={fail.open} setFail={setFail} message={fail.message} failMsg={fail.failMessage}/>
        
    {calendarPopUp && <section className=" absolute z-[9999999] h-screen w-full flex justify-center items-center bg-black/75">

      <div className=' min-h-[300px] p-10 flex flex-col gap-8 rounded-xl bg-white'>
      <div className='flex justify-between '>
        <h5 className='font-bold'>Select a date range</h5> <button onClick={()=>{setCalendarPopUp(false)}}>close</button>
        </div>

        <div className='flex gap-24 date_picker min-h-[350px]'>
          <article className='start_calendar'>
          <Calendar value={dateRange.startDate} onChange={(date)=> setDateRange(prev=>({...prev, startDate:formatDate(date)}))}/>
          </article>
          <article className='end_calendar'>
          <Calendar value={dateRange.endDate} onChange={(date)=> setDateRange(prev=>({...prev, endDate:formatDate(date)}))}/>
          </article>
        </div>
<button onClick={submitCustomDate} className='bg-[#FCCC04] rounded-md p-2 px-3 mt-auto self-end'>Filter</button>
      </div>
      
      
  
      </section>}

   <Layout>
      
   <div className="lg:py-10 lg:px-12 p-5">
        {/* <div className='flex justify-between items-center'> */}
          
        <div className='flex items-center mt-4 justify-between'>
            <div className='font-bold text-[20px]'>Recent Guests</div>
            {/* <div className='mx-7 bg-[#F5F5F5] py-1 px-6 rounded-lg'>{customerFiles.pagination.total_records}</div> */}
            <div className="flex space-x-4">

            <button onClick={() => router.push('/all-companions')} className='py-2 px-8 textsm font-bold bg-[#fef2c0] rounded-lg shadow-md inline-flex items-center'>
              {/* <svg className= 'mr-2' width="11" height="16" viewBox="0 0 11 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.83317 13H7.1665" stroke="#333333" stroke-width="1.2" stroke-linecap="round" strokeLinecap="round"/>
              <path d="M8.5 14.3333V11.6667" stroke="#333333" stroke-width="1.2" stroke-linecap="round" strokeLinecap="round"/>
              <path d="M5.60673 7.24668C5.54006 7.24001 5.46006 7.24001 5.38673 7.24668C3.80006 7.19334 2.54006 5.89334 2.54006 4.29334C2.5334 2.66001 3.86006 1.33334 5.4934 1.33334C7.12673 1.33334 8.4534 2.66001 8.4534 4.29334C8.4534 5.89334 7.18673 7.19334 5.60673 7.24668Z" stroke="#333333" stroke-width="1.2" stroke-linecap="round" strokeLinecap="round"/>
              <path d="M5.49336 14.54C4.28003 14.54 3.07336 14.2333 2.15336 13.62C0.540026 12.54 0.540026 10.78 2.15336 9.70668C3.98669 8.48002 6.99336 8.48002 8.82669 9.70668" stroke="#333333" stroke-width="1.2" stroke-linecap="round" strokeLinecap="round"/>
              </svg> */}
              All Companions
            </button>

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
                <li className={`${selectedFilter == 'All' ? 'border-b-4 font-bold border-black' : 'border-b-4 border-[rgb(0,0,0,0)]'}`} onClick={ setAllFiles}>All</li>
                <li className={`${selectedFilter == '7' ? 'border-b-4 font-bold border-black' : 'border-b-4 border-[rgb(0,0,0,0)]'}`} onClick={()=>filterDays(7)}>Last 7 days</li>
                <li className={`${selectedFilter == '30' ? 'border-b-4 font-bold border-black'  : 'border-b-4 border-[rgb(0,0,0,0)]'}`}onClick={()=>filterDays(30)}>Last 30 days</li>
                <li className={`${selectedFilter == '90' ? 'border-b-4 font-bold border-black'  : 'border-b-4 border-[rgb(0,0,0,0)]'}`} onClick={()=>filterDays(90)}>Last 90 days</li>
                <li className={`${selectedFilter == 'Custom' ? 'border-b-4 font-bold border-black'  
                : 'border-b-4 border-[rgb(0,0,0,0)]'}`} onClick={()=>{
                  setSelectedFilter('Custom')
                  setCalendarPopUp(true)}}>Custom</li>
              </ul>
            </button>

            <button onClick={downloadFiles} className='font-bold bg-[#ffffff] py-2 px-8 rounded-lg shadow-md inline-flex items-center'>
              <svg className= 'mr-2' width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M9.84975 7.17116L8 9.11428V0.555556C8 0.248731 7.77614 0 7.5 0C7.22386 0 7 0.248731 7 0.555556V9.08224L5.18075 7.17116C4.96775 6.94295 4.62175 6.94295 4.40975 7.17116C4.19675 7.39937 4.19675 7.77171 4.40975 7.99992L6.35975 10.0494C7.00075 10.7384 8.03175 10.7363 8.67075 10.0494L10.6208 7.99992C10.8338 7.77171 10.8338 7.39937 10.6208 7.17116C10.4088 6.94295 10.0627 6.94295 9.84975 7.17116ZM15 10V13.0059C15 14.1072 14.1055 15 13.0059 15H2.00969C0.908396 15 0.015625 14.1055 0.015625 13.0059V10H1.01562V13.0059C1.01562 13.5539 1.46142 14 2.00969 14H13.0059C13.5539 14 14 13.5542 14 13.0059V10H15Z" fill="#444444"/>
              </svg>
              Download
            </button>

            <div className='relative drop-down cursor-pointer font-bold bg-[#FFCC04]  py-2 px-8 rounded-lg shadow-md inline-flex gap-2 items-center'>
            <svg className= 'mr-2' width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
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

           <th className='font-mtnwork  h-4 text-left text-xs font-medium text-[#111111]'>
             <div className="flex items-center">
               <p className="pr-2 text-[14px] font-bold">  </p>
             </div>
           </th>
           <th></th>
         </tr>
       </thead>
       <tbody className="mb-10 h-full overflow-y-auto">
         {getDateStatus === 'loading' ? (
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

         ) : getDateStatus === 'failed' || !filteredCustomers ? (
           // error state 
           <tr>
             <td colSpan={8} className='mb-0 text-center'>
               <Error />
             </td>
           </tr>
         ) : data?.length === 0 ? (
           // no files returning from the backend component 
           <tr>
             <td colSpan={8} className='mb-0 text-center'>
               <NoFiles />
             </td>
           </tr>
         ) : (
           <>
             {data &&
               data?.map((el) => (
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

                   {/* phone  */}
                   <td className='font-mtnwork text-xs text-[#667085]'>
                     <p className=''>
                       {el?.telephone}
                       {/* {truncatePhone(el?.telephone)} */}
                     </p>
                   </td>

                   {/* email */}
                   {/* <td className='font-mtnwork mt-7  text-xs text-[#667085]' onClick={toggleShowEmail}>
                     <p>{showEmail ? el?.email : truncateEmail(el?.email)}</p>
                   </td> */}

                    {/* band */}
                    <td className='font-mtnwork mt-7  text-xs text-[#667085]'>
                    <p className=''>
                       {el?.band}
                     </p>
                   </td>

                   {/* check in */}
                   <td className='font-mtnwork mt-7  text-xs text-[#667085]'>
                     <p>{el?.checkin?.split(" ")[0]}
                     <br />
                   <span className='font-bold'> {el?.checkin?.split(" ")[1]}{el?.checkin?.split(" ")[2]}</span> 
                     </p>
                   </td>
                    {/* check out */}
                   <td className='font-mtnwork mt-7  text-xs text-[#667085]'>
                     <p>{el?.checkout?.split(" ")[0]}
                     <br />
                     <span className='font-bold'>{el?.checkout?.split(" ")[1]}{el?.checkout?.split(" ")[2]}</span>
                     </p>
                   </td>

                    <td className='font-mtnwork mt-7  text-xs text-[#667085]'>
                     <p>{el?.created_at?.split("T")[0].split(",")[0]}</p>
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

    {getDateStatus !== "loading" && data?.length > 0   && <div className='flex justify-center mt-5'>
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

      {<button disabled={data?.length !== 20} onClick={()=>setPageNum(prev=> prev + 1)} className='ml-auto flex font-bold items-center 
      justify-between w-32 border-2 p-2 rounded-md disabled:opacity-25'>
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
