import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box, Alert } from '@mui/material';
import AuthService from '../../api/auth';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    weight: '',
    gender: 'male',
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Ім'я обов'язкове";
    if (!formData.email.match(/^\S+@\S+\.\S+$/)) newErrors.email = 'Невірний формат email';
    if (formData.password.length < 6) newErrors.password = 'Мінімум 6 символів';
    if (!formData.age || formData.age < 1) newErrors.age = 'Вік повинен бути більше 0';
    if (!formData.weight || formData.weight < 1) newErrors.weight = 'Вага повинна бути більше 0';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        age: parseInt(formData.age),
        weight: parseFloat(formData.weight),
        gender: {
          name: formData.gender,
        },
      };

      await AuthService.register(userData);
      navigate('/login', { state: { registrationSuccess: true } });
    } catch (error) {
      console.error('Registration error:', error);
      setServerError(error.response?.data?.message || 'Помилка реєстрації');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container
      maxWidth="100vw"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        position: 'fixed',
        height: '100vh',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundImage: 'url("https://images7.alphacoders.com/130/1308025.jpg")',
        p: 0,
        m: -1,
        minWidth: '100%',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          zIndex: 0,
        },
      }}
    >
      <Box
        sx={{
          postion: 'relative',
          zIndex: 5,
          maxWidth: '40vw',
          backgroundColor: 'rgba(255,255,255,0.9)',
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          alignItems: 'center',
          p: 3,
        }}
      >
        <Box
          component="img"
          src="https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small_2x/default-avatar-icon-of-social-media-user-vector.jpg" // Шлях до зображення (у public або зовнішнє посилання)
          alt="Логотип"
          sx={{
            width: 100, // або '100px'
            height: 100,
            borderRadius: '50%', // Для круглого зображення
            objectFit: 'cover', // Щоб зображення заповнило область
            mt: 2,
          }}
        />
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Registration
        </Typography>

        {serverError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {serverError}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Ім'я"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            label="Пароль"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            label="Вік"
            name="age"
            type="number"
            value={formData.age}
            onChange={handleChange}
            error={!!errors.age}
            helperText={errors.age}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            label="Вага (кг)"
            name="weight"
            type="number"
            step="0.1"
            value={formData.weight}
            onChange={handleChange}
            error={!!errors.weight}
            helperText={errors.weight}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            select
            label="Стать"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            SelectProps={{
              native: true,
            }}
          >
            <option value="Male">Чоловіча</option>
            <option value="Female">Жіноча</option>
          </TextField>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Зареєструватися...' : 'Зареєструватися'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
