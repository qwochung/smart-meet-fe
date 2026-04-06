import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Header, SiteFooter } from '../../components/common';

const LandingPlaceholderPage = ({ title, description }) => {
  return (
    <div className="min-h-screen bg-[#020916] text-white">
      <div className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(37,99,235,0.22),transparent_58%),radial-gradient(circle_at_90%_20%,rgba(14,165,233,0.12),transparent_46%)]" />
        <div className="relative z-10">
          <Header variant="public" fixed />
          <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 text-center">
            <span className="inline-flex rounded-full bg-blue-600/20 text-blue-200 border border-blue-500/30 px-3 py-1 text-xs tracking-wide font-semibold uppercase">
              Coming Soon
            </span>
            <h1 className="mt-5 text-5xl sm:text-6xl font-black">{title}</h1>
            <p className="mt-6 text-slate-300 text-lg max-w-2xl mx-auto">{description}</p>
            <Link
              to="/features"
              className="mt-9 inline-flex items-center gap-2 rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
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
