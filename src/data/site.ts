export const SITE_NAME = 'Care Practice Studio';
export const SITE_URL = 'https://carepracticestudio.com';
export const CONTACT_EMAIL = 'help@carepracticestudio.com';

export const BOOKING_URL = 'https://calendly.com/tumultywebservices/new-meeting';

// UTM tags make bookings that came from the site countable in Calendly.
export const BOOKING_UTM = {
  utm_source: 'carepracticestudio.com',
  utm_medium: 'website',
  utm_campaign: 'contact-page',
};

export function bookingHref(extra: Record<string, string> = {}): string {
  const url = new URL(BOOKING_URL);
  for (const [k, v] of Object.entries({ ...BOOKING_UTM, ...extra })) url.searchParams.set(k, v);
  return url.toString();
}

export type PageKey = 'home' | 'help' | 'execution' | 'contact';

export const NAV_LINKS: { key: PageKey; href: string; label: string }[] = [
  { key: 'home', href: '/', label: 'Home' },
  { key: 'help', href: '/help', label: 'Who I help' },
  { key: 'execution', href: '/execution', label: 'What I do' },
];

export const CONTACT_LINK = { key: 'contact' as PageKey, href: '/contact', label: 'Contact' };

// The four routes that make up the site; drives sitemap.xml.
export const ROUTES = ['/', '/help', '/execution', '/contact'];

export const AUDIENCE = [
  'Behavioral health',
  'Mental health',
  'Wellness practices',
  'Solo practitioners',
  'Small nonprofits',
  'Community clinics',
];

export const STEPS = [
  {
    label: 'Understand',
    title: 'We listen.',
    short: 'What’s your real problem, and what do you hope to achieve?',
    long: 'What’s your real problem, and what do you hope to achieve?',
  },
  {
    label: 'Plan',
    title: 'We plan.',
    short: 'A clear, actionable roadmap for your product.',
    long: 'A clear, actionable roadmap for your product.',
  },
  {
    label: 'Build',
    title: 'We build.',
    short: 'Coordinating talented engineers, designers, and frontier AI models to bring your solution to life.',
    long: 'We coordinate between talented engineers, designers, and frontier AI models to bring your solution to life.',
  },
  {
    label: 'Check in',
    title: 'We check in.',
    short: 'After launch, we review how you’re using it — and help you decide what to do next.',
    long: 'After launch, we review how you’re using it — and help you decide what to do next.',
  },
];
