import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const LoginTwo = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { refreshUser } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Clear any previous error messages

    try {
      const response = await fetch("http://localhost:5000/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Handle successful login, such as storing token or redirecting
        console.log("Login successful:", data);

        const token = data.token; // Make sure 'data.token' matches the actual response key
        if (token) {
          localStorage.setItem("authToken", token);
          await refreshUser();
          console.log("Token saved to localStorage:", token);
        }

        navigate("/home");
      } else {
        // Show error message if login failed
        setErrorMessage(data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again later.");
      console.error("Error:", error);
    }
  };

  return (
    <section className="min-h-screen pt-24 bg-dark text-white">
      <div className="container mx-auto flex flex-col lg:flex-row items-center justify-center min-h-full">
        
        {/* Image Section */}
        <div className="w-full lg:w-1/2 flex justify-center items-center p-8">
          <img
            src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg"
            className="w-full max-w-md"
            alt="Sample"
          />
        </div>

        {/* Form Section */}
        <div className="w-full lg:w-1/2 flex justify-center items-center p-8">
          <form onSubmit={handleLogin} className="bg-gray-800 p-10 rounded-lg shadow-lg w-full max-w-md">
            
            {/* Social Login */}
            <div className="flex flex-row items-center justify-center lg:justify-start mb-6">
              <p className="mr-4 text-lg">Sign in with</p>
              <button type="button" className="mx-1 h-9 w-9 rounded-full bg-red-600 flex items-center justify-center text-white">
                {/* Google Logo */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2c-5.528 0-10 4.472-10 10s4.472 10 10 10 10-4.472 10-10-4.472-10-10-10zm2.186 12.708h-2.186v2.793h-2.793v-2.793h-2.793v-2.793h2.793v-2.793h2.793v2.793h2.186l.932 2.793h-3.118v2.793z" />
                </svg>
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center my-6">
              <div className="flex-1 border-t border-neutral-600"></div>
              <p className="px-4 text-center font-semibold">Or</p>
              <div className="flex-1 border-t border-neutral-600"></div>
            </div>

            {/* Input Fields */}
            <div className="relative mb-6">
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-gray-800"
              />
            </div>

            <div className="relative mb-6">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-gray-800"
              />
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="text-red-500 mb-4" aria-live="assertive">
                {errorMessage}
              </div>
            )}

            {/* Sign In Button */}
            <button type="submit" className="w-full py-3 mb-4 bg-primary hover:bg-primary-dark text-white rounded-lg font-semibold">
              Sign in
            </button>

            {/* Sign Up Link */}
            <div className="text-center">
              <p className="text-sm">Don't have an account? <a href="/signup" className="text-primary hover:underline">Sign up</a></p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default LoginTwo;
