import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const seedDir = path.join(__dirname, 'seed-data');

// Route enrichment data keyed by route name
const routeEnrichment = {
  // ═══════════════════════════════════════════════════════════════
  // ALPS ROUTES
  // ═══════════════════════════════════════════════════════════════
  // Mont Blanc
  "Grands Mulets Route": { summary: "Historic 1786 first ascent route via the Bossons Glacier icefall and the Grands Mulets hut.", technicalGrade: "PD", commitment: "II", approachTime: 5, descentTime: 4, basecamp: "Grands Mulets Hut (3,051m)", permitRequired: false, permitInfo: null, closestAirport: "Geneva Airport (GVA)", safetyNotes: "The Bossons Icefall presents serious objective hazard from seracs and crevasses. Route conditions change rapidly throughout the season. Start early to minimize serac exposure and carry full crevasse rescue equipment." },
  "Innominata Ridge": { summary: "One of the great classic Alpine routes on Mont Blanc's Italian side via the Brouillard Pillars.", technicalGrade: "TD- (V, AI2)", commitment: "IV", approachTime: 6, descentTime: 8, basecamp: "Monzino Hut (2,590m)", permitRequired: false, permitInfo: null, closestAirport: "Geneva Airport (GVA)", safetyNotes: "Extremely long route likely requiring a bivouac. Complex route-finding through the Brouillard Pillars demands experience. Rockfall risk increases after midday. A stable weather window of 2+ days is essential." },
  "Brenva Spur": { summary: "A magnificent steep ice route on Mont Blanc's east face, one of the finest ice climbs in the Alps.", technicalGrade: "D (AI3)", commitment: "III", approachTime: 4, descentTime: 6, basecamp: "Trident Hut (3,680m)", permitRequired: false, permitInfo: null, closestAirport: "Geneva Airport (GVA)", safetyNotes: "The approach crosses below active seracs on the Brenva face. Start extremely early (midnight) to minimize exposure. The spur itself is relatively safe but the glacier approach is threatened. Descent via the Gouter route is long." },
  "Peuterey Integral Ridge": { summary: "The ultimate Mont Blanc route—a 2-3 day traverse of the complete Peuterey Ridge from Aiguille Noire to the summit.", technicalGrade: "TD+ (V+, AI3)", commitment: "V", approachTime: 5, descentTime: 8, basecamp: "Monzino Hut (2,590m)", permitRequired: false, permitInfo: null, closestAirport: "Geneva Airport (GVA)", safetyNotes: "One of the longest and most committing routes in the Alps with no easy escape once past the Aiguille Noire. Requires rock climbing to UIAA V+. A stable weather window of at least 3 days is absolutely essential. Multiple bivouacs required." },
  "Three Monts Route": { summary: "Classic traverse of Mont Blanc du Tacul, Mont Maudit, and Mont Blanc via the Cosmiques ridge.", technicalGrade: "AD (AI2)", commitment: "II", approachTime: 1, descentTime: 5, basecamp: "Cosmiques Hut (3,613m)", permitRequired: false, permitInfo: "Cosmiques Hut reservation required, book 2-3 months in advance via refuges.chamonix.com", closestAirport: "Geneva Airport (GVA)", safetyNotes: "Exposed ridge traverse with significant crevasse danger. The Mur de la Côte is steep and icy. Afternoon storms are common—start by 2am. The Tacul triangle can avalanche in warm conditions." },

  // Matterhorn
  "Hörnli Ridge": { summary: "The classic and most popular route on the Matterhorn, following the northeast ridge from the Hörnli Hut.", technicalGrade: "AD (UIAA III+)", commitment: "III", approachTime: 2.5, descentTime: 5, basecamp: "Hörnli Hut (3,260m)", permitRequired: false, permitInfo: "Hörnli Hut reservation essential, book months in advance. Guide requirement strongly recommended.", closestAirport: "Zurich Airport (ZRH)", safetyNotes: "Rockfall is a constant hazard especially from parties above. Fixed ropes on key sections can create bottlenecks. The Shoulder is often icy and the descent is where most accidents occur. Weather can change rapidly." },
  "Zmutt Ridge": { summary: "A grand mixed route on the Matterhorn's northwest ridge, less crowded than the Hörnli.", technicalGrade: "D (UIAA IV, AI2)", commitment: "III", approachTime: 4, descentTime: 6, basecamp: "Schönbiel Hut (2,694m)", permitRequired: false, permitInfo: null, closestAirport: "Zurich Airport (ZRH)", safetyNotes: "Route-finding is complex on the lower ridge. The teeth section requires careful navigation. Descent usually via the Hörnli Ridge which adds significant time. Late season ice on the upper ridge can increase difficulty." },
  "Italian Ridge (Lion Ridge)": { summary: "The historic Italian route up the Matterhorn's southwest ridge from Cervinia.", technicalGrade: "D (UIAA IV)", commitment: "III", approachTime: 3, descentTime: 5, basecamp: "Carrel Hut (3,830m)", permitRequired: false, permitInfo: "Carrel Hut reservation required. Italian Alpine Club membership may be needed.", closestAirport: "Milan Malpensa Airport (MXP)", safetyNotes: "Extensive fixed ropes and ladders on the ridge. The Great Tower requires careful climbing. Rockfall risk in the couloir sections. Weather exposure is significant on the upper ridge." },
  "North Face Direct": { summary: "One of the six great north faces of the Alps—a serious ice and mixed route on the Matterhorn's imposing north wall.", technicalGrade: "ED1 (WI4, M5)", commitment: "IV", approachTime: 3, descentTime: 6, basecamp: "Hörnli Hut (3,260m)", permitRequired: false, permitInfo: null, closestAirport: "Zurich Airport (ZRH)", safetyNotes: "Extremely serious undertaking with constant rockfall and icefall danger. Conditions are critical—the face must be well frozen. Start in the small hours and climb fast. The Schmid route is the most logical line." },

  // Eiger
  "1938 Route (Heckmair)": { summary: "The legendary first ascent route of the Eiger North Face, one of the most famous climbs in mountaineering history.", technicalGrade: "ED2 (WI5, M5, V+)", commitment: "V", approachTime: 2, descentTime: 4, basecamp: "Kleine Scheidegg (2,061m)", permitRequired: false, permitInfo: null, closestAirport: "Zurich Airport (ZRH)", safetyNotes: "Objectively one of the most dangerous routes in the Alps due to rockfall, icefall, and extreme weather exposure. The face creates its own weather systems. The Traverse of the Gods and White Spider are particularly exposed to stonefall. Only attempt in excellent, stable conditions." },
  "Mittellegi Ridge": { summary: "The elegant northeast ridge of the Eiger, offering exposed mixed climbing with spectacular positions.", technicalGrade: "D (UIAA IV, AI2)", commitment: "III", approachTime: 3, descentTime: 4, basecamp: "Mittellegi Hut (3,355m)", permitRequired: false, permitInfo: "Mittellegi Hut reservation required, very limited capacity.", closestAirport: "Zurich Airport (ZRH)", safetyNotes: "Extremely exposed ridge with significant rockfall hazard. The knife-edge sections require careful climbing. Descent via the West Flank is complex. Fixed ropes on key sections." },
  "West Flank": { summary: "The standard route on the Eiger, a glaciated climb up the western side.", technicalGrade: "AD (AI1)", commitment: "II", approachTime: 3, descentTime: 3, basecamp: "Kleine Scheidegg (2,061m)", permitRequired: false, permitInfo: null, closestAirport: "Zurich Airport (ZRH)", safetyNotes: "Crevasse danger on the glacier approach. The upper snowfield can be icy and steep early in the day. Rockfall from the west ridge is possible. Route-finding in poor visibility requires navigation skills." },

  // Grandes Jorasses
  "Walker Spur": { summary: "One of the six great north faces and perhaps the finest rock route in the Alps—sustained climbing on the Grandes Jorasses.", technicalGrade: "ED2 (VI, A1)", commitment: "V", approachTime: 3, descentTime: 6, basecamp: "Leschaux Hut (2,431m)", permitRequired: false, permitInfo: null, closestAirport: "Geneva Airport (GVA)", safetyNotes: "Extremely sustained route with 1,200m of climbing. Rockfall is a major hazard especially in warm conditions. The face is cold and north-facing—hypothermia risk is real. Weather changes can trap climbers on the wall for days." },
  "Croz Spur": { summary: "A classic mixed line on the north face of the Grandes Jorasses, often the first big north face route for aspiring alpinists.", technicalGrade: "ED1 (WI4, V)", commitment: "IV", approachTime: 3, descentTime: 6, basecamp: "Leschaux Hut (2,431m)", permitRequired: false, permitInfo: null, closestAirport: "Geneva Airport (GVA)", safetyNotes: "Serious north face with sustained mixed climbing. The couloir approach is threatened by icefall. Start very early and move fast through the danger zones. Conditions must be cold and stable." },

  // Aiguille Verte
  "Whymper Couloir": { summary: "The classic and most popular route on the Aiguille Verte—a steep and beautiful couloir.", technicalGrade: "AD+ (AI3)", commitment: "II", approachTime: 2, descentTime: 3, basecamp: "Couvercle Hut (2,687m)", permitRequired: false, permitInfo: null, closestAirport: "Geneva Airport (GVA)", safetyNotes: "The couloir funnels rockfall from above—climb early when everything is frozen. The bergschrund at the base can be problematic late season. Steep sustained ice requires confident crampon technique." },
  "Couturier Couloir": { summary: "A striking direct line on the north face of the Aiguille Verte, steeper and more serious than the Whymper.", technicalGrade: "D (AI4)", commitment: "III", approachTime: 3, descentTime: 3, basecamp: "Argentière Hut (2,771m)", permitRequired: false, permitInfo: null, closestAirport: "Geneva Airport (GVA)", safetyNotes: "Very steep ice couloir reaching 55 degrees. Must be climbed in cold, frozen conditions to avoid rockfall and ice collapse. Early season offers the best conditions. The bergschrund crossing can be very difficult." },

  // Gran Paradiso
  "Normal Route (South Face)": { summary: "The easiest 4,000m peak in the Alps—a glacier route requiring only basic mountaineering skills.", technicalGrade: "F+ (glacier)", commitment: "I", approachTime: 3, descentTime: 2.5, basecamp: "Vittorio Emanuele II Hut (2,735m)", permitRequired: false, permitInfo: "Hut reservation recommended in summer. Gran Paradiso National Park entry is free.", closestAirport: "Turin Airport (TRN)", safetyNotes: "Crevassed glacier requires rope travel. The summit Madonna statue involves an exposed step. Afternoon thunderstorms are common in summer. Despite being the easiest 4,000er, altitude sickness can still affect climbers." },

  // Piz Bernina
  "Biancograt": { summary: "The stunning white ridge of Piz Bernina—one of the most beautiful and photogenic Alpine ridges.", technicalGrade: "AD (AI2, UIAA III)", commitment: "III", approachTime: 3, descentTime: 4, basecamp: "Tschierva Hut (3,583m)", permitRequired: false, permitInfo: null, closestAirport: "Zurich Airport (ZRH)", safetyNotes: "Extremely exposed snow and ice ridge with cornices. The ridge can be knife-edge sharp requiring careful balance. Weather changes rapidly at this altitude. The descent via Spalla Ridge requires route-finding skills." },
  "Spallagrat": { summary: "The normal route on Piz Bernina via the Spalla Ridge, a classic mixed route.", technicalGrade: "AD- (UIAA III, AI1)", commitment: "II", approachTime: 3, descentTime: 3, basecamp: "Marco e Rosa Hut (3,609m)", permitRequired: false, permitInfo: null, closestAirport: "Zurich Airport (ZRH)", safetyNotes: "Exposed ridge with mixed terrain. Cornices can develop on either side. The approach glacier has crevasses. Fixed ropes on the steeper sections may be iced up early in the season." },

  // Grossglockner
  "Normal Route (Stüdlgrat)": { summary: "The standard route on Austria's highest peak via the elegant Stüdl Ridge.", technicalGrade: "AD- (UIAA II+)", commitment: "II", approachTime: 3, descentTime: 3, basecamp: "Stüdl Hut (2,802m)", permitRequired: false, permitInfo: "Stüdl Hut reservation essential in summer season.", closestAirport: "Salzburg Airport (SZG)", safetyNotes: "Exposed ridge climbing with some loose rock. The Kleinglockner traverse is very exposed. Afternoon thunderstorms are frequent—plan for an early start. Snow conditions on the upper ridge can make the route significantly harder." },

  // Weisshorn
  "East Ridge": { summary: "A classic long snow and ice ridge on one of the most beautiful peaks in the Alps.", technicalGrade: "AD (AI2)", commitment: "III", approachTime: 4, descentTime: 5, basecamp: "Weisshorn Hut (2,932m)", permitRequired: false, permitInfo: null, closestAirport: "Geneva Airport (GVA)", safetyNotes: "Very long route with sustained exposure. The Grand Gendarme requires careful navigation. Cornices can overhang the south face. An early start is essential to complete the route before afternoon weather. Descent is long and tiring." },
  "North Ridge": { summary: "A magnificent and committing snow ridge on the Weisshorn, one of the great Alpine snow traverses.", technicalGrade: "D (AI3)", commitment: "IV", approachTime: 5, descentTime: 5, basecamp: "Tracuit Hut (3,256m)", permitRequired: false, permitInfo: null, closestAirport: "Geneva Airport (GVA)", safetyNotes: "Extremely long and committing ridge with no easy escape. Cornices are a serious hazard throughout. The ridge narrows to knife-edge in several places. Only attempt in settled weather with excellent snow conditions." },

  // Monte Rosa
  "Normal Route (Dufourspitze)": { summary: "The standard ascent of the highest peak in Switzerland via the Monte Rosa Hut and west flank.", technicalGrade: "AD- (AI1, UIAA II)", commitment: "II", approachTime: 4, descentTime: 3.5, basecamp: "Monte Rosa Hut (2,883m)", permitRequired: false, permitInfo: "Monte Rosa Hut reservation essential, book well in advance.", closestAirport: "Zurich Airport (ZRH)", safetyNotes: "Heavily crevassed glaciers on the approach. The summit ridge is exposed and can be icy. Altitude (4,634m) causes problems for unacclimatized climbers. Route-finding in whiteout conditions is very difficult." },
  "Marinelli Couloir": { summary: "A serious and steep ice couloir on the east face of Monte Rosa—one of the most dangerous routes in the Alps.", technicalGrade: "ED1 (AI4, 55°)", commitment: "IV", approachTime: 4, descentTime: 6, basecamp: "Marinelli Hut (2,813m)", permitRequired: false, permitInfo: null, closestAirport: "Milan Malpensa Airport (MXP)", safetyNotes: "One of the most objectively dangerous routes in the Alps due to constant serac and rockfall from the massive east face. Many fatalities have occurred here. Only climb in cold, frozen conditions and move extremely fast through the danger zone." },

  // ═══════════════════════════════════════════════════════════════
  // WORLD ROUTES (routes-world.json)
  // ═══════════════════════════════════════════════════════════════
  // Everest
  "South Col Route": { summary: "The standard Nepal route on Everest via the Khumbu Icefall, Western Cwm, and South Col—the most popular path to the highest point on Earth.", technicalGrade: "AI2, 5.6", commitment: "VI", approachTime: 120, descentTime: 48, basecamp: "Everest Base Camp (5,364m)", permitRequired: true, permitInfo: "Nepal government climbing permit required (~$11,000 per person). Must be arranged through licensed expedition operator with minimum 6-week lead time.", closestAirport: "Tribhuvan International Airport (KTM)", safetyNotes: "The Khumbu Icefall is objectively dangerous with shifting seracs. Altitude sickness and HACE/HAPE are the primary medical risks above 7,000m. Supplemental oxygen is standard above Camp 3. The Hillary Step involves exposed climbing at extreme altitude." },
  "Northeast Ridge": { summary: "The standard route from the Tibet side via the East Rongbuk Glacier, North Col, and the Northeast Ridge.", technicalGrade: "AI2, 5.7", commitment: "VI", approachTime: 96, descentTime: 36, basecamp: "Everest Base Camp North (5,150m)", permitRequired: true, permitInfo: "Chinese Tibet Mountaineering Association (CTMA) permit required (~$9,500). Must go through authorized Chinese operator.", closestAirport: "Lhasa Gonggar Airport (LXA)", safetyNotes: "The Second Step involves technical climbing at extreme altitude (8,610m) with a fixed ladder. Fierce winds on the Northeast Ridge can halt progress. The traverse above 8,500m is extremely exposed. Oxygen is standard." },
  "West Ridge": { summary: "A challenging variation on Everest ascending the West Ridge and West Shoulder, first climbed in 1963.", technicalGrade: "AI3, 5.8", commitment: "VI", approachTime: 120, descentTime: 48, basecamp: "Everest Base Camp (5,364m)", permitRequired: true, permitInfo: "Nepal government climbing permit required (~$11,000). Additional permit fees may apply for new route attempts.", closestAirport: "Tribhuvan International Airport (KTM)", safetyNotes: "Less established than the South Col route with fewer fixed ropes. The West Shoulder is exposed to high winds. Route-finding above the Yellow Band is complex. Very few ascents mean less rescue infrastructure." },

  // K2
  "Abruzzi Spur": { summary: "The classic route on K2 following the southeast ridge—technically demanding at extreme altitude.", technicalGrade: "AI3, 5.8, M4", commitment: "VI", approachTime: 168, descentTime: 72, basecamp: "K2 Base Camp (5,135m)", permitRequired: true, permitInfo: "Pakistan government climbing permit required (~$7,200 per person). Must arrange through licensed operator. Minimum 2-3 month lead time.", closestAirport: "Islamabad International Airport (ISB)", safetyNotes: "K2 is the most dangerous 8,000m peak with a historically high fatality rate. The Bottleneck and traverse below the seracs is the crux danger zone. Rockfall on House's Chimney is frequent. Weather windows are extremely narrow." },

  // Mont Blanc (world file versions)
  "Gouter Route": { summary: "The most popular route on Mont Blanc via the Goûter Hut—the standard French route to Western Europe's highest summit.", technicalGrade: "F+ (PD-)", commitment: "II", approachTime: 5, descentTime: 4, basecamp: "Goûter Hut (3,817m)", permitRequired: false, permitInfo: "Goûter Hut reservation mandatory, books out months in advance. Limited to 120 climbers/day via online booking system.", closestAirport: "Geneva Airport (GVA)", safetyNotes: "The Grand Couloir (Gouter Couloir) crossing is the most dangerous section due to constant rockfall. Many fatalities occur here annually. Cross quickly and early in the morning. The summit ridge can be icy and exposed." },

  // Denali
  "West Buttress": { summary: "The standard route on North America's highest peak—a classic expedition requiring 2-3 weeks.", technicalGrade: "AI2, 5.4", commitment: "IV", approachTime: 48, descentTime: 24, basecamp: "14,200ft Camp (4,328m)", permitRequired: true, permitInfo: "NPS climbing permit required ($415 per person). Register 60+ days in advance via recreation.gov. Mandatory orientation at Talkeetna ranger station.", closestAirport: "Ted Stevens Anchorage International Airport (ANC)", safetyNotes: "Extreme cold and high winds are the primary hazards—temperatures can drop below -40°C. Altitude sickness is common due to the mountain's high latitude. Crevasse danger throughout. The Headwall above 14 camp is steep and exposed." },

  // Matterhorn (world file)
  "Hörnli Ridge (Normal Route)": { summary: "The classic northeast ridge of the Matterhorn, the most famous alpine climbing route in the world.", technicalGrade: "AD (UIAA III+)", commitment: "III", approachTime: 2.5, descentTime: 5, basecamp: "Hörnli Hut (3,260m)", permitRequired: false, permitInfo: "Hörnli Hut reservation essential, book months in advance.", closestAirport: "Zurich Airport (ZRH)", safetyNotes: "Rockfall is a constant hazard from parties above. The descent is technically more dangerous than the ascent. Fixed ropes create bottlenecks. Weather changes rapidly." },

  // Rainier
  "Disappointment Cleaver": { summary: "The most popular route on Mount Rainier via Camp Muir and the Disappointment Cleaver rock rib.", technicalGrade: "AI1, 5.3", commitment: "II", approachTime: 6, descentTime: 4, basecamp: "Camp Muir (3,072m)", permitRequired: true, permitInfo: "NPS climbing permit required ($52 per person). Register at recreation.gov. Solo climbing prohibited.", closestAirport: "Seattle-Tacoma International Airport (SEA)", safetyNotes: "Crevasse danger is significant on the Ingraham Glacier. Icefall from the Ingraham headwall threatens the route. Weather deteriorates rapidly. Altitude sickness affects many climbers above Camp Muir." },

  // Whitney
  "Mount Whitney Trail": { summary: "The standard hiking trail to the highest point in the contiguous United States.", technicalGrade: "Class 1 (hiking)", commitment: "I", approachTime: 6, descentTime: 4, basecamp: "Whitney Portal (2,550m)", permitRequired: true, permitInfo: "Day-use permit required ($15) via recreation.gov lottery. Extremely competitive—apply in February for summer permits.", closestAirport: "Los Angeles International Airport (LAX)", safetyNotes: "Altitude sickness is the primary concern at 4,421m. Lightning strikes on the exposed summit plateau are a serious hazard. Start before dawn to avoid afternoon thunderstorms. The 99 switchbacks are exhausting but not technical." },
  "Mountaineers Route": { summary: "A challenging couloir route on Whitney's east face, the classic mountaineering alternative to the trail.", technicalGrade: "Class 3 (AI1 when snowy)", commitment: "II", approachTime: 4, descentTime: 3, basecamp: "Whitney Portal (2,550m)", permitRequired: true, permitInfo: "Same permit requirements as Whitney Trail. Day-use or overnight permit via recreation.gov lottery.", closestAirport: "Los Angeles International Airport (LAX)", safetyNotes: "Loose rock in the couloir creates constant rockfall hazard. Early season snow adds avalanche risk. The notch at the top is exposed class 3 scrambling. Self-arrest skills required when snow is present." },

  // Aconcagua
  "Normal Route (Northwest Ridge)": { summary: "The standard non-technical route on the highest peak in the Southern Hemisphere.", technicalGrade: "F (hiking/scramble)", commitment: "III", approachTime: 48, descentTime: 12, basecamp: "Plaza de Mulas (4,370m)", permitRequired: true, permitInfo: "Mendoza provincial government permit required ($800-$950 high season, $450 low season). Book online at aconcagua.mendoza.gov.ar.", closestAirport: "Mendoza Airport (MDZ)", safetyNotes: "Extreme altitude (6,962m) without supplemental oxygen is the main challenge. Viento Blanco (white wind) storms can be deadly. Proper acclimatization schedule is critical. Hypothermia and frostbite risk even on clear days." },
  "Polish Glacier": { summary: "A classic glaciated route on Aconcagua's east face offering a more technical alternative to the Normal Route.", technicalGrade: "PD (AI2, 40°)", commitment: "III", approachTime: 48, descentTime: 12, basecamp: "Plaza Argentina (4,200m)", permitRequired: true, permitInfo: "Same permit requirements as Normal Route. Polish Glacier approach via the Vacas Valley requires separate mule service.", closestAirport: "Mendoza Airport (MDZ)", safetyNotes: "Steeper and more committing than the Normal Route. Penitentes (ice formations) can make travel extremely difficult. Avalanche risk on the glacier after snowfall. Same altitude hazards as all Aconcagua routes." },

  // Kilimanjaro
  "Machame Route": { summary: "The most scenic route on Kilimanjaro, known as the 'Whiskey Route' for its steeper and more challenging profile.", technicalGrade: "Class 1 (hiking)", commitment: "II", approachTime: 36, descentTime: 12, basecamp: "Machame Gate (1,640m)", permitRequired: true, permitInfo: "Tanzania National Parks Authority (TANAPA) fees required: $70/day park fee + $20/day camping fee + guide/porter fees. Total ~$1,000-2,000 in park fees for 6-7 day trek.", closestAirport: "Kilimanjaro International Airport (JRO)", safetyNotes: "Altitude sickness is the primary hazard—Kilimanjaro's summit is 5,895m. Proper acclimatization with a 6-7 day itinerary is essential. Summit night is extremely cold and exhausting. Descend immediately if symptoms of HACE or HAPE appear." },
  "Marangu Route": { summary: "The oldest and most established route on Kilimanjaro, known as the 'Coca-Cola Route' with hut accommodations.", technicalGrade: "Class 1 (hiking)", commitment: "I", approachTime: 30, descentTime: 10, basecamp: "Marangu Gate (1,860m)", permitRequired: true, permitInfo: "TANAPA fees plus hut accommodation fees (~$60/night). Total park fees typically $800-1,500 for 5-6 days.", closestAirport: "Kilimanjaro International Airport (JRO)", safetyNotes: "Despite being considered the easiest route, the success rate is lower due to shorter acclimatization schedules. Altitude sickness remains the primary risk. The direct ascent profile doesn't allow for proper acclimatization." },

  // Elbrus
  "Normal Route (South Side)": { summary: "The standard route on Europe's highest peak via the Barrels Huts and the south face snowfields.", technicalGrade: "F (glacier hiking)", commitment: "I", approachTime: 4, descentTime: 3, basecamp: "Barrels Huts (3,800m)", permitRequired: false, permitInfo: "No formal climbing permit required. National park fee of ~$5. Border zone permit may be required for non-Russian citizens.", closestAirport: "Mineralnye Vody Airport (MRV)", safetyNotes: "Severe weather and whiteout conditions are the main hazards. Many climbers have died in storms becoming disoriented on the featureless upper slopes. GPS navigation is essential. Altitude at 5,642m causes problems for unacclimatized climbers." },

  // Fuji
  "Yoshida Trail": { summary: "The most popular trail on Mount Fuji, starting from the fifth station on the north side.", technicalGrade: "Class 1 (hiking)", commitment: "I", approachTime: 6, descentTime: 3, basecamp: "Yoshida Fifth Station (2,305m)", permitRequired: false, permitInfo: "No permit required but ¥1,000 (~$7) conservation fee requested. Mountain hut reservations essential during climbing season (July-August).", closestAirport: "Tokyo Narita International Airport (NRT)", safetyNotes: "Altitude sickness is common despite the moderate elevation. Rock slides occur on the loose volcanic terrain. Lightning storms develop quickly in summer afternoons. The climbing season is limited to July-August; conditions outside this window are dangerous." },

  // Pikes Peak
  "Barr Trail": { summary: "A long but well-maintained trail to the summit of iconic Pikes Peak in Colorado Springs.", technicalGrade: "Class 1 (hiking)", commitment: "I", approachTime: 6, descentTime: 4, basecamp: "Barr Trail Trailhead (2,003m)", permitRequired: false, permitInfo: "No permit required. Barr Camp (halfway shelter) reservations recommended for overnight trips.", closestAirport: "Colorado Springs Airport (COS)", safetyNotes: "Afternoon thunderstorms with lightning are very common—start early and plan to be below treeline by noon. The trail is 13 miles one way with 2,300m of gain. Altitude affects many visitors. Bring plenty of water as the trail is sun-exposed." },

  // Mount Hood
  "South Side (Hogsback)": { summary: "The standard route on Oregon's highest peak via the Hogsback snow ridge and Pearly Gates.", technicalGrade: "AI1, Class 3", commitment: "I", approachTime: 3, descentTime: 2, basecamp: "Timberline Lodge (1,800m)", permitRequired: true, permitInfo: "Wilderness permit required (free, self-issue at trailhead). Climbers must register at climbingpass.com ($15).", closestAirport: "Portland International Airport (PDX)", safetyNotes: "Rockfall and icefall in the Pearly Gates is the main hazard. Bergschrund crossing above the Hogsback can be difficult late season. Fumarole gases near the summit crater. Start by midnight for safe conditions." },

  // Grand Teton
  "Owen-Spalding Route": { summary: "The standard mountaineering route on the Grand Teton via the Upper Saddle and Owen chimney.", technicalGrade: "5.4", commitment: "II", approachTime: 5, descentTime: 4, basecamp: "Lower Saddle (3,776m)", permitRequired: true, permitInfo: "Free backcountry camping permit required from Jenny Lake Ranger Station. Apply in person or by fax.", closestAirport: "Jackson Hole Airport (JAC)", safetyNotes: "Exposed class 5 climbing near the summit requires roped climbing skills. Rockfall in the couloir approaches. Lightning risk on the exposed summit. The rappel off the Owen route can be tricky in descent." },

  // Shasta
  "Avalanche Gulch": { summary: "The most popular route on Mount Shasta via Horse Camp and Avalanche Gulch snowfield.", technicalGrade: "AI1, Class 2", commitment: "I", approachTime: 5, descentTime: 3, basecamp: "Horse Camp (2,440m)", permitRequired: true, permitInfo: "Summit pass required ($25). Wilderness permit required (free, self-issue). Available at the ranger station in Mt Shasta city.", closestAirport: "Redding Municipal Airport (RDD)", safetyNotes: "Avalanche danger is significant, especially in spring. Icefall from the upper mountain threatens the gulch. Altitude sickness at 4,322m. Sun exposure is intense on the open snowfield—bring sun protection." },

  // Eiger (world file)
  "North Face (1938 Route)": { summary: "The legendary first ascent route of the Eiger North Face—one of mountaineering's most iconic and feared climbs.", technicalGrade: "ED2 (WI5, M5, V+)", commitment: "V", approachTime: 2, descentTime: 4, basecamp: "Kleine Scheidegg (2,061m)", permitRequired: false, permitInfo: null, closestAirport: "Zurich Airport (ZRH)", safetyNotes: "The most dangerous route in the Alps with constant objective hazard from rockfall, icefall, and storms. The wall creates its own microclimate. Only attempt in the most stable conditions. The White Spider and Traverse of the Gods are the most dangerous sections." },

  // Mount Cook
  "Linda Glacier": { summary: "The standard route on New Zealand's highest peak via the Linda Glacier on the east side.", technicalGrade: "AD (AI2)", commitment: "III", approachTime: 6, descentTime: 5, basecamp: "Plateau Hut (2,200m)", permitRequired: false, permitInfo: "No climbing permit required. DOC hut fees apply (~NZ$36/night). Register intentions with DOC or AdventureSmart.", closestAirport: "Christchurch Airport (CHC)", safetyNotes: "New Zealand weather is extremely changeable—conditions can go from fine to severe storm in hours. The Linda Glacier has massive crevasses. The summit ice cap is unstable and large collapses have occurred. Rockfall on the approach." },

  // Baker
  "Coleman-Deming Route": { summary: "The standard route on Mount Baker via the Coleman Glacier—a classic Pacific Northwest glacier climb.", technicalGrade: "AI1, Class 2", commitment: "I", approachTime: 4, descentTime: 3, basecamp: "Coleman Glacier Camp (1,800m)", permitRequired: true, permitInfo: "Free wilderness permit required (self-issue at trailhead). Northwest Forest Pass ($5/day) for parking.", closestAirport: "Seattle-Tacoma International Airport (SEA)", safetyNotes: "Large crevasses on the Coleman Glacier require careful navigation. The Roman Wall is steep and can be icy. Whiteout conditions are common. The summit crater has volcanic fumaroles—avoid breathing concentrated gases." },

  // Mont Blanc du Tacul
  "Normal Route (Triangle du Tacul)": { summary: "A popular moderate snow/ice route near Chamonix, often used as a training peak for bigger objectives.", technicalGrade: "PD+ (AI2, 50°)", commitment: "I", approachTime: 1, descentTime: 1.5, basecamp: "Cosmiques Hut (3,613m)", permitRequired: false, permitInfo: "Cosmiques Hut reservation recommended.", closestAirport: "Geneva Airport (GVA)", safetyNotes: "The Triangle face can avalanche in warm conditions. Crevasses on the approach glacier. The Aiguille du Midi cable car access means the mountain is very busy. Start early to avoid afternoon softening." },

  // Huascaran
  "Normal Route (Garganta)": { summary: "The standard route on Peru's highest peak via the col between the twin summits.", technicalGrade: "AD- (AI2)", commitment: "III", approachTime: 12, descentTime: 8, basecamp: "Huascaran Base Camp (4,300m)", permitRequired: true, permitInfo: "Huascaran National Park entry fee (~$22 for 21 days). No separate climbing permit but registration required.", closestAirport: "Lima Jorge Chávez International Airport (LIM)", safetyNotes: "Extremely dangerous serac zone above the Garganta col. A massive serac collapse in 1970 killed 20,000+ people in the valley below. Avalanche danger is high throughout. Acclimatize thoroughly in Huaraz before attempting." },

  // Adams
  "South Spur Route": { summary: "A long but non-technical glacier route on Washington's second-highest volcano.", technicalGrade: "Class 2 (glacier)", commitment: "I", approachTime: 5, descentTime: 3, basecamp: "Cold Springs Campground (1,750m)", permitRequired: true, permitInfo: "Cascade Volcanoes permit required ($15). Northwest Forest Pass for parking. Self-issue at trailhead.", closestAirport: "Portland International Airport (PDX)", safetyNotes: "Crevasses on the upper Adams Glacier can be hidden by snow. Volcanic loose rock makes footing treacherous. Altitude sickness at 3,743m. Long exposed approach with no shelter from weather." },

  // Puncak Jaya (Carstensz Pyramid)
  "Normal Route (North Face)": { summary: "The standard route on Oceania's highest peak—technical rock climbing in a remote tropical jungle setting.", technicalGrade: "5.8 (UIAA V+)", commitment: "III", approachTime: 48, descentTime: 24, basecamp: "Base Camp (4,300m)", permitRequired: true, permitInfo: "Indonesian government climbing permit required (very expensive, $3,000-$5,000+). Freeport mine access or helicopter required. Must use authorized operator.", closestAirport: "Timika Airport (TIM)", safetyNotes: "The approach through dense tropical jungle is arduous and may require days. Political instability in the region is a concern. The rock climbing is at altitude on sometimes wet limestone. Fixed ropes on the summit wall." },

  // Vinson
  "Normal Route (Branscomb Glacier)": { summary: "The standard route on Antarctica's highest peak—logistically complex but technically straightforward.", technicalGrade: "F+ (glacier hiking)", commitment: "III", approachTime: 8, descentTime: 6, basecamp: "Vinson Base Camp (2,140m)", permitRequired: false, permitInfo: "No government permit required but extremely expensive logistics ($45,000-$55,000) through ALE (Antarctic Logistics and Expeditions) or similar operator. Flight from Punta Arenas to Union Glacier.", closestAirport: "Punta Arenas Airport (PUQ)", safetyNotes: "Extreme cold is the primary hazard—temperatures can drop below -40°C. Whiteout conditions on the featureless upper glacier. No rescue services available. Complete self-sufficiency required. Frostbite risk is very high." },

  // Cho Oyu
  "Northwest Face": { summary: "The easiest 8,000m peak and a popular stepping stone to Everest, ascended via the northwest face from Tibet.", technicalGrade: "AD- (AI2)", commitment: "V", approachTime: 72, descentTime: 24, basecamp: "Cho Oyu Base Camp (5,700m)", permitRequired: true, permitInfo: "CTMA (Chinese Tibet Mountaineering Association) permit required (~$9,000). Must arrange through authorized Chinese operator.", closestAirport: "Tribhuvan International Airport (KTM)", safetyNotes: "Despite being the easiest 8,000er, altitude at 8,188m is extremely dangerous. HACE and HAPE can be fatal. The ice cliff at Camp 2 requires fixed ropes. Supplemental oxygen recommended above 7,500m. Weather windows are short." },

  // Olympus
  "Mytikas via Prionia": { summary: "The standard hiking route to the summit of Greece's mythological Mount Olympus.", technicalGrade: "Class 2-3 (scramble)", commitment: "I", approachTime: 6, descentTime: 4, basecamp: "Refuge A (Spilios Agapitos) (2,100m)", permitRequired: false, permitInfo: "No permit required. Refuge booking recommended in summer (~€15/night).", closestAirport: "Thessaloniki Airport (SKG)", safetyNotes: "The final scramble to Mytikas summit is exposed class 3 with significant drop-offs. Loose rock on the summit ridge. Lightning storms are common on the exposed summit. Vertigo-inducing positions near the top." },
};

