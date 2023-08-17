import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Custom404 = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the root page after a delay
    const timer = setTimeout(() => {
      router.push('/');
    }, 2000); // 2 seconds delay

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className='h-screen flex flex-col gap-3 justify-center items-center'>
      <h1>404 - Page Not Found</h1>
      <p>Redirecting you to the homepage...</p>
    </div>
  );
};

export default Custom404;
