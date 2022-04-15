import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Helmet } from 'react-helmet';
import { Credentials } from "../Credentials";
import axios from "axios";

import TrackListItem from "./partials/TrackListItem";

import { MDBCol, MDBInput, MDBRadio, MDBRow } from 'mdb-react-ui-kit';
import AlbumListItem from "./partials/AlbumListItem";
import ArtistListItem from "./partials/ArtistListItem";
import { ScaleLoader } from "react-spinners";
import { toast } from "react-toastify";
import { css } from "@emotion/react";
import { UserContext } from "../Utils/UserContext";

const override = css`
  display: block;
  margin: 0 auto;
  border-color: #00C9B9;
`;

const Search = () => {
        const { searchString } = useParams();
        const { searchBy } = useContext(UserContext);
        const [ stateSearchBy, setStateSearchBy ] = searchBy;
        const [ search, setSearch ] = useState(searchString);

        // const [ trackSearch, setTrackSearch ] = useState(true);
        // const [ artistSearch, setArtistSearch ] = useState(false);
        // const [ albumSearch, setAlbumSearch ] = useState(false);

        const [ searched, setSearched ] = useState(false);
        const [ loading, setLoading ] = useState(true);

        const navigate = useNavigate();
        const location = useLocation();

        const spotify = Credentials();
        const [ token, setToken ] = useState('');
        const [ artists, setArtists ] = useState([]);
        const [ albums, setAlbums ] = useState([]);
        const [ tracks, setTracks ] = useState([]);
        const [ topSongs, setTopSongs ] = useState([]);

        const getSearch = async () => {
            setLoading(true);
            const token = await axios('https://accounts.spotify.com/api/token', {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Basic ' + btoa(spotify.ClientId + ':' + spotify.ClientSecret)
                },
                data: 'grant_type=client_credentials',
                method: 'POST'
            });
            setToken(token.data.access_token);
            const artistCall = await axios.get(
                `https://api.spotify.com/v1/search?q=${search}&type=artist&market=US&limit=8`,
                {
                    headers: { 'Authorization': 'Bearer ' + token.data.access_token }
                });
            // console.log(artistCall.data.artists.items);
            setArtists(artistCall.data.artists.items);
            const trackResponse = await axios.get(
                `https://api.spotify.com/v1/search?q=${search}&type=track&market=US&limit=8`,
                {
                    headers: { 'Authorization': 'Bearer ' + token.data.access_token }
                });
            // console.log(trackResponse.data.tracks.items);
            setTracks(trackResponse.data.tracks.items);
            const albumResponse = await axios.get(
                `https://api.spotify.com/v1/search?q=${search}&type=album&market=US&limit=8`,
                {
                    headers: { 'Authorization': 'Bearer ' + token.data.access_token }
                });
            // console.log(albumResponse.data.albums.items);
            setAlbums(albumResponse.data.albums.items);
            setLoading(false);
        };

        const getFeatured = async () => {
            const token = await axios('https://accounts.spotify.com/api/token', {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Basic ' + btoa(spotify.ClientId + ':' + spotify.ClientSecret)
                },
                data: 'grant_type=client_credentials',
                method: 'POST'
            });
            setToken(token.data.access_token);

            const featuredResponse = await axios.get(
                `https://api.spotify.com/v1/playlists/37i9dQZEVXbNG2KDcFcKOF`,
                {
                    headers: { 'Authorization': 'Bearer ' + token.data.access_token }
                });
            // console.log(featuredResponse);
            setTopSongs(featuredResponse.data.tracks.items);
            setLoading(false);
        };

        const searchHandler = () => {
            if (!search) {
                return;
            }
            // console.log(search);
            setLoading(true);
            getSearch().catch(error => toast.error(error));
            setSearched(true);
            navigate(`/search/${search}`);
        };

        const trackHandler = () => {
            setStateSearchBy('tracks');
        };

        const albumHandler = () => {
            setStateSearchBy('albums');
        };
        const artistHandler = () => {
            setStateSearchBy('artists');
        };

        const artistNavigate = (aid) => {
            navigate(`/artist/${aid}`);
        };

        const albumNavigate = (aid) => {
            navigate(`/album/${aid}`);
        };

        const trackNavigate = (tid) => {
            navigate(`/track/${tid}`);
        };

        useEffect(() => {
            if (!search) {
                setSearched(false);
                setTracks([]);
                setAlbums([]);
                setArtists([]);
            }
            if (searchString && !search) {
                setSearched(false);
                setTracks([]);
                setAlbums([]);
                setArtists([]);
                navigate('/search');
            }
        }, [ search, searchString ]);

        useEffect(() => {
            if (searchString) {
                searchHandler();
            }
            getFeatured().catch(error => toast.error(error));
        }, []);

        return (
            <>
                <Helmet>
                    <style>{'body {   background-image: url(\'https://images.unsplash.com/photo-1614854262318-831574f15f1f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80\') !important;\n'
                        + '  background-repeat: no-repeat !important;\n'
                        + '  background-size: cover !important;\n'
                        + '  background-color: rgba(61, 162, 195, 0.1) !important; }'}</style>
                </Helmet>
                <div className="container container-search mt-5">
                    <div className="row align-content-center justify-content-center">
                        <div className="card mask-custom px-4 py-2 col-10 col-sm-11 col-xl-9">
                            <div className="card-body">
                                <p className="h1 font-weight-bold mb-4 text-white text-center">
                                    Discover Amazing Music</p>
                                <div className="row justify-content-center">
                                    <div className="col-md-10 mb-3 mb-md-0">
                                        <MDBInput className="input-search"
                                                  label="Search Something"
                                                  id="formControlLg"
                                                  type="text"
                                                  size="lg"
                                                  contrast
                                                  onChange={(e) => {
                                                      setSearch(e.target.value);
                                                  }}
                                                  value={search || searchString && search}
                                        />
                                    </div>

                                    <div className="col-md-2">
                                        <input className="btn-hover-search color-8"
                                               type="submit"
                                               value="Search"
                                               onClick={searchHandler}/>
                                    </div>
                                </div>
                                <div className="row d-flex mt-4">
                                    <div className="category-toggle d-flex align-items-center justify-content-center">
                                        <MDBRadio name="inlineRadio"
                                                  className="custom-radio"
                                                  id="inlineRadio1"
                                                  value="option1"
                                                  label="Tracks"
                                                  onChange={() => stateSearchBy === 'tracks'}
                                                  checked={stateSearchBy === 'tracks'}
                                                  inline
                                                  onClick={trackHandler}/>
                                        <MDBRadio name="inlineRadio"
                                                  className="custom-radio"
                                                  id="inlineRadio2"
                                                  value="option2"
                                                  label="Artists"
                                                  onChange={() => stateSearchBy === 'artists'}
                                                  checked={stateSearchBy === 'artists'}
                                                  inline
                                                  onClick={artistHandler}/>
                                        <MDBRadio name="inlineRadio"
                                                  className="custom-radio"
                                                  id="inlineRadio3"
                                                  value="option3"
                                                  label="Albums"
                                                  onChange={() => stateSearchBy === 'albums'}
                                                  checked={stateSearchBy === 'albums'}
                                                  inline
                                                  onClick={albumHandler}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {loading ?
                        <>
                            <div className="d-flex align-items-center justify-content-center custom-height-search">
                                <ScaleLoader color={`white`}
                                             loading={loading}
                                             css={override}
                                             height={40}
                                             width={3}
                                             radius={3}
                                             margin={3}/>
                                {/*<BarLoader color={'white'} loading={loading} css={override} height={3}/>*/}
                            </div>
                        </>
                        :
                        stateSearchBy === 'tracks' && searched ?
                            <>
                                <h1 className="search-category text-center py-3">
                                    <span className="category-underline">Tracks</span></h1>
                                <MDBRow className="row-cols-2 row-cols-md-2 row-cols-lg-4 g-4 flex-row">
                                    {
                                        tracks.map && tracks.map((track, index) =>
                                            <>
                                                <MDBCol className="align-content-center justify-content-center"
                                                        style={{ display: 'flex' }}
                                                        onClick={() => {
                                                            trackNavigate(track.id);
                                                            window.scrollTo(0, 0);
                                                        }}
                                                        key={index}>
                                                    <TrackListItem key={track.id} track={track}/>
                                                </MDBCol>
                                            </>)
                                    }
                                </MDBRow>
                            </>
                            :
                            stateSearchBy === 'artists' && searched
                                ?
                                <>
                                    <h1 className="search-category text-center py-3">
                                        <span className="category-underline">Artists</span></h1>
                                    <MDBRow className="row-cols-2 row-cols-md-2 row-cols-lg-4 g-4 flex-row">
                                        {
                                            artists.map((artist, index) =>
                                                <>
                                                    <MDBCol className="align-content-center justify-content-center"
                                                            style={{ display: 'flex' }}
                                                            onClick={() => {
                                                                artistNavigate(artist.id);
                                                                window.scrollTo(0, 0);
                                                            }}
                                                            key={index}>
                                                        <ArtistListItem key={artist.id}
                                                                        artist={artist}/>
                                                    </MDBCol>
                                                </>)
                                        }
                                    </MDBRow>
                                </>
                                :
                                stateSearchBy === 'albums' && searched ?
                                    <>
                                        <h1 className="search-category text-center py-3">
                                            <span className="category-underline">Albums</span></h1>
                                        <MDBRow className="row-cols-2 row-cols-md-2 row-cols-lg-4 g-4 flex-row">
                                            {
                                                albums.map((album, index) =>
                                                    <>
                                                        <MDBCol className="align-content-center justify-content-center"
                                                                style={{ display: 'flex' }}
                                                                onClick={() => {
                                                                    albumNavigate(album.id);
                                                                    window.scrollTo(0, 0);
                                                                }}
                                                                key={index}
                                                        >
                                                            <AlbumListItem key={album.id}
                                                                           album={album}/>
                                                        </MDBCol>
                                                    </>)
                                            }
                                        </MDBRow>
                                    </>
                                    :
                                    <>
                                        <h1 className="search-category text-center py-3">
                                            <span className="category-underline">Top Tracks US</span>
                                        </h1>
                                        <MDBRow className="row-cols-2 row-cols-md-2 row-cols-lg-4 g-4 flex-row">
                                            {
                                                topSongs.map((track, index) =>
                                                    <>
                                                        <MDBCol className="align-content-center justify-content-center"
                                                                style={{ display: 'flex' }}
                                                                key={index}
                                                        >
                                                            <div onClick={() => {
                                                                trackNavigate(
                                                                    track.track.id);
                                                                window.scrollTo(0, 0);
                                                            }}>
                                                                <TrackListItem key={track.track.id}
                                                                               track={track.track}/>
                                                            </div>
                                                        </MDBCol>
                                                    </>)
                                            }
                                        </MDBRow>
                                    </>
                    }
                </div>
                }
            </>

        );
    }
;

export default Search;
