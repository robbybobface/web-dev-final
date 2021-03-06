import * as security from "../../services/auth-service";
import * as service from "../../services/profile-service";
import React, { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
import { UserContext } from "../../Utils/UserContext";

const Header = () => {
        const [ showNavSecond, setShowNavSecond ] = useState(false);
        // const [ loggedIn, setLoggedIn ] = useState(false);
        // const [ user, setUser ] = useState({});
        const [ page, setPage ] = useState('home');

        const { user, loggedIn } = useContext(UserContext);
        const [ stateUser, setStateUser ] = user;
        const [ stateLoggedIn, setStateLoggedIn ] = loggedIn;

        const dispatch = useDispatch();
        const navigate = useNavigate();
        const location = useLocation();

        const userHandler = () => {
            service.profile(dispatch).then(r => {
                setStateUser(r);
                // console.log(r);
            });
        };

        const isLoggedInHandler = () => {
            security.isLoggedIn(dispatch).then(r => {
                setStateLoggedIn(r.loggedIn);
            });
        };

        const logOutHandler = () => {
            security.logout(dispatch, stateUser).then(r => {
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
                secondNavHandler();
                setStateLoggedIn(false);
            });
        };

        const profileHandler = () => {
            if (!stateLoggedIn) {
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
            navigate('/profile/' + stateUser.username, {});
            secondNavHandler();
            setPage('profile');
        };

        const loginHandler = () => {
            setPage('login');
            navigate('/login', {});
            secondNavHandler();

        };

        const registerHandler = () => {
            setPage('register');
            navigate('/register', {});
            secondNavHandler();
        };

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

        const secondNavHandler = () => {
            if (showNavSecond) {
                setShowNavSecond(false);
            } else {
                return;
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
                <MDBNavbar expand="lg"
                           light
                           sticky
                           bgColor={page === 'home' ? '' : 'white'}
                           className="navbar-clip w-100">
                    <MDBContainer>
                        <Link to="/">
                            <MDBNavbarBrand className={page === 'home' ? `navbar-brand`
                                : `navbar-brand navbar-brand-alt`}>
                                Spotify Search
                            </MDBNavbarBrand>
                        </Link>
                        <MDBNavbarToggler
                            aria-expanded="false"
                            aria-label="Toggle navigation"
                            onClick={() => setShowNavSecond(!showNavSecond)}
                        >
                            <MDBIcon icon="bars" fas/>
                        </MDBNavbarToggler>
                        <MDBCollapse navbar show={showNavSecond}>
                            {!stateLoggedIn ?
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
                                                           secondNavHandler();
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
                                                           secondNavHandler();
                                                       }}>
                                            Search
                                        </MDBNavbarLink>
                                    </MDBNavbarNav>
                                </>
                                :
                                <>
                                    <MDBNavbarNav fullWidth={false}>
                                        {stateUser.admin &&
                                            <MDBNavbarLink aria-current="page"
                                                           className={page === 'home'
                                                               ? `nav-link nav-link-override ${page
                                                               === 'dashboard'
                                                                   ? 'active' : ""}`
                                                               : `nav-link nav-link-override-alt ${page
                                                               === 'dashboard'
                                                                   ? 'active' : ""}`}
                                                           onClick={() => {
                                                               navigate('/dashboard', {});
                                                               secondNavHandler();
                                                           }}>
                                                Dashboard
                                            </MDBNavbarLink>
                                        }
                                        <MDBNavbarLink className={page === 'home'
                                            ? `nav-link nav-link-override ${page === 'search'
                                                ? 'active' : ""}`
                                            : `nav-link nav-link-override-alt ${page === 'search'
                                                ? 'active' : ""}`}
                                                       onClick={() => {
                                                           navigate('/search');
                                                           secondNavHandler();
                                                       }}>
                                            Search
                                        </MDBNavbarLink>
                                    </MDBNavbarNav>
                                </>
                            }
                            {!stateLoggedIn ?
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
                                                               + stateUser.username
                                                                   ? 'active' : ""}`
                                                               : `nav-link nav-link-override-alt ${page
                                                               === 'profile/' + stateUser.username
                                                                   ? 'active'
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

