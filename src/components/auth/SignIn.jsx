import React, { useState, useEffect } from 'react';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient.js';  // Import Supabase client

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await syncUserWithSupabase(user, 'authStateChanged'); // Sync user with Supabase when authenticated
        navigate('/homepage'); // Redirect to the homepage or any other route
      }
    });

    return () => unsubscribe();
  }, [auth, navigate]);

  const toggleShowPassword = () => {
    setShowPassword(prevShowPassword => !prevShowPassword);
  };

  const signIn = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check if the email is verified
      if (!user.emailVerified) {
        setError('Please verify your email before signing in.');
        await auth.signOut();
        setIsLoading(false);
        return;
      }

      await syncUserWithSupabase(user, 'emailPassword'); // Sync user with Supabase after sign-in
      navigate('/homepage'); // Redirect to the homepage or any other route
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setIsLoading(true);
    setError('');
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      await syncUserWithSupabase(user, 'google'); // Sync user with Supabase after sign-in
      navigate('/homepage'); // Redirect to the homepage or any other route
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const syncUserWithSupabase = async (user, signInMethod) => {
    const { uid, email, displayName, emailVerified } = user;

    // Check if the user exists in Supabase
    const { data, error } = await supabase
      .from('users')
      .select('is_verified')
      .eq('firebase_uid', uid)
      .single();

    if (error) {
      // If user does not exist in Supabase, insert new user
      const { insertError } = await supabase
        .from('users')
        .upsert({
          firebase_uid: uid,
          email,
          display_name: displayName || '',
          is_verified: signInMethod === 'google' || emailVerified, // Set to true if signed in with Google or email is verified
          sign_in_method: signInMethod, // Add sign-in method
          created_at: new Date().toISOString(), // Add timestamp for creation
        });

      if (insertError) {
        console.error('Error syncing user with Supabase:', insertError);
      }
    } else {
      // Update the user's sign_in_method and is_verified status if they already exist
      const { updateError } = await supabase
        .from('users')
        .update({
          sign_in_method: signInMethod,
          is_verified: signInMethod === 'google' || emailVerified, // Set to true if signed in with Google or email is verified
        })
        .eq('firebase_uid', uid);

      if (updateError) {
        console.error('Error updating user with Supabase:', updateError);
      } else {
        if (data.is_verified) {
          console.log('User is verified');
        } else {
          console.log('User is not verified');
        }
      }
    }
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
      <h1 className='text-center items-center justify-center mb-6 font-bold'>Sign in with your pages. account</h1>
      <form onSubmit={signIn} className='flex flex-col'>
        <label htmlFor="emailinput">email.</label>
        <input
          type="email"
          value={email}
          name='emailinput'
          placeholder='Enter Email'
          onChange={(e) => setEmail(e.target.value)}
          className='rounded-sm h-[40px] no-focus-outline p-1'
        />

        <label htmlFor="passwordinput">password.</label>
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

        <button type='submit' className="mt-2 bg-[#242424] flex items-center justify-center py-2 rounded-md  border-[1px] border-[#414141] hover:bg-[#414141]">Sign In</button>
        {isLoading && <p>Signing in . . .</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
      <div>
        <button onClick={signInWithGoogle} className="mt-2 bg-[#242424] flex items-center justify-center py-2 rounded-md  border-[1px] border-[#414141] hover:bg-[#414141] w-full">
          Sign In with Google
        </button>
      </div>
      {/* Add forgot password */}
      <div className='text-center'>
        <a href="/recover" className='underline text-sm '>forgot password?</a>
      </div>
      {/* Add route to sign up */}
      <div className='text-center flex flex-row items-center justify-center text-sm'>
        <p>Don't have an account?</p>
        <a href="/sign-up" className='underline'>Sign Up</a>
      </div>
    </div>
  );
};

export default SignIn;
