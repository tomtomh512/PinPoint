import React, {useEffect, useState} from "react";
import ExitIcon from "../assets/exitIcon.png";
import SearchIcon from "../assets/searchIcon.png";
import Listings from "./Listings";
import "../styles/Planned-Favorites.css";
import {Link} from "react-router-dom";
import httpClient from "../httpClient";

export default function Favorites(props) {
    const {
        user,
        setCurrentMarkers,
        selectedLocation, setSelectedLocation,
    } = props;

    const [searchFavoritesResults, setSearchFavoritesResults] = useState([]);
    const [message, setMessage] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
    };

    // Lets 'Enter' act as submit button
    function handleKeyDown(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            handleSubmit(event);
        }
    }

    useEffect(() => {
        const fetchFavorites = async () => {
            if (user.id && user.username) {
                try {
                    const response = await httpClient.get("http://localhost:5000/favorites");

                    setCurrentMarkers(response.data.results);
                    setSearchFavoritesResults(response.data.results);

                } catch (error) {
                    console.error("Error fetching favorites:", error);
                }
            }
        };

        fetchFavorites();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setMessage(""); // Clear the message after 2 seconds
        }, 3000);

        return () => clearTimeout(timer);
    }, [message]);

    return (
        <div className="favorites-container main-content-element">
            <h1> Favorites </h1>
            {user.id && user.username ?
                <>
                    {searchFavoritesResults.length === 0 ?
                        // If no results, display message, else show num results and render listings
                        <h3 className="no-results-message"> Nothing to display </h3>
                        :
                        <>
                            <span> {searchFavoritesResults.length} {searchFavoritesResults.length === 1 ? "result" : "results"} </span>
                            {message !== "" ? <p className="feedback-message"> {message} </p> : ""}
                            <Listings
                                user={user}
                                listings={searchFavoritesResults}
                                setListings={setSearchFavoritesResults}
                                selectedLocation={selectedLocation}
                                setSelectedLocation={setSelectedLocation}
                                setMessage={setMessage}
                            />
                        </>
                    }
                </>
                :
                <>
                    <h2> Log in to save to favorites </h2>
                    <Link to="/profile" className="login-logout-button"> Login </Link>
                </>
            }
        </div>
    );
}