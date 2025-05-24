import React, { useEffect, useState } from 'react';
import {
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    CircularProgress,
    Box
} from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import EventNoteIcon from '@mui/icons-material/EventNote';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            const token = localStorage.getItem('token');
            try {
                const res = await fetch('https://clinikapp.onrender.com/admin/stats', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                setStats(data);
            } catch (err) {
                console.error('Failed to fetch admin stats', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" mt={10}>
                <CircularProgress />
            </Box>
        );
    }

    if (!stats) {
        return (
            <Box display="flex" justifyContent="center" mt={10}>
                <Typography color="error">Failed to load dashboard data.</Typography>
            </Box>
        );
    }

    const statCards = [
        {
            title: 'Users',
            value: stats.users,
            icon: <GroupIcon fontSize="large" color="primary" />,
        },
        {
            title: 'Appointments',
            value: stats.bookings,
            icon: <EventNoteIcon fontSize="large" color="secondary" />,
        },
        {
            title: 'Available Slots',
            value: stats.slots,
            icon: <AccessTimeIcon fontSize="large" color="success" />,
        },
    ];

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Admin Dashboard
            </Typography>

            <Grid container spacing={3}>
                {statCards.map((card, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                            <Box sx={{ mr: 2 }}>{card.icon}</Box>
                            <Box>
                                <Typography variant="subtitle1">{card.title}</Typography>
                                <Typography variant="h6">{card.value}</Typography>
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}
