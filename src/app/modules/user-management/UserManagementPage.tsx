// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Button,
//   IconButton,
//   Chip,
//   Typography,
//   Avatar,
//   Menu,
//   MenuItem,
//   ListItemIcon,
//   ListItemText,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogContentText,
//   DialogActions,
//   CircularProgress,
// } from '@mui/material';
// import AddIcon from '@mui/icons-material/Add';
// import MoreVertIcon from '@mui/icons-material/MoreVert';
// import DeleteIcon from '@mui/icons-material/Delete';
// import BlockIcon from '@mui/icons-material/Block';
// import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// import PersonIcon from '@mui/icons-material/Person';
// import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
// import EditNoteIcon from '@mui/icons-material/EditNote';
// import CreateUserModal from './CreateUserModal';
// import userService, { User, ADMIN_USER } from './userService';
// import { toast } from 'react-toastify';
// import { PageTitle } from '../../../_metronic/layout/core';
// import { getCurrentUser, isAdmin } from '../auth/session';
// import client from '../service/network';

// const UserManagementPage: React.FC = () => {
//   const [users, setUsers] = useState<User[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [openCreateModal, setOpenCreateModal] = useState(false);
//   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
//   const [selectedUserForDelete, setSelectedUserForDelete] = useState<User | null>(null);
//   const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
//   const [deleting, setDeleting] = useState(false);
  
