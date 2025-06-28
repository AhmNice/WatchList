import React from 'react'
import Button from './button/Button';
import FaqCard from './Cards/FaqCard';

const Faq = () => {
   const faqs = [
  {
    question: "What is WatchList?",
    answer: "WatchList is a movie discovery platform that lets you explore detailed movie information, save your favorites in custom playlists, and follow other movie lovers — all powered by The Movie Database (TMDb)."
  },
  {
    question: "Is WatchList free to use?",
    answer: "Yes, WatchList is completely free to use. You can browse movies, create playlists, and connect with others without any cost."
  },
  {
    question: "Where does WatchList get its movie data?",
    answer: "All movie data on WatchList is sourced from The Movie Database (TMDb), a trusted and community-powered movie database."
  },
  {
    question: "Can I follow other users?",
    answer: "Absolutely! You can follow other users to view their playlists and discover new movies based on their interests."
  },
  {
    question: "How do I create a playlist?",
    answer: "After signing in, go to your dashboard and click on 'Create Playlist'. You can name it, add a description, and start adding movies to it."
  },
  {
    question: "Can I access my playlists from different devices?",
    answer: "Yes, as long as you're signed into the same account, your playlists and activity sync across all your devices."
  },
  {
    question: "How often is movie data updated?",
    answer: "WatchList syncs with TMDb regularly to provide up-to-date information on new releases, trending titles, and movie details."
  },
  {
    question: "Do I need an account to use WatchList?",
    answer: "You can browse movies without an account, but to create playlists and follow users, you'll need to sign up for a free account."
  },
  {
    question: "Is WatchList available as a mobile app?",
    answer: "Not yet, but we're working on it! For now, WatchList is optimized for mobile browsers and works great on any device."
  }
];

  return (
    <div className='pr-16 pl-16 mt-8  gap-5 w-full h-full'>
         <div className='flex flex-col  lg:justify-between lg:items-center lg:flex-row gap-2 '>
            <div className='flex flex-col gap-2'>
                <h2 className='Manrope-Bold text-2xl text-white'>Frequently Asked Questions</h2>
                <p className='text-gray-500 Manrope-Regular text-sm'>Got questions? We've got answers! Check out our FAQ section to find answers to the most common questions about StreamVibe.</p>
            </div>
            <div>
                <Button text={'Ask a Question'} bg={'bg-[#FF0000]'} hoverBg={'bg-[#E50000]'}/>
            </div>
          </div>
          <div className="flex flex-col  lg:grid lg:grid-cols-2 lg:px-6 gap-6 w-full">
            {faqs.slice(0, 8).map((faq, index) => (
              <FaqCard key={index} index={`0${index + 1}`} question={faq}  />
            ))}
          </div>
    </div>
  )
}

export default Faq
