import React, { useEffect, useState } from "react";
import * as security from "../services/auth-service";

import Listbox from "../components/listbox";
import Detail from "../components/detail";
import Dropdown from "../components/dropdown";
import { Credentials } from '../Credentials';
import axios from 'axios';

import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

const Home = () => {
    const [ loggedIn, setLoggedIn ] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const loggedInHandler = () => {
        security.isLoggedIn(dispatch).then(r => {
            setLoggedIn(r.loggedIn);
            console.log(r);
        });
    };

    useEffect(() =>
        loggedInHandler(), [ loggedIn, location.key ]
    );
    return (
        <>
            <div className="bg-image mask mask-custom-home">
                <video id="background-video" playsInline autoPlay muted loop>
                    <source className="h-100"
                            src="https://mdbootstrap.com/img/video/Lines.mp4"
                            type="video/mp4"/>
                </video>
            </div>
            <div className="container container-home">
                <div className="row d-flex flex-column align-items-center justify-content-center">
                    <div className="col-xl-8">
                        <h1 className="mb-3 header-home">Welcome to our Spotify Clone</h1>
                        <h5 className="mb-4 header-text">Best & free guide of responsive web
                                                         design</h5>
                        <div className="button-row">
                            <button className="btn-hover color-8"
                                    onClick={() => {
                                        navigate('/search');
                                    }}>
                                Search Songs
                            </button>
                            <button className="btn-hover color-8"
                                    onClick={() => {
                                        navigate('/register');
                                    }}>
                                Sign Up Now!
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
};

export default Home;
