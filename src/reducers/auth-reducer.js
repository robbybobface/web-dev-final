import {
    LOGIN,
    LOGOUT,
    REGISTER,
    IS_LOGGED_IN,
    IS_ACCOUNT_OWNER
} from "../actions/auth-actions";

const authReducer = (state = {}, action) => {
    switch (action.type) {
        case REGISTER:
            return {
                ...state,
                message: action.response,
                loggedIn: true
            };
        case LOGIN:
            return {
                ...state,
                message: action.response,
                loggedIn: true
            };
        case IS_LOGGED_IN:
            return {
                ...state,
                message: action.response,
            };
        case IS_ACCOUNT_OWNER:
            return {
                ...state,
                message: action.response,
            };
        case LOGOUT:
            return {
                ...state,
                message: action.response,
                loggedIn: false
            };
        default:
            return state;
    }

};

export default authReducer;
