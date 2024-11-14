import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import BookSearchNav from '../components/BookSearchNav';
import BookCard from '../components/BookCard'; // Import BookCard component

const APP_KEY = import.meta.env.VITE_APP_KEY;

const BookSearch = () => {
  const location = useLocation();
  const [books, setBooks] = useState(location.state?.books || []);
  const [page, setPage] = useState(1);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const query = new URLSearchParams(location.search).get('query');

  useEffect(() => {
    if (query) {
      const fetchBooks = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}&startIndex=${(page - 1) * 12}&maxResults=12&key=${APP_KEY}`);
          const data = await response.json();
          console.log(data);
          if (data.items) {
            setBooks(data.items);
            setHasMore(data.totalItems > page * 10);
          } else {
            setBooks([]);
            setHasMore(false);
          }
        } catch (error) {
          console.error('Error fetching books:', error);
          setError('Failed to fetch books');
        } finally {
          setIsLoading(false);
        }
      };

      fetchBooks();
    }
  }, [query, page]);

  const handleNextPage = () => {
    setPage(prevPage => prevPage + 1);
    scrollToTop();
  };

  const handlePreviousPage = () => {
    setPage(prevPage => Math.max(prevPage - 1, 1));
    scrollToTop();
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      <BookSearchNav />
      <div className='min-h-[100vh]'>
        <div className='flex items-center justify-center flex-col mt-20 p-6'>
          <h1 className='mb-6'>Search Results for "{query}"</h1>
          {isLoading && <p>Loading...</p>}
          <div className='grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {isLoading ? (
              <p></p>
            ) : books.length > 0 ? (
              books.map((book) => (
                <BookCard
                  key={book.id}
                  title={book.volumeInfo.title}
                  authors={book.volumeInfo.authors || ["Unknown Author"]}
                  cover={book.volumeInfo.imageLinks?.thumbnail || ""}
                  publishDate={book.volumeInfo.publishedDate || "Unknown"}
                />
              ))
            ) : (
              <p>No books found.</p>
            )}
          </div>
        </div>
        <div className='flex gap-4 mt-4 items-center justify-center'>
          <button
            onClick={handlePreviousPage}
            disabled={page === 1 || isLoading}
            className='bg-[#242424] py-2 rounded-md px-4 border-[1px] cursor-pointer border-[#414141] mt-1 hover:bg-[#414141]'
          >
            prev.
          </button>
          <button
            onClick={handleNextPage}
            disabled={!hasMore || isLoading}
            className='bg-[#242424] py-2 rounded-md px-4 border-[1px] cursor-pointer border-[#414141] mt-1 hover:bg-[#414141]'
          >
            next.
          </button>
        </div>
      </div>
    </>
  );
};

export default BookSearch;
