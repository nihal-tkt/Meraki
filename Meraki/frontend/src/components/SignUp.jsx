import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignUpForm() {
  const [userType, setUserType] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [fullName, setFullName] = useState("");

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/api/v1/auth/google";
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple validation
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    // Step 2: Send form data to the backend
    try {
      const response = await fetch("http://localhost:5000/api/v1/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: fullName,
          email,
          password,
          role: userType,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Registration successful!");
        // Redirect based on user role
        if (userType === "student") {
          navigate("/login");
        } else if (userType === "instructor") {
          navigate("/loginTwo");
        }
      } else {
        if (data.errors) {
          const errorMessages = data.errors.map((error) => error.msg).join(", ");
          setErrorMessage(errorMessages);
        } else {
          setErrorMessage(data.message || "An error occurred during registration.");
        }
      }
    } catch (error) {
      setErrorMessage("Failed to register. Please try again.");
    }
  };

  return (
    <section className="min-h-screen pt-24 bg-dark text-white">
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
        <div className="w-full lg:w-1/2 flex justify-center items-center p-4">
          <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-sm">
            {/* Social Sign Up */}
            <div className="flex flex-row items-center justify-center lg:justify-start mb-4">
              <p className="mr-4 text-lg">Sign up with</p>
              {/* Social Media Buttons */}
              <button type="button" className="mx-1 h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                {/* Add SVG for Facebook icon */}
              </button>
              <button type="button" className="mx-1 h-8 w-8 rounded-full bg-blue-400 flex items-center justify-center text-white">
                {/* Add SVG for Twitter icon */}
              </button>
              <button type="button" className="mx-1 h-8 w-8 rounded-full bg-blue-800 flex items-center justify-center text-white">
                {/* Add SVG for LinkedIn icon */}
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center my-4">
              <div className="flex-1 border-t border-neutral-600"></div>
              <p className="px-4 text-center font-semibold">Or</p>
              <div className="flex-1 border-t border-neutral-600"></div>
            </div>

            {/* Input Fields */}
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-gray-800 w-full py-2 px-3 rounded"
              />
            </div>

            <div className="relative mb-4">
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-gray-800 w-full py-2 px-3 rounded"
              />
            </div>

            <div className="relative mb-4">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-gray-800 w-full py-2 px-3 rounded"
              />
            </div>

            <div className="relative mb-4">
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-gray-800 w-full py-2 px-3 rounded"
              />
            </div>

            {/* User Type Selection */}
            <div className="mb-4">
              <p className="text-lg mb-2">Sign up as:</p>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="userType"
                    value="student"
                    checked={userType === "student"}
                    onChange={() => setUserType("student")}
                    className="form-radio text-primary"
                  />
                  <span className="ml-2">Student</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="userType"
                    value="instructor"
                    checked={userType === "instructor"}
                    onChange={() => setUserType("instructor")}
                    className="form-radio text-primary"
                  />
                  <span className="ml-2">Instructor</span>
                </label>
              </div>
            </div>

            {errorMessage && <p className="text-red-500">{errorMessage}</p>}

            {/* Sign Up Button */}
            <button type="submit" className="w-full py-2 mb-4 bg-primary hover:bg-primary-dark text-white rounded-lg font-semibold">
              Sign up
            </button>

            {/* Google Login Button */}
            <button
              type="button"
              className="mx-1 h-8 w-8 rounded-full bg-red-500 flex items-center justify-center text-white"
              onClick={handleGoogleLogin}
            >
              G
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
