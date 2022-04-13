import React, { useEffect, useState } from 'react';

import { useParams } from "react-router-dom";
import axios from "axios";
import { Credentials } from "../Credentials";

const Artist = () => {
    const { aid } = useParams();
    const [ artist, setArtist ] = useState({});

    const spotify = Credentials();

    const [ token, setToken ] = useState('');
    const getArtist = () => {
        axios('https://accounts.spotify.com/api/token', {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(spotify.ClientId + ':' + spotify.ClientSecret)
            },
            data: 'grant_type=client_credentials',
            method: 'POST'
        })
            .then(tokenResponse => {
                setToken(tokenResponse.data.access_token);

                axios(`https://api.spotify.com/v1/artists/${aid}`,
                    {
                        method: 'GET',
                        headers: { 'Authorization': 'Bearer ' + tokenResponse.data.access_token }
                    })
                    .then(trackResponse => {
                        console.log(trackResponse);
                        setArtist(trackResponse.data);
                    });

            });
    };

    useEffect(() => {
        getArtist();
    }, []);

    return (
        <h1>The artist is {artist.name}!</h1>
    );
};

export default Artist;
