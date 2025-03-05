import React, {useState} from "react";
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

    return (
        <main className="main-container">
            <Search onCurrentMarkersChange={setCurrentMarkers} />
            <MarkerList markers={currentMarkers} />
            <Map markers={currentMarkers} />
        </main>
    );
}