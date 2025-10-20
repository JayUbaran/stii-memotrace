import React, { useState, useEffect, useRef } from 'react';
import { FaMapMarkerAlt, FaTimes, FaPaperPlane, FaEllipsisV } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useNavigate, Link } from "react-router-dom";
import Swal from 'sweetalert2';
import "leaflet/dist/leaflet.css"; 

const Event = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [activeMsgMenu, setActiveMsgMenu] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const currentUser = user;

  // Fetch session and events on mount
  useEffect(() => {
    checkSession();
    fetchEvents();
  }, []);

  // Session check
  const checkSession = async () => {
    try {
      const res = await fetch("https://server-t48e.onrender.com/api/session", { credentials: "include" });
      const data = await res.json();
      if (res.ok) setUser(data.user);
      else navigate("/login");
    } catch (err) {
      console.error("Session check failed:", err);
    }
  };

  // Fetch all events
  const fetchEvents = async () => {
    try {
      const response = await fetch("https://server-t48e.onrender.com/api/events", {
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) setEvents(data.events);
      else console.error("Error fetching events:", data.error);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    }
  };

  // OpenStreetMap location search
  useEffect(() => {
    if (searchQuery.length > 2) {
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}`)
        .then(res => res.json())
        .then(data => setSearchResults(data))
        .catch(err => console.error("Error fetching locations:", err));
    } else setSearchResults([]);
  }, [searchQuery]);

  // Delete event
  const handleDelete = async (eventId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`https://server-t48e.onrender.com/api/events/${eventId}`, {
            method: "DELETE",
            credentials: "include",
          });
          const data = await response.json();
          if (data.success) {
            Swal.fire("Deleted!", "Your event has been deleted.", "success");
            fetchEvents();
          } else {
            Swal.fire("Error!", data.error || "Failed to delete event.", "error");
          }
        } catch (error) {
          Swal.fire("Error!", "Failed to delete event.", "error");
        }
      }
    });
  };

  // Open chat modal
  const handleMessageClick = async (event) => {
    const userToChat = {
      id: event.user_id,
      name: `${event.first_name || "Unknown"} ${event.last_name || ""}`,
      profile_image: event.profile,
    };
    setSelectedUser(userToChat);

    try {
      const res = await fetch(`https://server-t48e.onrender.com/api/messages/${currentUser.id}/${userToChat.id}`);
      const data = await res.json();
      setMessages(data.map(m => ({
        id: m.id,
        sender: m.sender_id === currentUser.id ? "me" : "them",
        text: m.message,
        created_at: m.created_at,
      })));
    } catch (err) {
      console.error(err);
      setMessages([]);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const messageText = input;
    setMessages([...messages, { sender: "me", text: messageText }]);
    setInput("");

    try {
      await fetch("https://server-t48e.onrender.com/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender_id: currentUser.id,
          receiver_id: selectedUser.id,
          message: messageText,
        }),
      });
    } catch (err) {
      console.error("Failed to save message", err);
    }
  };

  const handleUnsendMessage = async (id) => {
    try {
      const res = await fetch(`https://server-t48e.onrender.com/api/messages/${id}`, { method: "DELETE" });
      if (res.ok) setMessages(prev => prev.filter(m => m.id !== id));
      setActiveMsgMenu(null);
    } catch (err) {
      console.error("Unsend failed", err);
    }
  };

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="space-y-6">
      <h2 className="font-bold mt-3 text-lg">Recent Events</h2>

      {events.length === 0 && <p>No events found.</p>}

      {events.map(event => (
        <div key={event.id} className="border rounded-lg p-4 shadow-sm bg-white relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => navigate(user?.id === event.user_id ? "/userprofile" : `/profiles/${event.user_id}`)}
            >
              {event.profile ? (
                <img
                  src={event.profile}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                />
              ) : (
                <div className="w-10 h-10 bg-blue-500 rounded-full flex justify-center items-center text-white font-bold">
                  {event.first_name?.charAt(0) || "?"}
                </div>
              )}
              <div>
                <h2 className="font-semibold text-gray-800">{event.first_name || "Unknown User"}</h2>
                <p className="text-xs text-gray-500">
                  {new Date(event.created_at).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>

            {/* Message button */}
            {user?.id !== event.user_id && (
              <button
                onClick={(e) => { e.stopPropagation(); handleMessageClick(event); }}
                className="bg-blue-600 text-white px-3 py-1.5 text-xs rounded-md hover:bg-blue-700 transition"
              >
                Message
              </button>
            )}

            {/* Dropdown menu for edit/delete */}
            {user?.id === event.user_id && (
              <div className="relative">
                <button onClick={() => setMenuOpen(menuOpen === event.id ? null : event.id)}>
                  <BsThreeDotsVertical className="text-gray-600 hover:text-gray-800" />
                </button>
                {menuOpen === event.id && (
                  <div className="absolute right-0 mt-2 w-32 bg-white border rounded-lg shadow-lg z-10">
                    <button
                      onClick={() => handleDelete(event.id)}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Content */}
          <p className="mt-3">{event.content}</p>
          {event.location_name && (
            <p className="text-gray-600 mt-3">
              <FaMapMarkerAlt className="inline-block text-red-500 mr-1" />
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location_name)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                {event.location_name}
              </a>
            </p>
          )}

          {/* Event images */}
          {event.images?.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mt-2">
              {event.images.map((image, idx) => (
                <img
                  key={idx}
                  src={image}
                  alt="Event"
                  className="rounded-lg cursor-pointer"
                  onClick={() => setSelectedImage(image)}
                />
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Image Preview Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 w-screen h-screen bg-black bg-opacity-75 flex justify-center items-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Expanded Event"
            className="max-w-full max-h-full rounded-lg shadow-lg"
          />
        </div>
      )}

      {/* Chat modal */}
      {selectedUser && (
        <div className="fixed inset-0 flex items-end md:items-center justify-center bg-black bg-opacity-5 z-50">
          <div className="bg-white w-full h-full md:w-3/5 md:h-[70vh] lg:w-1/2 rounded-t-lg md:rounded-lg shadow-2xl flex flex-col">
            {/* Header */}
            <div className="bg-blue-600 text-white p-4 flex justify-between items-center rounded-t-lg flex-shrink-0">
              <div className="flex items-center space-x-3">
                <Link to={user?.id === selectedUser.id ? "/userprofile" : `/profiles/${selectedUser.id}`} className="flex items-center space-x-3">
                  {selectedUser.profile_image ? (
                    <img src={selectedUser.profile_image} alt={selectedUser.name} className="w-10 h-10 rounded-full object-cover border-2 border-white" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-blue-600 font-semibold text-lg border-2 border-white">
                      {selectedUser.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <h2 className="font-semibold text-lg text-white hover:underline">{selectedUser.name}</h2>
                </Link>
              </div>
              <FaTimes className="cursor-pointer hover:text-gray-200" onClick={() => { setSelectedUser(null); setMessages([]); }} />
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-4">
              {messages.length === 0 ? (
                <p className="text-gray-400 text-sm text-center mt-4">No messages yet. Start the conversation!</p>
              ) : messages.map((msg, i) => (
                <div key={i} className={`flex items-start gap-2 ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
                  {msg.sender === "me" && (
                    <div className="relative flex items-center">
                      <FaEllipsisV className="text-gray-400 hover:text-gray-600 cursor-pointer mr-1"
                        onClick={(e) => { e.stopPropagation(); setActiveMsgMenu(activeMsgMenu === i ? null : i); }}
                      />
                      {activeMsgMenu === i && (
                        <div className="absolute -left-10 top-0 bg-white border rounded shadow text-sm z-50">
                          <button
                            className="block w-full px-4 py-2 text-left hover:bg-gray-100 text-red-500"
                            onClick={() => setConfirmAction({ type: "unsend", msgId: msg.id })}
                          >
                            Unsend
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                  <div className={`relative px-4 py-2 text-sm max-w-[70%] shadow-sm rounded-lg ${msg.sender === "me" ? "bg-blue-500 text-white rounded-br-none" : "bg-gray-200 text-gray-800 rounded-bl-none"}`}>
                    {msg.text}
                    <span className="block text-xs mt-1 opacity-70 text-right">
                      {msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="mb-[5.5rem] sm:mb-0 p-3 border-t border-gray-300 flex items-center space-x-2 bg-white flex-shrink-0">
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button onClick={handleSend} className="bg-blue-600 text-white p-2 px-3 rounded-md hover:bg-blue-700 transition">
                <FaPaperPlane size={14} />
              </button>
            </div>

            {/* Unsend Confirmation */}
            {confirmAction?.type === "unsend" && (
              <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-xl p-6 w-80 text-center">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Unsend Message</h3>
                  <p className="text-gray-600 text-sm mb-6">Are you sure you want to unsend this message? It will be permanently deleted.</p>
                  <div className="flex justify-around">
                    <button onClick={() => setConfirmAction(null)} className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 text-sm">Cancel</button>
                    <button onClick={() => { handleUnsendMessage(confirmAction.msgId); setConfirmAction(null); }} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm">Unsend</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Event;
