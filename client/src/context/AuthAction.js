export const LoginStart = (token) => ({
    type: "LOGIN_START"
})

export const LoginSuccess = (token) => ({
    type: "LOGIN_SUCCESS",
    payload: token

})

export const LoginFailure = (error) => ({
    type: "LOGIN_FAILURE",
    payload: error
})

export const LogoutSuccess = (token) => ({
    type: "LOGOUT_SUCCESS",
    payload: token
})

export const LogoutFailure = (error) => ({
    type: "LOGOUT_FAILURE",
    payload: error
})