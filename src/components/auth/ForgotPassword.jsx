import React, {useState} from 'react'
import { auth } from '../../firebase/firebase'
import { sendPasswordResetEmail } from 'firebase/auth'
const ForgotPassword = () => {
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    
    const handlePAsswordReset = async (e) => {
        e.preventDefault()
        setMessage('')
        setError('')
        try {
            await sendPasswordResetEmail(auth, email)
            setMessage('Password reset email sent. Please check your inbox.')
        } catch (error) {
            setError(error.message)

        }
    }
    return (
    <div>
        <h1>Recover your accounnt</h1>
        <form className='flex flex-col' onSubmit={handlePAsswordReset}>
            <input type="email" 
            placeholder='Enter your email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='rounded-sm h-[40px] no-focus-outline p-1 mb-2'
            />
            <button type='submit' className="mt-2 bg-[#242424] flex items-center justify-center py-2 rounded-md  border-[1px] border-[#414141] hover:bg-[#414141]">Recover</button>
        </form>
        {message && <p className="text-green-500 mt-2">{message}</p>}
        {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  )
}

export default ForgotPassword