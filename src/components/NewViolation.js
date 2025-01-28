import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './NewViolation.css';

// تكوين عنوان الـ API الأساسي
axios.defaults.baseURL = 'http://localhost:5000';

const NewViolation = () => {
    const navigate = useNavigate();
    const [violationData, setViolationData] = useState({
        vehiclePlateNumber: '',
        violationType: '',
        location: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
        fine: ''
    });
    const [photo, setPhoto] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setViolationData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPhoto(file);
            // إنشاء معاينة للصورة
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            Object.keys(violationData).forEach(key => {
                formData.append(key, violationData[key]);
            });
            if (photo) {
                formData.append('photo', photo);
            }

            // إضافة التوكن للطلب
            const token = localStorage.getItem('userToken');
            const response = await axios.post('/api/violations/new', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.data.success) {
                // alert('تم تسجيل المخالفة بنجاح');
                // navigate('/dashboard');
                
            }
        } catch (error) {
            console.error('Error registering violation:', error);
            alert('حدث خطأ أثناء تسجيل المخالفة: ' + (error.response?.data?.message || error.message));
        }
    };
    
    return (
        <div className="new-violation-container">
            <h2>تسجيل مخالفة جديدة</h2>
            <form onSubmit={handleSubmit} className="violation-form">
                <div className="form-group">
                    <label>رقم لوحة السيارة:</label>
                    <input
                        type="text"
                        name="vehiclePlateNumber"
                        value={violationData.vehiclePlateNumber}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>نوع المخالفة:</label>
                    <select
                        name="violationType"
                        value={violationData.violationType}
                        onChange={handleChange}
                        required
                    >
                        <option value="">اختر نوع المخالفة</option>
                        <option value="تجاوز سرعة">تجاوز السرعة</option>
                        <option value="مخالفة وقوف">مخالفة وقوف</option>
                        <option value="تجاوز الإشارة الحمراء">تجاوز الإشارة الحمراء</option>
                        <option value="التصفح في الهاتف أثناءالقيادة">التصفح في الهاتف أثناءالقيادة</option>
                        <option value="أخرى">أخرى</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>الموقع:</label>
                    <input
                        type="text"
                        name="location"
                        value={violationData.location}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>التاريخ:</label>
                    <input
                        type="date"
                        name="date"
                        value={violationData.date}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>الوصف:</label>
                    <textarea
                        name="description"
                        value={violationData.description}
                        onChange={handleChange}
                        rows="4"
                    />
                </div>
                <div className="form-group">
                    <label>قيمة الغرامة:</label>
                    <input
                        type="number"
                        name="fine"
                        value={violationData.fine}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>صورة المخالفة:</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="file-input"
                    />
                    {previewUrl && (
                        <div className="image-preview">
                            <img src={previewUrl} alt="معاينة الصورة" />
                        </div>
                    )}
                </div>
                <div className="form-actions">
                    <button type="submit">تسجيل المخالفة</button>
                    <button type="button" onClick={() => navigate('/dashboard')}>إلغاء</button>
                </div>
            </form>
        </div>
    );
};

export default NewViolation;
