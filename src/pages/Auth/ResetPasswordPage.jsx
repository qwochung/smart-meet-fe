import { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Input } from '../../components/common';
import api from '../../api';

const ResetPasswordPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const tokenFromQuery = useMemo(() => new URLSearchParams(location.search).get('token') || '', [location.search]);

  const [token, setToken] = useState(tokenFromQuery);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!token.trim()) {
      setErrorMessage('Token dat lai mat khau la bat buoc.');
      return;
    }

    if (newPassword.length < 8) {
      setErrorMessage('Mat khau moi phai co it nhat 8 ky tu.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Mat khau xac nhan khong khop.');
      return;
    }

    setLoading(true);
    try {
      await api.auth.resetPassword({
        token: token.trim(),
        newPassword,
      });
      navigate('/auth/login', {
        replace: true,
        state: { successMessage: 'Dat lai mat khau thanh cong. Vui long dang nhap lai.' },
      });
    } catch (error) {
      const message = error?.response?.data?.message || 'Khong the dat lai mat khau. Vui long thu lai.';
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Dat lai mat khau</h1>
        <p className="mt-2 text-sm text-slate-600">Nhap token va mat khau moi de cap nhat tai khoan.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <Input
            label="Token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="your-reset-token-here"
            required
          />

          <Input
            label="Mat khau moi"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            showPasswordToggle
            required
          />

          <Input
            label="Xac nhan mat khau"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            showPasswordToggle
            required
          />

          {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}

          <Button type="submit" fullWidth loading={loading}>
            Cap nhat mat khau
          </Button>
        </form>

        <p className="mt-5 text-sm text-slate-600">
          <Link to="/auth/login" className="font-medium text-primary-600 hover:text-primary-500">
            Quay lai dang nhap
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
