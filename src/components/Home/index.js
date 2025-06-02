import { Box, Button, Container, Typography, Grid, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import authService from '../../api/auth';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Ошибка при получении пользователя:', error);
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  return (
    <Box
      sx={{
        m: -1,
        height: '100vh',
        backgroundImage:
          'url("https://pic.sport.ua/media/images/healthy/programma-trenirovok-v-zale/image11.jpg")',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        pt: '15vh',
        '&::before': {
          content: '""',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          zIndex: 0,
        },
      }}
    >
      {user && (
        <Box sx={{ position: 'absolute', top: 24, right: 24, zIndex: 10 }}>
          <Button variant="contained" color="primary" onClick={() => navigate('/profile')}>
            Profile
          </Button>
        </Box>
      )}

      <Container maxWidth="md" sx={{ mt: 0 }}>
        <Box
          sx={{
            py: 8,
            borderRadius: 4,
            p: 5,
            mb: 4,
            textAlign: 'center',
          }}
        >
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 800,
              letterSpacing: 1.2,
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              mb: 3,
              color: 'white',
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
              lineHeight: 1.2,
              position: 'relative',
              zIndex: 5,
            }}
          >
            Reach your fitness goals
          </Typography>
          <Typography
            variant="h5"
            sx={{
              fontStyle: 'italic',
              opacity: 0.95,
              fontSize: { xs: '1.3rem', md: '1.5rem' },
              color: 'white',
              textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
              mb: 3,
            }}
          >
            Personalized trainings
          </Typography>
        </Box>

        {!user && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: 24, // Подвійний відступ (був 4, став 8)
              flexWrap: 'wrap',
              mb: 6,
            }}
          >
            <Button
              variant="outlined"
              size="large"
              sx={{
                width: 150,
                color: 'white',
                borderColor: 'white',
                borderWidth: 2,
                fontWeight: 700,
                textTransform: 'none',
                borderRadius: 2.5,
                boxShadow: 3,
                px: 5,
                py: 1.8,
                fontSize: '1.1rem',
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: 'rgba(255,255,255,0.9)',
                  bgcolor: 'rgba(255,255,255,0.15)',
                  transform: 'translateY(-3px)',
                  boxShadow: 5,
                },
              }}
              onClick={() => navigate('/register')}
            >
              Register
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{
                width: 150,
                color: 'white',
                borderColor: 'white',
                borderWidth: 2,
                fontWeight: 700,
                textTransform: 'none',
                borderRadius: 2.5,
                boxShadow: 3,
                px: 5,
                py: 1.8,
                fontSize: '1.1rem',
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: 'rgba(255,255,255,0.9)',
                  bgcolor: 'rgba(255,255,255,0.15)',
                  transform: 'translateY(-3px)',
                  boxShadow: 5,
                },
              }}
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
          </Box>
        )}
        {user && (
          <Paper
            elevation={3}
            sx={{
              p: 3,
              borderRadius: 3,
              bgcolor: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(8px)',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
              },
            }}
          >
            <Grid container spacing={2} justifyContent="center">
              {[
                {
                  label: 'Training',
                  path: '/training',
                },
                {
                  label: 'All exercises',
                  path: '/training/exercises',
                },
                {
                  label: 'Exercises by gender',
                  path: '/training/exercises/gender',
                },
                {
                  label: 'Recommendation-for-exercises',
                  path: '/training/exercises/recommendations',
                },
              ].map((btn, index) => (
                <Grid item key={index}>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{
                      textTransform: 'none',
                      fontWeight: 600,
                      borderRadius: 2,
                      boxShadow: 3,
                      px: 3,
                      py: 1.2,
                      fontSize: '0.95rem',
                      transition: 'transform 0.2s ease',
                      '&:hover': {
                        transform: 'scale(1.05)',
                        boxShadow: 5,
                      },
                    }}
                    onClick={() => navigate(btn.path)}
                  >
                    {btn.label}
                  </Button>
                </Grid>
              ))}
            </Grid>
          </Paper>
        )}
      </Container>
    </Box>
  );
}
