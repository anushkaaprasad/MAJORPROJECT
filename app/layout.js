'use client';

import React from 'react';
import { Inter } from 'next/font/google';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import '../styles/globals.css';
import { AuthProvider } from '../components/AuthContext';

const inter = Inter({ subsets: ['latin'] });

const theme = createTheme({
  palette: {
    primary: {
      main: '#0078ff',
    },
    secondary: {
      main: '#e2e8f0',
    },
  },
  typography: {
    fontFamily: inter.style.fontFamily,
  },
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
} 