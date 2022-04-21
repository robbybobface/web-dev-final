import React, { useContext, useEffect, useState } from 'react';

import { useLocation, useParams } from "react-router-dom";
import * as security from "../services/auth-service";
import { useDispatch } from "react-redux";
import * as service from "../services/profile-service";
import { UserContext } from "../Utils/UserContext";

const Profile = () => {
    const { username } = useParams();
    const { user, loggedIn } = useContext(UserContext);
    const [ stateUser, setStateUser ] = user;
    const [ stateLoggedIn, setStateLoggedIn ] = loggedIn;
    const [ isAccountOwner, setIsAccountOwner ] = useState(false);

    const [ usernameObj, setUsernameObj ] = useState({ username: username });
    const dispatch = useDispatch();
    const location = useLocation();

    const isAccountOwnerHandler = () => {
        // console.log(usernameObj);
        security.isAccountOwner(usernameObj).then(r => {
            // console.log(r);
            setIsAccountOwner(r.accountOwner);
        });
    };

    useEffect(() =>
        isAccountOwnerHandler(), []
    );
    console.log(stateUser);

    return (<>
            {stateLoggedIn && isAccountOwner ?
                <>
                    <h1>You are the account owner. Your details are:</h1>
                    <p>Email: {stateUser.email}</p>
                    <p>Username: {stateUser.username}</p>
                    <p>Password: {stateUser.password}</p>
                    {stateUser.admin ? <p>You are an Admin!</p> : ''}
                    <p>Liked Songs:{stateUser.likedSongs}</p>
                    <p>Liked Albums:{stateUser.likedAlbums}</p>
                    <p>Liked Artists:{stateUser.likedArtists}</p>
                    <input type="text" value={stateUser.email}
                           onChange={(e) => {
                               setStateUser({
                                   ...stateUser,
                                   email: e.target.value
                               });
                               console.log(stateUser);
                           }}/>
                    <input type="text" value={stateUser.username}
                           onChange={(e) => {
                               setStateUser({
                                   ...stateUser,
                                   username: e.target.value
                               });
                               console.log(stateUser);
                           }}/>
                </>
                : ''}
            <h1>This is {username}'s account</h1>
        </>
    );

};

export default Profile;
