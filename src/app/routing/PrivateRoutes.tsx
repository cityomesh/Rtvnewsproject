import {FC, lazy, Suspense, useEffect, useState} from 'react'
import {Navigate, Route, Routes, Outlet} from 'react-router-dom'
import {MasterLayout} from '../../_metronic/layout/MasterLayout'
import TopBarProgress from 'react-topbar-progress-indicator'
import {DashboardWrapper} from '../pages/dashboard/DashboardWrapper'
import {MenuTestPage} from '../pages/MenuTestPage'
import {getCSSVariableValue} from '../../_metronic/assets/ts/_utils'
import {DisableSidebar} from '../../_metronic/layout/core'
import {WithChildren} from '../../_metronic/helpers'
import BuilderPageWrapper from '../pages/layout-builder/BuilderPageWrapper'
import {MyPage} from "../pages/MyPage"
import CreateUpdates from "../pages/updates/create"
import AllUpdates from "../pages/updates/updates"
import Login from "../modules/auth/components/Login"
import CreateQuiz from "../pages/quiz/AddQuiz"
import ViewAllQuizes from "../pages/quiz/ViewAllQuiz"
import AddNotification from '../pages/notification/AddNotification'
import { isAuthenticated } from '../modules/auth/session'
import { AddReels } from '../pages/reels/AddReels'
import AllReels from '../pages/reels/AllReels'
import { ViewPost } from '../pages/posts/ViewPost'
import { AddPost } from '../pages/posts/AddPost'
import ViewAllPoll from '../pages/polls/ViewAllPoll'
import AddPoll from '../pages/polls/AddPoll'
import News  from '../pages/news/news'
import CreateNews from '../pages/news/create'
import UserManagementPage from '../modules/user-management/UserManagementPage'

const ProfilePage = lazy(() => import('../modules/profile/ProfilePage'))

// Protected Route Component - FIXED
const ProtectedRoute: FC = () => {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if token exists in localStorage
        const token = localStorage.getItem('token');
        // Fix: explicitly convert to boolean
        const hasToken: boolean = !!(token && token.length > 0);
        
        console.log('ProtectedRoute - Token exists:', hasToken);
        setAuthenticated(hasToken);
      } catch (error) {
        console.error('Authentication check failed:', error);
        setAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  if (authenticated === null) {
    return <SuspensedView />;
  }

  return authenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

const PrivateRoutes = () => {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<Login />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MasterLayout />}>
          <Route path='/dashboard' element={<DashboardWrapper />} />
          <Route path="/my-page" element={<MyPage />} />
          <Route path='builder' element={<BuilderPageWrapper />} />
          <Route path='menu-test' element={<MenuTestPage />} />

          {/* User Management */}
          <Route path="/user-management" element={<UserManagementPage />} />

          {/* Updates */}
          <Route path="/updates/create/">
            <Route index element={<CreateUpdates />} />
            <Route path=":id" element={<CreateUpdates />} />
          </Route>
          <Route path="/updates" element={<AllUpdates />} />

          {/* Quiz */}
          <Route path="/quiz" element={<ViewAllQuizes />} />
          <Route path="/quiz/create/">
            <Route index element={<CreateQuiz />} />
            <Route path=":id" element={<CreateQuiz />} />
          </Route>

          {/* Reels */}
          <Route path="/reels" element={<AllReels status="REVIEW_COMPLETE"/>}/>
          <Route path='/reels/review' element={<AllReels status="UNDER_REVIEW"/>}/>
          <Route path="/reels/create">
            <Route index element={<AddReels />} />
            <Route path=":id" element={<AddReels />} />
          </Route>

          {/* Post  */}      
          <Route path="/posts" element={<ViewPost />} />
          <Route path="/post/create/">
            <Route index element={<AddPost />} />
            <Route path=":id" element={<AddPost />} />
          </Route>

          {/* Poll */}
          <Route path='/polls' element={<ViewAllPoll/>} />
          <Route path="/poll/create/">
            <Route index element={<AddPoll />} />
            <Route path=":id" element={<AddPoll />} />
          </Route>         
          
          {/* News */}
          <Route path="/news" element={<News />} />
          <Route path="/news/create/">
            <Route index element={<CreateNews />} />
            <Route path=":id" element={<CreateNews />} />
          </Route>

          {/* Notifications */}
          <Route path="/notification/">
            <Route index element={<AddNotification />} />
            <Route path=":id" element={<AddNotification />} />
          </Route>

          {/* Profile */}
          <Route
            path='crafted/pages/profile/*'
            element={
              <SuspensedView>
                <ProfilePage />
              </SuspensedView>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Route>
      {/* Catch-all: redirect unknown routes to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

const SuspensedView: FC<WithChildren> = ({children}) => {
  const baseColor = getCSSVariableValue('--bs-primary')
  TopBarProgress.config({
    barColors: {
      '0': baseColor,
    },
    barThickness: 1,
    shadowBlur: 5,
  })
  return (
    <Suspense fallback={<TopBarProgress />}>
      <DisableSidebar>{children}</DisableSidebar>
    </Suspense>
  )
}

export {PrivateRoutes}
