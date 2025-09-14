import React from 'react';
import { FaLocationArrow } from "react-icons/fa6";
import LocomotiveScroll from 'locomotive-scroll';
import 'locomotive-scroll/dist/locomotive-scroll.css';  // Ensure styles are loaded


function LandingPage() {
  
  return (
    <div data-scroll-container className='w-full h-screen bg-zinc-900 pt-2'>
      {/* Text Section */}
      <div className="textstructure mt-20 md:mt-40 px-6 md:px-20">
        <div className="masker">
          <h1 className='font-serif leading-tight md:leading-none text-4xl md:text-8xl tracking-tighter font-medium'>
            Join the Revolution:
          </h1>
        </div>
        <div className="masker">
          <h1 className='font-serif leading-tight md:leading-none text-4xl md:text-8xl tracking-tighter font-medium'>
            Learn, Create
          </h1>
        </div>
        <div className="masker">
          <h1 className='font-serif leading-tight md:leading-none text-4xl md:text-8xl tracking-tighter font-medium'>
            And Certify
          </h1>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t-[1px] border-zinc-800 mt-10 md:mt-31 flex flex-col md:flex-row justify-between items-center py-4 md:py-6 px-6 md:px-20">
        {["For Educators", "For Students and Professionals"].map((item, index) => (
          <p key={index} className='text-sm md:text-md font-light tracking-tight leading-none my-2 md:my-0'>
            {item}
          </p>
        ))}
        
        {/* Start Button */}
        <div className="start flex items-center gap-2 mt-4 md:mt-0">
  <a href="/signup" className="px-3 py-2 md:px-4 md:py-2 border-[2px] border-zinc-500 font-light text-sm md:text-md capitalize rounded-full">
    Let's begin
  </a>
  <div className="w-6 h-6 md:w-7 md:h-7 px-1 py-1 border-[2px] border-zinc-500 rounded-full flex items-center justify-center">
    <FaLocationArrow />
  </div>
</div>

      </div>
    </div>
  );
}

export default LandingPage;
