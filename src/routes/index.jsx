import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import {LoginPage, RegisterPage} from '../pages/Auth';
import {JoinMeetingPage, MeetingPage} from "../pages/Meeting/index.js";
import {AppLayout, MainLayout} from "../layouts/index.js";
import {HomePage} from '../pages/Home';
import {FeaturesPage, PricingPage, ResourcesPage, SolutionsPage} from '../pages/Landing/index.js';
import { MinutesDetailPage, MinutesListPage } from '../pages/Minutes';
import { AccountSettingsPage } from '../pages/Settings';
import { CreateMeetingPage, MeetingDetailPage, MeetingsDashboardPage } from '../pages/Management';
import { DashboardPage } from '../pages/Dashboard';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/*TODO: Apply Auth layout*/}
        {/* Auth */}
        <Route path="/auth/login" element={<LoginPage/>}/>
        <Route path="/auth/register" element={<RegisterPage/>}/>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/features" element={<FeaturesPage/>}/>
        <Route path="/solutions" element={<SolutionsPage/>}/>
        <Route path="/pricing" element={<PricingPage/>}/>
        <Route path="/resources" element={<ResourcesPage/>}/>
        <Route path="*" element={<Navigate to="/" replace/>}/>

        {/*Meeting */}
        <Route element={<MainLayout/>}>
          <Route path="/join" element={<JoinMeetingPage/>}/>
          <Route path="/room/*" element={<MeetingPage/>}/>
        </Route>

        {/* App modules */}
        <Route element={<AppLayout />}>
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
