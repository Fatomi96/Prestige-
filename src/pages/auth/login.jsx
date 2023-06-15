import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { reset, login, } from "../../Redux/feature/auth/authSlice";
import Image from "next/image";
import FailureModal from '../../components/modal/FailureModal';


export default function Login() {
  const dispatch = useDispatch();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState({});
  const [fail, setFail] = useState(false);
  const authState = useSelector((state) => state.auth);
  let { isLoading, user } = authState;

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

    dispatch(login({ username, password }))
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
      <div
        className="bg-cover bg-center min-h-screen flex justify-center items-center"
        style={{ backgroundImage: "url(background-image.jpg)" }}
      >
        <div className="bg-white rounded-lg p-10 text-center">
    
      <FailureModal
        fail={fail}
        setFail={setFail}
        message='Login Unsuccessful please try again'
       />
          <Image
            src="/images/Logo.png" // Replace with actual logo image URL
            alt="MTNLogo"
            width={100}
            height={80}
          />
          <h1 className="font-bold text-2xl mb-6">
            Prestige Customers Management Login
          </h1>

          <form className="w-full max-w-lg" onSubmit={handleLogin}>
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0 text-left">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                Username
              </label>
              <input
                className="rounded-md px-4 py-2 mb-4 border border-black-500 w-96 focus:bg-white"
                id="username"
                type="text"
                placeholder="JaneMTN"
                onChange={(e) => setUsername(e.target.value)}
                value={username}
              />
              {errors && errors.username ? <div className="text-red-700 text-xs">{errors.username}</div> : null}
            </div>

            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0 text-left">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className="w-96 rounded-md px-4 py-2 mb-4 border border-black-500 focus:bg-white"
                id="Password"
              />
              {errors && errors.password ? <div className="text-red-700 text-xs">{errors.password}</div> : null}
            </div>

            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0 text-left">
              {isLoading ? (
                <div className='flex justify-center items-center'>
                  <svg
                    aria-hidden='true'
                    width="16" height="16"
                    className='mr-2 h-6 w-6 animate-spin fill-[#FCCC04] text-gray-200 dark:text-gray-600'
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
                  <p className="text-[16px] font-mtnBold">Loading...</p>
                </div>
              ) : (
                <button
                  disabled={isLoading}
                  type="submit"
                  className="w-60 rounded-md px-4 py-2 bg-blue-500 text-white font-bold flex justify-center items-center"
                >
                  Login<span className="ml-2">→</span>
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

