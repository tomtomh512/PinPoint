import React, {useState} from "react";
import "../styles/Search.css";
import Mag from "../assets/searchIcon.png";
import X from "../assets/exitIcon.png";
import Listings from "./Listings";

export default function Search(props) {
    const { onCurrentMarkersChange, currentLocation } = props;

    const [searchInput, setSearchInput] = useState("");
    const [searchResults, setSearchResults] = useState([]);

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
                onCurrentMarkersChange(output.results);
                setSearchResults(output.results);
            })
    }

    function handleSearchChange(event) {
        setSearchInput(event.target.value);
    }

    function handleClear() {
        setSearchInput(""); // Clear the search input
    }

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
                    <img src={X} alt="X"/>
                </button>

                <button type="submit">
                    <img src={Mag} alt="Search"/>
                </button>
            </form>

            {searchResults.length !== 0 &&
                <span>
                    {searchResults.length} {searchResults.length === 1 ? "result" : "results"}
                </span>
            }

            <Listings listings={searchResults} />

        </div>

    );
}
