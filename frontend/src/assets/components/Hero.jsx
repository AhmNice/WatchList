import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { useMovieStore } from "../store/movieStore";
import PosterCard from "./posterCard";
import { Loader2, Plus } from "lucide-react";
import Button from "./button/Button";

const Hero = () => {
  const { getAllMovie, movies, loading, success, errorMsg } = useMovieStore();
  useEffect(() => {
    getAllMovie();
  },[]);
  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Loader2 className="animate-spin text-red-900"></Loader2>
      </div>
    );
  }
  return (
    <div className="relative h-screen">
      <div className="w-full overflow-hidden h-screen grid gap-2 grid-cols-9">
        {movies?.map((movie) => (
          <PosterCard src={movie.poster} alt={movie.title} />
        ))}
      </div>
      <div className="w-full h-full bg-gradient-to-b from-[#141414] via-black/70 to-[#141414] absolute top-0 flex flex-col justify-center items-center">
        <Navbar />
        <div className="w-full h-full">
          <div className="flex items-center justify-center mb-12">
            <img src="Abstract_Design.png" alt="" className="w-64" />
          </div>
          <div className="flex flex-col gap-2 justify-center items-center mt-4">
            <h2 className="Manrope-Bold text-center text-3xl lg:text-3xl text-white">
              Track, Save & Share Your Movie Journey
            </h2>
            <p className="text-gray-400 text-center text-lg max-w-lg mx-auto Manrope-Regular">
              WatchList helps you discover movies, save your favorites in custom
              playlists, and connect with other movie lovers — all powered by
              The Movie Database (TMDb).
            </p>
          </div>
          <div className="flex items-center justify-center mt-4">
            <Button bg={'bg-[#FF0000]'} hoverBg={'bg-[#E50000]'} text={'Start Now'} icon={<Plus size={24} className="text-white"/>}/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
