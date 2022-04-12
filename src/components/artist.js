import React, {useEffect, useState} from "react";
import * as security from "../services/auth-service";

import Listbox from "../components/listbox";
import Detail from "../components/detail";
import Dropdown from "../components/dropdown";
import {Credentials} from '../Credentials';
import axios from 'axios';

import {useDispatch} from "react-redux";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {Helmet} from "react-helmet";
import {MDBInput} from "mdb-react-ui-kit";

const Artist = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const loggedInHandler = () => {
        security.isLoggedIn(dispatch).then(r => {
            setLoggedIn(r.loggedIn);
            console.log(r);
        });
    };

    useEffect(() =>
        loggedInHandler(), [loggedIn, location.key]
    );

    const spotify = Credentials();

    const [tracks, setTrack] = useState({listOfTracksFromAPI: []});
    const [artist] = useState({Artist: ''});
    const [artists] = useState({listofArtistsFromAPI: []});

    useEffect(() => {

        axios('https://accounts.spotify.com/api/token', {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(spotify.ClientId + ':' + spotify.ClientSecret)
            },
            data: 'grant_type=client_credentials',
            method: 'POST'
        })
            .then(tokenResponse => {
                console.log(tokenResponse);
                setToken(tokenResponse.data.access_token);

                axios(`https://api.spotify.com/v1/tracks/60Pe9j2pCBa4Zp4ztf5nhd`, {
                    method: 'GET',
                    headers: {'Authorization': 'Bearer ' + tokenResponse.data.access_token}
                })
                    .then(tracksResponse => {
                        console.log(tracksResponse);
                        setTrack({
                            selectedTrack: tracks.selectedTrack,
                            listOfTracksFromAPI: tracksResponse.data.tracks
                        });
                    });

            });

    });
    return (
        <>
            <Helmet>
                <style>{'body {background-image: url(\'https://images.unsplash.com/photo-1614854262318-831574f15f1f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80\') !important;\n'
                    + '  background-repeat: no-repeat !important;\n'
                    + '  background-size: cover !important;\n'
                    + '  background-color: rgba(61, 162, 195, 0.1) !important; }'}</style>
            </Helmet>
            <div className="row">
                <div className="col-sm-4 pt-4 ps-5">
                    <h5>Similar Artists </h5>
                    <ul className="list-group col-sm-8">
                        <a href="/" className="list-group-item list-group-item-action">Gorillaz</a>
                        <a href="/" className="list-group-item list-group-item-action">Skrillex</a>
                        <a href="/" className="list-group-item list-group-item-action">Squarepusher</a>
                        <a href="/" className="list-group-item list-group-item-action">Autechre</a>
                        <a href="/" className="list-group-item list-group-item-action">deadmau5</a>
                    </ul>
                </div>
                <div className="col-sm-4 pt-4">
                    <div className="row col-sm-10">
                        <img className="rounded px-0"
                            // src={album.images[0].ur
                             src={'https://seeklogo.com/images/A/Aphex_Twin-logo-16E408E1FC-seeklogo.com.png'}
                             alt={'aphex twin'}>
                        </img>
                    </div>
                    <div className="h1 text-center col-sm-10 px-0">
                        <Link to="/">
                            <label htmlFor='Name' className="form-label"> {/* name */}
                                Aphex Twin
                            </label>
                        </Link>
                    </div>
                    <div className="h3 text-center col-sm-10 px-0">
                        <Link to="/">
                            <label htmlFor='Genres' className="form-label"> {/* name */}
                                Electronic, Techno, Ambient
                            </label>
                        </Link>
                    </div>
                    <div className="h6 text-center col-sm-10 px-0">
                        <p>Richard David James (born 18 August 1971),
                            best known by the alias Aphex Twin and less prominently as AFX, is an Irish-born
                            British musician, composer and DJ. He is best known for his idiosyncratic work in
                            electronic styles such as techno, ambient, and jungle. Music journalists from
                            publications including Mixmag, The New York Times, NME, Fact, Clash and The Guardian have
                            called James one of the most influential or important contemporary electronic musicians.</p>
                    </div>
                </div>
                <div className="col-sm-4 pt-4 float-end">
                    <h5>Popular Tracks </h5>
                    <ul className="list-group col-sm-8">
                        <li className="list-group-item">Alberto Balsalm</li>
                        <li className="list-group-item">Flim</li>
                        <li className="list-group-item">Windowlicker</li>
                        <li className="list-group-item">#19</li>
                        <li className="list-group-item">Come to Daddy</li>
                    </ul>
                </div>
            </div>
        </>
    );
}

export default Artist;