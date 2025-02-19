// import React from "react";
// import { useDispatch } from "react-redux";
// import { setCategory } from "../redux/slices";
// import { useNavigate } from "react-router-dom";

// import AuthButton from "../components/AuthButton";

// function Dashboard() {
//     const dispatch = useDispatch();
//     const navigate = useNavigate();

//     const handleCategorySelect = (category) => {
//         dispatch(setCategory(category)); // Set the selected category
//         navigate("/leaderboard"); // Redirect to leaderboard
//     };

//     // Manually entered previous winners (until automated with a cron job)
//     const previousWinners = {
//         dog: {
//             name: "Moonie",
//             submittedBy: "doakmath",
//             shelter: "Austin Animal Shelter",
//             donation: "$X.XX",
//             image: "http://localhost:8000/media/upload_images/IMG_3815.jpeg",
//         },
//         cat: {
//             name: "Space Cat",
//             submittedBy: "catlover99",
//             shelter: "NYC Cat Rescue",
//             donation: "$Y.YY",
//             image: "http://localhost:8000/media/upload_images/SpaceCat.png",
//         },
//         horse: {
//             name: "Thunder",
//             submittedBy: "equestrian_girl",
//             shelter: "Wild Horse Sanctuary",
//             donation: "$Z.ZZ",
//             image: "http://localhost:8000/media/upload_images/horse.png",
//         },
//         bunbun: {
//             name: "Mr Bun Bun",
//             submittedBy: "matthewdoak369",
//             shelter: "Bunny Haven",
//             donation: "$A.AA",
//             image: "http://localhost:8000/media/upload_images/IMG_3875.jpeg",
//         },
//     };

//     return (
//         <div>
//             <div className="dashboard-cards" style={{
//                 display: "flex",
//                 justifyContent: "center",
//                 gap: "20px",
//                 flexWrap: "wrap",
//             }}>
//                 {/* Map over categories and use unique data for each */}
//                 {Object.keys(previousWinners).map((category, index) => (
//                     <div
//                         key={index}
//                         className="card"
//                         style={{
//                             textAlign: "center",
//                             padding: "20px",
//                             border: "1px solid #ccc",
//                             borderRadius: "10px",
//                             maxWidth: "250px",
//                             boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.1)",
//                             backgroundColor: "#fff",
//                         }}
//                     >
//                         {/* Play Game Button */}
//                         <button
//                             onClick={() => handleCategorySelect(category)}
//                             style={{
//                                 backgroundColor: "#007bff",
//                                 color: "white",
//                                 padding: "10px 15px",
//                                 border: "none",
//                                 borderRadius: "5px",
//                                 cursor: "pointer",
//                                 fontSize: "16px",
//                                 marginBottom: "15px",
//                                 width: "100%",
//                             }}
//                         >
//                             Play {category.charAt(0).toUpperCase() + category.slice(1)} Game
//                         </button>

//                         {/* Winner Info */}
//                         <h4 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "10px" }}>
//                             Previous Month's Winner:
//                         </h4>

//                         {/* Winner Image */}
//                         <img
//                             src={previousWinners[category].image}
//                             alt={`${category} Winner`}
//                             style={{
//                                 width: "100%",
//                                 height: "200px",
//                                 display: "block",
//                                 margin: "0 auto",
//                                 borderRadius: "10px",
//                                 objectFit: "cover",
//                             }}
//                         />

//                         {/* Winner Details */}
//                         <p style={{ fontSize: "18px", fontWeight: "bold", marginTop: "10px" }}>
//                             Name: {previousWinners[category].name}
//                         </p>
//                         <p>Submitted by: {previousWinners[category].submittedBy}</p>
//                         <p>Chosen Shelter: {previousWinners[category].shelter}</p>
//                         <p>Amount Donated: {previousWinners[category].donation}</p>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }

// export default Dashboard;



// import React, { useEffect, useState } from "react";
// import { useDispatch } from "react-redux";
// import { setCategory } from "../redux/slices";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// function Dashboard() {
//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//     const [currentWinners, setCurrentWinners] = useState(null);

//     useEffect(() => {
//         axios.get("http://localhost:8000/current-leaderboard-winners/")
//             .then(response => {
//                 setCurrentWinners(response.data);
//             })
//             .catch(error => {
//                 console.error("Error fetching current leaderboard winners:", error);
//             });
//     }, []);

//     const handleCategorySelect = (category) => {
//         dispatch(setCategory(category));
//         navigate("/leaderboard");
//     };

//     if (!currentWinners) {
//         return <p>Loading current winners...</p>;
//     }

//     return (
//         <div>
//             <div className="dashboard-cards" style={{
//                 display: "flex",
//                 justifyContent: "center",
//                 gap: "20px",
//                 flexWrap: "wrap",
//             }}>
//                 {Object.keys(currentWinners).map((category, index) => (
//                     <div
//                         key={index}
//                         className="card"
//                         style={{
//                             textAlign: "center",
//                             padding: "20px",
//                             border: "1px solid #ccc",
//                             borderRadius: "10px",
//                             maxWidth: "250px",
//                             boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.1)",
//                             backgroundColor: "#fff",
//                         }}
//                     >
//                         <button
//                             onClick={() => handleCategorySelect(category)}
//                             style={{
//                                 backgroundColor: "#007bff",
//                                 color: "white",
//                                 padding: "10px 15px",
//                                 border: "none",
//                                 borderRadius: "5px",
//                                 cursor: "pointer",
//                                 fontSize: "16px",
//                                 marginBottom: "15px",
//                                 width: "100%",
//                             }}
//                         >
//                             Play {category.charAt(0).toUpperCase() + category.slice(1)} Game
//                         </button>

