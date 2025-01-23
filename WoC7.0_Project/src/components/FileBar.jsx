import React from "react";

const FileBar = () => {
  return (
    <div className="bg-gray-800 text-white px-4 py-2 flex justify-between items-center">
      <div>
        <h4 className="font-bold">Untitled.js</h4>
      </div>
      <div className="space-x-2">
        <button className="text-sm bg-gray-700 px-4 py-1 rounded hover:bg-gray-600">
          Save
        </button>
        <button className="text-sm bg-gray-700 px-4 py-1 rounded hover:bg-gray-600">
          Run
        </button>
      </div>
    </div>
  );
};

export default FileBar;
