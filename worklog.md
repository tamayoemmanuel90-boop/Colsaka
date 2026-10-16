# Worklog — Cosalka · Nutragen luxury e-commerce landing

---
Task ID: 1
Agent: orchestrator (Z.ai Code main)
Task: Project setup for Cosalka Nutragen landing page

Work Log:
- Explored scaffold: Next.js 16 App Router, Tailwind 4, shadcn/ui complete set, Prisma+SQLite, framer-motion, zustand present.
- Installed: three@0.185, @react-three/fiber@9.7, @react-three/drei@10.7.8, lenis@1.3.26, @types/three.
- Rewrote prisma/schema.prisma: Product (slug unique, price Float EUR, volumeMl default 500, purity, accent hex, image path, badge?, benefits JSON string, sortOrder) + Order (total, items JSON string, status). Removed scaffold demo models User/Post.
- Ran `bun run db:push` successfully against db/custom.db; client generated.

Stage Summary:
- DB schema live: Product & Order tables empty, awaiting seed.
- Contract for Task 2-a defined: GET /api/products -> { products }; POST /api/orders validates slugs server-side.
- Frontend architecture owned by orchestrator: fixed R3F canvas behind pointer-events-none content, Lenis-driven scroll stage sampler with 5 keyframe stages (hero → spotlight → science/exploded → gallery → contact).
- Accent palette locked: gold #D4AF37, graphite #0D0D0D, clinical white #FFFFFF/#F4F4F6, silver #C9CED6.

---
Task ID: 2-a
Agent: full-stack-developer
Task: Backend catalog seed + products/orders API

Work Log:
- Created src/lib/catalog-seed.ts: CATALOG_SEED constant with the exact 4 SKUs (purity/vital/derma/nocturne — prices 129/139/149/159 EUR, purities, accents, badges, benefits; every SKU strictly volumeMl 500), exported ProductDTO/CatalogSeedProduct interfaces + CLINICAL_VOLUME_ML, toProductDTO() mapper that JSON-parses the benefits string back to string[], and ensureSeeded() memoized as a single promise on globalThis (cleared on failure so it retries next request) doing idempotent upserts by slug (update also refreshes badge/sortOrder).
- Created src/app/api/products/route.ts: GET -> await ensureSeeded(), findMany orderBy sortOrder asc, maps rows to ProductDTO { id, slug, name, tagline, description, price, currency, volumeMl, purity, accent, image, badge, benefits }, returns { products }. force-dynamic set. 500 fallback with Spanish error message on failure.
- Created src/app/api/orders/route.ts: POST validates body via zod v4 ({ items: [{ slug, qty }] }, min 1 item, int qty 1..12), merges duplicate slugs, enforces max 12 units per slug, ensureSeeded() before lookups, unknown slug -> 400 { error: 'Producto no encontrado: <slug>' }, computes lines { slug, name, qty, price, lineTotal } + round2 total server-side, creates Order status 'confirmed' currency EUR, returns 201 { ok, orderId, total, currency, createdAt(ISO) }. GET returns { orderCount } wrapped in try/catch with fallback orderCount 0 (non-critical social-proof endpoint).
- Verified with `bunx tsc --noEmit -p tsconfig.json`: zero errors in the three owned files (only pre-existing errors in examples/ and skills/ folders remain).
- Smoke-tested live endpoints with curl: GET /api/products -> 200 with 4 seeded products ordered by sortOrder; POST valid cart (2x purity + 1x nocturne = 417 EUR total computed server-side) -> 201; unknown slug -> 400 exact contract message; qty 99 and empty items -> 400 zod details; GET /api/orders -> { orderCount } correct. Deleted smoke-test orders afterwards to leave Order table clean for launch.

Stage Summary:
- Backend data layer complete: catalog auto-seeds idempotently on first API hit; no manual seed step needed.
- Contracts honored exactly: GET /api/products -> { products: ProductDTO[] }; POST /api/orders -> { ok, orderId, total, currency, createdAt }; error message 'Producto no encontrado: <slug>' verbatim.
- Deviation notes for frontend agent: success responses use HTTP 201 (res.ok works fine); POST validation failures return { error, details[] }; duplicate slugs in one request are merged per product (max 12 units/slug enforced server-side too); all volumes are 500 ml only.
- No files outside the 3 contracted paths touched; prisma/schema.prisma untouched, no db:push run.

---
Task ID: 2-b → 7 (frontend, 3D & verification)
Agent: orchestrator (Z.ai Code main)
Task: Full frontend build (design system, scroll engine, R3F 3D scene, all sections) + E2E browser verification

