import React, { useEffect, useState } from 'react';

import { useLocation, useParams } from "react-router-dom";
import * as security from "../services/auth-service";
import { useDispatch } from "react-redux";
import * as service from "../services/profile-service";

const Profile = () => {
    const { username } = useParams();
    const [ loggedIn, setLoggedIn ] = useState(false);
    const [ isAccountOwner, setIsAccountOwner ] = useState(false);
    const [ usernameObj, setUsernameObj ] = useState({ username: username });
    const [ user, setUser ] = useState({});
    const dispatch = useDispatch();
    const location = useLocation();

    const isLoggedInHandler = () => {
        security.isLoggedIn(dispatch).then(r => {
            setLoggedIn(r.loggedIn);
            // console.log(r);
        });
    };

    const userHandler = () => {
        service.profile(dispatch).then(r => {
            setUser(r);
            // console.log(r);
        });
    };

    const isAccountOwnerHandler = () => {
        console.log(usernameObj);
        security.isAccountOwner(usernameObj).then(r => {
            console.log(r);
            setIsAccountOwner(r.accountOwner);
        });
    };

    useEffect(() =>
        isLoggedInHandler(), [ location.key ]
    );

    useEffect(() =>
        userHandler(), [ location.key ]
    );

    useEffect(() =>
        isAccountOwnerHandler(), [ location.key ]
    );

    return (<>
            {loggedIn && isAccountOwner ? <h1>You are the account owner</h1> : ''}
            <h1>Hi {username}!</h1>
        </>
    );

};

export default Profile;
