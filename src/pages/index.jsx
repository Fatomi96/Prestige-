import React, { useEffect } from 'react';
import { useRouter } from 'next/router';


export default function Home() {

const router = useRouter();

  //Route to necessary page
  useEffect(() => {
    const {pathname} = router
    if(pathname == '/' ){
      router.push('/Prestige-Customers')
    }
  });
  

  return (<></>)
}
