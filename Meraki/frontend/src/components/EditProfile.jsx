import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditProfile = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    bio: '',
    skills: '',
    profilePhoto: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  // Fetch the current user profile to populate the form
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('authToken');

      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/v1/user/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { fullName, email, bio, skills, profilePhoto } = response.data.user;
        setFormData({ fullName, email, bio, skills: skills.join(', '), profilePhoto });
      } catch (error) {
        setErrorMessage('Failed to fetch user data.');
        console.error(error);
      }
    };

    fetchUserData();
  }, [navigate]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle profile photo upload
  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      setErrorMessage('No file selected.');
      return;
    }

    const uploadData = new FormData();
    uploadData.append('profilePhoto', file);

    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.put('http://localhost:5000/api/v1/user/update-profile', uploadData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response);

      setFormData((prev) => ({ ...prev, profilePhoto: response.data.imageUrl }));
      setSuccessMessage('Photo uploaded successfully!');
    } catch (error) {
      console.error('Error uploading photo:', error);
      setErrorMessage('Failed to upload profile photo.');
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await axios.put(
        'http://localhost:5000/api/v1/user/update-profile',
        {
          ...formData,
          skills: formData.skills.split(',').map((skill) => skill.trim()), // Convert skills string to array
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccessMessage(response.data.message);
      setTimeout(() => {
        navigate('/dashboard'); // Redirect to dashboard after successful save
      }, 2000); // Add a slight delay to show success message
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrorMessage(error.response?.data?.message || 'Failed to update profile.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-zinc-900">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-gray-800 text-center">Edit Profile</h2>

        {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}
        {successMessage && <p className="text-green-500 text-center">{successMessage}</p>}

        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded text-gray-800"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded text-gray-800"
          />
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows="3"
            className="w-full mt-1 p-2 border rounded text-gray-800"
          ></textarea>
        </div>

        {/* Skills */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Skills (comma-separated)</label>
          <input
            type="text"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded text-gray-800"
          />
        </div>

        {/* Profile Photo */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Profile Photo</label>
          <input
            type="file"
            onChange={handlePhotoUpload}
            className="w-full mt-1"
          />
          {formData.profilePhoto && (
            <img
              src={formData.profilePhoto}
              alt="Profile Preview"
              className="w-24 h-24 rounded-full mt-2"
            />
          )}
        </div>

        {/* Buttons */}
        <div className="mt-6 flex justify-between">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
