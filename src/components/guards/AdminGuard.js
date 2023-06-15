
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";



/**
 * This listens to route change events and performs checks to see if the user has the right privileges to access a given route.
 * 
 * This should wrap any admin-only route.
 * @param {*} children: React children that consume the useEffect in this component 
 * @returns 
 */

const AdminGuard = ({ children }) => {

    const authState = useSelector((state) => state.auth);
    let { isLoading, user } = authState;
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        // on initial load - run auth check 

        if (authDone) {
            adminCheck();
            // on route change start - hide page content by setting authorized to false  
            const hideContent = () => setAuthorized(false);
            router.events.on('routeChangeStart', hideContent);

            // on route change complete - run auth check 
            router.events.on('routeChangeComplete', () => adminCheck)

            // unsubscribe from events in useEffect return function
            return () => {
                router.events.off('routeChangeStart', hideContent);
                router.events.off('routeChangeComplete', () => adminCheck);
            }
        }
    }, [isLoading, user]);

    function adminCheck() {
        // redirect to login page if accessing a private page and not logged in 
        if (!isLoading) {
            if (user) {
                setAuthorized(true)
            }
            // redirect to login page if accessing a private page and not logged in
            else {
                router.push({ pathname: "/auth/login" })
            }
        }

    }

    if (isLoading || !authorized) {
        return (
            <div>

            </div>
        )
    }


    return <>{children}</>;

}

export default AdminGuard;
