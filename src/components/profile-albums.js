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
import AlbumListItem from "./partials/AlbumListItem";

const override = css`
  display: block;
  margin: 0 auto;
  border-color: #00C9B9;
`;

const ProfileAlbums = () => {
    const { username } = useParams();
    const [ loading, setLoading ] = useState(true);
    const [ artist, setArtist ] = useState({});
    const { user, loggedIn } = useContext(UserContext);
    const [ stateUser, setStateUser ] = user;
    const [ stateLoggedIn, setStateLoggedIn ] = loggedIn;
    const [ favAlbums, setFavAlbums ] = useState([]);

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
        const localFavAlbums = userCall.likedAlbums.map(album => album.albumId).join(',');
        const token = await axios('https://accounts.spotify.com/api/token', {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(spotify.ClientId + ':' + spotify.ClientSecret)
            },
            data: 'grant_type=client_credentials',
            method: 'POST'
        });
        setToken(token.data.access_token);
        if (localFavAlbums !== '') {
            const albumsCall = await axios.get(
                `https://api.spotify.com/v1/albums?ids=${localFavAlbums}`,
                {
                    headers: {
                        'Authorization': 'Bearer ' + token.data.access_token
                    }
                });
            console.log(albumsCall.data.albums);
            setFavAlbums(albumsCall.data.albums);
        } else {
            //
        }
        setLoading(false);
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        try {
            getData().catch();
            console.log(favAlbums);
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
                                    <span className="category-underline">Albums Liked By {username}</span>
                                </h1>
                                <MDBRow className="row-cols-2 row-cols-md-2 row-cols-lg-4 g-4 flex-row">
                                    {
                                        favAlbums && favAlbums.filter(
                                            recommendation =>
                                                recommendation.type === 'album').map(album =>
                                            <>
                                                <MDBCol className="align-content-center justify-content-center"
                                                        style={{ display: 'flex' }}
                                                        onClick={() => {
                                                            navigate(
                                                                `/album/${album.id}`);
                                                            window.scrollTo(0,
                                                                0);
                                                        }
                                                        }>
                                                    <AlbumListItem key={album.id}
                                                                   album={album}/>
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

export default ProfileAlbums;
