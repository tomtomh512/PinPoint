import React, {useEffect} from "react";
import {Link, useNavigate} from "react-router-dom";
import httpClient from "../httpClient";

export default function Profile(props) {
    const { user, setUser } = props;
    const navigate = useNavigate();

    const logoutUser = async () => {
        await httpClient.post("http://localhost:5000/logout");

        navigate("/");
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
                    <h1> Logged In! </h1>
                    <button onClick={logoutUser}> Log Out</button>
                </>
                :
                <>
                    <Link to="/login"> Login </Link>
                    <Link to="/register"> Register </Link>
                </>
            }
        </div>
    );
}