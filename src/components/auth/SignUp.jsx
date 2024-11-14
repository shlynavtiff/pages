import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from 'firebase/auth';
import { supabase } from '../../supabaseClient';  // Import Supabase client

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [error, setError] = useState('');

  const handleSignUp = async (e) => {
    e.preventDefault();

    const auth = getAuth();

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Set displayName after account creation
      await updateProfile(user, { displayName });

      // Send email verification
      await sendEmailVerification(user);
      setVerificationSent(true); // Set flag to show success message

      // Add user to Supabase
      const { error: supabaseError } = await supabase
        .from('users')
        .insert({
          firebase_uid: user.uid,
          email,
          display_name: displayName,
          is_verified: false, // Default to false until email is verified
          sign_in_method: 'emailPassword', // Sign-in method
          created_at: new Date().toISOString(), // Timestamp for creation
        });

      if (supabaseError) {
        console.error('Error adding user to Supabase:', supabaseError);
      }

      console.log("User signed up and added to Supabase:", user);
    } catch (error) {
      setError(error.message);
      console.error("Error creating user:", error);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(prevShowPassword => !prevShowPassword);
  };

  const showIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-.274.823-.682 1.597-1.207 2.285M15 12a3 3 0 01-6 0m6 0a3 3 0 01-6 0m6 0c0 1.657-1.343 3-3 3s-3-1.343-3-3m6 0c0-1.657-1.343-3-3-3s-3 1.343-3 3" />
    </svg>
  );

  const hideIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7-.274-.823-.682-1.597-1.207-2.285M9.88 9.88a3 3 0 014.24 4.24M15 12a3 3 0 01-6 0m6 0c0 1.657-1.343 3-3 3s-3-1.343-3-3m6 0c0-1.657-1.343-3-3-3s-3 1.343-3 3" />
    </svg>
  );

  return (
    <div className='bg-[#454545] w-[300px] md:w-[400px] m-6 p-4 rounded-md flex flex-col'>
      <h1 className='text-center items-center justify-center mb-6 font-bold'>Sign up for an account</h1>
      <form onSubmit={handleSignUp} className='flex flex-col'>
        <label htmlFor="displayName">Display Name</label>
        <input
          type="text"
          value={displayName}
          name='displayName'
          placeholder='Enter Display Name'
          onChange={(e) => setDisplayName(e.target.value)}
          className='rounded-sm h-[40px] no-focus-outline p-1'
        />

        <label htmlFor="emailinput">Email</label>
        <input
          type="email"
          value={email}
          name='emailinput'
          placeholder='Enter Email'
          onChange={(e) => setEmail(e.target.value)}
          className='rounded-sm h-[40px] no-focus-outline p-1'
        />

        <label htmlFor="passwordinput">Password</label>
        <div className="relative flex items-center">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder='Enter Password'
            name='password-input'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="flex-grow rounded-sm no-focus-outline p-1 h-[40px]"
          />

          <button type="button" onClick={toggleShowPassword} className="absolute right-2 ml-2 flex items-center">
            {showPassword ? hideIcon : showIcon}
          </button>
        </div>

        <button type='submit' className="mt-2 bg-[#242424] flex items-center justify-center py-2 rounded-md  border-[1px] border-[#414141] hover:bg-[#414141]">Sign Up</button>
        {verificationSent && <p>Verification email sent. Please check your inbox.</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
};

export default SignUp;
