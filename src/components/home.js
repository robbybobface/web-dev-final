import React, { useEffect, useState } from "react";
import * as security from "../services/auth-service";

import Listbox from "../components/listbox";
import Detail from "../components/detail";
import Dropdown from "../components/dropdown";
import { Credentials } from '../Credentials';
import axios from 'axios';

import { useDispatch, useSelector } from "react-redux";

const Home = () => {
    const update = useSelector((state) => state.auth);
    const [ loggedIn, setLoggedIn ] = useState(false);
    const dispatch = useDispatch();
    const loggedInHandler = () => {
        security.isLoggedIn(dispatch).then(r => {
            setLoggedIn(r.loggedIn);
            console.log(r);
        });
    };

    useEffect(() =>
        loggedInHandler(), [ loggedIn ]
    );

    const spotify = Credentials();

    const [ token, setToken ] = useState('');
    const [ genres, setGenres ] = useState({ selectedGenre: '', listOfGenresFromAPI: [] });
    const [ playlist, setPlaylist ] = useState({ selectedPlaylist: '', listOfPlaylistFromAPI: [] });
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

                axios('https://api.spotify.com/v1/browse/categories', {
                    method: 'GET',
                    headers: { 'Authorization': 'Bearer ' + tokenResponse.data.access_token }
                })
                    .then(genreResponse => {
                        console.log(genreResponse);
                        setGenres({
                            selectedGenre: genres.selectedGenre,
                            listOfGenresFromAPI: genreResponse.data.categories.items
                        });
                    });

            });

    }, [ genres.selectedGenre, spotify.ClientId, spotify.ClientSecret ]);

    const genreChanged = val => {
        setGenres({
            selectedGenre: val,
            listOfGenresFromAPI: genres.listOfGenresFromAPI
        });

        axios(`https://api.spotify.com/v1/browse/categories/${val}/playlists?limit=10`, {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + token }
        })
            .then(playlistResponse => {
                setPlaylist({
                    selectedPlaylist: playlist.selectedPlaylist,
                    listOfPlaylistFromAPI: playlistResponse.data.playlists.items
                });
            });

        console.log(val);
    };

    const playlistChanged = val => {
        console.log(val);
        setPlaylist({
            selectedPlaylist: val,
            listOfPlaylistFromAPI: playlist.listOfPlaylistFromAPI
        });
    };

    const buttonClicked = e => {
        e.preventDefault();

        axios(`https://api.spotify.com/v1/playlists/${playlist.selectedPlaylist}/tracks?limit=10`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
            .then(tracksResponse => {
                setTracks({
                    selectedTrack: tracks.selectedTrack,
                    listOfTracksFromAPI: tracksResponse.data.items
                });
            });
    };

    const listboxClicked = val => {

        const currentTracks = [ ...tracks.listOfTracksFromAPI ];

        const trackInfo = currentTracks.filter(t => t.track.id === val);

        setTrackDetail(trackInfo[0].track);

    };

    return (
        <>
            <h1>Home Screen</h1>
            {loggedIn ? <h3>{`Welcome Back!`}</h3> : ''}
            <form onSubmit={buttonClicked}>
                <Dropdown label="Genre :"
                          options={genres.listOfGenresFromAPI}
                          selectedValue={genres.selectedGenre}
                          changed={genreChanged}/>
                <Dropdown label="Playlist :"
                          options={playlist.listOfPlaylistFromAPI}
                          selectedValue={playlist.selectedPlaylist}
                          changed={playlistChanged}/>
                <div className="col-sm-6 row form-group px-0">
                    <button type="submit" className="btn btn-success col-sm-12">
                        Search
                    </button>
                </div>
                <div className="row">
                    <Listbox items={tracks.listOfTracksFromAPI} clicked={listboxClicked}/>
                    {trackDetail && <Detail {...trackDetail} />}
                </div>
            </form>

        </>
    );
};

export default Home;
