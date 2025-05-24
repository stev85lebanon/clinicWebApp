import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import {
    Card,
    CardContent,
    Typography,
    Button,
    List,
    ListItem,
    ListItemText,
    Container,
    Box,
    Avatar,
    Divider
} from '@mui/material';

export default function AboutDoctor() {
    const { doctors, loading, error } = useContext(AuthContext);

    if (loading) {
        return (
            <Container sx={{ py: 5, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">Loading doctor data...</Typography>
            </Container>
        );
    }

    if (error) {
        return (
            <Container sx={{ py: 5, textAlign: 'center' }}>
                <Typography color="error" variant="h6">Error loading doctor data: {error}</Typography>
            </Container>
        );
    }

    if (!Array.isArray(doctors)) {
        return (
            <Container sx={{ py: 5, textAlign: 'center' }}>
                <Typography color="error" variant="h6">Doctor data is not in the expected format.</Typography>
            </Container>
        );
    }

    return (
        <Container sx={{ py: 5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Card sx={{ maxWidth: 700, width: '100%', boxShadow: 4, borderRadius: 3, padding: 2 }}>
                    <CardContent>
                        <Typography
                            variant="h4"
                            color="primary"
                            align="center"
                            gutterBottom
                            sx={{ fontWeight: 700 }}
                        >
                            Meet Our Doctors
                        </Typography>
                        <List disablePadding>
                            {doctors.map(({ id, name, image }, index) => (
                                <React.Fragment key={id}>
                                    <ListItem
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            px: 2,
                                            py: 1.5,
                                            '&:hover': {
                                                backgroundColor: 'action.hover',
                                                borderRadius: 2,
                                            }
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Avatar
                                                alt={name}
                                                src={`https://clinikapp.onrender.com/uploads/${image}`}
                                                sx={{ width: 56, height: 56, mr: 2 }}
                                            />
                                            <ListItemText
                                                primary={name}
                                                primaryTypographyProps={{ fontWeight: 500, fontSize: '1.1rem' }}
                                            />
                                        </Box>
                                        <Button
                                            component={Link}
                                            to={`/details/${id}`}
                                            variant="contained"
                                            color="primary"
                                            size="small"
                                            sx={{ textTransform: 'none', fontWeight: 500 }}
                                        >
                                            More details
                                        </Button>
                                    </ListItem>
                                    {index < doctors.length - 1 && <Divider />}
                                </React.Fragment>
                            ))}
                        </List>
                    </CardContent>
                </Card>
            </Box>
        </Container>
    );
}
