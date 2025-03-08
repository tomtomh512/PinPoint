import React from "react";
import "../styles/Search.css";
import SearchIcon from "../assets/searchIcon.png";
import ExitIcon from "../assets/exitIcon.png";
import Listings from "./Listings";
import httpClient from "../httpClient";

export default function Search(props) {
    const {
        user,
        searchInput, setSearchInput,
        searchResults, setSearchResults,
        setCurrentMarkers, currentLocation,
        selectedLocation, setSelectedLocation,
    } = props;

    // Calls API, takes coordinates and search query
    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await httpClient.get("http://localhost:5000/search", {
                params: {
                    lat: currentLocation.lat,
                    long: currentLocation.long,
                    search: searchInput,
                },
            });

            setCurrentMarkers(response.data.results);
            setSearchResults(response.data.results);

        } catch (error) {
            console.error("Error fetching search results:", error);
        }
    };

    // Lets 'Enter' act as submit button
    function handleKeyDown(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            handleSubmit(event);
        }
    }

    return (
        <div className="search-form-container  main-content-element">
            <h1> Search </h1>
            <form onSubmit={handleSubmit} className="search-form">
                <input
                    type="text"
                    name="search"
                    value={searchInput}
                    placeholder="Search"
                    onChange={(e) => {setSearchInput(e.target.value)}}
                    onKeyDown={handleKeyDown}
                />

                <button onClick={() => {setSearchInput("")}}>
                    <img src={ExitIcon} alt="X"/>
                </button>

                <button type="submit">
                    <img src={SearchIcon} alt="Search"/>
                </button>
            </form>

            {searchResults.length === 0 ?
                // If no results, display message, else show num results and render listings
                <h3 className="no-results-message"> Nothing to display </h3>
                :
                <>
                    <span> {searchResults.length} {searchResults.length === 1 ? "result" : "results"} </span>
                    <Listings
                        user={user}
                        listings={searchResults}
                        selectedLocation={selectedLocation}
                        setSelectedLocation={setSelectedLocation}
                    />
                </>
            }

        </div>
    );
}
