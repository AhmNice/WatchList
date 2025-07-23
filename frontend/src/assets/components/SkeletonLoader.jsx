import React from 'react';

const SkeletonLoader = ({ className = '' }) => {
  return (
    <div className={`bg-[#282828] rounded-lg overflow-hidden animate-pulse ${className}`}>
      <div className="relative pt-[56.25%] bg-[#383838]"></div>
      <div className="p-4">
        <div className="h-5 w-3/4 bg-[#383838] rounded mb-3"></div>
        <div className="h-4 w-1/2 bg-[#383838] rounded"></div>
        <div className="flex items-center mt-4">
          <div className="h-8 w-8 rounded-full bg-[#383838] mr-2"></div>
          <div className="h-4 w-20 bg-[#383838] rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonLoader;