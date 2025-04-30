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
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Реєстрація
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
