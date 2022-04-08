import React, { useEffect, useState } from "react";
import * as security from "../services/auth-service";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [ loginUser, setLoginUser ] = useState({});
    const navigate = useNavigate();

    const login = () =>
        security.login(loginUser)
            .then((response) => {
                console.log(response);
                navigate('/', {});
            })
            .catch(e => alert(e));
    return (
        <>
            <h1>Login Screen</h1>
            <input
                placeholder="Username"
                onChange={(e) =>
                    setLoginUser({
                        ...loginUser,
                        username: e.target.value
                    })}/>
            <input
                placeholder="email"
                onChange={(e) =>
                    setLoginUser({
                        ...loginUser,
                        email: e.target.value
                    })}/>
            <input type="password"
                   placeholder="password"
                   onChange={(e) =>
                       setLoginUser({
                           ...loginUser,
                           password: e.target.value
                       })}/>
            <button onClick={login}>
                Login
            </button>
        </>
    );
};

export default Login;