Work Log:
- Design system: rewrote globals.css with Cosalka tokens (gold #D4AF37, graphite #0D0D0D, clinic #F4F4F6, silver #C9CED6) as Tailwind v4 @theme colors + forced-dark shadcn vars; grain overlay, gold-text gradient, custom scrollbar, Lenis CSS, ring-pulse keyframes. layout.tsx: es lang, Cosalka metadata, sonner Toaster.
- Scroll engine (src/lib/scroll-engine.ts): [data-stage] anchor measurement (scroll+resize+RO), piecewise smootherstep pose interpolation over 5 keyframe stages, shared zero-rerender scrollBus, viewport adapter (x-factor + stacked-layout vertical shift for <1080px, tiny-screen branch <500px).
- 3D scene (src/components/cosalka/three/): procedural 500 ml lathe glass bottle (transmission 1, ior 1.44), golden liquid lathe (attenuation #c9971e), brushed gold cap + silver collar groups, canvas-generated COSALKA label texture applied to curved cylinder bands front/back, exploded-view driver (cap ↑1.15e, collar ↑0.72e, shell ↓0.22e) with clinical HUD rings + emissive DNA double-helix core revealed on explode, 3 orbital nanoparticle instanced bands + molecule triads + dual Sparkles dust, procedural Lightformer studio environment (no network HDRIs), fixed z-0 Canvas behind pointer-events-none content, WebGL probe with static gradient fallback.
- BottleRig: critically-damped exp smoothing (k=1-e^(-Δ4.4)), idle bob + time drift + pointer parallax, writes frameState for parts, pushes stage → zustand store.
- Hotspots: 3 drei Html nodes (sellado/nanopartículas/pureza) with pulse rings; click → clinical card (title/body/stat) via spotlight-store, auto-hidden outside spotlight stage.
- Sections: Navbar (floating glass pill, cart badge, mobile dropdown), Hero (staggered mask-reveal headline, gold gradient "Vanguardia", dual CTA, lab micro-readout, scroll cue), Spotlight (HUD brackets + stats strip), Science (3 glass cards over exploded bottle), Gallery (API-driven cards, AI-generated product shots, buy buttons), Faq (static SSR fallback → client accordion after hydration), Footer (brand/certs/nav/newsletter/legal), CartDrawer (qty steppers, server-computed POST /api/orders, success state REF, lockScroll), zustand cart with localStorage persist.
- Product imagery: 4 images generated via z-ai CLI (864x1152, dark graphite, per-SKU cap metal: gold/silver/champagne/gunmetal) → public/images/products/.
- E2E fixes found via agent-browser: hero bottle scale/position (2 iterations), science exploded pose moved deep-back to protect heading legibility, contact pose exits off-screen right (was crossing FAQ text), buy-button nowrap, removed aria-hidden from canvas wrapper (hotspot a11y), Radix accordion useId hydration mismatch → static SSR FAQ fallback + post-hydration accordion mount, SceneRoot setState-in-effect lint → rAF-deferred probe, mobile spotlight recentering + pt-[42svh] reserved bottle zone.
- Verified end-to-end on 1440x900 and 390x844: hotspot click→card, add-to-cart from card & hero CTA, drawer stepper, checkout→order REF (server total ✓), cart badge persistence, mobile hamburger menu, FAQ accordion, nav anchor smooth scroll (Lenis), newsletter/legal links render. Console clean (only benign THREE.Clock deprecation). Test orders wiped from DB.

Stage Summary:
- Single-route luxury landing complete at /. Fixed R3F canvas + pointer-events layering pattern; scroll choreography: hero (bottom peek) → spotlight (left, hotspots) → science (deep-back exploded) → gallery (right, compact) → contact (exit right).
- APIs consumed: GET /api/products (with client fallback catalog), POST /api/orders (server-side totals, 400 on bad slugs).
- All lint clean; zero hydration errors; DB seeded with 4 strictly-500 ml SKUs.

---
Task ID: 8 (redesign pass)
Agent: orchestrator (Z.ai Code main)
Task: User refinement — couple 3D to page layout, strip text, ultra-minimal redesign, letter glow premium animations

Work Log:
- globals.css: added premium glow typography system (.glow-gold/.glow-white/.glow-soft with breathing text-shadow keyframes), goldShimmer animated sweep on .gold-text (background-size 220% loop), prefers-reduced-motion guards; softened hero-vignette + fixed edge vignette so the 3D reads as part of the page instead of a cut-out layer.
- New GlowTitle.tsx: reusable letter-by-letter reveal (blur(12px)+0.62em lift → sharp, 0.026s stagger, mount & inview modes, aria-label preserved, unbreakable word wrappers with em spacers).
- content.ts rewritten minimal: HOTSPOTS bodies cut to one sentence; SCIENCE_CARDS now icon+title+stat only (body removed); FAQ_ITEMS reduced 6→4 with ≤20-word answers.
- Sections rebuilt: Hero (pill + GlowTitle h1 + silver sub + CTAs only; paragraph & lab readout removed), Spotlight (01 kicker + glow h2 + 3-stat strip + one-line hint; HUD brackets kept as 3D frame; stat label "Absorción" + responsive dd sizing), Science (index header, translucent bg-carbon/55 cards, centered icon/title/stat), Gallery (cards reduced to image/name/glow price/buy; tagline+purity+truck removed), Faq (accordion-only, side card & intro removed), Footer (centered brand glow wordmark, one-line tagline, inline nav, 3 cert pills, email, legal bar; newsletter+address removed; pointer-events-auto on legal bar).
- scroll-engine STAGE_POSES re-tuned to couple the bottle to each section's layout: hero raised/closer (y -1.68, z -0.72, scale .9), science centered & forward behind translucent cards (x 0, z -2.25), gallery peeks beside heading top-right (x 2.8, y 0.9, z -1.05, scale .56), contact exits wider; BottleRig initial pose synced; mobile spotlight lift 1.52/tiny -0.46 scale.
- Bottle.tsx: golden liquid warmed (#f2dda6, attenuationDistance 0.72, emissive base 0.1) — reads as premium gold serum through the glass.
- E2E via agent-browser (1440×900 + 390×844): hotspot JS-click → clinical card ✓ (native click flaky due to idle-bob moving targets — automated artifact), buy→drawer→checkout→REF CMTAPW2EI000 ✓ (test order deleted from DB), FAQ accordion ✓, nav Lenis anchor scroll ✓ (scrollY 2681), footer legal buttons ✓, sticky footer at page end ✓, no 30ml/50ml strings ✓, console clean (only benign THREE.Clock deprecation), lint clean.
- Fixed during verification: missing inter-piece spaces in GlowTitle lines ("de Vanguardia", "en 500 ml.", "Ciencia verificable.", "La colección Nutragen.", "Preguntas, respuestas medidas.") by embedding explicit trailing spaces in piece text.

Stage Summary:
- Page is now ultra-minimal: every section = index kicker + glow headline + at most one data row; all long copy removed.
- 3D bottle participates in each section's composition (hero CTAs frame it, science cards float over its exploded helix, gallery heading leaves room for it) — no longer a detached backdrop.
- Glow system: breathing gold halo on key words, shimmer sweep on gradients, soft white aura on secondary text; reduced-motion safe.
- All flows re-verified end-to-end on desktop & mobile after the redesign; DB left clean.

---
Task ID: 9 (Mantis-light redesign — 3D as protagonist)
Agent: orchestrator (Z.ai Code main)
Task: User feedback — the 3D element must be THE PROTAGONIST (never behind the letters) and the page should look like the mantis.works reference (light clinical paper, colossal typography, editorial frame, film grain)

Work Log:
- THEME FLIP dark→light: globals.css rewritten (bg #ececee paper, ink #141416, gold system intact, light shadcn tokens, light scrollbar, .paper-vignette, .text-outline, grain opacity .07); layout.tsx body bg-paper/text-ink + light Toaster + themeColor #ececee.
- LAYER INVERSION (core requirement): SceneRoot moved z-0→z-20 ABOVE the typography; inner canvas container set pointer-events-none (drei Html hotspots re-enable pointer-events-auto themselves). Stacking map: z-1 vignette · z-15 gold shard · z-10 giant headlines (behind 3D) · z-20 canvas PROTAGONIST · z-30 interactive (CTAs, stats, cards, columns, FAQ, footer) · z-40 FrameRails · z-50 nav · z-70 drawer · z-75 grain. main no longer creates a stacking context so children pick their own layer.
- ScribbleShells.tsx (NEW): Mantis-homage — 12 jittered coarse wireframe lathe shells (deterministic PRNG, black 4.5–10.7% opacity) + 2 chaotic orbit rings that sketch the bottle; spreads with explode factor; mounted inside BottleRig so it follows every pose.
- STAGE_POSES retuned for protagonist framing: hero (x0, y-0.42, z+0.85, scale 1 — bottle covers the middle of the giant word), spotlight (x-2.42 left, y-0.14), science (center, explode 1, z-0.15), gallery (x+2.55 right), contact (ascends y+5 off-screen). adaptPoseToViewport: hero drops bottle below the word on stacked layouts (y-0.95, scale×0.7), spotlight tiny lift 1.95/scale×0.42, science z-0.9, gallery recenter.
- Label fix: labelBand thetaStart = -L/2 → label centered on the front face (was split into two side halves).
- Helix: quiet at rest (scale 0.62, emissive 0.14) → blooms on explode (1.10 / 2.54).
- make-label-texture: light paper edition (ink COSALKA + gold NUTRAGEN + gold hairline frame).
- FrameRails.tsx (NEW): Mantis chrome — top-center mono "weather" line (LAB. CENTRAL — PUREZA 99.9%), vertical side rails (NUTRAGENÉTICA—CLÍNICA—500 ML / coordinates MADRID), bottom corners, tilted gold shard behind canvas.
- Sections rewritten minimal + colossal type: Hero ("nutragenética." 11vw lowercase + mono kicker/sub moved above the word + dual CTA), Spotlight (giant "el estándar clínico en 500 ml." right column, stats strip z-30), Science (135svh stage, heading top, 3 hairline editorial columns bottom — no cards), Gallery (2×2 grid max-w-900 left, light cards, ink-block product shots), FAQ/Footer/Navbar/CartDrawer/HotspotNodes restyled to light paper.
- Nocturne product image regenerated (blue liquid violated palette → smoky charcoal + gold rim, 864×1152 via z-ai CLI).
- E2E via agent-browser 1440×900 + 390×844: hero bottle occludes headline ✓, spotlight hotspots → clinical light card ✓ (JS-click), add-to-cart → drawer → checkout → server REF CMTBJ6Z05000 ✓ (test order deleted), FAQ accordion ✓, nav Lenis anchor to #tienda (scrollY 3250) ✓, footer sticky ✓, mobile hero readable (bottle below word, CTAs float over cap) ✓, mobile spotlight bottle-peek ✓, console clean (only benign THREE.Clock deprecation), lint clean.
- Fixes driven by screenshots: science stage 781px→135svh (text had scrolled out of view), spotlight cap behind nav (y-0.14), top rail 78→96px, hero sub readability (moved above headline), mobile hero bottle covering the word.

Stage Summary:
- The page now reads as mantis.works-style clinical paper: colossal black typography, mono frame rails, film grain, gold shard — and the WebGL bottle floats IN FRONT of every headline, occluding the letters exactly as requested ("el 3D nunca detrás de las letras").
- Full layer contract documented in LandingPage.tsx header comment for future agents: headlines z-10, canvas z-20, interactive z-30.
- Backend untouched; APIs/DB intact; DB left clean after test-order wipe.

---
Task ID: 10 (nutragen.mx section parity rebuild)
Agent: orchestrator (Z.ai Code main)
Task: User request — "revisa la pagina completa: https://www.nutragen.mx/ — SACA LAS MISMAS SECCIONES Y MAS, PERO HASLO COMO PARA ESTA WEB" (extract the same sections and more from nutragen.mx, rebuild them in the Cosalka luxury 3D style)

Work Log:
- Analyzed nutragen.mx via agent-browser (page_reader returned empty: JS-heavy site): extracted full heading map + ~120 text nodes. Key discovery: Nutragen IS a Cosalka brand ("Fundadores de Nutragen · Cosalka, México", "Una marca de Cosalka"), psoriasis/descamación care, 2-step routine, direct-response long-form.
- Mapped nutragen.mx narrative beats → 13 scroll stages: hero (hook "¿Te engañan con tu propia piel?") → verdad (sin corticoides/apagafuegos) → rutina (Doble Acción Paso 1+2) → actua (Cómo actúa + estrato córneo = exploded bottle + hotspots) → origen (diagnóstico "un par de meses", padre e hijo) → esno (Qué es y qué no es) → habitos (Cuatro hábitos) → voces (Personas reales. Fechas reales.) → gallery/tienda (Tu paquete, de un vistazo) → envios (24/72h, gratis desde 150€) → garantia (No vendemos un frasco · 30 días + rotating seal) → faq (Las dudas que más nos escriben, 6 items) → cierre (No necesitas una piel perfecta + newsletter) → footer.
- scroll-engine.ts: StageName union 5→13, new STAGE_POSES choreography (bottle: center→left→center-between-steps→exploded→left→right→deep-back→left→right-checkout→back→center-seal→right-small→exit), STACK_ADAPT table-driven mobile recentering replacing per-case switch, tiny-phone extra-lift guard.
- content.ts rewritten: NAV (Sobre nosotros→origen), HERO/VERDAD/RUTINA/ORIGEN/ESNO/HABITOS/VOCES/ENVIOS/GARANTIA/CIERRE exports, HOTSPOTS re-aimed at skin science (estrato córneo/nanopartículas/agua clínica), FAQ 4→6 real nutragen questions, SCIENCE_STATS kept.
- New components: SectionHead.tsx (shared kicker+GlowTitle header + fade preset), Verdad, Rutina (symmetric Paso 1/Paso 2 cards around center bottle), Origen (mono timeline), EsNoEs (+/− hairline lists), Habitos (4 editorial columns), Voces (3 real quote cards: Guadalupe R./María E./José Manuel + legal line), Envios (stats strip), Garantia (rotating SVG clinical seal, textPath arc, static 30 center), Cierre (statement + protocol CTA + "¿Sigues pensando en tu piel?" email capture with validation toast).
- Edited: Hero (hook headline "¿te engañan / con tu propia piel?" gold-glow on "engañan", nutragen kicker/sub), Science→"la ciencia que se ve" + stats strip + hotspot hint (id=actua), Gallery→"tu paquete, de un vistazo" (kicker 08), Faq (data-stage=faq, kicker 11), Footer (tagline "Escucha tu piel · Respétala · Transfórmala", "Una marca de Cosalka" legal, no data-stage), FrameRails (announce rail "Envíos 24/72 h — garantía 30 días — rutina dos pasos", claim rails), HotspotNodes (visible at stage actua), LandingPage (13-section composition + layer contract docs). Deleted Spotlight.tsx.
- globals.css: .seal-spin rotation (26s, ring-only group, static center numerals) + reduced-motion guard. GlowTitle as type extended to "p".
- Fixed during build/verify: STACK_ADAPT object-literal syntax error (tsc), GlowTitle as="p" TS error, unused @ts-expect-error in make-label-texture.ts, guarantee seal center "30"/"DÍAS" missing x="98" (rendered at x=0), Garantia seal restructured so only the ring rotates.
- E2E agent-browser 1440×900 + 390×844: hero hook + bottle protagonist occluding headline ✓, 11 sections screenshotted ✓, 3 hotspots mount at actua ✓, hotspot click → clinical card ✓, FAQ accordion (6 items, gold open state) ✓, buy→drawer→checkout→server REF CMTRRTQAO000 ✓ (test order deleted, Order table clean), nav Lenis anchor scroll (scrollY 4105 ≈ origen 4113) ✓ (drawer open = scroll lock, not a bug), mobile: bottle-below-content table fixes for verdad/origen/esno/habitos/garantia after screenshot review ✓, footer sticky + legal bar ✓, console clean, lint clean, dev.log clean.

Stage Summary:
- Landing now mirrors nutragen.mx section-for-section (13 narrative beats + footer) while keeping the Cosalka mantis-style paper aesthetic and the 3D bottle as absolute protagonist (canvas z-20 over type z-10, interactive z-30).
- Scroll choreography extended to 13 poses with table-driven mobile adaptation (bottle drops below content columns on stacked layouts).
- Backend untouched (APIs/DB intact, DB left clean); only frontend + scroll-engine + content files changed.

---
Task ID: 11 (real client data integration — Drive folder scan)
Agent: orchestrator (Z.ai Code main)
Task: User shared Google Drive folder "Nutragen logo y productos" (17a7BjLSy_6mxxb_Tx1W_twyuO04uyPwE) — "escanea toda la carpeta y saca toda la info que quiere el cliente". Extract ALL client info and integrate it into the landing.

Work Log:
- Scanned Drive via agent-browser: inventoried 47 files (2 videos, 2 PDFs, 2 renders, 41 case photos "Foto de Mauricio Garcia"). Downloaded everything via drive.usercontent.google.com direct links → /home/z/my-project/client-assets/{pdf,images,video}.
- Read etiquetas.pdf (2 pages): REAL product line discovered — PASO 1 "Nutragen Psoriasis Treatment" + PASO 2 "Nutragen Psoriasis Moisturizer", both "Crema Corporal Orgánica con Tecnología Nutragenética", CONT. NETO 500 ML, "Ayuda a eliminar escamas y reducir rojeces", ANTI PICOR, ingredients (agua desmineralizada, coco, oliva, karité, neem, cola de caballo, ortiga, verbena, dragó, ácido hialurónico, magnesio/zinc), "No probado en animales", "Hecho en México: Cosalka International S. de R.L. de C.V", cosalkainternational.com.
- Read ebook_psoriasis_nutragen_final.pdf ("Domina la Psoriasis — Protocolo Integral de Remisión"): real science (IL-17, TNF-alfa, NF-kB, leaky gut, Candida albicans, 84 minerales de sal marina, estrato córneo) + protocolo maestro 30 días + 4 pilares (agua con sal marina, jugos verdes, ejercicio/linfa, eje emocional).
- Visited nutragen.mx heading map again for narrative parity (Paquete Doble Acción, Personas reales, Te acompañamos 30 días, México/USA/LATAM).
- Viewed client images: logo renders (bottles white + rose-gold COSALKA sphere emblem, silver caps), production photo (both bottles, real 500 ML labels), 43 case photos = antes/después patient documentation (Antes/Después/Día 1 overlays).
- Assets → public/images/client/ (producto-paso1.jpg & paquete-doble-accion.jpg cropped from REAL production photo with sharp; producto-paso2.jpg from official render; antes/despues cuero+brazo+piernas+espalda; produccion-real.jpg) + public/video/testimonio-{1,2}.mp4. NOTE: logo_design_1.png (duo render) shows "480 mL" on Paso 1 → EXCLUDED from store per strict 500ml-only rule; only 500 ML assets used.
- catalog-seed.ts rewritten: 3 REAL SKUs (paso-1-treatment 899, paso-2-moisturizer 899, paquete-doble-accion 1590 — MXN, placeholder prices pending client), real benefits from labels; STORE_CURRENCY=MXN; runSeed now deleteMany's retired SKUs. orders/route.ts currency → STORE_CURRENCY. products-client.ts fallback + formatPrice → es-MX/MXN.
- content.ts rewritten with real data: RUTINA (Treatment anti-picor / Moisturizer calma), HABITOS = ebook's real 4 pillars, HOTSPOTS = real formula (Neem+Ortiga / Cola de Caballo+Hialurónico / orgánica 100%), ESNO = label claims (no probado en animales, Cosalka International), ENVIOS (México/USA/LATAM, $1,500 envío gratis), GARANTIA ("No te vendemos un frasco: te acompañamos 30 días"), SCIENCE_STATS (IL-17·TNF-α / 84 minerales / 500 ml), FAQ 6 real answers, FLAGSHIP_SLUG → paquete-doble-accion.
- Voces.tsx extended: quote cards + "Casos reales · ninguno posado" (2 real antes/después cards with ANTES/DESPUÉS pills: cuero cabelludo día 21, antebrazo día 30) + "Video-testimonios sin guion" (2 real client videos, native controls) + legal line.
- Footer: certs → HECHO EN MÉXICO / NO TESTEADO EN ANIMALES / TECNOLOGÍA NUTRAGENÉTICA; +cosalkainternational.com link; legal → "© 2025 Cosalka International S. de R.L. de C.V. — Nutragen® · Hecho en México". layout.tsx metadata rewritten (psoriasis/descamación keywords). make-label-texture.ts: 3D label now "TECNOLOGÍA NUTRAGENÉTICA · ORGÁNICA" + "PSORIASIS TREATMENT · ANTI-PICOR · 500 ml ℮".
- Dev server restart required (seed memoized on globalThis persisted old catalog across HMR). API verified: 3 SKUs MXN/500ml, old SKUs purged; POST /api/orders 201 total 1590 MXN; test order wiped.
- E2E agent-browser 1440×900 + 390×844: hero kicker "TECNOLOGÍA NUTRAGENÉTICA · HECHO EN MÉXICO" + bottle protagonist ✓, rutina Paso 1/Paso 2 real names ✓, voces real photos + videos ✓, tienda real product images + $1,590 MXN ✓, buy→drawer→checkout→REF CMTRXZ7ZW000 ✓ (wiped), FAQ 6 items accordion ✓, footer legal/sticky ✓, mobile stacked layout ✓, console clean (benign THREE.Clock only), lint clean, tsc clean.

Stage Summary:
- The landing now runs on the client's REAL catalog, REAL claims, REAL media: no fictional SKUs or invented certs remain anywhere.
- Every string is traceable to a client source: etiquetas.pdf (products/claims/ingredients/legal), ebook (science/habits/protocol), nutragen.mx (narrative/structure/offer), Drive photos+videos (social proof).
- 500 ml-only rule enforced across catalog, 3D label, gallery badges and copy (480 mL render deliberately excluded).
- Pending from client: real prices (currently 899/899/1590 MXN placeholders), real contact email (clinica@cosalka.com placeholder), full antes/después pairs for piernas/espalda not yet mounted (photos saved in public/images/client/).

---
Task ID: 12
Agent: orchestrator (Z.ai Code main)
Task: User request — "activar pm2" (run the dev server under PM2 process manager)

Work Log:
- Verified port 3000 was free (no running dev server, no duplicate instances).
- Installed pm2 globally via `bun install -g pm2` (binary at /usr/local/bin/pm2, node v24 available).
- Started the Next.js dev server under PM2: `pm2 start bun --name cosalka --interpreter none -- run dev` (fork mode, cwd /home/z/my-project).
- Confirmed server readiness: HTTP 200 on /, real page content renders (Nutragen / nutragenética strings present), GET /api/products returns the 3 real MXN SKUs (500 ml catalog intact).
- Saved process list with `pm2 save` → /home/z/.pm2/dump.pm2 (resurrectable).
- Confirmed the package.json dev script's `tee dev.log` still works under PM2 — /home/z/my-project/dev.log continues receiving logs (GET / and prisma:query entries visible).

Stage Summary:
- Dev server now runs as PM2 process "cosalka" (id 0, online, auto-restarts on crash).
- Useful commands: `pm2 ls` / `pm2 logs cosalka` / `pm2 restart cosalka` / `pm2 stop cosalka` / `pm2 resurrect`.
- No code changes; landing page, APIs and DB untouched.

---
Task ID: 13
Agent: orchestrator (Z.ai Code main)
Task: Real-route Amazon-style store + "/" preview-only + staging law (3D never covers words) + realistic Nutragen 3D bottle

Work Log:
- Real routes (user demand): replaced the client view-router with actual Next.js routes in app/(store) group — layout.tsx (StoreNav + StoreFooter + AuroraBackground + SmoothScroll + grain) and 8 pages: /tienda, /producto/[slug] (server, await params), /carrito, /checkout, /confirmacion, /nosotros, /faq, /contacto. Each page has its own Spanish metadata. Deleted src/store/view.ts + StoreApp.tsx; new src/store/order.ts holds the OrderReceipt for /confirmacion.
- STAGING LAW implemented across the landing: STAGE_POSES retuned so the bottle parks on the clear side opposite every text column (hero right/title left, verdad/origen/voces left, esno/gallery/faq right, rutina center-between-cards below heading with meta moved under the heading, actua exploded center-right with all text left, garantia restructured to left column). MolecularField orbital radii tightened ~25% and Sparkles shrink-wrapped to the bottle aura so no particle drifts over words; garantia promise text z-30 over the gold shard.
- Landing converted to PREVIEW-ONLY (user demand): "/" now = Hero (only 3D moment) → Verdad value strip → Cierre CTA → GaleriaReal (client's real before/after pairs + production photo + 2 real videos, organized at the bottom) → Footer. Deleted 10 unused sections (Rutina/Science/Origen/EsNoEs/Habitos/Voces/Gallery/Envios/Garantia/Faq); their content already lives in the store routes. ZERO prices on "/" (verified via DOM eval). 3D EXITS top-right at stage 2 (verdad) and stays off for the whole rest of the page; STACK_ADAPT hero mobile drops the bottle below the CTAs (dy -1.14 after mobile screenshot fix).
- REAL Nutragen 3D bottle (user demand, reference logo_design_2.png + client renders): Bottle.tsx rebuilt — opaque satin-white body (meshPhysical #f6f4ef, clearcoat 0.55, sheen) replacing the glass+golden liquid; liquid mesh deleted; brushed CHROME cap (disc-top + slot line + groove) replacing the gold cap; helix recolored copper/silver and now revealed by fading the white shell translucent on explode (shellMat opacity 1−0.88e). make-label-texture.ts rewritten as a replica of the physical label: copper COSALKA sphere emblem with wavy stripes, gold PASO 2 pill, bold black NUTRAGEN, PSORIASIS MOISTURIZER, 3 skin-diagram thumbnails, "Ayuda a eliminar escamas y reducir rojeces", red ANTI-PICOR hex badge, CONT. NETO 500 ML. Label band resized (theta 1.95 rad, h 0.9). Nanoparticles recolored copper (#c98a6b)/silver/gold.
- Store expanded Amazon-style ("literal un amazon con muchas secciones"): /tienda now has 13 sections — header, trust strip, marquee, catalog with category filters, LOS MÁS VENDIDOS ranking (1/2/3 with images), bundle banner (ahorra $208), cómo funciona (3 steps), rutina, sobre Cosalka teaser → /nosotros, envíos 24/72h + garantía 30 días band, testimonios, FAQ teaser, newsletter.
- Nav unified to routes: content.ts NAV_LINKS now {label, href} (/,/nosotros,/tienda,/faq,/contacto); landing Navbar + Footer push routes; StoreNav active state via usePathname.
- MacBook cursor: LuxCursor (gold dot + lagging ring, hover magnify over interactive, press shrink, rAF lerp, pointer-fine only, reduced-motion safe) mounted in root layout; CSS hides native cursor via html.lux-cursor.
- AuroraBackground (3 blurred gold/silver blobs + 6 copper motes, pure CSS, reduced-motion safe) on all store pages; SmoothScroll (Lenis + scrollRestoration manual + scroll-to-top on navigation).
- E2E agent-browser fixes: (store)/layout.tsx had silently failed to be written (page rendered without nav) → recreated; rutina cap covered the heading → meta moved under heading + pose y -1.0/scale 0.74; garantia particles grazed heading → section restructured left + bottle right; cap slot line rotation bug (poked out like a pin) fixed; mobile hero bottle touched VER TIENDA → STACK_ADAPT hero dy -1.14; scrollRestoration manual to kill reload-restore artifacts.
- Full purchase flow verified E2E (desktop 1440×900): tienda → product detail → add ×2 → carrito (steppers, free-shipping progress) → checkout step1 (7-field validated form) → step2 (estándar GRATIS ≥$1,500 / express $250) → step3 (tarjeta/transferencia/contra entrega) → POST /api/orders → /confirmacion with server REF + receipt ($3,180 + envío GRATIS). Test order wiped from DB (order.deleteMany).
- Verified desktop + mobile (390×844): hero staging, 3D exit, gallery bottom, tienda sections, nosotros, contacto, confirmación. Console clean (only benign THREE.Clock deprecation), tsc clean, eslint clean.

Stage Summary:
- "/" is now a strict preview: no prices, 3D only in the hero (then gone), real-photo gallery at the bottom, everything routes into the store.
- The store is a real multi-route Amazon-style experience: /tienda (13 sections), /producto/[slug], /carrito, /checkout (3 steps, server-computed orders), /confirmacion, /nosotros, /faq, /contacto — all with aurora background, fluid animations and the MacBook-style cursor; zero WebGL outside "/".
- The 3D bottle now replicates the physical Nutragen product (white satin body, chrome cap, copper COSALKA/NUTRAGEN label, 500 ML) and never covers a single word on any stage.

---
Task ID: 16
Agent: orchestrator (Z.ai Code main)
Task: "Quitar el triángulo + texto dorado borroso → limpio" + "revisa qué más hay en la carpeta y qué más puedo agregar" + "a los objetos 3D quíteles las líneas negras, solo quede el objeto 3D"

Work Log:
- Removed the tilted gold shard (clip-path triangle) from FrameRails.tsx — it floated at bottom-left under the hero CTAs (user's green circle #2).
- Crisp gold type (user: "el texto se ve borroso en ese color"): globals.css .gold-text is now a STATIC gradient (deeper mid-stops, no shimmer loop) and .glow-soft/.glow-gold are no-op hooks (text-shadow: none) — the 3-layer gold text-shadow halo (up to 120px) that blurred background-clip:text glyphs is gone app-wide (~30 headings). GlowTitle now strips each char's inline filter/will-change on onAnimationComplete (retained blur(0px) pins chars to grayscale-AA composited layers = soft text).
- Removed ALL black lines from the 3D scene (user: "solo quede el objeto 3d"): deleted ScribbleShells.tsx (12 black wireframe lathe shells #101013 + 2 dark torus orbit rings) and its mount in BottleRig. MolecularField metallic beads/triads/Sparkles kept (3D objects, not lines). Verified visually: bottle now stands completely clean.
- Folder audit (public/images/client/): found 2 unmounted real records → added VOCES.registros (content.ts): antes-despues-piernas.jpg (combined antes|después single photo, Semana 3) + antes-espalda.jpg (honest ongoing case, Semana 2, gold "EN TRATAMIENTO" badge + note "el después se publica al cerrar el registro"). GaleriaReal renders them as a new 2-col row between the pair grid and the videos, with Antes/Después chips on the combined photo.
- BUG FIX in GlowTitle: "¿te " split produced ["¿te"," ",""] → TWO 0.24em spacers per written space (words 50% too far apart, hero line 38px wider than designed). Empty split artifacts are now skipped.
- Hero title fit re-engineered with real measurements: the line wrapper is a flex item (align-items:start → fit-content), so previous "column vs text" numbers were self-referential; real constraint = grid column. Grid set to lg:grid-cols-[1.08fr_0.92fr] + clamp(2.5rem,6.1vw,6.2rem). Measured margins vs grid column: 1440→7.9%, 1240→6.9%, 1024→5.2%, zero wrap anywhere; fs 88px @1440 ≈ the original look.
- E2E: hero desktop+mobile (390×844) clean bottle/crisp gold/2-line title/no shard; gallery shows 2 pairs + production + piernas + espalda-en-curso + 2 videos; tsc src clean; eslint clean; HTTP 200.

Stage Summary:
- "/" hero: only the clean satin-chrome 3D bottle (no scribbles, no rings, no triangle), crisp static-gold typography, guaranteed 2-line title at every desktop width.
- The client archive folder is now fully mounted: every usable real asset (2 pairs, combined piernas, espalda-in-progress, production photo, 2 videos) is live in the gallery; nothing invented.

---
Task ID: 17
Agent: orchestrator (Z.ai Code main)
Task: "pasarela de pagos completa DEMO con Google Pay y Apple Pay"

Work Log:
- New src/components/store/payments/brand-marks.tsx: inline-SVG official marks — Google four-color G + "Pay" lockup, Apple mark + "Pay" lockup, Face ID glyph, Visa wordmark, Mastercard circles, AMEX badge, BIN detection (detectBrand).
- New src/components/store/payments/DemoSheets.tsx: faithful DEMO recreations of both wallet sheets with a phase machine (review → [faceid] → processing → done → error-retry). GooglePaySheet (white, GPay header, merchant/total, Visa ····4242 DEMO pill, enviar-a, envío, black "G Pay · Pagar" bar) and ApplePaySheet (iOS #f5f5f7 sheet,  Pay header, wallet card rows, "Paga Cosalka" total, black  Pay button → Face ID phase with pulsing glyph + "toca dos veces el botón lateral" + demo authenticate button). ESC/backdrop close guarded during processing; derived-state reset pattern (no setState-in-effect, lint-clean); spring bottom-sheet on mobile / centered on desktop.
- StoreCheckout step 3 rebuilt as a full gateway hub: express wallet tiles (GPay/Apple Pay official marks) + otros métodos (tarjeta/transferencia/contra entrega); card form with live number grouping (4-4-4-4), MM/AA auto-slash, CVV 3-4, holder, brand mark inline + brand caption, "Autorrellenar tarjeta demo · Visa 4242" helper, per-field validation with specific toasts; per-method CTA labels (Pagar con Google Pay / Apple Pay / Pagar ahora / Confirmar pedido); security footer (TLS 1.3 · 3-DS demo · PCI simulado); "PASARELA DEMO · SIN CARGOS REALES" badge. submitOrder() refactored: POST /api/orders → receipt (now with gateway `method` label) → cart clear, NO navigation; wallets run it inside the sheet then navigate on the success check.
- OrderReceipt + StoreConfirm: new `method` field shown as "Pago · {label}" row (data-testid=order-method).
- E2E verified 3 full flows + mobile: (1) GPay sheet flow → REF CMTX8PZ47000; (2) Apple Pay flow incl. Face ID step → REF CMTX8QXX0000 (express $899+$250=$1,149 correct); (3) tarjeta demo autofill → REF CMTX8V227000; (4) mobile 390px bottom-sheet GPay flow → /confirmacion OK. All receipts show the right gateway label. Test orders wiped (DELETE FROM Order). tsc + eslint clean.
- Test gotcha documented: state field requires >2 chars (NL fails, CDMX/JAL/Nuevo León pass) — data issue, not app bug; synthetic value-setter fills can miss React state after HMR remounts, use agent-browser fill/refs for real events.

Stage Summary:
- /checkout now has a complete DEMO payment gateway: 5 methods, official Google Pay & Apple Pay buttons and checkout sheets (sandboxed, no SDKs, no real charges), formatted card form with brand detection, gateway-labeled receipts — production-like UX end to end.

---
Task ID: 18
Agent: orchestrator (Z.ai Code main)
Task: "Has una pagina mas profesional: literal un AMAZON, quita el modelo 3d y colocar el video de Google Drive en el inicio"

Work Log:
- Downloaded the client's official film from Google Drive (file id 1TdPdKXGXFrAXF79dZ4kj-WwwEZRGy0RI) via drive.usercontent direct-download → public/videos/nutragen-hero.mp4 (42 MB, 1920x1072, 60 s, h264). Generated web deliverables with ffmpeg: nutragen-hero-web.mp4 (22 MB, 1600w, faststart) + nutragen-hero-poster.jpg (frame @2.5 s).
- REMOVED THE 3D LAYER completely: deleted src/components/cosalka/three/ (SceneRoot, BottleRig, Bottle, HotspotNodes, MolecularField, StudioEnv, ScribbleShells, frame-state, spotlight-store) and src/store/stage.ts. LandingPage rebuilt without SceneRoot/initScrollStages/useStageStore (scroll-engine stays — Lenis still consumes scrollBus; content.ts keeps HOTSPOTS for legacy Science.tsx so tsc stays green).
- NEW cinematic video hero (Hero.tsx): full-bleed autoplay/muted/loop/playsInline <video> with poster fallback + onError guard, layered scrims (left 88% → right 18% gradient + bottom fade into paper), kicker chip, GlowTitle over dark (white + static gold), rating row (5 gold stars · 4.9/5 · +2,300 pieles · resultados reales), dual CTA (Comprar ahora · $1,590 MXN = add flagship + toast; Ver la oferta → #oferta scroll), delivery/guarantee chips, scroll cue. data-testids: hero-buy, hero-store.
- Amazon-grade conversion sections added to "/":
  · Navbar announcement strip: rotating 3 messages (envío gratis / garantía / métodos de pago) every 4.2 s, collapses on scroll; brand button now routes "/" correctly.
  · TrustBar.tsx (new): 4 promise cards — envío gratis, garantía 30 días, orgánico certificado, pago 100% seguro with REAL Visa/Mastercard/GPay/ApplePay marks (imports store payments/brand-marks).
  · BuyBox.tsx (new, #oferta): flagship offer card — MÁS VENDIDO badge, real catalog price via useProducts ($1,590), computed compare-at $1,990 + −20% chip, "Envío GRATIS incluido · IVA incluido · paga con tarjeta, Google Pay o Apple Pay", benefits checklist, pulsing stock line, AGREGAR AL CARRITO (testid buybox-add) + COMPRAR AHORA → /checkout (testid buybox-buy), payment marks + guarantee row.
  · Verdad.tsx rebuilt: left column = productos-duo.png card + IL-17·TNF-α / 84 minerales / 500 ml stat strip (fills the old empty 3D half); right column keeps sin corticoides headline + chips.
  · Rutina.tsx rebuilt as shoppable step cards with real product photography (RUTINA.steps gained img+slug) and "Ver ficha" links to /producto/[slug].
  · Reviews.tsx (new, #resenas): graphite 4.9 summary card with animated distribution bars (89/8/2/1/0%) + 3 verified-purchase review cards (BadgeCheck chips).
  · Garantia.tsx: empty 3D right half replaced by produccion-real.jpg card with "Lote sellado · 500 ml" caption; section tightened to 92svh.
  · Cierre.tsx tightened 104svh → 72svh (sell-page density).
  · StickyBuyBar.tsx (new): mobile-only fixed bottom bar appearing after 560 px scroll — flagship name/price + COMPRAR (testid sticky-buy), safe-area inset aware; footer gains mobile bottom padding.
  · Footer: "Métodos de pago:" marks row (Visa/MC/GPay/APay).
  · Mounted previously orphaned Faq.tsx (SSR-safe accordion) on "/".
- Toast UX fix: global Toaster moved to position top-center (layout.tsx) so the add-to-cart toast never covers the cart drawer's FINALIZAR COMPRA button on mobile.
- E2E verified (agent-browser): desktop 1440 — announcement rotation (msg1→msg2), video playing (currentTime advancing, 1600x894), full GPay flow → REF CMUHNZF5Y000 + receipt "Pago: Google Pay · Visa ···· 4242 (demo)", full Apple Pay flow incl. Face ID step → REF CMUHO15YR000 + receipt "Apple Pay · Visa ···· 4242 (demo)"; buybox-buy lands on /checkout pre-filled flow. Mobile 390 — hero/sticky bar/trust cards, sticky-buy → drawer → checkout → GPay bottom sheet → REF CMUHOAP6Z000 ($3,180 = 2×$1,590 + envío GRATIS math correct). FAQ accordion opens, all 6 store routes 200, zero console errors. tsc (src clean) + eslint clean.

Stage Summary:
- "/" is now a sell-first Amazon-style storefront: official client video replaces the 3D scene entirely (WebGL fully removed), flagship BuyBox with real prices/launch anchor/free-shipping math, verified social proof, shoppable routine cards, guarantee + FAQ — same luxury paper/gold skin, same GlowTitle/framer-motion animation system, fully mobile-verified.
- Payment gateway (Task 17) re-verified end-to-end on both wallets after the redesign; receipts persist gateway labels.

---
Task ID: 19
Agent: orchestrator (Z.ai Code main)
Task: "Organicemos ortografía: las primeras letras siempre en mayúscula, y que las letras no se corten por la mitad — se vea la letra completa"

Work Log:
- ORTOGRAFÍA (mayúscula inicial) — 30+ titulares corregidos en toda la web:
  · Home: "¿Te engañan con tu propia piel?" (mayúscula tras ¿), "El protocolo completo." (BuyBox), "Sin corticoides. Sin rebote." (Verdad), "Dos pasos. Una rutina." (Rutina), "Quienes ya lo viven." (Reviews), "La galería real." (GaleríaReal), "No vendemos un frasco. Te acompañamos 30 días." (Garantía), "Las dudas que más nos escriben." (FAQ), "No necesitas una piel perfecta." (Cierre).
  · Secciones legacy/otras: Spotlight ("El estándar"), Envíos ("Llegamos a tu puerta."), Gallery ("Tu paquete, de un vistazo."), Voces ("Personas reales. Resultados reales."), Hábitos ("Cuatro hábitos."), Origen ("Empezó con un diagnóstico."), Science ("La ciencia que se ve."), EsNoEs ("Qué es. Qué no es.").
  · Tienda: StoreHome ×7 ("El catálogo.", "Los más vendidos.", "Dos pasos. Una rutina.", "Pedir es así de simple.", "Padre e hijo. Doce años de investigación.", "Personas reales. Resultados reales.", "Lo que más nos escriben." + kicker "En su propia ruta"), StoreAbout ("Padre e hijo…", "Qué es. Qué no es."), StoreFaq ("Respuestas medidas."), StoreContact ("Hablemos de tu piel."), StoreProduct ("Completa tu protocolo."), placeholder "Tu correo electrónico".
  · content.ts: HERO.sub ("Parches temporales… Nutragenética de vanguardia."), RUTINA step titles ("Treatment · Anti-picor", "Moisturizer · Calma"), ENVIOS.regiones ("Toda Latinoamérica"), CIERRE.line ("Bienestar, atención y confianza…").
  · Verificación runtime: TreeWalker scanner en las 7 rutas → 0 arranques en minúscula (solo falsos positivos: colas doradas de titulares ya correctos y el email).
- LETRAS CORTADAS (root cause real, reproducido y fijado):
  · Reproducción: el wordmark dorado "COSALKA" del footer (120px, leading-none, background-clip:text) tenía TODOS los glifos cortados por la mitad en su base — visible a zoom 2.2×; persistía con overflow:visible → el recortador era la caja de pintura del background-clip, no la máscara.
  · Fix en globals.css .gold-text: la caja de pintura ahora se extiende verticalmente (padding: .12em 0 / margin: -.12em 0, neto cero) para que el degradado siempre cubra la tinta completa (acentos, descendentes, overshoot de redondas) incluso en zoom fraccional / DPI 125–150% de laptops Windows. Vertical-only a propósito: el horizontal había desplazado 5px el ancho de palabra y re-envuelto el hero.
  · GlowTitle: máscara de línea pb-[0.08em] → pb-[0.14em] — aire garantizado para descendentes (¿ g p q y) en cualquier OS.
  · Re-verify: zoom 2.2× → "COSALKA" con curvas y patas completas ✓.
- Hero fit re-tuneado (la "T" mayúscula de "¿Te" engrosó la línea 1 y la envolvía a 3 filas): clamp(2.6rem,6vw,6rem)/tracking-0.045em → clamp(2.6rem,5.85vw,5.35rem)/tracking-0.049em. Medido: 2 líneas exactas en 1440 (margen 134px en línea 2), 1600 y 1024 ✓.
- GOTCHA documentado: Turbopack cachea el chunk CSS raíz hasta reiniciar el server — dos reinicios de `bun run dev` para servir los cambios de globals.css (chunk estable "[root-of-the-server]__*.css").
- E2E: 7 rutas HTTP 200, zero overflow horizontal en 390px, hero/checkout/tienda/galería/footer screenshot-verified desktop+mobile, tsc (src limpio) + eslint limpios.

Stage Summary:
- La web entera ahora escribe con mayúscula inicial en titulares, CTAs, labels y frases clave — regla "¿+Mayúscula" incluida.
- Ninguna letra se corta: el bug de glifos dorados partidos por la mitad (background-clip:text en pantallas de escalado fraccional) está fixeado en la raíz con caja de pintura extendida, y las máscaras de GlowTitle tienen aire de descendentes; verificado a zoom 2.2× y en 1440/1024/390.

---
Task ID: 20
Agent: orchestrator (Z.ai Code main)
Task: "Agrega nuevos videos de la carpeta Drive (17a7BjLSy…) y en el inicio que reingrese el modelo 3d — te subí white_mesh.glb, solo mejóralo y agrégale el color"

Work Log:
- VIDEOS (7 nuevos desde la carpeta Drive del cliente, descargados con drive.usercontent.google.com + confirm=t, todos MP4 válidos verificados con file/ffprobe):
  · video-141336798.mp4 (1080×1920, 8s, macro de la crema) · video-242763909.mp4 (1080×1920, 8s, dúo sobre mármol en laboratorio) · video-gemini-8fb6fd96.mp4 + video-gemini-dc0eb139.mp4 (720×1280, 20s, educación "La psoriasis por dentro I/II") · video-nutragen-ia.mp4 (478×850, 10s, "Revolución Natural · IA") · video-mauricio-1.mp4 (480×848, 21s, testimonio WhatsApp Lizeth) · video-mauricio-2.mp4 (720×1280, 90s, "Origen · En el laboratorio"; poster regenerado a t=8s porque el frame inicial es fundido en negro). Total 8 piezas incl. el spot oficial que ya estaba (nutragen-hero-web.mp4).
  · Posters: ffmpeg -ss 0.6 -frames:v 1 scale=720 → public/videos/posters/*.jpg (8 archivos).
  · Nueva sección Videos.tsx "La filmoteca Nutragen." (id=filmoteca) insertada entre GaleriaReal y Garantia: feature landscape (spot, 1:00) lg:col-span-7 + 2 retratos col-span-5 + grid de 5 retratos (lg:grid-cols-5); cards con poster, play dorado, chip de duración, título + caption en mayúscula inicial (regla ortográfica); Dialog shadcn como "cine en página" (retrato sm:max-w-[440px], landscape sm:max-w-4xl), DialogTitle/Description sr-only, autoplay+controls, cierre con Escape verificado.
  · GOTCHA: main es pointer-events-none → el grid de la filmoteca necesita pointer-events-auto relative z-30 (como las demás secciones interactivas); sin eso el modal nunca abría.
  · GOTCHA: data-testid duplicados (slice(3) reiniciaba index) → index={i + 3}.
- MODELO 3D REAL (white_mesh.glb del cliente, 360KB, trimesh/PLY→GLB):
  · Anatomía real descifrada parseando el GLB a mano (¡ojo: el chunk binario GLB tiene header de 8 bytes!): botella Y-up h≈1.96 r≈0.32, 10002 verts / 20000 tris, SIN normales, SIN UVs, SIN materiales — malla blanca tipo escaneo con ruido orgánico de superficie.
  · GlbBottle.tsx nuevo (three/): (1) suavizado Taubin λ=0.52/μ=−0.53 ×24 pares construyendo adyacencia de vértices → elimina el ruido "papel arrugado" preservando volumen; luego computeVertexNormals. (2) split por triángulo según Y del centroide: tapa dorada cepillada #d4af37 (y>0.615), banda de etiqueta impresa (y∈[−0.42,0.02], arco ±0.975 rad frente y dorso con UVs cilíndricas generadas), cuerpo satinado #f6f4ef clearcoat+sheen. (3) collar toroide dorado #b8912e en y=0.615 que tapa la costura. (4) Animación: entrada rise+swing easeOutCubic 1.9s, flotación idle, parallax de puntero (listener de window, canvas pointer-events-none), dock a la derecha en desktop (x=vp.width*0.215) y lift +0.92/scale 0.74 en móvil. (5) StudioEnv + ContactShadows (posición/opacidad por breakpoint) + fallback GlowFallback si no hay WebGL + useGLTF.preload.
  · BUG CRÍTICO encontrado y fixeado con textura de diagnóstico (TOP/BOT/L/R + stripes): las UVs se escribían indexadas por posición del array de índices en vez de POR VÉRTICE (uv[vi*2]) → textura codificada como ruido; fix = Float32Array(pos.count*2) indexado por vi, u/v funciones puras de la posición.
  · GLB servido desde public/models/white_mesh.glb. make-label-texture.ts reutilizado sin cambios (etiqueta real: COSALKA, PASO 2, NUTRAGEN, miniaturas, ANTI-PICOR, CONT. NETO 500 ML); función de diagnóstico temporal eliminada tras calibrar.
  · Hero.tsx: vuelve a ser escenario oscuro cinematográfico con el 3D protagonista (aura dorada radial, scrims de legibilidad, blend a papel) reemplazando el video full-bleed; el copy verificado en Task 19 se conservó íntegro (kicker, GlowTitle, social proof, CTAs testids hero-buy/hero-store, chips, cue).
- E2E (agent-browser, reinciando sesión tras 3 "Not attached to an active page"): desktop 1440 — botella con etiqueta legible (zoom 2.2×), tapa dorada brillante, modal spot reproduciendo (playing=true, 0:13/1:00, readyState 4), modal retrato card-3 abre video-gemini-8fb6fd96 y cierra con Escape, CTA hero-buy → toast "Paquete Doble Acción añadido a la cesta" + drawer; móvil 390 — botella elevada tras el titular sin tapar CTAs, filmoteca en 1 col + grid 2 col, StickyBuyBar, footer sticky con letras doradas completas, scrollWidth=390 (0 overflow). bun run lint limpio; tsc: 0 errores en src/ (solo el scaffold preexistente de skills); dev.log sin errores runtime.
Stage Summary:
- El inicio vuelve a ser 3D con la malla REAL del cliente — no un maniquí blanco: superficie Taubin-suavizada, cuerpo satinado, tapa dorada de marca y la etiqueta Nutragen auténtica impresa sobre la propia malla (UVs cilíndricas corregidas por vértice).
- La filmoteca reúne las 8 piezas reales del cliente con posters generados y cine modal en página; todo el copy nuevo en mayúscula inicial.
- El video del hero anterior vive ahora dentro de la filmoteca como "Spot oficial · Nutragen" (nada se perdió).
