import React from "react";
import Signup from "../components/Signup";
import { useAuthStore } from "../store/authStore";
import ErrorCard from "../components/Cards/ErrorCard";

const SignupPage = () => {
  const { errorMsg } = useAuthStore()
  return (
    <section className="w-full p-4 flex flex-col gap-5 h-screen bg-[#141414] flex justify-center items-center">
      <Signup />
    </section>
  );
};

export default SignupPage;
