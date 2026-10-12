// src/app/modules/news/AllAdds.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import client from '../../../modules/service/network';
import { PageTitle } from '../../../../_metronic/layout/core';
import { KTIcon } from '../../../../_metronic/helpers';
import { Box, Paper, Typography, Button, CircularProgress } from '@mui/material';

interface AddItem {
    id: string;
    bannerImages: string[];
    link: string;
    expiryDate: string | null;
    slotFrequency: string | null;
    viewFrequency: string | null;
    createdAt: string;
    updatedAt: string;
}

const AllAdds: React.FC = () => {
    const [adds, setAdds] = useState<AddItem[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchAdds = async () => {
        setLoading(true);
        try {
            const response = await client.get('/ads');
            setAdds(response.data || []);
        } catch (error) {
            console.error('Error fetching adds:', error);
            toast.error('Failed to load adds');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdds();
    }, []);

    const handleDelete = async (id: string) => {
        if (window.confirm('Delete this add?')) {
            try {
                await client.delete(`/ads/${id}`);
                toast.success('Add deleted');
                fetchAdds();
            } catch (error) {
                toast.error('Failed to delete add');
            }
        }
    };

    if (loading) {
        return <div className="d-flex justify-content-center p-5"><CircularProgress /></div>;
    }

    return (
        <>
            <PageTitle description="" breadcrumbs={[]}>Adds</PageTitle>
            <Box sx={{ p: 3 }}>
                <Paper elevation={2} sx={{ borderRadius: 2, p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h5" fontWeight="600">All Adds</Typography>
                        <Button variant="contained" onClick={() => navigate('/ads/create', { state: { isAdd: true } })}>
                            Create New Add
                        </Button>
                    </Box>
                    {adds.length === 0 ? (
                        <Typography>No adds found. Create your first add!</Typography>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-row-bordered">
                                <thead>
                                    <tr>
                                        <th>Images</th>
                                        <th>Link / Description</th>
                                        <th>Created</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {adds.map((add) => (
                                        <tr key={add.id}>
                                            <td>
                                                {add.bannerImages && add.bannerImages.length > 0 ? (
                                                    <img src={add.bannerImages[0]} alt="Add" width="60" height="60" style={{ objectFit: 'cover', borderRadius: '4px' }} />
                                                ) : 'No image'}
                                            </td>
                                            <td>{add.link || 'No link'}</td>
                                            <td>{new Date(add.createdAt).toLocaleString()}</td>
                                            <td>
                                                <button className="btn btn-sm btn-icon btn-light me-2" onClick={() => navigate(`/ads/create/${add.id}`, { state: { isAdd: true } })}>
                                                    <KTIcon iconName="pencil" className="fs-3 text-primary" />
                                                </button>
                                                <button className="btn btn-sm btn-icon btn-light" onClick={() => handleDelete(add.id)}>
                                                    <KTIcon iconName="trash" className="fs-3 text-danger" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Paper>
            </Box>
        </>
    );
};

export default AllAdds;
