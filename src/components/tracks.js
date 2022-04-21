import React, { useEffect, useState } from 'react';

import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Credentials } from "../Credentials";
import { Helmet } from "react-helmet";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import * as security from "../services/auth-service";
import { ScaleLoader } from "react-spinners";
import { css } from "@emotion/react";

import { MDBCol, MDBRow } from "mdb-react-ui-kit";

import TrackListItem from "./partials/TrackListItem";
import RecommendedTrackListItem from "./partials/RecommendedTrackListItem";
import MoreByListItem from "./partials/MoreByListItem";

const override = css`
  display: block;
  margin: 0 auto;
  border-color: #00C9B9;
`;

const Tracks = () => {
    const { aid } = useParams();
    const [ loading, setLoading ] = useState(true);
    const [ artist, setArtist ] = useState({});
    const [ discography, setDiscography ] = useState({});

    const location = useLocation();
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
            toast.error('Could Not Find Songs');
            navigate('/search');
            throw "Could Not Find Songs";
        });
        console.log(artistCall.data);
        setArtist(artistCall.data);
        const albumsCall = await axios.get(
            `https://api.spotify.com/v1/artists/${aid}/albums?include_groups=single&market=US&limit=50`,
            {
                headers: { 'Authorization': 'Bearer ' + token.data.access_token }
            });
        const checkDiscography = albumsCall.data.items.filter(
            (recommendation, index) => recommendation.id !== aid && recommendation.name
                !== albumsCall.data.name &&
                albumsCall.data.items.findIndex(newRecommendation => {
                    return newRecommendation.name === recommendation.name;
                }) === index);
        console.log(checkDiscography);
        if (checkDiscography.length !== albumsCall.data.items.length) {
            setDiscography(checkDiscography);
        } else {
            setDiscography(albumsCall.data.items);
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
                                    <span className="category-underline">Singles and EPs by {artist.name}</span>
                                </h1>
                                <MDBRow className="row-cols-2 row-cols-md-2 row-cols-lg-4 g-4 flex-row">
                                    {
                                        discography && discography.filter(
                                            recommendation =>
                                                recommendation.album_group === 'single').map(track =>
                                            <>
                                                <MDBCol className="align-content-center justify-content-center"
                                                        style={{ display: 'flex' }}
                                                        onClick={async () => {
                                                            if (track.album_group
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
                                                                    `https://api.spotify.com/v1/albums/${track.id}?market=US`,
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
                                                            }
                                                        }}>
                                                    <MoreByListItem key={track.id}
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

export default Tracks;
