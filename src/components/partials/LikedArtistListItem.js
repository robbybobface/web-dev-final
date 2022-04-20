import React from "react";
import { MDBCard, MDBCardBody, MDBCardImage, MDBCardText, MDBRipple } from "mdb-react-ui-kit";
import moment from "moment";

const LikedArtistListItem = ({ artist }) => {
    return (
        <>
            <div className="card recommended-card h-100 gradient-custom-2 mb-4 mb-md-0">
                <div className="card-body h-100 text-center">
                    <img src={artist.images.length === 0
                        ? 'https://images.unsplash.com/photo-1488109811119-98431feb6929?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80'
                        : artist.images[0].url}
                         alt="avatar"
                         className="img-fluid track-image-recommended"/>
                    <h5 className="item-name-recommended mt-3 mt-md-3 mt-xl-4">{artist.name}</h5>
                    <p className="item-descriptor-recommended mb-sm-1 mb-lg-1" key={artist.id}>
                        {artist.genres.length > 1 ? <span className="genres">Genres: </span>
                            : artist.genres.length === 1 ?
                                <span className="genres">Genre: </span> : ''}
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
                        }</p>
                </div>
            </div>
        </>
    );
};
export default LikedArtistListItem;
