import React from "react";

const MenuBar = () => {
  return (
    <div className="bg-gray-800 text-white py-3 px-6 flex justify-between shadow-md">
      <div className="flex space-x-4">
        <button className="hover:text-blue-400">File</button>
        <button className="hover:text-blue-400">Edit</button>
        <button className="hover:text-blue-400">View</button>
        <button className="hover:text-blue-400">Help</button>
      </div>
    </div>
  );
};

export default MenuBar;
