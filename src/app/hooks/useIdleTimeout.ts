import { useEffect, useRef } from 'react';

const useIdleTimeout = (timeoutMinutes: number = 10) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const logout = () => {
    console.log("Auto-logout triggered");
    
    const authKeys = [
      'authToken',
      'accessToken',
      'token',
      'user',
      'refreshToken',
      'kt_auth',
      'auth',
    ];
    
    authKeys.forEach(key => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });
    
    window.location.href = '/login';
  };

  const resetTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(logout, timeoutMinutes * 60 * 1000);
  };

  useEffect(() => {
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    resetTimer();

    events.forEach(event => window.addEventListener(event, resetTimer));

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, []);

  return null;
};

export default useIdleTimeout;
