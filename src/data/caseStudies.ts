/**
 * Content for the data-driven case studies at /work/$slug.
 * (ShuStyle has its own hand-built page at /work/shustyle.)
 * Images live in /public/work: <slug>-desktop/-mobile.webp and <slug>-page-N-desktop.webp.
 */
export type CaseStudy = {
  slug: string;
  name: string;
  /** Second half of the H1, set in the accent style */
  tagline: string;
  /** Short label for the eyebrow, e.g. "B2B platform" */
  kind: string;
  summary: string;
  url: string;
  domain: string;
  meta: { label: string; value: string }[];
  stats?: { value: string; label: string }[];
  challenge: { heading: string; body: string };
  features: { title: string; body: string }[];
  gallery: { label: string }[];
  deliverables: string[];
  stack: string[];
  /**
   * Optional before/after slider: a screenshot of the previous site
   * (e.g. from the Wayback Machine), compared with /work/<slug>-desktop.webp.
   */
  before?: { src: string; label: string };
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "solechem-europe",
    name: "SoleChem Europe",
    tagline: "a chemical catalogue built to win quotes.",
    kind: "B2B platform · Chemicals",
    summary:
      "A multilingual B2B platform for SoleChem S.R.L., a Milan-based chemical distributor and manufacturer. I designed and built the site: a searchable catalogue of 4,500+ products across 27 categories and 21 industries, a page for every product, and quote funnels that turn browsing into requests.",
    url: "https://www.solechem.eu/",
    domain: "solechem.eu",
    meta: [
      { label: "Role", value: "Design, development, content and SEO" },
      { label: "Client", value: "SoleChem S.R.L., Milan" },
      { label: "Languages", value: "English, German, French, Italian, Spanish" },
      { label: "Sister site", value: "solechem.com.tr (Türkiye)" },
    ],
    stats: [
      { value: "4,500+", label: "Products in the catalogue" },
      { value: "27", label: "Product categories" },
      { value: "21", label: "Industry pages" },
      { value: "5", label: "Languages" },
    ],
    challenge: {
      heading: "Thousands of products, one goal: a quote request.",
      body: "Industrial buyers don't browse marketing pages — they search by CAS number, formula or category, and they need to trust the supplier before they ask for a price. The site had to make 4,500+ products findable, show certifications and logistics up front, and keep a quote request one step away from anywhere.",
    },
    features: [
      {
        title: "Search by name, CAS or formula",
        body: "The catalogue search matches how chemists and buyers actually look for a product.",
      },
      {
        title: "Category and A–Z browsing",
        body: "27 categories and an A–Z index with product counts, paginated 100 products at a time.",
      },
      {
        title: "A page for every product",
        body: "Each product gets its own CAS-based URL, ready to be found from search engines.",
      },
      {
        title: "21 industry landing pages",
        body: "Food, pharma, coatings, water treatment and more — each with the products that sector buys.",
      },
      {
        title: "Quote funnel",
        body: "A request-quote page and calls to action across the site, with a 24-hour response promise.",
      },
      {
        title: "Trust up front",
        body: "ISO 9001 and ISO 22000, REACH and CLP compliance, client references and delivery terms.",
      },
      {
        title: "Manufacturing services",
        body: "Custom formulation, toll manufacturing and white label, explained as a clear four-step process.",
      },
      {
        title: "Five languages",
        body: "Localised paths for German, French, Italian and Spanish, plus a separate Turkish site.",
      },
    ],
    gallery: [
      { label: "Product catalogue" },
      { label: "Product page" },
      { label: "Industry page" },
      { label: "Manufacturing" },
    ],
    deliverables: [
      "Information architecture for 4,500+ products",
      "UI design and front-end build",
      "Catalogue, product, category and industry templates",
      "Quote request flow",
      "Multilingual setup in five languages, plus the Turkish site",
      "Copy for the homepage, Manufacturing and About pages",
      "SEO audit and technical groundwork",
    ],
    stack: ["React", "Multilingual routing", "Product templates", "Quote forms", "SEO"],
  },
  {
    slug: "jurcom-academy",
    name: "Jurcom Academy",
    tagline: "compliance training, online.",
    kind: "E-learning platform",
    summary:
      "An online academy for Jurcom's governance, risk and compliance training, in Turkish. I built it on WordPress with an LMS: a course catalogue across law and IT, course pages with lessons and instructors, member accounts with email or phone sign-in, and a corporate flow for assigning courses to whole teams.",
    url: "https://jurcomacademy.com/",
    domain: "jurcomacademy.com",
    meta: [
      { label: "Role", value: "Design and development" },
      { label: "Client", value: "Jurcom, Istanbul" },
      { label: "Language", value: "Turkish" },
      { label: "Audience", value: "Professionals and corporate teams" },
    ],
    challenge: {
      heading: "Training has to reach the office and the field.",
      body: "Compliance courses — KVKK, ISO 27001, competition law — are bought by individuals, but mostly rolled out by companies to everyone on the payroll, including staff without a corporate email. The platform had to sell single courses, enrol whole teams at once, and let anyone sign in with just a phone number.",
    },
    features: [
      {
        title: "Course catalogue",
        body: "Courses grouped into Law and IT tracks, with levels, prices and instructors at a glance.",
      },
      {
        title: "Course pages",
        body: "Lessons, total duration, instructor profile, a preview and a wishlist on every course.",
      },
      {
        title: "Email or phone sign-in",
        body: "Members can register and log in with a phone number — essential for field staff.",
      },
      {
        title: "Corporate enrolment",
        body: "Companies assign courses in bulk, by corporate email for office staff or by mobile number for the field.",
      },
      {
        title: "Corporate offers",
        body: "Early-booking discounts for companies and a request flow for custom, sector-specific training.",
      },
      {
        title: "Instructor applications",
        body: "A dedicated form for experts who want to teach on the platform.",
      },
      {
        title: "Ready for paid courses",
        body: "Distance-sales, refund and membership agreements published alongside checkout.",
      },
      {
        title: "Blog, FAQ and newsletter",
        body: "Content and campaigns that bring learners back between courses.",
      },
    ],
    gallery: [
      { label: "Course catalogue" },
      { label: "Course page" },
      { label: "About" },
      { label: "Member login" },
    ],
    deliverables: [
      "Platform design and build",
      "LMS setup: courses, lessons, instructors",
      "Email and phone authentication",
      "Corporate bulk enrolment flow",
      "Legal pages for paid courses",
      "Blog, FAQ and newsletter",
    ],
    stack: ["WordPress", "Elementor", "MasterStudy LMS", "Phone login"],
  },
  {
    slug: "dposphere",
    name: "DPOsphere",
    tagline: "a privacy marketplace for compliance teams.",
    kind: "Privacy platform · E-commerce",
    summary:
      "Platform and online store for DPOsphere, a privacy and GRC provider in The Hague. I built it on WordPress and WooCommerce: outsourced DPO and EU representative services organised by jurisdiction, packages and document sets you can buy online, a privacy marketplace, and a client area for tickets and documents.",
    url: "https://dposphere.com/",
    domain: "dposphere.com",
    meta: [
      { label: "Role", value: "Design and development" },
      { label: "Client", value: "JURCOM GRC Services BV, The Hague" },
      { label: "Market", value: "EU, UK, Türkiye and beyond" },
      { label: "Audience", value: "DPOs, privacy teams, global companies" },
    ],
    challenge: {
      heading: "Selling compliance like a product.",
      body: "Privacy services are usually sold through long sales calls. DPOsphere wanted the opposite: services, document packs and tools that a privacy team can compare, buy and manage online — across many jurisdictions, each with its own laws.",
    },
    features: [
      {
        title: "Services by jurisdiction",
        body: "A mega menu organises DPO, EU representative and consultancy services by country and law.",
      },
      {
        title: "Packages",
        body: "DPO, DPR and Hotline packs, flexible or annual, each listing exactly what is included.",
      },
      {
        title: "Privacy Market",
        body: "A store for privacy tools and products, filterable by category, stock and price.",
      },
      {
        title: "Document Warehouse",
        body: "Ready-made document sets per regulation: GDPR, UK GDPR, LGPD, CCPA, PIPEDA and more.",
      },
      {
        title: "Client area",
        body: "A dashboard where clients follow orders, open tickets and download their documents.",
      },
      {
        title: "Regulascope and decisions",
        body: "A library of laws and regulator decisions for each jurisdiction.",
      },
      {
        title: "24/7 Hotline",
        body: "An urgent-support service with shorter response times, sold as its own pack.",
      },
      {
        title: "Checkout with legal terms",
        body: "Card payments with cancellation, refund and distance-sale terms in place.",
      },
    ],
    gallery: [
      { label: "Packages" },
      { label: "Privacy Market" },
      { label: "Document Warehouse" },
      { label: "DPO service page" },
    ],
    deliverables: [
      "Platform design and build",
      "Service architecture by jurisdiction",
      "WooCommerce store, packages and checkout",
      "Document Warehouse and Privacy Market",
      "Client dashboard: orders, tickets, documents",
      "Regulation library and decisions",
    ],
    stack: ["WordPress", "WooCommerce", "Elementor", "Client portal"],
  },
  {
    slug: "space-and-place",
    name: "Space & Place",
    tagline: "a portfolio that lets the architecture speak.",
    kind: "Architecture studio · Riyadh",
    summary:
      "A bilingual Arabic and English website for SPACE & PLACE (فراغ ومكان), an architectural design studio in Riyadh. I designed and built a quiet, image-led site where the projects lead: filterable by type, each with its location, year, area and status, plus renders and walkthrough videos.",
    url: "https://sapdesign.sa/",
    domain: "sapdesign.sa",
    meta: [
      { label: "Role", value: "Design and development" },
      { label: "Client", value: "SPACE & PLACE, Riyadh" },
      { label: "Languages", value: "Arabic (right-to-left) and English" },
      { label: "Stack", value: "WordPress, Elementor" },
    ],
    stats: [
      { value: "5", label: "Project categories" },
      { value: "3", label: "Project stages tracked" },
      { value: "2", label: "Languages, RTL first" },
    ],
    challenge: {
      heading: "Let the work do the talking.",
      body: "An architecture studio is judged on its projects. The site needed to step back: large imagery, very little chrome, and enough structure that a developer or homeowner can find villas, hotels or interiors quickly — in Arabic first, with English alongside.",
    },
    features: [
      {
        title: "Projects by category",
        body: "Residential, commercial, hospitality, interior and urban design, each one click away.",
      },
      {
        title: "Project details",
        body: "Location, year, area in m² and ft², and status: in design, under construction or completed.",
      },
      {
        title: "Renders and walkthroughs",
        body: "Embedded videos show the design in motion, not just in stills.",
      },
      {
        title: "Directions to site",
        body: "Every project links to its location on Google Maps.",
      },
      {
        title: "Bilingual, RTL first",
        body: "Arabic layout throughout, with English labels for navigation and project data.",
      },
      {
        title: "Studio pages",
        body: "Team, services and about pages in the same restrained style.",
      },
    ],
    gallery: [
      { label: "Residential projects" },
      { label: "Services" },
      { label: "About" },
      { label: "Team" },
    ],
    deliverables: [
      "Visual design and art direction",
      "Bilingual RTL build",
      "Project categories and project template",
      "Video and map integration",
      "Team, services and about pages",
    ],
    stack: ["WordPress", "Elementor", "RTL", "Video"],
  },
];

export function getCaseStudy(slug: string) {
  return caseStudies.find((c) => c.slug === slug);
}

/** Reading order for "next project" links, ShuStyle included. */
export const caseStudyOrder = ["shustyle", ...caseStudies.map((c) => c.slug)];
