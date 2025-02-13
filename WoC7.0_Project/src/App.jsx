import React, { useEffect,useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "./store/authSlice";
import authService from "./Firebase/firebaseAuth"; // Assuming you have an auth service
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/Homepage";
import IDEPage from "./pages/IDE";
import SignUpPage from "./pages/SignUp";
import LoginPage from "./pages/LoginPage";
import AuthLayout from "./components/AuthLayout";
import Navbar from "./components/Navbar";
import GuestIDEPage from "./pages/Guest";
import Loader from "./components/Loader"; 
import { showLoader, hideLoader } from "./store/LoaderSlice"; 

function App() {
  const dispatch = useDispatch();
  const authStatus = useSelector((state) => state.auth.status); // Get auth status from Redux
  const isLoading = useSelector((state) => state.loader.isLoading);
  const [isNavigating, setIsNavigating] = useState(false);
  
  useEffect(() => {
    setIsNavigating(true); // Show loader on route change
    const timer = setTimeout(() => setIsNavigating(false), 500); // Hide loader after 500ms
    return () => clearTimeout(timer);
  }, [location]);

  useEffect(() => {
    authService.getCurrentUser()
      .then((userData) => {
        if (userData) {
          console.log(userData);
          dispatch(login(userData.email));
        } else {
          dispatch(logout());
        }
      })
      .catch(() => dispatch(logout()))
      .finally(() => dispatch(hideLoader()));
  }, [dispatch]);

  return (
    <Router>
      <Navbar />
      {(isLoading || isNavigating) && <Loader />}
      <Routes>
        {/* If the user is logged in, redirect all routes except /ide to /ide */}
        {authStatus ? (
          <>
            <Route path="/ide" element={<IDEPage />} />
            <Route path="*" element={<Navigate to="/ide" replace />} />
          </>
        ) : (
          <>
            {/* Public routes for guests */}
            <Route path="/" element={<HomePage />} />
            <Route
              path="/guest"
              element={
                <AuthLayout authentication={false}>
                  <GuestIDEPage /> 
                </AuthLayout>
              }
            />
            <Route
              path="/signup"
              element={
                <AuthLayout authentication={false}>
                  <SignUpPage />
                </AuthLayout>
              }
            />
            <Route
              path="/login"
              element={
                <AuthLayout authentication={false}>
                  <LoginPage />
                </AuthLayout>
              }
            />
            {/* Redirect any other route to the homepage */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;