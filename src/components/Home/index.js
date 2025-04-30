import React from 'react';
import { Box, Button, Container, Typography, Grid, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import authService from '../../api/auth'; // Імпортуємо authService

export default function HomePage() {
  const navigate = useNavigate();
  const theme = useTheme();

  const user = authService.getCurrentUser(); // Отримуємо поточного користувача

  return (
    <Box
      sx={{ minHeight: '100vh', bgcolor: theme.palette.background.default, position: 'relative' }}
    >
      {/* Кнопка профілю — тільки якщо є користувач */}
      {user && (
        <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
          <Button variant="contained" color="primary" onClick={() => navigate('/profile')}>
            Profile
          </Button>
        </Box>
      )}

      <Box
        sx={{
          py: 10,
          background: 'linear-gradient(135deg, #3a7bd5 0%, #00d2ff 100%)',
          color: 'white',
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
            Reach your fitness goals
          </Typography>
          <Typography variant="h5" sx={{ mb: 4 }}>
            Personalized trainings
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap', mb: 4 }}>
            <Button
              variant="contained"
              size="large"
              sx={{
                bgcolor: 'white',
                color: theme.palette.primary.main,
                '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' },
              }}
              onClick={() => navigate('/register')}
            >
              Register
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{
                color: 'white',
                borderColor: 'white',
                '&:hover': { borderColor: 'rgba(255,255,255,0.8)' },
              }}
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
          </Box>

          {/* Кнопки тренувань — тільки якщо є користувач */}
          {user && (
            <Grid container spacing={2} justifyContent="center">
              <Grid item>
                <Button variant="contained" color="secondary" onClick={() => navigate('/training')}>
                  Training
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => navigate('/training/exercises')}
                >
                  All exercises
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => navigate('/training/exercises/gender')}
                >
                  Exercises by gender
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => navigate('/training/exercises/recommendations')}
                >
                  Recommendation for exercises
                </Button>
              </Grid>
            </Grid>
          )}
        </Container>
      </Box>
    </Box>
  );
}
