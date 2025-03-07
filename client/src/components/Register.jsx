import React, {useState} from 'react';
import { useNavigate } from "react-router-dom";
import httpClient from "../httpClient";

export default function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const registerUser = async (event) => {
        event.preventDefault();

        try {
            await httpClient.post("http://localhost:5000/register", {
                username,
                password,
            });

            navigate("/profile");

        } catch (error) {
            if (error.response.status === 401) {
                alert("Invalid credentials");
            }
        }


    }

    return (
        <div className="register-container main-content-element">
            <h1> Register </h1>
            <form onSubmit={registerUser}>
                <input
                    type="text"
                    placeholder="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    id=""
                />
                <input
                    type="password"
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    id=""
                />
                <button> Register</button>
            </form>
        </div>
    );
}
