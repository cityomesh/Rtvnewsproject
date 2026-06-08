

import { FC } from 'react'
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material'

type Action = {
  label: string
  event: () => void
}

interface ModalProps {
  header: string
  isOpen: boolean
  title: string
  toggleDialog: () => void
  action1?: Action
  action2?: Action
}

const MultipleDeleteModal: FC<ModalProps> = ({ 
  header, 
  isOpen, 
  title,
  toggleDialog, 
  action1 = null, 
  action2 = null 
}) => {
  return (
    <Dialog open={isOpen} onClose={toggleDialog} aria-labelledby="dialog-title">
      <DialogTitle id="dialog-title">{header}</DialogTitle>
      <DialogContent>
        <p>Are you sure you want to delete this {title}?</p>
      </DialogContent>
      <DialogActions>
        {action1 && (
          <Button onClick={action1.event} color="error" variant="contained">
            {action1.label}
          </Button>
        )}
        {action2 && (
          <Button onClick={action2.event} color="primary" variant="outlined">
            {action2.label}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}

export  {MultipleDeleteModal}
