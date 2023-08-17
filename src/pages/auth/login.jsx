import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { reset, login, } from "../../Redux/feature/auth/authSlice";
import Image from "next/image";
import { createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../../Redux/feature/auth/authService";
import FailureModal from "../../components/modal/FailureModal";
import { APIKit, Header } from "@/lib/apiFunc";
import {loginReducer} from "../../Redux/feature/auth/authSlice";
import { useRouter } from "next/router";

export default function Login() {
  const dispatch = useDispatch();
  const router = useRouter()

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState(false);
  const [errMsg, setErrMsg] = useState(false);
  const [fail, setFail] = useState(false);
  const authState = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false)
  const [currentForm, setCurrentForm] = useState('Login')
  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ]
  const [otpValues, setOtpValues] = useState(Array(6).fill(''));
  const [secret, setSecret] = useState(null)
  const [adminId, setAdminId] = useState('')
  const [adminPhone, setAdminPhone] = useState('')
  const [otpLoading, setOtpLoading] = useState(false)
  let {user} = authState

  // useEffect(()=>{
  //   if(user){
  //      router.push('/')
  //   }

  // }, [user])
 
  //  const login = createAsyncThunk(
  //   "auth/login",
  //   async (payload, thunkAPI) => {
  //     try {
  //        return await authService.login(payload);

  //     } catch (error) {
  //       const message = error.response.data.message;
  //       setFail(true)
  //       setErrMsg(message)
  //       return thunkAPI.rejectWithValue(message);
  //     }
  //   }
  // );



  const formatPhoneNumber = (phoneNumber) => {

    if (!phoneNumber) return

    if(phoneNumber[0] == 2){
      phoneNumber = phoneNumber.slice(3,15)
      phoneNumber = '0'+ phoneNumber
    }

    const digits = phoneNumber.split('');
    const visibleDigits = digits.slice(0, 3).join('');
    const hiddenDigits = Array(digits.length - 6).fill('*').join('');
    const lastVisibleDigits = digits.slice(-3).join('');

    return `${visibleDigits} ${hiddenDigits} ${lastVisibleDigits}`;
  };


  const loginAdmin = async ({username, password}) =>{


try{
  setIsLoading(true)


  const loginResponse =  await authService.login({username, password})
  setAdminPhone(loginResponse.data.admin.telephone)

  if(loginResponse){
    setAdminId(loginResponse.data.admin.uuid)
    
    const sendOtp = await fetch(`../api/auth/users/send-otp/${loginResponse.data.admin.uuid}`);

    const sendOtpResponse = await sendOtp.json()

    if(sendOtpResponse.success){
      setCurrentForm('OTP')
      setSecret(sendOtpResponse.data.secret)
    }

    else{
      const message = sendOtpResponse.error || 'Check credentials';
      setFail(true)
      setErrMsg(`${message}`)
    }
  }
  setIsLoading(false)
}  

catch(error){
  const message = error?.response?.data?.message || 'Check credentials';
  setFail(true)
  setErrMsg(`${message}`)
  setIsLoading(false)
}
    
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrors({})

    if (!username)
      return setErrors((prev) => ({
        ...prev,
        username: "Please enter your username",
      }))
    if (!password)
      return setErrors((prev) => ({
        ...prev,
        password: "Please enter your password",
      }))

    //  dispatch(login({ username, password })) 
     loginAdmin({ username, password })
  }

  
  const handleInputChange = (index, value) => {
    if (isNaN(value)) return; // Only allow numeric values
    const newOtpValues = [...otpValues];
    newOtpValues[index] = value;
    setOtpValues(newOtpValues);

    // Move focus to the next input field if value is not empty
    if (value !== '' && index < 5) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleInputKeyDown = (event, index) => {
    if (event.key === 'Backspace' && index > 0 && otpValues[index] === '') {
      // Move focus to the previous input field on Backspace key press
      inputRefs[index - 1].current.focus();
    }
  };

  const verifyOtp = async (e)=>{
    e.preventDefault()
    if(isLoading){
      return
    }
    setIsLoading(true)
    let value = ''
    otpValues.forEach(num=> value += num)

    const data = {
      otp: value
    } 

    const options ={
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(data)
    } 
    try{
    
      const response = await fetch(`../api/auth/users/verify-otp/${secret}`, options)
      const verifyResponse = await response.json()

      if(verifyResponse.success){
        dispatch(loginReducer(verifyResponse.data.user))
        router.push('/')
      }
      else{
        const message = verifyResponse.error;
        
        setFail(true)
        setErrMsg(`${message}`)
      }

     

      setIsLoading(false)
    
    }
    
    catch(error){
      const message = error?.response?.data?.message;
      setFail(true)
      setErrMsg(`${message}`)
      setIsLoading(false)
    }

  }

  const resendOtp = async () => {
    if(otpLoading) return 
    setOtpLoading(true)
    const sendOtp = await fetch(`../api/auth/users/send-otp/${adminId}`);

    const sendOtpResponse = await sendOtp.json()

    if(sendOtpResponse.success){
      // console.log('otp sent')
      setSecret(sendOtpResponse.data.secret)
    }

    else{
      const message = sendOtpResponse.error;
      setFail(true)
      setErrMsg(`${message}`)
    }

    setOtpLoading(false)

  }




  return (
    <div
      style={{
        background: "url(/images/bg1.png) no-repeat center center fixed",
        backgroundSize: "cover",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.9)",
      }}
    >
    
    <FailureModal
        fail={fail}
        setFail={setFail}
        message='Login'
        failMsg={errMsg}
       />



      <div
        className="bg-cover bg-center min-h-screen flex justify-center items-center"
        style={{ backgroundImage: "url(background-image.jpg)" }}
      >
        <div className="bg-white rounded-lg p-8 text-center">
          <Image
            src="/images/Logo.png" // Replace with actual logo image URL
            alt="MTNLogo"
            width={150}
            height={150}
            className="relative -left-10"
          />
          

       { currentForm === 'Login' && <>
       <h1 className="font-bold text-2xl text-start mb-10">
            Prestige Customers Management Login
          </h1> 
         <form className="w-full" onSubmit={handleLogin}>
            <div className="w-full mb-6 text-left">
              <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">
                USERNAME
              </label>
              <input
                className="rounded-md w-full px-4 py-2 mb-1 border border-black-500 focus:bg-white"
                id="username"
                type="text"
                autoComplete={false}
                placeholder="JaneMTN"
                onChange={(e) => setUsername(e.target.value)}
                value={username}
              />
              {errors && errors.username ? <div className="text-red-700 text-xs">{errors.username}</div> : null}
            </div>

            <div className="w-full mb-10 text-left">
              <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">
                PASSWORD
              </label>
              <input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                autoComplete={false}
                className="w-full rounded-md px-4 py-2 mb-1 border border-black-500 focus:bg-white"
                id="Password"
              />
              {errors && errors.password ? <div className="text-red-700 text-xs">{errors.password}</div> : null}
            </div>

            <div className="w-full mt-16 mb-4 text-left">
              
                <button
                  disabled={isLoading}
                  type="submit"
                  className="w-full rounded-md px-4 py-2 bg-[#FBCC04] disabled:opacity-70 text-black font-bold flex justify-center items-center"
                >
                  {
                    isLoading ?
                      <svg

                    aria-hidden='true'
                    width="16" height="16"
                    className='mr-2 h-6 w-6 animate-spin fill-white text-gray-200 dark:text-gray-600'
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
                  </svg> : ' Login'
                  }
                 
                </button>
            
            </div>
          </form> </> }

        {currentForm === 'OTP' && <form className="min-w-[25rem]" onSubmit={verifyOtp}>
        <div className="flex flex-col">
      <h2 className="text-xl text-start font-bold mb-3">Enter Verification Code</h2>
     {adminPhone && <p className="text-zinc-500 text-sm font-bold text-start mb-7">We have just sent a verification code to
       <span className="text-black">{formatPhoneNumber(adminPhone)}</span></p> }
      <div className="flex justify-between">
        {otpValues.map((value, index) => (
          <input
            key={index}
            type="text"
            className="w-12 h-12 text-center border-[1px] border-zinc-700/50 font-bold rounded-lg focus:border-[2px] focus:border-blue-400"
            maxLength={1}
            value={value}
            onChange={(e) => handleInputChange(index, e.target.value)}
            onKeyDown={(e) => handleInputKeyDown(e, index)}
            ref={inputRefs[index]}
          />
        ))}
      </div>

      <div className="flex flex-col mt-7 gap-3">
        <p onClick={resendOtp} className="text-start flex gap-3 items-center text-sm cursor-pointer hover:underline text-blue-400 font-bold">Send the code again {
 otpLoading &&  <svg
 aria-hidden='true'
 width="2" height="2"
 className='mr-2 h-6 w-6 animate-spin fill-blue-400 text-gray-200 dark:text-gray-600'
 viewBox='0 0 100 101'
 fill='none'
 xmlns='http://www.w3.org/2000/svg'
>
 <path
   d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 
   22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
   fill='currentColor'
 />
 <path
   d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
   fill='currentFill'
 />
</svg>       
}</p>
      <button disabled={!otpValues.every(value => value !== '')}
                  type="submit"
                  className=" rounded-md px-4 py-2 bg-[#FBCC04] mt-6 disabled:opacity-50 text-black font-bold flex justify-center items-center"
                >
            {
              isLoading ? 
              <svg
                    aria-hidden='true'
                    width="16" height="16"
                    className='mr-2 h-6 w-6 animate-spin fill-white text-gray-200 dark:text-gray-600'
                    viewBox='0 0 100 101'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 
                      22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                      fill='currentColor'
                    />
                    <path
                      d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                      fill='currentFill'
                    />
                  </svg>
                   : 'Verify'
            }
                  
                 
                </button> 

<p onClick={()=>{setCurrentForm('Login')}} className="mb-5 mt-9 text-sm font-bold hover:underline cursor-pointer">Back to sign in</p>
</div>

     

  

    </div>

          </form>
          
          }
        </div>

        
      </div>
    </div>
  )
}



