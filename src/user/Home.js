import React from 'react';
import { useNavigate } from 'react-router-dom';

//import context

export default function Home({ children }) {
    // console.log("home page renders")


    const navigate = useNavigate();

    return (
        <div className="container d-flex flex-column align-items-center justify-content-center min-vh-100 py-5">
            <h1 className="display-4 text-center mb-4">Welcome to Our Dental Clinic</h1>
            <p className="lead text-center mb-5">
                We offer comprehensive dental care for all ages. Schedule your appointment today!
            </p>
            <button
                onClick={() => navigate('/details')}
                className="btn btn-primary btn-lg"
            >
                Book Appointment
            </button>
        </div>
    );
}



