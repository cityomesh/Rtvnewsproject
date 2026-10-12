// // components/IdleTimeoutModal.tsx

// import React, { useState, useEffect } from 'react';

// interface IdleTimeoutModalProps {
//   open: boolean;
//   onStay: () => void;
//   autoHideSeconds?: number; // seconds before auto-close
// }

// const IdleTimeoutModal: React.FC<IdleTimeoutModalProps> = ({ open, onStay, autoHideSeconds = 3 }) => {
//   const [countdown, setCountdown] = useState(autoHideSeconds);

//   useEffect(() => {
//     if (!open) {
//       setCountdown(autoHideSeconds);
//       return;
//     }

//     const interval = setInterval(() => {
//       setCountdown(prev => {
//         if (prev <= 1) {
//           clearInterval(interval);
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [open, autoHideSeconds]);

//   if (!open) return null;

//   return (
//     <div style={styles.overlay}>
//       <div style={styles.modal}>
//         <h3 style={styles.title}>Session Expiring Soon</h3>
//         <p style={styles.message}>
//           You have been inactive. Auto‑logout in <strong>{countdown}</strong> second{countdown !== 1 ? 's' : ''}.
//         </p>
//         <div style={styles.buttons}>
//           <button style={styles.stayButton} onClick={onStay}>
//             Stay Logged In
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const styles: { [key: string]: React.CSSProperties } = {
//   overlay: {
//     position: 'fixed',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     zIndex: 9999,
//   },
//   modal: {
//     backgroundColor: '#fff',
//     borderRadius: '8px',
//     padding: '24px',
//     minWidth: '300px',
//     maxWidth: '400px',
//     boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
//     textAlign: 'center',
//   },
//   title: {
//     margin: '0 0 12px 0',
//     fontSize: '1.5rem',
//   },
//   message: {
//     margin: '0 0 24px 0',
//     fontSize: '1rem',
//     color: '#555',
//   },
//   stayButton: {
//     padding: '8px 16px',
//     backgroundColor: '#007bff',
//     color: '#fff',
//     border: 'none',
//     borderRadius: '4px',
//     cursor: 'pointer',
//     fontSize: '1rem',
//   },
// };

// export default IdleTimeoutModal;



// components/IdleTimeoutModal.tsx

import React, { useState, useEffect } from 'react';

interface IdleTimeoutModalProps {
  open: boolean;
  onStay: () => void;
  autoHideSeconds?: number;
}

const IdleTimeoutModal: React.FC<IdleTimeoutModalProps> = ({ open, onStay, autoHideSeconds = 10 }) => {
  const [countdown, setCountdown] = useState(autoHideSeconds);

  useEffect(() => {
    if (!open) {
      setCountdown(autoHideSeconds);
      return;
    }

    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [open, autoHideSeconds]);

  if (!open) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3 style={styles.title}>Session Expiring Soon</h3>
        <p style={styles.message}>
          You have been inactive for 10 minutes. Auto‑logout in <strong>{countdown}</strong> second{countdown !== 1 ? 's' : ''}.
        </p>
        <div style={styles.buttons}>
          <button style={styles.stayButton} onClick={onStay}>
            Stay Logged In
          </button>
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '24px',
    minWidth: '300px',
    maxWidth: '400px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    textAlign: 'center',
  },
  title: {
    margin: '0 0 12px 0',
    fontSize: '1.5rem',
  },
  message: {
    margin: '0 0 24px 0',
    fontSize: '1rem',
    color: '#555',
  },
  stayButton: {
    padding: '8px 16px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
};

export default IdleTimeoutModal;
