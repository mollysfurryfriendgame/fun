import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';

function Leaderboard() {
    const animals = useSelector((state) => state.app.animals) || []; // Default to empty array
    const isSuperUser = useSelector((state) => state.app.isSuperUser); // Get isSuperUser state
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response = await axios.get('http://localhost:8000/leaderboard/dog');
                dispatch({
                    type: 'app/setAnimals', // Replace with your slice action
                    payload: response.data,
                });
            } catch (error) {
                console.error('Failed to fetch leaderboard data:', error);
            }
        };

        fetchLeaderboard();
    }, [dispatch]);

    const deleteAnimal = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:8000/delete-animal/${id}/`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                },
            });
            console.log(response.data);
            dispatch({
                type: 'app/setAnimals',
                payload: animals.filter((animal) => animal.id !== id), // Update Redux state
            });
        } catch (error) {
            console.error('Failed to delete animal:', error);
        }
    };

    return (
        <div>
            <h1>Leaderboard</h1>

            {/* Leaderboard Display */}
            {animals.length > 0 ? (
                <>
                    {/* Top 3 Animals */}
                    <div className="row mb-4">
                        {animals.slice(0, 3).map((animal) => (
                            <div className="col-md-4" key={animal.id}>
                                <div className="card">
                                    <img
                                        src={`http://localhost:8000${animal.image}`}
                                        className="card-img-top"
                                        alt={animal.name}
                                    />
                                    <div className="card-body">
                                        <h5 className="card-title">{animal.name}</h5>
                                        <p className="card-text">{animal.description}</p>
                                        <p className="text-muted">Submitted by: {animal.user_nickname.split('@')[0]}</p>
                                        <p className="text-primary">Votes: {animal.votes}</p>
                                        {/* Delete Button */}
                                        {isSuperUser && (
                                            <button
                                                className="btn btn-danger mt-2"
                                                onClick={() => deleteAnimal(animal.id)}
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Rest of the Leaderboard */}
                    <ol className="list-group">
                        {animals.slice(3).map((animal) => (
                            <li
                                className="list-group-item d-flex justify-content-between align-items-center"
                                key={animal.id}
                            >
                                <span>
                                    <img
                                        src={`http://localhost:8000${animal.image}`}
                                        alt={animal.name}
                                        style={{ width: '50px', marginRight: '10px' }}
                                    />
                                    {animal.name}
                                </span>
                                <span>
                                    Votes: {animal.votes}
                                    {/* Delete Button */}
                                    {isSuperUser && (
                                        <button
                                            className="btn btn-danger btn-sm ms-3"
                                            onClick={() => deleteAnimal(animal.id)}
                                        >
                                            Delete
                                        </button>
                                    )}
                                </span>
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

