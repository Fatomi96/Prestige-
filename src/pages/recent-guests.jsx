import React, { useRef, useState } from 'react';
import { useEffect } from 'react';
import Layout from '@/components/layout/Layout'
import Table from '@/components/Table'
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCustomerFiles } from "@/Redux/feature/getFileSlice";
import axios from "axios"
import AuthGuard from '../components/guards/AuthGuard';



export default function RecentUser() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  const customerFiles = useSelector((state) => state.files.customerFiles.customers);
  // const allDocData = useSelector((state) => state.files.recentDoc);
  // const [tableIsShowing, setTableIsShowing] = useState(true);
  const router = useRouter();
  const dispatch = useDispatch();


  useEffect(() => {
    dispatch(fetchCustomerFiles());
  }, [dispatch]);

  const videoRef = useRef();

  const handleCameraButtonClick = async () => {
    try {
      const constraints = { video: true };
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

  return (
    <AuthGuard>
    <Layout>
      <div className="lg:py-24 lg:px-32 p-5">
        {/* <div className='flex justify-between items-center'> */}
          <div className='flex items-center mt-4 justify-between'>
            <div className='font-bold text-[20px]'>Recent Guests</div>
            {/* <div className='mx-7 bg-[#F5F5F5] py-1 px-6 rounded-lg'>{customerFiles.pagination.total_records}</div> */}
            <div className="flex space-x-4">
            <button className='font-bold bg-[#ffffff] py-2 px-8 rounded-lg shadow-md inline-flex items-center'>
              <svg className= 'mr-2' width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M9.84975 7.17116L8 9.11428V0.555556C8 0.248731 7.77614 0 7.5 0C7.22386 0 7 0.248731 7 0.555556V9.08224L5.18075 7.17116C4.96775 6.94295 4.62175 6.94295 4.40975 7.17116C4.19675 7.39937 4.19675 7.77171 4.40975 7.99992L6.35975 10.0494C7.00075 10.7384 8.03175 10.7363 8.67075 10.0494L10.6208 7.99992C10.8338 7.77171 10.8338 7.39937 10.6208 7.17116C10.4088 6.94295 10.0627 6.94295 9.84975 7.17116ZM15 10V13.0059C15 14.1072 14.1055 15 13.0059 15H2.00969C0.908396 15 0.015625 14.1055 0.015625 13.0059V10H1.01562V13.0059C1.01562 13.5539 1.46142 14 2.00969 14H13.0059C13.5539 14 14 13.5542 14 13.0059V10H15Z" fill="#444444"/>
              </svg>
              Download
            </button>
              <button onClick={() => handleCameraButtonClick} className='font-bold bg-[#FFCC04] py-2 px-8 rounded-lg shadow-md inline-flex items-center'>
                <svg className= 'mr-2' width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.6663 6.50001C14.393 6.50001 14.1663 6.27334 14.1663 6.00001V4.66668C14.1663 2.94668 13.053 1.83334 11.333 1.83334H4.66634C2.94634 1.83334 1.83301 2.94668 1.83301 4.66668V6.00001C1.83301 6.27334 1.60634 6.50001 1.33301 6.50001C1.05967 6.50001 0.833008 6.27334 0.833008 6.00001V4.66668C0.833008 2.37334 2.37301 0.833344 4.66634 0.833344H11.333C13.6263 0.833344 15.1663 2.37334 15.1663 4.66668V6.00001C15.1663 6.27334 14.9397 6.50001 14.6663 6.50001Z" fill="#444444"/>
                <path d="M11.333 15.1667H4.66634C2.37301 15.1667 0.833008 13.6267 0.833008 11.3333V10C0.833008 9.72667 1.05967 9.5 1.33301 9.5C1.60634 9.5 1.83301 9.72667 1.83301 10V11.3333C1.83301 13.0533 2.94634 14.1667 4.66634 14.1667H11.333C13.053 14.1667 14.1663 13.0533 14.1663 11.3333V10C14.1663 9.72667 14.393 9.5 14.6663 9.5C14.9397 9.5 15.1663 9.72667 15.1663 10V11.3333C15.1663 13.6267 13.6263 15.1667 11.333 15.1667Z" fill="#444444"/>
                <path d="M14.6663 8.5H1.33301C1.05967 8.5 0.833008 8.27333 0.833008 8C0.833008 7.72667 1.05967 7.5 1.33301 7.5H14.6663C14.9397 7.5 15.1663 7.72667 15.1663 8C15.1663 8.27333 14.9397 8.5 14.6663 8.5Z" fill="#444444"/>
                <path d="M11.0003 6.00001H5.00033C4.81366 6.00001 4.66699 5.85334 4.66699 5.66668V4.33334C4.66699 3.78001 5.11366 3.33334 5.66699 3.33334H10.3337C10.887 3.33334 11.3337 3.78001 11.3337 4.33334V5.66668C11.3337 5.85334 11.187 6.00001 11.0003 6.00001Z" fill="#444444"/>
                <path d="M11.0003 10H5.00033C4.81366 10 4.66699 10.1467 4.66699 10.3333V11.6667C4.66699 12.22 5.11366 12.6667 5.66699 12.6667H10.3337C10.8803 12.6667 11.3337 12.22 11.3337 11.6667V10.3333C11.3337 10.1467 11.187 10 11.0003 10Z" fill="#444444"/>
                </svg>
                Scan QR Code
              </button>
              <video ref={videoRef} autoPlay muted style={{ display: 'none' }} />
            </div>
          </div>
        
        {/* </div> */}
        <Table data={customerFiles} />
        {/* <button type="button" onClick={handleLogout} class="bg-[#FCCC04] focus:ring-4 focus:outline-none focus:ring-white-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center">
        Logout
          <svg aria-hidden="true" className="w-5 h-5 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
        </button> */}
      </div>
    </Layout>
    </AuthGuard>
  )
}
