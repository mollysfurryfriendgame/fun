import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { setAnimals } from "../redux/slices";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import "./Game.css";

const Game = () => {
  const [currentPair, setCurrentPair] = useState([]);
  const [winners, setWinners] = useState([]); // Stores winners from Round 1
  const [finalists, setFinalists] = useState([]); // ✅ Stores the two finalists
  const [finalWinner, setFinalWinner] = useState(null);
  const [round, setRound] = useState(1);
  const [loading, setLoading] = useState(true);

  const { getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const category = useSelector((state) => state.app.selectedCategory);
  const animals = useSelector((state) => state.app.animals);

  const fetchAnimals = async () => {
    if (category) {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8000/get-random-animals/${category}`);
        const shuffled = response.data.sort(() => 0.5 - Math.random()).slice(0, 6);
        dispatch(setAnimals(shuffled));
        setCurrentPair([shuffled[0], shuffled[1]]);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch animals:", error.message);
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchAnimals();
  }, [category, dispatch]);

  const handleVote = async (selectedAnimal) => {
    try {
      let userId = null;
      let token = null;

      try {
        token = await getAccessTokenSilently();
        const decodedToken = jwtDecode(token);
        userId = decodedToken.sub;
      } catch (err) {
        console.log("No token found. This is an anonymous vote.");
      }

      await axios.post("http://localhost:8000/submit-vote/", {
        animal_id: selectedAnimal.id,
        user_id: userId,
      });

      if (round === 1) {
        setWinners((prevWinners) => [...prevWinners, selectedAnimal]);
        const nextIndex = animals.indexOf(currentPair[1]) + 1;
        if (nextIndex < animals.length - 1) {
          setCurrentPair([animals[nextIndex], animals[nextIndex + 1]]);
        } else {
          setRound(2);
          setCurrentPair([winners[0], winners[1]]);
        }
      } else if (round === 2) {
        setFinalists((prevFinalists) => [...prevFinalists, selectedAnimal]);
        if (finalists.length === 0) {
          setCurrentPair([selectedAnimal, winners[2]]);
        } else {
          setFinalWinner(selectedAnimal);
          await axios.post("http://localhost:8000/submit-vote/", {
            animal_id: selectedAnimal.id,
            user_id: userId,
          });
          console.log(`Bonus vote awarded to ${selectedAnimal.name}`);
        }
      }
    } catch (error) {
      console.error("Failed to submit vote:", error.response?.data?.error || error.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (finalWinner) {
    return (
      <div className="final-winner-container">
        <h1>Final Winner: {finalWinner.name}</h1>
        <img src={`http://localhost:8000${finalWinner.image}`} alt={finalWinner.name} className="final-winner-image" />
        <p>{finalWinner.description}</p>
        <button
          onClick={() => {
            setFinalWinner(null);
            setWinners([]);
            setFinalists([]);
            setRound(1);
            fetchAnimals();
          }}
          className="game-button"
          style={{ marginBottom: "10px" }}
        >
          Play Again
        </button>
        <button onClick={() => navigate(`/leaderboard/`)} className="game-button">
          See Leaderboard
        </button>
      </div>
    );
  }

  return (
    <div className="game-container">
      <h1>Molly's {category.charAt(0).toUpperCase() + category.slice(1)} Game</h1>
      {currentPair.length === 2 ? (
        <div className="pair-container">
          {currentPair.map((animal) => (
            <div className="animal-card" key={animal.id}>
              <img src={`http://localhost:8000${animal.image}`} alt={animal.name} className="animal-image" />
              <h2>{animal.name}</h2>
              <p>{animal.description}</p>
              <button className="vote-button" onClick={() => handleVote(animal)}>Select</button>
            </div>
          ))}
        </div>
      ) : (
        <p>No more pairs available.</p>
      )}
    </div>
  );
};

export default Game;
