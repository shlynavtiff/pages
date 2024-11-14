import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { useNavigate } from 'react-router-dom';

const IsLoggedIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('')
  const [password, setPassword]= useState('')
  const [displayname, setDisplayname] = useState('')
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Redirect to the homepage if the user is logged in
        navigate('/homepage');
      }
    });

    // Cleanup the subscription on component unmount
    return () => unsubscribe();
  }, [navigate]);

  const signIn  = (e) => {
    e.preventDefault()
    signInWithEmailAndPassword(auth, email, password, displayname)
    .then((userCredential) => {
        console.log(userCredential)
    }) 
    .catch((error) => {
        console.log(error)
    })
}

const toggleShowPassword = () => {
    setShowPassword(prevShowPassword => !prevShowPassword);
  };

  return (
    <div>
      <form onSubmit={signIn} className='flex flex-col'>
        <h1>Sign In</h1>
        <input
          type="email"
          placeholder='Enter Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="flex items-center">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder='Enter Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="flex-grow"
          />
          <button type="button" onClick={toggleShowPassword} className="ml-2">
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
        <button type='submit'>Sign In</button>
      </form>
    </div>
  );
};

export default IsLoggedIn;
