import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const LocalStorageDisplay = () => {
    const [storedData, setStoredData] = useState(null);
    const [allData, setAllData] = useState([]);
    const [decodedToken, setDecodedToken] = useState(null);

    useEffect(() => {
        // Retrieve specific key---must add it below:
        const specificData = localStorage.getItem("is_superuser");
        setStoredData(specificData ? JSON.parse(specificData) : "No Data Found");

        // Retrieve all localStorage items
        const keys = Object.keys(localStorage);
        const allStorageData = keys.map(key => ({
            key,
            value: localStorage.getItem(key),
        }));
        setAllData(allStorageData);

        // Decode access_token if it exists
        const accessToken = localStorage.getItem("access_token");
        if (accessToken) {
            try {
                const decoded = jwtDecode(accessToken); // Decode the JWT
                setDecodedToken(decoded);
            } catch (err) {
                console.error("Failed to decode token:", err);
            }
        }
    }, []);

    return (
        <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
        {/* Decoded Access Token (Formatted) */}
        {decodedToken && (
            <div style={cardStyle}>
                <h2 style={titleStyle}>User Information (Formatted)</h2>
                <ul>
                    {decodedToken["https://mffg-api/nickname"] && (
                        <li>
                            <strong>Nickname:</strong> {decodedToken["https://mffg-api/nickname"]}
                        </li>
                    )}
                    {decodedToken["https://mffg-api/email"] && (
                        <li>
                            <strong>Email:</strong> {decodedToken["https://mffg-api/email"]}
                        </li>
                    )}
                    {decodedToken["https://mffg-api/is_staff"] && (
                        <li>
                            <strong>Is Staff:</strong> {decodedToken["https://mffg-api/is_staff"] ? "Yes" : "No"}
                        </li>
                    )}
                    {decodedToken.sub && (
                        <li>
                            <strong>Auth0 ID:</strong> {decodedToken.sub}
                        </li>
                    )}
                </ul>
            </div>
        )}


            {/* Specific Data Card */}
            <div style={cardStyle}>
                <h2 style={titleStyle}>Stored Data (single key: is_superuser)</h2>
                <pre style={preStyle}>{JSON.stringify(storedData, null, 2)}</pre>
            </div>


            {/* All Local Storage Data Card */}
            <div style={cardStyle}>
                <h2 style={titleStyle}>All Local Storage Data</h2>
                {allData.length > 0 ? (
                    <ul>
                        {allData.map((item, index) => (
                            <li key={index}>
                                <strong>{item.key}:</strong> {item.value}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No localStorage data found.</p>
                )}
            </div>


            {/* Decoded Access Token (Raw) */}
            {decodedToken && (
                <div style={cardStyle}>
                    <h2 style={titleStyle}>Decoded Access Token (Raw)</h2>
                    <pre style={preStyle}>{JSON.stringify(decodedToken, null, 2)}</pre>
                </div>
            )}

        </div>
    );
};

// Basic Styling for Cards
const cardStyle = {
    backgroundColor: "#f9f9f9",
    padding: "15px",
    marginBottom: "15px",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
};

const titleStyle = {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "10px",
};

const preStyle = {
    backgroundColor: "#eee",
    padding: "10px",
    borderRadius: "5px",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
};

export default LocalStorageDisplay;
