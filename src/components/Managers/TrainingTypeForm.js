import React, { useState } from 'react';
import authService from '../../api/auth'; // шлях до API-сервісу
import '../../css/TrainingTypeForm.css'; // Підключення CSS стилів

const TrainingTypeForm = () => {
  const [trainingType, setTrainingType] = useState('');
  const [userInfo, setUserInfo] = useState({
    gender: { name: '' },
    trainingType: { name: '' },
    age: '',
    weight: '',
  });
  const [trainingInfo, setTrainingInfo] = useState({
    name: '',
    message: '',
    information: '',
  });
  const [exercises, setExercises] = useState(null);
  const [error, setError] = useState('');

  function camelToSnake(obj) {
    if (Array.isArray(obj)) {
      return obj.map((v) => camelToSnake(v));
    } else if (obj !== null && obj.constructor === Object) {
      return Object.keys(obj).reduce((acc, key) => {
        const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
        acc[snakeKey] = camelToSnake(obj[key]);
        return acc;
      }, {});
    }
    return obj;
  }

  const handleTrainingTypeSubmit = async () => {
    if (!trainingType) {
      setError('Please select a training type');
      return;
    }

    try {
      const user = authService.getCurrentUser();
      console.log('Current user token:', user?.token);

      if (!user?.token) {
        setError('User is not authenticated');
        return;
      }

      const info = await authService.getTrainingTypeInformation({ name: trainingType });
      console.log('Response from backend:', info);

      setTrainingInfo(info);
      setError('');
    } catch (err) {
      console.error('Error details:', err);
      setError(
        err.response?.data?.message || err.message || 'Error fetching training type information',
      );
    }
  };

  const handleUserInfoSubmit = async () => {
    if (!userInfo.age || !userInfo.weight || !userInfo.gender.name || !userInfo.trainingType.name) {
      setError('Please provide all user details');
      return;
    }

    const camelCaseBody = {
      age: parseInt(userInfo.age),
      weight: parseFloat(userInfo.weight),
      gender: {
        name: userInfo.gender.name,
      },
      trainingType: {
        name: userInfo.trainingType.name.toLowerCase(),
      },
    };

    const requestBody = camelToSnake(camelCaseBody);

    try {
      const user = authService.getCurrentUser();
      const token = user?.token;

      if (!token) {
        setError('User is not authenticated');
        return;
      }

      const response = await fetch('http://localhost:9060/training-type/exercises', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setExercises(data);
      setError('');
      console.log('TrainingType name:', userInfo.trainingType?.name);
    } catch (err) {
      console.error('Error fetching exercises:', err);
      setError(err.message || 'Error fetching exercises');
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Select Training Type</h2>
      <div className="form-section">
        <select
          className="form-select"
          value={trainingType}
          onChange={(e) => setTrainingType(e.target.value)}
        >
          <option value="FullBody">FullBody</option>
          <option value="Split">Split</option>
        </select>
        <button className="form-button" onClick={handleTrainingTypeSubmit}>
          Get Training Info
        </button>
      </div>

      {trainingInfo && (
        <div className="info-container">
          <h3>{trainingInfo.name} Training</h3>
          <p>
            <strong>Description:</strong> {trainingInfo.information}
          </p>
          <p>
            <strong>Note:</strong> {trainingInfo.message}
          </p>
        </div>
      )}

      <h2 className="form-title">Enter User Information</h2>
      <div className="form-section">
        <input
          type="number"
          placeholder="Age"
          value={userInfo.age}
          onChange={(e) => setUserInfo({ ...userInfo, age: e.target.value })}
          className="form-input"
        />
        <input
          type="number"
          placeholder="Weight"
          value={userInfo.weight}
          onChange={(e) => setUserInfo({ ...userInfo, weight: e.target.value })}
          className="form-input"
        />
        <select
          value={userInfo.gender.name}
          onChange={(e) => setUserInfo({ ...userInfo, gender: { name: e.target.value } })}
          className="form-select"
        >
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <select
          value={userInfo.trainingType.name}
          onChange={(e) => setUserInfo({ ...userInfo, trainingType: { name: e.target.value } })}
          className="form-select"
        >
          <option value="Fullbody">Fullbody</option>
          <option value="Split">Split</option>
        </select>
        <button className="form-button" onClick={handleUserInfoSubmit}>
          Get Exercises
        </button>
      </div>

      {exercises && (
        <div className="exercises-container">
          {exercises.map((exercise, index) => {
            const rec = exercise.recommendations
              ? {
                  recommendedSets: exercise.recommendations.recommended_sets,
                  recommendedRepeats: exercise.recommendations.recommended_repeats,
                  recommendedWeightMin: exercise.recommendations.recommended_weight_min,
                  recommendedWeightMax: exercise.recommendations.recommended_weight_max,
                }
              : null;

            return (
              <div key={index} className="exercise-item">
                <h4>{exercise.name}</h4>
                <p>
                  <strong>Muscle:</strong> {exercise.muscle?.name}
                </p>

                {rec && (
                  <>
                    <p>
                      <strong>Recommendations:</strong>
                    </p>
                    <ul>
                      <li>
                        <strong>Sets:</strong> {rec.recommendedSets}
                      </li>
                      <li>
                        <strong>Repeats:</strong> {rec.recommendedRepeats}
                      </li>
                      <li>
                        <strong>Min Weight:</strong> {rec.recommendedWeightMin} kg
                      </li>
                      <li>
                        <strong>Max Weight:</strong> {rec.recommendedWeightMax} kg
                      </li>
                    </ul>
                  </>
                )}

                {exercise.day && (
                  <p>
                    <strong>Day:</strong> {exercise.day?.name}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default TrainingTypeForm;
