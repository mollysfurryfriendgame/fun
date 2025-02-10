import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { setAnimals } from "../redux/slices"; // Assuming this action exists in your Redux slices
import { jwtDecode } from "jwt-decode";
import "./Game.css"; // Import the CSS file
import DonateButton from "../components/DonateButton";

const Game = () => {
  const [currentPair, setCurrentPair] = useState([]); // Stores the current pair of animals
  const [winners, setWinners] = useState([]); // Stores winners from the rounds
  const [finalWinner, setFinalWinner] = useState(null); // Stores the final winner
  const [round, setRound] = useState(1); // Tracks the current round
  const [loading, setLoading] = useState(true); // Loading state
  const { getAccessTokenSilently } = useAuth0();

  // Redux state and dispatch
  const category = useSelector((state) => state.app.selectedCategory); // Fetch selected category from Redux
  const animals = useSelector((state) => state.app.animals); // Fetch animals from Redux
  const dispatch = useDispatch(); // To dispatch actions

  useEffect(() => {
    const fetchAnimals = async () => {
      if (category) {
        try {
          const response = await axios.get(`http://localhost:8000/get-random-animals/${category}`);
          const shuffled = response.data.sort(() => 0.5 - Math.random()).slice(0, 6); // Shuffle and pick 6 random animals
          dispatch(setAnimals(shuffled)); // Store animals in Redux
          setLoading(false);
        } catch (error) {
          console.error("Failed to fetch animals:", error.response?.data?.error || error.message);
          setLoading(false);
        }
      }
    };

    fetchAnimals();
  }, [category, dispatch]);

  useEffect(() => {
    if (animals.length > 0) {
      setCurrentPair([animals[0], animals[1]]);
    }
  }, [animals]);

  const handleVote = async (selectedAnimal) => {
    try {
      let userId = null; // Default to null for anonymous users
      let token = null;

      // Attempt to get a token if the user is logged in
      try {
        token = await getAccessTokenSilently();
        const decodedToken = jwtDecode(token);
        userId = decodedToken.sub; // Extract user ID for authenticated users
      } catch (err) {
        console.log("No token found. This is an anonymous vote.");
      }

      // Send the vote to the backend
      const response = await axios.post("http://localhost:8000/submit-vote/", {
        animal_id: selectedAnimal.id,
        user_id: userId, // Null for anonymous users
      });

      if (response.status === 200) {
        console.log("Vote recorded successfully");

        if (round <= 2) {
          setWinners((prevWinners) => [...prevWinners, selectedAnimal]);

          const nextIndex = animals.indexOf(currentPair[1]) + 1;

          if (nextIndex < animals.length - 1) {
            setCurrentPair([animals[nextIndex], animals[nextIndex + 1]]);
          } else if (round === 1) {
            setAnimals(winners);
            setRound(2);
            setCurrentPair([winners[0], winners[1]]);
          } else if (round === 2) {
            setFinalWinner(selectedAnimal);
          }
        } else if (round === 3) {
          setFinalWinner(selectedAnimal);
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
      <>
      <div className="final-winner-container">
        <h1>Final Winner: {finalWinner.name}</h1>
        <img src={`http://localhost:8000${finalWinner.image}`} alt={finalWinner.name} className="final-winner-image" />
        <p>{finalWinner.description}</p>
        <button onClick={() => window.location.reload()}>Play Again</button>
      </div>
      </>
    );
  }

  return (
    <>
    <div className="game-container">
      <h1>Molly's  {category.charAt(0).toUpperCase() + category.slice(1)}  Game</h1>
      {currentPair.length === 2 ? (
        <div className="pair-container">
          {currentPair.map((animal) => (
            <div className="animal-card" key={animal.id}>
              <img
                src={`http://localhost:8000${animal.image}`}
                alt={animal.name}
                className="animal-image"
              />
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
    </>
  );
};

export default Game;
