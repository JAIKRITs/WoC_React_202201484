import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { motion } from "framer-motion";

// Initialize the Google Generative AI model
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const AIChat = ({ onClose }) => {
  const [messages, setMessages] = useState(["Hello! How can I assist you?"]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (input.trim()) {
      setMessages((prevMessages) => [...prevMessages, `You: ${input}`]);
      setInput("");
      setIsLoading(true);

      try {
        const result = await model.generateContent(input);
        const response = await result.response.text();
        setMessages((prevMessages) => [...prevMessages, `AI: ${response}`]);
      } catch (err) {
        console.error(err);
        setMessages((prevMessages) => [...prevMessages, `AI: Sorry, something went wrong.`]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-gray-800 text-white p-6 rounded-lg w-full max-w-sm shadow-xl border border-gray-700"
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <svg
            height="24px"
            width="24px"
            version="1.1"
            id="Capa_1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 58 58"
            xmlSpace="preserve"
            className="w-6 h-6 mr-2"
          >
            <g>
              <path
                style={{ fill: "#0391FD" }}
                d="M25,9.586C11.193,9.586,0,19.621,0,32c0,4.562,1.524,8.803,4.135,12.343
                C3.792,48.433,2.805,54.194,0,57c0,0,8.47-1.191,14.273-4.651c0.006-0.004,0.009-0.01,0.014-0.013
                c1.794-1.106,3.809-2.397,4.302-2.783c0.301-0.417,0.879-0.543,1.328-0.271c0.298,0.181,0.487,0.512,0.488,0.86
                c0.003,0.582-0.008,0.744-3.651,3.018c2.582,0.81,5.355,1.254,8.245,1.254c13.807,0,25-10.035,25-22.414S38.807,9.586,25,9.586z"
              />
              <path
                style={{ fill: "#0F71D3" }}
                d="M58,23.414C58,11.035,46.807,1,33,1c-9.97,0-18.575,5.234-22.589,12.804
                C14.518,11.153,19.553,9.586,25,9.586c13.807,0,25,10.035,25,22.414c0,4.735-1.642,9.124-4.437,12.743
                C51.162,47.448,58,48.414,58,48.414c-2.805-2.805-3.792-8.566-4.135-12.657C56.476,32.217,58,27.976,58,23.414z"
              />
              <path
                style={{ fill: "#FFFFFF" }}
                d="M32.5,26h-14c-0.552,0-1-0.447-1-1s0.448-1,1-1h14c0.552,0,1,0.447,1,1S33.052,26,32.5,26z"
              />
              <path
                style={{ fill: "#FFFFFF" }}
                d="M38,33H13c-0.552,0-1-0.447-1-1s0.448-1,1-1h25c0.552,0,1,0.447,1,1S38.552,33,38,33z"
              />
              <path
                style={{ fill: "#FFFFFF" }}
                d="M38,40H13c-0.552,0-1-0.447-1-1s0.448-1,1-1h25c0.552,0,1,0.447,1,1S38.552,40,38,40z"
              />
            </g>
          </svg>
          <h2 className="text-lg font-bold">AI Chat</h2>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <span className="material-icons">close</span>
        </button>
      </div>
      <div className="h-40 overflow-y-auto mb-4 bg-gray-900 p-3 rounded-lg">
        {messages.map((msg, index) => (
          <p key={index} className="text-sm mb-2">
            {msg}
          </p>
        ))}
        {isLoading && (
          <p className="text-sm text-gray-400">AI is typing...</p>
        )}
      </div>
      <div className="flex space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-grow px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type a message..."
          disabled={isLoading}
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSend}
          className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
          disabled={isLoading}
        >
          Send
        </motion.button>
      </div>
    </motion.div>
  );
};

export default AIChat;