'use client';

import { Box, Typography, Button, Container, Grid, Paper } from '@mui/material';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import Image from 'next/image';
import { useAuth } from '../components/AuthContext';

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <main>
      <Navbar />
      
      <Box
        className="py-16 bg-gradient-to-b from-primary to-primary-dark text-white"
      >
        <Container>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" component="h1" className="font-bold mb-4">
                Book Your Auditorium
              </Typography>
              <Typography variant="h5" className="mb-6">
                Simple and efficient way to reserve auditorium spaces for your events
              </Typography>
              <Box>
                {user ? (
                  <Button 
                    variant="contained" 
                    size="large"
                    onClick={() => router.push('/dashboard')}
                    className="bg-white text-primary hover:bg-gray-100"
                  >
                    Go to Dashboard
                  </Button>
                ) : (
                  <Box className="space-x-4">
                    <Button 
                      variant="contained" 
                      size="large"
                      onClick={() => router.push('/login')}
                      className="bg-white text-primary hover:bg-gray-100"
                    >
                      Login
                    </Button>
                    <Button 
                      variant="outlined" 
                      size="large"
                      onClick={() => router.push('/register')}
                      className="border-white text-white hover:bg-white hover:text-primary"
                    >
                      Register
                    </Button>
                  </Box>
                )}
              </Box>
            </Grid>
            <Grid item xs={12} md={6} className="flex justify-center">
              <Box className="rounded-lg overflow-hidden shadow-xl">
                {/* Placeholder for an auditorium image */}
                <div className="w-full h-80 bg-gray-300 flex items-center justify-center">
                  <Typography variant="h6" className="text-gray-600">
                    Auditorium Image
                  </Typography>
                </div>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      <Container className="py-16">
        <Typography variant="h3" component="h2" className="text-center mb-12 font-semibold">
          How It Works
        </Typography>
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Paper elevation={2} className="p-6 h-full">
              <Typography variant="h5" className="mb-4 font-medium">
                1. Create an Account
              </Typography>
              <Typography variant="body1">
                Register with your details to get started with booking the auditorium.
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper elevation={2} className="p-6 h-full">
              <Typography variant="h5" className="mb-4 font-medium">
                2. Book Your Slot
              </Typography>
              <Typography variant="body1">
                Choose your preferred date and time for your event and submit the booking request.
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper elevation={2} className="p-6 h-full">
              <Typography variant="h5" className="mb-4 font-medium">
                3. Get Confirmation
              </Typography>
              <Typography variant="body1">
                Your booking will be reviewed by admin and you'll receive a confirmation once approved.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
      
      <Box className="py-12 bg-gray-100">
        <Container>
          <Typography variant="h3" component="h2" className="text-center mb-8 font-semibold">
            Features
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} lg={3}>
              <Box className="text-center p-4">
                <Typography variant="h6" className="mb-2">
                  Easy Booking
                </Typography>
                <Typography variant="body2">
                  Simple interface to book auditorium slots
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6} lg={3}>
              <Box className="text-center p-4">
                <Typography variant="h6" className="mb-2">
                  Real-time Updates
                </Typography>
                <Typography variant="body2">
                  Get instant updates on booking status
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6} lg={3}>
              <Box className="text-center p-4">
                <Typography variant="h6" className="mb-2">
                  Admin Dashboard
                </Typography>
                <Typography variant="body2">
                  Dedicated panel for admins to manage bookings
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6} lg={3}>
              <Box className="text-center p-4">
                <Typography variant="h6" className="mb-2">
                  User Profiles
                </Typography>
                <Typography variant="body2">
                  Manage your bookings and account settings
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      <Box className="py-8 bg-gray-800 text-white text-center">
        <Container>
          <Typography variant="body2">
            &copy; {new Date().getFullYear()} Auditorium Booking System
          </Typography>
        </Container>
      </Box>
    </main>
  );
} 