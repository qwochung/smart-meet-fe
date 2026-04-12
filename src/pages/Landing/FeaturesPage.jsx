import { Link } from 'react-router-dom';
import { ArrowRight, Layers, MonitorPlay, ShieldCheck, Sparkles, UsersRound, Video } from 'lucide-react';
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
];

const FeaturesPage = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Header variant="public" fixed />
      <section className="mx-auto max-w-7xl px-4 pb-12 pt-24 sm:px-6 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">Product Features</p>
        <h1 className="mt-4 max-w-3xl text-5xl font-bold tracking-tight">
          Everything your team needs for high-impact collaboration.
        </h1>
        <p className="mt-5 max-w-2xl text-slate-600">
          Explore key capabilities that keep meetings focused, searchable, and actionable.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link to="/auth/register"><Button size="lg">Start Free Trial</Button></Link>
          <Link to="/" className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50">
            Back to Home <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featureGroups.map((item) => {
            const ItemIcon = item.icon;

            return (
              <article key={item.title} className="rounded-xl border border-slate-200 bg-white p-6">
                <div className="grid h-12 w-12 place-items-center rounded-lg bg-primary-50 text-primary-600">
                  <ItemIcon className="w-6 h-6" />
                </div>
                <h2 className="mt-5 text-xl font-semibold">{item.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.summary}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50 py-12">
        <div className="mx-auto grid max-w-7xl gap-5 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
          <article className="rounded-xl border border-slate-200 bg-white p-6">
            <MonitorPlay className="h-7 w-7 text-primary-600" />
            <h3 className="mt-4 text-lg font-semibold">Reliable Broadcast</h3>
            <p className="mt-2 text-sm text-slate-600">Share demos and livestream sessions without lag spikes or quality drops.</p>
          </article>
          <article className="rounded-xl border border-slate-200 bg-white p-6">
            <ShieldCheck className="h-7 w-7 text-primary-600" />
            <h3 className="mt-4 text-lg font-semibold">Compliance Ready</h3>
            <p className="mt-2 text-sm text-slate-600">Match enterprise standards with role-based controls and audit visibility.</p>
          </article>
          <article className="rounded-xl border border-slate-200 bg-white p-6">
            <Sparkles className="h-7 w-7 text-primary-600" />
            <h3 className="mt-4 text-lg font-semibold">AI Productivity</h3>
            <p className="mt-2 text-sm text-slate-600">Auto summaries and follow-up tasks after each meeting.</p>
          </article>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
};

export default FeaturesPage;
