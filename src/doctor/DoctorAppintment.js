import React, { useEffect, useState, useContext } from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemText, CircularProgress, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { AuthContext } from '../contexts/AuthContext'; // where user is stored

const DoctorAppointments = () => {
    const { user } = useContext(AuthContext);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('https://clinikapp.onrender.com/doctor-appointments', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await response.json();
                setAppointments(data);
            } catch (error) {
                console.error('Failed to fetch doctor appointments:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchAppointments();
    }, [user]);


    const handleOpenDialog = (appointmentId) => {
        setSelectedAppointmentId(appointmentId);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedAppointmentId(null);
    };
    const handleConfirmCancel = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`https://clinikapp.onrender.com/cancel-appointment/${selectedAppointmentId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                setAppointments((prev) => prev.filter((appt) => appt._id !== selectedAppointmentId));
            } else {
                console.error('Failed to cancel:', await response.json());
                alert('❌ Failed to cancel');
            }
        } catch (error) {
            console.error('Error canceling appointment:', error);
            alert('❌ Error canceling appointment');
        } finally {
            handleCloseDialog();
        }
    };

    if (loading) return <CircularProgress />;

    return (
        <Box p={3}>
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Cancel Appointment</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to cancel this appointment?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        No
                    </Button>
                    <Button onClick={handleConfirmCancel} color="error" variant="contained">
                        Yes, Cancel
                    </Button>
                </DialogActions>
            </Dialog>

            <Typography variant="h5" gutterBottom>
                Your Appointments
            </Typography>
            <Paper elevation={3}>
                <List>
                    {appointments.length === 0 ? (
                        <ListItem>
                            <ListItemText primary="No appointments found." />
                        </ListItem>
                    ) : (
                        appointments.map((appt) => (
                            <ListItem key={appt._id} divider>
                                <ListItemText
                                    primary={`${appt.name} (${appt.email})`}
                                    secondary={`Date: ${appt.date} | Time: ${appt.time} | Phone: ${appt.phone} | First Visit: ${appt.isVisit ? 'Yes' : 'No'}`}
                                />

                                <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={() => handleOpenDialog(appt._id)}
                                >
                                    Cancel
                                </Button>

                            </ListItem>
                        ))
                    )}
                </List>
            </Paper>
        </Box>
    );
};

export default DoctorAppointments;
