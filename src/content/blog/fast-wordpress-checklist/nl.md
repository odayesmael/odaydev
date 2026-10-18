Als een klant zegt "de website is traag", is de eerste reflex vaak om nog een optimalisatieplugin te installeren. Dat lost het zelden op. Een snelle WordPress-site is het resultaat van een handvol beslissingen in de juiste volgorde. Dit is de checklist die ik bij klantprojecten doorloop, van zakelijke websites gebouwd met Elementor tot WooCommerce-webshops.

## 1. Meet voordat je iets aanpast

Open [PageSpeed Insights](https://pagespeed.web.dev/) en kijk eerst naar de **velddata**: zo hebben echte bezoekers de site de afgelopen 28 dagen ervaren. De labscore eronder helpt bij het debuggen, maar Google rankt op velddata. De drie Core Web Vitals en hun "goede" grenswaarden:

- **LCP** (Largest Contentful Paint), wanneer de hoofdinhoud verschijnt: maximaal 2,5 s
- **INP** (Interaction to Next Paint), hoe snel de pagina reageert op tikken en klikken: maximaal 200 ms
- **CLS** (Cumulative Layout Shift), hoeveel er verspringt tijdens het laden: maximaal 0,1

Noteer de cijfers voor de homepage en twee of drie belangrijke templates, zoals een product-, dienst- en blogpagina. Je wilt het "voor"-beeld later kunnen vergelijken.

## 2. Begin bij de server

Geen enkele front-endtruc compenseert een trage server. Is de **Time to First Byte** op een gecachete pagina hoger dan ongeveer 600 ms, begin dan hier.

- Gebruik een actuele, ondersteunde PHP-versie. Elke grote PHP 8-release is merkbaar sneller dan PHP 7.
- Controleer of **OPcache** aanstaat. Bij de meeste goede hostingpartijen is dat standaard zo.
- Gebruik **paginacaching**, op serverniveau (Nginx, LiteSpeed) als je hosting dat biedt, of met een bekende cachingplugin. Sluit bij WooCommerce de winkelwagen, het afrekenen en de accountpagina's uit.
- Voeg voor dynamische sites (webshops, ledenomgevingen, LMS) een persistente **object cache** toe, zoals Redis, zodat herhaalde databasequery's uit het geheugen komen.
- Zet een CDN voor de site. Het gratis plan van Cloudflare is voor de meeste zakelijke websites genoeg.

## 3. Afbeeldingen: de grootste en makkelijkste winst

Bij de meeste sites die ik doorlicht, is het LCP-element een afbeelding, meestal de hero.

- Lever **WebP of AVIF** aan, verkleind tot de weergavegrootte. Upload nooit een foto van 4000 px om die op 1200 px te tonen.
- Laat WordPress `srcset` genereren (dat gebeurt standaard via de mediabibliotheek), zodat telefoons kleinere bestanden downloaden.
- **Lazy-load afbeeldingen onder de vouw, maar nooit de LCP-afbeelding.** WordPress geeft de waarschijnlijke LCP-afbeelding `fetchpriority="high"` en laadt die niet lazy, maar page builders en sliders maken dat vaak ongedaan. Controleer de hero in DevTools.
- Geef altijd `width` en `height` (of een `aspect-ratio`) op, zodat de browser de ruimte reserveert. Dat alleen lost de meeste CLS-problemen al op.

## 4. Houd de page builder in toom

Elementor en andere builders zijn prima voor klantsites, maar vragen wat discipline:

- Gebruik **Flexbox Containers** in plaats van de oude structuur sectie → kolom → widget. Dat levert veel minder HTML op.
- Zet de prestatie-instellingen van de builder aan. In Elementor zijn dat onder meer geoptimaliseerd laden van assets, lazy-loaded achtergrondafbeeldingen en inline font-iconen. De exacte namen verschillen per versie.
- Stapel geen "addon"-plugins die elk hun eigen CSS en JS op elke pagina laden.
- Zet geen zware slider of video-achtergrond bovenaan als één goed gecomprimeerde afbeelding volstaat.

## 5. Lettertypen

- Host lettertypen zelf in plaats van ze bij een derde partij te laden. Dat scheelt een verbinding, en binnen de EU voorkom je dat IP-adressen van bezoekers worden doorgestuurd.
- Laad alleen de gewichten die je echt gebruikt, het liefst als één variabel lettertype.
- Preload het lettertype dat boven de vouw wordt gebruikt, en gebruik `font-display: swap`.
- Vervang icon fonts waar mogelijk door inline SVG's.

## 6. Plugins: doorlichten, niet verzamelen

Installeer tijdelijk **Query Monitor** en open je traagste pagina's. Je ziet dan welke plugins trage databasequery's of hooks uitvoeren. Daarna:

- Verwijder plugins die niet gebruikt worden of elkaar overlappen.
- Zoek plugins die hun bestanden op **de hele site** laden terwijl ze maar op één pagina nodig zijn. Formulierplugins zijn het klassieke voorbeeld. Haal hun scripts weg op pagina's zonder formulier.
- Vervang "alles-in-één"-plugins door kleine, gerichte plugins of een paar regels in een child theme.

## 7. Scripts van derden

Chatwidgets, heatmaps, meerdere analytics-tags en ingesloten social feeds zijn vaak de hoofdoorzaak van een slechte INP. Vraag je bij elk script af of iemand de data echt gebruikt. Laad wat overblijft pas nadat de pagina interactief is, of na de eerste interactie van de bezoeker, en respecteer de cookietoestemming.

## 8. Database opschonen

Oudere sites verzamelen rommel die elke request vertraagt:

- **Automatisch geladen opties:** controleer hoeveel autoload-data er in `wp_options` staat. Oude plugins laten vaak grote autoload-rijen achter. Recente WordPress-versies waarschuwen hiervoor in Sitegezondheid.
- Verlopen **transients**, spamreacties en duizenden **revisies**. Beperk revisies met `define('WP_POST_REVISIONS', 10);` in `wp-config.php`.
- Zet bij WooCommerce-winkels met veel bestellingen **HPOS** (High-Performance Order Storage) aan.

## 9. Meet opnieuw en blijf monitoren

Draai PageSpeed Insights opnieuw op dezelfde pagina's en vergelijk met je "voor"-cijfers. Houd er rekening mee dat velddata tot 28 dagen nodig heeft om een verandering volledig te laten zien. Zet daarna monitoring op, bijvoorbeeld het Core Web Vitals-rapport in Search Console, zodat je merkt wanneer een nieuwe plugin of een marketingscript de site weer vertraagt.

> In mijn ervaring lossen hosting, caching en afbeeldingen het grootste deel van het probleem op bij een gemiddelde zakelijke website. Het werk aan de page builder en de plugins lost het meeste van de rest op. Begin bovenaan de lijst.
