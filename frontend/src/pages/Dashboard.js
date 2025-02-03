import React from "react";
import { useDispatch } from "react-redux";
import { setCategory } from "../redux/slices";
import { useNavigate } from "react-router-dom";

function Dashboard() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleCategorySelect = (category) => {
        dispatch(setCategory(category)); // Set the selected category
        navigate("/leaderboard"); // Redirect to leaderboard
    };

    return (
        <div>
            <h1>Dashboard</h1>
            <div>
                <button style={{ margin: "10px" }} onClick={() => handleCategorySelect("dog")}>
                    Play Dog Game
                </button>
                <button style={{ margin: "10px" }} onClick={() => handleCategorySelect("cat")}>
                    Play Cat Game
                </button>
                <button style={{ margin: "10px" }} onClick={() => handleCategorySelect("horse")}>
                    Play Horse Game
                </button>
                <button style={{ margin: "10px" }} onClick={() => handleCategorySelect("bunbun")}>
                    Play Bunbun Game
                </button>
            </div>
        </div>
    );
}

export default Dashboard;
