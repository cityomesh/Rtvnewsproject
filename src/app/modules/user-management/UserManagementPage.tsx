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
//   TextField,
//   FormControl,
//   InputLabel,
//   Select,
// } from '@mui/material';
// import AddIcon from '@mui/icons-material/Add';
// import MoreVertIcon from '@mui/icons-material/MoreVert';
// import DeleteIcon from '@mui/icons-material/Delete';
// import BlockIcon from '@mui/icons-material/Block';
// import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// import PersonIcon from '@mui/icons-material/Person';
// import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
// import EditNoteIcon from '@mui/icons-material/EditNote';
// import VisibilityIcon from '@mui/icons-material/Visibility';
// import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
// import InfoIcon from '@mui/icons-material/Info';
// import CreateUserModal from './CreateUserModal';
// import userService, { User, ADMIN_USER } from './userService';
// import { toast } from 'react-toastify';
// import { PageTitle } from '../../../_metronic/layout/core';
// import { getCurrentUser, isAdmin, setCurrentUser } from '../auth/session';
// import client from '../service/network';

// // ============================
// // 🆕 Helpers for NEWS drafts
// // ============================
// const migrateNewsDrafts = (oldUsername: string, newUsername: string) => {
//   const oldKey = `news_drafts_${oldUsername}`;
//   const newKey = `news_drafts_${newUsername}`;
//   const oldDrafts = localStorage.getItem(oldKey);
//   if (oldDrafts) {
//     localStorage.setItem(newKey, oldDrafts);
//     localStorage.removeItem(oldKey);
//     console.log(`News drafts migrated from ${oldKey} to ${newKey}`);
//   }
// };
// const deleteNewsDrafts = (username: string) => {
//   const key = `news_drafts_${username}`;
//   if (localStorage.getItem(key)) {
//     localStorage.removeItem(key);
//     console.log(`News drafts deleted for user: ${username}`);
//   }
// };

// // ============================
// // 🆕 Helpers for QUIZ drafts
// // ============================
// const migrateQuizDrafts = (oldUsername: string, newUsername: string) => {
//   const oldKey = `quiz_drafts_${oldUsername}`;
//   const newKey = `quiz_drafts_${newUsername}`;
//   const oldDrafts = localStorage.getItem(oldKey);
//   if (oldDrafts) {
//     localStorage.setItem(newKey, oldDrafts);
//     localStorage.removeItem(oldKey);
//     console.log(`Quiz drafts migrated from ${oldKey} to ${newKey}`);
//   }
// };
// const deleteQuizDrafts = (username: string) => {
//   const key = `quiz_drafts_${username}`;
//   if (localStorage.getItem(key)) {
//     localStorage.removeItem(key);
//     console.log(`Quiz drafts deleted for user: ${username}`);
//   }
// };

// // ============================
// // 🆕 Helpers for POST drafts
// // ============================
// const migratePostDrafts = (oldUsername: string, newUsername: string) => {
//   const oldKey = `post_drafts_${oldUsername}`;
//   const newKey = `post_drafts_${newUsername}`;
//   const oldDrafts = localStorage.getItem(oldKey);
//   if (oldDrafts) {
//     localStorage.setItem(newKey, oldDrafts);
//     localStorage.removeItem(oldKey);
//     console.log(`Post drafts migrated from ${oldKey} to ${newKey}`);
//   }
// };
// const deletePostDrafts = (username: string) => {
//   const key = `post_drafts_${username}`;
//   if (localStorage.getItem(key)) {
//     localStorage.removeItem(key);
//     console.log(`Post drafts deleted for user: ${username}`);
//   }
// };

// // ============================
// // 🆕 Helpers for REEL drafts
// // ============================
// const migrateReelDrafts = (oldUsername: string, newUsername: string) => {
//   const oldKey = `reel_drafts_${oldUsername}`;
//   const newKey = `reel_drafts_${newUsername}`;
//   const oldDrafts = localStorage.getItem(oldKey);
//   if (oldDrafts) {
//     localStorage.setItem(newKey, oldDrafts);
//     localStorage.removeItem(oldKey);
//     console.log(`Reel drafts migrated from ${oldKey} to ${newKey}`);
//   }
// };
// const deleteReelDrafts = (username: string) => {
//   const key = `reel_drafts_${username}`;
//   if (localStorage.getItem(key)) {
//     localStorage.removeItem(key);
//     console.log(`Reel drafts deleted for user: ${username}`);
//   }
// };

// // ============================
// // 🆕 Helpers for POLL drafts
// // ============================
// const migratePollDrafts = (oldUsername: string, newUsername: string) => {
//   const oldKey = `poll_drafts_${oldUsername}`;
//   const newKey = `poll_drafts_${newUsername}`;
//   const oldDrafts = localStorage.getItem(oldKey);
//   if (oldDrafts) {
//     localStorage.setItem(newKey, oldDrafts);
//     localStorage.removeItem(oldKey);
//     console.log(`Poll drafts migrated from ${oldKey} to ${newKey}`);
//   }
// };
// const deletePollDrafts = (username: string) => {
//   const key = `poll_drafts_${username}`;
//   if (localStorage.getItem(key)) {
//     localStorage.removeItem(key);
//     console.log(`Poll drafts deleted for user: ${username}`);
//   }
// };

// // ============================
// // Main Component
// // ============================
// const UserManagementPage: React.FC = () => {
//   const [users, setUsers] = useState<User[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [openCreateModal, setOpenCreateModal] = useState(false);
//   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
//   const [selectedUserForMenu, setSelectedUserForMenu] = useState<User | null>(null);
//   const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
//   const [deleting, setDeleting] = useState(false);

//   // Edit user states
//   const [editDialogOpen, setEditDialogOpen] = useState(false);
//   const [editingUser, setEditingUser] = useState<User | null>(null);
//   const [editFormData, setEditFormData] = useState({ username: '', role: '', status: '', password: '' });
//   const [showEditPassword, setShowEditPassword] = useState(false);

//   // View user dialog
//   const [viewDialogOpen, setViewDialogOpen] = useState(false);
//   const [viewingUser, setViewingUser] = useState<User | null>(null);
//   const [showViewPassword, setShowViewPassword] = useState(false);

