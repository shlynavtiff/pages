import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { FaSearch } from 'react-icons/fa';

const APP_KEY = import.meta.env.VITE_APP_KEY;

const Homepage = () => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (query.trim()) {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${APP_KEY}&maxResults=12`
        );
        const data = await response.json();
        if (data.items) {
          navigate(`/booksearch?query=${encodeURIComponent(query)}`, { state: { books: data.items } });
        } else {
          setError('No books found');
        }
      } catch (error) {
        setError('Failed to fetch books');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex-1 p-10 min-h-[865px]">
        <div className="max-w-screen-xl mx-auto flex items-center justify-center flex-col">
          <p className="text-2xl md:text-3xl text-center my-4 mt-16">
            pages.
          </p>
          <form onSubmit={handleSearchSubmit} className="relative w-[300px] md:w-[400px] px-5 items-center mt-4">
            <input
              type="text"
              name="wordInput"
              placeholder="Find a book you like. . ."
              className="w-full pl-4 pr-10 py-2 rounded-full border"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <span className="absolute right-8 top-[22px] transform -translate-y-1/2 text-white">
              <FaSearch />
            </span>
            {isLoading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
          </form>
          <div className='text-center mt-44 text-[36px] max-w-[1300px]'>
            <p className='leading-tight'>
              Dive into a world of stories, insights, and adventures with pages. – your personal companion
              in discovering the perfect book. Whether you’re a lifelong reader, an occasional book lover, or
              a curious explorer, pages. makes finding and connecting with books easy, enjoyable, and inspiring.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Homepage;
