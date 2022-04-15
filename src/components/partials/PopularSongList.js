import React from "react";
import moment from "moment";
import { MDBCard, MDBCardBody, MDBCardImage, MDBCardText, MDBRipple } from "mdb-react-ui-kit";
import momentDurationFormatSetup from "moment-duration-format";

const PopularSongListItem = ({ track, index }) => {
    const explicit = track.explicit;
    return (
        <>
            <div className="row align-items-center mb-0 px-2">
                <div className="col-2 col-sm-2 col-md-2 col-xl-1">
                    <p className="mb-0 item-descriptor">{index
                        + 1}</p>
                </div>
                <div className="col-7 col-sm-8 col-md-8 col-xl-9">
                    <p className="mb-0 item-descriptor">
                        <img src={track.album.images.length
                        === 0 ?
                            'https://images.unsplash.com/photo-1573247374056-ba7c8c5ca4fa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80'
                            : track.album.images[0].url}
                             alt="avatar"
                             className="img-fluid track-thumbnail pe-2"/>
                        {track.name}
                    </p>
                </div>
                <div className="col-3 col-sm-2 col-xl-2">
                    <p className="mb-0 item-descriptor duration ms-auto">{
                        track.duration_ms
                        < 3600000 ?
                            moment.duration(
                                track.duration_ms,
                                "milliseconds").format(
                                'm:ss', {
                                    trim: false
                                }) :
                            moment.duration(
                                track.duration_ms,
                                "milliseconds").format(
                                'h:m:ss', {
                                    trim: false
                                })}
                    </p>
                </div>
            </div>
        </>
    );
};
export default PopularSongListItem;
