import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import errorImg from "@/assets/images/error.png";
import { useDispatch, useSelector } from 'react-redux';
import { fetchCustomerFiles } from '@/Redux/feature/getFileSlice';
import { openModal, getDeleteId } from '@/Redux/feature/deleteFileSlice';
import NoFiles from './errors/NoFiles'
import Error from './errors/Error'
import SuccessModal from '@/components/modal/successModal';
import FailureModal from "./modal/FailureModal";
import axios from "axios";


const Table = ({
  data,
  currentPage,
  nextPageHandler,
  previousPageHandler,
  pagReq,
  typeOfTable = false, //show admit option?
}) => {
  const getFileStatus = useSelector((state) => state.files.status);

  const searchData = useSelector((state) => state.search.searchResult?.customers);
  const searchRequest = useSelector((state) => state.search.searchRequest);
  const searchStatus = useSelector((state) => state.search.status);
  const searchPagination = useSelector((state) => state.search.searchResult?.pagination);
  const [success, setSuccess] = useState(false);
  const [fail, setFail] = useState(false);


  // console.log({searchPagination})

  const [tableData, setTableData] = useState(data);
  const [openPopup, setOpenPopup] = useState(null);
  const [showEmail, setShowEmail] = useState(false);

  const toggleShowEmail = () => {
    setShowEmail(!showEmail);
  };

  // create a function that only returns a certain amount of characters.
  const truncatePhone = (input) =>
    input.length > 5 ? `${input.substring(0, 4)}***` : input;

  const truncateEmail = (input) =>
    input.length > 2 ? `${input.substring(0, 4)}***@***` : input;

  const dispatch = useDispatch();

  const router = useRouter();

  useEffect(() => {
    dispatch(fetchCustomerFiles());
  }, [dispatch]);

  useEffect(() => {
    setTableData(data);
  }, [data])

  useEffect(() => {
    if (searchRequest?.length > 20 || searchData?.length > 0) {
      setTableData(searchData);
    }
  }, [searchRequest?.length, searchData, searchData?.length]);

  const deleteHandler = (id) => {
    // if (openPopup === null) {
    setOpenPopup(id);
    dispatch(openModal());
    dispatch(getDeleteId(id));
    // }
  };

  const editHandler = (id) => {
    router.push(`/${id}`)

    // dispatch(getEditId(id))

  };

  const admitCustomerHandler = (msnid) => {
    

    const url = `../api/customers/verify/${msnid}`;
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  
   (async ()=> {
   
    try {
      const response = await axios.get(url, { headers });
      const customer = response.data;

      if(customer){
        setSuccess(true);
        console.log('Admited Success')
      }

      // setData(JSON.stringify(customer));
      // setStatus(customer.success)
      // setCustomerFName(customer.data.customer.fname)
      // setCustomerLName(customer.data.customer.lname)
      } catch (error) {
        setFail(true)
        console.log('Error faced: ' + error.message)
        console.log('Admited Failed')

    }
  }) ();


  };


  



  // console.log('tableData', tableData)

  const renderPagination = () => {
    if (
      (!pagReq?.next_page_url && !pagReq?.prev_page_url && searchRequest < 3) ||
      (!searchPagination?.next_page_url &&
        !searchPagination?.prev_page_url &&
        searchRequest.length > 2)
    )
      return null;
    else if (
      (pagReq?.next_page_url && !pagReq?.prev_page_url && searchRequest < 3) ||
      (searchPagination?.next_page_url &&
        !searchPagination?.prev_page_url &&
        searchRequest.length > 2)
    ) {
      return (
        <nav aria-label='Page navigation example' className='text-end'>
          <ul className='lg:mt-[2rem] mb-[2rem] inline-flex items-center -space-x-px'>
            <li>
              <p className='border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'>
                Page {currentPage}
              </p>
            </li>
            <li>
              <button
                onClick={nextPageHandler}
                className='block rounded-r-lg border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-500 hover:bg-[#FCCC04] hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
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
                    d='M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z'
                    clipRule='evenodd'
                  ></path>
                </svg>
              </button>
            </li>
          </ul>
        </nav>
      );
    } else if (
      (pagReq?.next_page_url && pagReq?.prev_page_url) ||
      (searchPagination?.next_page_url &&
        searchPagination?.prev_page_url &&
        searchRequest.length > 2)
    ) {
      return (
        <nav aria-label='Page navigation example' className='text-end'>
          <ul className='mt-[2rem] mb-[2rem] inline-flex items-center -space-x-px'>
            <li>
              <button
                onClick={previousPageHandler}
                className='ml-0 block rounded-l-lg border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-500 hover:bg-[#FCCC04] hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
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
              </button>
            </li>
            <li>
              <p className='border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'>
                Page {currentPage}
              </p>
            </li>
            <li>
              <button
                onClick={nextPageHandler}
                className='block rounded-r-lg border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-500 hover:bg-[#FCCC04] hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
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
                    d='M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z'
                    clipRule='evenodd'
                  ></path>
                </svg>
              </button>
            </li>
          </ul>
        </nav>
      );
    } else if (
      (pagReq?.prev_page_url && searchRequest < 3) ||
      (searchRequest.length > 2 && searchPagination?.prev_page_url)
    ) {
      return (
        <nav aria-label='Page navigation example' className='text-end'>
          <ul className='mt-[2rem] mb-[2rem] inline-flex items-center -space-x-px'>
            <li>
              <button
                onClick={previousPageHandler}
                className='ml-0 block rounded-l-lg border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-500 hover:bg-[#FCCC04] hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
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
              </button>
            </li>
            <li>
              <p className='border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'>
                Page {currentPage}
              </p>
            </li>
          </ul>
        </nav>
      );
    }
  };



  return (
    <div className='mt-[15px]'>
 <table className='w-full z-[9999999]'>
        <thead className="bg-[#F6F6F6]">
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
            <th className='font-mtnwork h-4  text-left text-xs font-medium text-[#111111]'>
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
                <p className="pr-2 text-[14px] font-bold"> Last Visit </p>
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
        <tbody className="mb-10 h-full  overflow-y-auto">
          {getFileStatus === "loading" || searchStatus === "loading" ? (
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

            //former loading component
            // <tr className='mx-auto w-full animate-pulse rounded-md p-4 shadow'>
            //   <td className='space-y-10 py-1'>
            //     <p className='h-10 w-full space-y-3 rounded bg-slate-200'></p>
            //     <p className='h-10 space-y-3 rounded bg-slate-200'></p>
            //     <p className='h-10 space-y-3 rounded bg-slate-200'></p>
            //     <p className='h-10 space-y-3 rounded bg-slate-200'></p>
            //     <p className='h-10 space-y-3 rounded bg-slate-200'></p>
            //   </td>
            //   <td className='space-y-10 py-4'>
            //     <p className='h-10  space-y-3 rounded bg-slate-200'></p>
            //     <p className='h-10 space-y-3 rounded bg-slate-200'></p>
            //     <p className='h-10 space-y-3 rounded bg-slate-200'></p>
            //     <p className='h-10 space-y-3 rounded bg-slate-200'></p>
            //     <p className='h-10 space-y-3 rounded bg-slate-200'></p>
            //   </td>
            //   <td className='space-y-10 py-1'>
            //     <p className='h-10 w-full space-y-3 rounded bg-slate-200'></p>
            //     <p className='h-10 space-y-3 rounded bg-slate-200'></p>
            //     <p className='h-10 space-y-3 rounded bg-slate-200'></p>
            //     <p className='h-10 space-y-3 rounded bg-slate-200'></p>
            //     <p className='h-10 space-y-3 rounded bg-slate-200'></p>
            //   </td>
            //   <td className='space-y-10 py-1'>
            //     <p className='h-10 w-full space-y-3 rounded bg-slate-200'></p>
            //     <p className='h-10 space-y-3 rounded bg-slate-200'></p>
            //     <p className='h-10 space-y-3 rounded bg-slate-200'></p>
            //     <p className='h-10 space-y-3 rounded bg-slate-200'></p>
            //     <p className='h-10 space-y-3 rounded bg-slate-200'></p>
            //   </td>
            //   <td className='space-y-10 py-1'>
            //     <p className='h-10 w-full space-y-3 rounded bg-slate-200'></p>
            //     <p className='h-10 space-y-3 rounded bg-slate-200'></p>
            //     <p className='h-10 space-y-3 rounded bg-slate-200'></p>
            //     <p className='h-10 space-y-3 rounded bg-slate-200'></p>
            //     <p className='h-10 space-y-3 rounded bg-slate-200'></p>
            //   </td>
            //   <td className='space-y-10 py-1'>
            //     <p className='h-10 w-full space-y-3 rounded bg-slate-200'></p>
            //     <p className='h-10 space-y-3 rounded bg-slate-200'></p>
            //     <p className='h-10 space-y-3 rounded bg-slate-200'></p>
            //     <p className='h-10 space-y-3 rounded bg-slate-200'></p>
            //     <p className='h-10 space-y-3 rounded bg-slate-200'></p>
            //   </td>
            // </tr>
          ) : getFileStatus === "failed" ? (
            // error state 
            <tr>
              <td colSpan={8} className='mb-0 text-center'>
                <Error />
              </td>
            </tr>
          ) : data?.length === 0 &&
            searchData?.length < 1 &&
            searchRequest?.length < 1 ? (
            // no files returning from the backend component 
            <tr>
              <td colSpan={8} className='mb-0 text-center'>
                <NoFiles />
              </td>
            </tr>
          ) : searchData?.length < 1 && searchRequest?.length > 2 ? (
            // no documents in storage from search keywords 

            <tr>
              <td colSpan={8} className='text-center '>
                <div className='m-auto mt-6 flex flex-col items-center justify-center text-center md:w-4/12'>
                  <Image src={errorImg} alt='Error' />

                  <h4 className='font-mtnwork text-base  font-medium'>
                    No Customer found...
                  </h4>
                  <p className='font-mtnwork m-auto w-60 text-sm text-[#667085]'>
                    Please ensure you input the right user name.
                  </p>
                </div>
              </td>
            </tr>
          ) : (
            <>
              {tableData &&
                tableData?.map((el) => (
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
                        <div title={el?.fname} className="flex items-center">
                          <p className='text-sm font-medium lg:block pl-2 max-w-[400px]'>
                            {el?.fname} {el?.lname}
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

                    {/* last visit */}
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
                          { typeOfTable && <p onClick={() => admitCustomerHandler(el?.telephone)} className='cursor-pointer rounded-t-lg border-gray-300 bg-lime-500 p-2 text-xs text-white'>
                            Admit User
                          </p>}
                          <p onClick={() => editHandler(el?.uuid)} className='cursor-pointer rounded-b-xl  border-b-2 border-gray-100 p-2 text-xs hover:bg-gray-300'>
                            Edit
                          </p>
                          <p onClick={() => deleteHandler(el?.uuid)} className='cursor-pointer rounded-b-xl border-gray-300 bg-red-600 p-2 text-xs text-white'>
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
      <div className="pb-24">
        {getFileStatus === "loading" ? null : renderPagination()}
        
      </div>
      
    </div>
  );
}

export default Table