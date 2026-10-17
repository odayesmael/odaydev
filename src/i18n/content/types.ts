/** Translatable text for data-driven content (projects, case studies, ShuStyle). */
export type CaseStudyText = {
  tagline: string;
  kind: string;
  summary: string;
  meta: { label: string; value: string }[];
  stats?: string[];
  challenge: { heading: string; body: string };
  features: { title: string; body: string }[];
  gallery: string[];
  deliverables: string[];
};

export type ShustyleText = {
  tagline: string;
  summary: string;
  meta: { label: string; value: string }[];
  screens: string[];
  steps: { title: string; body: string }[];
  features: { title: string; body: string }[];
  plans: { note: string; items: string[] }[];
  website: string[];
  deliverables: string[];
};

export type LocalizedContent = {
  /** slug -> card description */
  projects: Record<string, string>;
  caseStudies: Record<string, CaseStudyText>;
  shustyle: ShustyleText;
};
