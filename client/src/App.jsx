import React, {useEffect, useState} from 'react';
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Profile from "./components/Profile";
import Search from "./components/Search";
import Favorites from "./components/Favorites";
import Planned from "./components/Planned";
import Map from "./components/Map";
import Login from "./components/Login";
import Register from "./components/Register";
import httpClient from "./httpClient";
import "./style.css";

export default function App() {

    // Keep track of page inputs
    const [searchInput, setSearchInput] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    // Current markers on map
    const [currentMarkers, setCurrentMarkers] = useState([]);
    // Selected location, for expanding location card and highlighting marker
    const [selectedLocation, setSelectedLocation] = useState({});
    // Current coordinates of map view
    const [userLocation, setUserLocation] = useState({
        "lat": 40.730610,
        "long": -73.935242,
    });

    // Ask for location
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
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

    // Toggles panel
    const [showPanel, setShowPanel] = useState(true);
    const togglePanel = () => { setShowPanel(prev => !prev) }
    const togglePanelTrue = () => { setShowPanel(true) }

    // User info
    const [user, setUser] = useState({
        "id": null,
        "username": null
    })

    // Verify user
    useEffect(() => {
        const verifyUser = async () => {
            try {
                const response = await httpClient.get("http://localhost:5000/verify");
                setUser(response.data);

            } catch (error) {
                console.error("Authentication failed:", error.message);
                setUser({ id: null, email: null });
            }
        };

        verifyUser();
    }, []);


    return (
        <main className="main-container">
            <Navbar
                togglePanel={togglePanel}
                togglePanelTrue={togglePanelTrue}
                showPanel={showPanel}
            />

            <Map
                markers={currentMarkers}
                userLocation={userLocation}
                onViewChange={setUserLocation}
                selectedLocation={selectedLocation}
                setSelectedLocation={setSelectedLocation}
                togglePanelTrue={togglePanelTrue}
            />

            {showPanel &&
                <Routes>
                    <Route path="/" element={
                        <Search
                            user={user}
                            setCurrentMarkers={setCurrentMarkers}
                            userLocation={userLocation}
                            selectedLocation={selectedLocation}
                            setSelectedLocation={setSelectedLocation}
                            searchInput={searchInput}
                            setSearchInput={setSearchInput}
                            searchResults={searchResults}
                            setSearchResults={setSearchResults}
                        />
                    } />

                    <Route path="/profile" element={
                        <Profile
                            user={user}
                            setUser={setUser}
                            setCurrentMarkers={setCurrentMarkers}
                        />
                    } />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    <Route path="/favorites" element={
                        <Favorites
                            user={user}
                            setCurrentMarkers={setCurrentMarkers}
                            selectedLocation={selectedLocation}
                            setSelectedLocation={setSelectedLocation}
                        />
                    } />

                    <Route path="/planned" element={
                        <Planned
                            user={user}
                            setCurrentMarkers={setCurrentMarkers}
                            selectedLocation={selectedLocation}
                            setSelectedLocation={setSelectedLocation}
                        />
                    } />
                </Routes>
            }
        </main>
    );
}
