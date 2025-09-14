import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const Dashboard = () => {
  const [user, setUser] = useState({
    fullName: '',
    email: '',
    role: '',
    profilePhoto: '',
    bio: '',
    skills: [],
  });
  const navigate = useNavigate();

  // Fetch user data from API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('authToken'); // Get token from localStorage
        if (!token) {
          navigate('/login'); // Redirect to login if token is missing
          return;
        }

        const response = await axios.get('http://localhost:5000/api/v1/user/profile', {
          headers: {
            Authorization: `Bearer ${token}`, // Send the token in the Authorization header
          },
        });

        setUser(response.data.user); // Set user data from API response
      } catch (error) {
        console.error('Error fetching user data', error);
      }
    };

    fetchUserData();
  }, [navigate]);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Clear token
    setUser(null);
    navigate('/login'); // Redirect to login page
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-orange-400 to-zinc-400">
    <div className="bg-white p-8 rounded-xl shadow-xl max-w-lg w-full transform transition-transform hover:scale-105">
      {/* Profile Picture */}
      <div className="flex justify-center mb-6">
        <img
          src={user.profilePhoto || '../../ProjectImg/pp.jpg'}
          alt="Profile"
          className="w-32 h-32 rounded-full object-cover border-4 border-indigo-500"
        />
      </div>
  
      {/* User Information */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-semibold text-gray-800">{user.fullName || 'John Doe'}</h2>
        <p className="text-sm text-gray-600">{user.email || 'johndoe@example.com'}</p>
        <p className="text-sm text-gray-600 italic">{user.role || 'Student'}</p>
      </div>
  
      {/* Skills Section */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold text-gray-700">Skills</h3>
        <ul className="list-disc list-inside text-gray-600">
          {user.skills.length > 0 ? (
            user.skills.map((skill, index) => <li key={index} className="transition-colors hover:text-blue-500">{skill}</li>)
          ) : (
            <li className="italic text-gray-500">No skills added yet.</li>
          )}
        </ul>
      </div>
  
      {/* Bio Section */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold text-gray-700">Bio</h3>
        <p className="text-gray-600">{user.bio || 'No bio available.'}</p>
      </div>
  
      {/* Buttons */}
      <div className="mt-8 space-x-4 flex justify-center">
        <button
          onClick={() => navigate('/edit-profile')}
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-md font-medium hover:from-blue-700 hover:to-blue-800 transition-colors duration-300 transform hover:scale-105"
        >
          Edit Profile
        </button>
        <button
          onClick={handleLogout}
          className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-md font-medium hover:from-red-700 hover:to-red-800 transition-colors duration-300 transform hover:scale-105"
        >
          Logout
        </button>
      </div>
    </div>
  </div>
  
  );
};

export default Dashboard;
