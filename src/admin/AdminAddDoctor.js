import React, { useState } from 'react';
import axios from 'axios';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css';
import {
    TextField,
    Button,
    Box,
    Typography,
    InputLabel
} from '@mui/material';

export default function AdminAddDoctor() {
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        phone: '',
        specialization: '',
        experience: ''
    });

    const [image, setImage] = useState(null);
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // const handlePhoneChange = (value, country, e, formattedValue) => {
    //     setFormData((prevData) => ({
    //         ...prevData,
    //         phone: value
    //     }));
    // };


    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        try {
            const data = new FormData();
            for (const key in formData) {
                data.append(key, formData[key]);
            }
            if (image) {
                data.append('image', image);
            }

            const token = localStorage.getItem('token');

            const res = await axios.post('https://clinikapp.onrender.com/doctors/add', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });

            setMessage(res.data.message || 'Doctor added successfully!');
        } catch (err) {
            console.error(err);
            setMessage('Failed to add doctor. Please try again.');
        }
    };

    return (
        <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
            <Typography variant="h5" gutterBottom>
                Add New Doctor
            </Typography>

            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <TextField fullWidth label="Name" name="name" value={formData.name} onChange={handleChange} sx={{ mb: 2 }} />
                <TextField fullWidth label="Age" name="age" value={formData.age} onChange={handleChange} type="number" sx={{ mb: 2 }} />

                <Typography variant="body1" sx={{ mb: 1 }}>Phone Number</Typography>
                <PhoneInput
                    country={'lb'}
                    value={formData.phone || ''}
                    onChange={(value) => setFormData({ ...formData, phone: value })}
                    inputStyle={{ width: '100%', marginBottom: '16px' }}
                    enableSearch
                />


                <TextField fullWidth label="Specialization" name="specialization" value={formData.specialization} onChange={handleChange} sx={{ mb: 2 }} />
                <TextField fullWidth label="Experience (years)" name="experience" value={formData.experience} onChange={handleChange} type="number" sx={{ mb: 2 }} />

                <InputLabel sx={{ mb: 1 }}>Upload Image</InputLabel>
                <input type="file" onChange={handleImageChange} accept="image/*" style={{ marginBottom: '20px' }} />

                <Button variant="contained" color="primary" type="submit" fullWidth>
                    Add Doctor
                </Button>

                {message && (
                    <Typography sx={{ mt: 2 }} color="secondary">
                        {message}
                    </Typography>
                )}
            </form>
        </Box>
    );
}
