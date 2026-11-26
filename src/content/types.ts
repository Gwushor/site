// Форма текстов сайта. Правки контента — в ru.ts / en.ts, вёрстка их только читает.
export type Lang = 'ru' | 'en';

export interface NavItem {
  label: string;
  path: string;
}

export interface Teaser {
  kicker: string;
  title: string;
  line: string;
  path: string;
  cta: string;
}

export interface ProjectPage {
  kicker: string;
  title: string;
  tagline: string;
  task: { title: string; paragraphs: string[] };
  architecture: {
    title: string;
    intro: string;
    flowLabel: string;
    flow: string[];
    layers: { name: string; text: string }[];
  };
  stack: { title: string; items: string[] };
  proven: { title: string; items: string[] };
  status: string;
}

export interface CvRole {
  title: string;
  company: string;
  place: string;
  period: string;
  blurb: string;
  stack: string[];
  points: string[];
}

export interface CvPage {
  kicker: string;
  given: string;
  family: string;
  role: string;
  contacts: { label: string; href: string }[];
  navAria: string;
  sectionNav: { id: string; label: string }[];
  summary: { title: string; leads: string[] };
  numbers: { title: string; items: { value: string; unit: string; label: string; source: string }[] };
  path: { title: string };
  experience: { title: string; roles: CvRole[] };
  review: { title: string; kicker: string; paragraphs: string[] };
  openSource: { title: string; repos: { name: string; href?: string; desc: string }[] };
  skills: { title: string; groups: { label: string; items: string[] }[] };
  education: {
    title: string;
    educationTitle: string;
    entries: { school: string; degree: string; year: string }[];
    languagesTitle: string;
    languages: { name: string; level: string }[];
  };
  finePrint: { title: string; items: string[] };
  tools: { night: string; print: string; railNote: string };
  printTitle: string;
}

export interface SiteContent {
  lang: Lang;
  meta: {
    title: string;
    owner: string;
    lead: string;
    footer: string;
    skip: string;
    navAria: string;
    switchLabel: string;
    switchAria: string;
    nav: NavItem[];
  };
  home: {
    kicker: string;
    h1given: string;
    h1family: string;
    lead: string;
    intro: string;
    status: string;
    statusNote: string;
    chips: string[];
    projectsTitle: string;
    projects: Teaser[];
    cv: Teaser;
  };
  about: {
    kicker: string;
    title: string;
    paragraphs: string[];
    facts: [string, string][];
  };
  alpha: ProjectPage;
  hq: ProjectPage;
  cv: CvPage;
}
