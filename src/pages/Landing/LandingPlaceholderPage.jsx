import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Header, SiteFooter } from '../../components/common';

const LandingPlaceholderPage = ({ title, description }) => {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="relative overflow-hidden border-b border-slate-200">
        <div className="relative z-10">
          <Header variant="public" fixed />
          <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 text-center">
            <span className="inline-flex rounded-full bg-primary-100 text-primary-700 border border-primary-200 px-3 py-1 text-xs tracking-wide font-semibold uppercase">
              Coming Soon
            </span>
            <h1 className="mt-5 text-5xl sm:text-6xl font-black">{title}</h1>
            <p className="mt-6 text-slate-600 text-lg max-w-2xl mx-auto">{description}</p>
            <Link
              to="/features"
              className="mt-9 inline-flex items-center gap-2 rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Explore Features
              <ArrowRight className="w-4 h-4" />
            </Link>
          </section>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
};

export default LandingPlaceholderPage;
