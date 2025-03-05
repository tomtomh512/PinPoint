import React, {useState} from "react";
import "../styles/search.css";
import Mag from "../assets/magnifying-glass.png";
import X from "../assets/x.png";

export default function Search(props) {
    const { onCurrentMarkersChange } = props;

    const [searchInput, setSearchInput] = useState("");

    function handleSubmit(event) {
        event.preventDefault();

        const queryParams = new URLSearchParams({
            search: searchInput,
        }).toString();

        fetch(`/search?${queryParams}`)
            .then(res => res.json())
            .then(output => {
                onCurrentMarkersChange(output.results);
            })
    }

    function handleChange(event) {
        setSearchInput(event.target.value);
    }

    function handleClear() {
        setSearchInput(""); // Clear the search input
    }

    function handleKeyDown(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            handleSubmit(event);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="search-form">
            <input
                type="text"
                name="search"
                value={searchInput}
                placeholder="Search"
                onChange={handleChange}
                onKeyDown={handleKeyDown}
            />

            <button onClick={handleClear}>
                <img src={X} alt="X"/>
            </button>

            <button type="submit">
                <img src={Mag} alt="Search"/>
            </button>
        </form>
    );
}
