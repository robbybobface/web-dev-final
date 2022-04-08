import React, { useEffect, useState } from "react";
import * as security from "../services/auth-service";

import { useDispatch, useSelector } from "react-redux";

const Home = () => {
    const message = useSelector(state => state.message);
    const [ response, setResponse ] = useState('');
    const [ loggedIn, setLoggedIn ] = useState(false);
    const dispatch = useDispatch();
    const loggedInHandler = () => {
        security.isLoggedIn(dispatch).then(r => {
            setLoggedIn(true);
            console.log(r);
            setResponse(r);
        });
    };

    useEffect(() =>
        loggedInHandler(), [ message ]
    );
    return (
        <>
            <h1>Home Screen</h1>
            {loggedIn ? <h3>{`${response.message}`}</h3> : ''}


        </>
    );
};

export default Home;
