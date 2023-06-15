import React, { useState } from 'react';
import Image from 'next/image';
import { useFormik } from "formik";
import SignInScema from '../../utils/validation/auth.validation';
import axios from 'axios';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Perform login logic here with email and password values
    // For demo purposes, print the email and password to the console
    console.log('Email:', email);
    console.log('Password:', password); 
  }

  const onSubmit = (values, { setSubmitting }) => {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    const body = JSON.stringify(values);
    fetch('../api/auth/login', {
      method: 'POST',
      headers,
      body
    })
      .then(response => {
        if (response.ok) {
          // redirect to dashboard or home page
          router.push('../index');
          
        } else {
          // handle login error
          console.log('login failed')
        }
      })
      .finally(() => {
        setSubmitting(false);
      });
  };


  //validations
  const formik = useFormik({
    initialValues: {
      userName: '',
      Password:'',
      fname: '',
      lname: '',
      Email: '',
      PhoneNumber:'',
    },
    validationSchema: SignInScema,
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      try {
        const response = await axios.post('/api/auth/users', values);
        setStatus('User updated successfully');
      } catch (error) {
        setStatus('Error updating this user');
      }
      setSubmitting(false);
    },
  });

 console.log('value', formik.values);
 console.log('error', formik.errors);


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

        <div
      className="bg-cover bg-center min-h-screen flex justify-center items-center"
      style={{ backgroundImage: 'url(background-image.jpg)' }}
    >
      <div className="bg-white rounded-lg p-10 text-center">
      <Image
          src="/images/Logo.png" // Replace with actual logo image URL
          alt="MTNLogo"
          width= {100}
          height= {80}
        />
        <h1 className="font-bold text-2xl mb-8">Prestige Customers Management - Add User</h1>

        <form className="w-full max-w-lg" onSubmit={formik.handleSubmit}>

        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0 text-left">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-user-name">
                UserName
            </label>
            <input 
             className=" rounded-md px-4 py-2 mb-4 border border-black-500 w-96 focus:bg-white" 
             id="userName" 
             type="text" 
             placeholder="JaneMTN" 
             onChange={formik.handleChange}
             value={formik.values.userName} 
             onBlur={formik.handleBlur}/> 
              {formik.touched.userName && formik.errors.userName ? <div>{formik.errors.userName}</div> : null}    
         </div>

        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0 text-left">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                First Name
            </label>
            <input className=" rounded-md px-4 py-2 mb-4 border border-black-500 w-96 focus:bg-white" id="grid-first-name" type="text" placeholder="Jane" />
            {/* <p class="text-red-500 text-xs italic">Please fill out this field.</p> */}
        </div>

        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0 text-left">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-last-name">
                Last Name
            </label>
            <input className=" rounded-md px-4 py-2 mb-4 border border-black-500 w-96 focus:bg-white" id="grid-last-name" type="text" placeholder="Doe" />
            {/* <p class="text-red-500 text-xs italic">Please fill out this field.</p> */}
        </div>

        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0 text-left">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-email">
                Email
            </label>
        <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className=" rounded-md px-4 py-2 mb-4 border border-black-500 w-96 focus:bg-white"
            id="grid-email"
            />
        </div>

        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0 text-left">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-pass">
                Password
            </label>
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className=" rounded-md px-4 py-2 mb-4 border border-black-500 w-96 focus:bg-white"
                id="grid-pass"
             />

        </div>

        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0 text-left">
           
        <button
          disabled={formik.isSubmitting}
          type="submit"
          className="w-60 rounded-md px-4 py-2 bg-blue-500 text-white font-bold flex justify-center items-center"
        >
          Add User <span className="ml-2">→</span>
        </button>
        </div>

        

        </form>

      </div>
    </div>
   

    </div>
  );
}

export default SignUp;
