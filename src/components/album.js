import React, { useEffect, useState } from 'react';

import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Credentials } from "../Credentials";
import { useDispatch } from "react-redux";
import * as security from "../services/auth-service";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";
import { ScaleLoader } from "react-spinners";
import { css } from "@emotion/react";
import moment from "moment";
import momentDurationFormatSetup from "moment-duration-format";
import { MDBCol, MDBRow } from "mdb-react-ui-kit";
import MoreByListItem from "./partials/MoreByListItem";

const override = css`
  display: block;
  margin: 0 auto;
  border-color: #00C9B9;
`;

const Album = () => {
    const { aid } = useParams();
    const [ loggedIn, setLoggedIn ] = useState(false);
    const [ album, setAlbum ] = useState({});
    const [ moreBy, setMoreBy ] = useState({});
    const [ loading, setLoading ] = useState(true);
    const [ liked, setLiked ] = useState(false);

    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const spotify = Credentials();
    const [ token, setToken ] = useState('');

    // const notRendered = Object.keys(track).length === 0 && Object.keys(artist).length === 0
    //     && Object.keys(features).length === 0 && Object.keys(analyses).length === 0;

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
        const albumCall = await axios.get(`https://api.spotify.com/v1/albums/${aid}?market=US`,
            {
                headers: { 'Authorization': 'Bearer ' + token.data.access_token }
            });
        // console.log(albumCall.data);
        setAlbum(albumCall.data);
        const moreByCall = await axios.get(
            `https://api.spotify.com/v1/artists/${albumCall.data.artists[0].id}/albums?include_groups=album%2Csingle&market=US&limit=6`,
            { headers: { 'Authorization': 'Bearer ' + token.data.access_token } });
        // console.log(moreByCall.data.items);
        setMoreBy(moreByCall.data.items);

        const checkRecommendations = moreByCall.data.items.filter(
            (recommendation, index) => recommendation.id !== aid && recommendation.name
                !== albumCall.data.name &&
                moreByCall.data.items.findIndex(newRecommendation => {
                    return newRecommendation.name === recommendation.name;
                }) === index);
        // console.log(checkRecommendations);
        if (checkRecommendations.length !== moreByCall.data.items.length) {
            setMoreBy(checkRecommendations);
        } else {
            setMoreBy(moreByCall.data.items);
        }
        setLoading(false);

    };

    const loggedInHandler = () => {
        security.isLoggedIn(dispatch).then(r => {
            setLoggedIn(r.loggedIn);
            // console.log(r);
        });
    };

    const getLiked = () => {
        setLiked(true);
    };

    function likeAlbumHandler() {

    }

    useEffect(() =>
        loggedInHandler(), [ loggedIn, location.key ]
    );

    useEffect(() => {
        setLoading(true);
        getData().catch(error => toast.error(error));
        getLiked();
    }, [ location.key ]);

    return (
        <>
            <Helmet>
                <style>{'body {   background-image: url(\'https://images.unsplash.com/photo-1614854262318-831574f15f1f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80\') !important;\n'
                    + '  background-repeat: no-repeat !important;\n'
                    + '  background-size: cover !important;\n'
                    + '  background-color: rgba(61, 162, 195, 0.1) !important; }'}</style>
            </Helmet>
            {
                loading ?
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
                        <div className="row d-flex justify-content-center">
                            <div className="col-12 col-sm-12 col-md-5 col-lg-4 d-flex flex-column align-items-center">
                                <div className="col-10 col-md-12 card gradient-custom mb-4 mb-md-0">
                                    <div className="card-body text-center">
                                        <img src={album.images.length === 0
                                            ? 'https://images.unsplash.com/photo-1573247374056-ba7c8c5ca4fa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80'
                                            : album.images[0].url}
                                             alt="avatar"
                                             className="img-fluid"/>
                                        <h5 className="item-name mt-3 mt-md-4 mt-xl-4">{album.name}
                                            {/*{album.explicit*/}
                                            {/*    ?*/}
                                            {/*    <span className="material-icons green-color green-color-track">explicit</span>*/}
                                            {/*    : ''}*/}
                                        </h5>
                                        <p className="item-descriptor mb-sm-3 mb-lg-4">
                                            {album.artists.map(
                                                (artist, i, { length }) =>
                                                    length - 1 === i ?
                                                        <Link to={`/artist/${artist.id}`}>
                                                            <span className="item-descriptor artist-name">{artist.name}</span>
                                                        </Link> :
                                                        <>
                                                            <Link to={`/artist/${artist.id}`}>
                                                                <span className="item-descriptor artist-name">{artist.name}</span>
                                                            </Link>
                                                            {', '}

                                                        </>)
                                            }
                                        </p>

                                        <div className="d-flex justify-content-center mb-2">
                                            {loggedIn ? !liked ?
                                                    <button className="btn-hover-like color-10"
                                                            onClick={() => {
                                                                likeAlbumHandler();
                                                            }}>
                                                        Like
                                                    </button>
                                                    : <button className="btn-hover-like color-3"
                                                              onClick={() => {
                                                                  likeAlbumHandler();
                                                              }}>
                                                        Unlike
                                                    </button>
                                                : ''
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className="card mask-custom-details mt-0 mt-sm-0 mt-md-4 mb-4 w-100">
                                    <div className="card-body">
                                        <p className="progress-header mb-3">
                                            Album Details
                                        </p>
                                        <div className="row align-items-center">
                                            <div className="col-sm-5 col-md-5 col-lg-5 col-xl-4">
                                                <p className="mb-0 item-heading">Release Date</p>
                                            </div>
                                            <div className="col-sm-7">
                                                <p className="item-descriptor mb-0">{moment(
                                                    album.release_date).format(
                                                    'MMMM Do, YYYY')}</p>
                                            </div>
                                        </div>
                                        <hr/>
                                        <div className="row align-items-center">
                                            <div className="col-sm-5 col-md-5 col-lg-5 col-xl-4">
                                                <p className="mb-0 item-heading">Tracks</p>
                                            </div>
                                            <div className="col-sm-7">
                                                <p className="item-descriptor mb-0">{album.total_tracks}</p>
                                            </div>
                                        </div>
                                        <hr/>
                                        <div className="row mb-0 align-items-center">
                                            <div className="col-sm-5 col-md-5 col-lg-5 col-xl-4">
                                                <p className="mb-0 item-heading">Popularity</p>
                                            </div>
                                            <div className="col-sm-7">
                                                <p className="item-descriptor mb-0">{album.popularity
                                                    + '/100'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-sm-12 col-md-7 col-lg-8 d-flex flex-column align-items-center">
                                <div className="card mask-custom-details mb-4 w-100">
                                    <div className="card-body">
                                        <p className="mb-2 progress-header">
                                            Track List
                                        </p>
                                        <div className="row align-items-center mb-0 px-2">
                                            <div className="col-1">
                                                <p className="mb-0 item-heading">#</p>
                                            </div>
                                            <div className="col-7 col-sm-8 col-md-8 col-xl-9">
                                                <p className="mb-0 item-heading">
                                                    Title
                                                </p>
                                            </div>
                                            <div className="col-4 col-sm-3 col-md-3 col-xl-2">
                                                <p className="mb-0 item-heading duration ms-auto">
                                                    Duration
                                                </p>
                                            </div>
                                        </div>
                                        <hr className="less-mt"/>

                                        {album.tracks.items && (album.total_tracks < 16)
                                            ? album.tracks.items.map(
                                                (track, i, { length }) =>
                                                    length - 1 === i ?
                                                        <>
                                                            <Link to={`/track/${track.id}`}>
                                                                <div className="track-list-row-last">
                                                                    <div className="row align-items-center mb-0 px-2">
                                                                        <div className="col-2 col-sm-2 col-md-2 col-lg-2 col-xl-1">
                                                                            <p className="mb-0 item-descriptor">{track.track_number}</p>
                                                                        </div>
                                                                        <div className="col-7 col-sm-8 col-md-8 col-lg-8 col-xl-9">
                                                                            <p className="mb-0 item-descriptor">
                                                                                {track.name}
                                                                            </p>
                                                                        </div>
                                                                        <div className="d-flex col-3 col-sm-2 col-md-2 col-lg-2 col-xl-2">
                                                                            <p className="mb-0 item-descriptor duration ms-auto">{
                                                                                track.duration_ms
                                                                                < 3600000 ?
                                                                                    moment.duration(
                                                                                        track.duration_ms,
                                                                                        "milliseconds").format(
                                                                                        'm:ss', {
                                                                                            trim: false
                                                                                        }) :
                                                                                    moment.duration(
                                                                                        track.duration_ms,
                                                                                        "milliseconds").format(
                                                                                        'h:m:ss', {
                                                                                            trim: false
                                                                                        })}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </Link>
                                                        </>
                                                        :
                                                        <>
                                                            <Link to={`/track/${track.id}`}>
                                                                <div className="track-list-row">
                                                                    <div className="row align-items-center mb-0 px-2">
                                                                        <div className="col-2 col-sm-2 col-md-2 col-xl-1">
                                                                            <p className="mb-0 item-descriptor">{track.track_number}</p>
                                                                        </div>
                                                                        <div className="col-7 col-sm-8 col-md-8 col-xl-9">
                                                                            <p className="mb-0 item-descriptor">
                                                                                {track.name}
                                                                            </p>
                                                                        </div>
                                                                        <div className="col-3 col-sm-2 col-xl-2">
                                                                            <p className="mb-0 item-descriptor duration ms-auto">{
                                                                                track.duration_ms
                                                                                < 3600000 ?
                                                                                    moment.duration(
                                                                                        track.duration_ms,
                                                                                        "milliseconds").format(
                                                                                        'm:ss', {
                                                                                            trim: false
                                                                                        }) :
                                                                                    moment.duration(
                                                                                        track.duration_ms,
                                                                                        "milliseconds").format(
                                                                                        'h:m:ss', {
                                                                                            trim: false
                                                                                        })}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </Link>
                                                            <hr className="hr-no-margin"/>
                                                        </>)
                                            :
                                            album.tracks.items.map(
                                                (track, i, { length }) =>
                                                    length - 1 === i ?
                                                        <>
                                                            <Link to={`/track/${track.id}`}>
                                                                <div className="track-list-row-last track-list-row-long-last">
                                                                    <div className="row align-items-center mb-0 px-2">
                                                                        <div className="col-2 col-sm-2 col-md-2 col-lg-2 col-xl-1">
                                                                            <p className="mb-0 item-descriptor">{track.track_number}</p>
                                                                        </div>
                                                                        <div className="col-7 col-sm-8 col-md-8 col-lg-8 col-xl-9">
                                                                            <p className="mb-0 item-descriptor">
                                                                                {track.name}
                                                                            </p>
                                                                        </div>
                                                                        <div className="d-flex col-3 col-sm-2 col-md-2 col-lg-2 col-xl-2">
                                                                            <p className="mb-0 item-descriptor duration ms-auto">{
                                                                                track.duration_ms
                                                                                < 3600000 ?
                                                                                    moment.duration(
                                                                                        track.duration_ms,
                                                                                        "milliseconds").format(
                                                                                        'm:ss', {
                                                                                            trim: false
                                                                                        }) :
                                                                                    moment.duration(
                                                                                        track.duration_ms,
                                                                                        "milliseconds").format(
                                                                                        'h:m:ss', {
                                                                                            trim: false
                                                                                        })}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </Link>
                                                        </>
                                                        :
                                                        <>
                                                            <Link to={`/track/${track.id}`}>
                                                                <div className="track-list-row track-list-row-long">
                                                                    <div className="row align-items-center mb-0 px-2">
                                                                        <div className="col-2 col-sm-2 col-md-2 col-xl-1">
                                                                            <p className="mb-0 item-descriptor">{track.track_number}</p>
                                                                        </div>
                                                                        <div className="col-7 col-sm-8 col-md-8 col-xl-9">
                                                                            <p className="mb-0 item-descriptor">
                                                                                {track.name}
                                                                            </p>
                                                                        </div>
                                                                        <div className="col-3 col-sm-2 col-xl-2">
                                                                            <p className="mb-0 item-descriptor duration ms-auto">{track.duration_ms
                                                                            < 3600000 ?
                                                                                moment.duration(
                                                                                    track.duration_ms,
                                                                                    "milliseconds").format(
                                                                                    'm:ss', {
                                                                                        trim: false
                                                                                    }) :
                                                                                moment.duration(
                                                                                    track.duration_ms,
                                                                                    "milliseconds").format(
                                                                                    'h:m:ss', {
                                                                                        trim: false
                                                                                    })
                                                                            }
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </Link>
                                                            <hr className="hr-no-margin"/>


                                                        </>
                                            )}


                                    </div>
                                </div>
                            </div>
                        </div>
                        {moreBy.length >= 4 ?
                            <div className="row d-flex align-items-center justify-content-center mt-3">
                                <div className="col-xxl-10">
                                    <div className="card mask-custom-details-lighter mb-4 mb-md-0">
                                        <div className="card-body">
                                            <p className="mb-4 progress-header">
                                                More By {album.artists[0].name}
                                            </p>
                                            <MDBRow className="row-cols-2 row-cols-sm-2 row-cols-md-2 row-cols-lg-4 g-4">
                                                {moreBy.map && moreBy.slice(0, 4).map(
                                                    recommendation =>
                                                        <>
                                                            <MDBCol className="align-content-center justify-content-center"
                                                                    style={{ display: 'flex' }}
                                                                    onClick={async () => {
                                                                        if (recommendation.album_group
                                                                            === 'single') {
                                                                            setLoading(true);
                                                                            const token = await axios(
                                                                                'https://accounts.spotify.com/api/token',
                                                                                {
                                                                                    headers: {
                                                                                        'Content-Type': 'application/x-www-form-urlencoded',
                                                                                        'Authorization': 'Basic '
                                                                                            + btoa(
                                                                                                spotify.ClientId
                                                                                                + ':'
                                                                                                + spotify.ClientSecret)
                                                                                    },
                                                                                    data: 'grant_type=client_credentials',
                                                                                    method: 'POST'
                                                                                });
                                                                            const newAlbum = await axios.get(
                                                                                `https://api.spotify.com/v1/albums/${recommendation.id}?market=US`,
                                                                                {
                                                                                    headers: {
                                                                                        'Authorization': 'Bearer '
                                                                                            + token.data.access_token
                                                                                    }
                                                                                });
                                                                            console.log(
                                                                                newAlbum.data);
                                                                            navigate(
                                                                                `/track/${newAlbum.data.tracks.items[0].id}`);
                                                                            window.scrollTo(0, 0);
                                                                        } else {
                                                                            navigate(
                                                                                `/album/${recommendation.id}`);
                                                                            window.scrollTo(0, 0);
                                                                        }
                                                                    }}>
                                                                <MoreByListItem key={recommendation.id}
                                                                                track={recommendation}/>
                                                            </MDBCol>
                                                        </>
                                                )}

                                            </MDBRow>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            : moreBy.length === 3 ?
                                <div className="row d-flex align-items-center justify-content-center mt-3">
                                    <div className="col-9 col-sm-9 col-md-12 col-lg-9">
                                        <div className="card mask-custom-details-lighter mb-4 mb-md-0">
                                            <div className="card-body">
                                                <p className="mb-4 progress-header">
                                                    More By {album.artists[0].name}
                                                </p>
                                                <MDBRow className="row-cols-1 row-cols-sm-1 row-cols-md-3 row-cols-lg-3 g-4">
                                                    {moreBy.map && moreBy.map(recommendation =>
                                                        <>
                                                            <div className="align-items-center justify-content-center">
                                                                <MDBCol className="align-content-center justify-content-center"
                                                                        style={{ display: 'flex' }}
                                                                        onClick={async () => {
                                                                            if (recommendation.album_group
                                                                                === 'single') {
                                                                                setLoading(true);
                                                                                const token = await axios(
                                                                                    'https://accounts.spotify.com/api/token',
                                                                                    {
                                                                                        headers: {
                                                                                            'Content-Type': 'application/x-www-form-urlencoded',
                                                                                            'Authorization': 'Basic '
                                                                                                + btoa(
                                                                                                    spotify.ClientId
                                                                                                    + ':'
                                                                                                    + spotify.ClientSecret)
                                                                                        },
                                                                                        data: 'grant_type=client_credentials',
                                                                                        method: 'POST'
                                                                                    });
                                                                                const newAlbum = await axios.get(
                                                                                    `https://api.spotify.com/v1/albums/${recommendation.id}?market=US`,
                                                                                    {
                                                                                        headers: {
                                                                                            'Authorization': 'Bearer '
                                                                                                + token.data.access_token
                                                                                        }
                                                                                    });
                                                                                console.log(
                                                                                    newAlbum.data);
                                                                                navigate(
                                                                                    `/track/${newAlbum.data.tracks.items[0].id}`);
                                                                                window.scrollTo(0,
                                                                                    0);
                                                                            } else {
                                                                                navigate(
                                                                                    `/album/${recommendation.id}`);
                                                                                window.scrollTo(0,
                                                                                    0);
                                                                            }
                                                                        }}>
                                                                    <MoreByListItem key={recommendation.id}
                                                                                    track={recommendation}/>
                                                                </MDBCol>
                                                            </div>
                                                        </>
                                                    )}

                                                </MDBRow>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                : moreBy.length === 2 ?
                                    <div className="row d-flex align-items-center justify-content-center mt-3">
                                        <div className="col-md-7 col-xxl-6">
                                            <div className="card mask-custom-details-lighter mb-4 mb-md-0">
                                                <div className="card-body">
                                                    <p className="mb-4 progress-header">
                                                        More By {album.artists[0].name}
                                                    </p>
                                                    <MDBRow className="row-cols-2 row-cols-sm-2 row-cols-md-2 row-cols-lg-2 g-4">
                                                        {moreBy.map && moreBy.map(recommendation =>
                                                            <>
                                                                <MDBCol className="align-content-center justify-content-center"
                                                                        style={{
                                                                            display: 'flex'
                                                                        }}
                                                                        onClick={async () => {
                                                                            if (recommendation.album_group
                                                                                === 'single') {
                                                                                setLoading(true);
                                                                                const token = await axios(
                                                                                    'https://accounts.spotify.com/api/token',
                                                                                    {
                                                                                        headers: {
                                                                                            'Content-Type': 'application/x-www-form-urlencoded',
                                                                                            'Authorization': 'Basic '
                                                                                                + btoa(
                                                                                                    spotify.ClientId
                                                                                                    + ':'
                                                                                                    + spotify.ClientSecret)
                                                                                        },
                                                                                        data: 'grant_type=client_credentials',
                                                                                        method: 'POST'
                                                                                    });
                                                                                const newAlbum = await axios.get(
                                                                                    `https://api.spotify.com/v1/albums/${recommendation.id}?market=US`,
                                                                                    {
                                                                                        headers: {
                                                                                            'Authorization': 'Bearer '
                                                                                                + token.data.access_token
                                                                                        }
                                                                                    });
                                                                                console.log(
                                                                                    newAlbum.data);
                                                                                navigate(
                                                                                    `/track/${newAlbum.data.tracks.items[0].id}`);
                                                                                window.scrollTo(0,
                                                                                    0);
                                                                            } else {
                                                                                navigate(
                                                                                    `/album/${recommendation.id}`);
                                                                                window.scrollTo(0,
                                                                                    0);
                                                                            }
                                                                        }}>
                                                                    <MoreByListItem key={recommendation.id}
                                                                                    track={recommendation}/>
                                                                </MDBCol>
                                                            </>
                                                        )}

                                                    </MDBRow>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    :
                                    <>

                                    </>

                        }
                    </div>
            }
        </>

    );
};

export default Album;
