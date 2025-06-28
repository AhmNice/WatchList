import { ArrowRight } from "lucide-react";
import React from "react";

const CategoryCard = ({ title, movies }) => {
  return (
    <div className="w-56 h-72 flex-shrink-0 bg-[#262626] rounded-md border border-[#333333] p-5 relative overflow-hidden">
      <div className="grid grid-cols-2 gap-2 overflow-hidden">
        {movies?.map((movie, index) => (
          <div key={index} className="rounded-sm h-full">
            <img src={movie.poster} alt="image" className="w-full h-fll rounded-sm" />
          </div>
        ))}
      </div>
      <div className="absolute left-0 w-full h-full  bottom-0 top-0 text-white bg-gradient-to-b from-transparent via-black-50 to-[#141414]">
        <div className="absolute bottom-0 flex justify-between w-full p-4">
          <p className="Manrope-SemiBold">{title}</p>
        <ArrowRight size={24} />
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;
