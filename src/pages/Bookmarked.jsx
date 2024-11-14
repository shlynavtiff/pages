import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { supabase } from '../supabaseClient';
import BookmarkedCard from '../components/BookmarkedCard';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const Bookmarked = () => {
  const [bookmarkedBooks, setBookmarkedBooks] = useState([]);
  const [user, setUser] = useState(null)

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
      setUser(null);
      }
    })

    return () => unsubscribe();
  }, [])

  useEffect(() => {
    const fetchBookmarkedBooks = async () => {
      if (user) {
        const {data, error} = await supabase
        .from('bookmarked')
        .select('*')
        .eq('user_id', user.id);
        if (error) {
          console.error('Error fetching bookmarked books:', error);
        } else {
          setBookmarkedBooks(data);
        }
      }
    };

    fetchBookmarkedBooks();
  }, [user]);

  return (
    <>
      <Navbar />
      <div className='min-h-[100vh] flex items-center justify-center flex-col'>
        <h1 className='mb-6'>Bookmarked Books</h1>
        <div className='grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
          {bookmarkedBooks.length > 0 ? (
            bookmarkedBooks.map((book) => (
              <BookmarkedCard
                key={book.id}
                id={book.id}
                title={book.title}
                authors={book.authors}
                cover={book.cover}
                description={book.description}
                publishDate={book.publishDate}
                userId={user.id}
              />
            ))
          ) : (
            <p className='text-center'>No bookmarked books found.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Bookmarked;