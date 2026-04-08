import { Link } from 'react-router-dom';
import { Building2, GraduationCap, HeartPulse, Quote, UsersRound } from 'lucide-react';
import { Button, Header, SiteFooter } from '../../components/common';

const industrySolutions = [
  {
    id: 'education',
    title: 'Education',
    description: 'Empower students and educators with interactive virtual classrooms, secure testing environments, and deep LMS integration.',
    icon: GraduationCap,
    cards: [
      {
        title: 'Virtual Classrooms',
        description: 'Engage students with breakout rooms, real-time polls, and interactive whiteboards.',
        image:
          'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
        imageAlt: 'Teacher hosting an online class with students',
      },
      {
        title: 'LMS Integration',
        description: 'Seamlessly sync attendance and grades with Canvas, Moodle, and Blackboard.',
        image:
          'https://images.unsplash.com/photo-1588702547919-26089e690ecc?auto=format&fit=crop&w=1200&q=80',
        imageAlt: 'Learning management dashboard on a monitor',
      },
    ],
    quote: {
      text: 'Nexus Meet transformed our distance learning program, increasing student engagement by 40%.',
      author: 'Dr. Sarah Chen',
      role: 'Dean, Global University',
    },
  },
  {
    id: 'enterprise',
    title: 'Enterprise',
    description: 'Scale your global communications with bank-grade security, administrative controls, and guaranteed 99.99% uptime.',
    icon: Building2,
    cards: [
      {
        title: 'End-to-End Encryption',
        description: 'AES-256 encryption ensures that your high-level executive meetings remain confidential.',
        image:
          'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
        imageAlt: 'Secure enterprise communication dashboard',
      },
      {
        title: 'Usage Analytics',
        description: 'Centralized dashboards for QoS monitoring, license management, and adoption metrics.',
        image:
          'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
        imageAlt: 'Analytics charts on laptop screen',
      },
    ],
    quote: {
      text: 'The most reliable platform we have used for over 20,000+ employee calls each month.',
      author: 'Marcus Thorne',
      role: 'CTO, Vertex Global',
    },
  },
  {
    id: 'healthcare',
    title: 'Healthcare',
    description: 'HIPAA-compliant telehealth solutions that prioritize patient privacy and physician ease-of-use.',
    icon: HeartPulse,
    cards: [
      {
        title: 'Telehealth Appointments',
        description: 'High-definition video for accurate remote diagnosis and patient follow-ups.',
        image:
          'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
        imageAlt: 'Doctor in telehealth consultation with patient',
      },
      {
        title: 'EHR Integration',
        description: 'Direct connection with Epic and Cerner for streamlined medical record updates.',
        image:
          'https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&w=1200&q=80',
        imageAlt: 'Doctor using electronic health record system',
      },
    ],
    quote: {
      text: 'Patient trust is our top priority. Nexus Meet gives us the security and quality we need.',
      author: 'Dr. Elena Rodriguez',
      role: 'Chief Medical Officer, HealthPoint',
    },
  },
  {
    id: 'remote',
    title: 'Remote Teams',
    description: 'Foster a culture of collaboration across time zones with tools designed for asynchronous and real-time teamwork.',
    icon: UsersRound,
    cards: [
      {
        title: 'Always-On Huddles',
        description: 'Virtual office spaces where team members can hop in and out for quick syncs.',
        image:
          'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80',
        imageAlt: 'Remote team workspace with laptop and desk setup',
      },
      {
        title: 'Collaborative Notes',
        description: 'Shared meeting agendas and notes that sync instantly to Slack and Notion.',
        image:
          'https://images.unsplash.com/photo-1542626991-cbc4e32524cc?auto=format&fit=crop&w=1200&q=80',
        imageAlt: 'Sticky notes for collaborative planning',
      },
    ],
    quote: {
      text: 'It finally feels like we are in the same room, even though we are spread across 12 countries.',
      author: 'James Wilson',
      role: 'Head of People, Nomad Creative',
    },
  },
];

const SolutionsPage = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Header variant="public" fixed />
      <section className="mx-auto max-w-7xl px-4 pb-12 pt-24 sm:px-6 lg:px-8">
        <div className="grid items-center gap-8 lg:grid-cols-[1fr_1fr]">
          <div>
            <h1 className="max-w-xl text-5xl font-bold tracking-tight">
              Tailored video solutions for every industry
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600">
              Discover how Smart Meet powers seamless collaboration across education, healthcare, and global enterprise.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button size="lg">Book a Demo</Button>
              <Link
                to="/pricing"
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                View Pricing
              </Link>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-2">
            <img src="/landing.jpg" alt="Professional video collaboration" className="h-[300px] w-full rounded-lg object-cover object-center" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.16em] text-primary-600">Industry solutions</p>
        <h2 className="mx-auto mt-4 max-w-4xl text-center text-4xl font-bold leading-tight">
          Empowering your team with specialized tools
        </h2>

        <div className="mt-14 space-y-14 lg:space-y-16">
          {industrySolutions.map((industry) => {
            const IndustryIcon = industry.icon;

            return (
              <article key={industry.id} id={industry.id}>
                <div className="flex items-start gap-3">
                  <span className="mt-1 inline-grid h-9 w-9 place-items-center rounded-full border border-primary-500/40 bg-primary-500/15 text-primary-300">
                    <IndustryIcon className="h-4.5 w-4.5" />
                  </span>
                  <div>
                    <h3 className="text-3xl font-bold">{industry.title}</h3>
                    <p className="mt-3 max-w-3xl leading-relaxed text-slate-600">{industry.description}</p>
                  </div>
                </div>

                <div className="mt-7 grid gap-4 lg:grid-cols-3">
                  {industry.cards.map((card) => {
                    return (
                      <div key={card.title} className="rounded-xl border border-slate-200 bg-white p-3 transition-transform duration-300 hover:-translate-y-1">
                        <div className="h-44 rounded-lg relative overflow-hidden">
                          <img
                            src={card.image}
                            alt={card.imageAlt}
                            className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.04)_0%,rgba(15,23,42,0.34)_100%)]" />
                        </div>
                        <h4 className="mt-4 text-lg font-semibold">{card.title}</h4>
                        <p className="mt-2 text-sm leading-relaxed text-slate-600">{card.description}</p>
                      </div>
                    );
                  })}

                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 transition-transform duration-300 hover:-translate-y-1">
                    <Quote className="h-7 w-7 text-primary-500" />
                    <p className="mt-5 text-sm leading-relaxed text-slate-700">&quot;{industry.quote.text}&quot;</p>
                    <div className="mt-7 flex items-center gap-3">
                      <span className="h-9 w-9 rounded-full bg-slate-500/40" />
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{industry.quote.author}</p>
                        <p className="text-xs text-slate-500">{industry.quote.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="pb-16 pt-4">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 px-6 py-14 text-center sm:px-12">
            <h2 className="text-4xl font-bold leading-tight">Ready to transform your organization?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-600">
              Join over 50,000 companies that trust Nexus Meet for their mission-critical communications.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button size="lg" className="min-w-44 rounded-lg">
                Start Free Trial
              </Button>
              <Button size="lg" variant="outline" className="min-w-44 rounded-lg border-slate-300 text-slate-700 hover:bg-slate-100">
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
};

export default SolutionsPage;