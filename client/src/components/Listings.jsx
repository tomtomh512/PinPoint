import React from "react";
import "../styles/Listings.css";

export default function Listings(props) {
    const { listings, setActiveMarker } = props;

    return (
        <section className="listings-container">
            {listings.map((listing) => (
                <div
                    key={listing.id + "-listing"}
                    className="listing-card"
                    onClick={() => setActiveMarker(listing.id)}
                >
                    <h3>{listing.name}</h3>
                    <p>{listing.address}</p>

                    <hr />

                    <div className="categories">
                        {listing.categories.map((category, index) => (
                            <span key={category.id} className="category">
                                {category.name}
                                {index < listing.categories.length - 1 && " • "}
                            </span>
                        ))}
                    </div>

                    <section className="button-container">
                        <button>Favorite +</button>
                        <button>Planned +</button>
                    </section>
                </div>
            ))}
        </section>
    );
}
