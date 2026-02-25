    import { useState } from 'react';
    import { Link } from 'react-router-dom';
    import { Video, Shield, Github } from 'lucide-react';
    import { Button, Input, Checkbox } from '../../components/common';

    // Google Icon Component
    const GoogleIcon = () => (
      <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="currentColor"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="currentColor"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="currentColor"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
    );

    // Microsoft Icon Component
    const MicrosoftIcon = () => (
      <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path fill="#f25022" d="M1 1h10v10H1z" />
        <path fill="#00a4ef" d="M1 13h10v10H1z" />
        <path fill="#7fba00" d="M13 1h10v10H13z" />
        <path fill="#ffb900" d="M13 13h10v10H13z" />
      </svg>
    );

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
        <div className="min-h-screen flex">
         {/* Left Side - Hero Section  */}
          <div className="hidden lg:flex lg:w-1/2 relative bg-dark-900 overflow-hidden">
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url('https://plus.unsplash.com/premium_photo-1661494230538-dafa871a4b5d?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
              }}
            >
              <div className="absolute inset-0 bg-dark-900/80" />
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
          <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-dark-900">
            <div className="w-full max-w-md">
              {/* Header */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white">Welcome back</h2>
                <p className="mt-2 text-dark-400">Please enter your details to sign in to your account.</p>
              </div>

              {/* OAuth Buttons */}
              <div className="space-y-3">
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => handleOAuthLogin('google')}
                  className="border-dark-600 hover:bg-dark-800"
                >
                  <GoogleIcon />
                  <span className="ml-2">Continue with Google</span>
                </Button>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    onClick={() => handleOAuthLogin('microsoft')}
                    className="border-dark-600 hover:bg-dark-800"
                  >
                    <MicrosoftIcon />
                    <span className="ml-2">Microsoft</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleOAuthLogin('github')}
                    className="border-dark-600 hover:bg-dark-800"
                  >
                    <Github className="w-5 h-5" />
                    <span className="ml-2">GitHub</span>
                  </Button>
                </div>
              </div>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-dark-700" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-dark-900 text-dark-400">or continue with email</span>
                </div>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                  label="Email address"
                  type="email"
                  name="email"
                  placeholder="kiet@gamil.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-sm font-medium text-dark-300">
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
              <p className="mt-6 text-center text-dark-400">
                Not a member?{' '}
                <Link to="/auth/register" className="text-primary-500 hover:text-primary-400 font-medium transition-colors">
                  Start a 14-day free trial
                </Link>
              </p>

              {/* Footer */}
              <div className="mt-8 flex justify-center space-x-6 text-sm text-dark-500">
                <a href="#" className="hover:text-dark-300 transition-colors">PRIVACY</a>
                <a href="#" className="hover:text-dark-300 transition-colors">TERMS</a>
                <a href="#" className="hover:text-dark-300 transition-colors">HELP</a>
              </div>
            </div>
          </div>
        </div>
      );
    };

    export default LoginPage;
