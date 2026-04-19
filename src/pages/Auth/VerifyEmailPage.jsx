import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '../../components/common';
import api from '../../api';

const VerifyEmailPage = () => {
  const location = useLocation();
  const token = useMemo(() => new URLSearchParams(location.search).get('token') || '', [location.search]);

  const [status, setStatus] = useState(token ? 'loading' : 'error');
  const [message, setMessage] = useState(token ? 'Dang xac thuc email...' : 'Thieu token xac thuc email.');

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        return;
      }

      try {
        const response = await api.auth.verifyEmail(token);
        setStatus('success');
        setMessage(response?.message || 'Xac thuc email thanh cong. Ban co the dang nhap ngay.');
      } catch (error) {
        setStatus('error');
        setMessage(error?.response?.data?.message || 'Token khong hop le hoac da het han.');
      }
    };

    verify();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm text-center">
        <h1 className="text-2xl font-bold text-slate-900">Xac thuc email</h1>
        <p className={`mt-4 text-sm ${status === 'success' ? 'text-green-600' : status === 'error' ? 'text-red-500' : 'text-slate-600'}`}>
          {message}
        </p>

        <Link to="/auth/login" className="mt-6 inline-block">
          <Button>Di den trang dang nhap</Button>
        </Link>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
