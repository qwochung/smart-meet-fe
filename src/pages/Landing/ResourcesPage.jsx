import { ArrowRight, BookOpen, FileText, PlayCircle, Search, TerminalSquare } from 'lucide-react';
import { Header, SiteFooter } from '../../components/common';

const resources = [
  {
    title: 'Implementation Guide',
    description: 'Step-by-step guide to launch Smart Meeting for your team.',
    icon: BookOpen,
    type: 'Guide',
  },
  {
    title: 'Blog',
    description: 'Stay updated with product news, tips, and industry insights.',
    icon: FileText,
    type: 'Articles',
  },
  {
    title: 'Video Tutorials',
    description: 'Watch step-by-step guides to master key features.',
    icon: PlayCircle,
    type: 'Video',
  },
  {
    title: 'API Documentation',
    description: 'Integration references for developer workflows.',
    icon: TerminalSquare,
    type: 'Developer',
  },
];

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Header variant="public" fixed />
      <section className="mx-auto max-w-7xl px-4 pb-12 pt-24 sm:px-6 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">Resources Hub</p>
        <h1 className="mt-4 text-5xl font-bold tracking-tight">Everything you need to master Nexus Meet</h1>
        <p className="mt-4 max-w-2xl text-slate-600">
          From detailed guides to advanced developer tools and community insights.
        </p>
        <div className="relative mt-6 max-w-xl">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input placeholder="Search" className="w-full rounded-xl border border-slate-300 bg-white py-2 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary-400 focus:outline-none" />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold">Explore by Category</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {resources.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="rounded-xl border border-slate-200 bg-white p-6">
                <span className="inline-flex rounded-lg bg-primary-50 p-2 text-primary-600">
                  <Icon className="h-5 w-5" />
                </span>
                <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">{item.type}</p>
                <h2 className="mt-2 text-lg font-semibold">{item.title}</h2>
                <p className="mt-2 text-sm text-slate-600">{item.description}</p>
                <button type="button" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700">
                  Open resource <ArrowRight className="h-4 w-4" />
                </button>
              </article>
            );
          })}
        </div>

        <div className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-8">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-2xl font-semibold">Popular Resources</h3>
            <button className="text-sm text-primary-600 hover:text-primary-700">View all</button>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <article className="rounded-lg border border-slate-200 bg-white p-4"><p className="font-semibold">Getting Started Guide</p><p className="mt-1 text-sm text-slate-600">Setup your first workspace in under 5 minutes.</p></article>
            <article className="rounded-lg border border-slate-200 bg-white p-4"><p className="font-semibold">Security Best Practices</p><p className="mt-1 text-sm text-slate-600">Keep your meetings private and secure.</p></article>
            <article className="rounded-lg border border-slate-200 bg-white p-4"><p className="font-semibold">Zapier Integrations</p><p className="mt-1 text-sm text-slate-600">Automate your scheduling workflow easily.</p></article>
          </div>
        </div>

        <div className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center">
          <h3 className="text-2xl font-semibold">Stay in the loop</h3>
          <p className="mt-2 text-sm text-slate-600">Subscribe for updates, feature releases, and expert tips.</p>
          <div className="mx-auto mt-4 flex max-w-md gap-2">
            <input placeholder="Email address" className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:border-primary-400 focus:outline-none" />
            <button className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold hover:bg-primary-700">Subscribe</button>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
