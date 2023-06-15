import React, { useState } from 'react'
import Header from './Header';

import DeleteModal from "../modal/DeleteModal";


const Layout = ({ children }) => {

  return (
    <>
      <DeleteModal />
      <div className="w-full h-full">
        <Header />
        <div>
          {children}
        </div>
      </div>
    </>
  )
}

export default Layout