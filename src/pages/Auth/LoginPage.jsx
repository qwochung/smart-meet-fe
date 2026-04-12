import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Video, Shield, Github } from 'lucide-react';
import { Button, Input, Checkbox } from '../../components/common';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log('Login:', formData);
    setTimeout(() => setLoading(false), 1000);
  };

  const handleOAuthLogin = (provider) => {
    console.log(`Login with ${provider}`);
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
              Experience the future of professional video meetings. Real-time collaboration tools designed for modern teams.
            </p>
          </div>

          {/* Feature Badges */}
          <div className="flex space-x-4">
            <div className="flex items-center space-x-3 bg-dark-800/80 backdrop-blur-sm rounded-xl px-5 py-4">
              <div className="w-10 h-10 bg-primary-600/20 rounded-lg flex items-center justify-center">
                <Video className="w-5 h-5 text-primary-500" />
              </div>
              <div>
                <div className="font-semibold text-white">HD Video</div>
                <div className="text-sm text-dark-400">Crystal clear 4K calling</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 bg-dark-800/80 backdrop-blur-sm rounded-xl px-5 py-4">
              <div className="w-10 h-10 bg-primary-600/20 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary-500" />
              </div>
              <div>
                <div className="font-semibold text-white">Secure</div>
                <div className="text-sm text-dark-400">End-to-end encryption</div>
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
            <h2 className="text-3xl font-bold text-slate-900">Welcome back</h2>
            <p className="mt-2 text-slate-500">Please enter your details to sign in to your account.</p>
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
              <span className="ml-2">Continue with Google</span>
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
              <span className="px-4 bg-white text-slate-500">or continue with email</span>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email address"
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
                  Password
                </label>
                <Link
                  to="/auth/forgot-password"
                  className="text-sm text-primary-500 hover:text-primary-400 transition-colors"
                >
                  Forgot password?
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
              label="Remember me for 30 days"
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
              Sign in
            </Button>
          </form>

          {/* Sign Up Link */}
          <p className="mt-6 text-center text-slate-500">
            Not a member?{' '}
            <Link to="/auth/register" className="text-primary-500 hover:text-primary-400 font-medium transition-colors">
              Start a 14-day free trial
            </Link>
          </p>

          {/* Footer */}
          <div className="mt-8 flex justify-center space-x-6 text-sm text-slate-500">
            <a href="#" className="hover:text-slate-700 transition-colors">PRIVACY</a>
            <a href="#" className="hover:text-slate-700 transition-colors">TERMS</a>
            <a href="#" className="hover:text-slate-700 transition-colors">HELP</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;