import React, { useContext, useEffect, useMemo, useState } from 'react';

import { css } from "@emotion/react";

import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Credentials } from "../Credentials";
import { Helmet } from "react-helmet";
import moment from "moment";
import momentDurationFormatSetup from "moment-duration-format";
import { ScaleLoader } from "react-spinners";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { MDBCol, MDBRow } from "mdb-react-ui-kit";
import RecommendedTrackListItem from "./partials/RecommendedTrackListItem";

import { UserContext } from "../Utils/UserContext";
import * as service from "../services/user-service";
import * as trackService from "../services/track-service";

const override = css`
  display: block;
  margin: 0 auto;
  border-color: #00C9B9;
`;

const Track = () => {
    const { tid } = useParams();
    const { user, loggedIn } = useContext(UserContext);
    const [ stateUser, setStateUser ] = user;
    const [ stateLoggedIn, setStateLoggedIn ] = loggedIn;
    const [ track, setTrack ] = useState({});
    const [ localTrack, setLocalTrack ] = useState({});
    const [ localEmpty, setLocalEmpty ] = useState(true);
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
            }).catch((error) => {
            throw "Could Not Find Song";
        });
        setTrack(trackCall.data);
        const artistCall = await axios.get(
            `https://api.spotify.com/v1/artists/${trackCall.data.artists[0].id}`,
            {
                headers: {
                    'Authorization': 'Bearer ' + token.data.access_token
                }
            });
        // console.log(artistCall);
        setArtist(artistCall.data);
        const genreCall = await formatGenres(artistCall.data);
        setGenres(genreCall);
        // console.log(genreCall);

        const featureCall = await axios.get(
            `https://api.spotify.com/v1/audio-features/${tid}`,
            {
                headers: {
                    'Authorization': 'Bearer ' + token.data.access_token
                }
            });
        setFeatures(featureCall.data);
        // console.log(featureCall.data);

        const analysesCall = await axios.get(
            `https://api.spotify.com/v1/audio-analysis/${tid}`,
            {
                headers: {
                    'Authorization': 'Bearer ' + token.data.access_token
                }
            });
        setAnalyses(analysesCall.data);
        // console.log(analysesCall.data);

        const recommendedCall = await axios.get(
            `https://api.spotify.com/v1/recommendations?limit=4&market=US&seed_artists=${artistCall.data.id}&seed_tracks=${tid}`,
            {
                headers: {
                    'Authorization': 'Bearer ' + token.data.access_token
                }
            });
        // console.log(recommendedCall);
        const checkRecommended = recommendedCall.data.tracks.filter(
            (recommendation, index) => recommendation.id !== tid && recommendation.name
                !== recommendedCall.data.name &&
                recommendedCall.data.tracks.findIndex(newRecommendation => {
                    return newRecommendation.name === recommendation.name;
                }) === index);
        // console.log(recommendedCall.data.tracks);
        if (checkRecommended.length !== recommendedCall.data.tracks.length) {
            setRecommended(checkRecommended);
        } else {
            setRecommended(recommendedCall.data.tracks);
        }
        setLoading(false);

    };

    const getLocal = async () => {
        const localCall = await trackService.findTrackById(tid);
        if (localCall.error) {
            return;
        }
        setLocalTrack(localCall);
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

    // const loggedInHandler = () => {
    //     security.isLoggedIn(dispatch).then(r => {
    //         setLoggedIn(r.loggedIn);
    //         console.log(r);
    //     });
    // };

    const getLiked = () => {
        if (stateUser.likedSongs.length === 0) {
            return;
        }
        stateUser.likedSongs.map(song => {
            if (song.songId === tid) {
                setLiked(true);
                setLocalEmpty(false);
            }
        });

    };

    const likeSongHandler = async () => {
        // console.log(tid);
        const originalSongs = stateUser.likedSongs;
        // console.log(originalSongs);
        service.updateUser(
            { ...stateUser, likedSongs: [ { songId: tid }, ...originalSongs ] })
            .catch(error => toast.error('something went wrong'));
        toast.success('Song added to liked songs!');
        const foundTrack = await trackService.findTrackById(tid);
        console.log(foundTrack);
        if (foundTrack.error) {
            console.log('we got here');
            const createdTrack = await trackService.createTrack({
                name: track.name,
                artists: track.artists.map((artist) => artist.name),
                trackId: track.id,
                likes: [ stateUser ]
            }).catch(err => toast.error(err));
            console.log('please get here');
            setLocalTrack(createdTrack);
            setLocalEmpty(false);
            setLiked(true);

        } else {
            // console.log('how are we here');
            const updatedTrack = await trackService.updateTrack(
                {
                    ...foundTrack,
                    likes: [ stateUser, ...foundTrack.likes ]
                }).catch(
                err => toast.error(err));
            setLocalTrack(updatedTrack);
            setLocalEmpty(false);
            setLiked(true);
        }
    };
    const unlikeSongHandler = async () => {
        const newSongs = stateUser.likedSongs.filter((song) => song.songId !== tid);
        // console.log(newSongs);
        if (newSongs.length === 0) {
            service.updateUser(
                { ...stateUser, likedSongs: [] })
                .catch(error => toast.error('something went wrong'));
            toast.success('Song removed from liked songs!');
        } else {
            service.updateUser(
                { ...stateUser, likedSongs: [ ...newSongs ] })
                .catch(error => toast.error('something went wrong'));
            toast.success('Song removed from liked songs!');
        }
        const foundTrack = await trackService.findTrackById(tid);
        // console.log(foundTrack);
        const newUsers = foundTrack.likes.filter(
            (user) => user.username !== stateUser.username);
        if (newUsers.length === 0) {
            const deletedTrack = await trackService.deleteTrack(foundTrack).catch(
                err => toast.error(err));
            setLocalEmpty(true);
            setLiked(false);
        } else {
            const updatedTrack = await trackService.updateTrack(
                { ...foundTrack, likes: [ ...newUsers ] }).catch(
                err => toast.error(err));
            setLocalTrack(updatedTrack);
            setLocalEmpty(false);
            setLiked(false);
        }
    };

    // useEffect(() =>
    //     loggedInHandler(), [ loggedIn, location.key ]
    // );

    useMemo(() => {
        window.scrollTo(0, 0);
        setLoading(true);
        try {
            getData();
        } catch (error) {
            toast.error('Could Not Find Song');
            navigate('/search');
        }
    }, [ location.key ]);

    useEffect(() => {
        try {
            getLiked();
            console.log(localTrack);
        } catch (error) {
            toast.error('Could Not Find Song');
            navigate('/search');
        }
    }, [ location.key ]);

    useMemo(() => {
        try {
            getLocal().catch(err => toast.err('Something went wrong!'));
        } catch (error) {
            toast.error('Could Not Find Song');
            navigate('/search');
        }
    }, [ liked ]);

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
                        <div className="col-10 col-sm-12 col-md-5 col-lg-4 d-flex align-items-center justify-content-center">
                            <div className="col-12 d-flex flex-column justify-content-center align-items-center">
                                <div className="card gradient-custom mb-4 mb-md-0">
                                    <div className="card-body text-center">
                                        <img src={track.album.images.length === 0
                                            ? 'https://images.unsplash.com/photo-1573247374056-ba7c8c5ca4fa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80'
                                            : track.album.images[0].url}
                                             alt="avatar"
                                             className="img-fluid"/>
                                        <h5 className="item-name mt-3 mt-md-4 mt-xl-4">{track.name}
                                            {track.explicit
                                                ?
                                                <span className="material-icons green-color green-color-track">explicit</span>
                                                : ''}</h5>
                                        <p className="item-descriptor mb-sm-3 mb-lg-4">
                                            {track.artists.map(
                                                (artist, i, { length }) =>
                                                    length - 1 === i ?
                                                        <Link to={`/artist/${artist.id}`} key={i}>
                                                        <span className="item-descriptor artist-name"
                                                              key={artist.id}>{artist.name}</span>
                                                        </Link> :
                                                        <>
                                                            <Link to={`/artist/${artist.id}`}
                                                                  key={i}>
                                                            <span className="item-descriptor artist-name"
                                                                  key={artist.id}>{artist.name}</span>
                                                            </Link>
                                                            {', '}

                                                        </>)
                                            }
                                        </p>
                                        <div className="d-flex justify-content-center mb-2">
                                            {stateLoggedIn ? !liked ?
                                                    <button className="btn-hover-like color-10"
                                                            onClick={() => {
                                                                likeSongHandler();
                                                            }}>
                                                        Like
                                                    </button>
                                                    : <button className="btn-hover-like color-3"
                                                              onClick={() => {
                                                                  unlikeSongHandler();
                                                              }}>
                                                        Unlike
                                                    </button>
                                                : ''
                                            }
                                        </div>
                                    </div>

                                </div>
                                {localEmpty ? '' :
                                    <div className="card mask-custom-details mt-0 mt-sm-0 mt-md-4 mb-4 w-100 d-none d-md-block">
                                        <div className="card-body">
                                            <p className="progress-header mb-3">
                                                Recently Liked By
                                            </p>
                                            <div className="row align-items-center">
                                                <div className="col-sm-5 col-md-5 col-lg-5 col-xl-4">
                                                    <p className="mb-0 item-heading">Users:</p>
                                                </div>
                                                <div className="col-sm-7">
                                                    <p className="item-descriptor mb-0">{localTrack.likes.slice(
                                                        0, 4).map(
                                                        (user, i, { length }) =>
                                                            length - 1 === i ?
                                                                <Link to={`/profile/${user.username}`}>
                                                                    <span className="item-descriptor artist-name"
                                                                          key={i}>{user.username}</span>
                                                                </Link> :
                                                                <>
                                                                    <Link to={`/profile/${user.username}`}>
                                                                        <span className="item-descriptor artist-name"
                                                                              key={i}>{user.username}</span>
                                                                    </Link>
                                                                    {', '}

                                                                </>)
                                                    }</p>
                                                </div>
                                            </div>
                                            <hr/>
                                            <div className="row mb-0 align-items-center">
                                                <div className="col-sm-5 col-md-5 col-lg-5 col-xl-4">
                                                    <p className="mb-0 item-heading">Total
                                                                                     Likes:</p>
                                                </div>
                                                <div className="col-sm-7">
                                                    <p className="item-descriptor mb-0">{localTrack.likes.length}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                        <div className="col-10 col-sm-12 col-md-7 col-lg-8">
                            <div className="card mask-custom-details mb-4">
                                <div className="card-body">
                                    {track.album.album_type !== 'single' ?
                                        <>
                                            <Link to={`/album/${track.album.id}`}>
                                                <div className="track-list-row">
                                                    <div className="row align-items-center mb-0 px-2">
                                                        <div className="col-sm-5 col-md-4 col-xl-2">
                                                            <p className="mb-0 item-heading">{track.album.album_type.charAt(
                                                                    0).toUpperCase()
                                                                + track.album.album_type.slice(
                                                                    1)}</p>
                                                        </div>
                                                        <div className="col-sm-7 col-xl-9">
                                                            <p className="mb-0 item-descriptor">
                                                                {track.album.name}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                            <hr className="hr-mb"/>
                                        </>
                                        :
                                        <>
                                            <div className="row align-items-center">
                                                <div className="col-sm-5 col-md-4 col-xl-2">
                                                    <p className="mb-0 item-heading">{track.album.album_type.charAt(
                                                            0).toUpperCase()
                                                        + track.album.album_type.slice(
                                                            1)}</p>
                                                </div>
                                                <div className="col-sm-7 col-xl-10">
                                                    <p className="item-descriptor mb-0">{track.album.name}
                                                    </p>
                                                </div>
                                            </div>
                                            <hr/>
                                        </>
                                    }

                                    <div className="row align-items-center">
                                        <div className="col-sm-5 col-md-4 col-xl-2">
                                            <p className="mb-0 item-heading">Release Date</p>
                                        </div>
                                        <div className="col-sm-7">
                                            <p className="item-descriptor mb-0">{moment(
                                                track.album.release_date).format(
                                                'MMMM Do, YYYY')}</p>
                                        </div>
                                    </div>
                                    <hr/>
                                    <div className="row align-items-center">
                                        <div className="col-sm-5 col-md-4 col-xl-2">
                                            <p className="mb-0 item-heading">Duration</p>
                                        </div>
                                        <div className="col-sm-7 col-xl-10">
                                            <p className="item-descriptor mb-0">{
                                                moment.duration(track.duration_ms,
                                                    "milliseconds").format(
                                                    'h [hrs], m [min], ss [secs]')}
                                            </p>
                                        </div>
                                    </div>
                                    <hr/>
                                    {genres.length === 0 ? '' : <>
                                        <div className="row align-items-center">
                                            <div className="col-sm-5 col-md-4 col-xl-2">
                                                <p className="mb-0 item-heading">{genres.length > 1
                                                    ? 'Genres:' : 'Genre'}</p>
                                            </div>
                                            <div className="col-sm-7">
                                                <p className="item-descriptor mb-0">{
                                                    genres.join(' ').slice(0, -2)}</p>
                                            </div>
                                        </div>
                                        <hr/>
                                    </>}
                                    <div className="row mb-0 align-items-center">
                                        <div className="col-sm-5 col-md-4 col-xl-2">
                                            <p className="mb-0 item-heading">{'Popularity'}</p>
                                        </div>
                                        <div className="col-sm-7">
                                            <p className="item-descriptor mb-0">{track.popularity
                                                + '/100'}</p>
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
                                                    <p className="item-descriptor mb-0">{keys[analyses.track.key]}
                                                    </p>
                                                </div>
                                            </div>
                                            <hr/>
                                            <div className="row align-items-center">
                                                <div className="col-sm-5 col-md-10 col-xl-4">
                                                    <p className="mb-0 item-heading">{'BPM'}</p>
                                                </div>
                                                <div className="col-sm-7">
                                                    <p className="item-descriptor mb-0">{Math.round(
                                                        analyses.track.tempo)}</p>
                                                </div>
                                            </div>
                                            <hr/>
                                            <div className="row align-items-center">
                                                <div className="col-sm-5 col-md-10 col-xl-4">
                                                    <p className="mb-0 item-heading">Time
                                                                                     Signature</p>
                                                </div>
                                                <div className="col-sm-7">
                                                    <p className="item-descriptor mb-0">{analyses.track.time_signature
                                                        + '/4'}</p>
                                                </div>
                                            </div>
                                            <hr/>
                                            <div className="row align-items-center">
                                                <div className="col-sm-5 col-md-10 col-xl-4">
                                                    <p className="mb-0 item-heading">Loudness
                                                                                     (dB)</p>
                                                </div>
                                                <div className="col-sm-7">
                                                    <p className="item-descriptor mb-0">{analyses.track.loudness}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {localEmpty ? '' :
                                <div className="card mask-custom-details mt-0 mt-sm-0 mt-md-4 mb-4 w-100 d-block d-sm-block d-md-none">
                                    <div className="card-body">
                                        <p className="progress-header mb-3">
                                            Recently Liked By
                                        </p>
                                        <div className="row align-items-center">
                                            <div className="col-sm-5 col-md-5 col-lg-5 col-xl-4">
                                                <p className="mb-0 item-heading">Users:</p>
                                            </div>
                                            <div className="col-sm-7">
                                                <p className="item-descriptor mb-0">{localTrack.likes.slice(
                                                    0, 4).map(
                                                    (user, i, { length }) =>
                                                        length - 1 === i ?
                                                            <Link to={`/profile/${user.username}`}>
                                                                    <span className="item-descriptor artist-name"
                                                                          key={i}>{user.username}</span>
                                                            </Link> :
                                                            <>
                                                                <Link to={`/profile/${user.username}`}>
                                                                        <span className="item-descriptor artist-name"
                                                                              key={i}>{user.username}</span>
                                                                </Link>
                                                                {', '}

                                                            </>)
                                                }</p>
                                            </div>
                                        </div>
                                        <hr/>
                                        <div className="row mb-0 align-items-center">
                                            <div className="col-sm-5 col-md-5 col-lg-5 col-xl-4">
                                                <p className="mb-0 item-heading">Total
                                                                                 Likes:</p>
                                            </div>
                                            <div className="col-sm-7">
                                                <p className="item-descriptor mb-0">{localTrack.likes.length}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }
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
                    {recommended.length === 0 ? '' :
                        <div className="row d-flex align-items-center justify-content-center mt-3">
                            <div className="col-xxl-10">
                                <div className="card mask-custom-details-lighter mb-4 mb-md-0">
                                    <div className="card-body">
                                        <p className="mb-4 progress-header">
                                            Similar Tracks
                                        </p>
                                        <MDBRow className="row-cols-2 row-cols-sm-2 row-cols-md-4 row-cols-lg-4 g-4">
                                            {recommended.map && recommended.map((track, index) =>
                                                <>
                                                    <MDBCol className="align-content-center justify-content-center"
                                                            style={{ display: 'flex' }}
                                                            onClick={() => {
                                                                navigate(`/track/${track.id}`);
                                                            }}
                                                            key={index}>
                                                        <RecommendedTrackListItem key={track.id}
                                                                                  track={track}/>
                                                    </MDBCol>
                                                </>
                                            )}

                                        </MDBRow>
                                    </div>
                                </div>
                            </div>
                        </div>}
                    {/*<Radar data={analysisData} options={analysisOptions}/>;*/}
                </div>
            }
        </>

    );
};
;
;

export default Track;
