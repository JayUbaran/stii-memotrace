import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";

import Sidebar from "../navbar/sidebar";
import Event from "../navbar/event";
import CreateAdminPost from '../navbar/CreateAdminPost';
import AdminPost from '../navbar/AdminPost';

export default function Post({ onSearch }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Get initial tab from URL query param (optional)
  const searchParams = new URLSearchParams(location.search);
  const initialTab = searchParams.get('tab') === 'event' ? false : true;

  const [showPostSection, setShowPostSection] = useState(initialTab);
  const [inputValue, setInputValue] = useState('');

  // Example posts data
  const [posts, setPosts] = useState([
    { id: 1, title: "Post 1", content: "This is post 1" },
    { id: 2, title: "Post 2", content: "This is post 2" },
  ]);

  const handleSearch = () => {
    if (inputValue.trim()) {
      onSearch?.(inputValue); // call prop if passed
      navigate(`/searchresult?query=${encodeURIComponent(inputValue)}`);
    }
  };

  // Update URL when toggling tabs (optional, preserves state on reload)
  const handleTabChange = (isPost) => {
    setShowPostSection(isPost);
    navigate(`?tab=${isPost ? 'post' : 'event'}`, { replace: true });
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6 md:ml-64 bg-gray-100 min-h-screen">
        <div className="w-full mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">
              {showPostSection ? "Community Posts" : "Community Events"}
            </h1>

            {/* Search Box */}
            <div className="flex items-center bg-white p-2 rounded-lg shadow-md">
              <FaSearch className="text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="Search"
                className="outline-none bg-transparent"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button
                onClick={handleSearch}
                className="bg-blue-500 text-white px-4 py-1 ml-2 rounded-lg"
              >
                Search
              </button>
            </div>
          </div>

          {/* Tab Buttons */}
          <div className="flex gap-4 items-center mb-5">
            <button
              onClick={() => handleTabChange(true)}
              className={`px-4 py-2 font-bold rounded-lg ${
                showPostSection ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Post
            </button>
            <button
              onClick={() => handleTabChange(false)}
              className={`px-4 py-2 font-bold rounded-lg ${
                !showPostSection ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Event
            </button>
          </div>

          {/* Content */}
          {showPostSection ? (
            <>
              {/* Create Post Section */}
              <CreateAdminPost />

              {/* Posts Section */}
              <div className="space-y-6 mb-24">
                {posts.map((post) => (
                  <AdminPost key={post.id} data={post} />
                ))}
              </div>
            </>
          ) : (
            <Event />
          )}
        </div>
      </div>
    </div>
  );
}
