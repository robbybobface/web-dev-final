import React from "react";
import moment from "moment";
import { MDBCard, MDBCardBody, MDBCardImage, MDBCardText, MDBRipple } from "mdb-react-ui-kit";
import momentDurationFormatSetup from "moment-duration-format";

const TrackListItem = ({ track }) => {
    const explicit = track.explicit;
    return (
        <>

            <div className="card recommended-card h-100 gradient-custom-2 mb-4 mb-md-0">
                <div className="card-body h-100 text-center">
                    <img src={track.album.images[0].url
                        || 'https://images.unsplash.com/photo-1573247374056-ba7c8c5ca4fa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80'}
                         alt="avatar"
                         className="img-fluid track-image-recommended"/>
                    <h5 className="item-name-recommended-search mt-3 mt-md-3 mt-xl-4">
                        {track.name}
                        {explicit ?
                            <span className="material-icons green-color">explicit </span>
                            : ''}</h5>
                    <p className="item-descriptor" key={track.id}>
                        {track.artists.map((artist) => {
                            return artist.name.concat(', ');
                        }).join(' ').slice(0, -2)
                        }
                    </p>
                    <p className="item-descriptor-recommended mb-sm-1 mb-lg-1">
                        {moment.duration(track.duration_ms,
                            "milliseconds").format(
                            'h [hrs], m [min], ss [secs]')}</p>
                </div>
            </div>
        </>
    );
};
export default TrackListItem;
