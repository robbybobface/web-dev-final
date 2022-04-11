import React, { useEffect, useState } from "react";
import * as security from "../services/auth-service";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet';
import { Credentials } from "../Credentials";
import axios from "axios";
import Dropdown from "./dropdown";
import Detail from "./detail";
import Listbox from "./listbox";

import { MDBInput } from 'mdb-react-ui-kit';

const Search = () => {
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
            {/*<div className="container">*/}
            {/*    <h1>Search Screen</h1>*/}
            {/*    <form onSubmit={buttonClicked}>*/}
            {/*        <Dropdown label="Genre :"*/}
            {/*                  options={genres.listOfGenresFromAPI}*/}
            {/*                  selectedValue={genres.selectedGenre}*/}
            {/*                  changed={genreChanged}/>*/}
            {/*        <Dropdown label="Artist :"*/}
            {/*                  options={artist.listOfArtistFromAPI}*/}
            {/*                  selectedValue={artist.selectedArtist}*/}
            {/*                  changed={artistChanged}/>*/}
            {/*        <div className="col-sm-6 row form-group px-0">*/}
            {/*            <button type="submit" className="btn btn-success col-sm-12">*/}
            {/*                Search*/}
            {/*            </button>*/}
            {/*        </div>*/}
            {/*        <div className="row">*/}
            {/*            <Listbox items={tracks.listOfTracksFromAPI} clicked={listboxClicked}/>*/}
            {/*            {trackDetail && <Detail {...trackDetail} />}*/}
            {/*        </div>*/}
            {/*    </form>*/}
            {/*</div>*/}
            <Helmet>
                <style>{'body {   background-image: url(\'https://images.unsplash.com/photo-1614854262318-831574f15f1f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80\') !important;\n'
                    + '  background-repeat: no-repeat !important;\n'
                    + '  background-size: cover !important;\n'
                    + '  background-color: rgba(61, 162, 195, 0.1) !important; }'}</style>
            </Helmet>
            <div className="container container-search mt-5">
                <div className="row align-content-center justify-content-center">
                    <div className="card mask-custom p-4 col-xl-9">
                        <div className="card-body">
                            <p className="h1 font-weight-bold mb-4 text-white text-center">
                                Discover Amazing Music</p>
                            <div className="row justify-content-center">
                                <div className="col-md-10 mb-3 mb-md-0">
                                    <MDBInput className="input-search"
                                              label="Search Someting"
                                              id="formControlLg"
                                              type="text"
                                              size="lg"
                                              contrast/>
                                </div>

                                <div className="col-md-2">
                                    <input className="btn-hover-search color-8"
                                           type="submit"
                                           value="Search"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row align-content-center justify-content-center">
                    <form onSubmit={buttonClicked}>
                        <Dropdown label="Genre :"
                                  options={genres.listOfGenresFromAPI}
                                  selectedValue={genres.selectedGenre}
                                  changed={genreChanged}/>
                        <Dropdown label="Artist :"
                                  options={artist.listOfArtistFromAPI}
                                  selectedValue={artist.selectedArtist}
                                  changed={artistChanged}/>
                        <div className="col-sm-6 row form-group px-0">
                            <button type="submit" className="btn btn-success col-sm-12">
                                Search
                            </button>
                        </div>
                        <div className="row">
                            <Listbox items={tracks.listOfTracksFromAPI}
                                     clicked={listboxClicked}/>
                            {trackDetail && <Detail {...trackDetail} />}
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Search;
