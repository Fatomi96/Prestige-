import * as Yup from 'yup'


// "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
const passwordRule = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;


export const SignInSchema = Yup.object().shape({
    username: Yup.string().required('Name is required'),
    telephone: Yup.string().min(10, 'Phone number too short').required('Phone number is required'),
    email: Yup.string().email('Please insert a valid email').required('Email is required to be notified'),
})