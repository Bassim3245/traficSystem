import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const { name, email, password, confirmPassword } = formData;

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('كلمات المرور غير متطابقة');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/users', {
                name,
                email,
                password
            });

            localStorage.setItem('userToken', response.data.token);
            localStorage.setItem('userData', JSON.stringify(response.data));

            // Reset form
            setFormData({
                name: '',
                email: '',
                password: '',
                confirmPassword: ''
            });
            setError('');

            // Redirect to dashboard
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'خطأ في التسجيل');
        }
    };

    return (
        <div className="auth-container">
            <h2>تسجيل حساب جديد</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>الاسم:</label>
                    <input
                        type="text"
                        name="name"
                        value={name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>البريد الإلكتروني:</label>
                    <input
                        type="email"
                        name="email"
                        value={email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>كلمة المرور:</label>
                    <input
                        type="password"
                        name="password"
                        value={password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>تأكيد كلمة المرور:</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">تسجيل</button>
            </form>
        </div>
    );
};

export default Register;
