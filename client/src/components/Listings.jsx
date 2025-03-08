import React from "react";
import "../styles/Listings.css";

export default function Listings(props) {
    const { user, listings, selectedLocation, setSelectedLocation } = props;

    const addFavorite = (listing) => {
        if (!user.id || !user.username) {
            alert("Please log in to save to favorites")
        }
        console.log("Favorite " + listing);
    }

    const addPlanned = (listing) => {
        if (!user.id || !user.username) {
            alert("Please log in to save to favorites")
        }
        console.log("Planned " + listing);
    }

    return (
        <section className="listings-container">
            {listings.map((listing) => (
                <div
                    key={listing.id + "-listing"}
                    className="listing-card"
                    onClick={() => setSelectedLocation(listing)}
                >
                    <h3>{listing.name}</h3>
                    <p>{listing.address}</p>

                    <hr />

                    <section className="categories">
                        {listing.categories.map((category, index) => (
                            <span key={listing.id + category.id} className="category">
                                {category.name}
                                {/* Puts dot between each category */}
                                {index < listing.categories.length - 1 && " • "}
                            </span>
                        ))}
                    </section>

                    <br />

                    {/* If the current listing is the selected listing to be expanded */}
                    {listing.id === selectedLocation.id ?
                        <>
                            <section className="listing-list">
                                {/* If the current listing has contacts */}
                                {listing.contacts.length > 0 && <h3> Contacts </h3>}
                                {/* Map out contacts. If contact is a website, add a link */}
                                {listing.contacts.map((contact, index) => (
                                    <ul key={listing.id + "contact" + index}>
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
