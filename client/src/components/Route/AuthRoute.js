import React from "react";
import { useAuthState } from "../../context/Auth";
import { Outlet, Navigate } from 'react-router-dom';

export default function AuthRoute({redirect}) {
    const auth = useAuthState();

    if (!auth.auth_token) {
        return <Navigate to={redirect} />
    }

    return <Outlet />
}