import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { Button, Header, SiteFooter } from '../../components/common';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    description: 'Perfect for individuals and small quick syncs.',
    features: ['Up to 40 min meetings', '100 participants', 'Basic whiteboarding', 'Group & 1:1 chat'],
  },
  {
    name: 'Pro',
    price: '$15',
    period: '/user/month',
    description: 'Empower your growing team with advanced tools.',
    features: ['Unlimited meeting duration', '300 participants', 'Cloud recording (5GB)', 'AI meeting summaries', 'Custom branding'],
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: '$49',
    period: '/user/month',
    description: 'Security and control for large organizations.',
    features: ['Unlimited participants', 'SSO/SAML', 'Dedicated CSM', 'Advanced analytics'],
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Header variant="public" fixed />
      <section className="mx-auto max-w-7xl px-4 pb-12 pt-24 sm:px-6 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">Pricing</p>
        <h1 className="mt-4 text-5xl font-bold tracking-tight">Plans for every team size</h1>
        <p className="mt-4 max-w-2xl text-slate-600">
          Whether you are a solo creator or a global enterprise, choose the right plan for seamless collaboration.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-5 md:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`rounded-2xl border p-6 ${plan.highlighted ? 'border-primary-300 bg-primary-50/40' : 'border-slate-200 bg-white'}`}
            >
              {plan.highlighted && (
                <span className="mb-3 inline-flex rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold text-primary-700">
                  Most Popular
                </span>
              )}
              <h2 className="text-xl font-semibold">{plan.name}</h2>
              <div className="mt-3 flex items-end gap-1">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-sm text-slate-500">{plan.period}</span>
              </div>
              <p className="mt-3 text-sm text-slate-600">{plan.description}</p>
              <ul className="mt-5 space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-slate-700">
                    <Check className="h-4 w-4 text-primary-600" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button className="mt-6 w-full">{plan.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}</Button>
            </article>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-8">
          <h3 className="text-2xl font-semibold">Compare detailed features</h3>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-600">
                  <th className="px-3 py-2">Feature</th>
                  <th className="px-3 py-2">Free</th>
                  <th className="px-3 py-2">Pro</th>
                  <th className="px-3 py-2">Enterprise</th>
                </tr>
              </thead>
              <tbody className="text-slate-700">
                <tr className="border-b border-slate-200"><td className="px-3 py-2">Meeting Duration</td><td className="px-3 py-2">40 mins</td><td className="px-3 py-2">Unlimited</td><td className="px-3 py-2">Unlimited</td></tr>
                <tr className="border-b border-slate-200"><td className="px-3 py-2">Participants</td><td className="px-3 py-2">100</td><td className="px-3 py-2">300</td><td className="px-3 py-2">Unlimited</td></tr>
                <tr><td className="px-3 py-2">AI Summaries</td><td className="px-3 py-2">-</td><td className="px-3 py-2">Yes</td><td className="px-3 py-2">Yes</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-8">
          <h3 className="text-2xl font-semibold">Frequently Asked Questions</h3>
          <div className="mt-4 space-y-4 text-sm text-slate-600">
            <div><p className="font-semibold text-slate-900">Can I switch plans later?</p><p>Yes. You can upgrade or downgrade at any time from account settings.</p></div>
            <div><p className="font-semibold text-slate-900">Do you offer discounts for education?</p><p>Yes, special pricing is available for schools and non-profits.</p></div>
            <div><p className="font-semibold text-slate-900">What security measures do you provide?</p><p>AES-256 encryption, role-based controls, and SSO on enterprise tier.</p></div>
          </div>
          <Link to="/resources" className="mt-5 inline-block">
            <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-100">Read Documentation</Button>
          </Link>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