//   const currentUserIsAdmin = isAdmin();
//   const currentUser = getCurrentUser();
//   const currentUsername = currentUser?.username || '';

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const fetchUsers = async () => {
//     setLoading(true);
//     try {
//       const data = await userService.getAllUsers();
//       setUsers(data);
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
//       if (error.message === 'Username already exists!') {
//         toast.error('Username already exists! Please choose a different username.');
//       } else {
//         toast.error(error.message || 'Failed to create user');
//       }
//     }
//   };

//   // View user handler
//   const handleOpenViewDialog = (user: User) => {
//     setViewingUser(user);
//     setShowViewPassword(false);
//     setViewDialogOpen(true);
//     setAnchorEl(null);
//   };

//   const handleCloseViewDialog = () => {
//     setViewDialogOpen(false);
//     setViewingUser(null);
//     setShowViewPassword(false);
//   };

//   // Helper: update username in all creator mappings (news, quiz, post, poll, reel)
//   const updateUsernameInAllMappings = (oldUsername: string, newUsername: string) => {
//     const mappingKeys = [
//       'news_creators', 'quiz_creators', 'post_creators', 'poll_creators', 'reel_creators'
//     ];
//     mappingKeys.forEach(key => {
//       const raw = localStorage.getItem(key);
//       if (raw) {
//         const mapping = JSON.parse(raw);
//         let changed = false;
//         for (const [id, creator] of Object.entries(mapping)) {
//           if (creator === oldUsername) {
//             mapping[id] = newUsername;
//             changed = true;
//           }
//         }
//         if (changed) {
//           localStorage.setItem(key, JSON.stringify(mapping));
//         }
//       }
//     });
//   };

//   // Edit user handlers
//   const handleOpenEditDialog = (user: User) => {
//     setEditingUser(user);
//     setEditFormData({
//       username: user.username,
//       role: user.role,
//       status: user.status,
//       password: '',
//     });
//     setShowEditPassword(false);
//     setEditDialogOpen(true);
//     setAnchorEl(null);
//   };

//   const handleCloseEditDialog = () => {
//     setEditDialogOpen(false);
//     setEditingUser(null);
//     setEditFormData({ username: '', role: '', status: '', password: '' });
//     setShowEditPassword(false);
//   };

//   const handleEditSubmit = async () => {
//     if (!editingUser) return;
//     try {
//       const updates: Partial<User> = {};
//       let usernameChanged = false;
//       let newUsername = editingUser.username;

//       // Check username change
//       if (editFormData.username && editFormData.username !== editingUser.username) {
//         // Check if new username already exists (excluding current user)
//         const existing = users.find(u => u.username === editFormData.username && u.id !== editingUser.id);
//         if (existing) {
//           toast.error('Username already exists! Choose another.');
//           return;
//         }
//         newUsername = editFormData.username;
//         usernameChanged = true;
//         updates.username = newUsername;
//       }

//       if (editFormData.role && editFormData.role !== editingUser.role) {
//         updates.role = editFormData.role as any;
//       }
//       if (editFormData.status && editFormData.status !== editingUser.status) {
//         updates.status = editFormData.status as any;
//       }
//       if (editFormData.password && editFormData.password.trim() !== '') {
//         updates.password = editFormData.password;
//       }

//       if (Object.keys(updates).length === 0 && !usernameChanged) {
//         toast.info('No changes made');
//         handleCloseEditDialog();
//         return;
//       }

//       await userService.updateUser(editingUser.id, updates);

//       // If username changed, update all creator mappings and migrate drafts
//       if (usernameChanged) {
//         // Migrate all types of drafts
//         migrateNewsDrafts(editingUser.username, newUsername);
//         migrateQuizDrafts(editingUser.username, newUsername);
//         migratePostDrafts(editingUser.username, newUsername);
//         migrateReelDrafts(editingUser.username, newUsername);
//         migratePollDrafts(editingUser.username, newUsername);   // <-- added poll drafts migration
//         // Update all creator mappings
//         updateUsernameInAllMappings(editingUser.username, newUsername);
//         // If the edited user is the currently logged-in user, update currentUser in session
//         if (currentUser && currentUser.username === editingUser.username) {
//           const updatedCurrentUser = { ...currentUser, username: newUsername };
//           setCurrentUser(updatedCurrentUser);
//           localStorage.setItem('currentUser', JSON.stringify(updatedCurrentUser));
//           toast.info('Your username has been updated. Please refresh the page for full effect.');
//         }
//       }

//       toast.success(`User ${editingUser.username} updated successfully`);
//       await fetchUsers();
//       handleCloseEditDialog();
//     } catch (error: any) {
//       console.error(error);
//       toast.error(error.message || 'Failed to update user');
//     }
//   };

//   // Content deletion functions (unchanged)
//   const deleteAllNewsOfUser = async (username: string): Promise<void> => {
//     console.log(`Deleting all news for user: ${username}`);
//     const newsCreatorsRaw = localStorage.getItem('news_creators');
//     if (!newsCreatorsRaw) return;
//     const newsCreators: Record<string, string> = JSON.parse(newsCreatorsRaw);
//     const newsIdsToDelete = Object.keys(newsCreators).filter(newsId => newsCreators[newsId] === username);
//     if (newsIdsToDelete.length === 0) return;
//     const deletedIdsRaw = localStorage.getItem('deleted_news_ids') || '[]';
//     const deletedIds: string[] = JSON.parse(deletedIdsRaw);
//     let deletedCount = 0;
//     for (const newsId of newsIdsToDelete) {
//       try {
//         await client.delete(`news/${newsId}`);
//         if (!deletedIds.includes(newsId)) deletedIds.push(newsId);
//         delete newsCreators[newsId];
//         deletedCount++;
//       } catch (error) {
//         if (!deletedIds.includes(newsId)) deletedIds.push(newsId);
//         delete newsCreators[newsId];
//         deletedCount++;
//       }
//     }
//     localStorage.setItem('deleted_news_ids', JSON.stringify(deletedIds));
//     localStorage.setItem('news_creators', JSON.stringify(newsCreators));
//     if (deletedCount > 0) toast.success(`Deleted ${deletedCount} news item(s) from user ${username}`);
//   };

//   const deleteAllQuizzesOfUser = async (username: string): Promise<void> => {
//     console.log(`Deleting all quizzes for user: ${username}`);
//     const quizCreatorsRaw = localStorage.getItem('quiz_creators');
//     if (!quizCreatorsRaw) return;
//     const quizCreators: Record<string, string> = JSON.parse(quizCreatorsRaw);
//     const quizIdsToDelete = Object.keys(quizCreators).filter(id => quizCreators[id] === username);
//     if (quizIdsToDelete.length === 0) return;
//     let deletedCount = 0;
//     for (const quizId of quizIdsToDelete) {
//       try {
//         await client.delete(`/quiz/${quizId}`);
//         delete quizCreators[quizId];
//         deletedCount++;
//       } catch (error) {
//         delete quizCreators[quizId];
//         deletedCount++;
//       }
//     }
//     localStorage.setItem('quiz_creators', JSON.stringify(quizCreators));
//     if (deletedCount > 0) toast.success(`Deleted ${deletedCount} quiz(zes) from user ${username}`);
//   };



//   //working there 


// const deleteAllReelsOfUser = async (username: string): Promise<void> => {
//   console.log(`Deleting all reels for user: ${username}`);

//   let allReelIds: string[] = [];

//   // 1️⃣ Try mapping (fast path)
//   const reelCreatorsRaw = localStorage.getItem('reel_creators');

//   if (reelCreatorsRaw) {
//     const reelCreators: Record<string, string> = JSON.parse(reelCreatorsRaw);

//     const ids = Object.keys(reelCreators).filter(
//       id => reelCreators[id] === username
//     );

//     if (ids.length > 0) {
//       console.log(`Found ${ids.length} reels in mapping:`, ids);
//       allReelIds.push(...ids);
//     }
//   }

//   // 2️⃣ Fetch reels from API
//   try {
//     const statuses = ['REVIEW_COMPLETE', 'UNDER_REVIEW'];
//     let page = 0;
//     const pageSize = 50;
//     let more = true;
//     let reels: any[] = [];

//     while (more) {
//       for (const status of statuses) {
//         const response = await client.get('/reels/dashboard/search', {
//           params: {
//             status,
//             page,
//             size: pageSize,
//           },
//         });

//         const data = response.data || [];

//         console.log(
//           `Fetched ${data.length} reels for status ${status}, page ${page}`
//         );

//         if (data.length === 0) {
//           more = false;
//           break;
//         }

//         reels = reels.concat(data);
//       }

//       page++;

//       if (reels.length < pageSize * statuses.length) {
//         more = false;
//       }
//     }

//     console.log('Total reels fetched from API:', reels.length);

//     const matchingIds = reels
//       .filter(
//         (reel: any) =>
//           reel.uploadedBy === username ||
//           reel.username === username ||
//           reel.userId === username
//       )
//       .map((reel: any) => reel.id);

//     console.log(
//       `Found ${matchingIds.length} reels via API for ${username}:`,
//       matchingIds
//     );

//     allReelIds.push(...matchingIds);
//   } catch (error) {
//     console.error('Error fetching reels:', error);
//   }

//   // Remove duplicates
//   allReelIds = [...new Set(allReelIds)];

//   console.log('====================================');
//   console.log(`Deleting reels for user: ${username}`);
//   console.log(`Total reels found: ${allReelIds.length}`);
//   console.log('All Reel IDs:', allReelIds);
//   console.log('====================================');

//   if (allReelIds.length === 0) {
//     console.log(`No reels found for user: ${username}`);
//     return;
//   }

//   let deletedIds: string[] = [];
//   let failedIds: string[] = [];

//   // 3️⃣ Batch delete
//   try {
//     console.log('========== BATCH DELETE START ==========');

//     const deleteResponse = await client.delete('/reel/delete', {
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       data: {
//         reelIds: allReelIds,
//       },
//     });

//     console.log('Batch delete response:', deleteResponse);
//     console.log('Batch delete response data:', deleteResponse.data);

//     if (deleteResponse.status === 200) {
//       deletedIds = [...allReelIds];

//       // Remove mapping
//       const creators = JSON.parse(
//         localStorage.getItem('reel_creators') || '{}'
//       );

//       allReelIds.forEach(id => delete creators[id]);

//       localStorage.setItem(
//         'reel_creators',
//         JSON.stringify(creators)
//       );

//       console.log('====================================');
//       console.log('✅ BATCH DELETE SUCCESS');
//       console.log('Deleted IDs:', deletedIds);
//       console.log('Deleted Count:', deletedIds.length);
//       console.log('Failed IDs:', failedIds);
//       console.log('Failed Count:', failedIds.length);
//       console.log('====================================');

//       toast.success(
//         `Deleted ${deletedIds.length} reel(s) from user ${username}`
//       );
//     } else {
//       throw new Error(
//         `Batch delete failed with status ${deleteResponse.status}`
//       );
//     }
//   } catch (error) {
//     console.error('========== BATCH DELETE FAILED ==========');
//     console.error(error);

//     deletedIds = [];
//     failedIds = [];

//     console.log('Trying individual deletion...');

//     for (const reelId of allReelIds) {
//       try {
//         console.log(`Deleting reel using /reel/${reelId}`);

//         await client.delete(`/reel/${reelId}`);

//         deletedIds.push(reelId);

//         console.log(`✅ Deleted reel ${reelId}`);
//       } catch (e1) {
//         console.error(`Failed /reel/${reelId}`, e1);

//         try {
//           console.log(`Trying /reels/${reelId}`);

//           await client.delete(`/reels/${reelId}`);

//           deletedIds.push(reelId);

//           console.log(`✅ Deleted reel ${reelId}`);
//         } catch (e2) {
//           failedIds.push(reelId);

//           console.error(`❌ Failed to delete reel ${reelId}`);
//           console.error(e2);
//         }
//       }
//     }

//     console.log('====================================');
//     console.log('TOTAL IDS:', allReelIds);
//     console.log('SUCCESS IDS:', deletedIds);
//     console.log('FAILED IDS:', failedIds);
//     console.log('SUCCESS COUNT:', deletedIds.length);
//     console.log('FAILED COUNT:', failedIds.length);
//     console.log('====================================');

//     if (deletedIds.length > 0) {
//       toast.success(
//         `${deletedIds.length} reel(s) deleted individually`
//       );
//     }

//     if (failedIds.length > 0) {
//       toast.error(
//         `${failedIds.length} reel(s) failed to delete`
//       );
//     }
//   }
// };

//   const deleteAllPostsOfUser = async (username: string): Promise<void> => {
//     console.log(`Deleting all posts for user: ${username}`);
//     const postCreatorsRaw = localStorage.getItem('post_creators');
//     if (!postCreatorsRaw) return;
//     const postCreators: Record<string, string> = JSON.parse(postCreatorsRaw);
//     const postIdsToDelete = Object.keys(postCreators).filter(id => postCreators[id] === username);
//     if (postIdsToDelete.length === 0) return;
//     let deletedCount = 0;
//     for (const postId of postIdsToDelete) {
//       try {
//         await client.delete(`/post/${postId}`);
//         delete postCreators[postId];
//         deletedCount++;
//       } catch (error) {
//         delete postCreators[postId];
//         deletedCount++;
//       }
//     }
//     localStorage.setItem('post_creators', JSON.stringify(postCreators));
//     if (deletedCount > 0) toast.success(`Deleted ${deletedCount} post(s) from user ${username}`);
//   };

//   const deleteAllPollsOfUser = async (username: string): Promise<void> => {
//     console.log(`Deleting all polls for user: ${username}`);
//     const pollCreatorsRaw = localStorage.getItem('poll_creators');
//     if (!pollCreatorsRaw) return;
//     const pollCreators: Record<string, string> = JSON.parse(pollCreatorsRaw);
//     const pollIdsToDelete = Object.keys(pollCreators).filter(id => pollCreators[id] === username);
//     if (pollIdsToDelete.length === 0) return;
//     let deletedCount = 0;
//     for (const pollId of pollIdsToDelete) {
//       try {
//         await client.delete(`poll/${pollId}`);
//         delete pollCreators[pollId];
//         deletedCount++;
//       } catch (error) {
//         delete pollCreators[pollId];
//         deletedCount++;
//       }
//     }
//     localStorage.setItem('poll_creators', JSON.stringify(pollCreators));
//     if (deletedCount > 0) toast.success(`Deleted ${deletedCount} poll(s) from user ${username}`);
//   };

//   const handleCloseDeleteDialog = () => {
//     setOpenDeleteDialog(false);
//     setSelectedUserForMenu(null);
//   };

//   const handleConfirmDelete = async () => {
//     if (!selectedUserForMenu) return;
//     if (selectedUserForMenu.username === ADMIN_USER.username) {
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
//       await deleteAllNewsOfUser(selectedUserForMenu.username);
//       await deleteAllQuizzesOfUser(selectedUserForMenu.username);
//       await deleteAllPostsOfUser(selectedUserForMenu.username);
//       await deleteAllPollsOfUser(selectedUserForMenu.username);
//       await deleteAllReelsOfUser(selectedUserForMenu.username);
//       // Delete all types of drafts
//       deleteNewsDrafts(selectedUserForMenu.username);
//       deleteQuizDrafts(selectedUserForMenu.username);
//       deletePostDrafts(selectedUserForMenu.username);
//       deleteReelDrafts(selectedUserForMenu.username);
//       deletePollDrafts(selectedUserForMenu.username);   // <-- added poll drafts deletion
//       await userService.deleteUser(selectedUserForMenu.username);
//       toast.success(`User "${selectedUserForMenu.username}" and their content (including drafts) deleted successfully!`);
//       await fetchUsers();
//     } catch (error: any) {
//       console.error('Failed to delete user or content:', error);
//       toast.error(error.message || 'Failed to delete user');
//     } finally {
//       setDeleting(false);
//       handleCloseDeleteDialog();
//     }
//   };

//   const handleToggleStatus = async (user: User) => {
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
//     setUsers(prevUsers =>
//       prevUsers.map(u => (u.id === user.id ? { ...u, status: newStatus } : u))
//     );
//     try {
//       await userService.updateUser(user.id, { status: newStatus });
//       toast.success(`User ${newStatus === 'ACTIVE' ? 'activated' : 'deactivated'} successfully!`);
//       await fetchUsers();
//     } catch (error: any) {
//       console.error('Failed to update user status:', error);
//       toast.error(error.message || 'Failed to update user status');
//       setUsers(prevUsers =>
//         prevUsers.map(u => (u.id === user.id ? { ...u, status: oldStatus } : u))
//       );
//     }
//     setAnchorEl(null);
//   };

//   const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, user: User) => {
//     event.stopPropagation();
//     if (!currentUserIsAdmin) return;
//     setAnchorEl(event.currentTarget);
//     setSelectedUserForMenu(user);
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
//           <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e0e7ff', bgcolor: '#f8fafc' }}>
//             <Typography variant="h5" fontWeight="600">User Management</Typography>
//             {currentUserIsAdmin && (
//               <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenCreateModal(true)} sx={{ bgcolor: '#1b84ff', '&:hover': { bgcolor: '#1674e0' }, textTransform: 'none', borderRadius: 2, px: 3 }}>
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
//                   {currentUserIsAdmin && <TableCell sx={{ fontWeight: 600, width: 80 }}>Actions</TableCell>}
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {users.map((user) => (
//                   <TableRow key={user.id} hover>
//                     <TableCell>
//                       <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
//                         <Avatar sx={{ bgcolor: user.username === ADMIN_USER.username ? '#d32f2f' : '#1b84ff', width: 32, height: 32 }}>
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
//                       <Chip icon={getRoleIcon(user.role)} label={user.role} color={getRoleColor(user.role) as any} size="small" sx={{ fontWeight: 500 }} />
//                     </TableCell>
//                     <TableCell>{formatDate(user.createdAt)}</TableCell>
//                     <TableCell>
//                       <Chip label={user.status} color={user.status === 'ACTIVE' ? 'success' : 'default'} size="small" sx={{ fontWeight: 500 }} />
//                     </TableCell>
//                     <TableCell>{formatDate(user.lastLogin)}</TableCell>
//                     {currentUserIsAdmin && (
//                       <TableCell>
//                         {user.username !== ADMIN_USER.username && user.username !== currentUsername ? (
//                           <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleMenuOpen(e, user); }}>
//                             <MoreVertIcon fontSize="small" />
//                           </IconButton>
//                         ) : (
//                           <Typography variant="caption" color="textSecondary">
//                             {user.username === currentUsername ? 'Current User' : 'Protected'}
//                           </Typography>
//                         )}
//                       </TableCell>
//                     )}
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </Paper>
//       </Box>

//       {/* Three-dots menu */}
//       <Menu
//         anchorEl={anchorEl}
//         open={Boolean(anchorEl)}
//         onClose={handleMenuClose}
//         anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
//         transformOrigin={{ vertical: 'top', horizontal: 'right' }}
//       >
//         <MenuItem onClick={() => { if (selectedUserForMenu) handleOpenViewDialog(selectedUserForMenu); }}>
//           <ListItemIcon><InfoIcon fontSize="small" /></ListItemIcon>
//           <ListItemText>View Details</ListItemText>
//         </MenuItem>
//         <MenuItem onClick={() => { if (selectedUserForMenu) handleOpenEditDialog(selectedUserForMenu); }}>
//           <ListItemIcon><EditNoteIcon fontSize="small" /></ListItemIcon>
//           <ListItemText>Edit</ListItemText>
//         </MenuItem>
//         <MenuItem onClick={() => { if (selectedUserForMenu) handleToggleStatus(selectedUserForMenu); handleMenuClose(); }}>
//           <ListItemIcon>
//             {selectedUserForMenu?.status === 'ACTIVE' ? <BlockIcon color="error" /> : <CheckCircleIcon color="success" />}
//           </ListItemIcon>
//           <ListItemText>{selectedUserForMenu?.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}</ListItemText>
//         </MenuItem>
//         <MenuItem onClick={() => { handleMenuClose(); setOpenDeleteDialog(true); }}>
//           <ListItemIcon><DeleteIcon color="error" /></ListItemIcon>
//           <ListItemText>Delete</ListItemText>
//         </MenuItem>
//       </Menu>

//       {/* View Details Dialog */}
//       <Dialog open={viewDialogOpen} onClose={handleCloseViewDialog} maxWidth="sm" fullWidth>
//         <DialogTitle>User Details</DialogTitle>
//         <DialogContent>
//           {viewingUser && (
//             <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
//               <Typography><strong>Username:</strong> {viewingUser.username}</Typography>
//               <Typography><strong>Role:</strong> {viewingUser.role}</Typography>
//               <Typography><strong>Status:</strong> {viewingUser.status}</Typography>
//               <Typography><strong>Created:</strong> {formatDate(viewingUser.createdAt)}</Typography>
//               <Typography><strong>Last Login:</strong> {formatDate(viewingUser.lastLogin)}</Typography>
//               {currentUserIsAdmin && (
//                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                   <Typography><strong>Password:</strong> {showViewPassword ? (viewingUser.password || 'N/A') : '••••••'}</Typography>
//                   <IconButton size="small" onClick={() => setShowViewPassword(!showViewPassword)}>
//                     {showViewPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
//                   </IconButton>
//                 </Box>
//               )}
//             </Box>
//           )}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseViewDialog}>Close</Button>
//         </DialogActions>
//       </Dialog>

//       {/* Delete Confirmation Dialog */}
//       <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
//         <DialogTitle>Delete User?</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             Are you sure you want to delete user <strong>{selectedUserForMenu?.username}</strong>? This action cannot be undone, and <strong>all content (news, quizzes, posts, polls, reels) uploaded by this user will also be deleted</strong>.
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseDeleteDialog} disabled={deleting}>Cancel</Button>
//           <Button onClick={handleConfirmDelete} color="error" variant="contained" disabled={deleting}>
//             {deleting ? <CircularProgress size={24} /> : 'Delete User & Content'}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Edit User Dialog */}
//       <Dialog open={editDialogOpen} onClose={handleCloseEditDialog} maxWidth="xs" fullWidth>
//         <DialogTitle>Edit User: {editingUser?.username}</DialogTitle>
//         <DialogContent>
//           <TextField
//             fullWidth
//             margin="normal"
//             label="Username"
//             value={editFormData.username}
//             onChange={(e) => setEditFormData({ ...editFormData, username: e.target.value })}
//             helperText="Changing username will affect all content created by this user"
//           />
//           <FormControl fullWidth margin="normal">
//             <InputLabel>Role</InputLabel>
//             <Select value={editFormData.role} onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })} label="Role">
//               <MenuItem value="ADMIN">Admin</MenuItem>
//               <MenuItem value="EDITOR">Editor</MenuItem>
//               <MenuItem value="USER">User</MenuItem>
//               <MenuItem value="VIEWER">Viewer</MenuItem>
//             </Select>
//           </FormControl>
//           <FormControl fullWidth margin="normal">
//             <InputLabel>Status</InputLabel>
//             <Select value={editFormData.status} onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })} label="Status">
//               <MenuItem value="ACTIVE">Active</MenuItem>
//               <MenuItem value="INACTIVE">Inactive</MenuItem>
//             </Select>
//           </FormControl>
//           <TextField
//             fullWidth margin="normal"
//             label="New Password (leave blank to keep unchanged)"
//             type={showEditPassword ? 'text' : 'password'}
//             value={editFormData.password}
//             onChange={(e) => setEditFormData({ ...editFormData, password: e.target.value })}
//             InputProps={{
//               endAdornment: (
//                 <IconButton onClick={() => setShowEditPassword(!showEditPassword)} edge="end">
//                   {showEditPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
//                 </IconButton>
//               ),
//             }}
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseEditDialog}>Cancel</Button>
//           <Button onClick={handleEditSubmit} variant="contained" color="primary">Save Changes</Button>
//         </DialogActions>
//       </Dialog>

//       {/* Create User Modal */}
//       <CreateUserModal open={openCreateModal} onClose={() => setOpenCreateModal(false)} onCreateUser={handleCreateUser} />
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
  TextField,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import EditNoteIcon from '@mui/icons-material/EditNote';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import InfoIcon from '@mui/icons-material/Info';
import CreateUserModal from './CreateUserModal';
import userService, { User, ADMIN_USER } from './userService';
import { toast } from 'react-toastify';
import { PageTitle } from '../../../_metronic/layout/core';
import { getCurrentUser, isAdmin, setCurrentUser } from '../auth/session';
import client from '../service/network';

// ============================
// 🆕 Helpers for NEWS drafts
// ============================
const migrateNewsDrafts = (oldUsername: string, newUsername: string) => {
  const oldKey = `news_drafts_${oldUsername}`;
  const newKey = `news_drafts_${newUsername}`;
  const oldDrafts = localStorage.getItem(oldKey);
  if (oldDrafts) {
    localStorage.setItem(newKey, oldDrafts);
    localStorage.removeItem(oldKey);
    console.log(`News drafts migrated from ${oldKey} to ${newKey}`);
  }
};
const deleteNewsDrafts = (username: string) => {
  const key = `news_drafts_${username}`;
  if (localStorage.getItem(key)) {
    localStorage.removeItem(key);
    console.log(`News drafts deleted for user: ${username}`);
  }
};

// ============================
// 🆕 Helpers for QUIZ drafts
// ============================
const migrateQuizDrafts = (oldUsername: string, newUsername: string) => {
  const oldKey = `quiz_drafts_${oldUsername}`;
  const newKey = `quiz_drafts_${newUsername}`;
  const oldDrafts = localStorage.getItem(oldKey);
  if (oldDrafts) {
    localStorage.setItem(newKey, oldDrafts);
    localStorage.removeItem(oldKey);
    console.log(`Quiz drafts migrated from ${oldKey} to ${newKey}`);
  }
};
const deleteQuizDrafts = (username: string) => {
  const key = `quiz_drafts_${username}`;
  if (localStorage.getItem(key)) {
    localStorage.removeItem(key);
    console.log(`Quiz drafts deleted for user: ${username}`);
  }
};

// ============================
// 🆕 Helpers for POST drafts
// ============================
const migratePostDrafts = (oldUsername: string, newUsername: string) => {
  const oldKey = `post_drafts_${oldUsername}`;
  const newKey = `post_drafts_${newUsername}`;
  const oldDrafts = localStorage.getItem(oldKey);
  if (oldDrafts) {
    localStorage.setItem(newKey, oldDrafts);
    localStorage.removeItem(oldKey);
    console.log(`Post drafts migrated from ${oldKey} to ${newKey}`);
  }
};
const deletePostDrafts = (username: string) => {
  const key = `post_drafts_${username}`;
  if (localStorage.getItem(key)) {
    localStorage.removeItem(key);
    console.log(`Post drafts deleted for user: ${username}`);
  }
};

// ============================
// 🆕 Helpers for REEL drafts
// ============================
const migrateReelDrafts = (oldUsername: string, newUsername: string) => {
  const oldKey = `reel_drafts_${oldUsername}`;
  const newKey = `reel_drafts_${newUsername}`;
  const oldDrafts = localStorage.getItem(oldKey);
  if (oldDrafts) {
    localStorage.setItem(newKey, oldDrafts);
    localStorage.removeItem(oldKey);
    console.log(`Reel drafts migrated from ${oldKey} to ${newKey}`);
  }
};
const deleteReelDrafts = (username: string) => {
  const key = `reel_drafts_${username}`;
  if (localStorage.getItem(key)) {
    localStorage.removeItem(key);
    console.log(`Reel drafts deleted for user: ${username}`);
  }
};

// ============================
// 🆕 Helpers for POLL drafts
// ============================
const migratePollDrafts = (oldUsername: string, newUsername: string) => {
  const oldKey = `poll_drafts_${oldUsername}`;
  const newKey = `poll_drafts_${newUsername}`;
  const oldDrafts = localStorage.getItem(oldKey);
  if (oldDrafts) {
    localStorage.setItem(newKey, oldDrafts);
    localStorage.removeItem(oldKey);
    console.log(`Poll drafts migrated from ${oldKey} to ${newKey}`);
  }
};
const deletePollDrafts = (username: string) => {
  const key = `poll_drafts_${username}`;
  if (localStorage.getItem(key)) {
    localStorage.removeItem(key);
    console.log(`Poll drafts deleted for user: ${username}`);
  }
};

// ============================
// 🆕 Global style for 14px font
// ============================
const globalStyles = {
  fontSize: '14px',
  '& *': {
    fontSize: '14px',
  },
  '& .MuiTypography-root': {
    fontSize: '14px',
  },
  '& .MuiTableCell-root': {
    fontSize: '14px',
  },
  '& .MuiButton-root': {
    fontSize: '14px',
  },
  '& .MuiInputBase-root': {
    fontSize: '14px',
  },
  '& .MuiInputLabel-root': {
    fontSize: '14px',
  },
  '& .MuiSelect-root': {
    fontSize: '14px',
  },
  '& .MuiMenuItem-root': {
    fontSize: '14px',
  },
  '& .MuiChip-root': {
    fontSize: '14px',
  },
  '& .MuiDialogTitle-root': {
    fontSize: '14px',
  },
  '& .MuiDialogContentText-root': {
    fontSize: '14px',
  },
  '& .MuiFormLabel-root': {
    fontSize: '14px',
  },
  '& .MuiAvatar-root': {
    fontSize: '14px',
  },
};

// ============================
// Main Component
// ============================
const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedUserForMenu, setSelectedUserForMenu] = useState<User | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Edit user states
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editFormData, setEditFormData] = useState({ username: '', role: '', status: '', password: '' });
  const [showEditPassword, setShowEditPassword] = useState(false);

  // View user dialog
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [showViewPassword, setShowViewPassword] = useState(false);

  const currentUserIsAdmin = isAdmin();
  const currentUser = getCurrentUser();
  const currentUsername = currentUser?.username || '';

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  // ========== CREATE USER – Case‑insensitive duplicate check ==========
  const handleCreateUser = async (userData: any) => {
    try {
      // ✅ Check if username exists (case‑insensitive)
      const existingUser = users.find(
        (u) => u.username.toLowerCase() === userData.username.toLowerCase()
      );
      if (existingUser) {
        toast.error('Username already exists! Please choose a different username.');
        return;
      }

      await userService.createUser(userData);
      await fetchUsers();
      toast.success('User created successfully!');
    } catch (error: any) {
      console.error('Failed to create user:', error);
      if (error.message === 'Username already exists!') {
        toast.error('Username already exists! Please choose a different username.');
      } else {
        toast.error(error.message || 'Failed to create user');
      }
    }
  };

  // View user handler
  const handleOpenViewDialog = (user: User) => {
    setViewingUser(user);
    setShowViewPassword(false);
    setViewDialogOpen(true);
    setAnchorEl(null);
  };

  const handleCloseViewDialog = () => {
    setViewDialogOpen(false);
    setViewingUser(null);
    setShowViewPassword(false);
  };

  // Helper: update username in all creator mappings (news, quiz, post, poll, reel)
  const updateUsernameInAllMappings = (oldUsername: string, newUsername: string) => {
    const mappingKeys = [
      'news_creators', 'quiz_creators', 'post_creators', 'poll_creators', 'reel_creators'
    ];
    mappingKeys.forEach(key => {
      const raw = localStorage.getItem(key);
      if (raw) {
        const mapping = JSON.parse(raw);
        let changed = false;
        for (const [id, creator] of Object.entries(mapping)) {
          if (creator === oldUsername) {
            mapping[id] = newUsername;
            changed = true;
          }
        }
        if (changed) {
          localStorage.setItem(key, JSON.stringify(mapping));
        }
      }
    });
  };

  // Edit user handlers
  const handleOpenEditDialog = (user: User) => {
    setEditingUser(user);
    setEditFormData({
      username: user.username,
      role: user.role,
      status: user.status,
      password: '',
    });
    setShowEditPassword(false);
    setEditDialogOpen(true);
    setAnchorEl(null);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setEditingUser(null);
    setEditFormData({ username: '', role: '', status: '', password: '' });
    setShowEditPassword(false);
  };

  // ========== EDIT USER – Case‑insensitive duplicate check ==========
  const handleEditSubmit = async () => {
    if (!editingUser) return;
    try {
      const updates: Partial<User> = {};
      let usernameChanged = false;
      let newUsername = editingUser.username;

      // Check username change
      if (editFormData.username && editFormData.username !== editingUser.username) {
        // ✅ Case‑insensitive check for existing username (excluding current user)
        const existing = users.find(
          (u) =>
            u.username.toLowerCase() === editFormData.username.toLowerCase() &&
            u.id !== editingUser.id
        );
        if (existing) {
          toast.error('Username already exists! Choose another.');
          return;
        }
        newUsername = editFormData.username;
        usernameChanged = true;
        updates.username = newUsername;
      }

      if (editFormData.role && editFormData.role !== editingUser.role) {
        updates.role = editFormData.role as any;
      }
      if (editFormData.status && editFormData.status !== editingUser.status) {
        updates.status = editFormData.status as any;
      }
      if (editFormData.password && editFormData.password.trim() !== '') {
        updates.password = editFormData.password;
      }

      if (Object.keys(updates).length === 0 && !usernameChanged) {
        toast.info('No changes made');
        handleCloseEditDialog();
        return;
      }

      await userService.updateUser(editingUser.id, updates);

      // If username changed, update all creator mappings and migrate drafts
      if (usernameChanged) {
        // Migrate all types of drafts
        migrateNewsDrafts(editingUser.username, newUsername);
        migrateQuizDrafts(editingUser.username, newUsername);
        migratePostDrafts(editingUser.username, newUsername);
        migrateReelDrafts(editingUser.username, newUsername);
        migratePollDrafts(editingUser.username, newUsername);
        // Update all creator mappings
        updateUsernameInAllMappings(editingUser.username, newUsername);
        // If the edited user is the currently logged-in user, update currentUser in session
        if (currentUser && currentUser.username === editingUser.username) {
          const updatedCurrentUser = { ...currentUser, username: newUsername };
          setCurrentUser(updatedCurrentUser);
          localStorage.setItem('currentUser', JSON.stringify(updatedCurrentUser));
          toast.info('Your username has been updated. Please refresh the page for full effect.');
        }
      }

      toast.success(`User ${editingUser.username} updated successfully`);
      await fetchUsers();
      handleCloseEditDialog();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Failed to update user');
    }
  };

  // Content deletion functions (unchanged)
  const deleteAllNewsOfUser = async (username: string): Promise<void> => {
    console.log(`Deleting all news for user: ${username}`);
    const newsCreatorsRaw = localStorage.getItem('news_creators');
    if (!newsCreatorsRaw) return;
    const newsCreators: Record<string, string> = JSON.parse(newsCreatorsRaw);
    const newsIdsToDelete = Object.keys(newsCreators).filter(newsId => newsCreators[newsId] === username);
    if (newsIdsToDelete.length === 0) return;
    const deletedIdsRaw = localStorage.getItem('deleted_news_ids') || '[]';
    const deletedIds: string[] = JSON.parse(deletedIdsRaw);
    let deletedCount = 0;
    for (const newsId of newsIdsToDelete) {
      try {
        await client.delete(`news/${newsId}`);
        if (!deletedIds.includes(newsId)) deletedIds.push(newsId);
        delete newsCreators[newsId];
        deletedCount++;
      } catch (error) {
        if (!deletedIds.includes(newsId)) deletedIds.push(newsId);
        delete newsCreators[newsId];
        deletedCount++;
      }
    }
    localStorage.setItem('deleted_news_ids', JSON.stringify(deletedIds));
    localStorage.setItem('news_creators', JSON.stringify(newsCreators));
    if (deletedCount > 0) toast.success(`Deleted ${deletedCount} news item(s) from user ${username}`);
  };

  const deleteAllQuizzesOfUser = async (username: string): Promise<void> => {
    console.log(`Deleting all quizzes for user: ${username}`);
    const quizCreatorsRaw = localStorage.getItem('quiz_creators');
    if (!quizCreatorsRaw) return;
    const quizCreators: Record<string, string> = JSON.parse(quizCreatorsRaw);
    const quizIdsToDelete = Object.keys(quizCreators).filter(id => quizCreators[id] === username);
    if (quizIdsToDelete.length === 0) return;
    let deletedCount = 0;
    for (const quizId of quizIdsToDelete) {
      try {
        await client.delete(`/quiz/${quizId}`);
        delete quizCreators[quizId];
        deletedCount++;
      } catch (error) {
        delete quizCreators[quizId];
        deletedCount++;
      }
    }
    localStorage.setItem('quiz_creators', JSON.stringify(quizCreators));
    if (deletedCount > 0) toast.success(`Deleted ${deletedCount} quiz(zes) from user ${username}`);
  };

  const deleteAllReelsOfUser = async (username: string): Promise<void> => {
    console.log(`Deleting all reels for user: ${username}`);

    let allReelIds: string[] = [];

    // 1️⃣ Try mapping (fast path)
    const reelCreatorsRaw = localStorage.getItem('reel_creators');

    if (reelCreatorsRaw) {
      const reelCreators: Record<string, string> = JSON.parse(reelCreatorsRaw);
      const ids = Object.keys(reelCreators).filter(
        id => reelCreators[id] === username
      );
      if (ids.length > 0) {
        console.log(`Found ${ids.length} reels in mapping:`, ids);
        allReelIds.push(...ids);
      }
    }

    // 2️⃣ Fetch reels from API
    try {
      const statuses = ['REVIEW_COMPLETE', 'UNDER_REVIEW'];
      let page = 0;
      const pageSize = 50;
      let more = true;
      let reels: any[] = [];

      while (more) {
        for (const status of statuses) {
          const response = await client.get('/reels/dashboard/search', {
            params: {
              status,
              page,
              size: pageSize,
            },
          });

          const data = response.data || [];
          console.log(
            `Fetched ${data.length} reels for status ${status}, page ${page}`
          );

          if (data.length === 0) {
            more = false;
            break;
          }

          reels = reels.concat(data);
        }

        page++;

        if (reels.length < pageSize * statuses.length) {
          more = false;
        }
      }

      console.log('Total reels fetched from API:', reels.length);

      const matchingIds = reels
        .filter(
          (reel: any) =>
            reel.uploadedBy === username ||
            reel.username === username ||
            reel.userId === username
        )
        .map((reel: any) => reel.id);

      console.log(
        `Found ${matchingIds.length} reels via API for ${username}:`,
        matchingIds
      );

      allReelIds.push(...matchingIds);
    } catch (error) {
      console.error('Error fetching reels:', error);
    }

    // Remove duplicates
    allReelIds = [...new Set(allReelIds)];

    console.log('====================================');
    console.log(`Deleting reels for user: ${username}`);
    console.log(`Total reels found: ${allReelIds.length}`);
    console.log('All Reel IDs:', allReelIds);
    console.log('====================================');

    if (allReelIds.length === 0) {
      console.log(`No reels found for user: ${username}`);
      return;
    }

    let deletedIds: string[] = [];
    let failedIds: string[] = [];

    // 3️⃣ Batch delete
    try {
      console.log('========== BATCH DELETE START ==========');

      const deleteResponse = await client.delete('/reel/delete', {
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          reelIds: allReelIds,
        },
      });

      console.log('Batch delete response:', deleteResponse);
      console.log('Batch delete response data:', deleteResponse.data);

      if (deleteResponse.status === 200) {
        deletedIds = [...allReelIds];

        // Remove mapping
        const creators = JSON.parse(
          localStorage.getItem('reel_creators') || '{}'
        );

        allReelIds.forEach(id => delete creators[id]);

        localStorage.setItem(
          'reel_creators',
          JSON.stringify(creators)
        );

        console.log('====================================');
        console.log('✅ BATCH DELETE SUCCESS');
        console.log('Deleted IDs:', deletedIds);
        console.log('Deleted Count:', deletedIds.length);
        console.log('Failed IDs:', failedIds);
        console.log('Failed Count:', failedIds.length);
        console.log('====================================');

        toast.success(
          `Deleted ${deletedIds.length} reel(s) from user ${username}`
        );
      } else {
        throw new Error(
          `Batch delete failed with status ${deleteResponse.status}`
        );
      }
    } catch (error) {
      console.error('========== BATCH DELETE FAILED ==========');
      console.error(error);

      deletedIds = [];
      failedIds = [];

      console.log('Trying individual deletion...');

      for (const reelId of allReelIds) {
        try {
          console.log(`Deleting reel using /reel/${reelId}`);

          await client.delete(`/reel/${reelId}`);

          deletedIds.push(reelId);

          console.log(`✅ Deleted reel ${reelId}`);
        } catch (e1) {
          console.error(`Failed /reel/${reelId}`, e1);

          try {
            console.log(`Trying /reels/${reelId}`);

            await client.delete(`/reels/${reelId}`);

            deletedIds.push(reelId);

            console.log(`✅ Deleted reel ${reelId}`);
          } catch (e2) {
            failedIds.push(reelId);

            console.error(`❌ Failed to delete reel ${reelId}`);
            console.error(e2);
          }
        }
      }

      console.log('====================================');
      console.log('TOTAL IDS:', allReelIds);
      console.log('SUCCESS IDS:', deletedIds);
      console.log('FAILED IDS:', failedIds);
      console.log('SUCCESS COUNT:', deletedIds.length);
      console.log('FAILED COUNT:', failedIds.length);
      console.log('====================================');

      if (deletedIds.length > 0) {
        toast.success(
          `${deletedIds.length} reel(s) deleted individually`
        );
      }

      if (failedIds.length > 0) {
        toast.error(
          `${failedIds.length} reel(s) failed to delete`
        );
      }
    }
  };

  const deleteAllPostsOfUser = async (username: string): Promise<void> => {
    console.log(`Deleting all posts for user: ${username}`);
    const postCreatorsRaw = localStorage.getItem('post_creators');
    if (!postCreatorsRaw) return;
    const postCreators: Record<string, string> = JSON.parse(postCreatorsRaw);
    const postIdsToDelete = Object.keys(postCreators).filter(id => postCreators[id] === username);
    if (postIdsToDelete.length === 0) return;
    let deletedCount = 0;
    for (const postId of postIdsToDelete) {
      try {
        await client.delete(`/post/${postId}`);
        delete postCreators[postId];
        deletedCount++;
      } catch (error) {
        delete postCreators[postId];
        deletedCount++;
      }
    }
    localStorage.setItem('post_creators', JSON.stringify(postCreators));
    if (deletedCount > 0) toast.success(`Deleted ${deletedCount} post(s) from user ${username}`);
  };

  const deleteAllPollsOfUser = async (username: string): Promise<void> => {
    console.log(`Deleting all polls for user: ${username}`);
    const pollCreatorsRaw = localStorage.getItem('poll_creators');
    if (!pollCreatorsRaw) return;
    const pollCreators: Record<string, string> = JSON.parse(pollCreatorsRaw);
    const pollIdsToDelete = Object.keys(pollCreators).filter(id => pollCreators[id] === username);
    if (pollIdsToDelete.length === 0) return;
    let deletedCount = 0;
    for (const pollId of pollIdsToDelete) {
      try {
        await client.delete(`poll/${pollId}`);
        delete pollCreators[pollId];
        deletedCount++;
      } catch (error) {
        delete pollCreators[pollId];
        deletedCount++;
      }
    }
    localStorage.setItem('poll_creators', JSON.stringify(pollCreators));
    if (deletedCount > 0) toast.success(`Deleted ${deletedCount} poll(s) from user ${username}`);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedUserForMenu(null);
  };

  const handleConfirmDelete = async () => {
    if (!selectedUserForMenu) return;
    if (selectedUserForMenu.username === ADMIN_USER.username) {
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
      await deleteAllNewsOfUser(selectedUserForMenu.username);
      await deleteAllQuizzesOfUser(selectedUserForMenu.username);
      await deleteAllPostsOfUser(selectedUserForMenu.username);
      await deleteAllPollsOfUser(selectedUserForMenu.username);
      await deleteAllReelsOfUser(selectedUserForMenu.username);
      // Delete all types of drafts
      deleteNewsDrafts(selectedUserForMenu.username);
      deleteQuizDrafts(selectedUserForMenu.username);
      deletePostDrafts(selectedUserForMenu.username);
      deleteReelDrafts(selectedUserForMenu.username);
      deletePollDrafts(selectedUserForMenu.username);
      await userService.deleteUser(selectedUserForMenu.username);
      toast.success(`User "${selectedUserForMenu.username}" and their content (including drafts) deleted successfully!`);
      await fetchUsers();
    } catch (error: any) {
      console.error('Failed to delete user or content:', error);
      toast.error(error.message || 'Failed to delete user');
    } finally {
      setDeleting(false);
      handleCloseDeleteDialog();
    }
  };

  const handleToggleStatus = async (user: User) => {
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
    setUsers(prevUsers =>
      prevUsers.map(u => (u.id === user.id ? { ...u, status: newStatus } : u))
    );
    try {
      await userService.updateUser(user.id, { status: newStatus });
      toast.success(`User ${newStatus === 'ACTIVE' ? 'activated' : 'deactivated'} successfully!`);
      await fetchUsers();
    } catch (error: any) {
      console.error('Failed to update user status:', error);
      toast.error(error.message || 'Failed to update user status');
      setUsers(prevUsers =>
        prevUsers.map(u => (u.id === user.id ? { ...u, status: oldStatus } : u))
      );
    }
    setAnchorEl(null);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, user: User) => {
    event.stopPropagation();
    if (!currentUserIsAdmin) return;
    setAnchorEl(event.currentTarget);
    setSelectedUserForMenu(user);
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
    // ✅ Main container with 14px font size applied globally
    <Box sx={globalStyles}>
      <PageTitle description="" breadcrumbs={[]}>
        User Management
      </PageTitle>

      <Box sx={{ p: 3 }}>
        <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e0e7ff', bgcolor: '#f8fafc' }}>
            <Typography variant="h5" fontWeight="600">User Management</Typography>
            {currentUserIsAdmin && (
              <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenCreateModal(true)} sx={{ bgcolor: '#1b84ff', '&:hover': { bgcolor: '#1674e0' }, textTransform: 'none', borderRadius: 2, px: 3 }}>
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
                  {currentUserIsAdmin && <TableCell sx={{ fontWeight: 600, width: 80 }}>Actions</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ bgcolor: user.username === ADMIN_USER.username ? '#d32f2f' : '#1b84ff', width: 32, height: 32 }}>
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
                      <Chip icon={getRoleIcon(user.role)} label={user.role} color={getRoleColor(user.role) as any} size="small" sx={{ fontWeight: 500 }} />
                    </TableCell>
                    <TableCell>{formatDate(user.createdAt)}</TableCell>
                    <TableCell>
                      <Chip label={user.status} color={user.status === 'ACTIVE' ? 'success' : 'default'} size="small" sx={{ fontWeight: 500 }} />
                    </TableCell>
                    <TableCell>{formatDate(user.lastLogin)}</TableCell>
                    {currentUserIsAdmin && (
                      <TableCell>
                        {user.username !== ADMIN_USER.username && user.username !== currentUsername ? (
                          <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleMenuOpen(e, user); }}>
                            <MoreVertIcon fontSize="small" />
                          </IconButton>
                        ) : (
                          <Typography variant="caption" color="textSecondary">
                            {user.username === currentUsername ? 'Current User' : 'Protected'}
                          </Typography>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>

      {/* Three-dots menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={() => { if (selectedUserForMenu) handleOpenViewDialog(selectedUserForMenu); }}>
          <ListItemIcon><InfoIcon fontSize="small" /></ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { if (selectedUserForMenu) handleOpenEditDialog(selectedUserForMenu); }}>
          <ListItemIcon><EditNoteIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { if (selectedUserForMenu) handleToggleStatus(selectedUserForMenu); handleMenuClose(); }}>
          <ListItemIcon>
            {selectedUserForMenu?.status === 'ACTIVE' ? <BlockIcon color="error" /> : <CheckCircleIcon color="success" />}
          </ListItemIcon>
          <ListItemText>{selectedUserForMenu?.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { handleMenuClose(); setOpenDeleteDialog(true); }}>
          <ListItemIcon><DeleteIcon color="error" /></ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

      {/* View Details Dialog */}
      <Dialog open={viewDialogOpen} onClose={handleCloseViewDialog} maxWidth="sm" fullWidth>
        <DialogTitle>User Details</DialogTitle>
        <DialogContent>
          {viewingUser && (
            <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography><strong>Username:</strong> {viewingUser.username}</Typography>
              <Typography><strong>Role:</strong> {viewingUser.role}</Typography>
              <Typography><strong>Status:</strong> {viewingUser.status}</Typography>
              <Typography><strong>Created:</strong> {formatDate(viewingUser.createdAt)}</Typography>
              <Typography><strong>Last Login:</strong> {formatDate(viewingUser.lastLogin)}</Typography>
              {currentUserIsAdmin && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography><strong>Password:</strong> {showViewPassword ? (viewingUser.password || 'N/A') : '••••••'}</Typography>
                  <IconButton size="small" onClick={() => setShowViewPassword(!showViewPassword)}>
                    {showViewPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseViewDialog}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Delete User?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete user <strong>{selectedUserForMenu?.username}</strong>? This action cannot be undone, and <strong>all content (news, quizzes, posts, polls, reels) uploaded by this user will also be deleted</strong>.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} disabled={deleting}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained" disabled={deleting}>
            {deleting ? <CircularProgress size={24} /> : 'Delete User & Content'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onClose={handleCloseEditDialog} maxWidth="xs" fullWidth>
        <DialogTitle>Edit User: {editingUser?.username}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            label="Username"
            value={editFormData.username}
            onChange={(e) => setEditFormData({ ...editFormData, username: e.target.value })}
            helperText="Changing username will affect all content created by this user"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Role</InputLabel>
            <Select value={editFormData.role} onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })} label="Role">
              <MenuItem value="ADMIN">Admin</MenuItem>
              <MenuItem value="EDITOR">Editor</MenuItem>
              <MenuItem value="USER">User</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select value={editFormData.status} onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })} label="Status">
              <MenuItem value="ACTIVE">Active</MenuItem>
              <MenuItem value="INACTIVE">Inactive</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth margin="normal"
            label="New Password (leave blank to keep unchanged)"
            type={showEditPassword ? 'text' : 'password'}
            value={editFormData.password}
            onChange={(e) => setEditFormData({ ...editFormData, password: e.target.value })}
            InputProps={{
              endAdornment: (
                <IconButton onClick={() => setShowEditPassword(!showEditPassword)} edge="end">
                  {showEditPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              ),
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Cancel</Button>
          <Button onClick={handleEditSubmit} variant="contained" color="primary">Save Changes</Button>
        </DialogActions>
      </Dialog>

      {/* Create User Modal */}
      <CreateUserModal open={openCreateModal} onClose={() => setOpenCreateModal(false)} onCreateUser={handleCreateUser} />
    </Box>
  );
};

export default UserManagementPage;
