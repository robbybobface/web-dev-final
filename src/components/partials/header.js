import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import * as security from "../../services/auth-service";
import * as service from "../../services/profile-service";

const Header = () => {
    const update = useSelector((state) => state.auth);
    const [ loggedIn, setLoggedIn ] = useState(false);
    const [ user, setUser ] = useState({});
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const userHandler = () => {
        service.profile(dispatch).then(r => {
            setUser(r);
            console.log(r);
        });
    };

    const logInHandler = () => {
        security.isLoggedIn(dispatch).then(r => {
            setLoggedIn(r.loggedIn);
        });
    };

    const logOutHandler = () => {
        security.logout(dispatch, user).then(r => {
            navigate('/', {});
            setLoggedIn(false);
            console.log(r);

        });
    };

    useEffect(() =>
        userHandler(), [ location.key ]
    );
    useEffect(() =>
        logInHandler(), [ location.key ]
    );

    return (
        <>
            <nav className="navbar sticky-top navbar-expand-lg navbar-dark bg-dark">
                <div className="container-fluid">
                    <a className="navbar-brand" href="#">Spotify Clone</a>
                    <button className="navbar-toggler"
                            type="button"
                            data-toggle="collapse"
                            data-target="#navbarNavAltMarkup"
                            aria-controls="navbarNavAltMarkup"
                            aria-expanded="false"
                            aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"/>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                        <div className="navbar-nav">
                            <a className="nav-link" href="/">Home</a>
                            <a className="nav-link" href="/profile">Profile</a>
                        </div>
                        <div className="navbar-nav ms-auto">
                            {!loggedIn ? <>
                                    <a className="nav-link" href="/login">Login</a>
                                    <a className="nav-link">Register</a>
                                </>
                                :
                                <a className="nav-link"
                                   onClick={() => {
                                       logOutHandler();
                                   }
                                   }>Logout</a>

                            }
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Header;

