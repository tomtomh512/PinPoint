import React from "react";
import "../styles/Listings.css";
import httpClient from "../httpClient";

export default function Listings(props) {
    const { user, listings, selectedLocation, setSelectedLocation } = props;

    const addFavorite = async (listing) => {
        if (!user.id || !user.username) {
            alert("Please log in to save to favorites");
            return; // Stop the function execution here if the user isn't logged in
        }

        try {
            await httpClient.post("http://localhost:5000/favorites", {
                user_id: user.id,
                location_name: listing.name,
                location_id: listing.location_id,
                address: listing.address,
                categories: listing.categories,
            });

            alert("Location added to favorites!");
        } catch (error) {
            console.error("Error adding to favorites:", error);
            alert("Something went wrong while adding to favorites.");
        }
    };

    const addPlanned = async (listing) => {
        if (!user.id || !user.username) {
            alert("Please log in to save to planned");
            return; // Stop the function execution here if the user isn't logged in
        }

        try {
            await httpClient.post("http://localhost:5000/planned", {
                user_id: user.id,
                location_name: listing.name,
                location_id: listing.location_id,
                address: listing.address,
                categories: listing.categories,
            });

            alert("Location added to planned!");
        } catch (error) {
            console.error("Error adding to planned:", error);
            alert("Something went wrong while adding to planned.");
        }
    };

    return (
        <section className="listings-container">
            {listings.map((listing) => (
                <div
                    key={listing.location_id + "-listing"}
                    className="listing-card"
                    onClick={() => setSelectedLocation(listing)}
                >
                    <h3>{listing.name}</h3>
                    <p>{listing.address}</p>

                    <hr />

                    <section className="categories">
                        {listing.categories.map((category, index) => (
                            <span key={listing.location_id + category.id} className="category">
                                {category.name}
                                {/* Puts dot between each category */}
                                {index < listing.categories.length - 1 && " • "}
                            </span>
                        ))}
                    </section>

                    <br />

                    {/* If the current listing is the selected listing to be expanded */}
                    {listing.location_id === selectedLocation.location_id ?
                        <>
                            <section className="listing-list">
                                {/* If the current listing has contacts */}
                                {listing.contacts.length > 0 && <h3> Contacts </h3>}
                                {/* Map out contacts. If contact is a website, add a link */}
                                {listing.contacts.map((contact, index) => (
                                    <ul key={listing.location_id + "contact" + index}>
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

                            {listing.hours[0] && listing.hours[0].text ?
                                <section className="listing-list">
                                    <h3> Hours </h3>
                                    <ul>
                                        {listing.hours[0].text.map((hour, index) => (
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

                    <section className="listing-footer">
                        <div
                            className="isOpen-indicator"
                            style={{color: listing.hours[0] && listing.hours[0].isOpen ? 'green' : 'red'}}
                        >
                            {listing.hours[0] && listing.hours[0].isOpen ? "Open" : "Closed"}
                        </div>
                        <div className="button-container">
                            <button className="favorite-button" onClick={() => addFavorite(listing)}> Favorite + </button>
                            <button className="planned-button" onClick={() => addPlanned(listing)}> Planned + </button>
                        </div>
                    </section>

                </div>
            ))}
            <br/>
        </section>
    );
}
