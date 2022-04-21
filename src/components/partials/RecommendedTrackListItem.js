import React from "react";
import momentDurationFormatSetup from "moment-duration-format";

const RecommendedTrackListItem = ({ track }) => {
    const explicit = track.explicit;

    return (
        <>
            <div className="card recommended-card h-100 gradient-custom mb-4 mb-md-0">
                <div className="card-body h-100 text-center">
                    <img src={track.album.images[0].url}
                         alt="avatar"
                         className="img-fluid track-image-recommended"/>
                    <h5 className="item-name-recommended mt-3 mt-md-3 mt-xl-4">{track.name}
                        {explicit
                            ?
                            <span className="material-icons green-color green-color-track-recommended">explicit</span>
                            : ''}</h5>
                    <p className="item-descriptor-recommended mb-sm-1 mb-lg-1">{track.artists.map(
                        (artist) => {
                            return artist.name.concat(', ');
                        }).join(' ').slice(0, -2)
                    }</p>
                </div>
            </div>
        </>
    );
};

export default RecommendedTrackListItem;
