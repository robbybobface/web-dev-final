import React, { useEffect, useState } from "react";
import * as security from "../services/auth-service";
import { useNavigate } from "react-router-dom";
import { Helmet } from 'react-helmet';
import { Credentials } from "../Credentials";
import axios from "axios";

import TrackListItem from "./partials/TrackListItem";

import { MDBBtnGroup, MDBCol, MDBInput, MDBRadio, MDBRow } from 'mdb-react-ui-kit';

const Search = () => {
    const [ search, setSearch ] = useState('');
    const [ trackSearch, setTrackSearch ] = useState(true);
    const [ artistSearch, setArtistSearch ] = useState(false);
    const [ albumSearch, setAlbumSearch ] = useState(false);
    const navigate = useNavigate();

    const spotify = Credentials();

    const [ token, setToken ] = useState('');

    const [ artists, setArtists ] = useState([]);
    const [ albums, setAlbums ] = useState([]);
    const [ tracks, setTracks ] = useState([]);

    const getArtists = () => {
        axios('https://accounts.spotify.com/api/token', {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(spotify.ClientId + ':' + spotify.ClientSecret)
            },
            data: 'grant_type=client_credentials',
            method: 'POST'
        })
            .then(tokenResponse => {
                // console.log(tokenResponse);
                setToken(tokenResponse.data.access_token);

                axios(`https://api.spotify.com/v1/search?q=${search}&type=artist&market=US&limit=8`,
                    {
                        method: 'GET',
                        headers: { 'Authorization': 'Bearer ' + tokenResponse.data.access_token }
                    })
                    .then(artistResponse => {
                        console.log(artistResponse);
                        setArtists(artistResponse.data.artists.items);
                    });

            });
    };

    const getTracks = () => {
        axios('https://accounts.spotify.com/api/token', {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(spotify.ClientId + ':' + spotify.ClientSecret)
            },
            data: 'grant_type=client_credentials',
            method: 'POST'
        })
            .then(tokenResponse => {
                // console.log(tokenResponse);
                setToken(tokenResponse.data.access_token);

                axios(`https://api.spotify.com/v1/search?q=${search}&type=track&market=US&limit=8`,
                    {
                        method: 'GET',
                        headers: { 'Authorization': 'Bearer ' + tokenResponse.data.access_token }
                    })
                    .then(trackResponse => {
                        console.log(trackResponse);
                        setTracks(trackResponse.data.tracks.items);
                    });

            });
    };

    const getAlbums = () => {
        axios('https://accounts.spotify.com/api/token', {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(spotify.ClientId + ':' + spotify.ClientSecret)
            },
            data: 'grant_type=client_credentials',
            method: 'POST'
        })
            .then(tokenResponse => {
                // console.log(tokenResponse);
                setToken(tokenResponse.data.access_token);

                axios(`https://api.spotify.com/v1/search?q=${search}&type=album&market=US&limit=8`,
                    {
                        method: 'GET',
                        headers: { 'Authorization': 'Bearer ' + tokenResponse.data.access_token }
                    })
                    .then(albumResponse => {
                        console.log(albumResponse);
                        setAlbums(albumResponse.data.albums.items);
                    });

            });
    };

    const searchHandler = () => {
        console.log(search);
        getArtists();
        getAlbums();
        getTracks();
    };

    const trackHandler = () => {
        setTrackSearch(true);
        setAlbumSearch(false);
        setArtistSearch(false);
    };

    const albumHandler = () => {
        setTrackSearch(false);
        setAlbumSearch(true);
        setArtistSearch(false);
    };
    const artistHandler = () => {
        setTrackSearch(false);
        setAlbumSearch(false);
        setArtistSearch(true);
    };

    useEffect(() => {
        console.log(artists);
        console.log(tracks);
        console.log(albums);
    });

    return (
        <>
            <Helmet>
                <style>{'body {   background-image: url(\'https://images.unsplash.com/photo-1614854262318-831574f15f1f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80\') !important;\n'
                    + '  background-repeat: no-repeat !important;\n'
                    + '  background-size: cover !important;\n'
                    + '  background-color: rgba(61, 162, 195, 0.1) !important; }'}</style>
            </Helmet>
            <div className="container container-search mt-5">
                <div className="row align-content-center justify-content-center">
                    <div className="card mask-custom px-4 pt-4 pb-2 col-10 col-sm-11 col-xl-9">
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
                                              contrast
                                              onChange={(e) => {
                                                  setSearch(e.target.value);
                                              }}
                                    />
                                </div>

                                <div className="col-md-2">
                                    <input className="btn-hover-search color-8"
                                           type="submit"
                                           value="Search"
                                           onClick={searchHandler}/>
                                </div>
                            </div>
                            <div className="row d-flex mt-4">
                                <div className="category-toggle d-flex align-items-center justify-content-center">
                                    <MDBRadio name="inlineRadio"
                                              className="custom-radio"
                                              id="inlineRadio1"
                                              value="option1"
                                              label="Tracks"
                                              defaultChecked
                                              inline
                                              onClick={trackHandler}/>
                                    <MDBRadio name="inlineRadio"
                                              className="custom-radio"
                                              id="inlineRadio2"
                                              value="option2"
                                              label="Artists"
                                              inline
                                              onClick={artistHandler}/>
                                    <MDBRadio name="inlineRadio"
                                              className="custom-radio"
                                              id="inlineRadio3"
                                              value="option3"
                                              label="Albums"
                                              inline
                                              onClick={albumHandler}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {trackSearch ?
                    <>
                        <h1 className="search-category">Tracks</h1>
                        <MDBRow className="row-cols-2 row-cols-md-2 row-cols-lg-4 g-4 flex-row">
                            {
                                tracks.map && tracks.map(track =>
                                    <>
                                        <MDBCol className="align-content-center justify-content-center"
                                                style={{ display: 'flex' }}>
                                            <TrackListItem key={track.id} track={track}/>
                                        </MDBCol>
                                    </>)
                            }
                        </MDBRow>
                    </>
                    :
                    artistSearch ? <>
                            <h1 className="search-category">Artists</h1>
                        </>
                        : <>
                            <h1 className="search-category">Albums</h1>
                        </>
                }


            </div>
        </>
    );
};

export default Search;
