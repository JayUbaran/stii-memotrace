import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavLink from "./linkbar";
import BookLoverImage from "../src/assets/images/undraw.png";
import bg from "../src/assets/images/bg.png";

const MemoryMapLanding = () => {
  const navigate = useNavigate();

  // Check if user is logged in
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("https://server-t48e.onrender.com/api/session", {
          method: "GET",
          credentials: "include",
        });

        const data = await response.json();

        if (response.ok && data.user) {
          if (data.user.role === "admin") {
            navigate("/dashboard");
          } else if (data.user.has_submitted_survey) {
            navigate("/userhome");
          } else {
            navigate("/surveyq");
          }
        }
      } catch (error) {
        console.error("Session check failed:", error);
      }
    };

    checkSession();
  }, [navigate]);

  return (
    <div className="relative flex items-center justify-center min-h-screen w-screen overflow-hidden">
      {/* Background */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat animate-background"
        style={{ backgroundImage: `url(${bg})` }}
      ></div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-blue-500 to-transparent opacity-50 animate-gradient"></div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2.5 h-2.5 sm:w-3 sm:h-3 bg-blue-400 opacity-50 rounded-full animate-float"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: "6s",
            }}
          ></div>
        ))}
      </div>

      <NavLink />

      {/* Content Section */}
      <div className="relative flex flex-col md:flex-row items-center md:items-start justify-center md:justify-start p-4 sm:p-6 md:p-10 space-y-6 md:space-y-0 md:space-x-10 z-10">
        {/* Logo behind text */}
        <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
          <img
            src={BookLoverImage}
            alt="Logo"
            className="w-64 sm:w-80 md:w-96 lg:w-[400px] opacity-30 md:opacity-50 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          />
        </div>

        {/* Text Content */}
        <div className="relative w-full md:w-1/2 text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white animate-glow">
            Welcome to <span className="text-blue-300">MemoTrace</span>
          </h1>
          <p className="mt-4 text-white text-xs sm:text-sm md:text-base lg:text-lg animate-fade-in">
            A web-based alumni and graduates tracker system for Sibugay Technical Institute Incorporated.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center md:justify-start">
            <button
              className="bg-blue-500 hover:bg-blue-700 px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-white shadow-md transition animate-pop-up"
              onClick={() => navigate("/register")}
            >
              Sign up
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Navbar */}
      <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-70 py-4 animate-pop-up">
        <nav className="flex justify-center items-center text-white">
          <p className="text-xs sm:text-sm opacity-75">
            © {new Date().getFullYear()} MemoTrace. All Rights Reserved.
          </p>
        </nav>
      </div>
    </div>
  );
};

export default MemoryMapLanding;
