import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { setAnimals } from "../redux/slices"; // Assuming this action exists in your Redux slices
import { jwtDecode } from "jwt-decode";


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

  // Fetch animals from the backend when the category changes
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

  // Initialize the first pair
  useEffect(() => {
    if (animals.length > 0) {
      setCurrentPair([animals[0], animals[1]]);
    }
  }, [animals]);

  const handleVote = async (selectedAnimal) => {
    try {
      // Retrieve the token silently
      const token = await getAccessTokenSilently();

      // Decode the token to extract the user ID
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.sub; // Assumes `sub` contains the user ID

      // Validate user ID and animal ID
      if (!userId || !selectedAnimal.id) {
        throw new Error("Missing user ID or animal ID.");
      }

      // Debugging: Log the vote data
      console.log("Submitting vote for:", {
        animal_id: selectedAnimal.id,
        user_id: userId,
      });

      // Make the API call to submit the vote
      const response = await axios.post("http://localhost:8000/submit-vote/", {
        animal_id: selectedAnimal.id,
        user_id: userId,
      });

      if (response.status === 200) {
        console.log("Vote recorded successfully");

        // Update the game state
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

          // Submit an additional vote for the final winner
          await axios.post("http://localhost:8000/submit-vote/", {
            animal_id: selectedAnimal.id,
            user_id: userId,
            vote_value: 2,
          });
        }
      }
    } catch (error) {
      console.error("Failed to submit vote:", error.response?.data?.error || error.message);
    }
  };


  // Loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Final winner display
  if (finalWinner) {
    return (
      <div>
        <h1>Final Winner: {finalWinner.name}</h1>
        <img src={`http://localhost:8000${finalWinner.image}`} alt={finalWinner.name} style={{ width: "300px" }} />
        <p>{finalWinner.description}</p>
        <button onClick={() => window.location.reload()}>Play Again</button>
      </div>
    );
  }

  // Main game render
  return (
    <div>
      <h1>Game - {category.charAt(0).toUpperCase() + category.slice(1)}</h1>
      {currentPair.length === 2 ? (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {currentPair.map((animal) => (
            <div key={animal.id} style={{ margin: "10px", textAlign: "center" }}>
              <img src={`http://localhost:8000${animal.image}`} alt={animal.name} style={{ width: "200px", borderRadius: "10px" }} />
              <h2>{animal.name}</h2>
              <p>{animal.description}</p>
              <button onClick={() => handleVote(animal)}>Select</button>
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
