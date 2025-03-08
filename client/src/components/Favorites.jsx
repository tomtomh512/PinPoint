import React from "react";

export default function Favorites(props) {
    const { user } = props;

    return (
        <div className="favorites-container main-content-element">
            <h1> Favorites </h1>
            {user.id && user.username ?
                <>
                    {user.username}
                </>
                :
                <>
                    Log in plz
                </>
            }
        </div>
    );
}