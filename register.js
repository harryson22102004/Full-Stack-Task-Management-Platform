import React from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Link
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const { register: registerUser } = useAuth();

  const onSubmit = async (data) => {
    try {
      await registerUser(data.name, data.email, data.password);
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Register
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              {...register('name', { 
                required: 'Name is required',
                maxLength: {
                  value: 50,
                  message: 'Name cannot exceed 50 characters'
                }
              })}
              fullWidth
              label="Name"
              margin="normal"
              error={!!errors.name}
              helperText={errors.name?.message}
            />
            <TextField
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                  message: 'Please enter a valid email'
                }
              })}
              fullWidth
              label="Email"
              margin="normal"
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            <TextField
              {...register('password', { 
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
              })}
              fullWidth
              label="Password"
              type="password"
              margin="normal"
              error={!!errors.password}
              helperText={errors.password?.message}
            />
            <TextField
              {...register('confirmPassword', { 
                required: 'Please confirm your password',
                validate: (value) => value === watch('password') || 'Passwords do not match'
              })}
              fullWidth
              label="Confirm Password"
              type="password"
              margin="normal"
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 3 }}
            >
              Register
            </Button>
          </form>
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Link component={RouterLink} to="/login" variant="body2">
              Already have an account? Login here
            </Link>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
