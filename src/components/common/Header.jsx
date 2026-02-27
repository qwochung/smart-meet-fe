import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Button from './Button';

// ==================== ICONS ====================
const SettingsIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const HelpIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const BellIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const SearchIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const MenuIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const CloseIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

// ==================== SUB-COMPONENTS ====================

// Logo Component
const Logo = () => (
  <Link to="/" className="flex items-center">
    <img 
      src="/logo.png" 
      alt="Nexus Meet"
      className="h-14 w-auto object-contain"
    />
  </Link>
);

// User Avatar Component
const UserAvatar = ({ user, size = "md" }) => {
  const sizeClasses = {
    sm: "w-7 h-7 text-xs",
    md: "w-8 h-8 text-sm",
    lg: "w-10 h-10 text-base"
  };

  const initials = user?.name 
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() || 'U';

  return (
    <button className={`${sizeClasses[size]} rounded-full bg-primary-600 flex items-center justify-center text-white font-medium hover:bg-primary-700 transition-colors`}>
      {user?.avatar ? (
        <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
      ) : (
        initials
      )}
    </button>
  );
};

// Icon Button Component
const IconButton = ({ icon: Icon, onClick, badge, ariaLabel }) => (
  <button
    onClick={onClick}
    className="relative p-2 text-dark-300 hover:text-white hover:bg-dark-800 rounded-full transition-colors"
    aria-label={ariaLabel}
  >
    <Icon className="w-5 h-5" />
    {badge && (
      <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
    )}
  </button>
);

// Navigation Links Component
const NavLinks = ({ links, isMobile = false, onLinkClick }) => {
  const location = useLocation();
  const isActiveLink = (href) => location.pathname === href;

  const baseClasses = isMobile 
    ? "flex flex-col gap-4" 
    : "hidden md:flex items-center gap-8";

  return (
    <nav className={baseClasses}>
      {links.map((link) => (
        <Link
          key={link.href}
          to={link.href}
          onClick={onLinkClick}
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
  );
};

// Search Input Component
const SearchInput = ({ placeholder = "Search meetings...", value, onChange }) => (
  <div className="relative hidden md:block">
    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="pl-10 pr-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white placeholder-dark-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 w-64 transition-colors"
    />
  </div>
);

// Mobile Menu Toggle Button
const MobileMenuButton = ({ isOpen, onClick }) => (
  <button
    onClick={onClick}
    className="md:hidden p-2 text-dark-300 hover:text-white transition-colors"
    aria-label="Toggle menu"
  >
    {isOpen ? <CloseIcon /> : <MenuIcon />}
  </button>
);

// ==================== HEADER VARIANTS ====================

// Public Header (Landing pages)
const PublicHeader = ({ onSignIn, onSignUp, isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const publicNavLinks = [
    { label: 'Features', href: '/features' },
    { label: 'Solutions', href: '/solutions' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Resources', href: '/resources' },
  ];

  return (
    <>
      <div className="flex items-center justify-between h-16">
        <Logo />
        
        <NavLinks links={publicNavLinks} />
        
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

        <MobileMenuButton isOpen={isMobileMenuOpen} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden py-4 border-t border-dark-800">
          <NavLinks 
            links={publicNavLinks} 
            isMobile 
            onLinkClick={() => setIsMobileMenuOpen(false)} 
          />
          <div className="flex flex-col gap-3 pt-4 mt-4 border-t border-dark-800">
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
        </div>
      )}
    </>
  );
};

// App Header (Dashboard, logged in users)
const AppHeader = ({ user, searchValue, onSearchChange, onNotificationClick, isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const appNavLinks = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Recordings', href: '/recordings' },
    { label: 'Calendar', href: '/calendar' },
    { label: 'Team', href: '/team' },
  ];

  return (
    <>
      <div className="flex items-center justify-between h-16">
        <Logo />
        
        <NavLinks links={appNavLinks} />
        
        <div className="hidden md:flex items-center gap-2">
          <SearchInput value={searchValue} onChange={onSearchChange} />
          <IconButton 
            icon={BellIcon} 
            onClick={onNotificationClick} 
            badge={true}
            ariaLabel="Notifications"
          />
          <UserAvatar user={user} />
        </div>

        <MobileMenuButton isOpen={isMobileMenuOpen} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden py-4 border-t border-dark-800">
          <div className="mb-4">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
              <input
                type="text"
                placeholder="Search meetings..."
                value={searchValue}
                onChange={onSearchChange}
                className="w-full pl-10 pr-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white placeholder-dark-400 focus:outline-none focus:border-primary-500"
              />
            </div>
          </div>
          <NavLinks 
            links={appNavLinks} 
            isMobile 
            onLinkClick={() => setIsMobileMenuOpen(false)} 
          />
          <div className="flex items-center gap-4 pt-4 mt-4 border-t border-dark-800">
            <IconButton 
              icon={BellIcon} 
              onClick={onNotificationClick}
              ariaLabel="Notifications"
            />
            <UserAvatar user={user} />
          </div>
        </div>
      )}
    </>
  );
};

// Meeting Header (During meeting)
const MeetingHeader = ({ user, meetingTitle, onSettingsClick, onHelpClick }) => {
  return (
    <div className="flex items-center justify-between h-14">
      <Logo />
      
      {meetingTitle && (
        <div className="hidden md:block text-white text-sm font-medium">
          {meetingTitle}
        </div>
      )}
      
      <div className="flex items-center gap-1">
        <IconButton 
          icon={SettingsIcon} 
          onClick={onSettingsClick}
          ariaLabel="Settings"
        />
        <IconButton 
          icon={HelpIcon} 
          onClick={onHelpClick}
          ariaLabel="Help"
        />
        <UserAvatar user={user} size="sm" />
      </div>
    </div>
  );
};

// ==================== MAIN HEADER COMPONENT ====================
const Header = ({ 
  variant = "public", // "public" | "app" | "meeting"
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

  return (
    <header className={`bg-dark-900 border-b border-dark-800 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {variant === "public" && (
          <PublicHeader 
            onSignIn={onSignIn}
            onSignUp={onSignUp}
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
          />
        )}

        {variant === "app" && (
          <AppHeader 
            user={user}
            searchValue={searchValue}
            onSearchChange={onSearchChange}
            onNotificationClick={onNotificationClick}
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
          />
        )}

        {variant === "meeting" && (
          <MeetingHeader 
            user={user}
            meetingTitle={meetingTitle}
            onSettingsClick={onSettingsClick}
            onHelpClick={onHelpClick}
          />
        )}
      </div>
    </header>
  );
};

export default Header;
