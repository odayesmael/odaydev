/**
 * Content for the ShuStyle spotlight (home) and case study (/work/shustyle).
 * Images are served from shustyle.app so they stay in sync with the live site.
 */
const IMG = "https://shustyle.app/img";

export const shustyle = {
  name: "ShuStyle",
  tagline: "Your AI stylist, from your own closet.",
  summary:
    "An iOS and Android app that turns the clothes you already own into complete outfits — matched to the weather, the occasion and your style — then shows them on a model in 360°. I designed and built the app end to end, shipped it to the App Store, and built its five-language website.",
  site: "https://shustyle.app",
  appStore: "https://apps.apple.com/app/id6819099195",
  appStoreId: "6819099195",
  brand: "#7B1E3A",
  logo: "https://shustyle.app/logo.png",
  year: "2026",

  meta: [
    { label: "Role", value: "Product design, app development, website" },
    { label: "Platforms", value: "iOS · Android (coming soon) · Web" },
    { label: "Languages", value: "Arabic, English, Turkish, Dutch, French" },
    { label: "Model", value: "Freemium with in-app subscriptions" },
  ],

  screens: [
    { src: `${IMG}/home-en.webp`, caption: "Where are you going today?" },
    { src: `${IMG}/look-en.webp`, caption: "Three looks to choose from" },
    { src: `${IMG}/model-en.webp`, caption: "On a model, in 360°" },
    { src: `${IMG}/week-en.webp`, caption: "The week, planned" },
    { src: `${IMG}/closet-en.webp`, caption: "A closet, sorted" },
    { src: `${IMG}/friends-en.webp`, caption: "Friends vote on the look" },
  ],

  compare: {
    before: `${IMG}/cmp-before.webp`,
    after: `${IMG}/cmp-after.webp`,
  },

  steps: [
    {
      n: "01",
      title: "Snap your clothes",
      body: "Each photo is cut out from its background automatically and filed into a digital closet by category.",
    },
    {
      n: "02",
      title: "Say where you're going",
      body: "Pick an occasion — work, a dinner, a wedding — or describe the plan in your own words.",
    },
    {
      n: "03",
      title: "Get your look",
      body: "Three complete outfits from your own pieces, with a weather tip, a matching perfume and what to bring.",
    },
  ],

  features: [
    {
      title: "Outfits from your closet",
      body: "Complete looks down to shoes, belt and watch — built only from what you own.",
    },
    {
      title: "AI try-on in 360°",
      body: "A flat-lay becomes a realistic photo on a model you can drag to see from every side.",
    },
    {
      title: "Weather-aware",
      body: "Each look checks the forecast for now and tonight: an extra layer, closed shoes for rain.",
    },
    {
      title: "Week planner",
      body: "Seven outfits for the week, with morning reminders and an ironing nudge the night before.",
    },
    {
      title: "Ask your friends",
      body: "Share a look by link; friends vote and comment without installing the app.",
    },
    {
      title: "Closet insights",
      body: "Surfaces the pieces that never get worn and suggests new ways to style them.",
    },
    {
      title: "Smart shopping",
      body: "Photograph an item in the store and see how it pairs with your closet before buying.",
    },
    {
      title: "Style it yourself",
      body: "Build your own combination, get a score with smart swaps, and preview it on a model.",
    },
    {
      title: "Speaks your language",
      body: "Five languages including right-to-left Arabic, with a stylist voice that feels local.",
    },
  ],

  plans: [
    {
      name: "Free",
      price: "$0",
      note: "No card needed",
      items: [
        "5 outfit ideas / month",
        "1 photo on a model",
        "Weather tips & perfume",
        "Friends voting",
      ],
    },
    {
      name: "Premium",
      price: "$6.99/mo",
      note: "or $59.99 / year",
      items: [
        "30 outfit ideas / month",
        "10 photos on a model",
        "4 week plans / month",
        "Style it yourself & smart shopping",
      ],
      highlight: true,
    },
    {
      name: "Premium+",
      price: "$14.99/mo",
      note: "or $119.99 / year",
      items: [
        "60 outfit ideas / month",
        "40 photos on a model",
        "8 week plans / month",
        "360° views",
      ],
    },
  ],

  website: [
    "Marketing site in five languages, with a right-to-left Arabic layout",
    "Interactive before/after slider showing the AI try-on",
    "Screens gallery, feature tour, plans and FAQ",
    "App Store smart banner and download CTAs",
    "Privacy policy, terms and support pages required for store review",
  ],

  deliverables: [
    "Product concept, UX flows and UI design",
    "iOS and Android app development",
    "AI outfit generation, try-on and 360° view",
    "Weather, reminders and sharing flows",
    "Subscriptions, plans and style-point top-ups",
    "App Store submission and release",
    "Five-language website and legal pages",
  ],
} as const;
