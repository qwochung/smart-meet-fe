import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Github } from 'lucide-react';
import { Button, Input } from '../../components/common';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Vui lòng nhập họ và tên';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Vui lòng nhập email hợp lệ';
    }

    if (!formData.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Mật khẩu phải có ít nhất 8 ký tự';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    console.log('Đăng ký:', formData);
    setTimeout(() => setLoading(false), 1000);
  };

  const handleOAuthLogin = (provider) => {
    console.log(`Đăng ký với ${provider}`);
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Left Side - Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-100 overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1470&auto=format&fit=crop')`,
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
            <h1 className="text-5xl font-bold text-white leading-tight">
              Gia nhập tương lai của họp video.
            </h1>
            <p className="mt-6 text-lg text-dark-300 leading-relaxed">
              Trải nghiệm hợp tác mượt mà với âm thanh rõ nét và video chất lượng cao cho mọi quy mô đội ngũ.
            </p>
          </div>

          {/* Teams Badge */}
          <div className="flex items-center">
            <div className="flex -space-x-3">
              <div className="w-10 h-10 rounded-full bg-[#9CA89B] border-2 border-dark-900"></div>
              <div className="w-10 h-10 rounded-full bg-[#E8DFC4] border-2 border-dark-900"></div>
              <div className="w-10 h-10 rounded-full bg-[#F5F0E1] border-2 border-dark-900"></div>
            </div>
            <p className="ml-4 text-dark-300">
              Đã có hơn <span className="text-white font-semibold">10,000+</span> đội ngũ trên toàn thế giới tham gia
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900">Tạo tài khoản</h2>
            <p className="mt-2 text-slate-500">Bắt đầu dùng thử 14 ngày. Không cần thẻ tín dụng.</p>
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

          {/* Register Form */}
          {/* Fix: bỏ prop helperText trùng lặp với error — Input.jsx dùng error để hiển thị message */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Họ và tên"
              type="text"
              name="fullName"
              placeholder="Nhập họ và tên"
              value={formData.fullName}
              onChange={handleInputChange}
              error={errors.fullName}
              required
            />

            <Input
              label="Địa chỉ email"
              type="email"
              name="email"
              placeholder="smartmeet@gmail.com"
              value={formData.email}
              onChange={handleInputChange}
              error={errors.email}
              required
            />

            <Input
              label="Mật khẩu"
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleInputChange}
              error={errors.password}
              showPasswordToggle
              required
            />

            <Input
              label="Xác nhận mật khẩu"
              type="password"
              name="confirmPassword"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              error={errors.confirmPassword}
              showPasswordToggle
              required
            />

            <Button
              type="submit"
              fullWidth
              size="lg"
              loading={loading}
              className="mt-6"
            >
              Tạo tài khoản
            </Button>
          </form>

          {/* Sign In Link */}
          <p className="mt-6 text-center text-slate-500">
            Đã có tài khoản?{' '}
            <Link to="/auth/login" className="text-primary-500 hover:text-primary-400 font-medium transition-colors">
              Đăng nhập
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

export default RegisterPage;