//   const currentUserIsAdmin = isAdmin();
//   const currentUser = getCurrentUser();

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const fetchUsers = async () => {
//     setLoading(true);
//     try {
//       const data = await userService.getAllUsers();
//       setUsers(data);
//       console.log('Fetched users:', data);
//     } catch (error) {
//       console.error('Failed to fetch users:', error);
//       toast.error('Failed to load users');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCreateUser = async (userData: any) => {
//     try {
//       await userService.createUser(userData);
//       await fetchUsers();
//       toast.success('User created successfully!');
//     } catch (error: any) {
//       console.error('Failed to create user:', error);
//       toast.error(error.message || 'Failed to create user');
//     }
//   };

//   // Helper function to delete all news of a user using localStorage + API
//   const deleteAllNewsOfUser = async (username: string): Promise<void> => {
//     console.log(`Deleting all news for user: ${username}`);
    
//     const newsCreatorsRaw = localStorage.getItem('news_creators');
//     if (!newsCreatorsRaw) {
//       console.log('No news_creators found in localStorage');
//       return;
//     }
//     const newsCreators: Record<string, string> = JSON.parse(newsCreatorsRaw);
    
//     const newsIdsToDelete = Object.keys(newsCreators).filter(
//       (newsId) => newsCreators[newsId] === username
//     );
    
//     if (newsIdsToDelete.length === 0) {
//       console.log(`No news found for user ${username}`);
//       return;
//     }
    
//     console.log(`Found ${newsIdsToDelete.length} news items for user ${username}:`, newsIdsToDelete);
    
//     const deletedIdsRaw = localStorage.getItem('deleted_news_ids');
//     const deletedIds: string[] = deletedIdsRaw ? JSON.parse(deletedIdsRaw) : [];
    
//     let deletedCount = 0;
    
//     for (const newsId of newsIdsToDelete) {
//       try {
//         await client.delete(`news/${newsId}`);
//         console.log(`API delete successful for news ${newsId}`);
//         if (!deletedIds.includes(newsId)) deletedIds.push(newsId);
//         delete newsCreators[newsId];
//         deletedCount++;
//       } catch (error: any) {
//         console.error(`Failed to delete news ${newsId} via API:`, error);
//         if (!deletedIds.includes(newsId)) deletedIds.push(newsId);
//         delete newsCreators[newsId];
//         deletedCount++;
//       }
//     }
    
//     localStorage.setItem('deleted_news_ids', JSON.stringify(deletedIds));
//     localStorage.setItem('news_creators', JSON.stringify(newsCreators));
    
//     console.log(`Successfully deleted ${deletedCount} out of ${newsIdsToDelete.length} news items for user ${username}`);
//     if (deletedCount > 0) {
//       toast.success(`Deleted ${deletedCount} news item(s) from user ${username}`);
//     }
//   };

//   const handleCloseDeleteDialog = () => {
//     setOpenDeleteDialog(false);
//     setSelectedUserForDelete(null);
//   };

//   const handleConfirmDelete = async () => {
//     console.log('Confirm delete for user:', selectedUserForDelete);
    
//     if (!selectedUserForDelete) {
//       toast.error('No user selected for deletion');
//       handleCloseDeleteDialog();
//       return;
//     }
    
//     if (selectedUserForDelete.username === ADMIN_USER.username) {
//       toast.error('Cannot delete the main admin user!');
//       handleCloseDeleteDialog();
//       return;
//     }
    
//     if (!currentUserIsAdmin) {
//       toast.error('Only administrators can delete users');
//       handleCloseDeleteDialog();
//       return;
//     }
    
//     setDeleting(true);
//     try {
//       await deleteAllNewsOfUser(selectedUserForDelete.username);
//       await userService.deleteUser(selectedUserForDelete.username);
//       toast.success(`User "${selectedUserForDelete.username}" and their news deleted successfully!`);
//       await fetchUsers();
//     } catch (error: any) {
//       console.error('Failed to delete user or news:', error);
//       toast.error(error.message || 'Failed to delete user');
//     } finally {
//       setDeleting(false);
//       handleCloseDeleteDialog();
//     }
//   };

//   // ✅ FIXED: Toggle status with optimistic update and proper error handling
//   const handleToggleStatus = async (user: User) => {
//     console.log('Toggle status for user:', user);
    
//     if (!currentUserIsAdmin) {
//       toast.error('Only administrators can modify user status');
//       return;
//     }
    
//     if (user.username === ADMIN_USER.username) {
//       toast.error('Cannot modify admin user status');
//       return;
//     }
    
//     const newStatus = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
//     const oldStatus = user.status;
    
//     // Optimistically update UI immediately
//     setUsers(prevUsers =>
//       prevUsers.map(u =>
//         u.id === user.id ? { ...u, status: newStatus } : u
//       )
//     );
    
//     try {
//       await userService.updateUser(user.id, { status: newStatus });
//       toast.success(`User ${newStatus === 'ACTIVE' ? 'activated' : 'deactivated'} successfully!`);
//       // Refresh from server to ensure consistency
//       await fetchUsers();
//     } catch (error: any) {
//       console.error('Failed to update user status:', error);
//       toast.error(error.message || 'Failed to update user status');
//       // Revert optimistic update on error
//       setUsers(prevUsers =>
//         prevUsers.map(u =>
//           u.id === user.id ? { ...u, status: oldStatus } : u
//         )
//       );
//     }
//     setAnchorEl(null);
//   };

//   const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, user: User) => {
//     event.stopPropagation();
//     if (!currentUserIsAdmin) return;
//     setAnchorEl(event.currentTarget);
//     setSelectedUserForDelete(user);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//   };

//   const getRoleColor = (role: string) => {
//     switch (role) {
//       case 'ADMIN': return 'error';
//       case 'EDITOR': return 'warning';
//       case 'USER': return 'info';
//       default: return 'default';
//     }
//   };

//   const getRoleIcon = (role: string) => {
//     switch (role) {
//       case 'ADMIN': return <AdminPanelSettingsIcon fontSize="small" />;
//       case 'EDITOR': return <EditNoteIcon fontSize="small" />;
//       default: return <PersonIcon fontSize="small" />;
//     }
//   };

//   const formatDate = (dateString?: string) => {
//     if (!dateString) return 'Never';
//     const date = new Date(dateString);
//     return date.toLocaleString('en-US', {
//       month: 'short',
//       day: 'numeric',
//       year: 'numeric',
//       hour: 'numeric',
//       minute: '2-digit',
//       hour12: true,
//     });
//   };

//   if (loading) {
//     return (
//       <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   return (
//     <>
//       <PageTitle description="" breadcrumbs={[]}>
//         User Management
//       </PageTitle>

//       <Box sx={{ p: 3 }}>
//         <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
//           <Box sx={{ 
//             p: 3, 
//             display: 'flex', 
//             justifyContent: 'space-between', 
//             alignItems: 'center',
//             borderBottom: '1px solid #e0e7ff',
//             bgcolor: '#f8fafc'
//           }}>
//             <Typography variant="h5" fontWeight="600">
//               User Management
//             </Typography>
//             {currentUserIsAdmin && (
//               <Button
//                 variant="contained"
//                 startIcon={<AddIcon />}
//                 onClick={() => setOpenCreateModal(true)}
//                 sx={{
//                   bgcolor: '#1b84ff',
//                   '&:hover': { bgcolor: '#1674e0' },
//                   textTransform: 'none',
//                   borderRadius: 2,
//                   px: 3,
//                 }}
//               >
//                 Create New User
//               </Button>
//             )}
//           </Box>

//           <TableContainer>
//             <Table sx={{ minWidth: 650 }}>
//               <TableHead>
//                 <TableRow sx={{ bgcolor: '#f1f5f9' }}>
//                   <TableCell sx={{ fontWeight: 600 }}>Username</TableCell>
//                   <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
//                   <TableCell sx={{ fontWeight: 600 }}>Created</TableCell>
//                   <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
//                   <TableCell sx={{ fontWeight: 600 }}>Last Login</TableCell>
//                   {currentUserIsAdmin && <TableCell sx={{ fontWeight: 600, width: 50 }}>Actions</TableCell>}
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {users.map((user) => (
//                   <TableRow key={user.id} hover>
//                     <TableCell>
//                       <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
//                         <Avatar sx={{ 
//                           bgcolor: user.username === ADMIN_USER.username ? '#d32f2f' : '#1b84ff', 
//                           width: 32, 
//                           height: 32 
//                         }}>
//                           {user.username.charAt(0).toUpperCase()}
//                         </Avatar>
//                         <Typography fontWeight={500}>
//                           {user.username}
//                           {user.username === ADMIN_USER.username && (
//                             <Chip label="Main Admin" size="small" color="error" sx={{ ml: 1, height: 20, fontSize: '0.7rem' }} />
//                           )}
//                         </Typography>
//                       </Box>
//                     </TableCell>
//                     <TableCell>
//                       <Chip
//                         icon={getRoleIcon(user.role)}
//                         label={user.role}
//                         color={getRoleColor(user.role) as any}
//                         size="small"
//                         sx={{ fontWeight: 500 }}
//                       />
//                     </TableCell>
//                     <TableCell>{formatDate(user.createdAt)}</TableCell>
//                     <TableCell>
//                       <Chip
//                         label={user.status}
//                         color={user.status === 'ACTIVE' ? 'success' : 'default'}
//                         size="small"
//                         sx={{ fontWeight: 500 }}
//                       />
//                     </TableCell>
//                     <TableCell>{formatDate(user.lastLogin)}</TableCell>
//                     {currentUserIsAdmin && user.username !== ADMIN_USER.username && (
//                       <TableCell>
//                         <IconButton
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             handleMenuOpen(e, user);
//                           }}
//                         >
//                           <MoreVertIcon />
//                         </IconButton>
//                       </TableCell>
//                     )}
//                     {currentUserIsAdmin && user.username === ADMIN_USER.username && (
//                       <TableCell>
//                         <Typography variant="caption" color="textSecondary">
//                           Protected
//                         </Typography>
//                       </TableCell>
//                     )}
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </Paper>
//       </Box>

//       {/* Actions Menu */}
//       <Menu
//         anchorEl={anchorEl}
//         open={Boolean(anchorEl)}
//         onClose={handleMenuClose}
//         anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
//         transformOrigin={{ vertical: 'top', horizontal: 'right' }}
//       >
//         <MenuItem onClick={() => {
//           if (selectedUserForDelete) {
//             handleToggleStatus(selectedUserForDelete);
//           }
//           handleMenuClose();
//         }}>
//           <ListItemIcon>
//             {selectedUserForDelete?.status === 'ACTIVE' ? <BlockIcon color="error" /> : <CheckCircleIcon color="success" />}
//           </ListItemIcon>
//           <ListItemText>
//             {selectedUserForDelete?.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
//           </ListItemText>
//         </MenuItem>
//         <MenuItem onClick={() => {
//           handleMenuClose();
//           setOpenDeleteDialog(true);
//         }}>
//           <ListItemIcon>
//             <DeleteIcon color="error" />
//           </ListItemIcon>
//           <ListItemText>Delete</ListItemText>
//         </MenuItem>
//       </Menu>

//       {/* Delete Confirmation Dialog */}
//       <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
//         <DialogTitle>Delete User?</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             Are you sure you want to delete user <strong>{selectedUserForDelete?.username}</strong>? This action cannot be undone, and <strong>all news uploaded by this user will also be deleted</strong>.
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseDeleteDialog} disabled={deleting}>Cancel</Button>
//           <Button onClick={handleConfirmDelete} color="error" variant="contained" disabled={deleting}>
//             {deleting ? <CircularProgress size={24} /> : 'Delete User & News'}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Create User Modal */}
//       <CreateUserModal
//         open={openCreateModal}
//         onClose={() => setOpenCreateModal(false)}
//         onCreateUser={handleCreateUser}
//       />
//     </>
//   );
// };

// export default UserManagementPage;






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
import client from '../service/network';

const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedUserForDelete, setSelectedUserForDelete] = useState<User | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);
  
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

  // ✅ Delete all news of a user (existing)
  const deleteAllNewsOfUser = async (username: string): Promise<void> => {
    console.log(`Deleting all news for user: ${username}`);
    
    const newsCreatorsRaw = localStorage.getItem('news_creators');
    if (!newsCreatorsRaw) {
      console.log('No news_creators found in localStorage');
      return;
    }
    const newsCreators: Record<string, string> = JSON.parse(newsCreatorsRaw);
    
    const newsIdsToDelete = Object.keys(newsCreators).filter(
      (newsId) => newsCreators[newsId] === username
    );
    
    if (newsIdsToDelete.length === 0) {
      console.log(`No news found for user ${username}`);
      return;
    }
    
    console.log(`Found ${newsIdsToDelete.length} news items for user ${username}:`, newsIdsToDelete);
    
    const deletedIdsRaw = localStorage.getItem('deleted_news_ids');
    const deletedIds: string[] = deletedIdsRaw ? JSON.parse(deletedIdsRaw) : [];
    
    let deletedCount = 0;
    
    for (const newsId of newsIdsToDelete) {
      try {
        await client.delete(`news/${newsId}`);
        console.log(`API delete successful for news ${newsId}`);
        if (!deletedIds.includes(newsId)) deletedIds.push(newsId);
        delete newsCreators[newsId];
        deletedCount++;
      } catch (error: any) {
        console.error(`Failed to delete news ${newsId} via API:`, error);
        if (!deletedIds.includes(newsId)) deletedIds.push(newsId);
        delete newsCreators[newsId];
        deletedCount++;
      }
    }
    
    localStorage.setItem('deleted_news_ids', JSON.stringify(deletedIds));
    localStorage.setItem('news_creators', JSON.stringify(newsCreators));
    
    console.log(`Successfully deleted ${deletedCount} out of ${newsIdsToDelete.length} news items for user ${username}`);
    if (deletedCount > 0) {
      toast.success(`Deleted ${deletedCount} news item(s) from user ${username}`);
    }
  };

  // ✅ NEW: Delete all quizzes of a user
  const deleteAllQuizzesOfUser = async (username: string): Promise<void> => {
    console.log(`Deleting all quizzes for user: ${username}`);
    
    const quizCreatorsRaw = localStorage.getItem('quiz_creators');
    if (!quizCreatorsRaw) {
      console.log('No quiz_creators found in localStorage');
      return;
    }
    const quizCreators: Record<string, string> = JSON.parse(quizCreatorsRaw);
    
    const quizIdsToDelete = Object.keys(quizCreators).filter(
      (quizId) => quizCreators[quizId] === username
    );
    
    if (quizIdsToDelete.length === 0) {
      console.log(`No quizzes found for user ${username}`);
      return;
    }
    
    console.log(`Found ${quizIdsToDelete.length} quizzes for user ${username}:`, quizIdsToDelete);
    
    let deletedCount = 0;
    for (const quizId of quizIdsToDelete) {
      try {
        await client.delete(`/quiz/${quizId}`);
        console.log(`API delete successful for quiz ${quizId}`);
        delete quizCreators[quizId];
        deletedCount++;
      } catch (error: any) {
        console.error(`Failed to delete quiz ${quizId} via API:`, error);
        delete quizCreators[quizId];
        deletedCount++;
      }
    }
    localStorage.setItem('quiz_creators', JSON.stringify(quizCreators));
    console.log(`Successfully deleted ${deletedCount} out of ${quizIdsToDelete.length} quizzes for user ${username}`);
    if (deletedCount > 0) {
      toast.success(`Deleted ${deletedCount} quiz(zes) from user ${username}`);
    }
  };

  const deleteAllReelsOfUser = async (username: string): Promise<void> => {
    console.log(`Deleting all reels for user: ${username}`);
    const reelCreatorsRaw = localStorage.getItem('reel_creators');
    if (!reelCreatorsRaw) {
      console.log('No reel_creators found in localStorage');
      return;
    }
    const reelCreators: Record<string, string> = JSON.parse(reelCreatorsRaw);
    const reelIdsToDelete = Object.keys(reelCreators).filter(id => reelCreators[id] === username);
    if (reelIdsToDelete.length === 0) {
      console.log(`No reels found for user ${username}`);
      return;
    }
    let deletedCount = 0;
    for (const reelId of reelIdsToDelete) {
      try {
        await client.delete(`/reels/${reelId}`);
        console.log(`Deleted reel ${reelId}`);
        delete reelCreators[reelId];
        deletedCount++;
      } catch (err) {
        console.error(`Failed to delete reel ${reelId}:`, err);
        delete reelCreators[reelId];
        deletedCount++;
      }
    }
    localStorage.setItem('reel_creators', JSON.stringify(reelCreators));
    if (deletedCount > 0) toast.success(`Deleted ${deletedCount} reel(s) from user ${username}`);
  };

  const deleteAllPostsOfUser = async (username: string): Promise<void> => {
    console.log(`Deleting all posts for user: ${username}`);
    
    const postCreatorsRaw = localStorage.getItem('post_creators');
    if (!postCreatorsRaw) {
      console.log('No post_creators found in localStorage');
      return;
    }
    const postCreators: Record<string, string> = JSON.parse(postCreatorsRaw);
    
    const postIdsToDelete = Object.keys(postCreators).filter(
      (postId) => postCreators[postId] === username
    );
    
    if (postIdsToDelete.length === 0) {
      console.log(`No posts found for user ${username}`);
      return;
    }
    
    console.log(`Found ${postIdsToDelete.length} posts for user ${username}:`, postIdsToDelete);
    
    let deletedCount = 0;
    for (const postId of postIdsToDelete) {
      try {
        await client.delete(`/post/${postId}`);
        console.log(`API delete successful for post ${postId}`);
        delete postCreators[postId];
        deletedCount++;
      } catch (error: any) {
        console.error(`Failed to delete post ${postId} via API:`, error);
        delete postCreators[postId];
        deletedCount++;
      }
    }
    localStorage.setItem('post_creators', JSON.stringify(postCreators));
    console.log(`Successfully deleted ${deletedCount} out of ${postIdsToDelete.length} posts for user ${username}`);
    if (deletedCount > 0) {
      toast.success(`Deleted ${deletedCount} post(s) from user ${username}`);
    }
  };


  const deleteAllPollsOfUser = async (username: string): Promise<void> => {
    console.log(`Deleting all polls for user: ${username}`);
    
    const pollCreatorsRaw = localStorage.getItem('poll_creators');
    if (!pollCreatorsRaw) {
      console.log('No poll_creators found in localStorage');
      return;
    }
    const pollCreators: Record<string, string> = JSON.parse(pollCreatorsRaw);
    
    const pollIdsToDelete = Object.keys(pollCreators).filter(
      (pollId) => pollCreators[pollId] === username
    );
    
    if (pollIdsToDelete.length === 0) {
      console.log(`No polls found for user ${username}`);
      return;
    }
    
    console.log(`Found ${pollIdsToDelete.length} polls for user ${username}:`, pollIdsToDelete);
    
    let deletedCount = 0;
    for (const pollId of pollIdsToDelete) {
      try {
        await client.delete(`poll/${pollId}`);
        console.log(`API delete successful for poll ${pollId}`);
        delete pollCreators[pollId];
        deletedCount++;
      } catch (error: any) {
        console.error(`Failed to delete poll ${pollId} via API:`, error);
        delete pollCreators[pollId];
        deletedCount++;
      }
    }
    localStorage.setItem('poll_creators', JSON.stringify(pollCreators));
    console.log(`Successfully deleted ${deletedCount} out of ${pollIdsToDelete.length} polls for user ${username}`);
    if (deletedCount > 0) {
      toast.success(`Deleted ${deletedCount} poll(s) from user ${username}`);
    }
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedUserForDelete(null);
  };

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

    setDeleting(true);
    try {
      // Step 1: Delete all news of this user
      await deleteAllNewsOfUser(selectedUserForDelete.username);
      // Step 2: Delete all quizzes of this user
      await deleteAllQuizzesOfUser(selectedUserForDelete.username);
      await deleteAllPostsOfUser(selectedUserForDelete.username);   // ✅ new line
      await deleteAllPollsOfUser(selectedUserForDelete.username);   // ✅ new line
      await userService.deleteUser(selectedUserForDelete.username);
      await deleteAllReelsOfUser(selectedUserForDelete.username);   // ✅ new line
      toast.success(`User "${selectedUserForDelete.username}" and their content deleted successfully!`);
      await fetchUsers();  // Refresh user list
    } catch (error: any) {
      console.error('Failed to delete user or content:', error);
      toast.error(error.message || 'Failed to delete user');
    } finally {
      setDeleting(false);
      handleCloseDeleteDialog();
    }
  };

  // Toggle active/inactive (content remains)
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
    const oldStatus = user.status;
    
    // Optimistically update UI immediately
    setUsers(prevUsers =>
      prevUsers.map(u =>
        u.id === user.id ? { ...u, status: newStatus } : u
      )
    );
    
    try {
      await userService.updateUser(user.id, { status: newStatus });
      toast.success(`User ${newStatus === 'ACTIVE' ? 'activated' : 'deactivated'} successfully!`);
      await fetchUsers();
    } catch (error: any) {
      console.error('Failed to update user status:', error);
      toast.error(error.message || 'Failed to update user status');
      // Revert optimistic update on error
      setUsers(prevUsers =>
        prevUsers.map(u =>
          u.id === user.id ? { ...u, status: oldStatus } : u
        )
      );
    }
    setAnchorEl(null);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, user: User) => {
    event.stopPropagation();
    if (!currentUserIsAdmin) return;
    setAnchorEl(event.currentTarget);
    setSelectedUserForDelete(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
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
                            handleMenuOpen(e, user);
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
            Are you sure you want to delete user <strong>{selectedUserForDelete?.username}</strong>? This action cannot be undone, and <strong>all news & quizzes uploaded by this user will also be deleted</strong>.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} disabled={deleting}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained" disabled={deleting}>
            {deleting ? <CircularProgress size={24} /> : 'Delete User & Content'}
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
