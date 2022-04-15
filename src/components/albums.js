import React, { useEffect, useState } from 'react';

import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Credentials } from "../Credentials";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import { ScaleLoader } from "react-spinners";
import { css } from "@emotion/react";
import { MDBCol, MDBRow } from "mdb-react-ui-kit";
import AlbumListItem from "./partials/AlbumListItem";

const override = css`
  display: block;
  margin: 0 auto;
  border-color: #00C9B9;
`;

const Albums = () => {
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
            });
        console.log(artistCall.data);
        setArtist(artistCall.data);
        const albumsCall = await axios.get(
            `https://api.spotify.com/v1/artists/${aid}/albums?include_groups=album&market=US&limit=50`,
            {
                headers: { 'Authorization': 'Bearer ' + token.data.access_token }
            });
        const checkAlbums = albumsCall.data.items.filter(
            (recommendation, index) => recommendation.id !== aid && recommendation.name
                !== albumsCall.data.name &&
                albumsCall.data.items.findIndex(newRecommendation => {
                    return newRecommendation.name === recommendation.name;
                }) === index);
        console.log(checkAlbums);
        if (checkAlbums.length !== albumsCall.data.items.length) {
            setDiscography(checkAlbums);
        } else {
            setDiscography(albumsCall.data.items);
        }

        setLoading(false);
    };

    const albumNavigate = (aid) => {
        navigate(`/album/${aid}`);
    };

    useEffect(() => {
        getData().catch(error => toast.error(error));
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
                                    <span className="category-underline">Albums by {artist.name}</span>
                                </h1>
                                <MDBRow className="row-cols-2 row-cols-md-2 row-cols-lg-4 g-4 flex-row">
                                    {
                                        discography && discography.filter(
                                            recommendation =>
                                                recommendation.album_group === 'album').map(album =>
                                            <>
                                                <MDBCol className="align-content-center justify-content-center"
                                                        style={{ display: 'flex' }}
                                                        onClick={() => {
                                                            albumNavigate(album.id);
                                                            window.scrollTo(0, 0);
                                                        }}>
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

export default Albums;
