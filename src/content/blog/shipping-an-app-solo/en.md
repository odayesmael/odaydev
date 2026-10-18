ShuStyle started as an idea I couldn't stop thinking about: an AI stylist that builds outfits only from the clothes you already own. I designed it, built it, wrote the copy in five languages, set up the subscriptions, built the website and shipped it to the App Store. The Android version is next. Doing all of it alone teaches you where the real work is, and it's rarely the code. This is what I'd tell myself on day one.

## Treat the store listing as a product, not a form

The listing is the first screen most people ever see of your app. It deserves the same care as onboarding.

- **Plan screenshots early.** They are the most important part of the listing. Design them as a short story ("snap your clothes → say where you're going → get your look"), not as raw screen captures.
- **Localise everything.** ShuStyle supports Arabic, English, Turkish, Dutch and French, so every screenshot set, subtitle and description exists in each language. Arabic screenshots must also be mirrored, with the UI and text running right to left. Budget real time for this: it's a design job, not a translation job.
- **Write the subtitle and keywords for search.** Think about what someone types before they know your name, like "outfit planner" or "what to wear", not what you call the feature internally.

## Subscriptions take longer than you think

In-app purchases touch the app, the store consoles, tax and banking forms and your backend. Start early.

- Set up the products, prices and subscription group in App Store Connect before you build the paywall. Products sometimes need time before they show up in testing.
- Test with **sandbox accounts** on a real device, including renewal, cancellation, upgrade and expiry. Subscription renewals happen on an accelerated clock in sandbox, which makes this practical.
- Add a visible **Restore purchases** button. Apple expects one for restorable purchases, and users who switch phones need it.
- Put clear pricing, the renewal terms, and links to your **Terms** and **Privacy Policy** right on the paywall. Unclear subscription screens are a common reason for rejection.
- Keep a **free tier that's genuinely useful.** People need to experience the "aha" moment before they pay. In ShuStyle, the free plan includes a few outfit ideas and one AI try-on each month.

## AI features need a budget, not just an API key

Every AI call costs money, and some users will tap "generate" fifty times in a row. Decide the economics before launch.

- Give each plan a **monthly allowance** and offer top-ups for occasional heavy use. In ShuStyle these are "style points". That caps your costs and makes the upgrade path easy to understand.
- Cache results and avoid re-running expensive steps (background removal, image generation) when the input hasn't changed.
- Handle slow and failed responses gracefully. A generation that takes 20 seconds needs real progress feedback, not a spinner that looks frozen.

## Privacy forms must match reality, including your SDKs

Both stores ask you to declare what data you collect and why: Apple's **App Privacy** details and Google Play's **Data safety** form. These have to cover your third-party SDKs and AI providers too, not just your own code.

- List every SDK and service, and what it receives. In ShuStyle, users' clothing photos are sent to AI providers only to style outfits, never sold or used for ads, and the privacy policy says exactly that.
- If users can create an account, they must be able to **delete it from inside the app.** Apple requires this, and Google Play requires a deletion option too, including a web link. Build it from the start. It touches every table.
- Ask for permissions (camera, photos, notifications) at the moment they're needed, with a sentence explaining why.

## Make review easy for the reviewer

- If the app needs an account, give the reviewer a **demo login** with data already in it, so they don't land in an empty closet.
- Use the review notes to explain anything non-obvious: where the AI features are, how to reach the paywall, what the points system does.
- Expect at least one round of questions. Answer precisely, fix what's asked, and resubmit. Arguing rarely speeds things up.

## Getting ready for Google Play

Android is the next step for ShuStyle. A few things are different on Google's side and worth knowing early:

- New personal developer accounts must run a **closed test** with a minimum number of testers for a set period before they can publish to production. Check the current numbers in the Play Console, recruit testers early, and treat it as a real beta.
- Subscriptions are configured separately in the Play Console, with their own base plans and offers. Don't assume your App Store setup carries over.
- The Data safety form and account-deletion link are required before release, so reuse the work you did for iOS.

## The website is part of the product

Both stores require a privacy policy URL, and you'll want support and terms pages too. Beyond that, a fast landing page in the same languages as the app does work the store can't: it ranks in search, gets shared, and explains the product to people who aren't on their phone. I built [shustyle.app](https://shustyle.app) as a lightweight five-language site that sends visitors straight to the store.

## Ship, then listen

The first version doesn't need every feature. It needs the core loop to feel great and nothing broken. After launch, watch where people drop off, read every review, and fix the things that make people quit, before adding anything new.

> If I could keep only one lesson: start the store, subscription and privacy work in week one, not the week before launch. That's the part that runs on other people's schedules.
