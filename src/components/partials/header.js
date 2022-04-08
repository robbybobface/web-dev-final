import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { isLoggedIn } from "../../actions/auth-actions";
import * as security from "../../services/auth-service";

const Header = () => {
    const message = useSelector(state => state.response);
    const [ loggedIn, setLoggedIn ] = useState(false);
    // const navigate = useNavigate();
    const dispatch = useDispatch();

    const logInHandler = () => {
        console.log(loggedIn);
        security.isLoggedIn(dispatch).then(r => {
            setLoggedIn(true);
            console.log(r);
        });
    };
    useEffect(() =>
        logInHandler, [ message ]
    );
    return (
        <>
            <nav className="navbar sticky-top navbar-expand-lg navbar-dark bg-dark">
                <div className="container-fluid">
                    <a className="navbar-brand" href="#">Web Dev Final</a>
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
                                    <a className="nav-link" href="/register">Register</a>
                                </>
                                :
                                <a className="nav-link" href="/logout">Logout</a>

                            }
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Header;

