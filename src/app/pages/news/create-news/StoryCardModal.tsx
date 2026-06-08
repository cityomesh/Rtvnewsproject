import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import fileService from "../../../modules/service/fileservice.tsx";
import { v4 as uuidv4 } from 'uuid';
import { Modal as MuiModal, Box, TextField, Button, Typography } from "@mui/material";

export interface ISimpleStoryCard {
  id: string;
  description: string | null;
  bannerImage: string;
}

const modalStyle = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '90vw', sm: 400, md: 500 },
    maxWidth: '95vw',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: { xs: 2, sm: 3, md: 4 },
    maxHeight: '90vh',
    overflowY: 'auto',
};

interface SimpleStoryCardModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (card: ISimpleStoryCard) => void;
    cardToEdit: ISimpleStoryCard | null;
}

export const SimpleStoryCardModal: React.FC<SimpleStoryCardModalProps> = ({ open, onClose, onSave, cardToEdit }) => {
    const [cardData, setCardData] = useState<ISimpleStoryCard>({ id: '', description: '', bannerImage: '' });
    const [isUploading, setIsUploading] = useState(false);
    const [descriptionError, setDescriptionError] = useState('');

    useEffect(() => {
        if (open) {
            if (cardToEdit) {
                setCardData(cardToEdit);
            } else {
                setCardData({ id: uuidv4(), description: '', bannerImage: '' });
            }
            setDescriptionError('');
        }
    }, [cardToEdit, open]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const file = e.target.files[0];
        setIsUploading(true);
        try {
            const url = await fileService(file, "MEDIA_IMAGES");
            setCardData(prev => ({ ...prev, bannerImage: url }));
            toast.success("Image uploaded!");
        } catch {
            toast.error("Image upload failed.");
        } finally {
            setIsUploading(false);
        }
    };
    
    const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDescription = e.target.value;
        if (newDescription.length > 400) {
            setDescriptionError("Description cannot exceed 400 characters.");
        } else {
            setDescriptionError("");
        }
        setCardData(prev => ({ ...prev, description: newDescription }));
    }

    const handleSave = () => {
        if (!cardData.bannerImage) {
            toast.error("Please provide a image.");
            return;
        }
        onSave(cardData);
        onClose();
    };
    
    const isSaveDisabled = !cardData.bannerImage || isUploading;

    return (
        <MuiModal open={open} onClose={onClose}>
            <Box sx={modalStyle}>
                <Typography variant="h6" component="h2">{cardToEdit ? 'Edit' : 'Add'} Story Card</Typography>
                
                <div style={{ marginTop: 16, marginBottom: 16 }}>
                    <TextField
                        fullWidth
                        multiline
                        rows={6}
                        label="Description"
                        value={cardData.description}
                        onChange={handleDescriptionChange}
                        error={!!descriptionError}
                        helperText={descriptionError || `${cardData.description?.length}/400`}
                        variant="outlined"
                    />
                </div>

                <Button variant="contained" component="label" disabled={isUploading} fullWidth>
                    {isUploading ? 'Uploading...' : cardData.bannerImage ? 'Change Image' : 'Upload Image'}
                    <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
                </Button>
                
                {cardData.bannerImage && (
                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                        <img src={cardData.bannerImage} alt="Preview" style={{ maxWidth: '100%', maxHeight: 150, marginTop: 10 }} />
                    </Box>
                )}
                
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSave} variant="contained" disabled={isSaveDisabled}>
                        Save Card
                    </Button>
                </Box>
            </Box>
        </MuiModal>
    );
};