import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import {LoginPage, RegisterPage} from '../pages/Auth';
import {MeetingPage} from "../pages/Meeting/index.js";
import {MainLayout} from "../layouts/index.js";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/*TODO: Apply Auth layout*/}
        {/* Auth */}
        <Route path="/auth/login" element={<LoginPage/>}/>
        <Route path="/auth/register" element={<RegisterPage/>}/>
        <Route path="/" element={<Navigate to="/auth/login" replace/>}/>
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
