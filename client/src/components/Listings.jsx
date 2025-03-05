import React, { useEffect } from "react";
import "../styles/Listings.css";

export default function Listings(props) {
    const { listings } = props;

    useEffect(() => {
        console.log(listings);
    }, [listings]);

    return (
        <section className="listings-container">
            {listings.map(listing => (
                <div key={listing.id + "-listing"}>
                    <h3>{listing.name}</h3>
                    {listing.address}
                    <hr />

                    <div className="categories">
                        {listing.categories.map((category, index) => (
                            <span key={category.id} className="category">
                                {category.name}
                                {index < listing.categories.length - 1 && " • "}
                            </span>
                        ))}
                    </div>


                </div>
            ))}
        </section>
    );
}
