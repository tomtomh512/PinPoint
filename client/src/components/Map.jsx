import React, { useEffect } from "react";
import 'leaflet/dist/leaflet.css';
import "../styles/map.css";
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';

export default function Map(props) {
    const { markers, currentLocation } = props;

    const customIcon = new Icon({
        iconUrl: require("../assets/pin.png"),
        iconSize: [38, 38]
    });

    // Component to update map view
    function ChangeView({ center }) {
        const map = useMap();

        useEffect(() => {
            map.setView(center, map.getZoom());

        }, [center, map]);

        return null;
    }

    return (
        <div className="map-container">
            <MapContainer center={[currentLocation.lat, currentLocation.long]} zoom={12}>
                <ChangeView center={[currentLocation.lat, currentLocation.long]} />
                <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"/>

                {markers.map(marker => (
                    <Marker
                        position={[marker.lat, marker.long]}
                        icon={customIcon}
                        key={marker.id + "-marker"}
                    >
                        <Popup>
                            <h3>{marker.name}</h3>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}