import { motion } from 'framer-motion'
import React from 'react'

function Marquee() {
    
  return (
    <div data-scroll data-scroll-speed=".2" className='w-full py-20 rounded-tl-3xl rounded-tr-3xl bg-[#004D43]'>
      <div className="text border-t-2 border-b-2 border-zinc-300 flex  overflow-hidden whitespace-nowrap">
        <motion.h1 initial={{x:0}} animate={{x: "-100%"}} transition={{ease:"linear", repeat: Infinity, duration:5}}className='text-[12vw] leading-none font-serif uppercase font-semibold pr-20 pt-5'>We are Meraki</motion.h1>
        <motion.h1 initial={{x:0}} animate={{x: "-100%"}} transition={{ease:"linear", repeat: Infinity, duration:5}} className='text-[12vw] leading-none font-serif uppercase font-semibold pr-20 pt-5 '>We are Meraki</motion.h1>
       
      </div>
    </div>
  )
}

export default Marquee
