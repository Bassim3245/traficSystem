import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Container, Box, Alert } from '@mui/material';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/users/login', {
                email,
                password,
            });
            localStorage.setItem('userToken', response.data.token);
            localStorage.setItem('userData', JSON.stringify(response.data));

            // Reset form
            setEmail('');
            setPassword('');
            setError('');

            // Redirect to dashboard
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'خطأ في تسجيل الدخول');
        }
    };

    return (
        <Container maxWidth="xs" style={{ marginTop: '50px' }}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '20px',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                    borderRadius: '10px',
                    backgroundColor: '#fff',
                }}
            >
                <Typography variant="h5" component="h1" gutterBottom>
                    تسجيل الدخول
                </Typography>

                {error && <Alert severity="error" style={{ marginBottom: '15px' }}>{error}</Alert>}

                <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                    <TextField
                        label="البريد الإلكتروني"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        fullWidth
                        required
                        margin="normal"
                        variant="outlined"
                    />

                    <TextField
                        label="كلمة المرور"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        fullWidth
                        required
                        margin="normal"
                        variant="outlined"
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        style={{ marginTop: '20px' }}
                    >
                        تسجيل الدخول
                    </Button>
                </form>
            </Box>
        </Container>
    );
};

export default Login;
