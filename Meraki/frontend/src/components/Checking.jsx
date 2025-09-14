import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import video2 from "../assets/video2.mp4"; // Import for the video

// Mock authentication (replace with actual authentication logic)
const useAuth = () => {
  // Mock user data. Replace this with actual user role and authentication data.
  return { isAuthenticated: true, role: "student" }; // Change to "instructor" to test as an instructor
};

const HomePage = () => {
  const { isAuthenticated, role } = useAuth();
  const [myCourses, setMyCourses] = useState([]);
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [featuredCourses, setFeaturedCourses] = useState([]);

  useEffect(() => {
     if (isAuthenticated && role === "student") {
      // Populate courses for students
      setRecommendedCourses([
        { id: 7, title: "Vue.js: From Beginner to Pro", instructor: "Emily Clark" },
        { id: 8, title: "Mastering JavaScript", instructor: "Mike Ross" },
        { id: 9, title: "Python for Data Science", instructor: "Derek Lasso" },
        { id: 10, title: "Advanced CSS", instructor: "Nina Williams" },
        { id: 11, title: "Angular Crash Course", instructor: "Lily Adams" },
        { id: 12, title: "React Native for Mobile Apps", instructor: "Samuel Green" },
      ]);

     
    }
  }, [isAuthenticated, role]);

  return (
    <div className="bg-zinc-900 text-orange-500 px-6 py-8 min-h-screen">
      {/* Video Section */}
      <div className="relative w-full h-60 sm:h-96 md:h-112 lg:h-[480px] overflow-hidden mb-12 rounded-lg">
        <video
          src={video2} // Using the imported video path
          className="object-cover w-full h-full absolute top-0 left-0"
          autoPlay
          muted
          loop
          playsInline
        />
      </div>

      {/* Hero Section */}
      <section className="text-center py-16 bg-zinc-800 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-white mb-4">Welcome back, User!</h1>
        <p className="text-lg text-gray-300">Your journey to learn continues. Check out your courses and explore new ones!</p>
      </section>

      

      {/* Student-Only Sections: Recommended and Featured Courses */}
      {isAuthenticated && role === "student" && (
        <>
          {/* Recommended Courses Section */}
          <section className="mt-12">
            <h2 className="text-3xl font-semibold text-white">Recommended for You</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8 mt-6">
              {recommendedCourses.map((course) => (
                <div key={course.id} className="bg-zinc-800 p-6 rounded-lg shadow-xl transition-transform transform hover:scale-105">
                  <h3 className="text-xl font-semibold text-white mb-3">{course.title}</h3>
                  <p className="text-gray-300">Instructor: {course.instructor}</p>
                  <Link to={`/course/${course.id}`} className="inline-block mt-4 px-6 py-2 bg-orange-500 text-zinc-900 rounded-full hover:bg-orange-600 transition">
                    View Course
                  </Link>
                </div>
              ))}
            </div>
          </section>
          
        </>
      )}
    </div>
  );
};

export default HomePage;
