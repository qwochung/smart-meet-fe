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
    <div className="min-h-screen bg-[#020c1b] text-white">
      <div className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_-6%,rgba(37,99,235,0.2),transparent_54%),radial-gradient(circle_at_88%_0%,rgba(14,165,233,0.1),transparent_42%)]" />

        <div className="relative z-10">
          <Header variant="public" fixed />

          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-16 lg:pt-16 lg:pb-20">
            <div className="grid gap-8 lg:grid-cols-[1fr_1.02fr] lg:items-center">
              <div>
                <h1 className="text-5xl sm:text-6xl font-black leading-[1.02] tracking-tight max-w-xl">
                  Tailored Video
                  <br />
                  Solutions for
                  <br />
                  Every Industry
                </h1>
                <p className="mt-5 max-w-xl text-slate-300 text-base leading-relaxed">
                  Discover how Smart Meet powers seamless collaboration across education, healthcare, and global enterprise.
                  Secure, scalable, and intuitive.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:items-center">
                  <Button size="lg" className="rounded-lg text-sm px-6">
                    Book a Demo
                  </Button>
                  <Link
                    to="/pricing"
                    className="inline-flex items-center justify-center rounded-lg border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
                  >
                    View Pricing
                  </Link>
                </div>
              </div>

              <div className="rounded-xl border border-white/15 bg-[#0f2038] p-2 shadow-[0_20px_65px_rgba(0,0,0,0.38)]">
                <div className="overflow-hidden rounded-lg">
                  <img
                    src="/landing.jpg"
                    alt="Professional video collaboration"
                    className="h-[300px] w-full object-cover object-center transition-transform duration-700 hover:scale-105"
                  />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <p className="text-center text-xs tracking-[0.16em] text-primary-400 font-semibold uppercase">Industry solutions</p>
        <h2 className="mt-4 text-center text-4xl sm:text-5xl font-black leading-tight max-w-4xl mx-auto">
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
                    <h3 className="text-3xl font-black">{industry.title}</h3>
                    <p className="mt-3 max-w-3xl text-slate-300 leading-relaxed">{industry.description}</p>
                  </div>
                </div>

                <div className="mt-7 grid gap-4 lg:grid-cols-3">
                  {industry.cards.map((card) => {
                    return (
                      <div key={card.title} className="rounded-xl border border-[#27446c] bg-[#0c1d35] p-3 transition-transform duration-300 hover:-translate-y-1">
                        <div className="h-44 rounded-lg relative overflow-hidden">
                          <img
                            src={card.image}
                            alt={card.imageAlt}
                            className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,12,27,0.06)_0%,rgba(2,12,27,0.44)_100%)]" />
                        </div>
                        <h4 className="mt-4 text-lg font-bold">{card.title}</h4>
                        <p className="mt-2 text-sm text-slate-300 leading-relaxed">{card.description}</p>
                      </div>
                    );
                  })}

                  <div className="rounded-xl border border-[#27446c] bg-[#0b2342] p-6 transition-transform duration-300 hover:-translate-y-1">
                    <Quote className="h-7 w-7 text-primary-400" />
                    <p className="mt-5 text-sm leading-relaxed text-slate-200">&quot;{industry.quote.text}&quot;</p>
                    <div className="mt-7 flex items-center gap-3">
                      <span className="h-9 w-9 rounded-full bg-slate-500/40" />
                      <div>
                        <p className="text-sm font-semibold text-white">{industry.quote.author}</p>
                        <p className="text-xs text-slate-300">{industry.quote.role}</p>
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
          <div className="rounded-3xl border border-primary-300/35 bg-[linear-gradient(135deg,#2e77eb,#2462cc)] px-6 py-14 sm:px-12 text-center">
            <h2 className="text-4xl sm:text-5xl font-black leading-tight">Ready to transform your organization?</h2>
            <p className="mt-4 text-blue-100 max-w-2xl mx-auto">
              Join over 50,000 companies that trust Nexus Meet for their mission-critical communications.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button size="lg" variant="none" className="rounded-lg min-w-44 bg-white text-primary-700 hover:bg-blue-100 focus:ring-white font-semibold">
                Start Free Trial
              </Button>
              <Button size="lg" variant="none" className="rounded-lg min-w-44 border border-white/50 bg-white/10 text-white hover:bg-white/20 focus:ring-white">
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