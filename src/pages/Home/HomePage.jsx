import { Link } from 'react-router-dom';
import { ArrowRight, Circle, MonitorPlay, ShieldCheck, Sparkles, UsersRound, Video, Mic } from 'lucide-react';
import { Button, Header, SiteFooter } from '../../components/common';

const trustedBrands = [
  {
    image: '/google.png',
  },
  {
    image: '/facebook.png',
  },
  {
    image: '/microsoft.png',
  },
  {
    image: '/slack.png',
  },
];

const topFeatures = [
  {
    title: '4K Ultra HD Video',
    description:
      'Crystal clear quality that makes every face feel closer, even across continents.',
    icon: Video,
  },
  {
    title: 'AI Meeting Minutes',
    description:
      'Automatic highlights, searchable transcripts, and concise action summaries.',
    icon: Sparkles,
  },
  {
    title: 'Real-time Collaboration',
    description: 'Collaborate on docs, whiteboards, and live notes during any call.',
    icon: UsersRound,
  },
  {
    title: 'Secure Encryption',
    description: 'Enterprise-grade end-to-end security across your meeting lifecycle.',
    icon: ShieldCheck,
  },
];

const collaborationCards = [
  {
    title: 'HD Video',
    description:
      'Experience life-like clarity with 4K support and adaptive bandwidth technology for smooth calls.',
    icon: Video,
  },
  {
    title: 'Secure Encryption',
    description:
      'Every meeting is protected with strict compliance and private-by-default architecture.',
    icon: ShieldCheck,
  },
  {
    title: 'Screen Sharing',
    description:
      'Present code reviews, product demos, and collaborative edits with low-latency sharing.',
    icon: MonitorPlay,
  },
];

