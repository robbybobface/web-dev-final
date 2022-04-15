import React, { useContext, useEffect, useState } from "react";
import * as security from "../services/auth-service";

import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../Utils/UserContext";

const Home = () => {
    // const [ loggedIn, setLoggedIn ] = useState(false);
    const { user, loggedIn } = useContext(UserContext);
    const [ stateUser, setStateUser ] = user;
    const [ stateLoggedIn, setStateLoggedIn ] = loggedIn;

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();

    console.log(stateUser);
    console.log(stateLoggedIn);

    return (
        <>
            <div className="bg-image mask mask-custom-home">
                <video id="background-video" playsInline autoPlay muted loop>
                    <source className="h-100"
                            src="https://mdbootstrap.com/img/video/Lines.mp4"
                            type="video/mp4"/>
                </video>
            </div>
            <div className="container container-home ">
                <div className="d-flex row align-items-center justify-content-center">
                    <div className="col-lg-8 col-xl-9 col-xxl-10 my-auto align-items-center justify-content-center">
                        <h1 className="mb-3 header-home">Welcome to Spotify Search</h1>
                        <h5 className="mb-4 px-5 header-text">Search Details about your favorite
                                                              artists,
                                                              albums, and songs!</h5>
                        <div className="button-row">
                            <button className="btn-hover color-8"
                                    onClick={() => {
                                        navigate('/search');
                                    }}>
                                Search
                            </button>
                            {stateLoggedIn ? '' :
                                <button className="btn-hover color-8"
                                        onClick={() => {
                                            navigate('/register');
                                        }}>
                                    Sign Up Now!
                                </button>}

                        </div>
                    </div>
                </div>
            </div>

        </>
    )
        ;
};

export default Home;
