import {FC} from 'react'
import {Routes, Route, BrowserRouter, Navigate} from 'react-router-dom'
import {PrivateRoutes} from './PrivateRoutes'
import {ErrorsPage} from '../modules/errors/ErrorsPage'
import {Logout, AuthPage, useAuth} from '../modules/auth'
import {App} from '../App'
import useIdleTimeout from '../hooks/useIdleTimeout'

const {BASE_URL} = import.meta.env

const AppRoutes: FC = () => {
  useIdleTimeout(10)

  return (
    <BrowserRouter basename={BASE_URL}>
      <Routes>
        <Route element={<App />}>
          <Route path='error/*' element={<ErrorsPage />} />
          {/* <Route path='logout' element={<Logout />} /> */}
          <>
            <Route path='/*' element={<PrivateRoutes />} />
            <Route index element={<Navigate to='/dashboard' />} />

          </>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export {AppRoutes}
