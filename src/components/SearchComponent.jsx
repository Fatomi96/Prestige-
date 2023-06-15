import React, { useEffect, useState } from 'react'

import {
  defPage,
  fetchCustomerFiles
} from "@/Redux/feature/getFileSlice";
import { useDispatch, useSelector } from 'react-redux';

import {
  addSearchData,
  emptySearch,
  searchFiles,
} from "@/Redux/feature/searchSlice";


function SearchComponent() {

  const searchRequest = useSelector((state) => state.search.searchRequest);

  // console.log({ searchRequest })

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCustomerFiles(1))
  }, [dispatch]);

  // const searchHandler = (e) => {
  //   if (e.target.value == '') {
  //     dispatch(fetchCustomerFiles(1))
  //   }
  //   if (e.target.value.length === 0) {
  //     dispatch(defPage());
  //     // dispatch(emptySearch());
  //   }
  //   if (e.target.value.length > 2) {
  //     let payload;
  //     payload = {
  //       value: e.target.value,
  //     }
  //     dispatch(searchFiles(payload));
  //   }
  //   dispatch(addSearchData(e.target.value));
  // }

  const searchHandler = (e) => {
    if (e.target.value == '') {
      dispatch(emptySearch());
      dispatch(fetchCustomerFiles(1))
    }
    dispatch(addSearchData(e.target.value));
  }

  const handleSearch = () => {
    if (searchRequest) {
      let payload;
      payload = {
        value: searchRequest,
      }
      dispatch(searchFiles(payload));
    } else {
      dispatch(defPage());
      dispatch(emptySearch());
      dispatch(fetchCustomerFiles(1));
    }
  }

  return (
    <>
      <div className=''>
        <svg
          width='22'
          height='21'
          viewBox='0 0 25 24'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          className='absolute r-0 l-0 mt-2 ml-2'
        >
          <path
            d='M11.8856 21C17.2627 21 21.6217 16.7467 21.6217 11.5C21.6217 6.25329 17.2627 2 11.8856 2C6.50843 2 2.14941 6.25329 2.14941 11.5C2.14941 16.7467 6.50843 21 11.8856 21Z'
            stroke='#ADA7A7'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M22.6465 22L20.5968 20'
            stroke='#ADA7A7'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
        <input
          className='rounded-tl-md rounded-bl-md border-black w-[450px] py-2 px-10 border border-opacity-20 focus:ring-0 focus:border-black'
          type='text'
          id='search'
          aria-label='search'
          placeholder='Search prestige members'
          value={searchRequest}
          onChange={(e) => searchHandler(e)}
        />
        <button onClick={handleSearch} className='bg-[#ADA7A7] py-2 px-4 rounded-tr-md rounded-br-md'>Search</button>
      </div>

    </>
  )
}

export default SearchComponent