const HomePage = () => {
  return (
    <div className="min-h-screen bg-[#020916] text-white">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(37,99,235,0.24),transparent_55%),radial-gradient(circle_at_90%_20%,rgba(14,165,233,0.16),transparent_48%)]" />
        <div className="absolute inset-y-0 right-0 w-1/2 bg-[linear-gradient(120deg,rgba(37,99,235,0.04),rgba(15,23,42,0.08))]" />

        <div className="relative z-10">
          <Header variant="public" />

          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20 lg:pt-16 lg:pb-28">
            <div className="grid gap-12 lg:grid-cols-[1fr_0.95fr] lg:items-center">
              <div className="animate-[fadeIn_550ms_ease-out]">
                <span className="inline-flex items-center gap-2 rounded-full bg-blue-600/20 px-3 py-1 text-xs font-semibold tracking-wide text-blue-200 border border-blue-500/30">
                  <Circle className="w-2 h-2 fill-current" />
                  NOW WITH AI SUPPORT
                </span>

                <h1 className="mt-6 text-5xl sm:text-6xl font-black leading-[1.02] tracking-tight">
                  Connect Instantly.
                  <br />
                  <span className="text-primary-500">Collaborate</span>
                  <br />
                  Seamlessly.
                </h1>

                <p className="mt-6 max-w-xl text-base sm:text-lg text-slate-300 leading-relaxed">
                  Experience crystal-clear HD video conferencing with enterprise-grade security for teams of all sizes.
                  Built for the modern workforce.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:items-center">
                  <Link to="/room/demo-room">
                    <Button className="w-full sm:w-auto min-w-48 rounded-xl" size="lg" icon={Video}>
                      Start a meeting
                    </Button>
                  </Link>

                  <div className="flex items-center rounded-xl border border-white/10 bg-slate-900/80 p-1 w-full sm:max-w-xs">
                    <input
                      placeholder="Enter a code or link"
                      className="flex-1 bg-transparent border-none text-sm text-slate-200 placeholder:text-slate-500 focus:ring-0"
                    />
                    <button className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-700 transition-colors">
                      Join
                    </button>
                  </div>
                </div>

                <div className="mt-10">
                  <p className="text-xs tracking-[0.16em] text-slate-500 uppercase">
                    Trusted by innovative teams worldwide
                  </p>
                  <div className="mt-4 flex flex-wrap">
                    {trustedBrands.map((brand) => {
                      return (
                        <span
                          key={brand.name}
                          className="inline-flex items-center rounded-lg  px-2 py-2"
                        >
                          <span className="grid h-6 w-6 place-items-center rounded-md bg-white p-1">
                            <img src={brand.image} alt={brand.name} className="h-full w-full object-contain" />
                          </span>
                          <span className="text-xs font-semibold text-slate-300">{brand.name}</span>
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="animate-[fadeIn_650ms_ease-out]">
                <div className="rounded-2xl border border-white/15 bg-slate-900/50 shadow-[0_24px_80px_rgba(0,0,0,0.45)] overflow-hidden">
                  <div className="h-[360px] sm:h-[420px] relative">
                    <img
                      src="/landing.jpg"
                      alt="Meeting workspace"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex items-center justify-between px-5 py-4 bg-slate-100 text-slate-900">
                    <div className="flex -space-x-2">
                      {[0, 1, 2].map((item) => (
                        <img
                          key={item}
                          src="https://tse2.mm.bing.net/th/id/OIP.0K5kKLRcFURkLLLk7OzSOwAAAA?rs=1&pid=ImgDetMain&o=7&rm=3"
                          alt="Participant preview"
                          className="w-6 h-6 rounded-full border-2 border-white object-cover"
                        />
                      ))}
                      <span className="w-6 h-6 rounded-full border-2 border-white bg-primary-500 text-[10px] text-white grid place-items-center">
                        +12
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="w-7 h-7 rounded-full bg-rose-500 text-white grid place-items-center">
                        <Mic className="w-3.5 h-3.5" />
                      </button>
                      <button className="w-7 h-7 rounded-full bg-slate-900 text-white grid place-items-center">
                        <Video className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 lg:pb-24">
        <div className="max-w-3xl">
          <span className="inline-flex rounded-full bg-blue-600/20 text-blue-200 border border-blue-500/30 px-3 py-1 text-xs tracking-wide font-semibold uppercase">
            Platform Overview
          </span>
          <h2 className="mt-5 text-4xl sm:text-5xl font-black leading-tight">
            Experience the future of meetings
          </h2>
          <p className="mt-5 text-slate-300 leading-relaxed">
            Powerful tools designed to make every conversation more productive, secure, and collaborative.
            From AI transcription to 4K streaming, Smart Meet redefines how teams connect.
          </p>
        </div>

        <div className="mt-12">
          <h3 className="text-3xl font-black">Core Capabilities</h3>
          <p className="mt-3 text-slate-400 max-w-2xl">
            Our platform is built on enterprise-grade infrastructure to ensure your team has the best tools for modern collaboration.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {topFeatures.map((feature) => {
              const FeatureIcon = feature.icon;

              return (
                <article
                  key={feature.title}
                  className="rounded-2xl border border-[#1b3355] bg-[#071427] p-6 transition-transform duration-300 hover:-translate-y-1"
                >
                  <div className="w-11 h-11 rounded-xl bg-primary-500/15 text-primary-300 grid place-items-center">
                    <FeatureIcon className="w-5 h-5" />
                  </div>
                  <h4 className="mt-5 text-xl font-bold">{feature.title}</h4>
                  <p className="mt-3 text-sm text-slate-400 leading-relaxed">{feature.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#061329] border-y border-white/5 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl sm:text-5xl font-black">Designed for Modern Collaboration</h2>
            <p className="mt-4 text-slate-300">
              Everything you need for high-performance team meetings in one secure, reliable platform.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {collaborationCards.map((card) => {
              const CardIcon = card.icon;

              return (
                <article key={card.title} className="rounded-2xl border border-[#2a3d59] bg-[#10213a] p-6">
                  <div className="w-11 h-11 rounded-xl bg-primary-500/15 text-primary-300 grid place-items-center">
                    <CardIcon className="w-5 h-5" />
                  </div>
                  <h3 className="mt-5 text-2xl font-extrabold">{card.title}</h3>
                  <p className="mt-3 text-slate-300 text-sm leading-relaxed">{card.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#0c2344]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-black">Ready to transform your workflow?</h2>
          <p className="mt-4 text-slate-200">Join over 10,000+ teams who have upgraded their meeting experience.</p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/auth/register">
              <Button size="lg" className="rounded-xl min-w-44">Start Free Trial</Button>
            </Link>
            <Link to="/features" className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors">
              Contact Sales
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
};

export default HomePage;
