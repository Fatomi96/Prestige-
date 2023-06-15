import React, { useEffect, useState } from "react";
import QRCodeCanvas from "qrcode.react";
import { useRouter } from 'next/router';



const CustomerQRCode = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const router = useRouter()
  const pathname = router.pathname.slice(1)
  console.log('pathname', pathname);

  useEffect(() => {
    async function verifyPathname() {
      try {
        const response =  await axios.get(`http://localhost:3000/api/customers/verify${pathname}`);
        if (response.status === 200) {
          setIsVerified(true);
        }
      } catch (error) {
        console.error("Error verifying pathname:", error);
      } finally {
        setIsLoading(false);
      }
    }

    verifyPathname();
  console.log('isVerified', isVerified);

  }, [pathname]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isVerified) {
    return (
      <div>
        <QRCodeCanvas value="https:www.mtn.com/" size={200} renderAs="svg"/>
      </div>
    );
  }

  return <QRCodeCanvas value="https:www.mtn.com/" size={200} renderAs="svg"/>;
};



export default CustomerQRCode;
