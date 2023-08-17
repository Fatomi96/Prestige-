import React, { useEffect } from 'react'
import { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import axios from 'axios';


export default function ScanResult({}) {

  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(false);
  const [customerFName, setCustomerFName] = useState(null);
  const [customerLName, setCustomerLName] = useState(null);
  const pathname = router.pathname.slice(1)
  console.log('pathname', pathname);
  let neededData;
  
  // Authentication check
  const isLoggedIn = true; // Replace with your own authentication check logic
  

  const {msnid}  = router.query
  console.log('msnid', msnid);

  useEffect(() => {

    if (!isLoggedIn) {
      router.push('../login-lounge'); // Redirect to login page if not logged in
      return;
    }

    if (!msnid) {
      setLoading(false);
      return;
    }


    const url = `../api/customers/verify/${msnid}`;
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  
   (async ()=> {
   
    try {
      const response = await axios.get(url, { headers });
      const customer = response.data;

      setData(JSON.stringify(customer));
      setStatus(customer.success)
      setCustomerFName(customer.data.customer.fname)
      setCustomerLName(customer.data.customer.lname)
      } catch (error) {
       setData(JSON.stringify(error.response.data));
     
    }
  }) ();


  }, [isLoggedIn, msnid, router])


  async function VerifyCustomer() {

   neededData = JSON.parse(data)
  //  console.log('neededData', neededData); 
  //  console.log('neededData', neededData); 

  //  if(neededData.status !== undefined){
  //   setStatus(neededData.status)
  //  }
    

  }
  VerifyCustomer()
  

  if (loading || !neededData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div>Verifying Customer... please wait a bit</div>
      </div>
    );
  }
  
   
  

  return (<>



    {status && <>

      <div className="pop-up">
        <div className="flex justify-center items-center h-screen">
          <div className="flex flex-col justify-center min-w-48">
          <Image
              src='/images/checked.png'
              alt="Image"
              className=" h-auto mt-4 self-center"
              width={30}
              height={30}
          />
          <p className="text-center font-bold w-full">Guest admitted</p>

          <p className="text-center"><span style={{ fontWeight: 'bold' }}></span>{customerFName} {customerLName} is a prestige user</p>

          <button onClick={()=>{
        router.push({pathname:'/add-companion', query: {uuid}})
    }
      }
      className='p-2 px-3 gap-6 text-sm flex justify-between items-center text-black/80
     rounded-md font-bold bg-[#fef2c0] mt-3'>
          Admit companion
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

          <button className=" hover:bg-black/40 text-black font-bold py-2 px-4 rounded-md border-2 my-4" onClick={() => window.close()}>
              Close
          </button>
              
          </div>
      </div>
</div>
      


    </>} 

    {/* if data doesnt extist, show this */}

    {!status && <>

      <div className='pop-up'>
          
          <div className="flex justify-center items-center h-screen">
              <div className="flex flex-col justify-center items-center">
              <Image
              src='/images/crossed.png'
              alt="Image"
              className=" h-auto mt-4"
              width={30}
              height={30}
               />
              <p className="text-center">Not a prestige user</p>
              <p className="text-center">{msnid} is a NOT prestige user</p>
      
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full my-4" onClick={() => router.push('/recent-guests')}>
                  Close
              </button>
                  
              </div>
          </div> 
            
        </div>


    </>} 

   
  
  </>)
}


//Default script to call api in nextjs
// export async function getServerSideProps({ query }) {
//   const { customerId } = query;
//   console.log('query', query);
//   const url = `http://localhost:3000/api/customers/${customerId}`;
//   const headers = {
//     'Content-Type': 'application/json',
//     'Accept': 'application/json'
//   };

//   try {
//     const response = await axios.get(url, { headers });
//     const customer = response.data;
//     return {
//       props: {
//         customer,
//       },
//     };
//   } catch (error) {
//     console.error(error);
//     return {
//       props: {},
//     };
//   }
// }
