import * as security from "../../services/auth-service";
import * as service from "../../services/profile-service";
import React, {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {useLocation, useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {
    MDBCol,
    MDBRow,
    MDBContainer,
    MDBFooter,
    MDBPaginationLink
} from "mdb-react-ui-kit";

const Footer = () => {
    const [page, setPage] = useState('home');
    const navigate = useNavigate();

    return (
        <>
            <MDBFooter expand="lg" dark sticky bgColor={page === 'home' ? '' : 'white'} className='w-100'>
                <MDBContainer className='text-center p-3  w-100 text-white'
                              style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
                    <MDBRow>
                        <MDBCol>
                            <div>
                                © 2022 Copyright:&nbsp;
                                <a className='text-white' href='/'>
                                    Spotify Clone
                                </a>
                            </div>
                        </MDBCol>

                        <MDBCol>
                            <MDBPaginationLink className='text-white'
                                   onClick={() => {
                                       navigate('/privacy-policy');
                                   }}>
                                Privacy Policy
                            </MDBPaginationLink>

                        </MDBCol>
                    </MDBRow>
                </MDBContainer>
            </MDBFooter>
        </>
    );
}

export default Footer;