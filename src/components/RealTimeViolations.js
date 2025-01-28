import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Alert,
  Snackbar,
} from '@mui/material';
import { Warning } from '@mui/icons-material';

const RealTimeViolations = () => {
  const [violations, setViolations] = useState([]);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const socket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000');

    socket.on('newViolation', (violation) => {
      setViolations((prev) => [violation, ...prev].slice(0, 10));
      setNotification({
        message: `New violation detected: ${violation.type} at ${violation.location}`,
        severity: 'warning'
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Real-Time Violations
      </Typography>
      {violations.map((violation, index) => (
        <Card key={index} sx={{ mb: 2 }}>
          <CardContent>
            <Box display="flex" alignItems="center" gap={1}>
              <Warning color="warning" />
              <Typography variant="body1">
                {violation.type} - {violation.location}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              {new Date(violation.timestamp).toLocaleString()}
            </Typography>
          </CardContent>
        </Card>
      ))}
      <Snackbar
        open={!!notification}
        autoHideDuration={6000}
        onClose={() => setNotification(null)}
      >
        <Alert
          onClose={() => setNotification(null)}
          severity={notification?.severity}
          sx={{ width: '100%' }}
        >
          {notification?.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RealTimeViolations;
