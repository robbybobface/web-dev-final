import React, { useContext, useEffect, useMemo, useState } from 'react';

import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import * as security from "../services/auth-service";
import { useDispatch } from "react-redux";
import { UserContext } from "../Utils/UserContext";
import { Helmet } from "react-helmet";
import { ScaleLoader } from "react-spinners";
import moment from "moment";
import * as userService from '../services/user-service';
import { toast } from "react-toastify";
import { MDBCol, MDBInput, MDBRow } from "mdb-react-ui-kit";
import * as service from "../services/profile-service";
import axios from "axios";
import { Credentials } from "../Credentials";
import { css } from "@emotion/react";
import RecommendedTrackListItem from "./partials/RecommendedTrackListItem";
import MoreByListItem from "./partials/MoreByListItem";
import LikedArtistListItem from "./partials/LikedArtistListItem";

const override = css`
  display: block;
  margin: 0 auto;
  border-color: #00C9B9;
`;

const Profile = () => {
        const { username } = useParams();
        const { user, loggedIn } = useContext(UserContext);
        const [ stateUser, setStateUser ] = user;
        const [ stateLoggedIn, setStateLoggedIn ] = loggedIn;
        const [ isAccountOwner, setIsAccountOwner ] = useState(false);

        const [ localUser, setLocalUser ] = useState({});

        const [ newEmail, setNewEmail ] = useState(stateUser.email);
        const [ newUsername, setNewUsername ] = useState(stateUser.username);
        const [ newBio, setNewBio ] = useState(stateUser.bio);
        const [ editProfile, setEditProfile ] = useState(false);
        const [ favTracksStr, setFavTracksStr ] = useState('');
        const [ favAlbumsStr, setFavAlbumsStr ] = useState('');
        const [ favArtistsStr, setFavArtistsStr ] = useState('');
        const [ favTracks, setFavTracks ] = useState('');
        const [ favAlbums, setFavAlbums ] = useState('');
        const [ favArtists, setFavArtists ] = useState('');

        // this must be changed
        const [ loading, setLoading ] = useState(true);

        const spotify = Credentials();
        const [ token, setToken ] = useState('');

        const [ usernameObj, setUsernameObj ] = useState({ username: username });
        const dispatch = useDispatch();
        const location = useLocation();
        const navigate = useNavigate();

        const isAccountOwnerHandler = () => {
            // console.log(usernameObj);
            security.isAccountOwner(usernameObj).then(r => {
                // console.log(r);
                setIsAccountOwner(r.accountOwner);
            });
        };

        const getUser = async () => {
            const userCall = await userService.findUserByUsername(username).catch(
                (error) => {
                    //
                });
            if (userCall.error) {
                throw "No User with this username found!";
            } else {
                // console.log(userCall);
                setLocalUser(userCall);
            }

        };

        const saveProfileHandler = async () => {
            // const usernameCall = await userService.findUserByUsername(newUsername);
            const emailCall = await userService.findUserByEmail(newEmail);
            // if (!usernameCall.error && stateUser.username !== newUsername) {
            //     toast.error('This username is already taken');
            if (!emailCall.error && stateUser.email !== newEmail) {
                toast.error('This email is already taken');
            } else {
                // console.log('am i getting here');
                const updatedUser = await userService.updateUser({
                    ...stateUser,
                    email: newEmail,
                    bio: newBio
                }).catch(error => toast.error('Something went wrong'));
                // await security.login({
                //     ...stateUser,
                //     email: newEmail,
                //     username: newUsername
                // }).catch(error => toast.error('Failed to relogin'));
                // await service.profile().then(r => {
                //     setStateUser(r);
                //     // console.log(r);
                // });
                // navigate(`/profile/${newUsername}`);
                // console.log(stateUser);
                setEditProfile(false);
            }
        };

        const getData = async () => {
            const userCall = await userService.findUserByUsername(username).catch();
            if (userCall.error) {
                return;
            } else {
                setLocalUser(userCall);
                setNewBio(userCall.bio);
                setNewEmail(userCall.email);
            }

            // console.log(userCall);

            // console.log(usernameObj);
            // const accountOwner = await security.isAccountOwner(usernameObj).then(r => {
            //     // console.log(r);
            //     setIsAccountOwner(r.accountOwner);
            //     console.log(r.accountOwner);
            // });

            const localFavTracks = userCall.likedSongs.map(song => song.songId).join(',');
            const localFavAlbums = userCall.likedAlbums.map(album => album.albumId).join(',');
            const localFavArtists = userCall.likedArtists.map(artist => artist.artistId).join(',');
            setFavTracksStr(localFavTracks);
            setFavAlbumsStr(localFavAlbums);
            setFavArtistsStr(localFavArtists);

            const token = await axios('https://accounts.spotify.com/api/token', {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Basic ' + btoa(spotify.ClientId + ':' + spotify.ClientSecret)
                },
                data: 'grant_type=client_credentials',
                method: 'POST'
            });
            setToken(token.data.access_token);
            if (localFavTracks !== '') {
                const tracksCall = await axios.get(
                    `https://api.spotify.com/v1/tracks?ids=${localFavTracks}`,
                    {
                        headers: {
                            'Authorization': 'Bearer ' + token.data.access_token
                        }
                    });
                // console.log(tracksCall.data.tracks);
                setFavTracks(tracksCall.data.tracks);
            } else {
                //
            }
            if (localFavArtists !== '') {
                const artistsCall = await axios.get(
                    `https://api.spotify.com/v1/artists?ids=${localFavArtists}`,
                    {
                        headers: {
                            'Authorization': 'Bearer ' + token.data.access_token
                        }
                    });
                // console.log(artistsCall.data.artists);
                setFavArtists(artistsCall.data.artists);
            } else {
                //
            }
            // const genreCall = await formatGenres(artistCall.data);
            // setGenres(genreCall);
            // console.log(genreCall);
            if (localFavAlbums !== '') {
                const albumsCall = await axios.get(
                    `https://api.spotify.com/v1/albums?ids=${localFavAlbums}`,
                    {
                        headers: {
                            'Authorization': 'Bearer ' + token.data.access_token
                        }
                    });
                // console.log(albumsCall.data.albums);
                setFavAlbums(albumsCall.data.albums);
            } else {
                //
            }
            setLoading(false);
        };

        useMemo(() => {
                window.scrollTo(0, 0);
                getUser().catch((error) => {
                    toast.error('No User with this username found!');
                    navigate('/search');
                });
                getData().catch();
                isAccountOwnerHandler();
            }, []
        );

