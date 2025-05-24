import React, { useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import {
    Box,
    Card,
    CardContent,
    CardMedia,
    Typography,
    ListItem,
    ListItemText,
    Button,
    Stack,
    Grid
} from '@mui/material';

export default function DoctorDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { doctors } = useContext(AuthContext);  // Destructure doctors from context

    console.log(" the doctor are :", doctors)
    // Find the doctor by ID
    const findDoctor = doctors.find((doctor) => doctor.id === id);
    console.log("the doctor is ", findDoctor)
    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="80vh"
            bgcolor="#f5f5f5"
            px={2}
        >
            <Card sx={{ maxWidth: 600, width: '100%', boxShadow: 6 }}>
                {findDoctor && findDoctor.image && (
                    <CardMedia
                        component="img"
                        image={`https://clinikapp.onrender.com/uploads/${findDoctor.image}`}
                        alt={`Dr. ${findDoctor.name}`}
                        sx={{ height: 200, objectFit: 'contain' }}
                    />
                )}

                <CardContent>
                    {findDoctor ? (
                        <>
                            <Typography variant="h5" align="center" color="primary" gutterBottom>
                                About Dr. {findDoctor.name}
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item>
                                    <ListItem>
                                        <ListItemText primary="Age" secondary={findDoctor.age} />
                                    </ListItem>
                                </Grid>
                                <Grid item>
                                    <ListItem>
                                        <ListItemText primary="Phone" secondary={findDoctor.phone} />
                                    </ListItem>
                                </Grid>
                                <Grid item>
                                    <ListItem>
                                        <ListItemText primary="Specialization" secondary={findDoctor.specialization || 'N/A'} />
                                    </ListItem>
                                </Grid>
                                <Grid item>
                                    <ListItem>
                                        <ListItemText primary="Experience" secondary={`${findDoctor.experience || 'N/A'} years`} />
                                    </ListItem>
                                </Grid>
                            </Grid>

                            <Stack direction="row" spacing={2} justifyContent="center" mt={3}>
                                <Button variant="outlined" component={Link} to="/details">
                                    Back to Doctor List
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    component={Link}
                                    to="/book"
                                    state={{ doctorId: findDoctor.id }}
                                >
                                    Book Now
                                </Button>
                            </Stack>
                        </>
                    ) : (
                        <Box textAlign="center">
                            <Typography variant="h6" color="text.secondary">
                                No data about the doctor
                            </Typography>
                            <Typography variant="body2" color="text.disabled">
                                Please select a doctor to view details.
                            </Typography>
                            <Button variant="contained" onClick={() => navigate('/details')} sx={{ mt: 2 }}>
                                Return to Doctor List
                            </Button>
                        </Box>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
}
