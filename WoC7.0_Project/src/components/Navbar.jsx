import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../store/authSlice";
import firebaseAuthService from "../Firebase/firebaseAuth";

const Navbar = () => {
  const authStatus = useSelector((state) => state.auth.status);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await firebaseAuthService.logOut();
      dispatch(logout());
      navigate("/");
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  return (
    <nav className="bg-blue-800 text-white py-4 shadow-md">
      <div className="container mx-auto px-8 flex justify-between items-center">
        <a href="/" className="flex items-center">
          <img src="/logo.svg" alt="Codepad Logo" className="w-8 h-8 mr-3" />
          <span className="text-2xl font-bold">Codepad</span>
        </a>
        <div className="space-x-4">
          {!authStatus ? (
            <>
              <a
                href="/login"
                className="text-lg font-medium px-4 py-2 rounded-md transition-transform transform hover:scale-110 hover:bg-blue-700"
              >
                Login
              </a>
              <a
                href="/signup"
                className="bg-gradient-to-r from-green-400 to-blue-500 text-white text-lg px-5 py-2 rounded-full font-bold shadow-lg hover:from-green-500 hover:to-blue-600 hover:scale-110 transition duration-300"
              >
                Sign Up
              </a>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white text-lg px-5 py-2 rounded-full font-bold shadow-lg hover:bg-red-600 hover:scale-110 transition duration-300"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