// Gear enrichment data - adds weight, priceRange, specificProduct and links to existing gear
const gearEnrichment = {
  // Climbing gear
  "Crevasse rescue kit": { weight: "1.5kg", priceRange: "$120-$200", specificProduct: "Petzl RAD System", links: [
    { retailer: "REI", productName: "Petzl RAD System", url: "https://www.rei.com/product/151159/petzl-rad-system", price: 169.95 },
    { retailer: "Backcountry", productName: "Petzl RAD Line Rescue Kit", url: "https://www.backcountry.com/petzl-rad-line-rescue-kit", price: 169.95 },
  ]},
  "Crampons": { weight: "950g", priceRange: "$180-$300", specificProduct: "Petzl Lynx Crampons", links: [
    { retailer: "REI", productName: "Petzl Lynx Leverlock Crampons", url: "https://www.rei.com/product/151161/petzl-lynx-leverlock-crampons", price: 249.95 },
    { retailer: "Backcountry", productName: "Petzl Lynx Crampons", url: "https://www.backcountry.com/petzl-lynx-crampon", price: 249.95 },
    { retailer: "Amazon", productName: "Petzl LYNX Crampons", url: "https://www.amazon.com/dp/B00DGTAZ5I", price: 239.95 },
  ]},
  "Rope (50m)": { weight: "2.8kg", priceRange: "$180-$350", specificProduct: "Beal Joker 9.1mm x 50m", links: [
    { retailer: "REI", productName: "Beal Joker Unicore Dry Cover 9.1mm", url: "https://www.rei.com/product/177584/beal-joker-unicore-dry-cover", price: 219.95 },
    { retailer: "Backcountry", productName: "Beal Joker 9.1 Dry Cover Rope", url: "https://www.backcountry.com/beal-joker-dry-cover-rope", price: 219.95 },
  ]},
  "Light rock rack": { weight: "2.0kg", priceRange: "$300-$500", specificProduct: "Black Diamond Camalot C4 Set (0.3-3)", links: [
    { retailer: "REI", productName: "Black Diamond Camalot C4 Rack Pack", url: "https://www.rei.com/product/188285/black-diamond-camalot-c4-rack-pack", price: 449.95 },
    { retailer: "Backcountry", productName: "Black Diamond Camalot C4 Set", url: "https://www.backcountry.com/black-diamond-camalot-c4", price: 449.95 },
  ]},
  "Bivouac gear": { weight: "1.8kg", priceRange: "$200-$400", specificProduct: "SOL Escape Bivvy + Thermarest NeoAir", links: [
    { retailer: "REI", productName: "SOL Escape Pro Bivvy", url: "https://www.rei.com/product/129280/sol-escape-pro-bivvy", price: 59.95 },
    { retailer: "REI", productName: "Therm-a-Rest NeoAir XLite NXT", url: "https://www.rei.com/product/200060/therm-a-rest-neoair-xlite-nxt", price: 219.95 },
  ]},
  "Bivouac equipment": { weight: "1.8kg", priceRange: "$200-$400", specificProduct: "SOL Escape Bivvy + Thermarest NeoAir", links: [
    { retailer: "REI", productName: "SOL Escape Pro Bivvy", url: "https://www.rei.com/product/129280/sol-escape-pro-bivvy", price: 59.95 },
    { retailer: "REI", productName: "Therm-a-Rest NeoAir XLite NXT", url: "https://www.rei.com/product/200060/therm-a-rest-neoair-xlite-nxt", price: 219.95 },
  ]},
  "Ice tools": { weight: "1.1kg", priceRange: "$250-$500", specificProduct: "Petzl Quark Ice Axe", links: [
    { retailer: "REI", productName: "Petzl Quark Ice Axe", url: "https://www.rei.com/product/151163/petzl-quark-ice-axe", price: 279.95 },
    { retailer: "Backcountry", productName: "Petzl Quark Adze Ice Tool", url: "https://www.backcountry.com/petzl-quark-ice-tool", price: 279.95 },
    { retailer: "Amazon", productName: "Petzl Quark Technical Ice Axe", url: "https://www.amazon.com/dp/B07GZC5QRN", price: 269.00 },
  ]},
  "Technical ice tools": { weight: "1.2kg", priceRange: "$350-$600", specificProduct: "Petzl Nomic Ice Tool", links: [
    { retailer: "REI", productName: "Petzl Nomic Ice Tool", url: "https://www.rei.com/product/151450/petzl-nomic-ice-tool", price: 349.95 },
    { retailer: "Backcountry", productName: "Petzl Nomic Ice Tool", url: "https://www.backcountry.com/petzl-nomic-ice-tool", price: 349.95 },
  ]},
  "Ice screws (6+)": { weight: "900g", priceRange: "$200-$350", specificProduct: "Petzl Laser Speed Light Ice Screw Set", links: [
    { retailer: "REI", productName: "Petzl Laser Speed Light Ice Screw", url: "https://www.rei.com/product/151164/petzl-laser-speed-light-ice-screw", price: 54.95 },
    { retailer: "Backcountry", productName: "Petzl Laser Speed Light Screw", url: "https://www.backcountry.com/petzl-laser-speed-light-screw", price: 54.95 },
  ]},
  "Helmet": { weight: "230g", priceRange: "$60-$120", specificProduct: "Petzl Sirocco Helmet", links: [
    { retailer: "REI", productName: "Petzl Sirocco Climbing Helmet", url: "https://www.rei.com/product/115070/petzl-sirocco-climbing-helmet", price: 99.95 },
    { retailer: "Backcountry", productName: "Petzl Sirocco Helmet", url: "https://www.backcountry.com/petzl-sirocco-helmet", price: 99.95 },
    { retailer: "Amazon", productName: "Petzl SIROCCO Ultra-Lightweight Helmet", url: "https://www.amazon.com/dp/B016P0GBPI", price: 94.95 },
  ]},
  "Full rock rack": { weight: "3.5kg", priceRange: "$500-$800", specificProduct: "Black Diamond Camalot C4 Full Set + Nuts", links: [
    { retailer: "REI", productName: "Black Diamond Camalot C4 Full Rack", url: "https://www.rei.com/product/188285/black-diamond-camalot-c4-rack-pack", price: 449.95 },
    { retailer: "Backcountry", productName: "Black Diamond Stopper Set", url: "https://www.backcountry.com/black-diamond-stopper-set", price: 79.95 },
  ]},
  "Ice tools and crampons": { weight: "2.2kg", priceRange: "$400-$600", specificProduct: "Petzl Quark + Petzl Lynx", links: [
    { retailer: "REI", productName: "Petzl Quark Ice Axe", url: "https://www.rei.com/product/151163/petzl-quark-ice-axe", price: 279.95 },
    { retailer: "REI", productName: "Petzl Lynx Crampons", url: "https://www.rei.com/product/151161/petzl-lynx-leverlock-crampons", price: 249.95 },
  ]},
  "Ice axe": { weight: "450g", priceRange: "$100-$200", specificProduct: "Petzl Summit EVO Ice Axe", links: [
    { retailer: "REI", productName: "Petzl Summit EVO Ice Axe", url: "https://www.rei.com/product/209425/petzl-summit-evo-ice-axe", price: 139.95 },
    { retailer: "Backcountry", productName: "Petzl Summit EVO", url: "https://www.backcountry.com/petzl-summit-evo-ice-axe", price: 139.95 },
  ]},
  "Harness": { weight: "350g", priceRange: "$60-$120", specificProduct: "Black Diamond Momentum Harness", links: [
    { retailer: "REI", productName: "Black Diamond Momentum Harness", url: "https://www.rei.com/product/189618/black-diamond-momentum-harness", price: 64.95 },
    { retailer: "Backcountry", productName: "Black Diamond Momentum Harness", url: "https://www.backcountry.com/black-diamond-momentum-harness", price: 64.95 },
    { retailer: "Amazon", productName: "Black Diamond Momentum Climbing Harness", url: "https://www.amazon.com/dp/B08K2Y36QT", price: 59.95 },
  ]},
  "Technical crampons": { weight: "950g", priceRange: "$200-$300", specificProduct: "Petzl Dart Crampons", links: [
    { retailer: "REI", productName: "Petzl Dart Crampons", url: "https://www.rei.com/product/151165/petzl-dart-crampons", price: 229.95 },
    { retailer: "Backcountry", productName: "Petzl Dart Crampons", url: "https://www.backcountry.com/petzl-dart-crampon", price: 229.95 },
  ]},
  "Mountaineering boots": { weight: "2.2kg", priceRange: "$400-$700", specificProduct: "La Sportiva Nepal Cube GTX", links: [
    { retailer: "REI", productName: "La Sportiva Nepal Cube GTX", url: "https://www.rei.com/product/127038/la-sportiva-nepal-cube-gtx-boots", price: 549.00 },
    { retailer: "Backcountry", productName: "La Sportiva Nepal Cube GTX", url: "https://www.backcountry.com/la-sportiva-nepal-cube-gtx", price: 549.00 },
  ]},
  "Trekking poles": { weight: "500g", priceRange: "$80-$180", specificProduct: "Black Diamond Distance Carbon Z", links: [
    { retailer: "REI", productName: "Black Diamond Distance Carbon Z Poles", url: "https://www.rei.com/product/141291/black-diamond-distance-carbon-z-poles", price: 169.95 },
    { retailer: "Backcountry", productName: "BD Distance Carbon Z Trekking Poles", url: "https://www.backcountry.com/black-diamond-distance-carbon-z-poles", price: 169.95 },
  ]},
  "Headlamp": { weight: "90g", priceRange: "$40-$100", specificProduct: "Petzl Actik Core", links: [
    { retailer: "REI", productName: "Petzl Actik Core Headlamp", url: "https://www.rei.com/product/189893/petzl-actik-core-headlamp", price: 79.95 },
    { retailer: "Backcountry", productName: "Petzl Actik Core Headlamp", url: "https://www.backcountry.com/petzl-actik-core-headlamp", price: 79.95 },
    { retailer: "Amazon", productName: "Petzl ACTIK CORE Rechargeable Headlamp", url: "https://www.amazon.com/dp/B0B8B3GZ6Y", price: 74.95 },
  ]},
};

