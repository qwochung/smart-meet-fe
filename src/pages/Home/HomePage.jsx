import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Sparkles, UsersRound, Video } from 'lucide-react';
import { Button, Header, SiteFooter } from '../../components/common';

const features = [
  { title: '4K Video Calls', description: 'Stable and clear meetings for every team size.', icon: Video },
  { title: 'AI Minutes', description: 'Automatic summaries with actionable follow-ups.', icon: Sparkles },
  { title: 'Team Collaboration', description: 'Shared context across notes, agenda, and recordings.', icon: UsersRound },
  { title: 'Enterprise Security', description: 'Secure by default with modern access controls.', icon: ShieldCheck },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Header variant="public" fixed />

      <section className="mx-auto max-w-7xl px-4 pb-16 pt-24 sm:px-6 lg:px-8 lg:pt-28">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">Smart Meeting Platform</p>
            <h1 className="mt-4 text-5xl font-bold tracking-tight sm:text-6xl">Connect instantly. Collaborate clearly.</h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-600">
              Smart Meeting helps teams run productive sessions with high-quality video, organized minutes, and clear follow-up actions.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/minutes"><Button size="lg">Go to Workspace</Button></Link>
              <Link to="/join" className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50">
                Join a Meeting
              </Link>
              <Link to="/features" className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50">
                Explore Features <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
            <img src="/landing.jpg" alt="Smart Meeting preview" className="h-[380px] w-full object-cover" />
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight">Core capabilities</h2>
            <p className="mt-3 text-sm text-slate-600">Consistent and usable workflows for meeting lifecycle management.</p>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="rounded-xl border border-slate-200 bg-white p-5">
                  <div className="inline-flex rounded-lg bg-primary-50 p-2 text-primary-600"><Icon className="h-5 w-5" /></div>
                  <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{item.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
