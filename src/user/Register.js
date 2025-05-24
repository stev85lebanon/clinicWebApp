import React, { useState, useContext } from 'react';
import axios from 'axios';
import {
    TextField,
    Button,
    Box,
    Typography,
    IconButton,
    InputAdornment
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

export default function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://clinikapp.onrender.com/register', {
                username,
                password
            });

            const loginResponse = await axios.post('https://clinikapp.onrender.com/login', {
                username,
                password
            });

            const token = loginResponse.data.token;
            login(token, loginResponse.data.user);

            setSuccess(response.data.message);
            setError('');
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong.");
            setSuccess('');
        }
    };

    const handleTogglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                p: 3
            }}
        >
            <Typography variant="h4" gutterBottom>
                Sign Up
            </Typography>
            <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '400px' }}>
                <TextField
                    label="Username"
                    variant="outlined"
                    fullWidth
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="Password"
                    variant="outlined"
                    type={showPassword ? 'text' : 'password'}
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    sx={{ mb: 2 }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={handleTogglePasswordVisibility}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                />
                {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
                {success && <Typography color="success.main" sx={{ mb: 2 }}>{success}</Typography>}
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                >
                    Sign Up
                </Button>
            </form>
        </Box>
    );
}
