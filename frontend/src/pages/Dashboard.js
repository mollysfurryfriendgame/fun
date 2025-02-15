import React from "react";
import { useDispatch } from "react-redux";
import { setCategory } from "../redux/slices";
import { useNavigate } from "react-router-dom";

import AuthButton from "../components/AuthButton";

function Dashboard() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleCategorySelect = (category) => {
        dispatch(setCategory(category)); // Set the selected category
        navigate("/leaderboard"); // Redirect to leaderboard
    };

    return (
        <div>
            {/* Container for Cards */}
            <div className="dashboard-cards" style={{
                display: "flex",
                justifyContent: "center",
                gap: "20px",
                flexWrap: "wrap" // Ensures responsiveness
            }}>

                {/* Game Categories */}
                {["dog", "cat", "horse", "bunbun"].map((category, index) => (
                    <div
                        key={index}
                        className="card"
                        style={{
                            textAlign: "center",
                            padding: "20px",
                            border: "1px solid #ccc",
                            borderRadius: "10px",
                            maxWidth: "250px", // Adjust for uniform width
                            boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.1)", // Soft shadow effect
                            backgroundColor: "#fff",
                        }}
                    >
                        {/* Play Game Button */}
                        <button
                            onClick={() => handleCategorySelect(category)}
                            style={{
                                backgroundColor: "#007bff",
                                color: "white",
                                padding: "10px 15px",
                                border: "none",
                                borderRadius: "5px",
                                cursor: "pointer",
                                fontSize: "16px",
                                marginBottom: "15px",
                                width: "100%", // Full width button
                            }}
                        >
                            Play {category.charAt(0).toUpperCase() + category.slice(1)} Game
                        </button>

                        {/* Winner Info */}
                        <h4 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "10px" }}>
                            Previous Month's Winner:
                        </h4>

                        {/* Winner Image */}
                        <img
                            src={`http://localhost:8000/media/upload_images/IMG_3815.jpeg`}
                            alt="Dog Winner"
                            style={{
                                width: "100%", // Make image fill the card width
                                height: "200px",
                                display: "block",
                                margin: "0 auto",
                                borderRadius: "10px",
                                objectFit: "cover",
                            }}
                        />

                        {/* Winner Details */}
                        <p style={{ fontSize: "18px", fontWeight: "bold", marginTop: "10px" }}>
                            Name: Moonie
                        </p>
                        <p>Submitted by: doakmath</p>
                        <p>Chosen Shelter: Austin Animal Shelter</p>
                        <p>Amount Donated: $X.XX</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Dashboard;
