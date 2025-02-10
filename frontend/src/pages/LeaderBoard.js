import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Leaderboard.css";

function Leaderboard() {
  const animals = useSelector((state) => state.app.animals) || [];
  const selectedCategory = useSelector((state) => state.app.selectedCategory) || "dog";
  const isSuperUser = useSelector((state) => state.app.isSuperUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/leaderboard/${selectedCategory}`);
        dispatch({
          type: "app/setAnimals",
          payload: response.data,
        });
      } catch (error) {
        console.error("Failed to fetch leaderboard data:", error);
      }
    };

    fetchLeaderboard();
  }, [selectedCategory, dispatch]);

  const deleteAnimal = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:8000/delete-animal/${id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      dispatch({
        type: "app/setAnimals",
        payload: animals.filter((animal) => animal.id !== id),
      });
    } catch (error) {
      console.error("Failed to delete animal:", error);
    }
  };

  const handlePlayGame = () => {
    navigate(`/game/${selectedCategory}`);
  };

  return (
    <div className="leaderboard-container">
      <h1 className="leaderboard-title">
        Leaderboard - {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
      </h1>

      <div className="text-center mb-4">
        <button className="btn btn-primary" onClick={handlePlayGame}>
          Play Game
        </button>
      </div>

      {animals.length > 0 ? (
        <>
          <div className="top-three-container">
            {animals.slice(0, 3).map((animal, index) => (
              <div className="card top-card" key={animal.id}>
                <div className="rank-number">{index + 1}</div>
                <img
                  src={`http://localhost:8000${animal.image}`}
                  className="card-img-top"
                  alt={animal.name}
                />
                <div className="card-body">
                  <h5 className="card-title">{animal.name}</h5>
                  <p className="card-text">{animal.description}</p>
                  <p className="text-muted">Submitted by: {animal.user?.first_name || "Anonymous"}</p>
                  <p className="text-primary">Votes: {animal.votes}</p>
                  {isSuperUser && (
                    <button className="btn btn-danger mt-2" onClick={() => deleteAnimal(animal.id)}>
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <ol className="remaining-list">
            {animals.slice(3).map((animal, index) => (
              <li className="list-item" key={animal.id}>
                <span className="list-rank">{index + 4}.</span>
                <img
                  src={`http://localhost:8000${animal.image}`}
                  alt={animal.name}
                  className="list-image"
                />
                <span className="list-info">
                  <strong>{animal.name}</strong>
                  <p className="text-primary">Votes: {animal.votes}</p>
                </span>
                {isSuperUser && (
                  <button
                    className="btn btn-danger btn-sm delete-button"
                    onClick={() => deleteAnimal(animal.id)}
                  >
                    Delete
                  </button>
                )}
              </li>
            ))}
          </ol>
        </>
      ) : (
        <p className="text-center">No animals have been submitted yet.</p>
      )}
    </div>
  );
}

export default Leaderboard;
