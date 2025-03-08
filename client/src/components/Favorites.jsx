import React from "react";
import ExitIcon from "../assets/exitIcon.png";
import SearchIcon from "../assets/searchIcon.png";
import Listings from "./Listings";
import "../styles/Planned-Favorites.css";
import {Link} from "react-router-dom";

export default function Favorites(props) {
    const {
        user,
        searchFavorites, setSearchFavorites,
        searchFavoritesResults, setSearchFavoritesResults,
        setCurrentMarkers, currentLocation,
        selectedLocation, setSelectedLocation,
    } = props;

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

    return (
        <div className="favorites-container main-content-element">
            <h1> Favorites </h1>
            {user.id && user.username ?
                <>
                    <form onSubmit={handleSubmit} className="search-form">
                        <input
                            type="text"
                            name="search"
                            value={searchFavorites}
                            placeholder="Search"
                            onChange={(e) => {setSearchFavorites(e.target.value)}}
                            onKeyDown={handleKeyDown}
                        />

                        <button onClick={() => {setSearchFavorites("")}} >
                            <img src={ExitIcon} alt="X"/>
                        </button>

                        <button type="submit">
                            <img src={SearchIcon} alt="Search"/>
                        </button>
                    </form>

                    {searchFavoritesResults.length === 0 ?
                        // If no results, display message, else show num results and render listings
                        <h3 className="no-results-message"> Nothing to display </h3>
                        :
                        <>
                            <span> {searchFavoritesResults.length} {searchFavoritesResults.length === 1 ? "result" : "results"} </span>
                            <Listings
                                user={user}
                                listings={searchFavoritesResults}
                                selectedLocation={selectedLocation}
                                setSelectedLocation={setSelectedLocation}
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