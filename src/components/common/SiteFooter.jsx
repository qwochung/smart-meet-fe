import { Link } from 'react-router-dom';

const SiteFooter = () => {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-11">
        <div className="grid gap-10 md:grid-cols-[1.15fr_1fr_1fr_1fr]">
          <div>
            <Link to="/" className="inline-flex items-center">
              <img src="/logo.png" alt="Nexus Meet" className="h-12 w-auto object-contain" />
            </Link>
            <p className="mt-4 max-w-xs text-sm text-slate-600">
              Connecting the world through seamless, secure, and human-centric video collaboration.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900">Product</h4>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li><Link to="/features" className="hover:text-white transition-colors">Features</Link></li>
              <li><Link to="/features" className="hover:text-white transition-colors">Security</Link></li>
              <li><Link to="/resources" className="hover:text-white transition-colors">Integrations</Link></li>
              <li><Link to="/resources" className="hover:text-white transition-colors">Download</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900">Solutions</h4>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li><Link to="/solutions#education" className="hover:text-white transition-colors">Education</Link></li>
              <li><Link to="/solutions#enterprise" className="hover:text-white transition-colors">Enterprise</Link></li>
              <li><Link to="/solutions#healthcare" className="hover:text-white transition-colors">Healthcare</Link></li>
              <li><Link to="/solutions#remote" className="hover:text-white transition-colors">Remote Teams</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900">Company</h4>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li><Link to="/resources" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/resources" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link to="/resources" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link to="/resources" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-9 flex flex-col gap-3 border-t border-slate-200 pt-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Nexus Meet Inc. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/pricing" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/pricing" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/resources" className="hover:text-white transition-colors">Cookie Settings</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
