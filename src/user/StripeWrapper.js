// src/StripeWrapper.js
import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PaymentPage from './PaymentPage';

const stripePromise = loadStripe('your-publishable-key-here'); // 🔑 Use your STRIPE PUBLIC key

export default function StripeWrapper() {
    return (
        <Elements stripe={stripePromise}>
            <PaymentPage />
        </Elements>
    );
}
