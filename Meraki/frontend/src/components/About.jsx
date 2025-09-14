import React from 'react'

function About() {
  return (
    <div className='w-full py-20 px-20 bg-[#CDEA68] rounded-tl-3xl rounded-tr-3xl text-black  '>
      <h1 className='font-serif text-6xl'>Meraki empowers creators to share knowledge, engage learners, and inspire growth — from career-building courses to industry-recognized certifications.</h1>
      <div className='w-full flex gap-5 border-t-[1px] border-[#a1b562] pt-10 mt-20'>
       <div className='w-1/2'>
       <h1 className='text-7xl'>Our Misson:</h1>
       <a href="/about-us">
  <button className="px-10 uppercase flex gap-10 items-center py-6 mt-10 bg-zinc-900 rounded-full text-white">
    Read More
    <div className="mt-2 w-2 h-2 bg-zinc-100 rounded-full"></div>
  </button>
</a></div>
        <div className='w-1/2 h-[60vh] rounded-3xl bg-[#b9d849]'>
        <picture className="w-full">
        <img 
            className="bg-gray-200 w-full max-w-full rounded entered loaded" 
            data-component="lazyload" 
            data-animate="data-animate" 
            src="https://ochi.design/wp-content/uploads/2022/05/Homepage-Photo-663x469.jpg" 
            width="663" 
            height="469" 
            data-src="https://ochi.design/wp-content/uploads/2022/05/Homepage-Photo-663x469.jpg" 
            data-srcset="https://ochi.design/wp-content/uploads/2022/05/Homepage-Photo-663x469.jpg 1x, https://ochi.design/wp-content/uploads/2022/05/Homepage-Photo-1326x939.jpg 2x" 
            alt="image description" 
            data-ll-status="loaded" 
            srcSet="https://ochi.design/wp-content/uploads/2022/05/Homepage-Photo-663x469.jpg 1x, https://ochi.design/wp-content/uploads/2022/05/Homepage-Photo-1326x939.jpg 2x"
        />
    </picture>
        </div> 
      </div>

    </div>
  )
}

export default About
