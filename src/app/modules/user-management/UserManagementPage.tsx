import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Chip,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import EditNoteIcon from '@mui/icons-material/EditNote';
import CreateUserModal from './CreateUserModal';
import userService, { User, ADMIN_USER } from './userService';
import { toast } from 'react-toastify';
import { PageTitle } from '../../../_metronic/layout/core';
import { getCurrentUser, isAdmin } from '../auth/session';

const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedUserForDelete, setSelectedUserForDelete] = useState<User | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  
  const currentUserIsAdmin = isAdmin();
  const currentUser = getCurrentUser();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await userService.getAllUsers();
      setUsers(data);
      console.log('Fetched users:', data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (userData: any) => {
    try {
      await userService.createUser(userData);
      await fetchUsers();
      toast.success('User created successfully!');
    } catch (error: any) {
      console.error('Failed to create user:', error);
      toast.error(error.message || 'Failed to create user');
    }
  };

  // Open delete dialog
  const handleDeleteClick = (user: User) => {
    console.log('Delete clicked for user:', user);
    setSelectedUserForDelete(user);
    setOpenDeleteDialog(true);
    setAnchorEl(null); // Close menu
  };

  // Close delete dialog
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedUserForDelete(null);
  };

  // Execute delete
  const handleConfirmDelete = async () => {
    console.log('Confirm delete for user:', selectedUserForDelete);
    
    if (!selectedUserForDelete) {
      toast.error('No user selected for deletion');
      handleCloseDeleteDialog();
      return;
    }
    
    if (selectedUserForDelete.username === ADMIN_USER.username) {
      toast.error('Cannot delete the main admin user!');
      handleCloseDeleteDialog();
      return;
    }
    
    if (!currentUserIsAdmin) {
      toast.error('Only administrators can delete users');
      handleCloseDeleteDialog();
      return;
    }
    
    try {
      await userService.deleteUser(selectedUserForDelete.username);
      toast.success(`User "${selectedUserForDelete.username}" deleted successfully!`);
      await fetchUsers(); // Refresh the list
    } catch (error: any) {
      console.error('Failed to delete user:', error);
      toast.error(error.message || 'Failed to delete user');
    }
    handleCloseDeleteDialog();
  };

  const handleToggleStatus = async (user: User) => {
    console.log('Toggle status for user:', user);
    
    if (!currentUserIsAdmin) {
      toast.error('Only administrators can modify user status');
      return;
    }
    
    if (user.username === ADMIN_USER.username) {
      toast.error('Cannot modify admin user status');
      return;
    }
    
    const newStatus = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await userService.updateUser(user.id, { status: newStatus });
      await fetchUsers();
      toast.success(`User ${newStatus === 'ACTIVE' ? 'activated' : 'deactivated'} successfully!`);
    } catch (error: any) {
      console.error('Failed to update user status:', error);
      toast.error(error.message || 'Failed to update user status');
    }
    setAnchorEl(null);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, user: User) => {
    event.stopPropagation();
    console.log('Menu opened for user:', user);
    if (!currentUserIsAdmin) return;
    setAnchorEl(event.currentTarget);
    // Store selected user in a ref or state for menu actions
    (window as any).selectedMenuUser = user;
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    (window as any).selectedMenuUser = null;
  };

  const getSelectedMenuUser = (): User | null => {
    return (window as any).selectedMenuUser || null;
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'error';
      case 'EDITOR': return 'warning';
      case 'USER': return 'info';
      default: return 'default';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'ADMIN': return <AdminPanelSettingsIcon fontSize="small" />;
      case 'EDITOR': return <EditNoteIcon fontSize="small" />;
      default: return <PersonIcon fontSize="small" />;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <PageTitle description="" breadcrumbs={[]}>
        User Management
      </PageTitle>

      <Box sx={{ p: 3 }}>
        <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Box sx={{ 
            p: 3, 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            borderBottom: '1px solid #e0e7ff',
            bgcolor: '#f8fafc'
          }}>
            <Typography variant="h5" fontWeight="600">
              User Management
            </Typography>
            {currentUserIsAdmin && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setOpenCreateModal(true)}
                sx={{
                  bgcolor: '#1b84ff',
                  '&:hover': { bgcolor: '#1674e0' },
                  textTransform: 'none',
                  borderRadius: 2,
                  px: 3,
                }}
              >
                Create New User
              </Button>
            )}
          </Box>

          {!currentUserIsAdmin && (
            <Alert severity="info" sx={{ m: 2 }}>
              You have view-only access. User management is restricted to administrators only.
            </Alert>
          )}

          <TableContainer>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f1f5f9' }}>
                  <TableCell sx={{ fontWeight: 600 }}>Username</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Created</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Last Login</TableCell>
                  {currentUserIsAdmin && <TableCell sx={{ fontWeight: 600, width: 50 }}>Actions</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ 
                          bgcolor: user.username === ADMIN_USER.username ? '#d32f2f' : '#1b84ff', 
                          width: 32, 
                          height: 32 
                        }}>
                          {user.username.charAt(0).toUpperCase()}
                        </Avatar>
                        <Typography fontWeight={500}>
                          {user.username}
                          {user.username === ADMIN_USER.username && (
                            <Chip label="Main Admin" size="small" color="error" sx={{ ml: 1, height: 20, fontSize: '0.7rem' }} />
                          )}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getRoleIcon(user.role)}
                        label={user.role}
                        color={getRoleColor(user.role) as any}
                        size="small"
                        sx={{ fontWeight: 500 }}
                      />
                    </TableCell>
                    <TableCell>{formatDate(user.createdAt)}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.status}
                        color={user.status === 'ACTIVE' ? 'success' : 'default'}
                        size="small"
                        sx={{ fontWeight: 500 }}
                      />
                    </TableCell>
                    <TableCell>{formatDate(user.lastLogin)}</TableCell>
                    {currentUserIsAdmin && user.username !== ADMIN_USER.username && (
                      <TableCell>
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedUserForDelete(user);
                            setAnchorEl(e.currentTarget);
                          }}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </TableCell>
                    )}
                    {currentUserIsAdmin && user.username === ADMIN_USER.username && (
                      <TableCell>
                        <Typography variant="caption" color="textSecondary">
                          Protected
                        </Typography>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={() => {
          if (selectedUserForDelete) {
            handleToggleStatus(selectedUserForDelete);
          }
          handleMenuClose();
        }}>
          <ListItemIcon>
            {selectedUserForDelete?.status === 'ACTIVE' ? <BlockIcon color="error" /> : <CheckCircleIcon color="success" />}
          </ListItemIcon>
          <ListItemText>
            {selectedUserForDelete?.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
          </ListItemText>
        </MenuItem>
        <MenuItem onClick={() => {
          handleMenuClose();
          setOpenDeleteDialog(true);
        }}>
          <ListItemIcon>
            <DeleteIcon color="error" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Delete User?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete user <strong>{selectedUserForDelete?.username}</strong>? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create User Modal */}
      <CreateUserModal
        open={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        onCreateUser={handleCreateUser}
      />
    </>
  );
};

export default UserManagementPage;
