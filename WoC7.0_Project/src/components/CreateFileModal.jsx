import React, { useState } from "react";
import { motion } from "framer-motion";
import { showLoader, hideLoader } from "../store/LoaderSlice";
import { useDispatch } from "react-redux";

const CreateFileModal = ({ isOpen, onClose, onSubmit }) => {
  const dispatch = useDispatch();
  const [fileName, setFileName] = useState("");
  const [language, setLanguage] = useState("javascript");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fileName || !language) return;

    dispatch(showLoader());
    await onSubmit(fileName, language);
    dispatch(hideLoader());
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-gray-800 p-6 rounded-lg shadow-lg w-96"
      >
        <h2 className="text-2xl font-bold text-gray-100 mb-4">Create New File</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-medium mb-2">
              File Name
            </label>
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter file name"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="html">HTML</option>
              <option value="css">CSS</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
              <option value="php">PHP</option>
              <option value="rust">Rust</option>
              <option value="sql">SQL</option>
              <option value="xml">XML</option>
            </select>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="p-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200"
            >
              Create
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateFileModal;