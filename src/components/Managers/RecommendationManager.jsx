import React, { useState } from 'react';
import axios from 'axios';
import authService from '../../api/auth';
import '../../css/RecommendationManager.css';

const RecommendationManager = () => {
  const [exerciseId, setExerciseId] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState('');

  const getRecommendations = async () => {
    try {
      const user = authService.getCurrentUser();
      const token = user?.token;

      if (!token) {
        setError('User is not authenticated');
        return;
      }

      const response = await axios.get(
        `http://localhost:9060/exercise/recommendation/${exerciseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const recsWithExerciseId = response.data.map((rec) => ({
        ...rec,
        exerciseId: exerciseId,
      }));

      setRecommendations(recsWithExerciseId);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to fetch recommendations');
    }
  };

  const deleteRecommendation = async (rec) => {
    try {
      const user = authService.getCurrentUser();
      const token = user?.token;

      if (!token) {
        setError('User is not authenticated');
        return;
      }

      const snakeCaseParams = toSnakeCaseObject({
        exerciseId: rec.exerciseId,
        userAge: rec.userAge,
        userWeight: rec.userWeight,
      });

      await axios.delete('http://localhost:9060/exercise/recommendation/delete', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: snakeCaseParams,
      });

      setError('');
      getRecommendations();
    } catch (err) {
      console.error(err);
      setError('Failed to delete recommendation');
    }
  };

  const toSnakeCase = (str) => {
    return str.replace(/([A-Z])/g, '_$1').toLowerCase();
  };

  const toSnakeCaseObject = (obj) => {
    if (Array.isArray(obj)) {
      return obj.map((item) => toSnakeCaseObject(item));
    } else if (obj !== null && typeof obj === 'object') {
      const result = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          const newKey = toSnakeCase(key);
          result[newKey] = toSnakeCaseObject(obj[key]);
        }
      }
      return result;
    }
    return obj;
  };

  const updateRecommendation = async (rec) => {
    try {
      const user = authService.getCurrentUser();
      const token = user?.token;

      if (!token) {
        setError('User is not authenticated');
        return;
      }

      const updateDataCamel = {
        exerciseId: rec.exerciseId,
        userAge: rec.userAge,
        userWeight: rec.userWeight,
        recommendedSets: parseInt(rec.recommendedSets, 10),
        recommendedRepeats: parseInt(rec.recommendedRepeats, 10),
        recommendedWeightMin: parseInt(rec.recommendedWeightMin, 10),
        recommendedWeightMax: parseInt(rec.recommendedWeightMax, 10),
      };

      const updateData = toSnakeCaseObject(updateDataCamel);

      await axios.put('http://localhost:9060/exercise/recommendation/update', updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      setError('');
      await getRecommendations();
    } catch (err) {
      console.error(err);
      setError('Failed to update recommendation: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleChange = (index, field, value) => {
    const updated = [...recommendations];
    updated[index][field] = value;
    setRecommendations(updated);
  };

  return (
    <div className="recommendation-container">
      <h2>Recommendation Manager</h2>
      <input
        type="text"
        placeholder="Exercise ID"
        value={exerciseId}
        onChange={(e) => setExerciseId(e.target.value)}
        className="recommendation-input"
      />
      <button onClick={getRecommendations} className="recommendation-button">
        Fetch Recommendations
      </button>

      {recommendations.length > 0 && (
        <div className="recommendation-list">
          {recommendations.map((rec, index) => (
            <div
              className="recommendation-card"
              key={`${rec.exerciseId}-${rec.userAge}-${rec.userWeight}`}
            >
              <p>
                <strong>ID:</strong> {rec.id}
              </p>
              <p>
                <strong>Age:</strong> {rec.userAge}
              </p>
              <p>
                <strong>Weight:</strong> {rec.userWeight}
              </p>

              <label>Sets:</label>
              <input
                type="number"
                value={rec.recommendedSets}
                onChange={(e) => handleChange(index, 'recommendedSets', e.target.value)}
              />

              <label>Repeats:</label>
              <input
                type="number"
                value={rec.recommendedRepeats}
                onChange={(e) => handleChange(index, 'recommendedRepeats', e.target.value)}
              />

              <label>Min Weight:</label>
              <input
                type="number"
                value={rec.recommendedWeightMin}
                onChange={(e) => handleChange(index, 'recommendedWeightMin', e.target.value)}
              />

              <label>Max Weight:</label>
              <input
                type="number"
                value={rec.recommendedWeightMax}
                onChange={(e) => handleChange(index, 'recommendedWeightMax', e.target.value)}
              />

              <button
                onClick={() => updateRecommendation(rec)}
                className="recommendation-button update"
              >
                Update
              </button>

              <button
                onClick={() => deleteRecommendation(rec)}
                className="recommendation-button delete"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {error && <p className="recommendation-error">{error}</p>}
    </div>
  );
};

export default RecommendationManager;
