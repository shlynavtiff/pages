import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, updateProfile, updateEmail, signOut, deleteUser } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { supabase } from '../supabaseClient.js';  // Import Supabase client

const UserPage = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setDisplayName(currentUser.displayName || '');
        setEmail(currentUser.email || '');

        // Fetch user verification status from Supabase
        const { data, error } = await supabase
          .from('users')
          .select('is_verified')
          .eq('firebase_uid', currentUser.uid)
          .single();

        if (error) {
          console.error('Error fetching user data:', error);
        } else {
          setIsVerified(data.is_verified);
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    try {
      if (currentUser) {
        await updateProfile(currentUser, { displayName });
        await updateEmail(currentUser, email);

        // Update user in Supabase
        const { error: supabaseError } = await supabase
          .from('users')
          .update({
            display_name: displayName,
            email: email,
          })
          .eq('firebase_uid', currentUser.uid);

        if (supabaseError) {
          console.error('Error updating user in Supabase:', supabaseError);
        }

        setUser(currentUser);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleSignOut = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      navigate('/'); // Redirect to the homepage or sign-in page after sign-out
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleDeleteUser = async () => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    const confirmed = window.confirm('Are you sure you want to delete your account? This action cannot be undone.');

    if (!confirmed) {
      return;
    }

    try {
      if (currentUser) {
        // Delete user from Supabase
        const { error: supabaseError } = await supabase
          .from('users')
          .delete()
          .eq('firebase_uid', currentUser.uid);

        if (supabaseError) {
          console.error('Error deleting user from Supabase:', supabaseError);
          return;
        }

        // Delete user from Firebase
        await deleteUser(currentUser);
        navigate('/'); // Redirect to the homepage or sign-in page after deletion
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <>
      <Navbar />
      <div className='min-h-screen flex items-center justify-center'>
        <div className='bg-[#454545] p-6 rounded-md flex flex-col items-center gap-4 w-[300px] md:w-[400px]'>
          <div>
            <h1 className='text-2xl font-bold'>user profile.</h1>
          </div>
          <div className='flex flex-col items-center w-full'>
            <h2 className='text-lg font-semibold'>username.</h2>
            {isEditing ? (
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className='rounded-sm h-[40px] no-focus-outline p-1 mb-2 w-full'
              />
            ) : (
              <p>{user ? user.displayName : 'Loading...'}</p>
            )}
          </div>
          <div className='flex flex-col items-center w-full'>
            <h2 className='text-lg font-semibold'>email.</h2>
            {isEditing ? (
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='rounded-sm h-[40px] no-focus-outline p-1 mb-2 w-full'
              />
            ) : (
              <p>{user ? user.email : 'Loading...'}</p>
            )}
          </div>
          <div className='flex flex-col items-center w-full'>
            <h2 className='text-lg font-semibold'>password.</h2>
            <p>{user ? '********' : 'Loading...'}</p>
          </div>
          <div className='flex flex-col items-center w-full'>
            <h2 className='text-lg font-semibold'>verified status.</h2>
            <p>{isVerified ? 'Verified' : 'Not Verified'}</p>
          </div>
          <div className='flex flex-row gap-2'>
            {isEditing ? (
              <button
                onClick={handleSave}
                className="bg-[#242424] py-2 px-4 rounded-md border-[1px] border-[#414141] cursor-pointer mt-1 hover:bg-[#414141]"
              >
                Save
              </button>
            ) : (
              <button
                onClick={handleEdit}
                className="bg-[#242424] py-2 px-4 rounded-md border-[1px] border-[#414141] cursor-pointer mt-1 hover:bg-[#414141]"
              >
                Edit
              </button>
            )}
            <button
              onClick={handleSignOut}
              className="bg-[#242424] py-2 px-4 rounded-md border-[1px] border-[#414141] cursor-pointer mt-1 hover:bg-[#414141]"
            >
              Sign Out
            </button>
            <button
              onClick={handleDeleteUser}
              className="bg-red-500 py-2 px-4 rounded-md border-[1px] border-red-700 cursor-pointer mt-1 hover:bg-red-700"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserPage;