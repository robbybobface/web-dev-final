import {
    REGISTER,
    LOGIN,
    IS_LOGGED_IN,
    IS_ACCOUNT_OWNER,
    LOGOUT
} from "../actions/auth-actions";

const authReducer = (state = [], action) => {
    switch (action.type) {
        case REGISTER:
            return action.user;
        case LOGIN:
            return action.user;
        case IS_LOGGED_IN:
            return action.user;
        case IS_ACCOUNT_OWNER:
            return action.user;
        case LOGOUT:
            return action.user
        default:
            return state;
    }

};

export default authReducer;
