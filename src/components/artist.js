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
    const artistid = '6kBDZFXuLrZgHnvmPu9NsG';
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
    const [artist, setArtist] = useState({ArtistInfo: {}});
    const [artists, setArtists] = useState({RelatedArtists: []});
    const [tracks, setTracks] = useState({PopularTracks: []});
    const [artistSummary, setArtistSummary] = useState({ArtistSummary: ''});

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
                let trackid = 0;
                let artistname = '';
                // axios(`https://api.spotify.com/v1/tracks/60Pe9j2pCBa4Zp4ztf5nhd`, {
                //     method: 'GET',
                //     headers: {
                //         'Authorization': 'Bearer ' + tokenResponse.data.access_token
                //     }
                // })
                //     .then(tracksResponse => {
                //         setTrack({
                //             TrackInfo: tracksResponse.data
                //         });
                //         artistid = tracksResponse.data.artists[0].id;
                //         trackid = tracksResponse.data.id;
                //         artistname = tracksResponse.data.artists[0].name;
                //     });

                axios(`https://api.spotify.com/v1/artists/${artistid}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + tokenResponse.data.access_token
                    }
                })
                    .then(artistResponse => {
                        console.log(artistResponse.data)
                        setArtist({
                            ArtistInfo: artistResponse.data
                        });
                    });


                axios(`https://en.wikipedia.org/api/rest_v1/page/summary/${artist.ArtistInfo?.name}`, {
                    method: 'GET',
                })
                    .then(artistsInfoResponse => {
                        console.log(artistsInfoResponse.data.extract)
                        setArtistSummary({
                            ArtistSummary: artistsInfoResponse.data.extract
                        });
                    });


                axios(`https://api.spotify.com/v1/artists/${artistid}/related-artists`, {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + tokenResponse.data.access_token
                    }
                })
                    .then(artistsResponse => {
                        console.log(artistsResponse.data.artists)
                        setArtists({
                            RelatedArtists: artistsResponse.data.artists
                        });
                    });

                axios(`https://api.spotify.com/v1/artists/${artistid}/top-tracks`, {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + tokenResponse.data.access_token
                    },
                    params: {
                        'country': 'RU'
                    }
                })
                    .then(popularTracksResponse => {
                        const populartracks = popularTracksResponse.data.tracks.filter(track => track.id !== trackid)
                        setTracks({
                            PopularTracks: populartracks
                        });
                    });

            });

    }, [ spotify.ClientId, spotify.ClientSecret ]);
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
                        <a href="/" className="list-group-item list-group-item-action">{artists.RelatedArtists[0]?.name}</a>
                        <a href="/" className="list-group-item list-group-item-action">{artists.RelatedArtists[1]?.name}</a>
                        <a href="/" className="list-group-item list-group-item-action">{artists.RelatedArtists[2]?.name}</a>
                        <a href="/" className="list-group-item list-group-item-action">{artists.RelatedArtists[3]?.name}</a>
                        <a href="/" className="list-group-item list-group-item-action">{artists.RelatedArtists[4]?.name}</a>
                    </ul>
                </div>
                <div className="col-sm-4 pt-4">
                    <div className="row col-sm-10">
                        <img className="rounded px-0"
                            // src={album.images[0].ur
                             src={artist.ArtistInfo.images[0].url}
                             alt={'aphex twin'}>
                        </img>
                    </div>
                    <div className="h1 text-center col-sm-10 px-0">
                        <Link to="/">
                            <label htmlFor='Name' className="form-label"> {/* name */}
                                {artist.ArtistInfo.name}
                            </label>
                        </Link>
                    </div>
                    <div className="h3 text-center col-sm-10">
                        <Link to="/">
                            <label htmlFor='Aphex Twin' className="form-label">
                                {artist.ArtistInfo?.genres.toString()}
                            </label>
                        </Link>
                    </div>
                    <div className="h6 text-center col-sm-10 px-0">
                        <p>{artistSummary.ArtistSummary}</p>
                    </div>
                </div>
                <div className="col-sm-4 pt-4 float-end">
                    <h5>Popular Tracks </h5>
                    <ul className="list-group col-sm-8">
                        <li className="list-group-item">{tracks.PopularTracks[0]?.name}</li>
                        <li className="list-group-item">{tracks.PopularTracks[1]?.name}</li>
                        <li className="list-group-item">{tracks.PopularTracks[2]?.name}</li>
                        <li className="list-group-item">{tracks.PopularTracks[3]?.name}</li>
                        <li className="list-group-item">{tracks.PopularTracks[4]?.name}</li>
                    </ul>
                </div>
            </div>
        </>
    );
}

export default Artist;