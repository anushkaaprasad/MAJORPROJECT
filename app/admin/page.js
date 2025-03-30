'use client';

import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Paper, 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Card,
  CardContent,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Alert
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import EventIcon from '@mui/icons-material/Event';
import PendingIcon from '@mui/icons-material/Pending';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import axios from 'axios';
import { useAuth } from '../../components/AuthContext';
import Navbar from '../../components/Navbar';
import { useRouter } from 'next/navigation';

export default function AdminPanel() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [actionError, setActionError] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });

  useEffect(() => {
    // Redirect if not logged in or not admin
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/dashboard');
    } else if (user && user.role === 'admin') {
      fetchBookings();
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (bookings.length > 0) {
      if (searchTerm.trim() === '') {
        setFilteredBookings(bookings);
      } else {
        const filtered = bookings.filter(
          booking => 
            booking.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.status.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredBookings(filtered);
      }
    }
  }, [searchTerm, bookings]);

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get('/api/bookings');
      setBookings(res.data.data);
      setFilteredBookings(res.data.data);
      
      // Calculate stats
      const total = res.data.data.length;
      const pending = res.data.data.filter(b => b.status === 'pending').length;
      const approved = res.data.data.filter(b => b.status === 'approved').length;
      const rejected = res.data.data.filter(b => b.status === 'rejected').length;
      
      setStats({
        total,
        pending,
        approved,
        rejected
      });
    } catch (err) {
      setError('Failed to fetch bookings');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setOpenDialog(true);
    setActionError('');
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleApproveBooking = async (id) => {
    try {
      setActionError('');
      await axios.put(`/api/bookings/${id}/approve`);
      fetchBookings();
      setOpenDialog(false);
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to approve booking');
      console.error(err);
    }
  };

  const handleRejectBooking = async (id) => {
    try {
      setActionError('');
      await axios.put(`/api/bookings/${id}/reject`);
      fetchBookings();
      setOpenDialog(false);
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to reject booking');
      console.error(err);
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

  if (user.role !== 'admin') {
    return (
      <>
        <Navbar />
        <Container className="py-16">
          <Typography>You don't have permission to access this page.</Typography>
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
            Admin Dashboard
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Manage auditorium bookings and approvals
          </Typography>
        </Box>

        <Grid container spacing={4} className="mb-6">
          <Grid item xs={12} sm={6} lg={3}>
            <Card>
              <CardContent className="flex flex-col items-center">
                <EventIcon fontSize="large" color="primary" className="mb-2" />
                <Typography variant="h5" className="font-bold">
                  {stats.total}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Total Bookings
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} lg={3}>
            <Card>
              <CardContent className="flex flex-col items-center">
                <PendingIcon fontSize="large" color="warning" className="mb-2" />
                <Typography variant="h5" className="font-bold">
                  {stats.pending}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Pending Approval
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} lg={3}>
            <Card>
              <CardContent className="flex flex-col items-center">
                <CheckCircleIcon fontSize="large" color="success" className="mb-2" />
                <Typography variant="h5" className="font-bold">
                  {stats.approved}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Approved Bookings
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} lg={3}>
            <Card>
              <CardContent className="flex flex-col items-center">
                <CancelIcon fontSize="large" color="error" className="mb-2" />
                <Typography variant="h5" className="font-bold">
                  {stats.rejected}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Rejected Bookings
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Paper className="p-4 mb-4">
          <TextField
            fullWidth
            placeholder="Search bookings by title, description, user or status"
            variant="outlined"
            value={searchTerm}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              )
            }}
          />
        </Paper>

        {error && (
          <Alert severity="error" className="mb-4">
            {error}
          </Alert>
        )}

        {isLoading ? (
          <Typography>Loading bookings...</Typography>
        ) : filteredBookings.length === 0 ? (
          <Paper className="p-8 text-center">
            <Typography variant="h6">
              No bookings found
            </Typography>
          </Paper>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredBookings.map((booking) => (
                  <TableRow key={booking._id}>
                    <TableCell>{booking.title}</TableCell>
                    <TableCell>{booking.user.name}</TableCell>
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
                      <Button
                        size="small"
                        onClick={() => handleViewDetails(booking)}
                      >
                        View
                      </Button>
                      {booking.status === 'pending' && (
                        <>
                          <Button
                            size="small"
                            color="success"
                            onClick={() => handleApproveBooking(booking._id)}
                          >
                            Approve
                          </Button>
                          <Button
                            size="small"
                            color="error"
                            onClick={() => handleRejectBooking(booking._id)}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Booking Details Dialog */}
        {selectedBooking && (
          <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
            <DialogTitle>Booking Details</DialogTitle>
            <DialogContent>
              {actionError && (
                <Alert severity="error" className="mb-4 mt-2">
                  {actionError}
                </Alert>
              )}
              
              <Box className="mb-4">
                <Typography variant="h6" gutterBottom>
                  {selectedBooking.title}
                </Typography>
                <Chip
                  label={selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
                  color={getStatusChipColor(selectedBooking.status)}
                  size="small"
                  className="mb-4"
                />
                <Typography variant="body1" className="mb-2">
                  {selectedBooking.description}
                </Typography>
              </Box>
              
              <Box className="mb-4">
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  <EventIcon fontSize="small" className="mr-1" />
                  Date
                </Typography>
                <Typography variant="body2" gutterBottom>
                  {new Date(selectedBooking.startTime).toLocaleDateString()}
                </Typography>
              </Box>
              
              <Box className="mb-4">
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  <AccessTimeIcon fontSize="small" className="mr-1" />
                  Time
                </Typography>
                <Typography variant="body2" gutterBottom>
                  {new Date(selectedBooking.startTime).toLocaleTimeString()} - {' '}
                  {new Date(selectedBooking.endTime).toLocaleTimeString()}
                </Typography>
              </Box>
              
              <Box className="mb-4">
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  User Details
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Name:</strong> {selectedBooking.user.name}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Email:</strong> {selectedBooking.user.email}
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  Booking Information
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Created:</strong> {new Date(selectedBooking.createdAt).toLocaleString()}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Booking ID:</strong> {selectedBooking._id}
                </Typography>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Close</Button>
              {selectedBooking.status === 'pending' && (
                <>
                  <Button 
                    onClick={() => handleApproveBooking(selectedBooking._id)}
                    color="success"
                  >
                    Approve Booking
                  </Button>
                  <Button 
                    onClick={() => handleRejectBooking(selectedBooking._id)}
                    color="error"
                  >
                    Reject Booking
                  </Button>
                </>
              )}
            </DialogActions>
          </Dialog>
        )}
      </Container>
    </>
  );
} 