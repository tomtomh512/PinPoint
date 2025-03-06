import React from "react";
import "../styles/Search.css";
import SearchIcon from "../assets/searchIcon.png";
import ExitIcon from "../assets/exitIcon.png";
import Listings from "./Listings";

export default function Search(props) {
    const {
        setCurrentMarkers, currentLocation,
        searchInput, setSearchInput,
        searchResults, setSearchResults,
        activeMarker, setActiveMarker
    } = props;

    // Moved to app.jsx
    // const [searchInput, setSearchInput] = useState("");
    // const [searchResults, setSearchResults] = useState([]);

    // Calls API, takes coordinates and search query
    function handleSubmit(event) {
        event.preventDefault();

        const queryParams = new URLSearchParams({
            lat: currentLocation.lat,
            long: currentLocation.long,
            search: searchInput,
        }).toString();

        fetch(`/search?${queryParams}`)
            .then(res => res.json())
            .then(output => {
                setCurrentMarkers(output.results);
                setSearchResults(output.results);
            })
    }

    // Warning if not included
    function handleSearchChange(event) {
        setSearchInput(event.target.value);
    }

    // Clears the search input
    function handleClear() {
        setSearchInput("");
    }

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
                    onChange={handleSearchChange}
                    onKeyDown={handleKeyDown}
                />

                <button onClick={handleClear}>
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
                        listings={searchResults}
                        activeMarker={activeMarker}
                        setActiveMarker={setActiveMarker}
                    />
                </>
            }

        </div>
    );
}
