import React, { useState } from "react";
import { Resizable } from "react-resizable";
import "react-resizable/css/styles.css"; // Import the default styles

const Terminal = ({ onClose, output, onInputChange }) => {
  const [input, setInput] = useState(""); // For user input
  const [inputWidth, setInputWidth] = useState(400); // Initial width for input section
  const [terminalHeight, setTerminalHeight] = useState(300); // Initial height for the terminal

  const handleInputChange = (e) => {
    const newInput = e.target.value;
    setInput(newInput);
    onInputChange(newInput); // Pass input to parent component
  };

  // Handle resize for the input section (width only)
  const handleInputResize = (event, { size }) => {
    setInputWidth(size.width); // Update width
  };

  // Handle vertical resize for the entire terminal
  const handleTerminalResize = (event, { size }) => {
    // Limit the height to a maximum of 600px and minimum of 200px
    if (size.height >= 200 && size.height <= 600) {
      setTerminalHeight(size.height);
    }
  };

  return (
    <Resizable
      height={terminalHeight} // Current height of the terminal
      width={Infinity} // Disable horizontal resizing for the entire terminal
      onResize={handleTerminalResize} // Handle vertical resize
      resizeHandles={["n"]} // Only allow resizing from the top (north)
      minConstraints={[Infinity, 200]} // Minimum height of 200px
      maxConstraints={[Infinity, 600]} // Maximum height of 600px
    >
      <div
        className="bg-gray-800 text-green-400 font-mono p-4 rounded-t-lg flex justify-between relative"
        style={{ height: terminalHeight }} // Set the height dynamically
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded-md transition-all duration-300"
        >
          Close
        </button>

        {/* Input Section */}
        <Resizable
          width={inputWidth} // Current width of the input section
          height={terminalHeight} // Height matches the terminal
          onResize={handleInputResize} // Handle resize (width only)
          resizeHandles={["e"]} // Allow resizing from the right (east)
          minConstraints={[200, terminalHeight]} // Minimum width of 200px
          maxConstraints={[800, terminalHeight]} // Maximum width of 800px
        >
          <div
            className="mr-4"
            style={{ width: inputWidth, height: "100%" }} // Set the width and height dynamically
          >
            <h3 className="text-white mb-2 font-semibold">Input</h3>
            <textarea
              value={input}
              onChange={handleInputChange}
              placeholder="Type your input here..."
              className="w-full h-[calc(100%-40px)] bg-gray-700 text-green-400 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            />
          </div>
        </Resizable>

        {/* Output Section */}
        <div
          className="flex-grow"
          style={{
            width: `calc(100% - ${inputWidth + 16}px)`, // Adjust width dynamically
            height: "100%", // Full height
          }}
        >
          <h3 className="text-white mb-2 font-semibold">Output</h3>
          <div
            className="w-full h-[calc(100%-40px)] bg-gray-700 text-green-400 p-2 rounded-md overflow-y-auto"
          >
            {output || "No output yet."}
          </div>
        </div>
      </div>
    </Resizable>
  );
};

export default Terminal;