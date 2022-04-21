import React, { useContext, useEffect, useState } from 'react';

import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Credentials } from "../Credentials";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import { ScaleLoader } from "react-spinners";
import { css } from "@emotion/react";

import { MDBCol, MDBRow } from "mdb-react-ui-kit";
import MoreByListItem from "./partials/MoreByListItem";
import { UserContext } from "../Utils/UserContext";
import * as userService from "../services/user-service";
import TrackListItem from "./partials/TrackListItem";

const override = css`
  display: block;
  margin: 0 auto;
  border-color: #00C9B9;
`;

const ProfileTracks = () => {
    const { username } = useParams();
    const [ loading, setLoading ] = useState(true);
    const [ artist, setArtist ] = useState({});
    const { user, loggedIn } = useContext(UserContext);
    const [ stateUser, setStateUser ] = user;
    const [ stateLoggedIn, setStateLoggedIn ] = loggedIn;
    const [ favTracks, setFavTracks ] = useState([]);

    const location = useLocation();
    const navigate = useNavigate();

    const spotify = Credentials();

    const [ token, setToken ] = useState('');

    const getData = async () => {
        const userCall = await userService.findUserByUsername(username).catch((error) => {
            toast.error('No User with this Username!');
            navigate('/search');
            throw "No User with this Username";
        });
        if (userCall.error) {
            toast.error('No User with this Username!');
            navigate('/search');
            throw "No User with this Username";
        }
        const localFavTracks = userCall.likedSongs.map(song => song.songId).join(',');
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
            console.log(tracksCall.data.tracks);
            setFavTracks(tracksCall.data.tracks);
        } else {
            //
        }
        setLoading(false);
    };

    const trackNavigate = (tid) => {
        navigate(`/track/${tid}`);
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        try {
            getData().catch();
            console.log(favTracks);
        } catch (error) {
            toast.error('Could Not Find Songs');
            navigate('/search');
        }
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
                        </div>
                    </>
                    :
                    <>
                        <div className="container py-3">
                            <div className="row d-flex justify-content-center">
                                <h1 className="search-category text-center py-2">
                                    <span className="category-underline">Singles and EPs Liked By {username}</span>
                                </h1>
                                <MDBRow className="row-cols-2 row-cols-md-2 row-cols-lg-4 g-4 flex-row">
                                    {
                                        favTracks && favTracks.filter(
                                            recommendation =>
                                                recommendation.type === 'track').map(track =>
                                            <>
                                                <MDBCol className="align-content-center justify-content-center"
                                                        style={{ display: 'flex' }}
                                                        onClick={() => {
                                                            // if (track.album_group
                                                            //     === 'single') {
                                                            //     setLoading(true);
                                                            //     const token = await axios(
                                                            //         'https://accounts.spotify.com/api/token',
                                                            // { headers: { 'Content-Type':
                                                            // 'application/x-www-form-urlencoded',
                                                            // 'Authorization': 'Basic ' + btoa(
                                                            // spotify.ClientId + ':' +
                                                            // spotify.ClientSecret) }, data:
                                                            // 'grant_type=client_credentials',
                                                            // method: 'POST' }); const newAlbum =
                                                            // await axios.get(
                                                            // `https://api.spotify.com/v1/albums/${track.id}?market=US`,
                                                            // { headers: { 'Authorization': 'Bearer ' + token.data.access_token } }); console.log( newAlbum.data);
                                                            navigate(
                                                                `/track/${track.id}`);
                                                            window.scrollTo(0,
                                                                0);
                                                        }
                                                        }>
                                                    <TrackListItem key={track.id}
                                                                   track={track}/>
                                                </MDBCol>
                                            </>)
                                    }
                                </MDBRow>
                            </div>

                        </div>
                    </>
            }
        </>
    );
};

export default ProfileTracks;
