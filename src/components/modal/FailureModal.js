import { useDispatch, useSelector } from 'react-redux';
import { toggleModal } from '@/Redux/feature/addCustomerSlice';

const FailureModal = ({ fail, setFail, failMsg, message }) => {
  // console.log('fail', fail);

  const dispatch = useDispatch();

  if (fail)
    return (
      <div
        className="absolute z-[9999999] flex h-screen w-screen items-center justify-center bg-gray-700  bg-opacity-25"
        onClick={() => setFail(false)}
      >
        <div className="w-64 rounded-3xl bg-white px-7 pt-10 pb-10 text-center">
          <svg
            className="checkmark_failure "
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 52 52"
          >
            <circle
              className="checkmark__circle_failure"
              cx="26"
              cy="26"
              r="25"
              fill="none"
            />

            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="#FBCC04"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="white"
              className="checkmark__check "
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </svg>
          <h4 className="font-mtnwork text-xl">Unable to {message}</h4>
          <p className="my-2 font-mtnwork text-sm font-normal">{failMsg}</p>
        </div>
      </div>
    );
};

export default FailureModal;
