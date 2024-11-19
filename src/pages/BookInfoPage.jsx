import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { supabase } from '../supabaseClient'; // Import Supabase client
import { FaBookmark, FaRegBookmark } from "react-icons/fa";

const APP_KEY = import.meta.env.VITE_APP_KEY;

const BookInfo = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchBookInfo = async () => {
      try {
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes/${id}?key=${APP_KEY}`);
        const data = await response.json();
        setBook(data);
      } catch (err) {
        console.error('Failed to fetch book info:', err);
        setError('Failed to fetch book details');
      } finally {
        setLoading(false);
      }
    };

    fetchBookInfo();
  }, [id]);

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
        .insert([{ id, title: book.volumeInfo.title, authors: book.volumeInfo.authors, cover: book.volumeInfo.imageLinks.thumbnail, description: book.volumeInfo.description, publishdate: book.volumeInfo.publishedDate, user_id: user.uid }]);

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

  const stripHtmlTags = (html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className='text-[#ff3d3d]'>{error}</p>;
  }

  if (!book) {
    return <p>No book details found.</p>;
  }

  return (
    <>
      <Navbar />
      <div className='min-h-screen flex items-center justify-center p-4'>
        <div className='bg-[#454545] w-full max-w-[1300px] p-6 md:p-10 flex flex-col md:flex-row rounded-lg shadow-md'>
          <div className='flex flex-col items-center md:items-start md:max-w-[400px]'>
            {book.volumeInfo?.imageLinks?.thumbnail && (
              <img
                src={book.volumeInfo.imageLinks.thumbnail}
                alt={book.volumeInfo.title}
                className='w-full max-w-[240px] md:max-w-[330px] h-auto object-cover object-center mb-4 rounded'
              />
            )}
            {book.accessInfo?.webReaderLink && (
              <a
                href={book.accessInfo.webReaderLink}
                target="_blank"
                rel="noopener noreferrer"
                className='text-center mt-2 bg-[#242424] text-md py-2 rounded-md px-4 border-[1px] cursor-pointer border-[#414141] hover:bg-[#414141]'
              >
                Read Book
              </a>
            )}
            <button onClick={toggleBookmark} className='mt-2 bg-[#242424] py-2 rounded-md px-4 border-[1px] cursor-pointer border-[#414141] hover:bg-[#414141]'>
              Bookmark
            </button>
            <button className='mt-2 bg-[#242424] py-2 rounded-md px-4 border-[1px] cursor-pointer border-[#414141] hover:bg-[#414141]'>
              About Author
            </button>
          </div>
          <div className='flex flex-col ml-0 md:ml-6 mt-6 md:mt-0'>
            <div>
              <h1 className='text-3xl md:text-5xl font-bold'>{book.volumeInfo?.title}</h1>
              <h2 className='text-xl md:text-2xl text-[#d6d6d6]'>
                Author(s): {book.volumeInfo?.authors?.join(', ') || 'Unknown Author'}
              </h2>
            </div>
            <div className='flex flex-col md:flex-row gap-2 text-lg md:text-md my-4'>
              <p>Publish Date: {book.volumeInfo?.publishedDate}</p>
              <p>Publisher: {book.volumeInfo?.publisher}</p>
              <p>Language: {book.volumeInfo?.language}</p>
              <p>
                Average rating: {book.volumeInfo?.averageRating} ({book.volumeInfo?.ratingsCount} ratings)
              </p>
            </div>
            <div>
              <p className='text-lg md:text-[24px] leading-tight'>{stripHtmlTags(book.volumeInfo?.description)}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookInfo;