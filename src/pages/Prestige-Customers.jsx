import { useEffect } from 'react';
import Layout from '@/components/layout/Layout'
import Table from '@/components/Table'
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import {
  defPage,
  fetchCustomerFiles,
  nextPage,
  prevPage,
} from "@/Redux/feature/getFileSlice";
import AuthGuard from '../components/guards/AuthGuard';



export default function PrestigeCustomer() {

  const customerFiles = useSelector((state) => state.files.customerFiles?.customers);
  const totalRecords = useSelector((state) => state.files.customerFiles?.pagination?.total_records)
  const allDocData = useSelector((state) => state.files.customerFiles?.pagination);
  const page = useSelector((state) => state.files.customerFiles?.pagination?.current_page);


  const router = useRouter();
  const dispatch = useDispatch();

  const nextPageHandler = () => {
    dispatch(nextPage());
    dispatch(fetchCustomerFiles(page + 1));
  };

  const previousPageHandler = async () => {
    dispatch(prevPage());
    dispatch(fetchCustomerFiles(page - 1));
  };

  useEffect(() => {
    dispatch(fetchCustomerFiles(page));
  }, [dispatch, page]);
  useEffect(() => {
    dispatch(defPage());
  }, [dispatch]);

  return (
    <AuthGuard>
      <Layout>
        <div className="lg:py-24 lg:px-32 p-5">
          <div className='flex justify-between mt-4 items-center'>
            <div className='flex items-center'>
              <div className='font-bold text-[20px]'>Prestige Customers</div>
              <div className='mx-7 bg-[#F5F5F5] py-1 px-6 rounded-lg'>{totalRecords ? totalRecords : 0}</div>
            </div>

            <div className="flex space-x-4">
            <button onClick={() => router.push('/add-new-customer')} className='bg-[#FCCC04] py-2 px-8 rounded-lg shadow-md inline-flex items-center'>
              <svg className= 'mr-2' width="11" height="16" viewBox="0 0 11 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.83317 13H7.1665" stroke="#333333" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M8.5 14.3333V11.6667" stroke="#333333" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M5.60673 7.24668C5.54006 7.24001 5.46006 7.24001 5.38673 7.24668C3.80006 7.19334 2.54006 5.89334 2.54006 4.29334C2.5334 2.66001 3.86006 1.33334 5.4934 1.33334C7.12673 1.33334 8.4534 2.66001 8.4534 4.29334C8.4534 5.89334 7.18673 7.19334 5.60673 7.24668Z" stroke="#333333" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M5.49336 14.54C4.28003 14.54 3.07336 14.2333 2.15336 13.62C0.540026 12.54 0.540026 10.78 2.15336 9.70668C3.98669 8.48002 6.99336 8.48002 8.82669 9.70668" stroke="#333333" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Add Customer
            </button>
              <button onClick={() => router.push('/recent-guests')} className='bg-[#ffffff] py-2 px-8 rounded-lg shadow-md inline-flex items-center'>
                <svg className= 'mr-2' width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.6663 6.50001C14.393 6.50001 14.1663 6.27334 14.1663 6.00001V4.66668C14.1663 2.94668 13.053 1.83334 11.333 1.83334H4.66634C2.94634 1.83334 1.83301 2.94668 1.83301 4.66668V6.00001C1.83301 6.27334 1.60634 6.50001 1.33301 6.50001C1.05967 6.50001 0.833008 6.27334 0.833008 6.00001V4.66668C0.833008 2.37334 2.37301 0.833344 4.66634 0.833344H11.333C13.6263 0.833344 15.1663 2.37334 15.1663 4.66668V6.00001C15.1663 6.27334 14.9397 6.50001 14.6663 6.50001Z" fill="#444444"/>
                <path d="M11.333 15.1667H4.66634C2.37301 15.1667 0.833008 13.6267 0.833008 11.3333V10C0.833008 9.72667 1.05967 9.5 1.33301 9.5C1.60634 9.5 1.83301 9.72667 1.83301 10V11.3333C1.83301 13.0533 2.94634 14.1667 4.66634 14.1667H11.333C13.053 14.1667 14.1663 13.0533 14.1663 11.3333V10C14.1663 9.72667 14.393 9.5 14.6663 9.5C14.9397 9.5 15.1663 9.72667 15.1663 10V11.3333C15.1663 13.6267 13.6263 15.1667 11.333 15.1667Z" fill="#444444"/>
                <path d="M14.6663 8.5H1.33301C1.05967 8.5 0.833008 8.27333 0.833008 8C0.833008 7.72667 1.05967 7.5 1.33301 7.5H14.6663C14.9397 7.5 15.1663 7.72667 15.1663 8C15.1663 8.27333 14.9397 8.5 14.6663 8.5Z" fill="#444444"/>
                <path d="M11.0003 6.00001H5.00033C4.81366 6.00001 4.66699 5.85334 4.66699 5.66668V4.33334C4.66699 3.78001 5.11366 3.33334 5.66699 3.33334H10.3337C10.887 3.33334 11.3337 3.78001 11.3337 4.33334V5.66668C11.3337 5.85334 11.187 6.00001 11.0003 6.00001Z" fill="#444444"/>
                <path d="M11.0003 10H5.00033C4.81366 10 4.66699 10.1467 4.66699 10.3333V11.6667C4.66699 12.22 5.11366 12.6667 5.66699 12.6667H10.3337C10.8803 12.6667 11.3337 12.22 11.3337 11.6667V10.3333C11.3337 10.1467 11.187 10 11.0003 10Z" fill="#444444"/>
                </svg>
                Recent
              </button>
            </div>
          </div>
          <Table
            data={customerFiles}
            currentPage={page}
            nextPageHandler={nextPageHandler}
            previousPageHandler={previousPageHandler}
            pagReq={allDocData}
            typeOfTable={true}
          />
        </div>
      </Layout>
    </AuthGuard>
 
  )
}

/* export const getServerSideProps = withSession(async function ({ req, res }) {
  const { user } = req.session;

  if (!user) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return {
    props: { user },
  };
}); */
