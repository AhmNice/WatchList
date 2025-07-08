import React from "react";
import Navbar from "../components/Navbar";
import SupportForm from "../components/SupportForm";
import Footer from "../components/Footer";


const SupportPage = () => {
  return (
   <section className="w-full min-h-screen bg-[#141414]">
    <Navbar/>
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex md:flex-row lg:flex-row flex-col">
          <div className="flex flex-col w-full  overflow-hidden lg:w-[65%] gap-4">
            <p className="Manrope-Bold text-5xl text-white">
              Welcome to our support page!
            </p>
            <p className="Manrope-Regular text-gray-400">
              We're here to help you with any problems you may be having with
              our product.
            </p>
            <div className="rounded-lg overflow-hidden flex shrink-0 h-80 justify-center w-full items-center">
              {/* <BackdropGrid /> */}
            </div>
          </div>
          <div className="w-full ">
            <SupportForm />
          </div>

        </div>
        <Footer/>

    </section>
  );
};

export default SupportPage;