// useMemo(() => {
//         window.scrollTo(0, 0);
//         isAccountOwnerHandler();
//         getUser().catch(error => toast.error('Something went wrong'));
//         getData().catch(error => toast.error('Something went wrong'));
//     }, [ location.key ]
// );

        useEffect(() => {
            getUser().catch();
        }, [ editProfile, isAccountOwner ]);

        // useEffect(() => {
        //     isAccountOwnerHandler();
        //     getUser().catch(error => toast.error('Something went wrong'));
        //     getData().catch(error => toast.error('Something went wrong'));
        // }, []);
// console.log(stateUser);

        return (<>
                {loading ?
                    <>
                        <Helmet>
                            <style>{'body {   background-image: url(\'https://images.unsplash.com/photo-1614854262318-831574f15f1f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80\') !important;\n'
                                + '  background-repeat: no-repeat !important;\n'
                                + '  background-size: cover !important;\n'
                                + '  background-color: rgba(61, 162, 195, 0.1) !important; }'}</style>
                        </Helmet>
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
                    </> : (stateLoggedIn && isAccountOwner) || (username === stateUser.username) ?
                        <>
                            <Helmet>
                                <style>{'body {   background-image: url(\'https://images.unsplash.com/photo-1614854262318-831574f15f1f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80\') !important;\n'
                                    + '  background-repeat: no-repeat !important;\n'
                                    + '  background-size: cover !important;\n'
                                    + '  background-color: rgba(61, 162, 195, 0.1) !important; }'}</style>
                            </Helmet>
                            <div className={`container py-3 ${localUser.likedSongs.length < 1
                            && localUser.likedAlbums.length < 1
                            && localUser.likedArtists.length < 1 ? 'vh-70' : ''}`}>
                                <div className="row d-flex justify-content-center">
                                    <div className="col-10 col-sm-12 col-md-5 col-lg-4 d-flex mb-4">
                                        <div className="col-12 d-flex flex-column justify-content-center align-items-center">
                                            <div className="card gradient-custom profile-card mb-0 mb-md-0">
                                                <div className="card-body text-center">
                                                    <p className="profile-username mb-sm-2 mb-lg-2">
                                                        {username}
                                                        {localUser.admin ?
                                                            <span className="profile-username admin-badge"> - admin</span>
                                                            : ''}
                                                    </p>
                                                    <p className="profile-bio mb-sm-3 mb-lg-3">
                                                        {localUser.bio}
                                                    </p>
                                                    <div className="d-flex justify-content-center mb-2">
                                                        {!editProfile ?
                                                            <button className="btn-hover-edit color-10"
                                                                    onClick={() => {
                                                                        setEditProfile(true);
                                                                    }}>
                                                                Edit Profile
                                                            </button>
                                                            : <button className="btn-hover-edit color-8"
                                                                      onClick={() => {
                                                                          saveProfileHandler().catch(
                                                                              error => 'Something went wrong');
                                                                      }}>
                                                                Save Changes
                                                            </button>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {!editProfile ?
                                        <div className="col-10 col-sm-12 col-md-7 col-lg-8">
                                            <div className="card mask-custom-details mb-4">
                                                <div className="card-body">
                                                    <div className="row align-items-center">
                                                        <div className="col-sm-5 col-md-4 col-xl-2">
                                                            <p className="mb-0 item-heading">Username</p>
                                                        </div>
                                                        <div className="col-sm-7 col-xl-10">
                                                            <p className="item-descriptor mb-0">{stateUser.username}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <hr/>
                                                    <div className="row mb-0 align-items-center">
                                                        <div className="col-sm-5 col-md-4 col-xl-2">
                                                            <p className="mb-0 item-heading">Email</p>
                                                        </div>
                                                        <div className="col-sm-7">
                                                            <p className="item-descriptor mb-0">{stateUser.email}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        :
                                        <div className="col-10 col-sm-12 col-md-7 col-lg-8">
                                            <div className="card mask-custom-details mb-4">
                                                <div className="card-body">
                                                    <div className="row align-items-center">
                                                        <div className="col-sm-5 col-md-4 col-xl-2">
                                                            <p className="mb-0 item-heading">Username</p>
                                                        </div>
                                                        <div className="col-sm-7 col-xl-10">
                                                            <p className="item-descriptor mb-0">{stateUser.username}</p>
                                                        </div>
                                                        <hr/>
                                                    </div>
                                                    <div className="row align-items-center">
                                                        <div className="col-sm-5 col-md-4 col-xl-2">
                                                            <p className="mb-0 item-heading">Email</p>
                                                        </div>
                                                        <div className="col-sm-7 col-xl-10">
                                                            <MDBInput className="form-control-login"
                                                                      label="Email"
                                                                      id="edit-bio"
                                                                      type="text"
                                                                      size="lg"
                                                                      required
                                                                      contrast
                                                                      value={newEmail}
                                                                      onChange={(e) => {
                                                                          setNewEmail(e.target.value
                                                                          );
                                                                          console.log(stateUser);
                                                                      }}/>
                                                        </div>
                                                    </div>
                                                    <hr/>
                                                    <div className="row mb-0 align-items-center">
                                                        <div className="col-sm-5 col-md-4 col-xl-2">
                                                            <p className="mb-0 item-heading">Bio</p>
                                                        </div>
                                                        <div className="col-sm-7 col-xl-10">
                                                            <MDBInput className="form-control-login"
                                                                      label="Bio"
                                                                      id="editBio"
                                                                      type="text"
                                                                      size="lg"
                                                                      contrast
                                                                      maxLength={120}
                                                                      value={newBio}
                                                                      onChange={(e) => {
                                                                          setNewBio(e.target.value);
                                                                          console.log(stateUser);
                                                                      }}/>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                    {localUser.likedSongs.length > 0 ?
                                        <div className="col-12 col-sm-12 col-md-12 col-lg-10">
                                            <div className="card mask-custom-details-lighter mb-4">
                                                <div className="card-body">
                                                    <div className="mb-0 progress-header col-12 d-flex justify-content-between">
                                                        <p>
                                                            Recently Liked Songs
                                                        </p>
                                                        {favTracks && favTracks.length > 4
                                                            ?
                                                            <Link to={`/profile/${username}/tracks`}>
                                                                <p className="view-all align-items-center justify-content-end text-end">View
                                                                                                                                        All</p>
                                                            </Link>
                                                            : ''}
                                                    </div>
                                                    <MDBRow className="row-cols-2 row-cols-sm-2 row-cols-md-4 row-cols-lg-4 g-2 g-md-4">
                                                        {favTracks.map && favTracks.map(
                                                            (track, index) =>
                                                                <>
                                                                    <MDBCol className="align-content-center justify-content-center"
                                                                            style={{ display: 'flex' }}
                                                                            onClick={() => {
                                                                                navigate(
                                                                                    `/track/${track.id}`);
                                                                            }}
                                                                            key={index}>
                                                                        <RecommendedTrackListItem key={track.id}
                                                                                                  track={track}/>
                                                                    </MDBCol>
                                                                </>
                                                        ).slice(0, 4)}

                                                    </MDBRow>
                                                </div>
                                            </div>
                                        </div>
                                        : ''
                                    }
                                    {localUser.likedAlbums.length > 0 ?
                                        <div className="col-12 col-sm-12 col-md-12 col-lg-10">
                                            <div className="card mask-custom-details-lighter mb-4">
                                                <div className="card-body">
                                                    <div className="mb-0 progress-header col-12 d-flex justify-content-between">
                                                        <p>
                                                            Recently Liked Albums
                                                        </p>
                                                        {favAlbums && favAlbums.length > 4
                                                            ?
                                                            <Link to={`/profile/${username}/albums`}>
                                                                <p className="view-all align-items-center justify-content-end text-end">View
                                                                                                                                        All</p>
                                                            </Link>
                                                            : ''}
                                                    </div>
                                                    <MDBRow className="row-cols-2 row-cols-sm-2 row-cols-md-4 row-cols-lg-4 g-2 g-md-4">
                                                        {favAlbums.map && favAlbums.map(
                                                            (album, index) =>
                                                                <>
                                                                    <MDBCol className="align-content-center justify-content-center"
                                                                            style={{ display: 'flex' }}
                                                                            onClick={() => {
                                                                                navigate(
                                                                                    `/album/${album.id}`);
                                                                            }}
                                                                            key={index}>
                                                                        <MoreByListItem key={album.id}
                                                                                        track={album}/>
                                                                    </MDBCol>
                                                                </>
                                                        ).slice(0, 4)}

                                                    </MDBRow>
                                                </div>
                                            </div>
                                        </div>
                                        : ''}
                                    {localUser.likedArtists.length > 0 ?
                                        <div className="col-12 col-sm-12 col-md-12 col-lg-10">
                                            <div className="card mask-custom-details-lighter mb-4">
                                                <div className="card-body">
                                                    <div className="mb-0 progress-header col-12 d-flex justify-content-between">
                                                        <p>
                                                            Recently Liked Artists
                                                        </p>
                                                        {favArtists && favArtists.length > 4
                                                            ?
                                                            <Link to={`/profile/${username}/artists`}>
                                                                <p className="view-all align-items-center justify-content-end text-end">View
                                                                                                                                        All</p>
                                                            </Link>
                                                            : ''}
                                                    </div>
                                                    <MDBRow className="row-cols-2 row-cols-sm-2 row-cols-md-4 row-cols-lg-4 g-2 g-md-4">
                                                        {favArtists.map && favArtists.map(
                                                            (artist, index) =>
                                                                <>
                                                                    <MDBCol className="align-content-center justify-content-center"
                                                                            style={{ display: 'flex' }}
                                                                            onClick={() => {
                                                                                navigate(
                                                                                    `/artist/${artist.id}`);
                                                                            }}
                                                                            key={index}>
                                                                        <LikedArtistListItem key={artist.id}
                                                                                             artist={artist}/>
                                                                    </MDBCol>
                                                                </>
                                                        ).slice(0, 4)}

                                                    </MDBRow>
                                                </div>
                                            </div>
                                        </div>
                                        : ''}

                                </div>
                            </div>
                        </>
                        :
                        <>
                            <Helmet>
                                <style>{'body {   background-image: url(\'https://images.unsplash.com/photo-1614854262318-831574f15f1f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80\') !important;\n'
                                    + '  background-repeat: no-repeat !important;\n'
                                    + '  background-size: cover !important;\n'
                                    + '  background-color: rgba(61, 162, 195, 0.1) !important; }'}</style>
                            </Helmet>
                            <div className={`container py-3 ${localUser.likedSongs.length < 1
                            && localUser.likedAlbums.length < 1
                            && localUser.likedArtists.length < 1 ? 'vh-70' : ''}`}>
                                <div className="row d-flex justify-content-center">
                                    <div className="col-10 col-sm-12 col-md-7 col-lg-4 d-flex mb-4">
                                        <div className="col-12 d-flex flex-column align-items-center">
                                            <div className="card gradient-custom profile-card mb-0 mb-md-0">
                                                <div className="card-body text-center">
                                                    <p className="profile-username mb-sm-2 mb-lg-2">
                                                        {username}
                                                        {localUser.admin ?
                                                            <span className="profile-username admin-badge"> - admin</span>
                                                            : ''}
                                                    </p>
                                                    <p className="profile-bio mb-sm-3 mb-lg-3">
                                                        {localUser.bio}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 col-lg-8 d-flex flex-column justify-content-center align-items-center">
                                        {localUser.likedSongs.length > 0 ?
                                            <div className="col-12 col-sm-12 col-md-12 col-lg-12 justify-content-center align-items-center">
                                                <div className="card mask-custom-details-lighter mb-4">
                                                    <div className="card-body">
                                                        <div className="mb-0 progress-header col-12 d-flex justify-content-between">
                                                            <p>
                                                                Recently Liked Songs
                                                            </p>
                                                            {favTracks && favTracks.length > 4
                                                                ?
                                                                <Link to={`/profile/${username}/tracks`}>
                                                                    <p className="view-all align-items-center justify-content-end text-end">View
                                                                                                                                            All</p>
                                                                </Link>
                                                                : ''}
                                                        </div>
                                                        <MDBRow className="row-cols-2 row-cols-sm-2 row-cols-md-4 row-cols-lg-4 g-2 g-md-4">
                                                            {favTracks.map && favTracks.map(
                                                                (track, index) =>
                                                                    <>
                                                                        <MDBCol className="align-content-center justify-content-center"
                                                                                style={{ display: 'flex' }}
                                                                                onClick={() => {
                                                                                    navigate(
                                                                                        `/track/${track.id}`);
                                                                                }}
                                                                                key={index}>
                                                                            <RecommendedTrackListItem
                                                                                key={track.id}
                                                                                track={track}/>
                                                                        </MDBCol>
                                                                    </>
                                                            ).slice(0, 4)}

                                                        </MDBRow>
                                                    </div>
                                                </div>
                                            </div>
                                            : ''
                                        }
                                        {localUser.likedAlbums.length > 0 ?
                                            <div className="col-12 col-sm-12 col-md-12 col-lg-12">
                                                <div className="card mask-custom-details-lighter mb-4">
                                                    <div className="card-body">
                                                        <div className="mb-0 progress-header col-12 d-flex justify-content-between">
                                                            <p>
                                                                Recently Liked Albums
                                                            </p>
                                                            {favAlbums && favAlbums.length > 4
                                                                ?
                                                                <Link to={`/profile/${username}/albums`}>
                                                                    <p className="view-all align-items-center justify-content-end text-end">View
                                                                                                                                            All</p>
                                                                </Link>
                                                                : ''}
                                                        </div>
                                                        <MDBRow className="row-cols-2 row-cols-sm-2 row-cols-md-4 row-cols-lg-4 g-2 g-md-4">
                                                            {favAlbums.map && favAlbums.map(
                                                                (album, index) =>
                                                                    <>
                                                                        <MDBCol className="align-content-center justify-content-center"
                                                                                style={{ display: 'flex' }}
                                                                                onClick={() => {
                                                                                    navigate(
                                                                                        `/album/${album.id}`);
                                                                                }}
                                                                                key={index}>
                                                                            <MoreByListItem key={album.id}
                                                                                            track={album}/>
                                                                        </MDBCol>
                                                                    </>
                                                            ).slice(0, 4)}

                                                        </MDBRow>
                                                    </div>
                                                </div>
                                            </div>
                                            : ''}
                                        {localUser.likedArtists.length > 0 ?
                                            <div className="col-12 col-sm-12 col-md-12 col-lg-12">
                                                <div className="card mask-custom-details-lighter mb-4">
                                                    <div className="card-body">
                                                        <div className="mb-0 progress-header col-12 d-flex justify-content-between">
                                                            <p>
                                                                Recently Liked Artists
                                                            </p>
                                                            {favArtists && favArtists.length > 4
                                                                ?
                                                                <Link to={`/profile/${username}/artists`}>
                                                                    <p className="view-all align-items-center justify-content-end text-end">View
                                                                                                                                            All</p>
                                                                </Link>
                                                                : ''}
                                                        </div>
                                                        <MDBRow className="row-cols-2 row-cols-sm-2 row-cols-md-4 row-cols-lg-4 g-2 g-md-4">
                                                            {favArtists.map && favArtists.map(
                                                                (artist, index) =>
                                                                    <>
                                                                        <MDBCol className="align-content-center justify-content-center"
                                                                                style={{ display: 'flex' }}
                                                                                onClick={() => {
                                                                                    navigate(
                                                                                        `/artist/${artist.id}`);
                                                                                }}
                                                                                key={index}>
                                                                            <LikedArtistListItem key={artist.id}
                                                                                                 artist={artist}/>
                                                                        </MDBCol>
                                                                    </>
                                                            ).slice(0, 4)}

                                                        </MDBRow>
                                                    </div>
                                                </div>
                                            </div>
                                            : ''}
                                    </div>

                                </div>
                            </div>
                        </>

                }

            </>
        );

    }
;

export default Profile;
