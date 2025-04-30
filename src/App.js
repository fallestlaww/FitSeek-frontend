import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Home from './components/Home';
import ProfilePage from './components/User/ProfilePage';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import TrainingTypeForm from './components/Managers/TrainingTypeForm';
import RecommendationManager from './components/Managers/RecommendationManager';
import ExerciseManager from './components/Managers/ExerciseManager';
import GenderExerciseFetcher from './components/Managers/GenderExerciseFetcher';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route path="/training" element={<TrainingTypeForm />} />
        <Route path="/training/exercises" element={<ExerciseManager />} />
        <Route path="/training/exercises/gender" element={<GenderExerciseFetcher />} />
        <Route path="/training/exercises/recommendations" element={<RecommendationManager />} />
      </Routes>
    </div>
  );
}

export default App;
