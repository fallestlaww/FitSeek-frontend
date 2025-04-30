import React, { useState } from 'react';
import axios from 'axios';
import authService from '../../api/auth';
import '../../css/RecommendationManager.css';

const GenderExerciseFetcher = () => {
  const [gender, setGender] = useState('');
  const [exercises, setExercises] = useState([]);
  const [error, setError] = useState('');

  const genderOptions = ['Male', 'Female'];

  const fetchExercisesByGender = async () => {
    try {
      const user = authService.getCurrentUser();
      const token = user?.token;

      if (!token) {
        setError('User is not authenticated');
        return;
      }

      const response = await axios.post(
        'http://localhost:9060/gender',
        { name: gender },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      setExercises(response.data);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to fetch exercises by gender');
      setExercises([]);
    }
  };

  return (
    <div className="recommendation-container">
      <h2>Find Exercises by Gender</h2>

      <div className="recommendation-form">
        <label>Select Gender:</label>
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="recommendation-input"
        >
          {genderOptions.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>

        <button onClick={fetchExercisesByGender} className="recommendation-button">
          Get Exercises
        </button>
      </div>

      {error && <p className="recommendation-error">{error}</p>}

      {exercises.length > 0 && (
        <div className="exercise-cards">
          {exercises.map((ex, index) => (
            <div key={index} className="exercise-card">
              <h4>{ex.name}</h4>
              <p>
                <strong>Muscle:</strong> {ex.muscle?.name}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GenderExerciseFetcher;
