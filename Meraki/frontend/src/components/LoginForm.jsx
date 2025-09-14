import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function LoginForm() {
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
        const { token, userId } = data;// Make sure 'data.token' matches the actual response key
        if (token) {
          localStorage.setItem("authToken", token);
          localStorage.setItem("userId", userId);
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
      {/* Added `pt-24` for extra spacing from navbar */}
      <div className="container mx-auto flex flex-col lg:flex-row items-center justify-center min-h-full">

        {/* Image Section */}
        <div className="w-full lg:w-1/2 flex justify-center items-center p-8">
          <img
            src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
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
              <button type="button" className="mx-1 h-9 w-9 rounded-full bg-blue-600 flex items-center justify-center text-white">
                {/* Add SVG for Facebook icon here */}
              </button>
              <button type="button" className="mx-1 h-9 w-9 rounded-full bg-blue-400 flex items-center justify-center text-white">
                {/* Add SVG for Twitter icon here */}
              </button>
              <button type="button" className="mx-1 h-9 w-9 rounded-full bg-blue-800 flex items-center justify-center text-white">
                {/* Add SVG for LinkedIn icon here */}
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
                className="bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-gray-800 w-full px-4 py-3 rounded-lg"
              />
            </div>

            <div className="relative mb-6">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-gray-800 w-full px-4 py-3 rounded-lg"
              />
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="text-red-500 mb-4">
                {errorMessage}
              </div>
            )}

            {/* Sign In Button */}
            <button type="submit" className="w-full py-3 mb-4 bg-primary hover:bg-primary-dark text-white rounded-lg font-semibold">
              Sign in
            </button>

            {/* Sign Up Link */}
            <div className="text-center">
              <p className="text-sm">
                Don't have an account?
                <Link to="/signup" className="text-primary hover:underline">Sign up</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
