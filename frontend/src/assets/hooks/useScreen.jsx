import { useEffect } from "react";
import { useState } from "react";

export default function useScreen () {
  const [ screenSize, setScreenSize ] = useState({
    width: window.innerWidth,
    height:window.innerHeight
  })
  useEffect(()=>{
   const handleScreenResize = () => {
     setScreenSize({
      width: window.innerWidth,
      height:innerHeight
    });
   }
   window.addEventListener('resize', handleScreenResize)
   return ( )=> window.removeEventListener('resize', handleScreenResize)
  },[])

  return screenSize
}