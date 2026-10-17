import { SCREENSHOTS } from "./screenshots";

export type Project = {
  /** Stable id, also used as the React key */
  slug: string;
  title: string;
  category: string;
  domain: string;
  url: string;
  body: string;
  tags: string[];
  /** Shown in the home "Selected work" grid (first 9 web projects) */
  featured?: boolean;
  /** "web" (default) or "app" for native / mobile products */
  kind?: "web" | "app";
  /** App screens for the cover of a mobile app (kind: "app") */
  screens?: string[];
  /** Internal case-study path, e.g. "/work/shustyle" */
  caseStudy?: string;
  /** Site is currently down: the card stays, but without a link out */
  offline?: boolean;
};

/**
 * Single source of truth for portfolio work.
 * The home page shows the `featured` items; the /portfolio page shows all.
 * Card covers come from real screenshots in /public/work (see src/data/screenshots.ts).
 */
export const projects: Project[] = [
  {
    slug: "shustyle",
    title: "ShuStyle",
    category: "Mobile App",
    domain: "shustyle.app",
    url: "https://shustyle.app",
    body: "AI stylist app for iPhone and Android that builds outfits from the clothes you already own — matched to the weather and the occasion, with a 360° try-on on a model. Plus its 5-language website.",
    tags: ["iOS", "Android", "AI", "Subscriptions"],
    kind: "app",
    screens: ["https://shustyle.app/img/look-en.webp", "https://shustyle.app/img/home-en.webp"],
    caseStudy: "/work/shustyle",
  },
  {
    slug: "solechem-europe",
    title: "SoleChem Europe",
    category: "Industrial",
    domain: "solechem.eu",
    url: "https://www.solechem.eu/",
    body: "Multilingual B2B platform for a European chemical raw-materials supplier — a searchable catalogue of 4,500+ products, sector pages and quote funnels.",
    tags: ["React", "B2B", "Multilingual"],
    featured: true,
  },
  {
    slug: "jurcom-academy",
    title: "Jurcom Academy",
    category: "E-Learning",
    domain: "jurcomacademy.com",
    url: "https://jurcomacademy.com",
    body: "Online learning system with course catalogues, enrolment flows and a member area for legal and compliance training.",
    tags: ["LMS", "WordPress", "Membership"],
    featured: true,
  },
  {
    slug: "dposphere",
    title: "Dposphere",
    category: "Legal & Compliance",
    domain: "dposphere.com",
    url: "https://dposphere.com",
    body: "Corporate site for a data-protection and DPO-as-a-service firm — clear service architecture and GDPR-focused content.",
    tags: ["WordPress", "Corporate", "SEO"],
    featured: true,
  },
  {
    slug: "akhadia-holding",
    title: "Akhadia Holding",
    category: "Corporate",
    domain: "akhadia.nl",
    url: "https://akhadia.nl",
    body: "Holding-group corporate presence bringing multiple ventures under one clean, credible brand umbrella.",
    tags: ["WordPress", "Brand", "Multi-brand"],
    featured: true,
  },
  {
    slug: "esg-platform",
    title: "ESG Platform",
    category: "Corporate",
    domain: "esg.jurcom.nl",
    url: "https://esg.jurcom.nl",
    body: "ESG and sustainability reporting portal — data-heavy pages made approachable with clear structure and navigation.",
    tags: ["WordPress", "Platform", "Reporting"],
    featured: true,
  },
  {
    slug: "raja-chaabani",
    title: "Raja Chaabani",
    category: "Portfolio",
    domain: "raja-seven-tau.vercel.app",
    url: "https://raja-seven-tau.vercel.app",
    body: "Personal portfolio for a journalist and writer, featuring an elegant design to showcase published articles, essays, and literary work.",
    tags: ["React", "Journalism", "Portfolio"],
    featured: true,
  },
  {
    slug: "amal-glass",
    title: "Amal Glass",
    category: "Industrial",
    domain: "amalglass.com",
    url: "https://amalglass.com",
    body: "Product and capability showcase for a glass & aluminium manufacturer, built to win B2B enquiries.",
    tags: ["WordPress", "Catalogue", "Responsive"],
    featured: true,
  },
  {
    slug: "oday-handmade",
    title: "Oday Handmade",
    category: "E-commerce",
    domain: "odayhandmade.com",
    url: "https://www.odayhandmade.com/",
    body: "E-commerce store for Palestinian & Arab handmade home decor.",
    tags: ["E-commerce", "Shopify", "Retail"],
    offline: true,
  },
  {
    slug: "maximum-property",
    title: "Maximum Property",
    category: "Real Estate",
    domain: "maximumproperty.com",
    url: "https://maximumproperty.com",
    body: "Real-estate agency website with property listings, search and enquiry funnels tuned for conversions.",
    tags: ["WordPress", "Listings", "SEO"],
    featured: true,
  },
  {
    slug: "jurcomgrc",
    title: "JurcomGRC",
    category: "Legal & Compliance",
    domain: "jurcom.nl",
    url: "https://jurcom.nl",
    body: "Governance, risk and compliance consultancy site — structured service pages and a lead-focused layout.",
    tags: ["WordPress", "Consulting", "UX"],
  },
  {
    slug: "space-and-place",
    title: "Space and Place",
    category: "Corporate",
    domain: "sapdesign.sa",
    url: "https://sapdesign.sa",
    body: "Portfolio-style site for a design and architecture studio, letting the visual work lead the page.",
    tags: ["WordPress", "Portfolio", "Design"],
  },
  {
    slug: "kvkkobi",
    title: "KVKKOBI",
    category: "Legal & Compliance",
    domain: "kvkkobi.com",
    url: "https://kvkkobi.com",
    body: "KVKK (Turkish data-protection) compliance platform for SMEs, with guidance and clear service packages.",
    tags: ["WordPress", "Compliance", "SME"],
  },
  {
    slug: "chefs-equipment",
    title: "Chefs Equipment",
    category: "E-commerce",
    domain: "chefsequipment.com.au",
    url: "https://chefsequipment.com.au",
    body: "WooCommerce store for professional kitchen equipment with a large catalogue and product filtering.",
    tags: ["WooCommerce", "Catalogue", "Filtering"],
  },
  {
    slug: "gronhem",
    title: "Gronhem",
    category: "Corporate",
    domain: "gronhem.com",
    url: "https://gronhem.com",
    body: "Clean corporate website with a modern, content-driven layout and strong calls to action.",
    tags: ["WordPress", "Corporate", "Responsive"],
  },
  {
    slug: "lidya-yachting",
    title: "Lidya Yachting",
    category: "Marine",
    domain: "lidyayachting.com",
    url: "http://www.lidyayachting.com",
    body: "Yacht charter and marine-leisure site with an immersive gallery and an enquiry-driven booking flow.",
    tags: ["WordPress", "Booking", "Gallery"],
    offline: true,
  },
  {
    slug: "sea-boat-marine",
    title: "Sea Boat Marine",
    category: "Marine",
    domain: "seaboatmarine.com",
    url: "https://seaboatmarine.com",
    body: "Marine services and boat-sales website with a product-forward layout and clear contact paths.",
    tags: ["WordPress", "Catalogue", "Marine"],
  },
  {
    slug: "max-gear",
    title: "Max Gear",
    category: "Car Rental",
    domain: "maxgeartr.com",
    url: "https://www.maxgeartr.com",
    body: "Car-rental website for Istanbul with a pick-up and drop-off search, fleet pages and a booking-led layout.",
    tags: ["WordPress", "Booking", "Rental"],
  },
  {
    slug: "ozdilek-hukuk",
    title: "Özdilek Hukuk",
    category: "Legal & Compliance",
    domain: "ozdilekhukuk.com",
    url: "https://ozdilekhukuk.com",
    body: "Law-firm website with practice-area pages and a professional, trust-building presentation.",
    tags: ["WordPress", "Legal", "SEO"],
  },
  {
    slug: "right-hair-clinic",
    title: "Right Hair Clinic",
    category: "Healthcare",
    domain: "righthairclinic.com",
    url: "https://righthairclinic.com",
    body: "Hair-transplant clinic site with treatment pages, before/after galleries and consultation funnels.",
    tags: ["WordPress", "Medical", "Booking"],
  },
  {
    slug: "solechem-turkiye",
    title: "SoleChem Türkiye",
    category: "Industrial",
    domain: "solechem.com.tr",
    url: "https://www.solechem.com.tr/",
    body: "Turkish-market edition of the SoleChem platform — localised catalogue, certifications and B2B enquiry flows for SoleChem Kimya.",
    tags: ["React", "Localisation", "B2B"],
  },
  {
    slug: "soul-of-palestine-art",
    title: "Soul Of Palestine Art",
    category: "E-commerce",
    domain: "soulofpalestineart.com",
    url: "https://www.soulofpalestineart.com/",
    body: "Online store showcasing Soul Of Palestine art, merchandise, and cultural products.",
    tags: ["E-commerce", "Shopify", "Retail"],
    featured: true,
  },
];

/** Featured web projects for the home grid (the app gets its own spotlight). */
export const featuredProjects = projects.filter((p) => p.featured && p.kind !== "app").slice(0, 9);

/** Real screenshots captured by scripts/screenshot-projects.mjs, if any. */
export function projectShots(p: Project): { desktop?: string; mobile?: string } | null {
  const shot = SCREENSHOTS[p.slug];
  if (!shot || p.offline) return null;
  return {
    desktop: shot.desktop ? `/work/${p.slug}-desktop.webp` : undefined,
    // Apps show their own app screen in the phone, not the mobile website.
    mobile: shot.mobile ? `/work/${p.slug}-mobile.webp` : p.screens?.[0],
  };
}
