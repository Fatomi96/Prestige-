import React, {useState} from 'react';
import Image from 'next/image';
import { useFormik } from "formik";
import SignInScema from '../../utils/validation/auth.validation';
import { useDispatch, useSelector } from 'react-redux';
import { addAdmin } from '../../Redux/feature/addAdminSlice';
import FailureModal from '../../components/modal/FailureModal';
import SuccessModal from '@/components/modal/successModal';


const SignUp = () => {

    const dispatch = useDispatch();
    const { addAdminLoading } = useSelector((state) => state.addAdmin)
    const [fail, setFail] = useState(false);
    const [success, setSuccess] = useState(false);

    const onSubmit = (values) => {
        try {
            dispatch(addAdmin(values))
                .then((res) => {
                    if (res.error) {

                        setFail(true)
                    }
                    else {
                        console.log(res);
                        formik.resetForm();
                        if (res) {
                            const { success, data } = res.data

                            if (success) {

                                setSuccess(true);
                                formik.resetForm();
                            }
                            // console.log({ data })
                            // if (success) router.push("/")
                          }
                    }
                })
        } catch (error) {
            console.log(error)
        }
    };


    //validations
    const formik = useFormik({
        initialValues: {
            username: '',
            email: '',
            telephone: '',
        },
        validationSchema: SignInScema,
        onSubmit: async (values) => {
            await onSubmit(values);

            
        },
    });

    return (
        <div
            style={{
                background: 'url(/images/bg1.png) no-repeat center center fixed',
                backgroundSize: 'cover',
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
            }}
        >
     <FailureModal
        fail={fail}
        setFail={setFail}
        message='upload new Admin user'
      />

      <SuccessModal
        send={success}
        setSend={setSuccess}
        message='uploaded new Admin user successfully'
      />

            <div
                className="bg-cover bg-center min-h-screen flex justify-center items-center"
                style={{ backgroundImage: 'url(background-image.jpg)' }}
            >
                <div className="bg-white rounded-lg p-10 text-center">
                    <Image
                        src="/images/Logo.png" // Replace with actual logo image URL
                        alt="MTNLogo"
                        width={100}
                        height={80}
                    />
                    <h1 className="font-bold text-2xl mb-8">Prestige Customers Management - Add Admin User</h1>
                    <form className="w-full max-w-lg" onSubmit={formik.handleSubmit}>
                        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0 text-left">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-user-name">
                                User Name
                            </label>
                            <input
                                className=" rounded-md px-4 py-2 mb-4 border border-black-500 w-96 focus:bg-white"
                                id="username"
                                type="text"
                                placeholder="JaneMTN"
                                onChange={formik.handleChange}
                                value={formik.values.username}
                                onBlur={formik.handleBlur} />
                            {formik.touched.username && formik.errors.username ? <div>{formik.errors.username}</div> : null}
                        </div>
                        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0 text-left">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-user-name">
                                Email
                            </label>
                            <input
                                className=" rounded-md px-4 py-2 mb-4 border border-black-500 w-96 focus:bg-white"
                                id="email"
                                name='email'
                                type="email"
                                placeholder="jane@mtn.com"
                                onChange={formik.handleChange}
                                value={formik.values.email}
                                onBlur={formik.handleBlur} />
                            {formik.touched.email && formik.errors.email ? <div>{formik.errors.email}</div> : null}
                        </div>
                        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0 text-left">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-user-name">
                                Telephone
                            </label>
                            <input
                                className=" rounded-md px-4 py-2 mb-4 border border-black-500 w-96 focus:bg-white"
                                id="telephone"
                                name={'telephone'}
                                type="tel"
                                placeholder="08123456789"
                                onChange={formik.handleChange}
                                value={formik.values.telephone}
                                onBlur={formik.handleBlur} />
                            {formik.touched.telephone && formik.errors.telephone ? <div>{formik.errors.telephone}</div> : null}
                        </div>

                        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0 text-left">
                            <button
                                disabled={addAdminLoading}
                                type="submit"
                                className="w-60 rounded-md px-4 py-2 bg-blue-500 text-white font-bold flex justify-center items-center"
                            >
                                {addAdminLoading ? (
                        <svg
                            aria-hidden='true'
                            className='mx-[23px] h-5 w-5 animate-spin fill-[#FCCC04] text-gray-200 dark:text-gray-600'
                            viewBox='0 0 100 101'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                        >
                            <path
                            d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                            fill='currentColor'
                            />
                            <path
                            d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                            fill='currentFill'
                            />
                        </svg>
                        ) : (
                            <>Add Admin <span className="ml-2">→</span></>
                        )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default SignUp;
