import React from "react";
import { MDBCard, MDBCardBody, MDBCardImage, MDBCardText, MDBRipple } from "mdb-react-ui-kit";

const AlbumListItem = ({ album }) => {
    return (
        <>
            <MDBCard style={{ width: '16rem', height: '8rem' }}
                     className="h-100 align-content-center justify-content-center search-card">
                <MDBRipple rippleColor="light" rippleTag="div" className="bg-image hover-overlay">
                    <MDBCardImage src={album.images[0].url} alt="..." position="top"/>
                    <a>
                        <div className="mask"
                             style={{ backgroundColor: 'rgba(251, 251, 251, 0.05)' }}/>
                    </a>
                </MDBRipple>
                <MDBCardBody>
                    <MDBCardText>
                        <span className="search-track-name">{album.name}</span>
                        <br/>
                        <span className="search-track-artist">{album.artists[0].name}</span>
                        <br/>
                        {album.total_tracks > 1 ?
                            <span className="search-track-duration">{album.total_tracks} Tracks</span>
                            :
                            <span className="search-track-duration">{album.total_tracks} Track</span>}
                    </MDBCardText>
                </MDBCardBody>
            </MDBCard>
        </>
    );
};
export default AlbumListItem;
