import React, { useState, useContext, useEffect } from 'react';
import {
    Box, Button, Checkbox, Container, FormControl,
    FormControlLabel, InputLabel, MenuItem, Select,
    TextField, Typography, Alert, Grid
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useLocation, useNavigate } from 'react-router-dom';
import { DoctorContext } from '../contexts/DoctorContext';
import { AuthContext } from '../contexts/AuthContext';
export default function Book() {
    const { doctors } = useContext(DoctorContext);
    const { user } = useContext(AuthContext)
    const location = useLocation();

    const [confirmation, setConfirmation] = useState('');
    const [availableTimes, setAvailableTimes] = useState([]);
    const [bookingInput, setBookingInput] = useState({
        name: '',
        email: '',
        phone: '',
        date: null,
        time: '',
        doctorId: '',
        isVisit: false
    });
    const navigate = useNavigate()

    useEffect(() => {
        if (user || location.state?.doctorId) {
            setBookingInput(prev => ({
                ...prev,
                name: user?.username || prev.name,
                doctorId: location.state?.doctorId || prev.doctorId
            }));
        }
    }, [user, location.state]);
    useEffect(() => {
        if (bookingInput.name && bookingInput.doctorId) {
            console.log("✅ Booking input has values:");
            console.log("Name:", bookingInput.name);
            console.log("Doctor ID:", bookingInput.doctorId);
        }
    }, [bookingInput.name, bookingInput.doctorId]);
    useEffect(() => {
        const fetchTimes = async () => {
            const { doctorId, date } = bookingInput;
            if (doctorId && date) {
                const formattedDate = date.toLocaleDateString('en-CA');
                try {
                    const token = localStorage.getItem('token');

                    const res = await fetch(`https://clinikapp.onrender.com/availability?doctorId=${doctorId}&date=${formattedDate}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    const data = await res.json();

                    if (Array.isArray(data)) {
                        const now = new Date();
                        const selectedDate = new Date(date);

                        const filteredTimes = data.filter(time => {
                            if (selectedDate.toDateString() !== now.toDateString()) return true;

                            const [hour, minute] = time.split(':').map(Number);
                            const timeDate = new Date(selectedDate);
                            timeDate.setHours(hour, minute, 0, 0);

                            return timeDate > now;
                        });

                        // Sort times in chronological order (string comparison will work because times are in "HH:MM" format)
                        filteredTimes.sort((a, b) => {
                            const [aHour, aMinute] = a.split(':').map(Number);
                            const [bHour, bMinute] = b.split(':').map(Number);

                            if (aHour === bHour) {
                                return aMinute - bMinute; // Sort by minute if the hours are the same
                            }
                            return aHour - bHour; // Sort by hour if the hours are different
                        });

                        setAvailableTimes(filteredTimes);
                    } else {
                        setAvailableTimes([]);
                    }
                } catch (err) {
                    console.error('Error fetching times:', err);
                    setAvailableTimes([]);
                }
            } else {
                setAvailableTimes([]);
            }
        };
        fetchTimes();
    }, [bookingInput.doctorId, bookingInput.date]);



    const handle = (field) => (e) => {
        setBookingInput(prev => ({ ...prev, [field]: e.target.value }));
    };
    const handleCheck = (field) => (e) => {
        setBookingInput(prev => ({ ...prev, [field]: e.target.checked }));
    };
    const handleDateChange = (date) => {
        setBookingInput(prev => ({ ...prev, date }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        const formattedDate = bookingInput.date.toLocaleDateString('en-CA');

        try {
            const res = await fetch('https://clinikapp.onrender.com/appointments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...bookingInput,
                    date: formattedDate,
                })
            });

            if (!res.ok) {
                throw new Error('Failed to book appointment');
            }

            const data = await res.json();
            console.log('✅ Appointment booked:', bookingInput);

            setConfirmation('Appointment booked successfully!');
            setBookingInput({
                name: '',
                email: '',
                phone: "",
                date: null,
                time: '',
                doctorId: '',
                isVisit: false
            });
            setAvailableTimes([]);
            navigate("/")
        } catch (error) {
            console.error('❌ Booking error:', error);
            setConfirmation('Failed to book appointment. Try again.');
        }
    };


    return (
        <Container maxWidth="sm">
            {bookingInput.doctorId && (
                <Typography variant="h4" align="center" gutterBottom>
                    Booking an appointment with Dr. {doctors.find(doc => doc._id === bookingInput.doctorId)?.name || '...'}
                </Typography>
            )}



            <Box component="form" onSubmit={handleSubmit} size={{ mt: 3 }}>
                <Grid container spacing={2}>
                    <Grid size={12}>
                        <TextField
                            label="Name"
                            fullWidth
                            required
                            value={bookingInput.name}
                            onChange={handle('name')}
                        />
                    </Grid>
                    <Grid size={12}>
                        <TextField
                            label="Email"
                            type="email"
                            fullWidth
                            required
                            value={bookingInput.email}
                            onChange={handle('email')}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Phone Number"
                            type="tel"
                            fullWidth
                            required
                            value={bookingInput.phone}
                            onChange={handle('phone')}
                        />
                    </Grid>

                    <Grid size={12}>
                        <FormControl fullWidth required>
                            <InputLabel>Select Doctor</InputLabel>
                            <Select
                                value={bookingInput.doctorId}
                                onChange={handle('doctorId')}
                                label="Select Doctor"
                            >
                                <MenuItem value="">
                                    <em>Select doctor</em>
                                </MenuItem>
                                {doctors.map((dr) => (
                                    <MenuItem key={dr.id} value={dr.id}>
                                        {dr.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    {bookingInput.doctorId && (
                        <Grid size={12}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="Appointment Date"
                                    value={bookingInput.date}
                                    onChange={handleDateChange}
                                    minDate={new Date()}
                                    slotProps={{ textField: { fullWidth: true, required: true } }}

                                />
                            </LocalizationProvider>
                        </Grid>
                    )}
                    <Grid size={12}>
                        <FormControl fullWidth required>
                            {/* <InputLabel>Select Time</InputLabel> */}
                            {availableTimes.length > 0 ? (<InputLabel>Select Time</InputLabel>) : (<InputLabel>No Time available try with another date</InputLabel>)}
                            <Select
                                value={bookingInput.time}
                                onChange={handle('time')}
                                label="Select Time"
                                disabled={availableTimes.length === 0}
                            >
                                {availableTimes.length === 0 ? (
                                    // If no available times, show this message inside the dropdown
                                    <MenuItem value="" disabled>
                                        <em>No times available</em>
                                        {/* {console.log("no times")} */}
                                    </MenuItem>
                                ) : (
                                    availableTimes.map((time) => (
                                        <MenuItem key={time} value={time}>
                                            {time}
                                        </MenuItem>
                                    ))
                                )}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid size={12}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={bookingInput.isVisit}
                                    onChange={handleCheck('isVisit')}
                                    color="primary"
                                    required
                                />
                            }
                            label="Is this your first visit?"
                        />
                    </Grid>
                </Grid>

                <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
                    Book
                </Button>

                {confirmation && (
                    <Alert severity="info" sx={{ mt: 3 }}>
                        {confirmation}
                    </Alert>
                )}
            </Box>
        </Container>
    );
}
