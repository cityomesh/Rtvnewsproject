/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  useTheme,
  FormControl
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated, setToken, setCurrentUser } from '../session';
import { setAuth } from '../core/AuthHelpers';
import client from '../../service/network';
import { toast } from 'react-toastify';

const validationSchema = Yup.object({
  phoneNumber: Yup.string().required('Username is required'),
  password: Yup.string().required('Password is required'),
});

const Login: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };
  const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await isAuthenticated();
      if (authenticated) {
        navigate('/dashboard');
      }
    };
    checkAuth();
  }, [navigate]);

  const formik = useFormik({
    initialValues: {
      phoneNumber: 'rocky',
      password: 'rawtv',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      console.log('Login attempt:', values.phoneNumber);

      // ---------- STEP 1: Admin (rocky) API login ----------
      if (values.phoneNumber === 'rocky' && values.password === 'rawtv') {
        try {
          // Send phoneNumber field (not username)
          const response = await client.post('auth/login', {
            phoneNumber: values.phoneNumber,
            password: values.password,
          });
          if (response.status === 200) {
            const authToken = response.headers['jwt-token'] || response.headers['Jwt-Token'];
            if (authToken) {
              localStorage.setItem('token', authToken);
              localStorage.setItem('admin_token', authToken);
              setToken(authToken);
              setAuth({ api_token: authToken });
              setCurrentUser({
                username: 'rocky',
                role: 'ADMIN',
                name: 'Rocky',
              });
              toast.success('Welcome Admin!');
              navigate('/dashboard');
              setSubmitting(false);
              return;
            }
          }
        } catch (err) {
          console.error('Admin login error:', err);
        }
        // Fallback: already stored admin token
        const existingAdminToken = localStorage.getItem('admin_token');
        if (existingAdminToken) {
          localStorage.setItem('token', existingAdminToken);
          setToken(existingAdminToken);
          setAuth({ api_token: existingAdminToken });
          setCurrentUser({
            username: 'rocky',
            role: 'ADMIN',
            name: 'Rocky',
          });
          toast.success('Welcome Admin!');
          navigate('/dashboard');
          setSubmitting(false);
          return;
        }
        toast.error('Admin login failed');
        setErrors({ password: 'Admin login failed' });
        setSubmitting(false);
        return;
      }

      // ---------- STEP 2: Normal user (localStorage) ----------
      const storedUsers = localStorage.getItem('app_users');
      const users = storedUsers ? JSON.parse(storedUsers) : [];
      const foundUser = users.find(
        (u: any) => u.phoneNumber === values.phoneNumber && u.password === values.password
      );

      if (foundUser) {
        console.log('Normal user found:', foundUser);
        const adminToken = localStorage.getItem('admin_token');
        if (!adminToken) {
          toast.error('Please login as admin (rocky) at least once first.');
          setErrors({ password: 'Admin not initialized' });
          setSubmitting(false);
          return;
        }
        localStorage.setItem('token', adminToken);
        setToken(adminToken);
        setAuth({ api_token: adminToken });
        setCurrentUser({
          username: foundUser.phoneNumber,
          role: foundUser.role?.toUpperCase() || 'USER',
          name: foundUser.name || foundUser.phoneNumber,
        });
        toast.success(`Welcome ${foundUser.name || foundUser.phoneNumber}!`);
        navigate('/dashboard');
        setSubmitting(false);
        return;
      }

      toast.error('Invalid Credentials!');
      setErrors({ password: 'Invalid Credentials' });
      setSubmitting(false);
    },
  });

  return (
    <Box
      sx={{
        backgroundImage: 'url(/media/auth/bg7-dark.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 2,
        bgcolor: theme.palette.background.default,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          maxWidth: 400,
          width: '100%',
          bgcolor: theme.palette.background.paper,
          color: theme.palette.text.primary,
        }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          Login
        </Typography>

        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="User name"
            name="phoneNumber"
            value={formik.values.phoneNumber}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
            helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
          />

          <FormControl variant="outlined" fullWidth margin="normal">
            <InputLabel htmlFor="password">Password</InputLabel>
            <OutlinedInput
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    onMouseUp={handleMouseUpPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />
          </FormControl>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={formik.isSubmitting}
            sx={{ mt: 2 }}
          >
            {formik.isSubmitting ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        <Box sx={{ mt: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
          <Typography variant="caption" display="block" color="textSecondary">
            <strong>Note:</strong> Admin (rocky) must login first. Then created users can login and create news.
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;
