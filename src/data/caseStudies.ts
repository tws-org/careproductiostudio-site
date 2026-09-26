// Case studies shown on /help. To add one, append an object to this array — no markup changes needed.
export interface CaseStudy {
  id: string;
  name: string;
  tag: string;
  org: string;
  summary: string;
  before?: string;
  after?: string;
  quote?: { text: string; attribution: string };
  /** Path under /public (e.g. '/case-studies/jess.png'). Without it, a placeholder box is shown. */
  image?: { src: string; alt: string };
}

export const caseStudies: CaseStudy[] = [
  {
    id: 'jess-rebelo',
    name: 'Jess Rebelo',
    tag: 'Behavioral health provider',
    org: 'Unleashed Potential · jessrebelo.com',
    summary:
      'Jess Rebelo is a behavioral health provider who needed a tool to streamline her workflow. Together, we built something that actually works — and now she’s using it every day.',
    before:
      'Scheduling, intake notes, and client follow-ups were spread across email, a spreadsheet, and a paper notebook.',
    after:
      'One simple tool keeps intake, sessions, and follow-ups in one place — and she opens it every workday.',
    quote: {
      text: '“It fits the way I actually work. Less time chasing admin, more time with my clients.”',
      attribution: '— Jess Rebelo, Unleashed Potential',
    },
  },
];

// Shows the "In progress" slide from the design until a second real case study exists.
export const showUpcomingSlide = caseStudies.length < 2;
