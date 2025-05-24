import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

// import dependencies packages
import axios from 'axios';
// import from MUI
import { IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { TextField, Button, Box, Typography, Link } from '@mui/material';
// import contexts
import { AuthContext } from '../contexts/AuthContext';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    // handle submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await axios.post('https://clinikapp.onrender.com/login', {
                username,
                password
            });
            console.log(response)
            login(response.data.token, response.data.user);
            // navigate('/');
            if (response.data.user.isAdmin) {
                navigate('/admin-dashboard');
            } else if (response.data.user.isDoctor) {
                navigate('/doctor-dashboard');
            } else {
                navigate("/")
            }

        } catch (err) {
            if (err.response) {
                // Server responded with a status code (like 401)
                setError("Invalid credentials. Please try again.");
            } else if (err.request) {
                // Request was made but no response received
                setError("Server is unavailable. Please try again later.");
            } else {
                // Something else went wrong in setting up the request
                setError("An unexpected error occurred. Please try again.");
            }
            console.error("Login error:", err);
        }
    };
    // toggle password
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
                Login
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
                                <IconButton onClick={handleTogglePasswordVisibility} edge="end">
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                />

                {error && (
                    <Typography color="error" sx={{ mb: 2 }}>
                        {error}
                    </Typography>
                )}

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mb: 1 }}
                >
                    Login
                </Button>

                <Box sx={{ textAlign: 'center', mt: 2 }}>
                    <Link href="/reset-password" underline="hover">
                        Forgot your password?
                    </Link>
                    <Typography variant="body2" sx={{ mt: 2 }}>
                        Don’t have an account?{' '}
                        <Link href="/register" underline="hover">
                            Register here
                        </Link>
                    </Typography>
                </Box>
            </form>
        </Box>
    );
}

