import React, {useEffect, useState} from 'react';
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Profile from "./components/Profile";
import Search from "./components/Search";
import Favorites from "./components/Favorites";
import Planned from "./components/Planned";
import Map from "./components/Map";
import "./style.css";

export default function App() {

    // Persist search input & results
    const [searchInput, setSearchInput] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    // Current markers on map
    const [currentMarkers, setCurrentMarkers] = useState([]);
    // Highlighted marker on map, also acts as highlighted listing to expand
    const [activeMarker, setActiveMarker] = useState({});
    // Current coordinates of map view
    const [currentLocation, setCurrentLocation] = useState({
        "lat": 40.730610,
        "long": -73.935242,
    });

    // Ask for location
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

    const [showPanel, setShowPanel] = useState(true);
    const togglePanel = () => { setShowPanel(prev => !prev) }
    const togglePanelTrue = () => { setShowPanel(true) }

    return (
        <main className="main-container">
            <Navbar
                togglePanel={togglePanel}
                togglePanelTrue={togglePanelTrue}
                showPanel={showPanel}
            />

            <Map
                markers={currentMarkers}
                currentLocation={currentLocation}
                onViewChange={setCurrentLocation}
                activeMarker={activeMarker}
            />

            {showPanel &&
                <Routes>
                    <Route path="/" element={
                        <Search
                            setCurrentMarkers={setCurrentMarkers}
                            currentLocation={currentLocation}
                            searchInput={searchInput}
                            setSearchInput={setSearchInput}
                            searchResults={searchResults}
                            setSearchResults={setSearchResults}
                            activeMarker={activeMarker}
                            setActiveMarker={setActiveMarker}
                        />
                    }/>
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/favorites" element={<Favorites />} />
                    <Route path="/planned" element={<Planned />} />
                </Routes>
            }
        </main>
    );
}
