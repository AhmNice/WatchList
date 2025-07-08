import PropTypes from "prop-types";
import React, { useState } from "react";
import { Search, Bell, ChevronDown } from "lucide-react";

const Header = ({ userImage = "/userAvatar.png" }) => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="w-full h-16 bg-[#1A1A1A] border-b border-[#262626] px-6 flex items-center justify-between sticky top-0">
      {/* Search Bar */}
      <div className="relative flex-1 max-w-xl mr-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="text-gray-400 h-5 w-5" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="
            block w-full pl-10 pr-4 py-2.5
            bg-[#262626] text-white
            rounded-lg border border-[#3D3D3D]
            focus:outline-none focus:ring-2 focus:ring-[#E50000] focus:border-[#E50000]
            placeholder-gray-400
            transition-all duration-200
            Manrope-Regular
          "
          placeholder="Search movies, shows..."
          aria-label="Search"
        />
      </div>

      {/* Right Side Controls */}
      <div className="flex items-center space-x-4">
        {/* Notification Bell */}
        <button
          className="
            p-2 rounded-full
            text-gray-300 hover:text-white hover:bg-[#262626]
            focus:outline-none focus:ring-2 focus:ring-[#E50000]
            transition-colors duration-200
            relative
          "
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#E50000] rounded-full"></span>
        </button>

        {/* User Profile */}
        <div className="flex items-center space-x-2 group cursor-pointer">
          <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-transparent group-hover:border-[#E50000] transition-colors">
            <img
              src={userImage}
              alt="User profile"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "/default-avatar.png";
              }}
            />
          </div>
          <ChevronDown className="text-gray-400 group-hover:text-white h-4 w-4 transition-colors" />
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  userImage: PropTypes.string,
};

Header.defaultProps = {
  userImage: "/default-avatar.png",
};

export default Header;