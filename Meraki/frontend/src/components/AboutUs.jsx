import React from 'react';

const AboutUs = () => {
  return (
    <div className="sm:flex items-center max-w-screen-xl mx-auto">
      <div className="sm:w-1/2 p-10">
        <div className="image object-center text-center">
            <br></br>
          <img src="https://i.imgur.com/WbQnbas.png" alt="About Us" />
        </div>
      </div>
      <div className="sm:w-1/2 p-5">
        <div className="text">
          <span className="text-gray-500 border-b-2 border-indigo-600 uppercase">About us</span>
          <h2 className="my-4 font-bold text-3xl sm:text-4xl">
            About <span className="text-indigo-600">Our Company</span>
          </h2>
          <p className="text-gray-400">
          Welcome to Meraki – your destination for online learning, where passion meets purpose. At Meraki, we believe in the power of knowledge to transform lives and empower individuals to pursue their goals with confidence. Our platform offers a wide range of courses across various disciplines, designed and taught by experienced instructors who bring expertise and a love for teaching.

Meraki is more than just a learning website; it's a community of students and educators dedicated to personal growth, skill development, and lifelong learning. Whether you're looking to kickstart a new career, hone your existing skills, or explore a new hobby, Meraki is here to support your journey. With flexible, on-demand courses, you can learn at your own pace, anytime and anywhere.

Dive into our library of courses, connect with expert instructors, and start learning today.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
