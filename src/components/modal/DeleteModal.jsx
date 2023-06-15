import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { deleteFileAction } from '@/lib/url';

import { closeModal, deleteFiles } from '@/Redux/feature/deleteFileSlice';

import { fetchCustomerFiles } from '@/Redux/feature/getFileSlice';

import FailureModal from './FailureModal';
import SuccessModal from './successModal';

const DeleteModal = () => {
  const [loading, setLoading] = useState(false);
  const [send, setSend] = useState(false);
  const [fail, setFail] = useState(false);

  const deleteId = useSelector((state) => state.deleteUser.id)

  const deleteFunc = useSelector((state) => state.deleteUser.modal);

  const customerFiles = useSelector((state) => state.files.customerFiles?.customers);


  const dispatch = useDispatch();

  const deleteUser = async () => {
    try {
      await deleteFileAction(deleteId);
  
      const updatedFiles = customerFiles.filter((user) => user.id !== deleteId);
      dispatch(fetchCustomerFiles(1, updatedFiles));
  
      setSend(true);
  
      setTimeout(() => {
        dispatch(closeModal());
      }, 2000);
    } catch (error) {
      console.error(error);
      setFail(true);
  
      setTimeout(() => {
        dispatch(closeModal());
      }, 2000);
    }
  };

  if (deleteFunc)
    return (
      <div className='fixed z-[9999999] flex h-screen w-screen items-center justify-center bg-gray-700  bg-opacity-25'>
        <div
          className='absolute h-screen w-screen'
          onClick={() => dispatch(closeModal())}
        ></div>
        <div className='z-[9999] mx-4  w-[300px] rounded-xl bg-white p-10 text-center'>
          <h3 className='text-base font-medium'>
            Are you sure you want to delete{' '}
          </h3>
          <div className='button-group mt-6 flex justify-between'>
            <button
              className='cursor-pointer rounded-lg border  border-gray-400 bg-white py-2 px-4 font-semibold text-gray-800 shadow hover:bg-gray-100'
              onClick={() => dispatch(closeModal())}
            >
              Cancel
            </button>
            <button
              className={`relative flex items-center rounded-lg border-2 border-red-600 bg-red-600 px-4 py-2 font-mtnwork text-sm font-medium text-white ${loading
                ? 'cursor-not-allowed opacity-60'
                : 'cursor-pointer opacity-100'
                }`}
              onClick={() => deleteUser()}
            >
              Delete
            </button>
          </div>
          <p className='mt-3 text-left text-xs font-medium text-red-600 '>
            Note:
            customer cannot be refrenced by anyone if deleted.
          </p>
        </div>
        <SuccessModal
          send={send}
          setSend={setSend}
          message='deleted'
        />
        <FailureModal
          fail={fail}
          message='delete'
          setFail={setFail}
        />
      </div>
    );
};

export default DeleteModal;
