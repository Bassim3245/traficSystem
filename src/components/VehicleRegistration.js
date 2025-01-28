import React, { useState } from 'react';
import {
  Container,
  Card,
  Form,
  Button,
  Alert,
  Row,
  Col,
  InputGroup
} from 'react-bootstrap';
import { 
  FaCar, 
  FaUser, 
  FaPhone, 
  FaPalette, 
  FaCarSide,
  FaCheckCircle
} from 'react-icons/fa';
import './VehicleRegistration.css';
import axios from 'axios';

const VehicleRegistration = () => {
  const [formData, setFormData] = useState({
    plateNumber: '',
    ownerName: '',
    phoneNumber: '',
    model: '',
    color: '',
  });
  const [validated, setValidated] = useState(false);
  const [feedback, setFeedback] = useState({ message: '', error: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^07[3-9][0-9]{8}$/; // Iraqi phone number format
    return phoneRegex.test(phone);
  };

  const validatePlateNumber = (plate) => {
    const plateRegex = /^[0-9]{1,5}[أ-ي]{1,2}$/; // Iraqi plate number format
    return plateRegex.test(plate);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    
    if (!validatePhoneNumber(formData.phoneNumber)) {
      setFeedback({
        message: '',
        error: 'يرجى إدخال رقم هاتف عراقي صحيح'
      });
      return;
    }

    if (!validatePlateNumber(formData.plateNumber)) {
      setFeedback({
        message: '',
        error: 'يرجى إدخال رقم لوحة صحيح'
      });
      return;
    }

    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    setLoading(true);
    const token = localStorage.getItem('userToken');

    try {
      await axios.post('http://localhost:5000/api/vehicles', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFeedback({ 
        message: 'تم تسجيل السيارة بنجاح', 
        error: '' 
      });
      setFormData({
        plateNumber: '',
        ownerName: '',
        phoneNumber: '',
        model: '',
        color: '',
      });
      setValidated(false);
    } catch (err) {
      setFeedback({
        message: '',
        error: err.response?.data?.message || 'خطأ في تسجيل السيارة',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="vehicle-registration-container">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="registration-card">
            <Card.Body>
              <div className="text-center mb-4">
                <FaCar className="registration-icon" />
                <h2 className="registration-title">تسجيل سيارة جديدة</h2>
              </div>

              {feedback.message && (
                <Alert variant="success" className="text-center">
                  <FaCheckCircle className="me-2" />
                  {feedback.message}
                </Alert>
              )}
              
              {feedback.error && (
                <Alert variant="danger" className="text-center">
                  {feedback.error}
                </Alert>
              )}

              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <InputGroup>
                    <InputGroup.Text>
                      <FaCarSide />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="مثال: 12345أ"
                      name="plateNumber"
                      value={formData.plateNumber}
                      onChange={handleChange}
                      required
                      isInvalid={validated && !validatePlateNumber(formData.plateNumber)}
                    />
                    <Form.Control.Feedback type="invalid">
                      يرجى إدخال رقم لوحة صحيح
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mb-3">
                  <InputGroup>
                    <InputGroup.Text>
                      <FaUser />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="اسم المالك"
                      name="ownerName"
                      value={formData.ownerName}
                      onChange={handleChange}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      يرجى إدخال اسم المالك
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mb-3">
                  <InputGroup>
                    <InputGroup.Text>
                      <FaPhone />
                    </InputGroup.Text>
                    <Form.Control
                      type="tel"
                      placeholder="07xxxxxxxxx"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      required
                      isInvalid={validated && !validatePhoneNumber(formData.phoneNumber)}
                    />
                    <Form.Control.Feedback type="invalid">
                      يرجى إدخال رقم هاتف صحيح
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <InputGroup>
                        <InputGroup.Text>
                          <FaCar />
                        </InputGroup.Text>
                        <Form.Control
                          type="text"
                          placeholder="موديل السيارة"
                          name="model"
                          value={formData.model}
                          onChange={handleChange}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          يرجى إدخال موديل السيارة
                        </Form.Control.Feedback>
                      </InputGroup>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <InputGroup>
                        <InputGroup.Text>
                          <FaPalette />
                        </InputGroup.Text>
                        <Form.Control
                          type="text"
                          placeholder="لون السيارة"
                          name="color"
                          value={formData.color}
                          onChange={handleChange}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          يرجى إدخال لون السيارة
                        </Form.Control.Feedback>
                      </InputGroup>
                    </Form.Group>
                  </Col>
                </Row>

                <Button
                  type="submit"
                  className="submit-button"
                  disabled={loading}
                >
                  {loading ? 'جاري التسجيل...' : 'تسجيل السيارة'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default VehicleRegistration;
