import * as service from '../services/auth-service';

export const REGISTER = 'REGISTER';
export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const IS_ACCOUNT_OWNER = 'IS_ACCOUNT_OWNER';
export const IS_LOGGED_IN = 'IS_LOGGED_IN';

export const register = async (dispatch, user) => {
    const response = await service.register(user);
    dispatch({
        type: 'REGISTER',
        response
    });
};

export const login = async (dispatch, user) => {
    const response = await service.login(user);
    dispatch({
        type: 'LOGIN',
        response
    });
};

export const isLoggedIn = async (dispatch) => {
    const response = await service.isLoggedIn();
    dispatch({
        type: 'IS_LOGGED_IN',
        response
    });
};

export const logout = async (dispatch) => {
    const response = await service.logout();
    dispatch({
        type: 'LOGOUT',
        response
    });
};

export const isAccountOwner = async (dispatch, username) => {
    console.log('the username was ' + username);
    const response = await service.isAccountOwner(username);
    dispatch({
        type: 'IS_ACCOUNT_OWNER',
        response
    });
};

