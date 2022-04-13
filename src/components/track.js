import React, { useEffect, useState } from 'react';

import { css } from "@emotion/react";

import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Credentials } from "../Credentials";
import { Helmet } from "react-helmet";
import moment from "moment";
import momentDurationFormatSetup from "moment-duration-format";
import { BarLoader, ScaleLoader } from "react-spinners";
import { toast } from "react-toastify";
import * as security from "../services/auth-service";
import { useDispatch } from "react-redux";
import { MDBCol, MDBRow } from "mdb-react-ui-kit";
import TrackListItem from "./partials/TrackListItem";
import RecommendedTrackListItem from "./partials/RecommendedTrackListItem";

import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

const override = css`
  display: block;
  margin: 0 auto;
  border-color: #00C9B9;
`;

const Track = () => {
        const { tid } = useParams();
        const [ loggedIn, setLoggedIn ] = useState(false);
        const [ track, setTrack ] = useState({});
        const [ artist, setArtist ] = useState({});
        const [ genres, setGenres ] = useState([]);
        const [ features, setFeatures ] = useState({});
        const [ analyses, setAnalyses ] = useState({});
        const [ recommended, setRecommended ] = useState({});
        const [ loading, setLoading ] = useState(true);

        const [ liked, setLiked ] = useState(false);

        const location = useLocation();
        const dispatch = useDispatch();
        const navigate = useNavigate();

        const keys = [ 'C', 'C♯/D♭', 'D', 'D♯/E♭', 'E', 'F', 'F♯/G♭', 'G', 'G♯/A♭', 'A', 'A♯/B♭', 'B' ];

        const notRendered = Object.keys(track).length === 0 && Object.keys(artist).length === 0
            && Object.keys(features).length === 0 && Object.keys(analyses).length === 0;

        const spotify = Credentials();

        const [ token, setToken ] = useState('');

        const getData = async () => {
            const token = await axios('https://accounts.spotify.com/api/token', {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Basic ' + btoa(spotify.ClientId + ':' + spotify.ClientSecret)
                },
                data: 'grant_type=client_credentials',
                method: 'POST'
            });
            setToken(token.data.access_token);
            const trackCall = await axios.get(`https://api.spotify.com/v1/tracks/${tid}?market=US`,
                {
                    headers: {
                        'Authorization': 'Bearer ' + token.data.access_token
                    }
                });
            console.log(trackCall);
            setTrack(trackCall.data);
            const artistCall = await axios.get(
                `https://api.spotify.com/v1/artists/${trackCall.data.artists[0].id}`,
                {
                    headers: {
                        'Authorization': 'Bearer ' + token.data.access_token
                    }
                });
            console.log(artistCall);
            setArtist(artistCall.data);
            const genreCall = await formatGenres(artistCall.data);
            setGenres(genreCall);
            console.log(genreCall);

            const featureCall = await axios.get(
                `https://api.spotify.com/v1/audio-features/${tid}`,
                {
                    headers: {
                        'Authorization': 'Bearer ' + token.data.access_token
                    }
                });
            setFeatures(featureCall.data);
            console.log(featureCall.data);

            const analysesCall = await axios.get(
                `https://api.spotify.com/v1/audio-analysis/${tid}`,
                {
                    headers: {
                        'Authorization': 'Bearer ' + token.data.access_token
                    }
                });
            setAnalyses(analysesCall.data);
            console.log(analysesCall.data);

            const recommendedCall = await axios.get(
                `https://api.spotify.com/v1/recommendations?limit=4&market=US&seed_artists=${artistCall.data.id}&seed_tracks=${tid}`,
                {
                    headers: {
                        'Authorization': 'Bearer ' + token.data.access_token
                    }
                });
            console.log(recommendedCall.data.tracks);
            setRecommended(recommendedCall.data.tracks);
            setLoading(false);

        };

        const formatGenres = (artist) => {
            return artist.genres.map(
                (genre) => {
                    if (genre.includes(' ')) {
                        const newGenre = genre.split(' ');
                        const finalGenre = newGenre.map(
                            word => word.charAt(0).toUpperCase()
                                + word.slice(
                                    1));
                        return finalGenre.join(' ').concat(', ');
                    } else if (genre.includes('-')) {
                        const newGenre = genre.split('-');
                        return newGenre.map(
                            word => word.charAt(0).toUpperCase()
                                + word.slice(
                                    1)).join('-').concat(', ');
                    } else {
                        // console.log(genre);
                        return genre.charAt(0).toUpperCase()
                            + genre.slice(
                                1).concat(', ');
                    }
                }
            );
        };

        const loggedInHandler = () => {
            security.isLoggedIn(dispatch).then(r => {
                setLoggedIn(r.loggedIn);
                console.log(r);
            });
        };

        const getLiked = () => {
            setLiked(true);
        };

        useEffect(() =>
            loggedInHandler(), [ loggedIn, location.key ]
        );

        useEffect(() => {
            setLoading(true);
            getData().catch(error => toast.error(error));
            getLiked();
        }, [ location.key ]);

        function likeSongHandler() {

        }

        ChartJS.register(
            RadialLinearScale,
            PointElement,
            LineElement,
            Filler,
            Tooltip
        );

        const analysisData = {
            labels: [ 'Acousticness', 'Danceability', 'Liveness', 'Speechiness', 'Valence' ],
            datasets: [
                {
                    data: [ features.acousticness * 100, features.danceability * 100,
                        features.liveness * 100, features.speechiness * 100, features.valence * 100 ],
                    color: 'rgb(255,255,255)',
                    backgroundColor: 'rgba(30,183,183,0.2)',
                    borderColor: 'rgb(43,118,118)',
                    borderWidth: 1,
                    pointBackgroundColor: 'rgb(57,164,164)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgb(57,164,164)'
                },
            ],
        };
        const analysisOptions = {
            responsive: true,
            color: 'white',
            scales: {
                r: {
                    fontSize: '20px',
                    suggestedMin: 0,
                    suggestedMax: 100,
                    grid: {
                        color: 'rgba(255,255,255,0.4)'
                    },
                    pointLabels: {
                        color: 'white',
                        font: {
                            size: 15,
                            family: 'Roboto Light',
                        }
                    },
                    ticks: {
                        // color: 'white',
                        // showLabelBackdrop: false,
                        callback: function () {
                            return "";
                        },
                        backdropColor: "rgba(0, 0, 0, 0)"
                    }
                }
            },
            plugins: {
                legend: {
                    display: false,
                },
            }
        };

        return (
            <>
                <Helmet>
                    <style>{'body {   background-image: url(\'https://images.unsplash.com/photo-1614854262318-831574f15f1f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80\') !important;\n'
                        + '  background-repeat: no-repeat !important;\n'
                        + '  background-size: cover !important;\n'
                        + '  background-color: rgba(61, 162, 195, 0.1) !important; }'}</style>
                </Helmet>
                {loading ?
                    <>
                        <div className="d-flex align-items-center justify-content-center custom-height">
                            <ScaleLoader color={`white`}
                                         loading={loading}
                                         css={override}
                                         height={40}
                                         width={3}
                                         radius={3}
                                         margin={3}/>
                            {/*<BarLoader color={'white'} loading={loading} css={override} height={3}/>*/}
                        </div>
                    </> :
                    <div className="container py-3">
                        <div className="row d-flex justify-content-center align-content-center">
                            <div className="col-10 col-sm-10 col-md-5 col-lg-4 d-flex align-items-center justify-content-center">
                                <div className="card gradient-custom mb-4 mb-md-0">
                                    <div className="card-body text-center">
                                        <img src={notRendered ? '' : track.album.images[0].url}
                                             alt="avatar"
                                             className="img-fluid"/>
                                        <h5 className="item-name mt-3 mt-md-4 mt-xl-4">{notRendered
                                            ? ''
                                            : track.name}
                                            {track.explicit
                                                ?
                                                <span className="material-icons green-color green-color-track">explicit</span>
                                                : ''}</h5>
                                        <p className="item-descriptor mb-sm-3 mb-lg-4">{notRendered
                                            ? ''
                                            : track.artists.map((artist) => {
                                                return artist.name.concat(', ');
                                            }).join(' ').slice(0, -2)
                                        }</p>
                                        <div className="d-flex justify-content-center mb-2">


                                            {/*<button type="button"*/}
                                            {/*        className="btn btn-primary">Follow*/}
                                            {/*</button>*/}
                                            {/*<button type="button"*/}
                                            {/*        className="btn btn-outline-primary ms-1">Message*/}
                                            {/*</button>*/}
                                            {loggedIn ? !liked ?
                                                    <button className="btn-hover-like color-10"
                                                            onClick={() => {
                                                                likeSongHandler();
                                                            }}>
                                                        Like
                                                    </button>
                                                    : <button className="btn-hover-like color-3"
                                                              onClick={() => {
                                                                  likeSongHandler();
                                                              }}>
                                                        Unlike
                                                    </button>
                                                : ''
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-10 col-sm-12 col-md-7 col-lg-8">
                                <div className="card mask-custom-details mb-4">
                                    <div className="card-body">
                                        <div className="row align-items-center">
                                            <div className="col-sm-5 col-md-4 col-xl-2">
                                                <p className="mb-0 item-heading">{notRendered ? ''
                                                    : track.album.album_type.charAt(
                                                    0).toUpperCase() + track.album.album_type.slice(
                                                    1)}</p>
                                            </div>
                                            <div className="col-sm-7 col-xl-10">
                                                <p className="item-descriptor mb-0">{notRendered
                                                    ? ''
                                                    : track.album.name}
                                                </p>
                                            </div>
                                        </div>
                                        <hr/>
                                        <div className="row align-items-center">
                                            <div className="col-sm-5 col-md-4 col-xl-2">
                                                <p className="mb-0 item-heading">Release Date</p>
                                            </div>
                                            <div className="col-sm-7">
                                                <p className="item-descriptor mb-0">{notRendered
                                                    ? ''
                                                    : moment(track.album.release_date).format(
                                                        'MMMM Do, YYYY')}</p>
                                            </div>
                                        </div>
                                        <hr/>
                                        <div className="row align-items-center">
                                            <div className="col-sm-5 col-md-4 col-xl-2">
                                                <p className="mb-0 item-heading">Duration</p>
                                            </div>
                                            <div className="col-sm-7 col-xl-10">
                                                <p className="item-descriptor mb-0">{notRendered
                                                    ? ''
                                                    :
                                                    moment.duration(track.duration_ms,
                                                        "milliseconds").format(
                                                        'h [hrs], m [min], ss [secs]')}
                                                </p>
                                            </div>
                                        </div>
                                        <hr/>
                                        <div className="row align-items-center">
                                            <div className="col-sm-5 col-md-4 col-xl-2">
                                                <p className="mb-0 item-heading">{notRendered ? ''
                                                    : genres.length > 1 ? 'Genres:' : 'Genre'}</p>
                                            </div>
                                            <div className="col-sm-7">
                                                <p className="item-descriptor mb-0">{notRendered
                                                    ? ''
                                                    : genres.join(' ').slice(0, -2)}</p>
                                            </div>
                                        </div>
                                        <hr/>
                                        <div className="row mb-0 align-items-center">
                                            <div className="col-sm-5 col-md-4 col-xl-2">
                                                <p className="mb-0 item-heading">{notRendered ? ''
                                                    : 'Popularity'}</p>
                                            </div>
                                            <div className="col-sm-7">
                                                <p className="item-descriptor mb-0">{notRendered
                                                    ? ''
                                                    : track.popularity + '/100'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row d-flex align-items-center">
                                    <div className="col-md-6 col-lg-6 col-xl-6">
                                        <div className="card mask-custom-details-darker mb-4 mb-md-0">
                                            <div className="card-body">
                                                <p className="progress-header">
                                                    Audio Features
                                                </p>
                                                <p className="mb-1 progress-feat">
                                                    Acousticness
                                                </p>
                                                <div className="progress rounded progress-override"
                                                     style={{ height: '5px' }}>
                                                    <div className="progress-bar progress-bar-override"
                                                         role="progressbar"
                                                         style={{
                                                             width: `${features.acousticness
                                                             * 100}%`
                                                         }}
                                                         aria-valuenow="80"
                                                         aria-valuemin="0"
                                                         aria-valuemax="100"/>
                                                </div>
                                                <p className="mt-4 mb-1 progress-feat">
                                                    Danceability
                                                </p>
                                                <div className="progress rounded progress-override"
                                                     style={{ height: '5px' }}>
                                                    <div className="progress-bar progress-bar-override"
                                                         role="progressbar"
                                                         style={{
                                                             width: `${features.danceability
                                                             * 100}%`
                                                         }}
                                                         aria-valuenow="72"
                                                         aria-valuemin="0"
                                                         aria-valuemax="100"/>
                                                </div>
                                                <p className="mt-4 mb-1 progress-feat">
                                                    Liveness
                                                </p>
                                                <div className="progress rounded progress-override"
                                                     style={{ height: '5px' }}>
                                                    <div className="progress-bar progress-bar-override"
                                                         role="progressbar"
                                                         style={{
                                                             width: `${features.liveness * 100}%`
                                                         }}
                                                         aria-valuenow="89"
                                                         aria-valuemin="0"
                                                         aria-valuemax="100"/>
                                                </div>
                                                <p className="mt-4 mb-1 progress-feat">
                                                    Speechiness
                                                </p>
                                                <div className="progress rounded progress-override"
                                                     style={{ height: '5px' }}>
                                                    <div className="progress-bar progress-bar-override"
                                                         role="progressbar"
                                                         style={{
                                                             width: `${features.speechiness * 100}%`
                                                         }}
                                                         aria-valuenow="55"
                                                         aria-valuemin="0"
                                                         aria-valuemax="100"/>
                                                </div>
                                                <p className="mt-4 mb-1 progress-feat">
                                                    Valence
                                                </p>
                                                <div className="progress rounded mb-2 progress-override"
                                                     style={{ height: '5px' }}>
                                                    <div className="progress-bar progress-bar-override"
                                                         role="progressbar"
                                                         style={{
                                                             width: `${features.valence * 100}%`
                                                         }}
                                                         aria-valuenow="66"
                                                         aria-valuemin="0"
                                                         aria-valuemax="100"/>
                                                </div>
                                                {/*<Radar data={analysisData} options={analysisOptions}/>*/}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-lg-6 col-xl-6 justify-content-center">
                                        <div className="card mask-custom-details-darker mb-4 mb-md-4">
                                            <div className="card-body">
                                                <p className="mb-md-2 mb-4 mb-lg-4 mb-xl-4 mb-xxl-4 progress-header">
                                                    Audio Analysis
                                                </p>
                                                <div className="row align-items-center between">
                                                    <div className="col-sm-5 col-md-10 col-xl-4">
                                                        <p className="mb-0 item-heading">Key</p>
                                                    </div>
                                                    <div className="col-sm-7">
                                                        <p className="item-descriptor mb-0">{notRendered
                                                            ? '' : keys[analyses.track.key]}
                                                        </p>
                                                    </div>
                                                </div>
                                                <hr/>
                                                <div className="row align-items-center">
                                                    <div className="col-sm-5 col-md-10 col-xl-4">
                                                        <p className="mb-0 item-heading">{notRendered
                                                            ? ''
                                                            : 'BPM'}</p>
                                                    </div>
                                                    <div className="col-sm-7">
                                                        <p className="item-descriptor mb-0">{notRendered
                                                            ? ''
                                                            : Math.round(analyses.track.tempo)}</p>
                                                    </div>
                                                </div>
                                                <hr/>
                                                <div className="row align-items-center">
                                                    <div className="col-sm-5 col-md-10 col-xl-4">
                                                        <p className="mb-0 item-heading">{notRendered
                                                            ? ''
                                                            : 'Time Signature'}</p>
                                                    </div>
                                                    <div className="col-sm-7">
                                                        <p className="item-descriptor mb-0">{notRendered
                                                            ? ''
                                                            : analyses.track.time_signature
                                                            + '/4'}</p>
                                                    </div>
                                                </div>
                                                <hr/>
                                                <div className="row align-items-center">
                                                    <div className="col-sm-5 col-md-10 col-xl-4">
                                                        <p className="mb-0 item-heading">{notRendered
                                                            ? ''
                                                            : 'Loudness (dB)'}</p>
                                                    </div>
                                                    <div className="col-sm-7">
                                                        <p className="item-descriptor mb-0">{notRendered
                                                            ? ''
                                                            : analyses.track.loudness}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/*<div className="d-none d-md-block d-lg-none row align-items-center justify-content-center">*/}
                        {/*    <div className="col-md-12">*/}
                        {/*        <div className="card mask-custom-details-darker mb-4 mb-md-0">*/}
                        {/*            <div className="card-body">*/}
                        {/*                <p className="progress-header">*/}
                        {/*                    Audio Features*/}
                        {/*                </p>*/}
                        {/*                <Radar data={analysisData} options={analysisOptions}/>*/}
                        {/*            </div>*/}
                        {/*        </div>*/}
                        {/*    </div>*/}
                        {/*</div>*/}
                        <div className="row d-flex align-items-center justify-content-center mt-3">
                            <div className="col-xxl-10">
                                <div className="card mask-custom-details-lighter mb-4 mb-md-0">
                                    <div className="card-body">
                                        <p className="mb-4 progress-header">
                                            Similar Tracks
                                        </p>
                                        <MDBRow className="row-cols-2 row-cols-sm-2 row-cols-md-2 row-cols-lg-4 g-4">
                                            {recommended.map && recommended.map(track =>
                                                <>
                                                    <MDBCol className="align-content-center justify-content-center"
                                                            style={{ display: 'flex' }}
                                                            onClick={() => {
                                                                navigate(`/track/${track.id}`);
                                                            }}>
                                                        <RecommendedTrackListItem key={track.id}
                                                                                  track={track}/>
                                                    </MDBCol>
                                                </>
                                            )}

                                        </MDBRow>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/*<Radar data={analysisData} options={analysisOptions}/>;*/}
                    </div>
                }
            </>

        );
    }
;
;

export default Track;
