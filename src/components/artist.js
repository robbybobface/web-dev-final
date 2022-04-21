import React, { useContext, useEffect, useMemo, useState } from 'react';

import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Credentials } from "../Credentials";
import { Helmet } from "react-helmet";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { ScaleLoader } from "react-spinners";
import { css } from "@emotion/react";
import { MDBCol, MDBRadio, MDBRow } from "mdb-react-ui-kit";
import MoreByListItem from "./partials/MoreByListItem";
import ArtistListItem from "./partials/ArtistListItem";
import AlbumListItem from "./partials/AlbumListItem";
import PopularSongListItem from "./partials/PopularSongList";
import { UserContext } from "../Utils/UserContext";
import * as service from "../services/user-service";
import * as artistService from "../services/artist-service";

const override = css`
  display: block;
  margin: 0 auto;
  border-color: #00C9B9;
`;

const Artist = () => {
    const { aid } = useParams();
    const { user, loggedIn } = useContext(UserContext);
    const [ stateUser, setStateUser ] = user;
    const [ loading, setLoading ] = useState(true);
    const [ artist, setArtist ] = useState({});
    const [ localArtist, setLocalArtist ] = useState({});
    const [ localEmpty, setLocalEmpty ] = useState(true);
    const [ stateLoggedIn, setStateLoggedIn ] = loggedIn;
    const [ tracks, setTracks ] = useState({});
    const [ discography, setDiscography ] = useState({});
    const [ similar, setSimilar ] = useState({});

    const [ albumSearch, setAlbumSearch ] = useState(true);
    const [ singleSearch, setSingleSearch ] = useState(false);

    const [ liked, setLiked ] = useState(false);

    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

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
        const artistCall = await axios.get(`https://api.spotify.com/v1/artists/${aid}`,
            {
                headers: { 'Authorization': 'Bearer ' + token.data.access_token }
            }).catch((error) => {
            throw "Could not find artist";
        });
        // console.log(artistCall.data);
        setArtist(artistCall.data);
        const tracksCall = await axios.get(
            `https://api.spotify.com/v1/artists/${aid}/top-tracks?market=US`, {
                headers: { 'Authorization': 'Bearer ' + token.data.access_token }
            });
        // console.log(tracksCall.data.tracks);
        setTracks(tracksCall.data.tracks);
        const albumsCall = await axios.get(
            `https://api.spotify.com/v1/artists/${aid}/albums?include_groups=album%2Csingle%2Cappears_on&market=US&limit=50`,
            {
                headers: { 'Authorization': 'Bearer ' + token.data.access_token }
            });
        const checkAlbums = albumsCall.data.items.filter(
            (recommendation, index) => recommendation.id !== aid && recommendation.name
                !== albumsCall.data.name &&
                albumsCall.data.items.findIndex(newRecommendation => {
                    return newRecommendation.name === recommendation.name;
                }) === index);
        // console.log(checkAlbums);
        if (checkAlbums.length !== albumsCall.data.items.length) {
            setDiscography(checkAlbums);
            console.log(checkAlbums);
        } else {
            setDiscography(albumsCall.data.items);
            console.log(albumsCall.data.items);
        }

        const similarCall = await axios.get(
            `https://api.spotify.com/v1/artists/${aid}/related-artists`, {
                headers: { 'Authorization': 'Bearer ' + token.data.access_token }
            });
        // console.log(similarCall.data.artists);
        setSimilar(similarCall.data.artists);
        setLoading(false);
    };

    const getLocal = async () => {
        const localCall = await artistService.findArtistById(aid);
        console.log(localCall);
        if (localCall.error) {
            return;
        }
        setLocalArtist(localCall);
        console.log(localArtist);
    };

    const getLiked = () => {
        if (stateUser.likedArtists.length === 0) {
            return;
        }
        stateUser.likedArtists.map(artist => {
            if (artist.artistId === aid) {
                setLiked(true);
                setLocalEmpty(false);
            }
        });
    };

    const likeArtistHandler = async () => {
        // console.log(aid);
        const originalArtists = stateUser.likedArtists;
        // console.log(originalArtists);
        service.updateUser(
            { ...stateUser, likedArtists: [ { artistId: aid }, ...originalArtists ] })
            .catch(error => toast.error('something went wrong'));
        toast.success('Artist added to liked artists!');
        const foundArtist = await artistService.findArtistById(aid);
        console.log(foundArtist);
        if (foundArtist.error) {
            console.log('we got here');
            // console.log(artist);
            const createdArtist = await artistService.createArtist({
                name: artist.name,
                artistId: artist.id,
                likes: [ stateUser ]
            }).catch(err => toast.error(err));
            setLocalArtist(createdArtist);
            setLocalEmpty(false);
            setLiked(true);
        } else {
            console.log('how are we here');
            const updatedArtist = await artistService.updateArtist(
                {
                    ...foundArtist,
                    likes: [ stateUser, ...foundArtist.likes ]
                }).catch(
                err => toast.error(err));
            console.log(updatedArtist);
            setLocalArtist(updatedArtist);
            setLocalEmpty(false);
            setLiked(true);
        }
    };

    const unlikeArtistHandler = async () => {
        const newArtists = stateUser.likedArtists.filter((artist) => artist.artistId !== aid);
        console.log(newArtists);
        if (newArtists.length === 0) {
            service.updateUser(
                { ...stateUser, likedArtists: [] })
                .catch(error => toast.error('something went wrong'));
            setLiked(false);
            toast.success('Artist removed from liked artists!');

        } else {
            service.updateUser(
                { ...stateUser, likedSongs: [ ...newArtists ] })
                .catch(error => toast.error('something went wrong'));
            setLiked(false);
            toast.success('Artist removed from liked artists!');
        }

        const foundArtist = await artistService.findArtistById(aid);
        console.log(foundArtist);
        const newUsers = foundArtist.likes.filter(
            (user) => user.username !== stateUser.username);
        if (newUsers.length === 0) {
            const deletedArtist = await artistService.deleteArtist(foundArtist).catch(
                err => toast.error(err));
            setLocalEmpty(true);
            setLiked(false);
        } else {
            const updatedArtist = await artistService.updateArtist(
                { ...foundArtist, likes: [ ...newUsers ] }).catch(
                err => toast.error(err));
            setLocalArtist(updatedArtist);
            setLocalEmpty(false);
            setLiked(true);
        }
    };

    const singleHandler = () => {
        setSingleSearch(true);
        setAlbumSearch(false);
    };

    const albumHandler = () => {
        setAlbumSearch(true);
        setSingleSearch(false);
    };

    useMemo(() => {
        window.scrollTo(0, 0);
        setLoading(true);
        try {
            getData();
        } catch (error) {
            toast.error('Could Not Find Artist');
            navigate('/search');
        }
    }, [ location.key ]);

    useEffect(() => {
        try {
            getLiked();
            console.log(localArtist);
        } catch (error) {
            toast.error('Could Not Find Artist');
            navigate('/search');
        }
    }, [ location.key ]);

    useMemo(() => {
        try {
            getLocal().catch(err => toast.err('Something went wrong!'));
        } catch (error) {
            toast.error('Could Not Find Artist');
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
                        </div>
                    </>
                    :
                    <>
                        <div className="container py-3">
                            <div className="row d-flex justify-content-center">
                                <div className="col-12 col-sm-12 col-md-5 col-lg-4 d-flex flex-column align-items-center">
                                    <div className="col-10 col-md-12 card gradient-custom mb-4 mb-md-0">
                                        <div className="card-body text-center">
                                            <img src={artist.images.length === 0 ?
                                                'https://images.unsplash.com/photo-1488109811119-98431feb6929?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80'
                                                : artist.images[0].url}
                                                 alt="avatar"
                                                 className="img-fluid"
                                                 style={{
                                                     aspectRatio: '1/1',
                                                     objectFit: 'cover'
                                                 }}/>
                                            <h5 className="item-name mt-3 mt-md-4 mt-xl-4">
                                                {artist.name}
                                            </h5>
                                            <p className="item-descriptor mb-1">
                                                <span className="genres">{artist.genres.length > 1
                                                    ? 'Genres: ' : 'Genre: '}</span>
                                                <span className="follower-count">{artist.genres.map(
                                                    (genre) => {
                                                        if (genre.includes(' ')) {
                                                            const newGenre = genre.split(' ');
                                                            const finalGenre = newGenre.map(
                                                                word => word.charAt(0).toUpperCase()
                                                                    + word.slice(
                                                                        1));
                                                            return finalGenre.join(' ').concat(
                                                                ', ');
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
                                                ).join(' ').slice(0, -2)
                                                }</span>
                                            </p>
                                            <p className="item-descriptor mb-1">
                                                <span className="genres">Followers: </span>
                                                <span className="follower-count">{artist.followers.total.toString().replace(
                                                    /\B(?=(\d{3})+(?!\d))/g, ',')}</span>
                                            </p>
                                            <p className="item-descriptor mb-sm-3 mb-lg-4">
                                                <span className="genres">Popularity: </span>
                                                <span className="follower-count">{artist.popularity}</span>
                                            </p>

                                            <div className="d-flex justify-content-center mb-2">
                                                {stateLoggedIn ? !liked ?
                                                        <button className="btn-hover-like color-10"
                                                                onClick={() => {
                                                                    likeArtistHandler();
                                                                }}>
                                                            Like
                                                        </button>
                                                        : <button className="btn-hover-like color-3"
                                                                  onClick={() => {
                                                                      unlikeArtistHandler();
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
                                                        <p className="item-descriptor mb-0">{localArtist.likes.slice(
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
                                                        <p className="item-descriptor mb-0">{localArtist.likes.length}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                </div>
                                <div className="col-12 col-sm-12 col-md-7 col-lg-8 d-flex flex-column align-items-center">
                                    <div className="card mask-custom-details mt-0 mt-sm-0 mt-md-0 mt-lg-0 mb-4 w-100">
                                        <div className="card-body">
                                            <p className="progress-header mb-3">
                                                Popular Tracks
                                            </p>

                                            {tracks && tracks.map(
                                                (track, i, { length }) => length - 1 === i ?
                                                    <>
                                                        <Link to={`/track/${track.id}`}>
                                                            <div className="track-list-row-last">
                                                                <PopularSongListItem key={track.id}
                                                                                     track={track}
                                                                                     index={i}/>
                                                            </div>
                                                        </Link>
                                                    </> :
                                                    <>
                                                        <Link to={`/track/${track.id}`}>
                                                            <div className="track-list-row">
                                                                <PopularSongListItem key={track.id}
                                                                                     track={track}
                                                                                     index={i}/>
                                                            </div>
                                                        </Link>
                                                        <hr className="hr-no-margin"
                                                            key={i * 20}/>
                                                    </>
                                            )}
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
                                                        <p className="item-descriptor mb-0">{localArtist.likes.slice(
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
                                                        <p className="item-descriptor mb-0">{localArtist.likes.length}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>
                            {discography.filter(
                                recommendation =>
                                    recommendation.album_group
                                    === 'album').length > 0 && discography.filter(
                                recommendation =>
                                    recommendation.album_group
                                    === 'single').length > 0 ?
                                <div className="row d-flex mt-lg-4 justify-content-center">
                                    <div className="col-xxl-10">
                                        <div className="card mask-custom-details-lighter mb-4 mb-md-0">
                                            <div className="card-body">
                                                <p className="mb-4 progress-header">
                                                    Discography
                                                </p>
                                                <div className="row d-flex mt-2 my-4">
                                                    <div className="col-6">
                                                        <div className="category-toggle align-items-center justify-content-start">
                                                            <MDBRadio name="inlineRadio"
                                                                      className="custom-radio"
                                                                      id="inlineRadio1"
                                                                      value="option1"
                                                                      label="Albums"
                                                                      defaultChecked
                                                                      inline
                                                                      onClick={albumHandler}/>
                                                            <MDBRadio name="inlineRadio"
                                                                      className="custom-radio"
                                                                      id="inlineRadio2"
                                                                      value="option2"
                                                                      label="Tracks and EPs"
                                                                      inline
                                                                      onClick={singleHandler}/>
                                                        </div>
                                                    </div>
                                                    <div className="col-6 justify-content-end text-end">
                                                        <div className="view-all-btn align-items-center justify-content-end">
                                                            {albumSearch && discography.filter(
                                                                recommendation =>
                                                                    recommendation.album_group
                                                                    === 'album').length > 4 ?
                                                                <Link to={`/albums/${aid}`}>
                                                                    <span className="view-all">View All</span>
                                                                </Link>
                                                                : ''}
                                                            {singleSearch && discography.filter(
                                                                recommendation =>
                                                                    recommendation.album_group
                                                                    === 'single').length > 4
                                                                ? <Link to={`/tracks/${aid}`}>
                                                                    <span className="view-all">View All</span>
                                                                </Link>
                                                                : ''}
                                                        </div>
                                                    </div>
                                                </div>
                                                <MDBRow className="row-cols-2 row-cols-sm-2 row-cols-md-4 row-cols-lg-4 g-4">
                                                    {discography && albumSearch
                                                        && discography.filter(
                                                            recommendation =>
                                                                recommendation.album_group
                                                                === 'album').map(
                                                            (recommendation, index) =>
                                                                <>
                                                                    <MDBCol className="align-content-center justify-content-center"
                                                                            style={{ display: 'flex' }}
                                                                            onClick={async () => {
                                                                                if (recommendation.album_group
                                                                                    === 'album') {
                                                                                    navigate(
                                                                                        `/album/${recommendation.id}`);
                                                                                    window.scrollTo(
                                                                                        0,
                                                                                        0);
                                                                                }
                                                                            }}
                                                                            key={index}>
                                                                        <MoreByListItem key={recommendation.id}
                                                                                        track={recommendation}/>
                                                                    </MDBCol>
                                                                </>).slice(0, 4)}

                                                    {discography && singleSearch
                                                        ? discography.filter(
                                                            recommendation =>
                                                                recommendation.album_group
                                                                === 'single').map(
                                                            (recommendation, index) =>
                                                                <>
                                                                    <MDBCol className="align-content-center justify-content-center"
                                                                            style={{ display: 'flex' }}
                                                                            onClick={async () => {
                                                                                if (recommendation.album_group
                                                                                    === 'single') {
                                                                                    setLoading(
                                                                                        true);
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
                                                                                    window.scrollTo(
                                                                                        0,
                                                                                        0);
                                                                                }
                                                                            }}
                                                                            key={index}>
                                                                        <MoreByListItem key={recommendation.id}
                                                                                        track={recommendation}/>
                                                                    </MDBCol>
                                                                </>
                                                        ).slice(0, 4) : ''}
                                                </MDBRow>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                :
                                ''
                            }
                            {similar.length === 0 ? '' :
                                <div className="row d-flex align-items-center justify-content-center mt-3">
                                    <div className="col-xxl-10">
                                        <div className="card mask-custom-details-lighter mb-4 mb-md-0">
                                            <div className="card-body">
                                                <p className="mb-4 progress-header">
                                                    Similar Artists
                                                </p>
                                                <MDBRow className="row-cols-2 row-cols-sm-2 row-cols-md-4 row-cols-lg-4 g-4">
                                                    {similar.map && similar.map((artist, index) =>
                                                        <>
                                                            <MDBCol className="align-content-center justify-content-center"
                                                                    style={{ display: 'flex' }}
                                                                    onClick={() => {
                                                                        navigate(
                                                                            `/artist/${artist.id}`);
                                                                        window.scrollTo(0, 0);
                                                                    }}
                                                                    key={index}>
                                                                <ArtistListItem key={artist.id}
                                                                                artist={artist}/>
                                                            </MDBCol>
                                                        </>
                                                    ).slice(0, 8)}

                                                </MDBRow>
                                            </div>
                                        </div>
                                    </div>
                                </div>}
                            {discography.filter(item => item.album_group
                                === 'appears_on').length === 0 ? '' :
                                <div className="row d-flex align-items-center justify-content-center mt-3">
                                    <div className="col-xxl-10">
                                        <div className="card mask-custom-details-lighter mb-4 mb-md-0">
                                            <div className="card-body">
                                                <p className="mb-4 progress-header">
                                                    Appears On
                                                </p>
                                                <MDBRow className="row-cols-2 row-cols-sm-2 row-cols-md-4 row-cols-lg-4 g-4">
                                                    {discography.map && discography.filter(
                                                        item => item.album_group
                                                            === 'appears_on').map((album, index) =>
                                                        <>
                                                            <MDBCol className="align-content-center justify-content-center"
                                                                    style={{ display: 'flex' }}
                                                                    onClick={() => {
                                                                        navigate(
                                                                            `/album/${album.id}`);
                                                                        window.scrollTo(0, 0);
                                                                    }}
                                                                    key={index}>
                                                                <AlbumListItem key={album.id}
                                                                               album={album}/>
                                                            </MDBCol>
                                                        </>
                                                    ).slice(0, 8)}

                                                </MDBRow>
                                            </div>
                                        </div>
                                    </div>
                                </div>}
                        </div>
                    </>
            }
        </>
    );
};

export default Artist;
