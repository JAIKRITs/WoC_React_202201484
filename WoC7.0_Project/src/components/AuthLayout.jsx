import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function AuthLayout({ children, authentication = true }) {
    const navigate = useNavigate();
    const authStatus = useSelector((state) => state.auth.status); 
    const [loader, setLoader] = useState(true);

    useEffect(() => {
        if (authentication) {
            if (!authStatus) {
                navigate("/login", { replace: true }); 
            }
        } else {
            if (authStatus) {
                navigate("/ide", { replace: true }); 
            }
        }
        setLoader(false);
    }, [authStatus, navigate, authentication]);

    return loader ? null : <>{children}</>; 
}
