import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  Container, 
  Table,
  Button, 
  Badge,
  Row,
  Col,
  Spinner,
  Alert,
  Form,
  InputGroup
} from "react-bootstrap";
import { FaSearch, FaCalendarAlt, FaMapMarkerAlt, FaCar, FaMoneyBillWave } from 'react-icons/fa';
import "./ViolationsList.css";

const ViolationsList = () => {
  const [violations, setViolations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchViolations();
  }, []);

  const fetchViolations = async () => {
    try {
      const token = localStorage.getItem("userToken");
      const response = await axios.get("/api/violations", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setViolations(response?.data?.data);
      setLoading(false);
    } catch (err) {
      setError("حدث خطأ في جلب المخالفات");
      setLoading(false);
    }
  };

  const filteredViolations = violations?.filter(violation => {
    const matchesSearch = 
      violation.violationNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      violation.vehicleNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      violation.location?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === "all") return matchesSearch;
    return matchesSearch && violation.violationType === filter;
  });

  const getStatusBadgeVariant = (type) => {
    const variants = {
      "تجاوز السرعة": "danger",
      "وقوف خاطئ": "warning",
      "تجاوز الإشارة": "danger",
      "default": "info"
    };
    return variants[type] || variants.default;
  };

  if (loading) return (
    <div className="loading-container">
      <Spinner animation="border" variant="primary" />
      <p className="mt-2">جاري التحميل...</p>
    </div>
  );

  if (error) return (
    <Container className="mt-4">
      <Alert variant="danger" className="text-center">
        {error}
      </Alert>
    </Container>
  );

  return (
    <Container className="violations-container">
      <h2 className="text-center mb-4 page-title">قائمة المخالفات المرورية</h2>
      
      <div className="filter-section mb-4">
        <Row>
          <Col md={6}>
            <InputGroup>
              <InputGroup.Text>
                <FaSearch />
              </InputGroup.Text>
              <Form.Control
                placeholder="ابحث عن مخالفة..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </Col>
          <Col md={6}>
            <Form.Select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">جميع المخالفات</option>
              <option value="تجاوز السرعة">تجاوز السرعة</option>
              <option value="وقوف خاطئ">وقوف خاطئ</option>
              <option value="تجاوز الإشارة">تجاوز الإشارة</option>
            </Form.Select>
          </Col>
        </Row>
      </div>

      <div className="table-responsive">
        <Table hover className="violations-table">
          <thead>
            <tr>
              <th>صورة المخالفة</th>
              <th>رقم المخالفة</th>
              <th>نوع المخالفة</th>
              <th>رقم المركبة</th>
              <th>التاريخ</th>
              <th>الموقع</th>
              <th>الغرامة</th>
              <th>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filteredViolations?.map((violation) => (
              <tr key={violation._id}>
                <td>
                  {violation.imageUrl && (
                    <div className="violation-image-container">
                      <img src={violation.imageUrl} alt="صورة المخالفة" className="violation-thumbnail" />
                    </div>
                  )}
                </td>
                <td>{violation.violationNumber}</td>
                <td>
                  <Badge bg={getStatusBadgeVariant(violation.violationType)}>
                    {violation.violationType}
                  </Badge>
                </td>
                <td>
                  <div className="vehicle-number">
                    <FaCar className="icon-small" />
                    {violation.vehicleNumber}
                  </div>
                </td>
                <td>
                  <div className="date">
                    <FaCalendarAlt className="icon-small" />
                    {new Date(violation.date).toLocaleDateString("ar-IQ")}
                  </div>
                </td>
                <td>
                  <div className="location">
                    <FaMapMarkerAlt className="icon-small" />
                    {violation.location}
                  </div>
                </td>
                <td>
                  <div className="fine">
                    <FaMoneyBillWave className="icon-small" />
                    {violation.fine} دينار
                  </div>
                </td>
                <td>
                  <Button variant="primary" size="sm" className="details-button">
                    عرض التفاصيل
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      
      {filteredViolations?.length === 0 && (
        <Alert variant="info" className="text-center mt-4">
          لا توجد مخالفات مطابقة للبحث
        </Alert>
      )}
    </Container>
  );
};

export default ViolationsList;
