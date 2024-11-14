import React, {useState}from 'react'
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const GoogleSignIn = () => {
 const [user, setUser] = useState(null)
 const [error, setError] = useState('')

  const handleGoogleSignIn = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user)
      setError('')
    } catch (error) {
      setError(error.message)
      setUser(null)
    }
  }
  

  return (
    <>
        <button onClick={handleGoogleSignIn} className="mt-2 bg-[#242424] flex items-center justify-center py-2 rounded-md  border-[1px] border-[#414141] hover:bg-[#414141] w-full">Sign in with Google</button>
    </>
  )
}

export default GoogleSignIn