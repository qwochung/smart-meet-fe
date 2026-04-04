import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import {LoginPage, RegisterPage} from '../pages/Auth';
import {MeetingPage} from "../pages/Meeting/index.js";
import {MainLayout} from "../layouts/index.js";
import {HomePage} from '../pages/Home';
import {FeaturesPage, LandingPlaceholderPage} from '../pages/Landing/index.js';

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
        <Route path="/solutions" element={<LandingPlaceholderPage title="Solutions" description="Build meeting workflows for engineering, sales, support, and distributed leadership teams."/>}/>
        <Route path="/pricing" element={<LandingPlaceholderPage title="Pricing" description="Choose a plan that scales from small squads to enterprise collaboration programs."/>}/>
        <Route path="/resources" element={<LandingPlaceholderPage title="Resources" description="Access playbooks, docs, and tutorials to roll out modern collaboration with confidence."/>}/>
        <Route path="*" element={<Navigate to="/auth/login" replace/>}/>

        {/*Meeting */}
        <Route element={<MainLayout/>}>
          <Route path="/room/*" element={<MeetingPage/>}/>
        </Route>

      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
