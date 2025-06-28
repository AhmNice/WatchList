import React from 'react';
import { Facebook, Linkedin, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <section className="bg-[#0F0F0F]mt-8">
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-20 pt-20 pb-5">
        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 py-10">
          {/* Logo or Brand Name */}
          <div className="text-2xl font-bold text-white">
            WatchList
          </div>

          {/* Social Media Links */}
          <div className="flex gap-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Facebook"
            >
              <Facebook size={20} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Twitter"
            >
              <Twitter size={20} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin size={20} />
            </a>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="flex flex-col lg:flex-row items-center justify-between py-5 border-t border-gray-700 gap-4">
          <div className="copyright text-gray-400 text-sm">
            <p>© 2023 WatchList, All Rights Reserved</p>
          </div>

          <div className="terms flex justify-center flex-wrap gap-2">
            <a href="#" className="px-3 text-gray-400 hover:text-white transition-colors border-r border-gray-700">
              Terms of Use
            </a>
            <a href="#" className="px-3 text-gray-400 hover:text-white transition-colors border-r border-gray-700">
              Privacy Policy
            </a>
            <a href="#" className="px-3 text-gray-400 hover:text-white transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Footer;