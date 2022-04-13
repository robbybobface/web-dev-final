import React, { useState } from "react";
import * as security from "../services/auth-service";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { MDBInput } from "mdb-react-ui-kit";

const Login = () => {
    const [ loginUser, setLoginUser ] = useState({});
    const navigate = useNavigate();

    const login = () =>
        security.login(loginUser)
            .then((response) => {
                console.log(response);
                toast.success(response.success, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                navigate('/search', {});
            })
            .catch(e =>
                toast.error('Invalid Username or Password')
            );
    // toast.error(e));
    return (
        <>
            <section className="gradient-form">
                <div className="container">
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
                                                    The Spotify Clone</h4>
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
                                                    <button className="btn btn-primary btn-block fa-lg gradient-custom-2 mb-3"
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
                                    <div className="col-lg-6 d-flex align-items-center gradient-custom-2">
                                        <div className="text-white px-3 py-4 p-md-5 mx-md-4">
                                            <h4 className="mb-4">
                                                Something about a Spotify Thingy</h4>
                                            <p className="small mb-0">
                                                Lorem ipsum dolor sit amet, consectetur adipisicing
                                                elit, sed do eiusmod tempor incididunt ut labore et
                                                dolore magna aliqua. Ut enim ad minim veniam, quis
                                                nostrud exercitation ullamco laboris nisi ut aliquip
                                                ex ea commodo consequat.</p>
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
