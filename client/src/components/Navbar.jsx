import React from "react";
import {Link} from "react-router-dom";
import "../styles/Navbar.css";
import MenuIcon from "../assets/menuIcon.png";
import SearchIcon from "../assets/magnifying-glass.png";
import HeartIcon from "../assets/heart.png";
import SavedIcon from "../assets/saved.png";

export default function Navbar(props) {
    const {togglePanel} = props;

    return (
        <div className="sidebar-container">
            <span className="navbar-link" onClick={togglePanel}>
                <img src={MenuIcon} alt="Toggle"/>
            </span>

            <Link to="/" className="navbar-link">
            <img src={SearchIcon} alt="Search"/>
            </Link>

            <Link to="/favorites" className="navbar-link">
                <img src={HeartIcon} alt="Favorites"/>
            </Link>

            <Link to="/saved" className="navbar-link">
                <img src={SavedIcon} alt="Saved"/>
            </Link>
        </div>
    );
}