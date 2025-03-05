import React from "react";
import "../styles/Listings.css";

export default function Listings(props) {
    const {listings} = props;

    return (
        <section className="listings-container">
            {listings.map((listing, index) => (
                <div key={index}>
                    <h3> {listing.name} </h3>
                    {listing.address}
                </div>
            ))}
        </section>
    );
}
