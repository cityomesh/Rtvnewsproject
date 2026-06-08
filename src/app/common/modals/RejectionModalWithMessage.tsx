import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
} from "@mui/material";

interface RejectionModalProps {
  open: boolean;
  onClose: () => void;
  onReject: () => void;
  rejectionReason: string;
  setRejectionReason: (value: string) => void;
}

const MAX_LENGTH = 200;

const RejectionModal: React.FC<RejectionModalProps> = ({
  open,
  onClose,
  onReject,
  rejectionReason,
  setRejectionReason,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= MAX_LENGTH) {
      setRejectionReason(e.target.value);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Reject Reel</DialogTitle>
      <DialogContent>
        <Typography variant="subtitle1" gutterBottom>
          Reason for rejection:
        </Typography>
        <TextField
          multiline
          rows={4}
          fullWidth
          variant="outlined"
          value={rejectionReason}
          onChange={handleChange}
          placeholder="Enter rejection reason..."
          autoFocus
        />
        <Typography
          variant="caption"
          color={rejectionReason.length === MAX_LENGTH ? "error" : "textSecondary"}
          sx={{ mt: 0.5, display: "block", textAlign: "right" }}
        >
          {rejectionReason.length} / {MAX_LENGTH}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button
          onClick={onReject}
          color="error"
          variant="contained"
          disabled={!rejectionReason.trim()}
        >
          Reject
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RejectionModal;
