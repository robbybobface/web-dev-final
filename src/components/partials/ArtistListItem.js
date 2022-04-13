import React from "react";
import { MDBCard, MDBCardBody, MDBCardImage, MDBCardText, MDBRipple } from "mdb-react-ui-kit";

const ArtistListItem = ({ artist }) => {
    return (
        <>
            <MDBCard style={{ width: '16rem', height: '8rem' }}
                     className="h-100 align-content-center justify-content-center search-card">
                <MDBRipple rippleColor="light" rippleTag="div" className="bg-image hover-overlay">
                    <MDBCardImage src={artist.images.length === 0
                        ? 'https://images.unsplash.com/photo-1488109811119-98431feb6929?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80'
                        : artist.images[0].url}
                                  alt="..."
                                  position="top"
                                  className="artist-image"/>
                    <a>
                        <div className="mask"
                             style={{ backgroundColor: 'rgba(251, 251, 251, 0.05)' }}/>
                    </a>
                </MDBRipple>
                <MDBCardBody>
                    <MDBCardText>
                        <span className="search-track-name">{artist.name}</span>
                        <br/>
                        {/*<span className="search-track-artist">{album.artists[0].name}</span>*/}
                        {/*<br/>*/}
                        <span className="search-track-duration">
                            {artist.genres.length > 1 ? <span className="genres">Genres: </span>
                                : artist.genres.length === 1 ?
                                    <span className="genres">Genre: </span> : ''}
                            <span className="genre-list">
                            {artist.genres.map(
                                (genre) => {
                                    if (genre.includes(' ')) {
                                        const newGenre = genre.split(' ');
                                        const finalGenre = newGenre.map(
                                            word => word.charAt(0).toUpperCase() + word.slice(
                                                1));
                                        return finalGenre.join(' ').concat(', ');
                                    } else if (genre.includes('-')) {
                                        const newGenre = genre.split('-');
                                        return newGenre.map(
                                            word => word.charAt(0).toUpperCase() + word.slice(
                                                1)).join('-').concat(', ');
                                    } else {
                                        // console.log(genre);
                                        return genre.charAt(0).toUpperCase() + genre.slice(
                                            1).concat(', ');
                                    }
                                }
                            ).join(' ').slice(0, -2)
                            }</span>
                            </span>
                    </MDBCardText>
                </MDBCardBody>
            </MDBCard>
        </>
    );
};
export default ArtistListItem;