//                         <h4 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "10px" }}>
//                             Current Leader:
//                         </h4>

//                         <img
//                             src={`http://localhost:8000${currentWinners[category].image}`}
//                             alt={`${category} Winner`}
//                             style={{
//                                 width: "100%",
//                                 height: "200px",
//                                 display: "block",
//                                 margin: "0 auto",
//                                 borderRadius: "10px",
//                                 objectFit: "cover",
//                             }}
//                         />
//                         {console.log(currentWinners[category].image)}

//                         <p style={{ fontSize: "18px", fontWeight: "bold", marginTop: "10px" }}>
//                             Name: {currentWinners[category].name}
//                         </p>
//                         <p>Submitted by: {currentWinners[category].submittedBy}</p>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }

// export default Dashboard;



import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setCategory } from "../redux/slices";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Dashboard() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [currentWinners, setCurrentWinners] = useState(null);

    useEffect(() => {
        axios.get("http://localhost:8000/current-leaderboard-winners/")
            .then(response => {
                setCurrentWinners(response.data);
            })
            .catch(error => {
                console.error("Error fetching current leaderboard winners:", error);
            });
    }, []);

    const handleCategorySelect = (category) => {
        dispatch(setCategory(category));
        navigate("/leaderboard");
    };

    if (!currentWinners) {
        return <p>Loading current winners...</p>;
    }

    // Manually entered previous winners
    const previousWinners = {
        dog: {
            name: "Moonie",
            submittedBy: "doakmath",
            shelter: "Austin Animal Shelter",
            donation: "$X.XX",
            image: "http://localhost:8000/media/upload_images/IMG_3815.jpeg",
        },
        cat: {
            name: "Space Cat",
            submittedBy: "catlover99",
            shelter: "NYC Cat Rescue",
            donation: "$Y.YY",
            image: "http://localhost:8000/media/upload_images/SpaceCat.png",
        },
        horse: {
            name: "Thunder",
            submittedBy: "equestrian_girl",
            shelter: "Wild Horse Sanctuary",
            donation: "$Z.ZZ",
            image: "http://localhost:8000/media/upload_images/horse.png",
        },
        bunbun: {
            name: "Mr Bun Bun",
            submittedBy: "matthewdoak369",
            shelter: "Bunny Haven",
            donation: "$A.AA",
            image: "http://localhost:8000/media/upload_images/IMG_3875.jpeg",
        },
    };

    return (
        <div>
            {/* 🔹 Current Winners Section */}
            <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Current Leaders</h2>
            <div className="dashboard-cards" style={{
                display: "flex",
                justifyContent: "center",
                gap: "20px",
                flexWrap: "wrap",
            }}>
                {Object.keys(currentWinners).map((category, index) => (
                    <div
                        key={index}
                        className="card"
                        style={{
                            textAlign: "center",
                            padding: "20px",
                            border: "1px solid #ccc",
                            borderRadius: "10px",
                            maxWidth: "250px",
                            boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.1)",
                            backgroundColor: "#fff",
                        }}
                    >
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
                                width: "100%",
                            }}
                        >
                            Play {category.charAt(0).toUpperCase() + category.slice(1)} Game
                        </button>

                        <h4 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "10px" }}>
                            Current Leader:
                        </h4>

                        <img
                            src={`http://localhost:8000${currentWinners[category].image}`}
                            alt={`${category} Winner`}
                            style={{
                                width: "100%",
                                height: "200px",
                                display: "block",
                                margin: "0 auto",
                                borderRadius: "10px",
                                objectFit: "cover",
                            }}
                        />

                        <p style={{ fontSize: "18px", fontWeight: "bold", marginTop: "10px" }}>
                            Name: {currentWinners[category].name}
                        </p>
                        <p>Submitted by: {currentWinners[category].submittedBy}</p>
                        <p>Current Votes: {currentWinners[category].votes}</p>
                    </div>
                ))}
            </div>

            {/* 🔹 Previous Winners Section */}
            <h2 style={{ textAlign: "center", margin: "40px 0 20px" }}>Previous Month's Winners</h2>
            <div className="dashboard-cards" style={{
                display: "flex",
                justifyContent: "center",
                gap: "20px",
                flexWrap: "wrap",
            }}>
                {Object.keys(previousWinners).map((category, index) => (
                    <div
                        key={index}
                        className="card"
                        style={{
                            textAlign: "center",
                            padding: "20px",
                            border: "1px solid #ccc",
                            borderRadius: "10px",
                            maxWidth: "250px",
                            boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.1)",
                            backgroundColor: "#fff",
                        }}
                    >
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
                                width: "100%",
                            }}
                        >
                            Play {category.charAt(0).toUpperCase() + category.slice(1)} Game
                        </button>

                        <h4 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "10px" }}>
                            Previous Month's Winner:
                        </h4>

                        <img
                            src={previousWinners[category].image}
                            alt={`${category} Winner`}
                            style={{
                                width: "100%",
                                height: "200px",
                                display: "block",
                                margin: "0 auto",
                                borderRadius: "10px",
                                objectFit: "cover",
                            }}
                        />

                        <p style={{ fontSize: "18px", fontWeight: "bold", marginTop: "10px" }}>
                            Name: {previousWinners[category].name}
                        </p>
                        <p>Submitted by: {previousWinners[category].submittedBy}</p>
                        <p>Chosen Shelter: {previousWinners[category].shelter}</p>
                        <p>Amount Donated: {previousWinners[category].donation}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Dashboard;
