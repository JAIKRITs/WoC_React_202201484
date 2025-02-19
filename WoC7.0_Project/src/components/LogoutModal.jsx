// components/LogoutModal.jsx
import React from 'react';
import { motion } from 'framer-motion';

const LogoutModal = ({ onCancel, onLogout }) => {
  const handleLogout = () => {
    onLogout();
    onCancel(); // Close the modal after logout
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="bg-gray-800 p-8 rounded-lg w-96 text-center"
      >
        <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          Confirm Logout
        </h2>
        <p className="text-gray-300 mb-6">
          Are you sure you want to sign out? Any unsaved changes might be lost.
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onCancel}
            className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-lg transition-all duration-200"
          >
            Logout
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default LogoutModal;