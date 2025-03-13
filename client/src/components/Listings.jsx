import React, {useEffect, useState} from "react";
import "../styles/Listings.css";
import httpClient from "../httpClient";

export default function Listings(props) {
    const {
        user,
        mode,
        listings, setListings,
        selectedLocation, setSelectedLocation,
        setMessage
    } = props;

    const handleClick = async (listing) => {
        if (mode === "search") {
            setSelectedLocation(listing);
            return;
        }

        try {
            const response = await httpClient.get("http://localhost:5000/searchID", {
                params: {
                    id: listing.location_id
                },
            });

            setSelectedLocation(response.data.result);

        } catch (error) {
            console.error("Error fetching id:", error);
        }
    }

    const addFavorite = async (listing) => {
        if (!user.id || !user.username) {
            alert("Please log in to save to favorites");
            return;
        }

        try {
            await httpClient.post("http://localhost:5000/favorites", {
                location_name: listing.name,
                location_id: listing.location_id,
                address: listing.address,
                categories: listing.categories,
                lat: listing.lat,
                long: listing.long
            });

            setMessage(listing.name + " added to Favorites");

        } catch (error) {
            setMessage(error.response.data.error);
        }
    };

    const addPlanned = async (listing) => {
        if (!user.id || !user.username) {
            alert("Please log in to save to planned");
            return;
        }

        try {
            await httpClient.post("http://localhost:5000/planned", {
                location_name: listing.name,
                location_id: listing.location_id,
                address: listing.address,
                categories: listing.categories,
                lat: listing.lat,
                long: listing.long
            });

            setMessage(listing.name + " added to Planned");

        } catch (error) {
            setMessage(error.response.data.error);
        }
    };

    const removeFavorite = async (listing) => {
        if (!user.id || !user.username) {
            alert("Please log in to remove from favorites");
            return;
        }

        try {
            await httpClient.delete(`http://localhost:5000/favorites/${listing.id}`);

            setListings((prevListings) => prevListings.filter(item => item.id !== listing.id));
            setMessage(listing.name + " removed from Favorites");

        } catch (error) {
            console.error("Error removing from favorites:", error);
            alert("Something went wrong while removing from favorites.");
        }
    };

    const removePlanned = async (listing) => {
        if (!user.id || !user.username) {
            alert("Please log in to remove from planned");
            return;
        }

        try {
            await httpClient.delete(`http://localhost:5000/planned/${listing.id}`);

            setListings((prevListings) => prevListings.filter(item => item.id !== listing.id));
            setMessage(listing.name + " removed from Planned");

        } catch (error) {
            console.error("Error removing from planned:", error);
            alert("Something went wrong while removing from planned.");
        }
    };


    return (
        <section className="listings-container">
            {listings.map((listing) => (
                <div
                    key={listing.location_id + "-listing"}
                    className="listing-card"
                >
                    <div
                        className="clickable"
                        onClick={() => handleClick(listing)}
                    >

                        <h3 className="listing-name">{listing.name}</h3>
                        <p className="listing-address">{listing.address}</p>

                        <hr/>

                        <section className="categories">
                            {listing.categories.map((category, index) => (
                                <span key={listing.location_id + category.id} className="category">
                                    {category.name}
                                    {/* Puts dot between each category */}
                                    {index < listing.categories.length - 1 && " • "}
                                </span>
                            ))}
                        </section>

                        {/* If the current listing is the selected listing to be expanded */}
                        {listing.location_id === selectedLocation.location_id ?
                            <>
                                {/* This code block displays contact info */}
                                <section className="listing-info">
                                    {/* If the current listing has contacts */}
                                    {selectedLocation.contacts.length > 0 && <h3> Contacts </h3>}
                                    {/* Map out contacts. If contact is a website, add a link */}
                                    {selectedLocation.contacts.map((contact, index) => (
                                        <ul key={selectedLocation.location_id + "contact" + index}>
                                            {Object.entries(contact).map(([key, values]) =>
                                                values.map((item, itemIndex) => (
                                                    key === "www" ? (
                                                        <li key={item.value + itemIndex}>
                                                            <a href={item.value} target="_blank" rel="noopener noreferrer">
                                                                {item.value}
                                                            </a>
                                                        </li>
                                                    ) : (
                                                        <li key={item.value + itemIndex}>
                                                            {item.value}
                                                        </li>
                                                    )
                                                ))
                                            )}
                                        </ul>
                                    ))}
                                </section>

                                {/* This code block displays hours */}
                                {selectedLocation.hours[0] && selectedLocation.hours[0].text ?
                                    <section className="listing-info">
                                        <h3> Hours
                                            <span
                                                className="isOpen-indicator"
                                                style={{color: selectedLocation.hours[0] && selectedLocation.hours[0].isOpen ? 'green' : 'red'}}
                                            >
                                                 &nbsp; {selectedLocation.hours[0] && selectedLocation.hours[0].isOpen ? "Open" : "Closed"}
                                            </span>
                                        </h3>
                                        <ul>
                                            {selectedLocation.hours[0].text.map((hour, index) => (
                                                <li key={index + "hour"}> {hour} </li>
                                            ))}
                                        </ul>

                                    </section>
                                    :
                                    ""
                                }
                            </>
                            :
                            ""
                        }

                    </div>

                    <section className="button-container">
                        {mode === "search" ?
                            <>
                                <button className="list-button" onClick={() => addFavorite(listing)}> Favorite +</button>
                                <button className="list-button" onClick={() => addPlanned(listing)}> Planned +</button>
                            </>
                            :
                            <>
                                {mode === "favorite" ?
                                    <button className="list-button" onClick={() => removeFavorite(listing)}> Favorite
                                        -</button>
                                    :
                                    <button className="list-button" onClick={() => addFavorite(listing)}> Favorite +</button>
                                }
                                {mode === "planned" ?
                                    <button className="list-button" onClick={() => removePlanned(listing)}> Planned -</button>
                                    :
                                    <button className="list-button" onClick={() => addPlanned(listing)}> Planned +</button>
                                }
                            </>
                        }

                    </section>
                </div>
            ))}

            <br/>
        </section>
    );
}
