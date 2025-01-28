import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Grid,
  Alert,
  LinearProgress,
  IconButton,
  Tooltip,
  Chip,
} from '@mui/material';
import { Warning, Info, Refresh, Speed, LocalParking, TrafficRounded } from '@mui/icons-material';

const ViolationPrediction = () => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPredictions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/violations/predict');
      
      if (response.data.success) {
        setPredictions(response.data.data);
      } else {
        setError('فشل في جلب التنبؤات');
      }
    } catch (err) {
      console.error('Prediction error:', err);
      setError('حدث خطأ أثناء جلب التنبؤات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPredictions();
    // Refresh predictions every 3 minutes
    const interval = setInterval(fetchPredictions, 3 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const getRiskColor = (score) => {
    if (score >= 0.8) return '#f44336'; // High risk - Red
    if (score >= 0.6) return '#ff9800'; // Medium risk - Orange
    return '#4caf50'; // Low risk - Green
  };

  const getRiskLabel = (score) => {
    if (score >= 0.8) return 'خطر عالي';
    if (score >= 0.6) return 'خطر متوسط';
    return 'خطر منخفض';
  };

  const getViolationTypeInfo = (type) => {
    const types = {
      'speed': {
        icon: <Speed />,
        label: 'تجاوز السرعة',
        color: '#f44336'
      },
      'parking': {
        icon: <LocalParking />,
        label: 'مخالفة وقوف',
        color: '#ff9800'
      },
      'redLight': {
        icon: <TrafficRounded />,
        label: 'تجاوز الإشارة الحمراء',
        color: '#f44336'
      },
      'default': {
        icon: <Warning />,
        label: 'مخالفة أخرى',
        color: '#757575'
      }
    };
    return types[type] || types.default;
  };

  if (loading && predictions.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" component="h2">
          نظام التنبؤ بالمخالفات المرورية
        </Typography>
        <Tooltip title="تحديث التنبؤات">
          <IconButton onClick={fetchPredictions} disabled={loading}>
            <Refresh />
          </IconButton>
        </Tooltip>
      </Box>

      {loading && (
        <Box mb={2}>
          <LinearProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {predictions.map((prediction) => (
          <Grid item xs={12} sm={6} md={4} key={prediction.vehiclePlateNumber}>
            <Card 
              sx={{ 
                position: 'relative',
                '&:hover': { transform: 'translateY(-4px)', transition: 'transform 0.2s' }
              }}
            >
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6" component="div">
                    {prediction.vehiclePlateNumber}
                  </Typography>
                  <Chip
                    label={`${Math.round(prediction.riskScore * 100)}% - ${getRiskLabel(prediction.riskScore)}`}
                    sx={{
                      backgroundColor: getRiskColor(prediction.riskScore),
                      color: 'white',
                    }}
                  />
                </Box>

                <Box mt={2}>
                  <Typography color="textSecondary" gutterBottom>
                    المخالفة المتوقعة:
                  </Typography>
                  <Chip
                    icon={getViolationTypeInfo(prediction.predictedViolationType).icon}
                    label={getViolationTypeInfo(prediction.predictedViolationType).label}
                    sx={{
                      backgroundColor: getViolationTypeInfo(prediction.predictedViolationType).color,
                      color: 'white',
                    }}
                  />
                </Box>

                <Box mt={2}>
                  <Typography color="textSecondary" gutterBottom>
                    معلومات المركبة:
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    النوع: {prediction.vehicleDetails.type}
                  </Typography>
                  <Typography variant="body2">
                    الموديل: {prediction.vehicleDetails.model}
                  </Typography>
                </Box>

                {prediction.riskScore >= 0.8 && (
                  <Alert 
                    severity="warning" 
                    icon={<Warning />}
                    sx={{ mt: 2 }}
                  >
                    تحذير: احتمالية عالية لوقوع مخالفة
                  </Alert>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {predictions.length === 0 && !loading && (
        <Box 
          display="flex" 
          alignItems="center" 
          justifyContent="center" 
          minHeight="200px"
        >
          <Info sx={{ mr: 1 }} />
          <Typography>
            لم يتم العثور على تنبؤات للمخالفات حالياً
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ViolationPrediction;
