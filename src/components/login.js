import React, { useContext, useState } from "react";
import * as security from "../services/auth-service";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { MDBInput } from "mdb-react-ui-kit";
import * as service from "../services/profile-service";
import { UserContext } from "../Utils/UserContext";
import { useDispatch } from "react-redux";

const Login = () => {
    const { user, loggedIn } = useContext(UserContext);
    const [ stateUser, setStateUser ] = user;
    const [ stateLoggedIn, setStateLoggedIn ] = loggedIn;
    const [ loginUser, setLoginUser ] = useState({});

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const login = async () =>
        await security.login(loginUser)
            .catch(error => toast.error('Invalid Username or Password'))
            .then(async (response) => {
                if (response === 'Invalid Username or Password') {
                    toast.error('Invalid Username or Password');
                } else {
                    // console.log(response);
                    toast.success(response.success, {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                    await isLoggedInHandler();
                    await userHandler();
                    window.scrollTo(0, 0);
                }
            });
    // toast.error(e));

    const userHandler = () => {
        service.profile(dispatch).then(r => {
            setStateUser(r);
            console.log(r);
        }).then(r => navigate('/search', {}));
    };

    const isLoggedInHandler = () => {
        security.isLoggedIn(dispatch).then(r => {
            setStateLoggedIn(r.loggedIn);
            console.log(r.loggedIn);
        });
    };
    return (
        <>
            <section className="gradient-form">
                <div className="container login-container">
                    <div className="row d-flex justify-content-center align-items-center">
                        <div className="col-xl-10">
                            <div className="card rounded-3 text-black">
                                <div className="row g-0">
                                    <div className="col-lg-6">
                                        <div className="card-body p-md-5 mx-md-4">

                                            <div className="text-center">
                                                <img src="spotify.png"
                                                     style={{ width: '100px' }} alt="logo"/>
                                                <h4 className="mt-4 mb-4 pb-1 h4-text">
                                                    Spotify Search</h4>
                                            </div>
                                            <form>
                                                <p className="p-text">
                                                    Please login to your account</p>

                                                <div className="form-outline mb-4">
                                                    <MDBInput className="form-control-login"
                                                              label="Username"
                                                              id="register-username"
                                                              type="text"
                                                              size="lg"
                                                              required
                                                              onChange={(e) =>
                                                                  setLoginUser({
                                                                      ...loginUser,
                                                                      username: e.target.value
                                                                  })}/>
                                                </div>

                                                <div className="form-outline mb-4">
                                                    <MDBInput className="form-control-login"
                                                              label="Password"
                                                              id="register-password"
                                                              type="password"
                                                              size="lg"
                                                              required
                                                              onChange={(e) =>
                                                                  setLoginUser({
                                                                      ...loginUser,
                                                                      password: e.target.value
                                                                  })}/>
                                                </div>

                                                <div className="text-center pt-1 mb-3 pb-1">
                                                    <button className="btn btn-primary btn-block fa-lg gradient-custom-3 mb-3"
                                                            type="button"
                                                            onClick={login}>
                                                        Log in
                                                    </button>
                                                </div>

                                                <div className="d-flex align-items-center justify-content-center pb-4">
                                                    <p className="mb-0 me-2 p-text">
                                                        Don't have an account?</p>
                                                    <button type="button"
                                                            className="btn-hover-create color-8"
                                                            onClick={() => {
                                                                navigate('/register');
                                                            }}>
                                                        Create new
                                                    </button>
                                                </div>

                                            </form>

                                        </div>
                                    </div>
                                    <div className="col-lg-6 d-flex align-items-center gradient-custom-3">
                                        <div className="text-white px-3 py-4 p-md-5 mx-md-4">
                                            <h4 className="mb-4">
                                                Welcome Back to Spotify Search</h4>
                                            <p className="small mb-0">
                                                Using the Spotify Search tool you can discover
                                                Spotify's Hidden Details about Artists, Albums, and
                                                Tracks. Remember to save your favorite artists,
                                                albums, and tracks. Also use our recommendation tool
                                                to find new songs you'll love!</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Login;
