import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const BookSearchNav = () => {
  const [navColor, setNavColor] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const changeNavBackground = () => {
    if (window.scrollY >= 80) {
      setNavColor(true);
    } else {
      setNavColor(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', changeNavBackground);
    return () => {
      window.removeEventListener('scroll', changeNavBackground);
    };
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/booksearch?query=${searchQuery}`);
  };

  return (
    <nav className={`fixed w-full z-50 duration-300 ${navColor ? 'bg-transparent' : 'bg-transparent'}`}>
      <div className="w-full px-8 pt-2 flex items-center justify-between h-16">
        {/* Logo and Search Bar */}
        <div className="flex items-center">
          <h1 className="text-white font-bold text-xl mr-4"><a href="/homepage">pages.</a></h1>
          <form onSubmit={handleSearchSubmit} className="relative w-[400px] items-center">
            <input
              type="text"
              name="wordInput"
              placeholder="Find a book you like. . ."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-2 rounded-full border no-focus-outline:focus"
            />
            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white">
              <FaSearch />
            </span>
          </form>
        </div>

        {/* Desktop Links */}
        <ul className="hidden md:flex space-x-6 text-white gap-4 ml-auto">
          <li>
            <a href="/homepage" className="hover:text-gray-300">
              home
            </a>
          </li>
          <li>
            <a href="/bookmarked" className="hover:text-gray-300">
              bookmarked
            </a>
          </li>
          <li>
            <a href="/about" className="hover:text-gray-300">
              about
            </a>
          </li>
          <li>
            <a href="/user" className="hover:text-gray-300">
              user
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default BookSearchNav;