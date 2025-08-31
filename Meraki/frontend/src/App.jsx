import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import Marquee from './components/Marquee';
import About from './components/About';
import Eyes from './components/eyes';
import Featured from './components/Featured';
import Cards from './components/Cards';
import Footer from './components/Footer';
import Foot from './components/Foot';
import LoginForm from './components/LoginForm';
import LoginTwo from './components/LoginTwo';
import AboutUs from './components/AboutUs';
import SignUp from './components/SignUp';
import NavbarTwo from './components/NavbarTwo';
import Dashboard from './components/Dashboard';
import EditProfile from './components/EditProfile';
import CreateCourse from './components/CreateCourse';
import NavbarThree from './components/NavbarThree';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './components/AuthContext';
import CreatedCourses from './components/CreatedCourses';
import CourseDetail from './components/CourseDetail';
import EditCourse from './components/EditCourse';
import CoursesList from './components/CoursesList';
import SearchResults from './components/SearchResults';
import CourseDetails from './components/CourseDetails';
import CartPage from './components/CartPage';
import SuccessPage from './components/SuccessPage';
import CancelPage from './components/CancelPage';
import MyCourses from './components/MyCourses';
import MyCourseDetail from './components/MyCourseDetail';
import MyChat from './components/MyChat';
import AllChats from './components/AllChats';
import UnreadMessages from './components/UnreadMessages';
import AddReview from './components/AddReview';
import AddLecture from './components/AddLecture';
import AddAssignment from './components/AddAssignment';
import MyAssignment from './components/MyAssignment';
import MyAssignmentsInstructor from './components/MyAssignmentInstructor';


import Features from './components/Features';
import Testimonials from './components/Testimonials';
import Pricing from './components/Pricing';
import Checking from './components/Checking';
import PrivacyPolicy from './components/PrivacyPolicy';
import InstructorD from './components/InstructorD';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="w-full min-h-screen bg-zinc-900 text-white">
          <Routes>
            <Route path="/" element={
              <>
                <Navbar />
                <LandingPage />
                <Marquee />
                <About />
                <Eyes />
                <Featured />
                <Testimonials />
                
                
                <Footer />
                
               
                {/* <Pricing /> */}
                <Foot />
               
                
                {/* <Instruct />
                <MyCourses /> */}
              </>
            } />

            <Route path="/home" element={
              <>
                <NavbarTwo />
                <Checking />
                <Features />
                <CoursesList />
              </>
            } />

            <Route path="/my-courses" element={
              <>
                <NavbarTwo />
                <MyCourses />
              </>
            } />

            <Route path="/dashboard" element={
              <>
                <Dashboard />

              </>
            } />

            <Route path="/edit-profile" element={
              <>
                <EditProfile />

              </>
            } />

            <Route path="/success" element={
              <>
                <SuccessPage />

              </>
            } />

            <Route path="/cancel" element={
              <>
                <CancelPage />

              </>
            } />

            <Route path="/create-course" element={
              <>
                <CreateCourse />

              </>
            } />
            <Route path="/cart" element={
              <>
                <CartPage />

              </>
            } />

            <Route path="/created-course" element={
              <>
                <CreatedCourses />

              </>
            } />

            <Route path="/search" element={
              <>
                <NavbarTwo />
                <SearchResults />
              </>
            } />
            <Route path="/privacy" element={
              <>
              <PrivacyPolicy />
              </>
            }/>

            <Route path="/courses/:courseId" element={<CourseDetails />} />

            <Route path="/mycourse/:courseId" element={<MyCourseDetail />} />

            <Route path="mychat/:courseId/:userId" element={<MyChat />} />

            <Route path="/unread-messages/:courseId" element={<UnreadMessages />} />
            <Route path="/all-chats/:courseId" element={<AllChats />} />

            {/* <Route path="mychat/:courseId/:studentId" element={<MyIChat />} /> */}

            <Route path="/addreview/:courseId" element={<AddReview />} />

            <Route path="/add-lecture/:courseId" element={<AddLecture />} />

            <Route path="/add-assignment/:courseId" element={<AddAssignment />} />

            <Route path="/assignments/:courseId" element={<MyAssignment />} />

            <Route path="/assignment/:courseId" element={<MyAssignmentsInstructor />} />


            <Route path="/course/:id" element={
              <>
                <CourseDetail />

              </>
            } />

            <Route path="/edit-course/:id" element={
              <>
                <EditCourse />

              </>
            } />

            <Route path="/instructor" element={
              <ProtectedRoute allowedRoles={['instructor']}>
                <NavbarThree />
                <InstructorD/>
              </ProtectedRoute>
            } />

            <Route path="/about-us" element={<><Navbar /><AboutUs /></>} />
            <Route path="/login" element={<><Navbar /><LoginForm /></>} />
            <Route path="/loginTwo" element={<><Navbar /><LoginTwo /></>} />
            <Route path="/footer" element={<Footer />} />
            <Route path="/signup" element={<SignUp />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
