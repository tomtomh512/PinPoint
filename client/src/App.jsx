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
    // Placing in App.jsx to maintain persistence
    const [searchInput, setSearchInput] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    const [searchFavorites, setSearchFavorites] = useState("");
    const [searchFavoritesResults, setSearchFavoritesResults] = useState([]);

    const [searchPlanned, setSearchPlanned] = useState("");
    const [searchPlannedResults, setSearchPlannedResults] = useState([]);

    // Current markers on map
    const [currentMarkers, setCurrentMarkers] = useState([]);
    // Selected location, for expanding location card and highlighting marker
    const [selectedLocation, setSelectedLocation] = useState({});
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

    // Toggles panel
    const [showPanel, setShowPanel] = useState(true);
    const togglePanel = () => { setShowPanel(prev => !prev) }
    const togglePanelTrue = () => { setShowPanel(true) }

    // User info
    const [user, setUser] = useState({
        "id": null,
        "username": null
    })

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
                currentLocation={currentLocation}
                onViewChange={setCurrentLocation}
                selectedLocation={selectedLocation}
            />

            {showPanel &&
                <Routes>
                    <Route path="/" element={
                        <Search
                            user={user}
                            searchInput={searchInput}
                            setSearchInput={setSearchInput}
                            searchResults={searchResults}
                            setSearchResults={setSearchResults}
                            setCurrentMarkers={setCurrentMarkers}
                            currentLocation={currentLocation}
                            selectedLocation={selectedLocation}
                            setSelectedLocation={setSelectedLocation}
                        />
                    } />

                    <Route path="/profile" element={<Profile user={user} setUser={setUser} />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    <Route path="/favorites" element={
                        <Favorites
                            user={user}
                            searchFavorites={searchFavorites}
                            setSearchFavorites={setSearchFavorites}
                            searchFavoritesResults={searchFavoritesResults}
                            setSearchFavoritesResults={setSearchFavoritesResults}
                            setCurrentMarkers={setCurrentMarkers}
                            currentLocation={currentLocation}
                            selectedLocation={selectedLocation}
                            setSelectedLocation={setSelectedLocation}
                        />
                    } />

                    <Route path="/planned" element={
                        <Planned
                            user={user}
                            searchPlanned={searchPlanned}
                            setSearchPlanned={setSearchPlanned}
                            searchPlannedResults={searchPlannedResults}
                            setSearchPlannedResults={setSearchPlannedResults}
                            setCurrentMarkers={setCurrentMarkers}
                            currentLocation={currentLocation}
                            selectedLocation={selectedLocation}
                            setSelectedLocation={setSelectedLocation}
                        />
                    } />
                </Routes>
            }
        </main>
    );
}
