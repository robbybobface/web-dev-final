import * as security from "../../services/auth-service";
import * as service from "../../services/profile-service";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
    MDBCollapse,
    MDBContainer,
    MDBIcon,
    MDBNavbar,
    MDBNavbarBrand,
    MDBNavbarLink,
    MDBNavbarNav,
    MDBNavbarToggler
} from "mdb-react-ui-kit";

const Header = () => {
        const [ showNavSecond, setShowNavSecond ] = useState(false);
        const [ loggedIn, setLoggedIn ] = useState(false);
        const [ user, setUser ] = useState({});
        const [ page, setPage ] = useState('home');
        const dispatch = useDispatch();
        const navigate = useNavigate();
        const location = useLocation();

        const userHandler = () => {
            service.profile(dispatch).then(r => {
                setUser(r);
                console.log(r);
            });
        };

        const isLoggedInHandler = () => {
            security.isLoggedIn(dispatch).then(r => {
                setLoggedIn(r.loggedIn);
            });
        };

        const logOutHandler = () => {
            security.logout(dispatch, user).then(r => {
                toast.success(r.success, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined
                });
                setPage('home');
                navigate('', {});
                setLoggedIn(false);

            });
        };

        const profileHandler = () => {
            if (!loggedIn) {
                toast.error("You're not logged in!", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined
                });
            }
            navigate('/profile/' + user.username, {});
            setPage('profile');
        };

        const loginHandler = () => {
            setPage('login');
            navigate('/login', {});

        };

        const registerHandler = () => {
            setPage('register');
            navigate('/register', {});
        };

        const pageHandler = () => {
            const url = location.pathname.split('/');
            console.log(url);
            if (url[1] !== '') {
                setPage(url[1]);
                console.log(page);
            } else {
                setPage('home');
                console.log(page);
            }
        };

        useEffect(() =>
            userHandler(), [ location.key ]
        );
        useEffect(() =>
            isLoggedInHandler(), [ location.key ]
        );

        useEffect(() =>
            pageHandler(), [ location.key ]
        );

        return (
            <>
                <MDBNavbar expand="lg" light sticky bgColor={page === 'home' ? '' : 'white'}>
                    <MDBContainer>
                        <MDBNavbarBrand className={page === 'home' ? `navbar-brand`
                            : `navbar-brand navbar-brand-alt`}>
                            Spotify Clone
                        </MDBNavbarBrand>
                        <MDBNavbarToggler
                            aria-expanded="false"
                            aria-label="Toggle navigation"
                            onClick={() => setShowNavSecond(!showNavSecond)}
                        >
                            <MDBIcon icon="bars" fas/>
                        </MDBNavbarToggler>
                        <MDBCollapse navbar show={showNavSecond}>
                            {!loggedIn ?
                                <>
                                    <MDBNavbarNav>
                                        <MDBNavbarLink aria-current="page"
                                                       className={page === 'home'
                                                           ? `nav-link nav-link-override ${page
                                                           === 'home' ? 'active' : ""}`
                                                           : `nav-link nav-link-override-alt ${page
                                                           === 'home' ? 'active' : ""}`}
                                                       onClick={() => {
                                                           navigate('/', {});
                                                       }}>
                                            Home
                                        </MDBNavbarLink>
                                        <MDBNavbarLink className={page === 'home'
                                            ? `nav-link nav-link-override ${page === 'search' ? 'active'
                                                : ""}`
                                            : `nav-link nav-link-override-alt ${page === 'search'
                                                ? 'active' : ""}`}
                                                       onClick={() => {
                                                           navigate('/search');
                                                       }}>
                                            Search
                                        </MDBNavbarLink>
                                    </MDBNavbarNav>
                                </>
                                :
                                <>
                                    <MDBNavbarNav fullWidth={false}>
                                        <MDBNavbarLink active aria-current="page"
                                                       className={page === 'home'
                                                           ? `nav-link nav-link-override ${page
                                                           === 'home'
                                                               ? 'active' : ""}`
                                                           : `nav-link nav-link-override-alt ${page
                                                           === 'home'
                                                               ? 'active' : ""}`}
                                                       onClick={() => {
                                                           navigate('/', {});
                                                       }}>
                                            Dashboard
                                        </MDBNavbarLink>
                                        <MDBNavbarLink className={page === 'home'
                                            ? `nav-link nav-link-override ${page === 'search'
                                                ? 'active' : ""}`
                                            : `nav-link nav-link-override-alt ${page === 'search'
                                                ? 'active' : ""}`}
                                                       onClick={() => {
                                                           navigate('/search');
                                                       }}>
                                            Search
                                        </MDBNavbarLink>
                                    </MDBNavbarNav>
                                </>
                            }
                            {!loggedIn ?
                                <>
                                    <div className="ms-auto">
                                        <MDBNavbarNav>
                                            <MDBNavbarLink aria-current="page"
                                                           className={page === 'home'
                                                               ? `nav-link nav-link-override ${page
                                                               === 'login' ? 'active' : ""}`
                                                               : `nav-link nav-link-override-alt ${page
                                                               === 'login' ? 'active' : ""}`}
                                                           href="javascript:;"
                                                           onClick={() => {
                                                               loginHandler();
                                                           }}>
                                                Login
                                            </MDBNavbarLink>
                                            <MDBNavbarLink className={page === 'home'
                                                ? `nav-link nav-link-override ${page === 'register'
                                                    ? 'active' : ""}`
                                                : `nav-link nav-link-override-alt ${page === 'register'
                                                    ? 'active' : ""}`}
                                                           href="javascript:;"
                                                           onClick={() => {
                                                               registerHandler();
                                                           }}>
                                                Register
                                            </MDBNavbarLink>
                                        </MDBNavbarNav>
                                    </div>
                                </>
                                :
                                <>
                                    <div className="ms-auto">
                                        <MDBNavbarNav>
                                            <MDBNavbarLink aria-current="page"
                                                           className={page === 'home'
                                                               ? `nav-link nav-link-override ${page
                                                               === 'profile/'
                                                               + user.username
                                                                   ? 'active' : ""}`
                                                               : `nav-link nav-link-override-alt ${page
                                                               === 'profile/' + user.username ? 'active'
                                                                   : ""}`}
                                                           href="javascript:;"
                                                           onClick={() => {
                                                               profileHandler();
                                                           }}>
                                                Profile
                                            </MDBNavbarLink>
                                            <MDBNavbarLink className={page === 'home'
                                                ? `nav-link nav-link-override` :
                                                `nav-link nav-link-override-alt`}
                                                           href="javascript:;"
                                                           onClick={() => {
                                                               logOutHandler();
                                                           }}>
                                                Log Out
                                            </MDBNavbarLink>
                                        </MDBNavbarNav>
                                    </div>
                                </>
                            }
                        </MDBCollapse>
                    </MDBContainer>
                </MDBNavbar>

            </>
        );
    }
;

export default Header;

