import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Alert,
} from '@mui/material';

interface CreateUserModalProps {
  open: boolean;
  onClose: () => void;
  onCreateUser: (user: any) => void;
}

const CreateUserModal: React.FC<CreateUserModalProps> = ({ open, onClose, onCreateUser }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'USER',
  });
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});

  const validate = () => {
    const newErrors: { username?: string; password?: string } = {};
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 4) {
      newErrors.password = 'Password must be at least 4 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onCreateUser(formData);
      setFormData({ username: '', password: '', role: 'USER' });
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 600, fontSize: '1.5rem' }}>
        Create New User
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
            Users will be able to log in with these credentials and access the management system.
          </Typography>
          
          <TextField
            fullWidth
            label="Username *"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            margin="normal"
            error={!!errors.username}
            helperText={errors.username}
            placeholder="Enter username"
          />
          
          <TextField
            fullWidth
            label="Password *"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            margin="normal"
            error={!!errors.password}
            helperText={errors.password}
            placeholder="Enter password"
          />
          
          <FormControl fullWidth margin="normal">
            <InputLabel>Role *</InputLabel>
            <Select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              label="Role *"
            >
              <MenuItem value="ADMIN">Admin</MenuItem>
              <MenuItem value="EDITOR">Editor</MenuItem>
              <MenuItem value="USER">User</MenuItem>
              <MenuItem value="VIEWER">Viewer</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button onClick={onClose} variant="outlined" color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Create User
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateUserModal;
