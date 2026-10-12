// import { useEffect, useRef } from 'react';

// const useIdleTimeout = (timeoutMinutes: number = 10) => {
//   const timerRef = useRef<NodeJS.Timeout | null>(null);

//   const logout = () => {
//     console.log("Auto-logout triggered");
    
//     const authKeys = [
//       'authToken',
//       'accessToken',
//       'token',
//       'user',
//       'refreshToken',
//       'kt_auth',
//       'auth',
//     ];
    
//     authKeys.forEach(key => {
//       localStorage.removeItem(key);
//       sessionStorage.removeItem(key);
//     });
    
//     window.location.href = '/login';
//   };

//   const resetTimer = () => {
//     if (timerRef.current) clearTimeout(timerRef.current);
//     timerRef.current = setTimeout(logout, timeoutMinutes * 60 * 1000);
//   };

//   useEffect(() => {
//     const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
//     resetTimer();

//     events.forEach(event => window.addEventListener(event, resetTimer));

//     return () => {
//       if (timerRef.current) clearTimeout(timerRef.current);
//       events.forEach(event => window.removeEventListener(event, resetTimer));
//     };
//   }, []);

//   return null;
// };

// export default useIdleTimeout;





// hooks/useIdleTimeout.ts  five seconds

// import { useEffect, useRef, useState } from 'react';

// interface IdleTimeoutOptions {
//   timeoutSeconds: number;
//   onLogout: () => void;
//   autoHideSeconds?: number; // how long the popup stays visible (default 3)
// }

// const useIdleTimeout = ({ timeoutSeconds, onLogout, autoHideSeconds = 3 }: IdleTimeoutOptions) => {
//   const [showModal, setShowModal] = useState(false);
//   const timerRef = useRef<NodeJS.Timeout | null>(null);
//   const hideModalTimerRef = useRef<NodeJS.Timeout | null>(null);
//   const logoutTimerRef = useRef<NodeJS.Timeout | null>(null);

//   const resetTimer = () => {
//     // Clear all timers
//     if (timerRef.current) clearTimeout(timerRef.current);
//     if (hideModalTimerRef.current) clearTimeout(hideModalTimerRef.current);
//     if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
//     setShowModal(false);

//     // Start main idle timer
//     timerRef.current = setTimeout(() => {
//       setShowModal(true); // show popup

//       // Auto-hide popup after autoHideSeconds
//       hideModalTimerRef.current = setTimeout(() => {
//         setShowModal(false);
//         // After popup auto-closes, trigger logout
//         logoutTimerRef.current = setTimeout(() => {
//           onLogout();
//         }, 100); // small delay to ensure modal is closed
//       }, autoHideSeconds * 1000);
//     }, timeoutSeconds * 1000);
//   };

//   const stayLoggedIn = () => {
//     // Cancel auto-hide and logout timers
//     if (hideModalTimerRef.current) clearTimeout(hideModalTimerRef.current);
//     if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
//     setShowModal(false);
//     resetTimer(); // restart idle timer
//   };

//   useEffect(() => {
//     const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
//     resetTimer();

//     events.forEach(event => window.addEventListener(event, resetTimer));

//     return () => {
//       if (timerRef.current) clearTimeout(timerRef.current);
//       if (hideModalTimerRef.current) clearTimeout(hideModalTimerRef.current);
//       if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
//       events.forEach(event => window.removeEventListener(event, resetTimer));
//     };
//   }, []);

//   return { showModal, stayLoggedIn };
// };

// export default useIdleTimeout;





// hooks/useIdleTimeout.ts

import { useEffect, useRef, useState } from 'react';

interface IdleTimeoutOptions {
  timeoutSeconds: number;      // 600 = 10 నిమిషాలు
  onLogout: () => void;
  autoHideSeconds?: number;    // పాపప్ ఎన్ని సెకన్లు కనిపిస్తుంది
}

const useIdleTimeout = ({ timeoutSeconds, onLogout, autoHideSeconds = 10 }: IdleTimeoutOptions) => {
  const [showModal, setShowModal] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const hideModalTimerRef = useRef<NodeJS.Timeout | null>(null);
  const logoutTimerRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (hideModalTimerRef.current) clearTimeout(hideModalTimerRef.current);
    if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
    setShowModal(false);

    timerRef.current = setTimeout(() => {
      setShowModal(true);

      hideModalTimerRef.current = setTimeout(() => {
        setShowModal(false);
        logoutTimerRef.current = setTimeout(() => {
          onLogout();
        }, 100);
      }, autoHideSeconds * 1000);
    }, timeoutSeconds * 1000);
  };

  const stayLoggedIn = () => {
    if (hideModalTimerRef.current) clearTimeout(hideModalTimerRef.current);
    if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
    setShowModal(false);
    resetTimer();
  };

  useEffect(() => {
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    resetTimer();

    events.forEach(event => window.addEventListener(event, resetTimer));

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (hideModalTimerRef.current) clearTimeout(hideModalTimerRef.current);
      if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, []);

  return { showModal, stayLoggedIn };
};

export default useIdleTimeout;