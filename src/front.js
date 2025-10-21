import React,{useEffect} from "react";
import { useNavigate,} from "react-router-dom";
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
          credentials: "include", // Include cookies
        });
  
        const data = await response.json();
  
        if (response.ok && data.user) {
          if (data.user.role === "admin") {
            navigate("/dashboard");
          } else if (data.user.has_submitted_survey) {
            navigate("/userhome"); // ✅ If survey is submitted, go to user home
          } else {
            navigate("/surveyq"); // ❌ If not, go to survey page
          }
        }
      } catch (error) {
        console.error("Session check failed:", error);
      }
    };
  
    checkSession();
  }, [navigate]); 

  return (
    <div className="relative flex items-center justify-center h-screen w-screen overflow-hidden">
      {/* Background with Animation */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat animate-background"
        style={{ backgroundImage: `url(${bg})` }}
      ></div>
      
      {/* Gradient Overlay Animation */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-blue-500 to-transparent opacity-50 animate-gradient"></div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-3 h-3 bg-blue-400 opacity-50 rounded-full animate-float"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: "6s",
            }}
          ></div>
        ))}
      </div>
<NavLink/>

      {/* Content Section */}
<div className=" text-green p-6 md:p-10 flex flex-wrap md:flex-nowrap absolute left-0 ml-5 animate-pop-up" style={{ animationDelay: "0.5s" }}>
  
{/* Logo Behind the Text */}
<div className="absolute inset-0 flex justify-center items-center">
  <img 
    src={BookLoverImage} 
    alt="Logo" 
    className="w-[400px] opacity-50 md:opacity-70 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
  />  
</div>


{/* Text Content */}
<div className="relative w-full md:w-1/2 text-center md:text-left z-10">
  <h1 className="text-4xl text-white md:text-6xl lg:text-9xl font-bold animate-glow">
    Welcome to <span className="text-blue-300">MemoTrace</span>
  </h1>
  <p className="mt-4 text-white text-sm md:text-base animate-fade-in">
    A web-based alumni and graduates tracker system for Sibugay Technical Institute Incorporated.
  </p>
  <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
    <button
      className="bg-blue-500 hover:bg-blue-700 px-4 md:px-6 py-2 md:py-3 rounded-lg text-white shadow-md transition mx-2 md:mx-4 animate-pop-up"
      style={{ animationDelay: "0.7s" }}
      onClick={() => navigate("/register")}
    >
      Sign up
    </button>
  </div>
</div>
</div>


            {/* Bottom Navbar with Pop-Up Animation */}
            <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-70 py-4 animate-pop-up">
        <nav className="flex justify-center items-center text-white">
          <p className="text-sm opacity-75">© {new Date().getFullYear()} MemoTrace. All Rights Reserved.</p>
        </nav>
      </div>

    </div>
  );
};

export default MemoryMapLanding;

