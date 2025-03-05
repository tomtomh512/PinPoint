import React, {useEffect, useState} from 'react';
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Search from "./components/Search";
import Favorites from "./components/Favorites";
import Saved from "./components/Saved";
import Map from "./components/Map";
import "./style.css";

export default function App() {
    const [showPanel, setShowPanel] = useState(true);
    const togglePanel = () => {
        setShowPanel(prev => !prev);
    };

    const [currentMarkers, setCurrentMarkers] = useState([]);
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

    return (
        <main className="main-container">
            <Navbar togglePanel={togglePanel} />

            <Map
                markers={currentMarkers}
                currentLocation={currentLocation}
            />

            {showPanel &&
                <Routes>
                    <Route path="/" element={<Search />} />
                    <Route path="/favorites" element={<Favorites />} />
                    <Route path="/saved" element={<Saved />} />
                </Routes>
            }
        </main>
    );
}
