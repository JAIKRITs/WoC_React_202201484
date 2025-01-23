import React, { useState } from "react";

const Terminal = ({ onClose }) => {
  const [input, setInput] = useState(""); // For user input
  const [output, setOutput] = useState(""); // For terminal output

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleRunCommand = () => {
    setOutput(`You entered: ${input}`); // Simulate output
    setInput(""); // Clear input after execution
  };

  return (
    <div className="bg-black text-green-400 font-mono p-4 rounded-md flex justify-between items-start relative">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded-md"
      >
        Close
      </button>

      {/* Input Section */}
      <div className="w-1/2 mr-2">
        <h3 className="text-white mb-2">Input</h3>
        <textarea
          value={input}
          onChange={handleInputChange}
          placeholder="Type your commands here..."
          className="w-full h-40 bg-gray-800 text-green-400 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          onClick={handleRunCommand}
          className="mt-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          Run
        </button>
      </div>

      {/* Output Section */}
      <div className="w-1/2 ml-2">
        <h3 className="text-white mb-2">Output</h3>
        <div className="w-full h-40 bg-gray-800 text-green-400 p-2 rounded-md overflow-y-auto">
          {output || "No output yet."}
        </div>
      </div>
    </div>
  );
};

export default Terminal;
