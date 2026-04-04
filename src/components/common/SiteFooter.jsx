import { Link } from 'react-router-dom';

const SiteFooter = () => {
  return (
    <footer className="border-t border-white/10 bg-[#040d1c]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <Link to="/" className="inline-flex items-center">
          <img src="/logo.png" alt="Smart Meet" className="h-14 w-auto object-contain" />
        </Link>

        <div className="flex items-center gap-5 text-sm text-slate-300">
          <Link to="/pricing" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link to="/pricing" className="hover:text-white transition-colors">Terms of Service</Link>
          <Link to="/resources" className="hover:text-white transition-colors">Contact Support</Link>
        </div>

        <p className="text-xs text-slate-400">© 2026 Smart Meet Inc. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default SiteFooter;
