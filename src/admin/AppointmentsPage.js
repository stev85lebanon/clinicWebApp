import React, { useEffect, useState, useContext } from 'react';
import {
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    CircularProgress,
    Chip,
    Box,
    Divider,
    Paper,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

import { AuthContext } from '../contexts/AuthContext';

export default function AppointmentsPage() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const { doctors } = useContext(AuthContext);
    const [selectedDate, setSelectedDate] = useState(new Date());

    const getDoctorName = (doctorId) => {
        const doctor = doctors.find(doc => doc.id === doctorId);
        return doctor ? doctor.name : 'Unknown Doctor';
    };

    useEffect(() => {
        const fetchAppointments = async () => {
            setLoading(true);
            const token = localStorage.getItem('token');
            const dateStr = selectedDate.toISOString().split('T')[0];

            try {
                const res = await fetch(`https://clinikapp.onrender.com/appointments?date=${dateStr}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (!res.ok) throw new Error("Failed to fetch");
                const data = await res.json();
                setAppointments(data);
            } catch (err) {
                console.error("Error fetching appointments:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, [selectedDate]);

    return (
        <Container sx={{ mt: 6 }}>
            <Typography variant="h4" fontWeight={600} gutterBottom>
                Appointments Overview
            </Typography>

            <Paper sx={{ p: 2, mb: 4 }} elevation={1}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                        label="Filter by date"
                        value={selectedDate}
                        onChange={(newDate) => setSelectedDate(newDate)}
                        slotProps={{ textField: { fullWidth: true } }}
                    />
                </LocalizationProvider>
            </Paper>

            {loading ? (
                <CircularProgress sx={{ mt: 10, mx: 'auto', display: 'block' }} />
            ) : appointments.length === 0 ? (
                <Typography variant="body1" color="textSecondary" textAlign="center" mt={4}>
                    No appointments found for this date.
                </Typography>
            ) : (
                <Grid container spacing={3}>
                    {appointments.map((appt) => (
                        <Grid item xs={12} md={6} lg={4} key={appt._id}>
                            <Card elevation={4} sx={{ borderRadius: 2 }}>
                                <CardContent>
                                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                                        <LocalHospitalIcon color="primary" />
                                        <Typography variant="h6">
                                            Dr. {getDoctorName(appt.doctorId)}
                                        </Typography>
                                    </Box>

                                    <Divider sx={{ my: 1 }} />

                                    <Typography variant="subtitle1" fontWeight={600}>Patient Details</Typography>
                                    <Typography variant="body2"><strong>Name:</strong> {appt.name}</Typography>
                                    <Typography variant="body2"><strong>Email:</strong> {appt.email}</Typography>
                                    <Typography variant="body2" mb={1}><strong>Phone:</strong> {appt.phone}</Typography>

                                    <Divider sx={{ my: 1 }} />

                                    <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                                        <CalendarTodayIcon color="action" />
                                        <Typography variant="body2">Date: {appt.date}</Typography>
                                    </Box>

                                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                                        <AccessTimeIcon color="action" />
                                        <Typography variant="body2">Time: {appt.time}</Typography>
                                    </Box>

                                    <Chip
                                        icon={appt.isVisit ? <CheckCircleIcon /> : <CancelIcon />}
                                        label={appt.isVisit ? "In-Person Visit" : "Remote"}
                                        color={appt.isVisit ? "success" : "info"}
                                        variant="outlined"
                                    />
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
}
