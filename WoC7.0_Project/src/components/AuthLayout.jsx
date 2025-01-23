import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function AuthLayout({ children, authentication = true }) {
    const navigate = useNavigate();
    const authStatus = useSelector((state) => state.auth.status); // Get auth status from Redux
    const [loader, setLoader] = useState(true);

    useEffect(() => {
        if (authentication && !authStatus) {
            navigate("/login"); // Redirect to login if not authenticated
        }
        setLoader(false);
    }, [authStatus, navigate, authentication]);

    return loader ? <h1>Loading...</h1> : <>{children}</>;
}
