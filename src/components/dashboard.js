import React, { useContext, useEffect, useState } from 'react';

import { useLocation, useNavigate, useParams } from "react-router-dom";
import * as security from "../services/auth-service";
import { useDispatch } from "react-redux";
import * as service from "../services/profile-service";
import { UserContext } from "../Utils/UserContext";

const Dashboard = () => {
    const { username } = useParams();
    const { user, loggedIn } = useContext(UserContext);
    const [ stateUser, setStateUser ] = user;
    const [ stateLoggedIn, setStateLoggedIn ] = loggedIn;

    const [ usernameObj, setUsernameObj ] = useState({ username: username });
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();

    if (!stateUser.admin) {
        navigate('/');
    }

    console.log(stateUser);

    return (
        <>
            {stateLoggedIn && stateUser.admin ?
                <>
                    <h1>You are logged In and an Admin</h1>

                </>
                :
                <>

                </>}
        </>
    );

};

export default Dashboard;
