import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Input } from '../../components/common';
import api from '../../api';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email.trim()) {
      setErrorMessage('Vui long nhap email.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.auth.forgotPassword({ email: email.trim() });
      const message = response?.message || 'Neu email ton tai, he thong da gui huong dan dat lai mat khau.';
      setSuccessMessage(message);
    } catch (error) {
      const message = error?.response?.data?.message || 'Khong the gui yeu cau quen mat khau. Vui long thu lai.';
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Quen mat khau</h1>
        <p className="mt-2 text-sm text-slate-600">Nhap email da dang ky de nhan huong dan dat lai mat khau.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="smartmeet@gmail.com"
            required
          />

          {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
          {successMessage && <p className="text-sm text-green-600">{successMessage}</p>}

          <Button type="submit" fullWidth loading={loading}>
            Gui yeu cau
          </Button>
        </form>

        <p className="mt-5 text-sm text-slate-600">
          Da nho mat khau?{' '}
          <Link to="/auth/login" className="font-medium text-primary-600 hover:text-primary-500">
            Quay lai dang nhap
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
