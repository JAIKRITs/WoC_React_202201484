import React, { useState } from 'react';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FaGoogle } from 'react-icons/fa';
import firebaseAuthService from '../Firebase/firebaseAuth';
import { useNavigate } from 'react-router-dom';
import { login } from '../store/authSlice';
import { useDispatch } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';

const LoginPage = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
    errorMessage: ''
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    try {
      const user = await firebaseAuthService.logIn({ email, password });
      dispatch(login({
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      }));
      console.log('Login successful:', user.displayName || user.email);

      toast.success('Login Successful!', {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });

      setTimeout(() => navigate('/ide'), 2000);
    } catch (error) {
      setFormData({ ...formData, errorMessage: error.message });

      toast.error(`Login Failed: ${error.message}`, {
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

  const handleGoogleSignIn = async () => {
    try {
      const user = await firebaseAuthService.signInWithGoogle();
      dispatch(login({
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      }));
      console.log('Login successful via Google:', user.displayName || user.email);

      toast.success('Login Successful via Google!', {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });

      setTimeout(() => navigate('/ide'), 2000);
    } catch (error) {
      setFormData({ ...formData, errorMessage: error.message });

      toast.error(`Google Sign-In Failed: ${error.message}`, {
        position: "top-center",
        autoClose: 3000,
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
    <div className="bg-gray-900 min-h-screen text-white flex flex-col">
      <ToastContainer />

      <main className="flex-grow flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800 p-8 rounded-lg w-full max-w-md shadow-lg border border-gray-700"
        >
          {/* Fixed Title with Padding */}
          <h2 className="text-3xl font-semibold text-center mb-6 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent pb-2">
            Log In
          </h2>

          {formData.errorMessage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-600 text-white p-3 rounded-lg mb-4"
            >
              {formData.errorMessage}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-3 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full p-3 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                required
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
            >
              Log In
            </motion.button>
          </form>

          <div className="mt-4 text-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGoogleSignIn}
              className="flex items-center justify-center w-full bg-gradient-to-r from-green-400 to-blue-500 text-white py-2 rounded-full shadow-lg hover:from-green-500 hover:to-blue-600 transition-all duration-300"
            >
              <FaGoogle className="mr-2" />
              Sign In via Google
            </motion.button>
          </div>

          <div className="mt-6 text-center">
            <p>
              Don't Have an Account?{' '}
              <span
                className="text-blue-500 cursor-pointer hover:underline"
                onClick={() => navigate('/signup')}
              >
                Sign Up
              </span>
            </p>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default LoginPage;