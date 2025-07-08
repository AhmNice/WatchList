import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Button from "../button/Button";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
const OtpCard = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(5);
  const [resend, setResend] = useState(false);
  const [disableBtn, setDisableBtn] = useState(true);
  const inputRefs = useRef([]);
  const [error, setError] = useState("");
  const { loading, verifyOTP, success,errorMsg } = useAuthStore()
  const navigate = useNavigate();
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setResend(true);
    }
  }, [countdown]);
  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    if (value.length > 1) {
      const digits = value.slice(0, 6).split("");
      digits.forEach((d, i) => {
        if (index + i < 6) newOtp[index + i] = d;
      });
      setOtp(newOtp);
      const next = newOtp.findIndex((val) => val === "");
      inputRefs.current[next === -1 ? 5 : next]?.focus();
    } else {
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const newOtp = [...otp];
      if (newOtp[index]) {
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1].focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };
  const handlePaste = (e, index) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    const newOtp = [...otp];
    for (let i = 0; i < pasted.length && index + i < 6; i++) {
      newOtp[index + i] = pasted[i];
    }
    setOtp(newOtp);
    const next = newOtp.findIndex((val) => val === "");
    inputRefs.current[next === -1 ? 5 : next]?.focus();
  };
  useEffect(() => {
    if (otp.every((digit) => digit !== "")) {
      handleSubmit(new Event("Submit"));
    }
  }, [otp]);
  const handleResend = (e) => {
    if (countdown > 0) return;

    setOtp(["", "", "", "", "", ""]);
    setCountdown(60);
    setResend(false);
  };
  useEffect(() => {
    const allFilled = otp.every((digit) => digit !== "");
    setDisableBtn(!allFilled || loading);
  }, [otp, loading]);

  const handleSubmit = async(e) => {
    e.preventDefault();
    if (otp.some((digit) => digit === "")) {
      setError("Please fill all field");
      return;
    }
    const code = otp.join("");
    try {
      await verifyOTP(code);
      if(success){
        setError('')
        toast.success("OTP verified successfully!, redirecting to dashboard.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setError("Failed to verify OTP. Please try again.");

    }
  };
  useEffect(()=>{
    if(success){
      navigate("/dashboard", {replace:true});
    }
  },[success])
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, type: "spring" }}
      className="bg-[#1A1A1A] shadow-lg w-full max-w-md overflow-hidden pt-8 rounded-xl border border-[#262626]"
    >
      <div className="w-full flex items-center flex-col gap-4 pr-8 pl-8 justify-center mb-4">
        <div className="flex items-center gap-4">
          <motion.img
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            src="Vector.png"
            alt="logo"
            className="w-[40px]"
          />
          <h1 className="Manrope-Bold text-2xl text-white">Verify OTP</h1>
        </div>
        <div>
          <p className="text-[#A0A0A0] text-center Manrope-Regular text-sm">
            We’ve sent a 6-digit verification code to your email or phone.
            Please enter the code below to verify your identity and continue
          </p>
        </div>
      </div>
      <form className="pl-8 pr-8" onSubmit={handleSubmit}>
        <div className="flex space-x-3">
          {otp.map((digit, index) => (
            <input
              disabled={loading}
              key={index}
              value={digit}
              maxLength="1"
              ref={(el) => (inputRefs.current[index] = el)}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={(e) => handlePaste(e, index)}
              onFocus={(e) => e.target.select()}
              type="tel"
              className="Manrope-Regular text-center w-full bg-[#262626] text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#E50000] transition-all "
            />
          ))}
        </div>
        {error && (
          <div className="text-[#E50000] Manrope-Regular text-center mt-2">
            {error}
          </div>
        )}
        <div className="w-full flex justify-center items-center">
          <Button
            disabled={disableBtn || loading}
            bg={"bg-[#E50000]"}
            type="submit"
            onClick={()=> {handleSubmit()}}
            iconPosition="left"
            text={loading ? "Verifying" : "Verify"}
            icon={
              loading ? (
                <Loader2 size={24} className="animate-spin text-white" />
              ) : undefined
            }
            className="w-full flex justify-center mt-6"
          />
        </div>
      </form>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="Manrope-Regular flex justify-center gap-2 p-3 bg-[#262626] mt-6 text-center text-sm text-[#A0A0A0]"
      >
        <p>Didn’t receive the code?</p>
        <button
          disabled={!resend}
          type="submit"
          // onClick={()=>{handleResend()}}
          className={` font-medium ${
            resend
              ? "text-[#E50000] hover:cursor-pointer"
              : "text-[#999999]/50 hover:cursor-not-allowed"
          }`}
        >
          {resend ? "Resend" : ` Resend in ${countdown} sec`}
        </button>
      </motion.div>
    </motion.div>
  );
};

export default OtpCard;
