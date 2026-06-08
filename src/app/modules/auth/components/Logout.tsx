import {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
// import Button from "react-bootstrap/Button";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import { useLocation } from 'react-router-dom';


export function Logout() {
  const myStyles = {
    fontSize: '11px',

};

// const modal =  {
//   position: 'absolute',
//   bottom: '0',
//   left: '50%',
//   transform: 'translateX(-50%)',
//   margin: 0,
// }


    const navigate = useNavigate();
    const [show, setShow] = useState(false);
    const location = useLocation();

    const handleLogout = async () => {
        try {
        // Call your logout API
        const response = await fetch('/logout')
        if (response.ok) {
            // Redirect to login page
            localStorage.removeItem("token")
            navigate('/login')
            // window.location.reload();
        } else {
            console.error('Logout failed: ', response.statusText);
        }
        } catch (error) {
        console.error('Error logging out:', error);
        }
    };

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

  useEffect(() => {
    
  }, )

  return (
<>

<Dialog open={show} onClose={handleClose} aria-labelledby="dialog-title">
      <DialogTitle id="dialog-title">Log Out</DialogTitle>
      <DialogContent>
        <p>Are you sure you want to Log Out?</p>
      </DialogContent>
      <DialogActions>
          <Button variant="outlined" onClick={handleClose}>
            No
          </Button>
          <Button variant="contained" onClick={() => handleLogout()}>
            Yes
          </Button>
        
      </DialogActions>
    </Dialog>
    
    {location.pathname === '/dashboard' && <button className='btn btn-primary btn-md mr-16' style={myStyles} onClick={handleShow}>Logout</button>}
    </>
  )

}
