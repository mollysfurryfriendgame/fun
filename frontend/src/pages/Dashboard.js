import React from "react";
import { useDispatch } from "react-redux";
import { setCategory } from "../redux/slices";
import { useNavigate } from "react-router-dom";
import  DonateButton from "../components/DonateButton";

function Dashboard() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleCategorySelect = (category) => {
        dispatch(setCategory(category)); // Set the selected category
        navigate("/leaderboard"); // Redirect to leaderboard
    };

    return (
        <div>
            {/* <h1>Molly's Furry Friend Game</h1> */}

        {/* PayPal Donate Button (Styled like Original, Opens in New Window) */}
        <div style={{ marginBottom: "20px", textAlign: "center" }}>
            <DonateButton />
        </div>



            <div className="dashboard-cards" style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
                {/* Category cards */}
                <div className="card" style={{ textAlign: "center", padding: "20px", border: "1px solid #ccc" }}>
                    <button onClick={() => handleCategorySelect("dog")}>Play Dog Game</button>
                    <h4>Previous Month's Winner:</h4>
                    <img src="https://via.placeholder.com/150" alt="Dog Winner" style={{ width: "100px", height: "100px" }} />
                    <p>Chosen Shelter: </p>
                </div>
                <div className="card" style={{ textAlign: "center", padding: "20px", border: "1px solid #ccc" }}>
                    <button onClick={() => handleCategorySelect("cat")}>Play Cat Game</button>
                    <h4>Previous Month's Winner:</h4>
                    <img src="https://via.placeholder.com/150" alt="Cat Winner" style={{ width: "100px", height: "100px" }} />
                    <p>Chosen Shelter: </p>
                </div>
                <div className="card" style={{ textAlign: "center", padding: "20px", border: "1px solid #ccc" }}>
                    <button onClick={() => handleCategorySelect("horse")}>Play Horse Game</button>
                    <h4>Previous Month's Winner:</h4>
                    <img src="https://via.placeholder.com/150" alt="Horse Winner" style={{ width: "100px", height: "100px" }} />
                    <p>Chosen Shelter: </p>
                </div>
                <div className="card" style={{ textAlign: "center", padding: "20px", border: "1px solid #ccc" }}>
                    <button onClick={() => handleCategorySelect("bunbun")}>Play Bunbun Game</button>
                    <h4>Previous Month's Winner:</h4>
                    <img src="https://via.placeholder.com/150" alt="Bunbun Winner" style={{ width: "100px", height: "100px" }} />
                    <p>Chosen Shelter: </p>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
