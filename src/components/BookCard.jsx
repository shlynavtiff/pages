import React, { useState, useEffect } from 'react';
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import { FiBookOpen } from "react-icons/fi";
import { supabase } from '../supabaseClient';

const BookCard = ({ id, title, authors, cover, description, onClick, publishdate, user }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkIfBookmarked = async () => {
      if (!id || !user?.uid) return; // Ensure both values exist

      try {
        const { data, error } = await supabase
          .from('bookmarked')
          .select('*')
          .eq('id', id)
          .eq('user_id', user.uid);

        if (error) {
          console.error('Error checking bookmark status:', error);
        } else if (data.length > 0) {
          setIsBookmarked(true);
        }
      } catch (err) {
        console.error('Unexpected error checking bookmark status:', err);
      }
    };

    checkIfBookmarked();
  }, [id, user]);

  const saveBook = async () => {
    setError('');
    if (!id) {
      setError('Invalid book ID');
      console.error('Invalid book ID');
      return;
    }
    if (!user || !user.uid) {
      setError('Invalid user ID');
      console.error('Invalid user ID');
      return;
    }
    try {
      const { data, error } = await supabase
        .from('bookmarked')
        .insert([{ id, title, authors, cover, description, publishdate, user_id: user.uid }]);

      if (error) {
        throw error;
      } else {
        console.log('Book saved:', data);
        setIsBookmarked(true);
      }
    } catch (error) {
      console.error('Error saving book:', error);
      setError('Failed to save book');
    }
  };

  const removeBook = async () => {
    setError('');
    if (!id) {
      setError('Invalid book ID');
      console.error('Invalid book ID');
      return;
    }
    if (!user || !user.uid) {
      setError('Invalid user ID');
      console.error('Invalid user ID');
      return;
    }
    try {
      const { data, error } = await supabase
        .from('bookmarked')
        .delete()
        .eq('id', id)
        .eq('user_id', user.uid);

      if (error) {
        throw error;
      } else {
        console.log('Book removed:', data);
        setIsBookmarked(false);
      }
    } catch (error) {
      console.error('Error removing book:', error);
      setError('Failed to remove book');
    }
  };

  const toggleBookmark = async () => {
    if (!isBookmarked) {
      await saveBook();
    } else {
      await removeBook();
    }
  };

  return (
    <div className='flex justify-center w-[300px] md:w-[400px] bg-[#454545] p-4 rounded-lg shadow-md'>
      <div className='flex flex-col items-center'>
        {cover ? (
          <img onClick={onClick} src={cover} alt={title} className='w-[240px] h-[240px] object-cover mb-4 rounded cursor-pointer' />
        ) : (
          <div onClick={onClick} className='w-[240px] h-[240px] bg-gray-300 flex items-center justify-center mb-4 rounded cursor-pointer'>
            <p className='text-gray-700'>No Image Available</p>
          </div>
        )}
        <h2 className='text-xl font-bold text-center'>{title}</h2>
        <p className='text-md text-center'>{authors?.join(', ')}</p>
        <p className='text-sm text-center mt-2 px-4'>{description}</p>
        <div className='flex flex-row items-center justify-center gap-8 mt-4'>
          <button onClick={toggleBookmark} aria-label="Bookmark">
            {isBookmarked ? <FaBookmark /> : <FaRegBookmark />}
          </button>
          <FiBookOpen aria-label="Open Book" />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    </div>
  );
};

export default BookCard;