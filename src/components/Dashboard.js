import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Tab, Tabs } from '@mui/material';
import ViolationPrediction from './ViolationPrediction';

const Dashboard = () => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [value, setValue] = useState(0);

    useEffect(() => {
        const fetchVehicles = async () => {
            const token = localStorage.getItem('userToken');
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const response = await axios.get('http://localhost:5000/api/vehicles', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setVehicles(response.data);
                setLoading(false);
            } catch (err) {
                setError('خطأ في تحميل بيانات السيارات');
                setLoading(false);
            }
        };

        fetchVehicles();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userData');
        navigate('/login');
    };

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    function TabPanel(props) {
        const { children, value, index, ...other } = props;

        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`simple-tabpanel-${index}`}
                aria-labelledby={`simple-tab-${index}`}
                {...other}
            >
                {value === index && (
                    <Box sx={{ p: 3 }}>
                        <div>{children}</div>
                    </Box>
                )}
            </div>
        );
    }

    if (loading) return <div>جاري التحميل...</div>;

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="dashboard tabs">
                    <Tab label="السيارات المسجلة" />
                    <Tab label="التنبؤ بالمخالفات" />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                <div className="dashboard">
                    <div className="dashboard-header">
                        <h2>لوحة التحكم</h2>
                        <button onClick={handleLogout} className="logout-btn">تسجيل الخروج</button>
                    </div>

                    <div className="dashboard-actions">
                        <button onClick={() => navigate('/register-vehicle')}>تسجيل سيارة جديدة</button>
                        <button onClick={() => navigate('/new-violation')}>تسجيل مخالفة جديدة</button>
                    </div>

                    <div className="vehicles-list">
                        <h3>السيارات المسجلة</h3>
                        {error && <div className="error-message">{error}</div>}
                        <div className="vehicles-grid">
                            {vehicles.map((vehicle) => (
                                <div key={vehicle._id} className="vehicle-card">
                                    <h4>رقم اللوحة: {vehicle.plateNumber}</h4>
                                    <p>المالك: {vehicle.ownerName}</p>
                                    <p>الموديل: {vehicle.model}</p>
                                    <p>اللون: {vehicle.color}</p>
                                    <p>رقم الهاتف: {vehicle.phoneNumber}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </TabPanel>
            <TabPanel value={value} index={1}>
                <ViolationPrediction />
            </TabPanel>
        </Box>
    );
};

export default Dashboard;
