import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    MDBCol,
    MDBRow,
    MDBContainer,
    MDBFooter,
    MDBPaginationLink
} from "mdb-react-ui-kit";

const Footer = () => {
    const [ page, setPage ] = useState('home');
    const navigate = useNavigate();
    const location = useLocation();

    const pageHandler = () => {
        const url = location.pathname.split('/');
        // console.log(url);
        if (url[1] !== '') {
            setPage(url[1]);
            // console.log(page);
        } else {
            setPage('home');
            // console.log(page);
        }
    };

    useEffect(() =>
        pageHandler(), [ location.key ]
    );

    return (
        <>
            <MDBFooter expand="lg"
                       dark
                       bgColor={page === 'home' ? '' : 'white'}
                       className={`w-100 ${page === 'home' ? 'footer-home' : ''}`}>
                <MDBContainer className={`text-center p-3 mt-5 w-100 text-black`}>
                    <MDBRow className={`align-items-center justify-content-center`}>
                        <MDBCol>
                            <MDBPaginationLink className="text-black footer-text"
                                               onClick={() => {
                                                   navigate('/');
                                               }}>

                                © 2022 Copyright:&nbsp;
                                <span className="privacy-link">
                                    Spotify Search
                                    </span>
                            </MDBPaginationLink>

                        </MDBCol>

                        <MDBCol>
                            <MDBPaginationLink className="text-black footer-text"
                                               onClick={() => {
                                                   navigate('/privacy-policy');
                                               }}>
                                <span className="privacy-link">
                                Privacy Policy
                                    </span>
                            </MDBPaginationLink>

                        </MDBCol>
                    </MDBRow>
                </MDBContainer>
            </MDBFooter>
        </>
    );
};

export default Footer;
