const AuthReducer = (state, action) => {
    switch (action.type) {
        case "LOGIN_START":
            return {
                token: null,
                isFetching: true,
                error: false
            }
        case "LOGIN_SUCCESS":
            return {
                token: action.payload,
                isFetching: false,
                error: false
            }
        case "LOGIN_FAILURE":
            return {
                token: null,
                isFetching: false,
                error: action.payload
            }
        case "LOGOUT_START":
            return {
                token: action.payload,
                isFetching: true,
                error: false
            }
        case "LOGOUT_SUCCESS":
            return {
                token: action.payload,
                isFetching: false,
                error: false
            }
        case "LOGOUT_FAILURE":
            return {
                token: null,
                isFetching: false,
                error: action.payload
            }
        default:
            return state;
    }
}

export default AuthReducer;