import React from "react";
import "../styles/Listings.css";

export default function Listings(props) {
    const { listings, selectedLocation, setSelectedLocation } = props;

    // Function to format phone number
    const formatPhoneNumber = (phone) => {
        // Remove non-digit characters (if any)
        phone = phone.replace(/\D/g, '');

        // Format the phone number
        return phone.replace(/^(\d{1})(\d{3})(\d{3})(\d{4})$/, '+$1 $2-$3-$4');
    };

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

                        <section className="contacts">
                            {/* If the current listing has contacts */}
                            {listing.contacts.length > 0 && <h3> Contacts </h3> }
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
                                            ) : key === "phone" ? (
                                                <li key={item.value + itemIndex}>
                                                    {formatPhoneNumber(item.value)}
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

                        :
                        ""
                    }

                    <section className="button-container">
                        <button className="favorite-button"> Favorite +</button>
                        <button className="planned-button"> Planned +</button>
                    </section>
                </div>
            ))}
            <br/>
        </section>
    );
}
