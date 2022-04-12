import React from "react";
import moment from "moment";
import { MDBCard, MDBCardBody, MDBCardImage, MDBCardText } from "mdb-react-ui-kit";

const TrackListItem = ({ track }) => {
    return (
        <>
            <MDBCard style={{ width: '16rem', height: '8rem' }}
                     className="h-100 align-content-center justify-content-center">
                <MDBCardImage src={track.album.images[0].url} alt="..." position="top"/>
                <MDBCardBody>
                    <MDBCardText>
                        <span>{track.name}</span>
                        <br/>
                        <span>{track.artists[0].name}</span>
                        <br/>
                        <span>{moment(track.duration_ms).format('m:ss')}</span>
                    </MDBCardText>
                </MDBCardBody>
            </MDBCard>
        </>
    );
};
export default TrackListItem;
