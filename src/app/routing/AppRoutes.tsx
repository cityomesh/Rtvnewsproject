// import {FC} from 'react'
// import {Routes, Route, BrowserRouter, Navigate} from 'react-router-dom'
// import {PrivateRoutes} from './PrivateRoutes'
// import {ErrorsPage} from '../modules/errors/ErrorsPage'
// import {Logout, AuthPage, useAuth} from '../modules/auth'
// import {App} from '../App'
// import useIdleTimeout from '../hooks/useIdleTimeout'

// const {BASE_URL} = import.meta.env

// const AppRoutes: FC = () => {
//   useIdleTimeout(10)

//   return (
//     <BrowserRouter basename={BASE_URL}>
//       <Routes>
//         <Route element={<App />}>
//           <Route path='error/*' element={<ErrorsPage />} />
//           {/* <Route path='logout' element={<Logout />} /> */}
//           <>
//             <Route path='/*' element={<PrivateRoutes />} />
//             <Route index element={<Navigate to='/dashboard' />} />

//           </>
//         </Route>
//       </Routes>
//     </BrowserRouter>
//   )
// }

// export {AppRoutes}






// AppRoute.tsx  five seconds

// import { FC } from 'react';
// import { Routes, Route, BrowserRouter, Navigate, useNavigate } from 'react-router-dom';
// import { PrivateRoutes } from './PrivateRoutes';
// import { ErrorsPage } from '../modules/errors/ErrorsPage';
// import { App } from '../App';
// import useIdleTimeout from '../hooks/useIdleTimeout';
// import IdleTimeoutModal from '../../_metronic/layout/components/ IdleTimeoutModal';

// const { BASE_URL } = import.meta.env;

// const AppRoutesWithIdle: FC = () => {
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     console.log('Auto-logout triggered');
//     const authKeys = [
//       'authToken', 'accessToken', 'token', 'user',
//       'refreshToken', 'kt_auth', 'auth'
//     ];
//     authKeys.forEach(key => {
//       localStorage.removeItem(key);
//       sessionStorage.removeItem(key);
//     });
//     navigate('/login', { replace: true }); // no page refresh
//   };

//   const { showModal, stayLoggedIn } = useIdleTimeout({
//     timeoutSeconds: 5,      // 5 seconds idle
//     onLogout: handleLogout,
//     autoHideSeconds: 3,     // popup auto‑closes after 3 seconds
//   });

//   return (
//     <>
//       <Routes>
//         <Route element={<App />}>
//           <Route path='error/*' element={<ErrorsPage />} />
//           <Route path='/*' element={<PrivateRoutes />} />
//           <Route index element={<Navigate to='/dashboard' />} />
//         </Route>
//       </Routes>
//       <IdleTimeoutModal
//         open={showModal}
//         onStay={stayLoggedIn}
//         autoHideSeconds={3}
//       />
//     </>
//   );
// };

// const AppRoutes: FC = () => {
//   return (
//     <BrowserRouter basename={BASE_URL}>
//       <AppRoutesWithIdle />
//     </BrowserRouter>
//   );
// };

// export { AppRoutes };






// AppRoute.tsx


import { FC } from 'react';
import { Routes, Route, BrowserRouter, Navigate, useNavigate } from 'react-router-dom';
import { PrivateRoutes } from './PrivateRoutes';
import { ErrorsPage } from '../modules/errors/ErrorsPage';
import { App } from '../App';
import useIdleTimeout from '../hooks/useIdleTimeout';
import IdleTimeoutModal from '../../_metronic/layout/components/ IdleTimeoutModal';

const { BASE_URL } = import.meta.env;

const AppRoutesWithIdle: FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log('Auto-logout triggered after 10 minutes of inactivity');
    const authKeys = [
      'authToken', 'accessToken', 'token', 'user',
      'refreshToken', 'kt_auth', 'auth'
    ];
    authKeys.forEach(key => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });
    navigate('/login', { replace: true });
  };

  const { showModal, stayLoggedIn } = useIdleTimeout({
    timeoutSeconds: 600,      // 10 minutes = 600 seconds
    onLogout: handleLogout,
    autoHideSeconds: 10,      // popup stays for 10 seconds then auto‑logout
  });

  return (
    <>
      <Routes>
        <Route element={<App />}>
          <Route path='error/*' element={<ErrorsPage />} />
          <Route path='/*' element={<PrivateRoutes />} />
          <Route index element={<Navigate to='/dashboard' />} />
        </Route>
      </Routes>
      <IdleTimeoutModal
        open={showModal}
        onStay={stayLoggedIn}
        autoHideSeconds={10}
      />
    </>
  );
};

const AppRoutes: FC = () => {
  return (
    <BrowserRouter basename={BASE_URL}>
      <AppRoutesWithIdle />
    </BrowserRouter>
  );
};

export { AppRoutes };