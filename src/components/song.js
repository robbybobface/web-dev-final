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

const Song = () => {
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

    const [ token, setToken ] = useState('');
    const [track, setTrack] = useState({TrackInfo: {}});
    const [artist, setArtists] = useState({RelatedArtists: []});
    const [tracks, setTracks] = useState({OtherTracks: []});

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
                let artistid = 0;
                let trackid = 0
                axios(`https://api.spotify.com/v1/tracks/60Pe9j2pCBa4Zp4ztf5nhd`, {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + tokenResponse.data.access_token
                    }
                })
                    .then(tracksResponse => {
                        console.log(tracksResponse);
                        console.log(tracksResponse.data);
                        console.log(tracksResponse.data.artists);
                        setTrack({
                            TrackInfo: tracksResponse.data
                        });
                        artistid = tracksResponse.data.artists[0].id;
                        trackid = tracksResponse.data.id;
                        console.log(trackid)
                    });



                console.log(artistid);
                axios(`https://api.spotify.com/v1/artists/6kBDZFXuLrZgHnvmPu9NsG/related-artists`, {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + tokenResponse.data.access_token
                    }
                })
                    .then(artistsResponse => {
                        setArtists({
                            RelatedArtists: artistsResponse.data.artists
                        });
                    });

                axios(`https://api.spotify.com/v1/artists/6kBDZFXuLrZgHnvmPu9NsG/top-tracks`, {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + tokenResponse.data.access_token
                    },
                    params: {
                        'country': 'RU'
                    }
                })
                    .then(otherSongsResponse => {
                        console.log(otherSongsResponse.data.tracks);
                        const othertracks = otherSongsResponse.data.tracks.filter(track => track.id !== trackid)
                        console.log(othertracks)
                        setTracks({
                            OtherTracks: otherSongsResponse.data.tracks
                        });
                    });

            });

    }, [ track.selectedTrack, spotify.ClientId, spotify.ClientSecret ]);
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
                        <a href="/" className="list-group-item list-group-item-action">{artist.RelatedArtists[0]?.name}</a>
                        <a href="/" className="list-group-item list-group-item-action">{artist.RelatedArtists[1]?.name}</a>
                        <a href="/" className="list-group-item list-group-item-action">{artist.RelatedArtists[2]?.name}</a>
                        <a href="/" className="list-group-item list-group-item-action">{artist.RelatedArtists[3]?.name}</a>
                        <a href="/" className="list-group-item list-group-item-action">{artist.RelatedArtists[4]?.name}</a>
                    </ul>
                </div>
                <div className="col-sm-4 pt-4">
                    <div className="row col-sm-10">
                        <img className="rounded px-0"
                            // src={album.images[0].ur
                             src={'https://i.scdn.co/image/ab67616d0000b273f5b910ba28f8fc7572cb8018'}
                             alt={'aphex twin'}>
                        </img>
                    </div>
                    <div className="h1 text-center col-sm-10 px-0">
                        <Link to="/">
                            <label htmlFor='' className="form-label"> {/* name */}
                                {track.TrackInfo.name}
                            </label>
                        </Link>
                    </div>
                    <div className="h3 text-center col-sm-10 px-0">
                        <Link to="/">
                            <label htmlFor='' className="form-label"> {/* name */}
                                {track.TrackInfo.album?.name}
                            </label>
                        </Link>
                    </div>
                    <div className="h4 text-center col-sm-10 px-0">
                        <Link to="/">
                            <label htmlFor='Aphex Twin' className="form-label"> {/*artists[0].name*/}
                                {track.TrackInfo.artists[0]?.name}
                            </label>
                        </Link>
                    </div>
                </div>
                <div className="col-sm-4 pt-4 float-end">
                    <h5>Other tracks by {track.TrackInfo.artists[0]?.name} </h5>
                    <ul className="list-group col-sm-8">
                        <li className="list-group-item">{tracks.OtherTracks[0]?.name}</li>
                        <li className="list-group-item">{tracks.OtherTracks[1]?.name}</li>
                        <li className="list-group-item">{tracks.OtherTracks[2]?.name}</li>
                        <li className="list-group-item">{tracks.OtherTracks[3]?.name}</li>
                        <li className="list-group-item">{tracks.OtherTracks[4]?.name}</li>
                    </ul>
                </div>
            </div>
        </>
    );
}

export default Song;