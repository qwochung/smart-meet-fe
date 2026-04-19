import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import { ForgotPasswordPage, LoginPage, RegisterPage, ResetPasswordPage, VerifyEmailPage } from '../pages/Auth';
import {JoinMeetingPage, MeetingEndedPage, MeetingRoomPage} from "../pages/Meeting/index.js";
import {AppLayout, MainLayout} from "../layouts/index.js";
import {HomePage} from '../pages/Home';
import {FeaturesPage, PricingPage, ResourcesPage, SolutionsPage} from '../pages/Landing/index.js';
import { MinutesDetailPage, MinutesListPage } from '../pages/Minutes';
import { AccountSettingsPage } from '../pages/Settings';
import { CreateMeetingPage, MeetingDetailPage, MeetingsDashboardPage } from '../pages/Management';
import { DashboardPage } from '../pages/Dashboard';
import { isAuthenticated } from '../utils/auth';

const RequireAuth = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/auth/login" replace />;
  }

  return children;
};

const RedirectIfAuthenticated = ({ children }) => {
  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/*TODO: Apply Auth layout*/}
        {/* Auth */}
        <Route
          path="/auth/login"
          element={(
            <RedirectIfAuthenticated>
              <LoginPage />
            </RedirectIfAuthenticated>
          )}
        />
        <Route
          path="/auth/register"
          element={(
            <RedirectIfAuthenticated>
              <RegisterPage />
            </RedirectIfAuthenticated>
          )}
        />
        <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
        <Route path="/auth/verify-email" element={<VerifyEmailPage />} />
        <Route path="/" element={<HomePage/>}/>
        <Route path="/features" element={<FeaturesPage/>}/>
        <Route path="/solutions" element={<SolutionsPage/>}/>
        <Route path="/pricing" element={<PricingPage/>}/>
        <Route path="/resources" element={<ResourcesPage/>}/>
        <Route path="*" element={<Navigate to="/" replace/>}/>

        {/*Meeting */}
        <Route element={<MainLayout/>}>
          <Route path="/join" element={<JoinMeetingPage/>}/>
          <Route path="/room/:roomId" element={<MeetingRoomPage />} />
          <Route path="/room/:roomId/summary" element={<MeetingEndedPage />} />
        </Route>

        {/* App modules */}
        <Route
          element={(
            <RequireAuth>
              <AppLayout />
            </RequireAuth>
          )}
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/minutes" element={<MinutesListPage />} />
          <Route path="/minutes/:id" element={<MinutesDetailPage />} />
          <Route path="/meetings" element={<MeetingsDashboardPage />} />
          <Route path="/meetings/new" element={<CreateMeetingPage />} />
          <Route path="/meetings/:id" element={<MeetingDetailPage />} />
          <Route path="/settings" element={<AccountSettingsPage />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
