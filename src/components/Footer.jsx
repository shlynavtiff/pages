import React from 'react';
import { FaInstagram } from "react-icons/fa";
import { FiLinkedin } from "react-icons/fi";
import { FiGithub } from "react-icons/fi";
const Footer = () => {
    return (
        <footer className='flex flex-row justify-between items-center text-center p-2 pb-4 text-xs px-8 ' >
                <div className='flex items-center'>
                <p>© 2024 shlynavtiff.</p>
                </div>
                <div className='flex gap-4 items-center'>
                    <a href="" target='_blank'><FaInstagram size={18} /></a>
                    <a href="" target='_blank'><FiLinkedin size={18} /></a>
                    <a href="" target='_blank'><FiGithub size={18} /></a>
                </div>
        </footer>
    );
}

export default Footer;
