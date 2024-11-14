import React from 'react'
import SignUpPageNav from '../components/SignUpPageNav'
import SignIn from '../components/auth/SignIn'
import SignUp from '../components/auth/SignUp'
import Footer from '../components/Footer'

const SignUpPage = () => {
  return (
    <>
    <SignUpPageNav/>
    <div className='min-h-[865px] flex items-center justify-center flex-col'>
        <SignIn />
       
    </div>
    </>
  )
}

export default SignUpPage