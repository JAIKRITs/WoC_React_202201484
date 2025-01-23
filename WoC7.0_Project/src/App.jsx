import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { login, logout } from './store/authSlice';
import authService from './Firebase/firebaseAuth'; // Assuming you have an auth service
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Homepage';
import IDEPage from './pages/IDE';
import SignUpPage from './pages/SignUp';
import LoginPage from './pages/LoginPage';
import AuthLayout from './components/AuthLayout';
import Navbar from "./components/Navbar";
import GuestIDEPage from "./pages/Guest";

function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        authService.getCurrentUser()
            .then((userData) => {
                if (userData) {
                    console.log(userData)
                    dispatch(login(userData.email));
                } else {
                    dispatch(logout());
                }
            });
    }, [dispatch]);

    return (
        <Router>
            <Navbar/> 
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route
                    path="/ide"
                    element={
                        <AuthLayout authentication> 
                            <IDEPage />
                        </AuthLayout>
                    }
                /> 
                <Route path="/guest" element={<GuestIDEPage />} />
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
            </Routes>
        </Router>
    );
}

export default App;