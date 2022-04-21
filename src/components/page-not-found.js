import React, { useContext, useState } from 'react';

import { useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

import { ScaleLoader } from "react-spinners";

import { MDBCol, MDBRow } from "mdb-react-ui-kit";
import { UserContext } from "../Utils/UserContext";
import AlbumListItem from "./partials/AlbumListItem";
import { toast } from "react-toastify";

const PageNotFound = () => {
    const [ loading, setLoading ] = useState(true);
    const { user, loggedIn } = useContext(UserContext);
    const [ stateUser, setStateUser ] = user;
    const [ stateLoggedIn, setStateLoggedIn ] = loggedIn;

    const location = useLocation();
    const navigate = useNavigate();

    return (
        <>
            <Helmet>
                <style>{'body {   background-image: url(\'https://images.unsplash.com/photo-1614854262318-831574f15f1f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80\') !important;\n'
                    + '  background-repeat: no-repeat !important;\n'
                    + '  background-size: cover !important;\n'
                    + '  background-color: rgba(61, 162, 195, 0.1) !important; }'}</style>
            </Helmet>
            <div className="container py-3">
                <div className="row d-flex justify-content-start">
                    <h1 className="page-not-found-text">
                        <span className="page-not-found-text">404</span>
                    </h1>
                    <h2>
                        <span className="page-not-found-subtext">Ah, the page you are looking for does not exit</span>
                    </h2>
                    <h2 className="page-not-found-subtext">
                        <span className="page-not-found-subtext">Lets get you searching again!</span>
                    </h2>
                    <div className="page-not-found-btn-container">
                    <button className="btn-hover-page-not-found color-10"
                            onClick={() => {
                                navigate('/search');
                            }}>
                        Search
                    </button>
                    </div>
                </div>

            </div>


        </>
    );
};

export default PageNotFound;
