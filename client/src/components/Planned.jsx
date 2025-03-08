import React from "react";
import ExitIcon from "../assets/exitIcon.png";
import SearchIcon from "../assets/searchIcon.png";
import Listings from "./Listings";
import "../styles/Planned-Favorites.css";

export default function Planned(props) {
    const {
        user,
        searchPlanned, setSearchPlanned,
        searchPlannedResults, setSearchPlannedResults,
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
        <div className="planned-container main-content-element">
            <h1> Planned </h1>
            {user.id && user.username ?
                <>
                    <form onSubmit={handleSubmit} className="search-form">
                        <input
                            type="text"
                            name="search"
                            value={searchPlanned}
                            placeholder="Search"
                            onChange={(e) => {setSearchPlanned(e.target.value)}}
                            onKeyDown={handleKeyDown}
                        />

                        <button onClick={() => {setSearchPlanned("")}} >
                            <img src={ExitIcon} alt="X"/>
                        </button>

                        <button type="submit">
                            <img src={SearchIcon} alt="Search"/>
                        </button>
                    </form>

                    {searchPlannedResults.length === 0 ?
                        // If no results, display message, else show num results and render listings
                        <h3 className="no-results-message"> Nothing to display </h3>
                        :
                        <>
                            <span> {searchPlannedResults.length} {searchPlannedResults.length === 1 ? "result" : "results"} </span>
                            <Listings
                                user={user}
                                listings={searchPlannedResults}
                                selectedLocation={selectedLocation}
                                setSelectedLocation={setSelectedLocation}
                            />
                        </>
                    }
                </>
                :
                <>
                    Log in plz
                </>
            }
        </div>
    );
}