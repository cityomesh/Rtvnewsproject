import React, { useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  useTheme,
  FormControl,
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
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) =>
    event.preventDefault();
  const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) =>
    event.preventDefault();

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

      try {
        // ✅ ALWAYS call backend API
        const response = await client.post('auth/login', {
          phoneNumber: values.phoneNumber,
          password: values.password,
        });

        if (response.status === 200) {
          // Extract JWT token
          const authToken =
            response.headers['jwt-token'] ||
            response.headers['Jwt-Token'] ||
            response.headers['authorization'];

          if (!authToken) {
            toast.error('Login failed: No token received');
            setSubmitting(false);
            return;
          }

          const userData = response.data || {};

          // ✅ Use backend `role` field directly
          const role = (userData.role || 'USER').toUpperCase();

          // Save token + user
          localStorage.setItem('token', authToken);
          setToken(authToken);
          setAuth({ api_token: authToken });
          setCurrentUser({
            username: userData.phoneNumber || userData.name || values.phoneNumber,
            role: role,
            name: userData.name || userData.phoneNumber || values.phoneNumber,
          });

          console.log('✅ Login success:', {
            username: userData.phoneNumber,
            role: role,
            rawRole: userData.role,
          });

          toast.success(
            `Welcome ${userData.name || userData.phoneNumber || ''}!`
          );
          navigate('/dashboard');
          setSubmitting(false);
          return;
        }

        toast.error('Login failed');
        setSubmitting(false);
      } catch (err: any) {
        console.error('Login error:', err);

        const status = err?.response?.status;
        if (status === 401) {
          toast.error('Invalid Credentials!');
          setErrors({ password: 'Invalid Credentials' });
        } else if (status === 403) {
          toast.error('Your account is deactivated. Please contact admin.');
          setErrors({ password: 'Account deactivated' });
        } else {
          toast.error('Login failed. Please try again.');
          setErrors({ password: 'Login failed' });
        }
        setSubmitting(false);
      }
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
            error={
              formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)
            }
            helperText={
              formik.touched.phoneNumber && formik.errors.phoneNumber
            }
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
            <strong>Note:</strong> Any active user can login. Deactivated
            accounts cannot login.
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;
