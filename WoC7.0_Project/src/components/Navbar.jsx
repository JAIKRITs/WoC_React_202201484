import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../store/authSlice";
import firebaseAuthService from "../Firebase/firebaseAuth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";

const Navbar = () => {
  const authStatus = useSelector((state) => state.auth.status);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await firebaseAuthService.logOut();
      dispatch(logout());

      toast.success("Logged out successfully!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });

      navigate("/");
    } catch (error) {
      console.error("Error logging out: ", error);

      toast.error("Failed to log out. Please try again.", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  };

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-blue-900 to-purple-900 text-white py-6 shadow-lg"
      >
        <div className="container mx-auto px-8 flex justify-between items-center">
          <motion.a
            href="/"
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-12 h-12 mr-3 flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-xl transition-transform transform hover:scale-110 hover:rotate-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-8 h-8 text-white"
              >
                <path d="M16 18l6-6-6-6" />
                <path d="M8 6L2 12l6 6" />
                <rect x="9" y="9" width="6" height="6" rx="1" />
              </svg>
            </div>
            <span className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Codepad
            </span>
          </motion.a>
          <div className="space-x-6">
            {!authStatus ? (
              <>
                <motion.a
                  href="/login"
                  className="text-lg font-medium px-8 py-3 rounded-full bg-gray-800 hover:bg-gray-700 transition-all duration-300 hover:shadow-lg hover:scale-105 border-2 border-blue-500 hover:border-blue-400"
                  whileHover={{ scale: 1.05 }}
                >
                  Login
                </motion.a>
                <motion.a
                  href="/signup"
                  className="text-lg font-medium px-8 py-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white transition-all duration-300 hover:shadow-lg hover:scale-105"
                  whileHover={{ scale: 1.05 }}
                >
                  Sign Up
                </motion.a>
              </>
            ) : (
              <motion.button
                onClick={handleLogout}
                className="text-lg font-medium px-8 py-3 rounded-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white transition-all duration-300 hover:shadow-lg hover:scale-105"
                whileHover={{ scale: 1.05 }}
              >
                Logout
              </motion.button>
            )}
          </div>
        </div>
      </motion.nav>
      <ToastContainer />
    </>
  );
};

export default Navbar;