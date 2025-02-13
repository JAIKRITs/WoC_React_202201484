import React, { useState } from 'react';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FaGoogle } from 'react-icons/fa';
import firebaseAuthService from '../Firebase/firebaseAuth';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    rememberMe: false,
    errorMessage: '',
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    try {
      const user = await firebaseAuthService.signUp({ email, password });
      console.log('User signed up successfully:', user);

      toast.success('Successfully Signed Up! Redirecting...', {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });

      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      console.error('Sign up error:', error.message);

      toast.error(`Sign-Up Failed: ${error.message}`, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const user = await firebaseAuthService.signInWithGoogle();
      console.log('User signed in with Google:', user);

      toast.success('Signed In via Google!', {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });

      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      console.error('Google sign-in error:', error.message);

      toast.error(`Google Sign-In Failed: ${error.message}`, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
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
          <h2 className="text-3xl font-semibold text-center mb-6 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            Sign Up
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium mb-2">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full p-3 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                required
              />
            </div>

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
              Sign Up
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
              Already Have an Account?{' '}
              <span
                className="text-blue-500 cursor-pointer hover:underline"
                onClick={() => navigate('/login')}
              >
                Login
              </span>
            </p>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default SignUpPage;