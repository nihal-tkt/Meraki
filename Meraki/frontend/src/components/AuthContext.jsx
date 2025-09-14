import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Fetch user data from backend using token from localStorage
  const fetchUser = async () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const response = await fetch('http://localhost:5000/api/v1/user/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,  // Pass the token for authentication
          },
        });

        // Ensure we are getting the correct response
        const data = await response.json();
        if (response.ok) {
          setUser(data.user);  // Set the user data in context if successful
        } else {
          console.error('Failed to fetch user:', data.message);
          setUser(null); // Clear user if fetch fails
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        setUser(null);
      }
    } else {
      setUser(null);  // Clear user if no token exists
    }
  };

  useEffect(() => {
    fetchUser();  // Fetch the user when the app first loads or on token change
  }, []);  // This runs once when the component mounts

  // Manually refresh user data (to be used after login)
  const refreshUser = async () => {
    await fetchUser();
  };

  return (
    <AuthContext.Provider value={{ user, setUser, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
