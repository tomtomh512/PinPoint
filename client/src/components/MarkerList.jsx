import React from "react";
import "../styles/markerList.css";

export default function MarkerList(props) {
    const { markers } = props;

    return (
        <main className="markerList-container">
            {markers.map(marker => (
                <div key={marker.id + "-card"} className="marker-item">
                    {marker.name}
                </div>
            ))}
        </main>
    );

}