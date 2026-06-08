import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Paper, Typography, Box, IconButton, FormControlLabel, Checkbox } from '@mui/material';
import { SimpleStoryCardModal } from './StoryCardModal';
import { IStoryCard, IStoryPayload, storyInitialValues, storySchema } from './CreateNewsFormDetails.ts';
import { KTIcon } from '../../../../_metronic/helpers';
import client from '../../../modules/service/network.ts';

const StoryCardsForm: React.FC = () => {
    const { id } = useParams(); // Get the ID from the URL
    const navigate = useNavigate();
    
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [cardToEdit, setCardToEdit] = useState<IStoryCard | null>(null);
    const [sendNotification, setSendNotification] = useState(false);
    
    const [initData, setInitData] = useState<IStoryPayload>(storyInitialValues);

    useEffect(() => {
        if (id) {
            setLoading(true);
            client.get(`/news/${id}`)
                .then((response) => {
                    const data = response.data;
                    // Ensure storyCards is always an array
                    setInitData({ 
                        storyCards: Array.isArray(data.storyCards) ? data.storyCards : [] 
                    });
                })
                .catch((error) => {
                    console.error("Error fetching story details:", error);
                    toast.error("Failed to fetch story details.");
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setInitData(storyInitialValues);
        }
    }, [id]);

    const formik = useFormik<IStoryPayload>({
        initialValues: initData,
        validationSchema: storySchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            setLoading(true);
            try {
                const notifyParam = sendNotification ? 'notify=true' : 'notify=false';
                
                const payload = {
                    ...values,
                    storyCards: Array.isArray(values.storyCards) ? values.storyCards : [],
                    title: null,
                    description: null,
                    bannerImage: null,
                    video: null,
                };

                const response = id
                    ? await client.put(`/news/${id}?${notifyParam}`, payload)
                    : await client.post(`/news?${notifyParam}`, payload);

                if (response.status >= 200 && response.status < 300) {
                    toast.success(`Story ${id ? 'updated' : 'created'} successfully!`);
                    navigate("/news");
                } else {
                    toast.error(`Operation failed!`);
                }
            } catch (error) {
                console.error("Error saving story:", error);
                toast.error("An error occurred while saving the story.");
            } finally {
                setLoading(false);
            }
        },
    });

    const handleOpenModal = () => {
        setCardToEdit(null);
        setIsModalOpen(true);
    };
    
    const handleEditCard = (card: IStoryCard) => {
        setCardToEdit(card);
        setIsModalOpen(true);
    };

    const handleDeleteCard = (cardId: string) => {
        const currentCards = Array.isArray(formik.values.storyCards) ? formik.values.storyCards : [];
        const updatedCards = currentCards.filter(c => c.id !== cardId);
        formik.setFieldValue('storyCards', updatedCards);
        // Manually trigger validation after deletion
        formik.setFieldTouched('storyCards', true);
        formik.validateField('storyCards');
    };

    const handleSaveCard = (card: IStoryCard) => {
        if (card.description === '') {
            card.description = null;
        }
        const currentCards = Array.isArray(formik.values.storyCards) ? formik.values.storyCards : [];
        const existingIndex = currentCards.findIndex(c => c.id === card.id);
        
        let updatedCards: IStoryCard[];
        if (existingIndex > -1) {
            updatedCards = [...currentCards];
            updatedCards[existingIndex] = card;
        } else {
            updatedCards = [...currentCards, card];
        }
        
        formik.setFieldValue('storyCards', updatedCards);
        formik.setFieldTouched('storyCards', true);
        setTimeout(() => {
            formik.validateField('storyCards');
        }, 0);
    };

    const storyCards = Array.isArray(formik.values.storyCards) ? formik.values.storyCards : [];

    return (
        <div className="card mb-5 mb-xl-10">
            <div className="card-header border-0">
                <h3 className="fw-bolder m-0 my-5">{id ? 'Edit Story' : 'Create Story'}</h3>
            </div>
            <form onSubmit={formik.handleSubmit} noValidate className="form">
                <div className="card-body border-top p-9">
                    <Button variant="contained" onClick={handleOpenModal}>
                        Add Story Card
                    </Button>

                    {formik.touched.storyCards && formik.errors.storyCards && (
                        <div className="fv-help-block text-danger mt-2">
                            {formik.errors.storyCards as string}
                        </div>
                    )}

                    <div className="mt-4">
                        {storyCards.map(card => (
                            <Paper key={card.id} elevation={3} sx={{ p: 2, mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                                <img
                                    src={card.bannerImage}
                                    alt="Story card"
                                    style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: '4px' }}
                                />
                                <Typography sx={{ flexGrow: 1, wordBreak: 'break-word' }}>
                                    {card.description}
                                </Typography>
                                <Box>
                                    <IconButton onClick={() => handleEditCard(card)}>
                                        <KTIcon iconName='pencil' className='fs-3' />
                                    </IconButton>
                                    <IconButton onClick={() => handleDeleteCard(card.id)}>
                                        <KTIcon iconName='trash' className='fs-3 text-danger' />
                                    </IconButton>
                                </Box>
                            </Paper>
                        ))}
                    </div>

                    {/* --- Send Notification Checkbox using Material-UI --- */}
                    <div className="mt-6 mb-6">
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={sendNotification}
                                    onChange={(e) => setSendNotification(e.target.checked)}
                                    name="sendNotification"
                                    color="primary"
                                    sx={{
                                        '& .MuiSvgIcon-root': {
                                            fontSize: '1.2rem',
                                        },
                                    }}
                                />
                            }
                            label={
                                <Typography variant="body1" sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
                                    Send Notification
                                </Typography>
                            }
                            sx={{ mb: 1 }}
                        />
                        <Typography variant="caption" color="text.secondary" display="block" sx={{ ml: 0 }}>
                            Check this to send push notifications to users when the story is {id ? "updated" : "published"}.
                        </Typography>
                    </div>
                </div>
                <div
          className="card-footer d-flex justify-content-end py-6 px-9"
          style={{
            position: "sticky",
            bottom: 0,
            color: "white",
            background: "white",
            zIndex: 100,
          }}
        >
          <button
            className="btn me-4"
            disabled={loading}
            onClick={() => navigate("/dashboard")} 
          >
            {"Cancel"}
            {loading && (
              <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
            )}
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || !formik.isValid}
          >
            {!loading ? "Save" : "Please wait..."}
            {loading && (
              <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
            )}
          </button>
        </div>
            </form>

            <SimpleStoryCardModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveCard}
                cardToEdit={cardToEdit}
            />
        </div>
    );
};

export default StoryCardsForm;