import React from 'react'
import SignUpPageNav from '../components/SignUpPageNav' 
import SignUp from '../components/auth/SignUp'


const SignUpPageReal = () => {
  return (
    <>
        <SignUpPageNav/>
        <div className='min-h-[865px] flex items-center justify-center'>
                <SignUp/>
        </div>  
    </>

  )
}

export default SignUpPageReal