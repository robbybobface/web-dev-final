import React, { useState } from "react";
import * as security from "../services/auth-service";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router';
import {toast} from "react-toastify";

const PrivacyPolicy = () => {
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
                navigate('/', {});
            })
            .catch(e =>
                toast.error(e));


    return (
        <div className="contentMain">
            <h1>Privacy Policy</h1>
            <ul>
                <li><a href="#1-about-this-policy">About this Policy</a></li>
                <li><a href="#2-your-personal-data-rights-and-controls">Your personal data rights and controls</a></li>
                <li><a href="#3-personal-data-we-collect-about-you">Personal data we collect about you</a></li>
                <li><a href="#4-our-usage-of-your-personal-data">Our usage of your personal data</a></li>
                <li><a href="#5-contact-us">Contact us</a></li>
            </ul>
            <br/>
            <h2>
                <a href={"#1-about-this-policy"} id={"1-about-this-policy"}>
                    1. About this Policy
                </a>
            </h2>
            <p>This Policy describes how we process your personal data at Spotify Clone</p>
            <p>It applies to your use of:</p>
            <ul>
                <li>all Spotify Clone streaming services as a user; and</li>
                <li>other Spotify Clone services which include a link to this Privacy Policy.</li>
            </ul>
            <p>From now on, we'll collectively call these the "<strong>Spotify Clone Service</strong>".</p>
            <p>From time to time, we may develop new or offer additional services. They'll also be subject to this Policy, unless stated otherwise when we introduce them.</p>
            <p><strong>This Policy is <em>not...</em></strong></p>
            <ul>
                <li>the Spotify Clone Terms of Use. That's a separate document, outlining the legal contract between you and Spotify Clone for using the Spotify Service. It also describes the rules of Spotify Clone and your user rights.</li>
                <li>about your use of other Spotify Clone services which have their own dedicated privacy policy.</li>
            </ul>
            <br/>

            <h2>
                <a href={"#2-your-personal-data-rights-and-controls"} id={"2-your-personal-data-rights-and-controls"}>
                    2. Your personal data rights and controls
                </a>
            </h2>
            <p>Privacy laws, including the General Data Protection Regulation ("GDPR"), give rights to individuals over their personal data.</p>
            <p>See your rights and their descriptions in this table. </p>
            <table>
                <thead>
                <tr>
                    <th><br/></th>
                    <th><strong>It’s your right to...</strong></th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>Access</td>
                    <td>Be informed of the personal data we process about you and to request access to it</td>
                </tr>
                <tr>
                    <td>Rectification</td>
                    <td>Request that we amend or update your personal data where it’s inaccurate or incomplete</td>
                </tr>
                <tr>
                    <td>Erasure</td>
                    <td>Request that we delete certain of your personal data</td>
                </tr>
                <tr>
                    <td>Restriction</td>
                    <td>Request that we temporarily or permanently stop processing all or some of your personal data</td>
                </tr>
                <tr>
                    <td>Object</td>
                    <td>Object to us processing your personal data at any time, on grounds
                        relating to your particular situation<br/>Object to your personal data
                        being processed for direct marketing purposes</td>
                </tr>
                <tr>
                    <td>Data portability</td>
                    <td>Request a copy of your personal data in electronic format and the right
                        to transmit that personal data for use in another party’s service</td>
                </tr>
                <tr>
                    <td>Not be subject to automated decision-making</td>
                    <td>Not be subject to a decision based solely on automated decision making
                        (decisions without human involvement), including profiling, where the
                        decision would have a legal effect on you or produce a similarly
                        significant effect</td>
                </tr>
                </tbody>
            </table>
            <br/>

            <h2>
                <a href={"#3-personal-data-we-collect-about-you"} id={"3-personal-data-we-collect-about-you"}>
                    3. Personal data we collect about you
                </a>
            </h2>
            <p>
                Spotify Clone Services collects such information as:
                <ul>
                    <li>your name</li>
                    <li>your email address</li>
                    <li>your Spotify login information </li>
                </ul>
            </p>
            <br/>

            <h2>
                <a href={"#4-our-usage-of-your-personal-data"} id={"4-our-usage-of-your-personal-data"}>
                    4. Our usage of your personal data
                </a>
            </h2>
            <p>
                Spotify Clone Services uses your personally identifying information <em>only</em>
                in order to present relevant Spotify information to the end user. We will not
                collect or store any information in order to sell it to advertisers or other
                third parties.
            </p>
            <br/>

            <h2>
                <a href={"#5-contact-us"} id={"5-contact-us"}>
                    5. Contact us
                </a>
            </h2>
            <p>For questions or concerns about this Policy, contact us at&nbsp;
                <a href={"mailto:privacy@Spotify Clone.com"}>privacy@Spotify Clone.com</a>.
            </p>
        </div>
    );
}

export default PrivacyPolicy;