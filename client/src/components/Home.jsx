import React, {useEffect, useState} from "react";
import Search from "./Search";
import Map from "./Map";
import MarkerList from "./MarkerList";
import "../styles/home.css";

export default function Home() {
    const [currentMarkers, setCurrentMarkers] = useState([]);
    const [currentLocation, setCurrentLocation] = useState({
        "lat": 40.730610,
        "long": -73.935242,
    });

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCurrentLocation({
                        lat: position.coords.latitude,
                        long: position.coords.longitude,
                    });
                },
                () => {
                    console.warn("Geolocation permission denied. Using default location.");
                }
            );
        }
    }, []);

    return (
        <main className="main-container">
            <Search
                onCurrentMarkersChange={setCurrentMarkers}
                currentLocation={currentLocation}
            />
            {/*<MarkerList markers={currentMarkers} />*/}
            <Map
                markers={currentMarkers}
                currentLocation={currentLocation}
            />
        </main>
    );
}