import React, { useEffect, useState, useContext } from 'react';
import {
    Box,
    Grid,
    Typography,
    Paper,
    Card,
    CardContent,
    Avatar,
    Chip,
    Button,
    Divider,
} from '@mui/material';
import { AuthContext } from '../contexts/AuthContext';

const DoctorDashboard = () => {
    const { user } = useContext(AuthContext);
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('https://clinikapp.onrender.com/doctor-appointments', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                setAppointments(data);
            } catch (err) {
                console.error('Failed to fetch appointments:', err);
            }
        };

        if (user) fetchAppointments();
    }, [user]);

    const today = new Date().toISOString().split('T')[0];
    const todayAppointments = appointments.filter(appt => appt.date === today);
    const upcomingAppointments = appointments.filter(appt => appt.date > today);

    return (
        <Box p={4}>
            <Typography variant="h4" gutterBottom>
                Welcome, Dr. {user?.username}
            </Typography>

            <Grid container spacing={3}>

                {/* Metrics Cards */}
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Today's Appointments</Typography>
                            <Typography variant="h4" color="primary">
                                {todayAppointments.length}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Upcoming Appointments</Typography>
                            <Typography variant="h4" color="secondary">
                                {upcomingAppointments.length}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Total Appointments</Typography>
                            <Typography variant="h4" color="textPrimary">
                                {appointments.length}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Today's Appointments */}
                <Grid item xs={12}>
                    <Paper elevation={3}>
                        <Box p={2}>
                            <Typography variant="h6" gutterBottom>
                                Today's Appointments
                            </Typography>
                            {todayAppointments.length === 0 ? (
                                <Typography>No appointments today.</Typography>
                            ) : (
                                todayAppointments.map((appt) => (
                                    <Box key={appt._id} mb={2} p={2} borderBottom="1px solid #ddd">
                                        <Typography variant="subtitle1">
                                            {appt.name} - {appt.time}
                                        </Typography>
                                        <Typography variant="body2">
                                            Email: {appt.email} | Phone: {appt.phone}
                                        </Typography>
                                        <Chip
                                            label={appt.isVisit ? 'First Visit' : 'Follow-up'}
                                            color={appt.isVisit ? 'success' : 'default'}
                                            size="small"
                                            sx={{ mt: 1 }}
                                        />
                                    </Box>
                                ))
                            )}
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default DoctorDashboard;
