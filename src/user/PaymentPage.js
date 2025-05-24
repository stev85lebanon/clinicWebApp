import React, { useState } from 'react';
import {
    Container,
    Typography,
    TextField,
    Button,
    Alert,
    Grid,
    Paper,
    InputAdornment,
    Box
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

export default function PaymentPage() {
    const [name, setName] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const stripe = useStripe();
    const elements = useElements();

    const handlePayment = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        if (!name.trim()) {
            setErrorMessage('Cardholder name is required');
            return;
        }

        setSubmitted(true);

        try {
            // Step 1: Ask backend to create payment intent
            const res = await fetch('https://clinikapp.onrender.com/create-payment-intent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ amount: 1000 }), // amount in cents
            });

            const data = await res.json();
            const clientSecret = data.clientSecret;

            // Step 2: Confirm card payment
            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                    billing_details: { name },
                },
            });

            if (result.error) {
                console.error(result.error.message);
                setErrorMessage(result.error.message);
            } else if (result.paymentIntent.status === 'succeeded') {
                alert('✅ Payment successful!');
            }
        } catch (err) {
            console.error(err);
            alert('❌ Payment error occurred.');
        } finally {
            setSubmitted(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={4} sx={{ p: 4, mt: 6, borderRadius: 3 }}>
                <Typography variant="h4" align="center" color="primary" gutterBottom>
                    💳 Payment
                </Typography>

                {submitted ? (
                    <Alert severity="info" sx={{ mt: 3 }}>
                        Processing payment...
                    </Alert>
                ) : (
                    <form onSubmit={handlePayment} noValidate>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    label="Cardholder Name"
                                    fullWidth
                                    required
                                    variant="outlined"
                                    value={name}
                                    onChange={(e) => {
                                        setName(e.target.value);
                                        setErrorMessage('');
                                    }}
                                    error={!!errorMessage}
                                    helperText={errorMessage}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <PersonIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <CardElement
                                    options={{
                                        style: {
                                            base: {
                                                fontSize: '16px',
                                                color: '#32325d',
                                                '::placeholder': { color: '#aab7c4' },
                                            },
                                            invalid: {
                                                color: '#fa755a',
                                            },
                                        },
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Box textAlign="center">
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        type="submit"
                                        size="large"
                                        sx={{ px: 6 }}
                                        disabled={!stripe || submitted}
                                    >
                                        Pay Now
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </form>
                )}
            </Paper>
        </Container>
    );
}
