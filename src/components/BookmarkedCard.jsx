import React, { useState, useEffect } from 'react';
import { FaCheck, FaBookmark, FaHeart, FaRegHeart, FaRegBookmark } from "react-icons/fa";
import { supabase } from '../supabaseClient';

const BookmarkedCard = ({ id, title, authors, cover, description, publishDate, userId }) => {
  const [isFinished, setIsFinished] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(true); // Initially true because it's in the bookmarked list
  const [isLiked, setIsLiked] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookStatus = async () => {
      const { data, error } = await supabase
        .from('bookmarked')
        .select('isFinished, isLiked')
        .eq('id', id)
        .eq('user_id', userId)
        .single();
      if (error) {
        console.error('Error fetching book status:', error);
      } else {
        setIsFinished(data.isFinished);
        setIsLiked(data.isLiked);
      }
    };

    fetchBookStatus();
  }, [id, userId]);

  const toggleFinished = async () => {
    setIsFinished(prevState => !prevState);
    try {
      const { error } = await supabase
        .from('bookmarked')
        .update({ isFinished: !isFinished })
        .eq('id', id)
        .eq('user_id', userId);
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error updating finished status:', error);
      setError('Failed to update finished status');
    }
  };

  const toggleBookmark = async () => {
    setIsBookmarked(prevState => !prevState);
    try {
      if (isBookmarked) {
        const { error } = await supabase
          .from('bookmarked')
          .delete()
          .eq('id', id)
          .eq('user_id', userId);
        if (error) {
          throw error;
        }
      } else {
        const { error } = await supabase
          .from('bookmarked')
          .insert([{ id, title, authors, cover, description, publishDate, isFinished, isLiked, user_id: userId }]);
        if (error) {
          throw error;
        }
      }
    } catch (error) {
      console.error('Error updating bookmark status:', error);
      setError('Failed to update bookmark status');
    }
  };

  const toggleLiked = async () => {
    setIsLiked(prevState => !prevState);
    try {
      const { error } = await supabase
        .from('bookmarked')
        .update({ isLiked: !isLiked })
        .eq('id', id)
        .eq('user_id', userId);
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error updating liked status:', error);
      setError('Failed to update liked status');
    }
  };

  return (
    <div className='flex justify-center bg-[#454545] p-4 rounded-lg shadow-md'>
      <div className='flex flex-col items-center'>
        {/* Book Cover */}
        {cover ? (
          <img src={cover} alt={title} className='w-[240px] h-[240px] object-cover mb-4 rounded' />
        ) : (
          <div className='w-[240px] h-[240px] bg-gray-300 flex items-center justify-center mb-4 rounded'>
            <p className='text-gray-700'>No Image Available</p>
          </div>
        )}
        
        {/* Book Details */}
        <h2 className='text-xl font-bold text-center'>{title}</h2>
        <p className='text-md text-center'>{authors?.join(', ')}</p>
        <p className='text-sm text-center mt-2 px-4'>{description}</p>
        <p className='text-sm text-center mt-2 px-4'>{publishDate}</p>

        {/* Actions */}
        <div className='flex flex-row items-center justify-center gap-8 mt-4'>
          <button onClick={toggleFinished} aria-label="Finished">
            {isFinished ? <FaCheck /> : <FaRegHeart />}
          </button>
          <button onClick={toggleBookmark} aria-label="Bookmark">
            {isBookmarked ? <FaBookmark /> : <FaRegBookmark />}
          </button>
          <button onClick={toggleLiked} aria-label="Like">
            {isLiked ? <FaHeart /> : <FaRegHeart />}
          </button>
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    </div>
  );
};

export default BookmarkedCard;