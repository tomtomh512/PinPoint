import React, {useEffect} from "react";
import {Link} from "react-router-dom";
import httpClient from "../httpClient";
import "../styles/Profile.css";

export default function Profile(props) {
    const { user, setUser } = props;

    const logoutUser = async () => {
        await httpClient.post("http://localhost:5000/logout");

        window.location.reload();
    };

    useEffect(() => {
        (async() => {
            try {
                const response = await httpClient.get("http://localhost:5000/verify");

                setUser(response.data)
            } catch (error) {
                console.log("Not authenticated");
                setUser({ id: null, email: null }); // Explicitly reset user on failure
            }
        })();
    }, [setUser]);

    return (
        <div className="profile-container main-content-element">
            <h1> Profile </h1>

            {user.id && user.username ?
                <>
                    <h2> Welcome, {user.username} </h2>
                    <button onClick={logoutUser} className="logout-button"> Log Out</button>
                </>
                :
                <>
                    <h2> You are not logged in </h2>
                    <Link to="/login" className="login-button"> Login </Link>
                    <Link to="/register" className="register-link"> Register </Link>
                </>
            }
        </div>
    );
}