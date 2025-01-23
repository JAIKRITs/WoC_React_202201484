import React, { useState } from 'react';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FaGoogle } from 'react-icons/fa';
import firebaseAuthService from '../Firebase/firebaseAuth'; // Importing the firebase auth service
import { useNavigate } from 'react-router-dom'; // For navigation between pages
import { login,logout } from '../store/authSlice';
import { useDispatch } from 'react-redux';

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
        dispatch(login(email)); // Update authentication state in Redux
        console.log('Login successful:', user.displayName || user.email);
        navigate('/ide'); // Redirect to IDE page
    } catch (error) {
        setFormData({ ...formData, errorMessage: error.message });
    }
};

const handleGoogleSignIn = async () => {
    try {
        const user = await firebaseAuthService.signInWithGoogle();
        dispatch(login(user.email)); // Update authentication state in Redux
        console.log('Login successful via Google:', user.displayName || user.email);
        navigate('/ide'); // Redirect to IDE page
    } catch (error) {
        setFormData({ ...formData, errorMessage: error.message });
    }
};


  return (
    <div className="bg-gray-900 min-h-screen text-white flex flex-col">
      {/* <Navbar /> */}
      <main className="flex-grow flex items-center justify-center p-8">
        <div className="bg-gray-800 p-8 rounded-lg w-full max-w-md shadow-lg">
          <h2 className="text-3xl font-semibold text-center mb-6">Log In</h2>

          {formData.errorMessage && (
            <div className="bg-red-600 text-white p-3 rounded-lg mb-4">
              {formData.errorMessage}
            </div>
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
                className="w-full p-3 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full p-3 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="rememberMe" className="ml-2 text-sm">Remember Me</label>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition duration-300"
            >
              Log In 
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={handleGoogleSignIn}
              className="flex items-center justify-center w-full bg-gradient-to-r from-green-400 to-blue-500 text-white py-2 rounded-full shadow-lg hover:from-green-500 hover:to-blue-600 transition duration-300"
            >
              <FaGoogle className="mr-2" />
              Sign In via Google
            </button>
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
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LoginPage;
