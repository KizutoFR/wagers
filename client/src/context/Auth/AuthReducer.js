import jwt_decode from "jwt-decode";

const auth_token = localStorage.wagers_auth_token ? localStorage.getItem("wagers_auth_token") : null;
let user = null;

if (auth_token) {
    const decryptedToken = jwt_decode(auth_token);
    user = decryptedToken.user || null
}

export const initialState = {
    auth_token: auth_token,
    user: user,
    loading: false,
    config: {
        headers: {
            'Authorization': auth_token
        }
    },
    errorMessage: null
}

export const AuthReducer = (initialState, action) => {
    switch (action.type) {
        case "REQUEST_LOGIN":
            return {
                ...initialState,
                loading: true
            }
        case "LOGIN_SUCCESS":
            return {
                ...initialState,
                user: action.payload.user,
                auth_token: action.payload.accessToken,
                config: {
                    headers: {
                        'Authorization': action.payload.accessToken
                    }
                },
                loading: false
            }
        case "LOGOUT":
            return {
                ...initialState,
                user: null,
                auth_token: null,
                config: {
                    headers: {}
                },
            }
        case "LOGIN_ERROR":
            return {
                ...initialState,
                loading: false,
                errorMessage: action.error
            }
        case "UPDATE_USER":
            return {
                ...initialState,
                user: action.payload.user
            }
        default:
            throw new Error(`Unhandled action type: ${action.type}`)
    }
}