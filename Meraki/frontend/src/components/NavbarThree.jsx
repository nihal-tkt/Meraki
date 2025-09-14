import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

// Assuming the user data (e.g., profile picture, name) is available in context or props
const NavbarThree = ({ user }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const handleProfileClick = () => {
        navigate("/dashboard");
    };

    // Handle search form submission
    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery) {
            navigate(`/search?query=${searchQuery}`);
        }
    };

    return (
        <nav className="bg-blue-600 p-4 shadow-lg">
            <div className="flex items-center justify-between max-w-7xl mx-auto">
                {/* Logo Section */}
                <Link to="/home" className="text-white text-2xl font-semibold">Meraki</Link>

                {/* Search Bar */}
                <form onSubmit={handleSearch} className="flex items-center space-x-2">
                    <input
                        type="text"
                        className="py-2 px-4 pl-10 rounded-full text-gray-800 placeholder-gray-500 bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Search for courses..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button type="submit" className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700">
                        <i className="fa fa-search"></i>
                    </button>
                </form>

                {/* Navbar Links */}
                <div className="flex items-center space-x-6">
                    {/* Instructor button */}
                    <Link to="/create-course" className="text-white text-xl hover:text-gray-200">
                        <i className="fa fa-plus"></i>
                    </Link>
                    {/* Cart Button */}
                    <Link to="/created-course" className="text-white text-xl hover:text-gray-200">
                        <i className="fa fa-chalkboard"></i>
                    </Link>

                    {/* My Courses Button
                    <Link to="/my-courses" className="text-white text-xl hover:text-gray-200">
                        <i className="fa fa-book"></i>
                    </Link> */}

                    {/* User Profile Button */}
                    <div className="relative">
                        <div onClick={handleProfileClick} className="cursor-pointer">
                            {user?.profilePhoto ? (
                                <img
                                    src={user.profilePhoto}
                                    alt="Profile"
                                    className="w-10 h-10 rounded-full object-cover border-2 border-white"
                                />
                            ) : (
                                <i className="fa fa-user-circle text-white text-2xl"></i>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default NavbarThree;
