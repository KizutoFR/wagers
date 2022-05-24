import React, { useEffect, useReducer } from 'react';
import { AuthReducer, initialState } from './AuthReducer';

const AuthStateContext = React.createContext();
const AuthDispatchContext = React.createContext();

export function useAuthState() {
    const context = React.useContext(AuthStateContext);
    if (context === undefined) {
        throw new Error('useAuthState must be used in a AuthProvider');
    }

    return context;
}

export function useAuthDispatch() {
    const context = React.useContext(AuthDispatchContext);
    if (context === undefined) {
        throw new Error('useAuthState must be used in a AuthProvider');
    }

    return context;
}

export const AuthProvider = ({ children }) => {
    const [auth, dispatch] = useReducer(AuthReducer, initialState);

    return (
        <AuthStateContext.Provider value={auth}>
            <AuthDispatchContext.Provider value={dispatch}>
                { children }
            </AuthDispatchContext.Provider>
        </AuthStateContext.Provider>
    );
}