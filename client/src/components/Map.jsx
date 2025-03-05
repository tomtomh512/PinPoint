import React from "react";
import 'leaflet/dist/leaflet.css';
import "../styles/map.css";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
// import { Icon, divIcon, point } from 'leaflet';
// import MarkerClusterGroup from 'react-leaflet-cluster';

export default function Map(props) {
    const { markers } = props;

    const customIcon = new Icon({
        iconUrl: require("../assets/pin.png"),
        iconSize: [38, 38]
    })

    // const createCustomClusterIcon = function (cluster) {
    //     return new divIcon({
    //         html: `<span class="cluster-icon">${cluster.getChildCount()}</span>`,
    //         className: "custom-marker-cluster",
    //         iconSize: point(33, 33, true)
    //     });
    // };

    const defaultCoordinates = [40.730610, -73.935242]

    return (
        <div className="map-container">
            <MapContainer center={defaultCoordinates} zoom={12}>
                <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"/>

                {/*<MarkerClusterGroup*/}
                {/*    chunkedLoading*/}
                {/*    iconCreateFunction={createCustomClusterIcon}*/}
                {/*>*/}
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
                {/*</MarkerClusterGroup>*/}

            </MapContainer>
        </div>
    );
}