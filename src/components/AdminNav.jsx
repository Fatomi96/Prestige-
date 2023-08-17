import React from 'react'
import { useRouter } from 'next/router';

const AdminNav = () => {
    const router = useRouter();

  return (
    <aside className='w-[13rem] border-r min-h-screen sticky'>
        <ul className='space-y-6 cursor-pointer p-4 font-bold text-gray-400'>
          
            <li className={router.pathname === '/admin/admin-users' && 'text-black'} 
            onClick={() => router.push('/admin/admin-users')}>Admin users</li>

            <li className={router.pathname === '/admin/login-history' && 'text-black'} 
            onClick={() => router.push('/admin/login-history')}>Login history</li>

            <li className={router.pathname === '/admin/deleted-customers' && 'text-black'}  
            onClick={() => router.push('/admin/deleted-customers')}>Deleted customers</li>
        </ul>
      
    </aside>
  )
}

export default AdminNav
