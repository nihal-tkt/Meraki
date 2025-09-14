import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    /* Footer Section */
    <footer className="mt-16 bg-zinc-900 py-6">
      <div className="text-center text-gray-300">
        <p>© 2024 Meraki - All rights reserved</p>
        <div className="mt-4">
          <Link to="/about-us" className="mx-2 text-orange-500 hover:underline">
            About
          </Link>
          <Link to="/footer" className="mx-2 text-orange-500 hover:underline">
            Contact
          </Link>
          <Link
            to="/privacy"
            className="mx-2 text-white bg-orange-500 px-4 py-2 rounded-md hover:bg-orange-600 transition-colors"
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
