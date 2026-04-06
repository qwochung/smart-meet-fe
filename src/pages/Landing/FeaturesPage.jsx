import { Link } from 'react-router-dom';
import { ArrowRight, BrainCircuit, Layers, MonitorPlay, ShieldCheck, Sparkles, TimerReset, UsersRound, Video } from 'lucide-react';
import { Button, Header, SiteFooter } from '../../components/common';

const featureGroups = [
  {
    title: 'Studio-quality Calls',
    summary: 'Run smooth meetings with adaptive bitrate and AI denoise tuned for hybrid teams.',
    icon: Video,
  },
  {
    title: 'AI-Powered Notes',
    summary: 'Auto-capture decisions, owners, and action items in every room session.',
    icon: Sparkles,
  },
  {
    title: 'Collaborative Workspace',
    summary: 'Use live whiteboards and shared canvases to build ideas during calls.',
    icon: UsersRound,
  },
  {
    title: 'Enterprise Security',
    summary: 'Protect meetings with encrypted streams, secure rooms, and policy controls.',
    icon: ShieldCheck,
  },
  {
    title: 'Workflow Integrations',
    summary: 'Connect recordings and highlights with CRM, project tools, and docs.',
    icon: Layers,
  },
  {
    title: 'Automation Engine',
    summary: 'Trigger reminders, summaries, and follow-ups across your collaboration stack.',
    icon: BrainCircuit,
  },
];

const FeaturesPage = () => {
  return (
    <div className="min-h-screen bg-[#020916] text-white">
      <div className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(37,99,235,0.24),transparent_55%),radial-gradient(circle_at_90%_20%,rgba(14,165,233,0.14),transparent_45%)]" />
        <div className="relative z-10">
          <Header variant="public" fixed />
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
            <span className="inline-flex rounded-full bg-blue-600/20 text-blue-200 border border-blue-500/30 px-3 py-1 text-xs tracking-wide font-semibold uppercase">
              Product Features
            </span>
            <h1 className="mt-5 text-5xl sm:text-6xl font-black leading-tight max-w-3xl">
              Everything your team needs for high-impact collaboration.
            </h1>
            <p className="mt-6 text-slate-300 text-lg max-w-2xl">
              Explore the feature set that powers strategic meetings, daily standups, and global client calls.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link to="/auth/register">
                <Button size="lg" className="rounded-xl">Start Free Trial</Button>
              </Link>
              <Link to="/" className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors">
                Back to Home
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </section>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featureGroups.map((item) => {
            const ItemIcon = item.icon;

            return (
              <article key={item.title} className="rounded-2xl border border-[#1f3658] bg-[#08172c] p-6">
                <div className="w-12 h-12 rounded-xl bg-primary-500/15 text-primary-300 grid place-items-center">
                  <ItemIcon className="w-6 h-6" />
                </div>
                <h2 className="mt-5 text-2xl font-black">{item.title}</h2>
                <p className="mt-3 text-slate-300 text-sm leading-relaxed">{item.summary}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="bg-[#061329] border-y border-white/5 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-5 md:grid-cols-3">
          <article className="rounded-2xl border border-[#2a3d59] bg-[#10213a] p-6">
            <TimerReset className="w-7 h-7 text-primary-300" />
            <h3 className="mt-4 text-2xl font-black">Fast Onboarding</h3>
            <p className="mt-3 text-slate-300 text-sm">Get your team meeting-ready in less than one day with guided setup flows.</p>
          </article>
          <article className="rounded-2xl border border-[#2a3d59] bg-[#10213a] p-6">
            <MonitorPlay className="w-7 h-7 text-primary-300" />
            <h3 className="mt-4 text-2xl font-black">Reliable Broadcast</h3>
            <p className="mt-3 text-slate-300 text-sm">Share demos and livestream sessions without lag spikes or quality drops.</p>
          </article>
          <article className="rounded-2xl border border-[#2a3d59] bg-[#10213a] p-6">
            <ShieldCheck className="w-7 h-7 text-primary-300" />
            <h3 className="mt-4 text-2xl font-black">Compliance Ready</h3>
            <p className="mt-3 text-slate-300 text-sm">Match enterprise standards with role-based controls and audit visibility.</p>
          </article>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
};

export default FeaturesPage;
