import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import httpClient from "../httpClient";

export default function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [alertMessage, setAlertMessage] = useState("");
    const navigate = useNavigate();

    const registerUser = async (event) => {
        event.preventDefault();

        if (password !== confirmPassword) {
            setAlertMessage("Passwords do not match");
            return;
        }

        try {
            await httpClient.post("http://localhost:5000/register", {
                username,
                password,
            });

            navigate("/profile");

        } catch (error) {
            setAlertMessage(error.response.data.message);
        }
    };

    return (
        <div className="register-container main-content-element">
            <h1> Register </h1>
            <form onSubmit={registerUser}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button>Register</button>
                <br />
                {alertMessage}
            </form>
        </div>
    );
}
