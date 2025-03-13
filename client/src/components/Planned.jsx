import React, {useEffect, useState} from "react";
import ExitIcon from "../assets/exitIcon.png";
import SearchIcon from "../assets/searchIcon.png";
import Listings from "./Listings";
import "../styles/Planned-Favorites.css";
import {Link} from "react-router-dom";
import httpClient from "../httpClient";

export default function Planned(props) {
    const {
        user,
        setCurrentMarkers,
        selectedLocation, setSelectedLocation,
        searchPlanned, setSearchPlanned
    } = props;

    const [searchPlannedResults, setSearchPlannedResults] = useState([]);
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
        const fetchPlanned = async () => {
            if (user.id && user.username) {
                try {
                    const response = await httpClient.get("http://localhost:5000/planned");

                    setCurrentMarkers(response.data.results);
                    setSearchPlannedResults(response.data.results);

                } catch (error) {
                    console.error("Error fetching planned locations:", error);
                }
            }
        };

        fetchPlanned();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setMessage(""); // Clear the message after 2 seconds
        }, 3000);

        return () => clearTimeout(timer);
    }, [message]);

    return (
        <div className="planned-container main-content-element">
            <h1> Planned </h1>
            {user.id && user.username ?
                <>
                    {/*<form onSubmit={handleSubmit} className="search-form">*/}
                    {/*    <input*/}
                    {/*        type="text"*/}
                    {/*        name="search"*/}
                    {/*        value={searchPlanned}*/}
                    {/*        placeholder="Search"*/}
                    {/*        onChange={(e) => {setSearchPlanned(e.target.value)}}*/}
                    {/*        onKeyDown={handleKeyDown}*/}
                    {/*    />*/}

                    {/*    <button onClick={() => {setSearchPlanned("")}} >*/}
                    {/*        <img src={ExitIcon} alt="X"/>*/}
                    {/*    </button>*/}

                    {/*    <button type="submit">*/}
                    {/*        <img src={SearchIcon} alt="Search"/>*/}
                    {/*    </button>*/}
                    {/*</form>*/}

                    {searchPlannedResults.length === 0 ?
                        // If no results, display message, else show num results and render listings
                        <h3 className="no-results-message"> Nothing to display </h3>
                        :
                        <>
                            <span> {searchPlannedResults.length} {searchPlannedResults.length === 1 ? "result" : "results"} </span>
                            {message !== "" ? <p className="feedback-message"> {message} </p> : ""}
                            <Listings
                                user={user}
                                mode="planned"
                                listings={searchPlannedResults}
                                setListings={setSearchPlannedResults}
                                selectedLocation={selectedLocation}
                                setSelectedLocation={setSelectedLocation}
                                setMessage={setMessage}
                            />
                        </>
                    }
                </>
                :
                <>
                    <h2> Log in to save to planned </h2>
                    <Link to="/profile" className="login-logout-button"> Login </Link>
                </>
            }
        </div>
    );
}