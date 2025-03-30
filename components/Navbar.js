'use client';

import { useState } from 'react';
import { useAuth } from './AuthContext';
import Link from 'next/link';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Drawer, 
  List, 
  ListItem, 
  ListItemText, 
  Box,
  Avatar,
  Menu,
  MenuItem,
  Divider
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
  };

  return (
    <AppBar position="static" className="bg-primary">
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={toggleDrawer(true)}
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link href="/" className="text-white no-underline">
            Auditorium Booking
          </Link>
        </Typography>

        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
          <Link href="/" passHref>
            <Button color="inherit">Home</Button>
          </Link>
          
          {!user ? (
            <>
              <Link href="/login" passHref>
                <Button color="inherit">Login</Button>
              </Link>
              <Link href="/register" passHref>
                <Button color="inherit">Register</Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/dashboard" passHref>
                <Button color="inherit">Dashboard</Button>
              </Link>
              
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <Avatar 
                  sx={{ width: 32, height: 32 }}
                  className="bg-primary-dark"
                >
                  {user.name.charAt(0)}
                </Avatar>
              </IconButton>
              
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem disabled>
                  <Typography variant="body2">
                    Signed in as <strong>{user.name}</strong>
                  </Typography>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleClose}>
                  <Link href="/profile" className="no-underline text-gray-800">
                    Profile
                  </Link>
                </MenuItem>
                {user.role === 'admin' && (
                  <MenuItem onClick={handleClose}>
                    <Link href="/admin" className="no-underline text-gray-800">
                      Admin Panel
                    </Link>
                  </MenuItem>
                )}
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Toolbar>
      
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
      >
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List>
            <ListItem button component={Link} href="/">
              <ListItemText primary="Home" />
            </ListItem>
            
            {!user ? (
              <>
                <ListItem button component={Link} href="/login">
                  <ListItemText primary="Login" />
                </ListItem>
                <ListItem button component={Link} href="/register">
                  <ListItemText primary="Register" />
                </ListItem>
              </>
            ) : (
              <>
                <ListItem button component={Link} href="/dashboard">
                  <ListItemText primary="Dashboard" />
                </ListItem>
                <ListItem button component={Link} href="/profile">
                  <ListItemText primary="Profile" />
                </ListItem>
                {user.role === 'admin' && (
                  <ListItem button component={Link} href="/admin">
                    <ListItemText primary="Admin Panel" />
                  </ListItem>
                )}
                <ListItem button onClick={logout}>
                  <ListItemText primary="Logout" />
                </ListItem>
              </>
            )}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Navbar; 