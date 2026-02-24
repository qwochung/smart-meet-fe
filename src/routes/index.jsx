import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '../pages/Auth';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route path="/auth/login" element={<LoginPage />} />

        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/auth/login" replace />} />

        {/* Catch all - redirect to login */}
        <Route path="*" element={<Navigate to="/auth/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
