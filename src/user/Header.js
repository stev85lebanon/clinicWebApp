import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Button, Typography, Box, Avatar } from '@mui/material';
import { AuthContext } from '../contexts/AuthContext';

export default function Header() {
    const navigate = useNavigate();
    const { logout, user } = useContext(AuthContext); // Getting user info from context
    const isAuthenticated = localStorage.getItem('token') ? true : false;
    console.log(user)
    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <AppBar position="sticky" color="primary">
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1, color: 'white' }}>
                    Dental Clinic
                </Typography>

                <Box sx={{ display: 'flex', gap: 2 }}>
                    {/* Check if the user is authenticated */}
                    {isAuthenticated ? (
                        <>
                            {/* Display Admin/Doctor/Normal User Menu */}
                            {user?.isAdmin ? (
                                <>
                                    <Link to="/admin-dashboard" style={{ textDecoration: 'none' }}>
                                        <Button sx={{ color: 'white' }}>Admin Dashboard</Button>
                                    </Link>
                                    <Link to="/admin-appointments" style={{ textDecoration: 'none' }}>
                                        <Button sx={{ color: 'white' }}>Appointments</Button>
                                    </Link>
                                    <Link to="/admin-add-doctors" style={{ textDecoration: 'none' }}>
                                        <Button sx={{ color: 'white' }}>Add Doctor</Button>
                                    </Link>
                                </>
                            ) : user?.isDoctor ? (
                                <>
                                    <Link to="/doctor-dashboard" style={{ textDecoration: 'none' }}>
                                        <Button sx={{ color: 'white' }}>Doctor Dashboard</Button>
                                    </Link>
                                    <Link to="/doctor-appointments" style={{ textDecoration: 'none' }}>
                                        <Button sx={{ color: 'white' }}>Appointments</Button>
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link to="/" style={{ textDecoration: 'none' }}>
                                        <Button sx={{ color: 'white' }}>Home</Button>
                                    </Link>
                                    <Link to="/details" style={{ textDecoration: 'none' }}>
                                        <Button sx={{ color: 'white' }}>Our Doctors</Button>
                                    </Link>
                                    <Link to="/payment" style={{ textDecoration: 'none' }}>
                                        <Button sx={{ color: 'white' }}>Payment</Button>
                                    </Link>
                                </>
                            )}

                            {/* Display User Avatar and Name */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Avatar src={user?.image || '/default-avatar.png'} alt={user?.name} />
                                <Typography variant="body1" sx={{ color: 'white' }}>
                                    {user?.username}
                                </Typography>
                            </Box>

                            {/* Logout Button */}
                            <Button sx={{ color: 'white' }} onClick={handleLogout}>
                                Logout
                            </Button>
                        </>
                    ) : (
                        // Not Authenticated
                        <>
                            <Link to="/" style={{ textDecoration: 'none' }}>
                                <Button sx={{ color: 'white' }}>Home</Button>
                            </Link>
                            <Link to="/login" style={{ textDecoration: 'none' }}>
                                <Button sx={{ color: 'white' }}>Login</Button>
                            </Link>
                        </>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
}
