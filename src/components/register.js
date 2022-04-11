import React, { useEffect, useState } from "react";
import * as security from "../services/auth-service";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Register = () => {
    const [ registerUser, setRegisterUser ] = useState({});
    const navigate = useNavigate();

    const register = () =>
        security.register(registerUser)
            .then((response) => {
                console.log(response);
                if (response.error === 'User validation failed: email: invalid email') {
                    toast.error('Please enter a valid email');
                } else if (response.error
                    === 'User validation failed: email: Path `email` is required.') {
                    toast.error('Please enter an email');
                } else if (response.error) {
                    toast.error(response.error);
                } else {
                    toast.success(response, {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                    navigate('/', {});
                }
            })
            .catch(e => toast.error(e));
    return (
        <>

            {/*<div className="container d-flex justify-content-center align-items-center mt-5 login-card">*/}
            {/*    <div className="row">*/}
            {/*        <div className="col-md-8 offset-md-2 col-lg-6 offset-lg-3 col-xl-4 offset-xl-4">*/}
            {/*            <div className="card shadow card-container">*/}
            {/*                <img src="https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2338&q=80"*/}
            {/*                     alt="" className="card-img-top"/>*/}
            {/*                <div className="card-body card-body-login">*/}
            {/*                    <h5 className="card-title">Login</h5>*/}
            {/*                    <div className="mb-3">*/}
            {/*                        <label className="form-label"*/}
            {/*                               htmlFor="email">Email</label>*/}
            {/*                        <input className="form-control"*/}
            {/*                               type="email"*/}
            {/*                               id="email"*/}
            {/*                               name="email"*/}
            {/*                               autoFocus*/}
            {/*                               onChange={(e) =>*/}
            {/*                                   setRegisterUser({*/}
            {/*                                       ...registerUser,*/}
            {/*                                       email: e.target.value*/}
            {/*                                   })}*/}
            {/*                               required/>*/}
            {/*                    </div>*/}
            {/*                    <div className="mb-3">*/}
            {/*                        <label className="form-label"*/}
            {/*                               htmlFor="username">Username</label>*/}
            {/*                        <input className="form-control"*/}
            {/*                               type="text"*/}
            {/*                               id="username"*/}
            {/*                               name="username"*/}
            {/*                               onChange={(e) =>*/}
            {/*                                   setRegisterUser({*/}
            {/*                                       ...registerUser,*/}
            {/*                                       username: e.target.value*/}
            {/*                                   })}*/}
            {/*                               required/>*/}
            {/*                    </div>*/}
            {/*                    <div className="mb-4">*/}
            {/*                        <label className="form-label"*/}
            {/*                               htmlFor="password">Password</label>*/}
            {/*                        <input className="form-control"*/}
            {/*                               type="password"*/}
            {/*                               id="password"*/}
            {/*                               name="password"*/}
            {/*                               onChange={(e) =>*/}
            {/*                                   setRegisterUser({*/}
            {/*                                       ...registerUser,*/}
            {/*                                       password: e.target.value*/}
            {/*                                   })}*/}
            {/*                               required/>*/}
            {/*                    </div>*/}
            {/*                    <button className="btn btn-login btn-block"*/}
            {/*                            onClick={register}>Register*/}
            {/*                    </button>*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}

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
                                                     style={{ width: '150px' }} alt="logo"/>
                                                <h4 className="mt-4 mb-5 pb-1 h4-text">
                                                    The Spotify Clone</h4>
                                            </div>
                                            <form>
                                                <p className="p-text">
                                                    Sign Up Now</p>
                                                <div className="form-outline mb-4">
                                                    <input type="email"
                                                           id="register-email"
                                                           className="form-control input-login"
                                                           placeholder="Email"
                                                           onChange={(e) =>
                                                               setRegisterUser({
                                                                   ...registerUser,
                                                                   email: e.target.value
                                                               })}
                                                           required/>
                                                    <label className="form-label label-login"
                                                           htmlFor="register-email">Email</label>
                                                </div>
                                                <div className="form-outline mb-4">
                                                    <input type="email"
                                                           id="register-username"
                                                           className="form-control input-login"
                                                           placeholder="Username"
                                                           onChange={(e) =>
                                                               setRegisterUser({
                                                                   ...registerUser,
                                                                   username: e.target.value
                                                               })}
                                                           required/>
                                                    <label className="form-label label-login"
                                                           htmlFor="register-username">Username</label>
                                                </div>

                                                <div className="form-outline mb-4">
                                                    <input type="password"
                                                           id="register-password"
                                                           placeholder="Password"
                                                           className="form-control input-login"
                                                           onChange={(e) =>
                                                               setRegisterUser({
                                                                   ...registerUser,
                                                                   password: e.target.value
                                                               })}
                                                           required/>
                                                    <label className="form-label label-login"
                                                           htmlFor="register-password">Password</label>
                                                </div>

                                                <div className="text-center pt-1 mb-3 pb-1">
                                                    <button className="btn btn-primary btn-block fa-lg gradient-custom-2 mb-3"
                                                            type="button"
                                                            onClick={register}>
                                                        Log in
                                                    </button>
                                                </div>

                                                <div className="d-flex align-items-center justify-content-center pb-4">
                                                    <p className="mb-0 me-2 p-text">
                                                        Already have an account?</p>
                                                    <button type="button"
                                                            className="btn-hover-create color-8"
                                                            onClick={() => {
                                                                navigate('/login');
                                                            }}>
                                                        Login
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

export default Register;
