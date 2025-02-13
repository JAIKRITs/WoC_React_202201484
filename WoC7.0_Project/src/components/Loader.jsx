import React from "react";
import { motion } from "framer-motion";

const Loader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-100 z-50">
      <motion.div
        className="flex flex-col items-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-lg text-gray-300">Loading...</p>
      </motion.div>
    </div>
  );
};

export default Loader;