function enrichFile(filename) {
  const filePath = path.join(seedDir, filename);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  let routesEnriched = 0;
  let routesMissed = 0;
  let gearEnriched = 0;

  for (const peakEntry of data) {
    for (const route of peakEntry.routes) {
      // Add route-level enrichment
      const enrichment = routeEnrichment[route.name];
      if (enrichment) {
        Object.assign(route, {
          imageUrl: null,
          ...enrichment,
        });
        routesEnriched++;
      } else {
        // Provide default enrichment for routes not in the lookup
        route.imageUrl = route.imageUrl || null;
        route.summary = route.summary || `A ${route.difficulty || 'classic'} route on ${peakEntry.peakName}.`;
        route.technicalGrade = route.technicalGrade || route.difficulty || null;
        route.commitment = route.commitment || "II";
        route.approachTime = route.approachTime || Math.round(route.estimatedTime ? route.estimatedTime / 120 : 4);
        route.descentTime = route.descentTime || Math.round(route.approachTime * 0.7);
        route.basecamp = route.basecamp || null;
        route.permitRequired = route.permitRequired ?? false;
        route.permitInfo = route.permitInfo || null;
        route.closestAirport = route.closestAirport || null;
        route.safetyNotes = route.safetyNotes || "Check current conditions before attempting this route. Carry appropriate safety equipment and be prepared for rapidly changing weather.";
        routesMissed++;
      }

      // Enrich gear items
      if (route.gear) {
        for (const gear of route.gear) {
          const gearData = gearEnrichment[gear.itemName];
          if (gearData) {
            gear.weight = gear.weight || gearData.weight;
            gear.priceRange = gear.priceRange || gearData.priceRange;
            gear.specificProduct = gear.specificProduct || gearData.specificProduct;
            gear.links = gear.links || gearData.links;
            gearEnriched++;
          } else {
            // Provide defaults for unknown gear
            gear.weight = gear.weight || null;
            gear.priceRange = gear.priceRange || null;
            gear.specificProduct = gear.specificProduct || null;
            gear.links = gear.links || [];
          }
        }
      }
    }
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`${filename}: ${routesEnriched} routes enriched, ${routesMissed} routes with defaults, ${gearEnriched} gear items enriched`);
}

// Enrich the two remaining files
enrichFile('routes-alps.json');
enrichFile('routes-world.json');

console.log('\nDone! Both files enriched.');
