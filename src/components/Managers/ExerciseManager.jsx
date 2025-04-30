import React, { useState } from 'react';
import axios from 'axios';
import authService from '../../api/auth';
import '../../css/RecommendationManager.css';

const ExerciseManager = () => {
  const [exerciseId, setExerciseId] = useState('');
  const [exerciseData, setExerciseData] = useState(null);
  const [error, setError] = useState('');
  const [updatedExercise, setUpdatedExercise] = useState({});

  const muscleOptions = ['Chest', 'Back', 'Legs', 'Biceps', 'Triceps', 'Shoulders'];
  const genderOptions = ['Male', 'Female'];
  const dayOptions = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const fetchExercise = async () => {
    try {
      const user = authService.getCurrentUser();
      const token = user?.token;

      if (!token) {
        setError('User is not authenticated');
        return;
      }

      const response = await axios.get(`http://localhost:9060/exercise/${exerciseId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setExerciseData(response.data);
      setUpdatedExercise(response.data); // Заповнити для редагування
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to fetch exercise');
    }
  };

  const updateExercise = async () => {
    try {
      const user = authService.getCurrentUser();
      const token = user?.token;

      if (!token) {
        setError('User is not authenticated');
        return;
      }

      // Враховуємо snake_case структуру DTO
      const exerciseToUpdate = {
        name: updatedExercise.name,
        muscle: { name: updatedExercise.muscle?.name },
        gender: { name: updatedExercise.gender?.name },
        day: { name: updatedExercise.day?.name },
        recommendation: updatedExercise.recommendation || [], // якщо не обробляєш recommendations тут, можна лишити як є
      };

      await axios.put('http://localhost:9060/exercise/update', exerciseToUpdate, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      setError('');
      await fetchExercise(); // оновити
    } catch (err) {
      console.error(err);
      setError('Failed to update exercise');
    }
  };

  const deleteExercise = async () => {
    try {
      const user = authService.getCurrentUser();
      const token = user?.token;

      if (!token) {
        setError('User is not authenticated');
        return;
      }

      await axios.delete(`http://localhost:9060/exercise/delete/${exerciseData.name}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setExerciseData(null);
      setUpdatedExercise({});
      setExerciseId('');
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to delete exercise');
    }
  };

  const handleChange = (field, value) => {
    setUpdatedExercise((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="recommendation-container">
      <h2>Exercise Manager</h2>

      <div className="recommendation-form">
        <input
          type="text"
          placeholder="Enter Exercise ID"
          value={exerciseId}
          onChange={(e) => setExerciseId(e.target.value)}
          className="recommendation-input"
        />
        <button onClick={fetchExercise} className="recommendation-button">
          Fetch Exercise
        </button>
      </div>

      {exerciseData && (
        <div className="recommendation-card">
          <p>
            <strong>Current Name:</strong> {exerciseData.name}
          </p>

          <div className="recommendation-form">
            <label>New Name:</label>
            <input
              type="text"
              value={updatedExercise.name || ''}
              onChange={(e) => handleChange('name', e.target.value)}
              className="recommendation-input"
            />

            <label>Muscle:</label>
            <select
              value={updatedExercise.muscle?.name || ''}
              onChange={(e) => handleChange('muscle', { name: e.target.value })}
              className="recommendation-input"
            >
              <option value="">Select muscle</option>
              {muscleOptions.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>

            <label>Gender:</label>
            <select
              value={updatedExercise.gender?.name || ''}
              onChange={(e) => handleChange('gender', { name: e.target.value })}
              className="recommendation-input"
            >
              <option value="">Select gender</option>
              {genderOptions.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>

            <label>Day:</label>
            <select
              value={updatedExercise.day?.name || ''}
              onChange={(e) => handleChange('day', { name: e.target.value })}
              className="recommendation-input"
            >
              <option value="">Select day</option>
              {dayOptions.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            <div className="button-group">
              <button onClick={updateExercise} className="recommendation-button update">
                Update Exercise
              </button>
              <button onClick={deleteExercise} className="recommendation-button delete">
                Delete Exercise
              </button>
            </div>
          </div>
        </div>
      )}

      {error && <p className="recommendation-error">{error}</p>}
    </div>
  );
};
export default ExerciseManager;
