import React, { useEffect, useState } from "react";
import * as security from "../services/auth-service";

import Listbox from "../components/listbox";
import Detail from "../components/detail";
import Dropdown from "../components/dropdown";
import { Credentials } from '../Credentials';
import axios from 'axios';

import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

const Home = () => {
    const [ loggedIn, setLoggedIn ] = useState(false);
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
        loggedInHandler(), [ loggedIn, location.key ]
    );

    const spotify = Credentials();

    const [ token, setToken ] = useState('');
    const [ genres, setGenres ] = useState({ selectedGenre: '', listOfGenresFromAPI: [] });
    const [ artist, setArtist ] = useState({ selectedArtist: '', listOfArtistFromAPI: [] });
    const [ tracks, setTracks ] = useState({ selectedTrack: '', listOfTracksFromAPI: [] });
    const [ trackDetail, setTrackDetail ] = useState(null);

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

                axios('https://api.spotify.com/v1/recommendations/available-genre-seeds', {
                    method: 'GET',
                    headers: { 'Authorization': 'Bearer ' + tokenResponse.data.access_token }
                })
                    .then(genreResponse => {
                        console.log(genreResponse);
                        setGenres({
                            selectedGenre: genres.selectedGenre,
                            listOfGenresFromAPI: genreResponse.data.genres
                        });
                    });

            });

    }, [ genres.selectedGenre, spotify.ClientId, spotify.ClientSecret ]);

    const genreChanged = val => {
        setGenres({
            selectedGenre: val,
            listOfGenresFromAPI: genres.listOfGenresFromAPI
        });
        console.log('val changed too ' + val);

        axios(`https://api.spotify.com/v1/search?q=genre:"${val}"&type=artist&market=US&limit=20`, {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + token }
        })
            .then(artistResponse => {
                console.log(artistResponse);
                setArtist({
                    selectedArtist: artist.selectedArtist,
                    listOfArtistFromAPI: artistResponse.data.artists.items
                });
            });

    };

    const artistChanged = val => {
        console.log(val);
        setArtist({
            selectedArtist: val,
            listOfArtistFromAPI: artist.listOfArtistFromAPI
        });

    };

    const buttonClicked = e => {
        e.preventDefault();

        axios(`https://api.spotify.com/v1/artists/${artist.selectedArtist}/top-tracks?market=US`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
            .then(tracksResponse => {
                console.log(tracksResponse);
                setTracks({
                    selectedTrack: tracks.selectedTrack,
                    listOfTracksFromAPI: tracksResponse.data.tracks
                });
            });
    };

    const listboxClicked = val => {

        const currentTracks = [ ...tracks.listOfTracksFromAPI ];

        const trackInfo = currentTracks.filter(t => t.id === val);

        setTrackDetail(trackInfo[0]);

    };

    return (
        <>
            {/*<h1>Home Screen</h1>*/}
            {/*{loggedIn ? <h3>{`Welcome Back!`}</h3> : ''}*/}
            {/*<form onSubmit={buttonClicked}>*/}
            {/*    <Dropdown label="Genre :"*/}
            {/*              options={genres.listOfGenresFromAPI}*/}
            {/*              selectedValue={genres.selectedGenre}*/}
            {/*              changed={genreChanged}/>*/}
            {/*    <Dropdown label="Artist :"*/}
            {/*              options={artist.listOfArtistFromAPI}*/}
            {/*              selectedValue={artist.selectedArtist}*/}
            {/*              changed={artistChanged}/>*/}
            {/*    <div className="col-sm-6 row form-group px-0">*/}
            {/*        <button type="submit" className="btn btn-success col-sm-12">*/}
            {/*            Search*/}
            {/*        </button>*/}
            {/*    </div>*/}
            {/*    <div className="row">*/}
            {/*        <Listbox items={tracks.listOfTracksFromAPI} clicked={listboxClicked}/>*/}
            {/*        {trackDetail && <Detail {...trackDetail} />}*/}
            {/*    </div>*/}
            {/*</form>*/}
            <div className="bg-image vh-100 mask mask-custom-home">
                <video id="background-video" playsInline autoPlay muted loop>
                    <source className="h-100"
                            src="https://mdbootstrap.com/img/video/Lines.mp4"
                            type="video/mp4"/>
                </video>
                <div className="container d-flex flex-column align-items-center justify-content-center center-content vh-100">
                    <h1 className="mb-3 header-home">Welcome to our Spotify Clone</h1>
                    <h5 className="mb-4 header-text">Best & free guide of responsive web design</h5>
                    <div className="">
                        <button className="btn-hover color-8"
                                onClick={() => {
                                    navigate('/search');
                                }}>
                            Search Songs
                        </button>
                        <button className="btn-hover color-8"
                                onClick={() => {
                                    navigate('/register');
                                }}>
                            Sign Up Now!
                        </button>
                    </div>

                </div>
            </div>

        </>
    );
};

export default Home;
