import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Button from './Button';

const navLinks = [
  { label: 'Features', href: '/features' },
  { label: 'Solutions', href: '/solutions' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Resources', href: '/resources' },
];

const Header = ({ 
  logo = 'Smart Meet',
  showNavLinks = true,
  showAuthButtons = true,
  onSignIn,
  onSignUp,
  className = '',
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActiveLink = (href) => location.pathname === href;

  return (
    <header className={`bg-dark-900 border-b border-dark-800 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src="/logo.png" 
              alt={logo}
              className="h-16 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          {showNavLinks && (
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`text-sm font-medium transition-colors duration-200 ${
                    isActiveLink(link.href)
                      ? 'text-white'
                      : 'text-dark-300 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          )}

          {/* Auth Buttons */}
          {showAuthButtons && (
            <div className="hidden md:flex items-center gap-4">
              <Link
                to="/login"
                onClick={onSignIn}
                className="text-sm font-medium text-dark-300 hover:text-white transition-colors duration-200"
              >
                Sign In
              </Link>
              <Button
                variant="primary"
                size="md"
                onClick={onSignUp}
                className="rounded-full px-5"
              >
                Sign Up Free
              </Button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-dark-300 hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-dark-800">
            {showNavLinks && (
              <nav className="flex flex-col gap-4 mb-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`text-sm font-medium transition-colors duration-200 ${
                      isActiveLink(link.href)
                        ? 'text-white'
                        : 'text-dark-300 hover:text-white'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            )}
            {showAuthButtons && (
              <div className="flex flex-col gap-3 pt-4 border-t border-dark-800">
                <Link
                  to="/login"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onSignIn?.();
                  }}
                  className="text-sm font-medium text-dark-300 hover:text-white transition-colors duration-200"
                >
                  Sign In
                </Link>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onSignUp?.();
                  }}
                  className="rounded-full"
                >
                  Sign Up Free
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
