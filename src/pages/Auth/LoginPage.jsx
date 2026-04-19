import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Video, Shield, Github } from 'lucide-react';
import { Button, Input, Checkbox } from '../../components/common';
import api from '../../api';
import { useAuth } from '../../contexts/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setSession } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage] = useState(location?.state?.successMessage || '');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMessage('');

    if (!formData.email.trim() || !formData.password.trim()) {
      setErrorMessage('Vui long nhap day du email va mat khau.');
      return;
    }

    setLoading(true);

    try {
      const response = await api.auth.login({
        email: formData.email.trim(),
        password: formData.password,
      });

      const { accessToken } = setSession(response);
      if (!accessToken) {
        setErrorMessage('Dang nhap thanh cong nhung khong nhan duoc access token.');
        return;
      }

      const redirectFrom = location?.state?.from;
      const redirectPath = redirectFrom
        ? `${redirectFrom.pathname || '/dashboard'}${redirectFrom.search || ''}${redirectFrom.hash || ''}`
        : '/dashboard';
      navigate(redirectPath, { replace: true });
    } catch (error) {
      const message = error?.response?.data?.message || 'Dang nhap that bai. Vui long thu lai.';
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = (provider) => {
    console.log(`Đăng nhập với ${provider}`);
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Left Side - Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-100 overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://plus.unsplash.com/premium_photo-1661494230538-dafa871a4b5d?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
          }}
        >
          <div className="absolute inset-0 bg-slate-900/50" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <div className="flex items-center">
            <img
              src="/logo.png"
              alt="Smart Meet"
              className="h-20 w-auto object-contain"
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col justify-center max-w-lg">
            <h1 className="text-5xl font-bold text-primary-500 leading-tight">
              Connect.<br />
              Collaborate.<br />
              Create.
            </h1>
            <p className="mt-6 text-lg text-dark-300 leading-relaxed">
              Trải nghiệm tương lai của cuộc họp video chuyên nghiệp. Bộ công cụ cộng tác thời gian thực cho đội ngũ hiện đại.
            </p>
          </div>

          {/* Feature Badges */}
          <div className="flex space-x-4">
            <div className="flex items-center space-x-3 bg-dark-800/80 backdrop-blur-sm rounded-xl px-5 py-4">
              <div className="w-10 h-10 bg-primary-600/20 rounded-lg flex items-center justify-center">
                <Video className="w-5 h-5 text-primary-500" />
              </div>
              <div>
                <div className="font-semibold text-white">Video HD</div>
                <div className="text-sm text-dark-400">Cuộc gọi 4K sắc nét</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 bg-dark-800/80 backdrop-blur-sm rounded-xl px-5 py-4">
              <div className="w-10 h-10 bg-primary-600/20 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary-500" />
              </div>
              <div>
                <div className="font-semibold text-white">Bảo mật</div>
                <div className="text-sm text-dark-400">Mã hóa đầu-cuối</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900">Chào mừng bạn trở lại</h2>
            <p className="mt-2 text-slate-500">Vui lòng nhập thông tin để đăng nhập tài khoản.</p>
          </div>

          {/* OAuth Buttons */}
          <div className="space-y-3">
            <Button
              variant="outline"
              fullWidth
              onClick={() => handleOAuthLogin('google')}
              className="border-slate-300 text-slate-700 hover:bg-slate-100"
            >
              <img src="/google.png" alt="Google" className="w-5 h-5 object-contain" />
              <span className="ml-2">Tiếp tục với Google</span>
            </Button>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => handleOAuthLogin('microsoft')}
                className="border-slate-300 text-slate-700 hover:bg-slate-100"
              >
                <img src="/microsoft.png" alt="Microsoft" className="w-5 h-5 object-contain" />
                <span className="ml-2">Microsoft</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => handleOAuthLogin('github')}
                className="border-slate-300 text-slate-700 hover:bg-slate-100"
              >
                <Github className="w-5 h-5" />
                <span className="ml-2">GitHub</span>
              </Button>
            </div>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-slate-500">hoặc tiếp tục bằng email</span>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {successMessage && <p className="text-sm text-green-600">{successMessage}</p>}
            {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}

            <Input
              label="Địa chỉ email"
              type="email"
              name="email"
              placeholder="smartmeet@gmail.com"
              value={formData.email}
              onChange={handleInputChange}
              required
            />

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-slate-700">
                  Mật khẩu
                </label>
                <Link
                  to="/auth/forgot-password"
                  className="text-sm text-primary-500 hover:text-primary-400 transition-colors"
                >
                  Quên mật khẩu?
                </Link>
              </div>
              <Input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange}
                showPasswordToggle
                required
              />
            </div>

            <Checkbox
              name="rememberMe"
              label="Ghi nhớ đăng nhập trong 30 ngày"
              checked={formData.rememberMe}
              onChange={handleInputChange}
            />

            <Button
              type="submit"
              fullWidth
              size="lg"
              loading={loading}
              className="mt-6"
            >
              Đăng nhập
            </Button>
          </form>

          {/* Sign Up Link */}
          <p className="mt-6 text-center text-slate-500">
            Chưa có tài khoản?{' '}
            <Link to="/auth/register" className="text-primary-500 hover:text-primary-400 font-medium transition-colors">
              Bắt đầu dùng thử 14 ngày
            </Link>
          </p>

          {/* Footer */}
          <div className="mt-8 flex justify-center space-x-6 text-sm text-slate-500">
            <a href="#" className="hover:text-slate-700 transition-colors">BẢO MẬT</a>
            <a href="#" className="hover:text-slate-700 transition-colors">ĐIỀU KHOẢN</a>
            <a href="#" className="hover:text-slate-700 transition-colors">TRỢ GIÚP</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;