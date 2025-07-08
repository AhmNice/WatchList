import React from "react";
import { useMovieStore } from "../store/movieStore";
import CategoryCard from "./Cards/CategoryCard";
import SliderControl from "./sliderControl";
import { Loader2 } from "lucide-react";
import { useRef } from "react";

const Categories = () => {
  const { movies, loading, success, errorMsg } = useMovieStore();
  const slideRef = useRef()
  const movieGenres = [
    { id: 28, name: "Action" },
    { id: 12, name: "Adventure" },
    { id: 16, name: "Animation" },
    { id: 35, name: "Comedy" },
    { id: 80, name: "Crime" },
    { id: 99, name: "Documentary" },
    { id: 18, name: "Drama" },
    { id: 10751, name: "Family" },
    { id: 14, name: "Fantasy" },
    { id: 36, name: "History" },
    { id: 27, name: "Horror" },
    { id: 10402, name: "Music" },
    { id: 9648, name: "Mystery" },
    { id: 10749, name: "Romance" },
    { id: 878, name: "Science Fiction" },
    { id: 10770, name: "TV Movie" },
    { id: 53, name: "Thriller" },
    { id: 10752, name: "War" },
    { id: 37, name: "Western" },
  ];
  // if (loading) {
  //  return(
  //    <div className="w-full h-screen flex justify-center items-center">
  //     <Loader2 className="animate-spin text-red-900"></Loader2>
  //   </div>
  //  )
  // }
  return (
    <div className="md:mt-8 lg:mt-8 mt-12 md:pl-16 md:pr-16 lg:pr-16 lg:pr-16 pr-8 pl-8">
      <div className="mb-4 flex justify-between items-center flex-col md:flex-row lg:flex-row">
        <div>
          <h2 className="text-white Manrope-Bold text-xl">
            Explore our wide variety of genres
          </h2>
          <p className="text-[#BFBFBF]  text-md Manrope-Regular">
            From thrilling action to heartfelt drama, there's something for
            everyone to enjoy.
          </p>
        </div>
        <div  className="md:block lg:block hidden">
        <SliderControl slideRef={slideRef} itemsPerPage={5} />
      </div>
      </div>
      <div ref={slideRef} className="flex gap-7 overflow-x-scroll scrollbar-none w-full py-4">
        {movieGenres.map((genre) => {
          const genreMovies = movies?.filter((movie) =>
            movie.genre_ids.includes(genre.id)
          );

          return (
            genreMovies?.length > 0 && (
              <CategoryCard
                key={genre.id}
                title={genre.name}
                movies={genreMovies.slice(0, 4)}
              />
            )
          );
        })}
      </div>
    </div>
  );
};

export default Categories;
