import React, { useState, useEffect } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
    const [navOpen, setNavOpen] = useState(false);
    const [navColor, setNavColor] = useState(false);

    const handleNav = () => {
        setNavOpen(!navOpen);
    };

    const changeNavBackground = () => {
        if (window.scrollY >= 100) {
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

    return (
        <nav className={`fixed w-full z-50 duration-300 ${navColor ? 'bg-transparent' : 'bg-transparent'}`}>
            <div className="w-full px-8 pt-2 flex items-center justify-between h-16">
                {/* Logo */}
                <h1 className="text-white font-bold text-xl"><a href="/homepage">pages.</a></h1>

                {/* Desktop Links */}
                <ul className="hidden md:flex space-x-6 text-white gap-4">
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
                        <a href="/user" className="hover:text-gray-300">
                            user
                        </a>
                    </li>
                    <li>
                        <a href="/about" className="hover:text-gray-300">
                            about
                        </a>
                    </li>
                </ul>

                {/* Hamburger Icon for Mobile */}
                <div className="md:hidden z-10" onClick={handleNav}>
                    {!navOpen ? <FaBars size={20} className="text-white" /> : <FaTimes size={25} className="text-white" />}
                </div>

                {/* Mobile Menu */}
                <div
                    className={`absolute top-0 left-0 w-full h-screen bg-gray-800 text-white flex flex-col items-center justify-center space-y-6 transform ${navOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out md:hidden`}
                >
                    <a href="/" onClick={handleNav} className="text-2xl hover:text-gray-300">
                        home
                    </a>
                    <a href="/bookmarked" onClick={handleNav} className="text-2xl hover:text-gray-300">
                        bookmarked
                    </a>
                    <a href="/user" onClick={handleNav} className='text-2xl  hover:text-gray-300'> user</a>
                    <a href="/about" onClick={handleNav} className="text-2xl hover:text-gray-300">
                        about
                    </a>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
