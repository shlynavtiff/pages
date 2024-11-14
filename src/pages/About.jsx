import React from 'react';
import Navbar from '../components/Navbar';

const About = () => {
    return (
        <>
        <Navbar />
        <div className='min-h-[865px] flex flex-col justify-center items-center text-white p-8 '>
            <div className='mb-20 flex justify-center'>
                <h1 className='text-3xl text-center'>about pages.</h1>
            </div>
            <div className='flex flex-col md:flex-row max-w-[1300px] gap-12'>
                <div className='md:w-1/2 justify-center items-center flex text-[24px]'>
                    <p className='leading-tight tracking-wide'>
                        <strong>pages.</strong> is more than just a book search app. It's a journey through the vast, inspiring,
                        and diverse landscape of literature. Whether you're looking for classic tales, hidden gems,
                        or the latest releases, <strong>pages.</strong> helps you find exactly what you're searching for, and often,
                        something you never expected to discover. <strong>Why pages?</strong> <strong>pages.</strong> isn't just about finding a book; it’s
                        about experiencing a journey into the boundless world of stories, ideas, and imagination. <strong>pages.</strong> is
                        designed for the passionate reader, the curious mind, and the lifelong learner. Every book holds a universe
                        within it, and <strong>pages.</strong> is here to help you explore.
                    </p>
                </div>
                <div className='md:w-1/2 text-[20px] leading-tight tracking-wide'>
                    <p className=''>
                        <strong>With pages., you can:</strong>
                    </p>
                    <ul className='list-disc list-inside space-y-2 leading-tight tracking-wide'>
                        <li><strong>Search & Discover:</strong> Effortlessly browse thousands of books by title, author, genre, or even keywords. Dive deep into the stories and knowledge that interest you most.</li>
                        <li><strong>Explore Beyond the Covers:</strong> Find detailed information on each book – from publication details to rich summaries, excerpts, and related works – to help you make the perfect selection.</li>
                        <li><strong>Curated Recommendations:</strong> Based on your interests and search habits, Pages offers personalized recommendations to help you uncover books you’ll love.</li>
                        <li><strong>Track Your Journey:</strong> Save books to your personal library and easily keep track of what you've read, what you want to read, and books you’ve discovered along the way.</li>
                    </ul>
                </div>
            </div>
        </div>
        </>
    );
}

export default About;
