import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Avatar,
  Alert,
  CircularProgress,
  MenuItem,
} from '@mui/material';
import AuthService from '../../api/auth';
const API_URL = 'http://localhost:9060';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    weight: '',
    gender: '',
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const currentUser = AuthService.getCurrentUser();
      if (!currentUser?.token) {
        throw new Error('Not authenticated');
      }

      console.log('Current user token:', currentUser.token);

      const response = await fetch(`${API_URL}/user`, {
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Важливо для CORS
      });

      console.log('Response status:', response.status); // Логування статусу

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const userData = await response.json();
      console.log('Full user data:', userData);

      setUser(userData);
      setFormData({
        name: userData.name,
        age: userData.age,
        weight: userData.weight,
        gender: userData.gender,
      });
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      const currentUser = AuthService.getCurrentUser();
      const response = await fetch('http://localhost:9060/user/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentUser.token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          age: formData.age,
          weight: formData.weight,
          gender: formData.gender,
        }),
      });

      if (!response.ok) {
        throw new Error('Update failed');
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
      setEditMode(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete your account?')) {
      try {
        const currentUser = AuthService.getCurrentUser();
        const response = await fetch('http://localhost:9060/user/delete', {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Delete failed');
        }

        AuthService.logout();
        window.location.href = '/login';
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Avatar sx={{ width: 100, height: 100, mb: 2 }}>{user.name?.charAt(0) || 'U'}</Avatar>

        {editMode ? (
          <>
            <TextField
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Age"
              type="number"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Weight"
              type="number"
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              select
              label="Gender"
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              fullWidth
              margin="normal"
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
            </TextField>
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Button variant="contained" onClick={handleUpdate}>
                Save
              </Button>
              <Button variant="outlined" onClick={() => setEditMode(false)}>
                Cancel
              </Button>
            </Box>
          </>
        ) : (
          <>
            <Typography variant="h4" component="h1" gutterBottom>
              {user.name}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Email: {user.email}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Age: {user.age}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Weight: {user.weight} kg
            </Typography>
            <Typography variant="body1" gutterBottom>
              Gender: {user.gender || 'Not specified'}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
              <Button variant="contained" onClick={() => setEditMode(true)}>
                Edit Profile
              </Button>
              <Button variant="outlined" color="error" onClick={handleDelete}>
                Delete Account
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Container>
  );
}
