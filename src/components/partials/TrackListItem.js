import React from "react";
import moment from "moment";
import { MDBCard, MDBCardBody, MDBCardImage, MDBCardText, MDBRipple } from "mdb-react-ui-kit";
import momentDurationFormatSetup from "moment-duration-format";

const TrackListItem = ({ track }) => {
    const explicit = track.explicit;
    return (
        <>
            <MDBCard style={{ width: '16rem', height: '8rem' }}
                     className="h-100 align-content-center justify-content-center search-card">
                <MDBRipple rippleColor="light" rippleTag="div" className="bg-image hover-overlay">
                    <MDBCardImage src={track.album.images[0].url} alt="..." position="top"/>
                    <a>
                        <div className="mask"
                             style={{ backgroundColor: 'rgba(251, 251, 251, 0.05)' }}/>
                    </a>
                </MDBRipple>
                <MDBCardBody>
                    <MDBCardText>
                        <span className="search-track-name align-content-center">{track.name}</span>
                        {explicit
                            ?
                            <span className="material-icons green-color">explicit </span>
                            : ''}
                        <br/>
                        <span className="search-track-artist">{track.artists.map((artist) => {
                            return artist.name.concat(', ');
                        }).join(' ').slice(0, -2)
                        }</span>
                        <br/>
                        <span className="search-track-duration">{moment.duration(track.duration_ms,
                            "milliseconds").format(
                            'h [hrs], m [min], ss [secs]')}</span>
                    </MDBCardText>
                </MDBCardBody>
            </MDBCard>
        </>
    );
};
export default TrackListItem;
