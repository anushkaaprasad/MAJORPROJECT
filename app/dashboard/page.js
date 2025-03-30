'use client';

import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Button, 
  Paper, 
  Tabs, 
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Grid,
  Alert
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from 'axios';
import { useAuth } from '../../components/AuthContext';
import Navbar from '../../components/Navbar';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [tabValue, setTabValue] = useState(0);
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    title: '',
    description: '',
    startTime: new Date(),
    endTime: new Date(new Date().getTime() + 2 * 60 * 60 * 1000) // Default 2 hours later
  });
  const [bookingError, setBookingError] = useState('');

  useEffect(() => {
    // Redirect if not logged in
    if (!loading && !user) {
      router.push('/login');
    } else if (user) {
      fetchBookings();
    }
  }, [user, loading, router]);

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get('/api/bookings');
      
      console.log('Raw booking data:', res.data.data);
      
      // Filter bookings for the current user - with better ID comparison and null checks
      const userBookings = res.data.data.filter(booking => {
        // Handle case where booking.user might be undefined
        if (!booking.user) {
          console.log('Booking has no user data:', booking);
          return false;
        }
        
        // Some APIs return user as object, some as string ID
        const bookingUserId = booking.user._id || booking.user;
        const currentUserId = user.id;
        
        // Log for debugging
        console.log('Booking:', booking.title);
        console.log('Booking User ID:', bookingUserId);
        console.log('Current User ID:', currentUserId);
        
        // Safe toString conversion with null checks
        const bookingIdStr = bookingUserId ? bookingUserId.toString() : '';
        const userIdStr = currentUserId ? currentUserId.toString() : '';
        
        // Try different comparison methods
        return (
          bookingUserId === currentUserId || 
          bookingIdStr === userIdStr || 
          (booking.user && booking.user.email === user.email)
        );
      });
      
      console.log('Filtered bookings:', userBookings);
      
      setBookings(userBookings);
    } catch (err) {
      setError('Failed to fetch bookings');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
    setBookingError('');
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleBookingChange = (field, value) => {
    setBookingForm({
      ...bookingForm,
      [field]: value
    });
  };

  const handleCreateBooking = async () => {
    try {
      setBookingError('');

      // Validate form
      if (!bookingForm.title.trim()) {
        setBookingError('Title is required');
        return;
      }

      if (!bookingForm.description.trim()) {
        setBookingError('Description is required');
        return;
      }

      if (bookingForm.endTime <= bookingForm.startTime) {
        setBookingError('End time must be after start time');
        return;
      }

      const res = await axios.post('/api/bookings', bookingForm);

      if (res.data.success) {
        fetchBookings();
        handleCloseDialog();
        // Reset form
        setBookingForm({
          title: '',
          description: '',
          startTime: new Date(),
          endTime: new Date(new Date().getTime() + 2 * 60 * 60 * 1000)
        });
      }
    } catch (err) {
      setBookingError(
        err.response?.data?.message || 'Failed to create booking'
      );
      console.error(err);
    }
  };

  const handleCancelBooking = async (id) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await axios.delete(`/api/bookings/${id}`);
        fetchBookings();
      } catch (err) {
        setError('Failed to cancel booking');
        console.error(err);
      }
    }
  };

  const getStatusChipColor = (status) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      default:
        return 'warning';
    }
  };

  if (loading || !user) {
    return (
      <>
        <Navbar />
        <Container className="py-16">
          <Typography>Loading...</Typography>
        </Container>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Container className="py-8">
        <Box className="mb-6">
          <Typography variant="h4" component="h1" className="font-bold mb-2">
            Welcome, {user.name}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Manage your auditorium bookings here
          </Typography>
        </Box>

        <Box className="mb-4 flex justify-between items-center">
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="My Bookings" />
            <Tab label="Calendar View" />
          </Tabs>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenDialog}
          >
            New Booking
          </Button>
        </Box>

        {error && (
          <Alert severity="error" className="mb-4">
            {error}
          </Alert>
        )}

        <TabPanel value={tabValue} index={0}>
          {isLoading ? (
            <Typography>Loading bookings...</Typography>
          ) : bookings.length === 0 ? (
            <Paper className="p-8 text-center">
              <Typography variant="h6" className="mb-4">
                You don't have any bookings yet
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleOpenDialog}
              >
                Create Your First Booking
              </Button>
            </Paper>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Time</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking._id}>
                      <TableCell>{booking.title}</TableCell>
                      <TableCell>
                        {new Date(booking.startTime).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {new Date(booking.startTime).toLocaleTimeString()} - {' '}
                        {new Date(booking.endTime).toLocaleTimeString()}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          color={getStatusChipColor(booking.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {booking.status === 'pending' && (
                          <Button
                            size="small"
                            color="error"
                            onClick={() => handleCancelBooking(booking._id)}
                          >
                            Cancel
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <Paper className="p-4">
            <Typography variant="h6" className="mb-4">
              Calendar View (Coming Soon)
            </Typography>
            <Typography>
              A visual calendar view of bookings will be available here in a future update.
            </Typography>
          </Paper>
        </TabPanel>

        {/* Booking Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
          <DialogTitle>Create New Booking</DialogTitle>
          <DialogContent>
            {bookingError && (
              <Alert severity="error" className="mb-4 mt-2">
                {bookingError}
              </Alert>
            )}
            <TextField
              label="Event Title"
              fullWidth
              margin="normal"
              value={bookingForm.title}
              onChange={(e) => handleBookingChange('title', e.target.value)}
              required
            />
            <TextField
              label="Event Description"
              fullWidth
              margin="normal"
              multiline
              rows={4}
              value={bookingForm.description}
              onChange={(e) => handleBookingChange('description', e.target.value)}
              required
            />
            <Grid container spacing={2} className="mt-2">
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateTimePicker
                    label="Start Time"
                    value={bookingForm.startTime}
                    onChange={(date) => handleBookingChange('startTime', date)}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateTimePicker
                    label="End Time"
                    value={bookingForm.endTime}
                    onChange={(date) => handleBookingChange('endTime', date)}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleCreateBooking} color="primary">
              Create Booking
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box className="py-4">{children}</Box>}
    </div>
  );
} 