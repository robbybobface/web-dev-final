import React from "react";
import { MDBCard, MDBCardBody, MDBCardImage, MDBCardText, MDBRipple } from "mdb-react-ui-kit";
import { Link } from "react-router-dom";

const AlbumListItem = ({ album }) => {
    return (
        <>

            <div className="card recommended-card h-100 gradient-custom-2 mb-4 mb-md-0">
                <div className="card-body h-100 text-center">
                    <img src={album.images[0].url
                        || 'https://images.unsplash.com/photo-1573247374056-ba7c8c5ca4fa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80'}
                         alt="avatar"
                         className="img-fluid track-image-recommended"/>
                    <h5 className="item-name-recommended mt-3 mt-md-3 mt-xl-4">{album.name}</h5>
                    <p className="item-descriptor" key={album.id}>
                        {album.artists.map(
                            (artist, i, { length }) =>
                                length - 1 === i ?
                                    <span className="item-descriptor" key={i}>{artist.name}</span>
                                    :
                                    <>
                                        <span className="item-descriptor" key={i}>{artist.name}</span>
                                        {', '}

                                    </>)
                        }
                    </p>
                    <p className="item-descriptor-recommended mb-sm-1 mb-lg-1">
                        {album.total_tracks > 1 ?
                            <span>{album.total_tracks} Tracks</span>
                            :
                            <span>{album.total_tracks} Track</span>}</p>
                </div>
            </div>
        </>
    );
};
export default AlbumListItem;
