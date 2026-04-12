import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bell, CircleX, Menu, MessageCircleQuestionMark, Search, Settings } from 'lucide-react';
import Button from './Button';

const Logo = () => (
  <Link to="/" className="flex items-center">
    <img src="/logo.png" alt="Smart Meet" className="h-14 w-auto object-contain" />
  </Link>
);

const UserAvatar = ({ user, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base',
  };

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : user?.email?.[0]?.toUpperCase() || 'U';

  return (
    <button
      className={`${sizeClasses[size]} rounded-full bg-primary-600 flex items-center justify-center text-white font-medium hover:bg-primary-700 transition-colors`}
      type="button"
    >
      {user?.avatar ? (
        <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
      ) : (
        initials
      )}
    </button>
  );
};

const IconButton = ({ icon: Icon, onClick, badge, ariaLabel, className = 'text-dark-300 hover:text-white hover:bg-dark-800' }) => (
  <button
    onClick={onClick}
    type="button"
    className={`relative rounded-full p-2 transition-colors ${className}`}
    aria-label={ariaLabel}
  >
    <Icon className="w-5 h-5" />
    {badge && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />}
  </button>
);

const NavLinks = ({ links, isMobile = false, onLinkClick, textClass = 'text-dark-300 hover:text-white' }) => {
  const location = useLocation();

  const isActiveLink = (href) => {
    if (href === '/') {
      return location.pathname === '/';
    }

    return location.pathname.startsWith(href);
  };

  const baseClasses = isMobile ? 'flex flex-col gap-4' : 'hidden md:flex items-center gap-8';

  return (
    <nav className={baseClasses}>
      {links.map((link) => (
        <Link
          key={link.href}
          to={link.href}
          onClick={onLinkClick}
          className={`text-sm font-medium transition-colors duration-200 ${
            isActiveLink(link.href) ? 'text-primary-600' : textClass
          }`}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
};

const SearchInput = ({ placeholder = 'Tìm kiếm cuộc họp...', value, onChange, inputClassName }) => (
  <div className="relative hidden md:block">
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={inputClassName || 'w-64 rounded-lg border border-slate-300 bg-white py-2 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500'}
    />
  </div>
);

const MobileMenuButton = ({ isOpen, onClick, colorClass }) => (
  <button
    onClick={onClick}
    type="button"
    className={`md:hidden p-2 transition-colors ${colorClass}`}
    aria-label="Bật/tắt menu"
  >
    {isOpen ? <CircleX /> : <Menu />}
  </button>
);

const PublicHeader = ({ onSignIn, onSignUp, isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const publicNavLinks = [
    { label: 'Tính năng', href: '/features' },
    { label: 'Giải pháp', href: '/solutions' },
    { label: 'Bảng giá', href: '/pricing' },
    { label: 'Tài nguyên', href: '/resources' },
  ];

  return (
    <>
      <div className="flex items-center justify-between h-16">
        <Logo />

        <NavLinks links={publicNavLinks} textClass="text-slate-500 hover:text-slate-900" />

        <div className="hidden md:flex items-center gap-4">
          <Link
            to="/auth/login"
            onClick={onSignIn}
            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors duration-200"
          >
            Đăng nhập
          </Link>
          <Link to="/auth/register" onClick={onSignUp}>
            <Button variant="primary" size="md" className="rounded-lg px-5">
              Đăng ký miễn phí
            </Button>
          </Link>
        </div>

        <MobileMenuButton
          isOpen={isMobileMenuOpen}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          colorClass="text-slate-500 hover:text-slate-900"
        />
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden py-4 border-t border-slate-200">
          <NavLinks
            links={publicNavLinks}
            isMobile
            textClass="text-slate-500 hover:text-slate-900"
            onLinkClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="flex flex-col gap-3 pt-4 mt-4 border-t border-slate-200">
            <Link
              to="/auth/login"
              onClick={() => {
                setIsMobileMenuOpen(false);
                onSignIn?.();
              }}
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors duration-200"
            >
              Đăng nhập
            </Link>
            <Link
              to="/auth/register"
              onClick={() => {
                setIsMobileMenuOpen(false);
                onSignUp?.();
              }}
            >
              <Button variant="primary" size="md" className="rounded-lg w-full">
                Đăng ký miễn phí
              </Button>
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

const AppHeader = ({ user, searchValue, onSearchChange, onNotificationClick, isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const appNavLinks = [
    { label: 'Tổng quan', href: '/dashboard' },
    { label: 'Biên bản họp', href: '/minutes' },
    { label: 'Quản lý cuộc họp', href: '/meetings' },
    { label: 'Cài đặt tài khoản', href: '/settings' },
  ];

  return (
    <>
      <div className="flex items-center justify-between h-16">
        <Logo />

        <NavLinks links={appNavLinks} textClass="text-slate-500 hover:text-slate-900" />

        <div className="hidden md:flex items-center gap-2">
          <SearchInput value={searchValue} onChange={onSearchChange} />
          <IconButton icon={Bell} onClick={onNotificationClick} badge ariaLabel="Thông báo" className="text-slate-500 hover:text-slate-900 hover:bg-slate-100" />
          <UserAvatar user={user} />
        </div>

        <MobileMenuButton
          isOpen={isMobileMenuOpen}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          colorClass="text-slate-500 hover:text-slate-900"
        />
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden py-4 border-t border-slate-200">
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm kiếm cuộc họp..."
                value={searchValue}
                onChange={onSearchChange}
                className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:border-primary-500 focus:outline-none"
              />
            </div>
          </div>
          <NavLinks links={appNavLinks} isMobile onLinkClick={() => setIsMobileMenuOpen(false)} />
          <div className="flex items-center gap-4 pt-4 mt-4 border-t border-slate-200">
            <IconButton icon={Bell} onClick={onNotificationClick} ariaLabel="Thông báo" className="text-slate-500 hover:text-slate-900 hover:bg-slate-100" />
            <UserAvatar user={user} />
          </div>
        </div>
      )}
    </>
  );
};

const MeetingHeader = ({ user, meetingTitle, onSettingsClick, onHelpClick }) => (
  <div className="flex items-center justify-between h-16">
    <Logo />

    {meetingTitle && <div className="hidden md:block text-slate-700 text-sm font-medium">{meetingTitle}</div>}

    <div className="flex items-center gap-1">
      <IconButton icon={Settings} onClick={onSettingsClick} ariaLabel="Cài đặt" className="text-slate-500 hover:text-slate-900 hover:bg-slate-100" />
      <IconButton icon={MessageCircleQuestionMark} onClick={onHelpClick} ariaLabel="Trợ giúp" className="text-slate-500 hover:text-slate-900 hover:bg-slate-100" />
      <UserAvatar user={user} size="sm" />
    </div>
  </div>
);

const Header = ({
  variant = 'public',
  fixed = false,
  user,
  meetingTitle,
  searchValue,
  onSearchChange,
  onSignIn,
  onSignUp,
  onNotificationClick,
  onSettingsClick,
  onHelpClick,
  className = '',
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const headerShellClass =
    variant === 'public' ? 'border-b border-slate-200 bg-white/95' : 'border-b border-slate-200 bg-white/95';
  const fixedClass = fixed
    ? variant === 'public'
      ? 'fixed top-0 inset-x-0 z-50 backdrop-blur'
      : 'fixed top-0 inset-x-0 z-50 backdrop-blur'
    : '';

  return (
    <>
      <header className={`${headerShellClass} ${fixedClass} ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {variant === 'public' && (
            <PublicHeader
              onSignIn={onSignIn}
              onSignUp={onSignUp}
              isMobileMenuOpen={isMobileMenuOpen}
              setIsMobileMenuOpen={setIsMobileMenuOpen}
            />
          )}

          {variant === 'app' && (
            <AppHeader
              user={user}
              searchValue={searchValue}
              onSearchChange={onSearchChange}
              onNotificationClick={onNotificationClick}
              isMobileMenuOpen={isMobileMenuOpen}
              setIsMobileMenuOpen={setIsMobileMenuOpen}
            />
          )}

          {variant === 'meeting' && (
            <MeetingHeader
              user={user}
              meetingTitle={meetingTitle}
              onSettingsClick={onSettingsClick}
              onHelpClick={onHelpClick}
            />
          )}
        </div>
      </header>
      {fixed && <div className="h-16" aria-hidden="true" />}
    </>
  );
};

export default Header;
