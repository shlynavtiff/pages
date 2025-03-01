import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/firebase';
import './App.css';
import Homepage from './pages/Homepage';
import Footer from './components/Footer';
import { Route, Routes } from 'react-router-dom';
import Bookmarked from './pages/Bookmarked';
import About from './pages/About';
import SignUpPage from './pages/SignUpPage';
import SignUpPageReal from './pages/SignUpPageReal';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import UserPage from './pages/UserPage';
import BookSearch from './pages/BookSearch';
import BookInfo from './pages/BookInfoPage';

function App() {

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow">
        <Routes>
          <Route path='/' element={<SignUpPage />} />
          <Route path='/sign-up' element={<SignUpPageReal />} />
          <Route path='/recover' element={<ForgotPasswordPage />} />
          <Route path='/homepage' element={<Homepage />} />
          <Route path='/bookmarked' element={<Bookmarked />} />
          <Route path='/about' element={<About />} />
          <Route path='/user' element={<UserPage />} />
          <Route path='/booksearch' element={<BookSearch />} />
          <Route path="/book/:id" element={<BookInfo />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
