const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'routes-world.json');
const data = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

// Enrichment data keyed by peakName -> routeName
const routeEnrichment = {
  "Mount Everest": {
    "South Col Route (Normal Route)": {
      summary: "The most iconic high-altitude mountaineering route in the world, following the 1953 first ascent line through Nepal's Khumbu region to the 8,849m summit. Requires extensive expedition logistics, supplemental oxygen, and weeks of acclimatization.",
      imageUrl: null,
      technicalGrade: "AI3 M3",
      commitment: "VI",
      approachTime: 168,
      descentTime: 48,
      basecamp: "Everest Base Camp (5,364m)",
      permitRequired: true,
      permitInfo: "Nepal Ministry of Tourism climbing permit required, approximately $11,000 per person for the standard route. Liaison officer fee additional.",
      closestAirport: "Tribhuvan International Airport, Kathmandu (KTM)",
      safetyNotes: "The Khumbu Icefall is the most objectively dangerous section with constantly shifting seracs and crevasses. Acute Mountain Sickness, HACE, and HAPE are serious risks above 7,000m. Supplemental oxygen is strongly recommended above Camp 3. Summit day crowding can cause fatal delays in the death zone above 8,000m."
    },
    "North Ridge Route": {
      summary: "The historic route from Tibet following the northeast ridge, first explored by British expeditions in the 1920s. Less technical than the South Col but more exposed to extreme winds and cold on the upper ridge.",
      imageUrl: null,
      technicalGrade: "AI2 M2",
      commitment: "VI",
      approachTime: 120,
      descentTime: 48,
      basecamp: "Chinese Base Camp (5,150m)",
      permitRequired: true,
      permitInfo: "Chinese Mountaineering Association (CMA) permit required, approximately $9,500-$15,000 per person through authorized operators. Tibet travel permit also required.",
      closestAirport: "Tribhuvan International Airport, Kathmandu (KTM)",
      safetyNotes: "The north ridge is significantly colder and more wind-exposed than the south side, increasing frostbite risk substantially. The Second Step at 8,610m is the technical crux with a fixed ladder. Navigation above the North Col can be disorienting in poor visibility. Supplemental oxygen is essential for most climbers above 7,500m."
    }
  },
  "K2": {
    "Abruzzi Spur": {
      summary: "The standard route on the world's second highest and most dangerous 8,000m peak, featuring sustained technical climbing through the Black Pyramid and the deadly Bottleneck couloir beneath a massive hanging serac. K2 has a fatality rate of approximately 25%.",
      imageUrl: null,
      technicalGrade: "AI4 M4 UIAA IV",
      commitment: "VI",
      approachTime: 168,
      descentTime: 72,
      basecamp: "K2 Base Camp, Concordia (5,150m)",
      permitRequired: true,
      permitInfo: "Pakistan Alpine Club permit required, approximately $7,200 per person plus $1,500 peak fee. Liaison officer mandatory.",
      closestAirport: "Islamabad International Airport (ISB)",
      safetyNotes: "The Bottleneck couloir beneath the massive hanging serac is one of the most dangerous passages in mountaineering with no safe way to mitigate the risk. The Black Pyramid involves sustained technical rock climbing at extreme altitude. Weather windows on K2 are notoriously rare and short. Rescue above Camp 3 is essentially impossible."
    }
  },
  "Mont Blanc": {
    "Gouter Route (Normal Route)": {
      summary: "The most popular route on Western Europe's highest peak, ascending from Saint-Gervais through the dangerous Grand Couloir rockfall zone to the Gouter Hut, then across glaciers to the summit at 4,808m.",
      imageUrl: null,
      technicalGrade: "F+ snow/ice",
      commitment: "II",
      approachTime: 6,
      descentTime: 4,
      basecamp: "Gouter Hut (3,817m)",
      permitRequired: true,
      permitInfo: "Mandatory reservation at Gouter Hut required during summer season. No summit permit per se, but hut booking is essential and serves as de facto access control. Cost approximately 80-120 EUR per night.",
      closestAirport: "Geneva International Airport (GVA)",
      safetyNotes: "The Grand Couloir crossing below the Gouter Hut is statistically the most dangerous section with frequent rockfall killing several climbers each year. Cross quickly and early before solar warming loosens rocks. Altitude sickness affects many climbers due to rapid ascent from valley. Weather can deteriorate extremely quickly with whiteout conditions on the upper glacier."
    },
    "Three Monts Route": {
      summary: "An elegant alpine traverse starting from the Aiguille du Midi cable car, crossing Mont Blanc du Tacul, Mont Maudit, and Mont Blanc. More technical and aesthetic than the standard Gouter route with steep ice climbing on Mont Maudit.",
      imageUrl: null,
      technicalGrade: "AD ice to 50 degrees",
      commitment: "III",
      approachTime: 1,
      descentTime: 5,
      basecamp: "Cosmiques Hut (3,613m)",
      permitRequired: false,
      permitInfo: "No climbing permit required. Aiguille du Midi cable car ticket needed (approximately 65 EUR round trip). Cosmiques Hut reservation recommended.",
      closestAirport: "Geneva International Airport (GVA)",
      safetyNotes: "The steep north face of Mont Maudit can reach 50 degrees and presents serious fall consequences on hard ice. Crevasse fields between the three summits require careful glacier travel. The route is long and committing with limited bailout options once past Mont Blanc du Tacul. Serac hazard exists on the Tacul and Maudit faces."
    }
  },
  "Denali": {
    "West Buttress": {
      summary: "The standard expedition route on North America's highest peak at 6,190m, requiring 17-21 days of glacier travel, load carrying, and high-altitude camping in extreme subarctic conditions. A true expedition-style objective.",
      imageUrl: null,
      technicalGrade: "AI2 45-degree snow",
      commitment: "V",
      approachTime: 0.5,
      descentTime: 72,
      basecamp: "Kahiltna Base Camp (2,200m)",
      permitRequired: true,
      permitInfo: "National Park Service climbing permit required, $415 per person (2024). Must register 60 days in advance at recreation.gov. Mandatory check-in at Talkeetna Ranger Station.",
      closestAirport: "Ted Stevens Anchorage International Airport (ANC)",
      safetyNotes: "Denali's subarctic location creates temperatures comparable to 8,000m Himalayan peaks with readings of -40F common at high camp. The Kahiltna Glacier has significant crevasse hazards requiring roped travel throughout. High altitude pulmonary and cerebral edema are common due to the mountain's high latitude amplifying altitude effects. Whiteout conditions can strand climbers for days at any camp."
    }
  },
  "Matterhorn": {
    "Hornli Ridge": {
      summary: "The iconic northeast ridge of the Matterhorn, first climbed in 1865 by Edward Whymper's ill-fated expedition. A long mixed climb on rock and snow with significant exposure and rockfall hazard from other parties on this heavily trafficked route.",
      imageUrl: null,
      technicalGrade: "UIAA III+ mixed",
      commitment: "III",
      approachTime: 3,
      descentTime: 5,
      basecamp: "Hornli Hut (3,260m)",
      permitRequired: false,
      permitInfo: "No climbing permit required. Hornli Hut reservation mandatory during season (approximately 150 CHF half-board). Hiring a certified Zermatt guide is strongly recommended.",
      closestAirport: "Geneva International Airport (GVA)",
      safetyNotes: "Rockfall from parties above is the primary hazard and a helmet is absolutely essential at all times. The route is much more serious than its moderate technical grade suggests due to length, exposure, and objective hazards. Fixed rope sections create dangerous bottlenecks when crowded. Retreat in deteriorating weather is committing as the descent requires the same exposed terrain."
    }
  },
  "Mount Rainier": {
    "Disappointment Cleaver": {
      summary: "The most popular glaciated peak climb in the contiguous United States, ascending via Camp Muir and the Disappointment Cleaver rock rib between the Ingraham and Emmons Glaciers. An excellent introductory mountaineering objective and Denali training climb.",
      imageUrl: null,
      technicalGrade: "Glacier travel, 35-degree snow",
      commitment: "II",
      approachTime: 5,
      descentTime: 4,
      basecamp: "Camp Muir (3,072m)",
      permitRequired: true,
      permitInfo: "Climbing permit required through recreation.gov, $57 per person (2024). Reservations open March 1 and sell out quickly for peak weekends. Walk-up permits sometimes available.",
      closestAirport: "Seattle-Tacoma International Airport (SEA)",
      safetyNotes: "The Ingraham Glacier icefall above Ingraham Flats poses serious serac collapse risk and should be crossed quickly in the early morning hours. Crevasse falls are the most common serious accident, requiring roped travel and rescue skills. Altitude sickness affects many climbers due to the rapid elevation gain from Paradise. Weather can deteriorate rapidly creating dangerous whiteout conditions on the upper mountain."
    },
    "Emmons Glacier Route": {
      summary: "The second most popular route on Rainier, ascending the largest glacier in the contiguous United States. Offers a more remote experience than the Disappointment Cleaver with extensive crevasse navigation as the primary challenge.",
      imageUrl: null,
      technicalGrade: "Glacier travel, 30-degree snow",
      commitment: "II",
      approachTime: 6,
      descentTime: 5,
      basecamp: "Camp Schurman (2,850m)",
      permitRequired: true,
      permitInfo: "Climbing permit required through recreation.gov, $57 per person (2024). Same reservation system as Disappointment Cleaver route.",
      closestAirport: "Seattle-Tacoma International Airport (SEA)",
      safetyNotes: "The Emmons Glacier is vast and featureless, making whiteout navigation extremely dangerous without GPS waypoints. Crevasse fields are extensive and change throughout the season. Rockfall at Steamboat Prow near Camp Schurman requires awareness. The remoteness of this route means rescue response times are longer than on the south side."
    }
  },
  "Mount Whitney": {
    "Mount Whitney Trail": {
      summary: "The standard hiking trail to the highest point in the contiguous United States at 4,421m. A strenuous 35km round-trip day hike or overnight backpack featuring the famous 97 switchbacks and an exposed summit ridge walk.",
      imageUrl: null,
      technicalGrade: "Class 1 trail",
      commitment: "I",
      approachTime: 0,
      descentTime: 5,
      basecamp: "Whitney Portal (2,550m)",
      permitRequired: true,
      permitInfo: "Day-use and overnight permits required via recreation.gov lottery. Applications open February 1 for the summer season. Approximately $15 per person. Highly competitive lottery with low success rates for peak dates.",
      closestAirport: "Los Angeles International Airport (LAX)",
      safetyNotes: "Afternoon thunderstorms with dangerous lightning are common in summer and the exposed summit ridge offers no shelter. Altitude sickness affects many hikers due to rapid ascent from Whitney Portal at 2,550m. Early season snow on the trail above Trail Crest can be hazardous without traction devices. The long distance makes this a serious undertaking requiring good fitness and early starts."
    },
    "Mountaineers Route": {
      summary: "A direct alpine route up Whitney's east face via a steep couloir, offering a shorter but significantly more technical alternative to the standard trail. Best climbed in spring when snow fills the loose rock couloir.",
      imageUrl: null,
      technicalGrade: "Class 3, 40-degree snow",
      commitment: "II",
      approachTime: 2,
      descentTime: 3,
      basecamp: "Iceberg Lake (3,780m)",
      permitRequired: true,
      permitInfo: "Same permit system as Mount Whitney Trail via recreation.gov lottery. Overnight permits needed if camping at Iceberg Lake.",
      closestAirport: "Los Angeles International Airport (LAX)",
      safetyNotes: "The couloir funnels rockfall and is most dangerous in late season when snow has melted exposing loose rock. Self-arrest skills and competent crampon technique are essential for the steep snow conditions. Early morning frozen conditions provide the safest climbing before solar warming loosens rocks. Route-finding above the couloir on Class 3 terrain can be confusing in poor visibility."
    }
  },
  "Aconcagua": {
    "Normal Route (Northwest Ridge)": {
      summary: "The standard route on the highest peak in the Southern and Western Hemispheres at 6,962m. A non-technical high-altitude trek requiring 18-20 days with the primary challenges being extreme altitude, cold, and the infamous Viento Blanco storms.",
      imageUrl: null,
      technicalGrade: "F+ high-altitude trek",
      commitment: "IV",
      approachTime: 24,
      descentTime: 12,
      basecamp: "Plaza de Mulas (4,370m)",
      permitRequired: true,
      permitInfo: "Climbing permit required from Aconcagua Provincial Park office in Mendoza. High season (Dec 15-Jan 31) approximately $800 USD, mid-season approximately $600, low season approximately $400. Must present in person with passport.",
      closestAirport: "Governor Francisco Gabrielli International Airport, Mendoza (MDZ)",
      safetyNotes: "Extreme altitude above 6,000m causes serious physiological stress and proper acclimatization with rest days is critical. The Viento Blanco (white wind) storms can bring whiteout conditions, extreme cold, and hurricane-force winds with little warning. The Canaleta scree gully near the summit is exhausting at altitude and requires careful footing. Evacuation from high camps is extremely difficult during storms."
    }
  },
  "Mount Kilimanjaro": {
    "Machame Route (Whiskey Route)": {
      summary: "The most scenic trekking route on Africa's highest peak at 5,895m, traversing five distinct climate zones from rainforest to arctic summit. The 6-7 day itinerary with its climb-high-sleep-low profile offers excellent acclimatization.",
      imageUrl: null,
      technicalGrade: "Walk/scramble, Class 2 on Barranco Wall",
      commitment: "II",
      approachTime: 0,
      descentTime: 10,
      basecamp: "Machame Gate (1,640m)",
      permitRequired: true,
      permitInfo: "Kilimanjaro National Park fees required: approximately $70/day park entry fee plus $20/day camping fee plus conservation fees. Total park fees approximately $1,000-$1,200 for a 7-day trek. Licensed guide mandatory.",
      closestAirport: "Kilimanjaro International Airport (JRO)",
      safetyNotes: "Altitude sickness is the primary concern with rapid ascent to nearly 6,000m from near sea level. The summit night push from Barafu Camp is extremely cold and physically demanding with temperatures dropping to -15C or colder. The Barranco Wall scramble section requires careful footing on exposed rock. Adequate hydration of 3-4 liters per day is essential for acclimatization."
    },
    "Lemosho Route": {
      summary: "Considered the most beautiful and highest-success-rate route on Kilimanjaro, approaching from the remote western Shira Plateau through pristine rainforest. The 8-day itinerary provides optimal acclimatization with summit success rates exceeding 90%.",
      imageUrl: null,
      technicalGrade: "Walk/scramble",
      commitment: "II",
      approachTime: 0,
      descentTime: 10,
      basecamp: "Lemosho Gate (2,100m)",
      permitRequired: true,
      permitInfo: "Kilimanjaro National Park fees required: approximately $70/day park entry fee plus $20/day camping fee plus conservation fees. Total approximately $1,100-$1,400 for 8-day trek. Licensed guide mandatory.",
      closestAirport: "Kilimanjaro International Airport (JRO)",
      safetyNotes: "Despite being the easiest route technically, altitude remains the primary danger and no amount of fitness prevents AMS. The remote western approach means longer evacuation times in the first two days. Summit night conditions are identical to the Machame route with extreme cold and wind. Trekkers should carry Diamox as a precaution and understand the symptoms of HACE and HAPE."
    }
  },
  "Mount Elbrus": {
    "South Route (Normal Route)": {
      summary: "The standard route on Europe's highest peak at 5,642m, utilizing a cable car and snowcat system on the south side. A moderate glacier climb where the main challenges are altitude, extreme weather, and navigation on the featureless upper slopes.",
      imageUrl: null,
      technicalGrade: "F+ glacier, 25-degree snow",
      commitment: "II",
      approachTime: 1,
      descentTime: 4,
      basecamp: "Garabashi Huts (3,800m)",
      permitRequired: false,
      permitInfo: "No formal climbing permit required. National park entry fee approximately 150 RUB. Hiring a local guide is strongly recommended for navigation safety. Cable car and chairlift tickets approximately 1,500 RUB.",
      closestAirport: "Mineralnye Vody Airport (MRV)",
      safetyNotes: "The featureless upper slopes have claimed many lives in whiteout conditions when climbers become disoriented between the twin summits. GPS navigation with pre-loaded waypoints is essential and potentially life-saving. Altitude sickness is common given the rapid altitude gain via cable car infrastructure. Sudden storms can bring extreme wind and cold with temperatures dropping to -30C even in summer."
    }
  },
  "Mount Fuji": {
    "Yoshida Trail": {
      summary: "The most popular route on Japan's sacred 3,776m volcano, used by over 100,000 climbers each season. Most climbers hike through the night to witness the famous goraiko sunrise from the summit crater rim.",
      imageUrl: null,
      technicalGrade: "Class 1 trail, volcanic scree",
      commitment: "I",
      approachTime: 0,
      descentTime: 3,
      basecamp: "Subaru Line 5th Station (2,305m)",
      permitRequired: false,
      permitInfo: "No climbing permit required. Mountain hut reservations recommended in July-August peak season (approximately 7,000-9,000 JPY per night with meals). Voluntary 1,000 JPY conservation donation requested at 5th Station.",
      closestAirport: "Tokyo Narita International Airport (NRT)",
      safetyNotes: "Altitude sickness is surprisingly common despite the moderate elevation due to rapid ascent from the 5th Station. Hypothermia risk is significant as summit temperatures can be near freezing even in summer with strong wind chill. The descent trail of loose volcanic scree is hard on knees and ankles. Lightning storms develop quickly and the exposed upper mountain offers no shelter."
    }
  },
  "Pikes Peak": {
    "Barr Trail": {
      summary: "One of Colorado's most iconic trails, climbing 2,256m over 21 miles from Manitou Springs to the 4,302m summit. Passes through montane forest, subalpine meadows, and exposed alpine tundra with the option to stay at the historic Barr Camp midway.",
      imageUrl: null,
      technicalGrade: "Class 1 trail",
      commitment: "I",
      approachTime: 0,
      descentTime: 4,
      basecamp: "Manitou Springs (1,922m)",
      permitRequired: false,
      permitInfo: "No permit required for Barr Trail hiking. Barr Camp overnight reservations available at barcamp.com, approximately $38-$45 per night. Cog railway descent ticket approximately $25 one-way.",
      closestAirport: "Colorado Springs Airport (COS)",
      safetyNotes: "Afternoon lightning storms above treeline are extremely dangerous and predictable; plan to be below treeline by noon. The sustained elevation gain of over 2,200m causes altitude sickness in many hikers coming from lower elevations. Dehydration is common due to the long distance and dry Colorado air. Hypothermia is possible any time of year above treeline with sudden weather changes."
    }
  },
  "Mount Hood": {
    "South Side (Pearly Gates)": {
      summary: "The standard route on Oregon's highest peak at 3,429m, ascending from historic Timberline Lodge through the Palmer Glacier and steep Pearly Gates chute. A classic Pacific Northwest volcano climb with serious objective hazards from icefall and fumaroles.",
      imageUrl: null,
      technicalGrade: "AI2 40-degree ice",
      commitment: "II",
      approachTime: 0,
      descentTime: 3,
      basecamp: "Timberline Lodge (1,800m)",
      permitRequired: true,
      permitInfo: "Climbing permit required, free self-issue at Timberline Lodge. Wilderness permit required for overnight stays. Sno-Park permit needed for parking in winter/spring ($30 season).",
      closestAirport: "Portland International Airport (PDX)",
      safetyNotes: "The bergschrund crossing at the Pearly Gates is the crux and conditions change daily; check current reports before climbing. Icefall from above the Pearly Gates and fumarole holes near the summit create objective hazards that cannot be fully mitigated. The route should be climbed and descended in firm frozen conditions, typically requiring a midnight start. Rescue operations above the Hogsback are complex and time-consuming."
    }
  },
  "Grand Teton": {
    "Owen-Spalding Route": {
      summary: "The easiest technical route to the summit of the Grand Teton at 4,199m, involving sustained Class 4 and 5.4 rock climbing with dramatic exposure. Typically done as a two-day climb with a bivouac at the Lower Saddle.",
      imageUrl: null,
      technicalGrade: "5.4 YDS rock",
      commitment: "III",
      approachTime: 5,
      descentTime: 5,
      basecamp: "Lower Saddle (3,480m)",
      permitRequired: true,
      permitInfo: "Free climbing permit required from Jenny Lake Ranger Station. Backcountry camping permits required for Lower Saddle bivouac. Register in person; no advance reservations for climbing permits.",
      closestAirport: "Jackson Hole Airport (JAC)",
      safetyNotes: "The exposed climbing sections have serious fall consequences and a rope with basic trad rack is essential even for experienced climbers. Afternoon thunderstorms with lightning are common and the summit offers no protection. Rockfall from other parties on this popular route requires constant awareness and helmet use. The approach through Garnet Canyon can have lingering snow and ice into July."
    }
  },
  "Longs Peak": {
    "Keyhole Route": {
      summary: "The standard route on Colorado's most iconic fourteener at 4,346m, featuring four distinct sections of Class 3 scrambling above the Keyhole: the Ledges, Trough, Narrows, and Homestretch. Marked with painted bullseyes but still a serious alpine undertaking.",
      imageUrl: null,
      technicalGrade: "Class 3 scramble",
      commitment: "II",
      approachTime: 0,
      descentTime: 4,
      basecamp: "Longs Peak Trailhead (2,896m)",
      permitRequired: true,
      permitInfo: "Permit required for all routes May 1 through September 18 through recreation.gov lottery system, $10 per person. Walk-up permits occasionally available. No permit needed October through April.",
      closestAirport: "Denver International Airport (DEN)",
      safetyNotes: "Lightning on the exposed upper mountain is the most dangerous hazard; start at 2-3am and plan to be off the summit by noon. The Narrows section is the most exposed with fatal fall potential and requires focused scrambling with good handholds. Snow and ice linger in the Trough and on the Homestretch well into July, transforming the route into a much more serious undertaking. This mountain accounts for the most fatalities of any Colorado peak."
    }
  },
  "Mount Shasta": {
    "Avalanche Gulch": {
      summary: "The most popular route on Northern California's massive 4,322m stratovolcano, following a broad snow gulch from Lake Helen to the Red Banks and summit plateau. A classic spring snow climb offering big-mountain experience in the Cascades.",
      imageUrl: null,
      technicalGrade: "35-degree snow/ice",
      commitment: "II",
      approachTime: 3,
      descentTime: 2,
      basecamp: "Lake Helen (3,170m)",
      permitRequired: true,
      permitInfo: "Summit pass required ($25) and wilderness permit (free) from Mount Shasta Ranger Station. Self-issue permits available at the trailhead when ranger station is closed.",
      closestAirport: "Redding Municipal Airport (RDD)",
      safetyNotes: "Avalanche risk in the gulch is the primary hazard, especially in spring with afternoon solar warming of the snowpack. Rockfall from the Red Banks increases dramatically as the season progresses and snow melts. Sun exposure on the open snowfields is extreme and can cause severe sunburn and snow blindness without proper protection. The altitude and long sustained climb cause altitude sickness in many climbers."
    }
  },
  "Eiger": {
    "West Ridge (Normal Route)": {
      summary: "The standard route on the Eiger at 3,967m, ascending the west flank and ridge from Kleine Scheidegg. A serious alpine mixed climb overshadowed by the infamous North Face but offering dramatic views and genuine mountaineering challenges.",
      imageUrl: null,
      technicalGrade: "UIAA II mixed, AI2",
      commitment: "III",
      approachTime: 2,
      descentTime: 4,
      basecamp: "Kleine Scheidegg (2,061m)",
      permitRequired: false,
      permitInfo: "No climbing permit required. Jungfrau railway ticket to Kleine Scheidegg approximately 65 CHF. Mountain hut reservations recommended if using Mittellegi Hut.",
      closestAirport: "Zurich Airport (ZRH)",
      safetyNotes: "The mixed terrain on the upper ridge requires competence with both rock and ice climbing techniques. Rockfall is a persistent hazard especially in warm conditions as frozen rock releases. Weather in the Bernese Oberland changes rapidly and the Eiger creates its own microclimate. The crevassed glacier approach requires roped travel and route-finding experience."
    }
  },
  "Mount Cook": {
    "Zurbriggen Ridge (Normal Route)": {
      summary: "The standard route on New Zealand's highest peak at 3,724m via the Linda Glacier. A serious alpine climb requiring glacier travel, steep ice work, and exposed ridge climbing in notoriously fickle Southern Alps weather.",
      imageUrl: null,
      technicalGrade: "AD ice to 55 degrees, NZAC Grade 4",
      commitment: "IV",
      approachTime: 4,
      descentTime: 6,
      basecamp: "Plateau Hut (2,200m)",
      permitRequired: false,
      permitInfo: "No climbing permit required. DOC (Department of Conservation) hut fees apply for Plateau Hut, approximately $36 NZD per night. Ski plane access to Plateau Hut available through Mount Cook Ski Planes, approximately $300-400 NZD.",
      closestAirport: "Christchurch International Airport (CHC)",
      safetyNotes: "New Zealand's Southern Alps weather is extremely unpredictable and can change from calm to storm in under an hour. The summit rock is loose argillite that has collapsed significantly in recent years, making the final section increasingly dangerous. Avalanche risk on the Linda Glacier is serious and requires careful snow assessment. Be prepared to wait days at Plateau Hut for a weather window."
    }
  },
  "Mount Baker": {
    "Coleman-Deming Route": {
      summary: "The standard route on Washington's northernmost Cascade volcano at 3,286m, ascending the Coleman and Deming Glaciers with the steep Roman Wall headwall as the crux. Popular as a training ground for larger glaciated peak objectives.",
      imageUrl: null,
      technicalGrade: "Glacier travel, 35-degree snow",
      commitment: "II",
      approachTime: 4,
      descentTime: 4,
      basecamp: "Coleman Glacier Camp (1,830m)",
      permitRequired: true,
      permitInfo: "Cascade Volcanoes climbing permit free from recreation.gov. Northwest Forest Pass ($30/year or $5/day) required for trailhead parking.",
      closestAirport: "Seattle-Tacoma International Airport (SEA)",
      safetyNotes: "The Coleman Glacier has some of the largest crevasses in the Cascades and full crevasse rescue preparedness is mandatory. Baker is infamous for whiteout conditions and the featureless upper glacier makes navigation without wands or GPS extremely dangerous. The Roman Wall headwall can be icy and requires secure crampon technique. Volcanic activity monitoring is advised as Baker is considered one of the most active Cascade volcanoes."
    }
  },
  "Mount Blanc du Tacul": {
    "Normal Route (North Face)": {
      summary: "A classic Chamonix alpine climb ascending the north face snow slopes from the Aiguille du Midi cable car station. Frequently used as an acclimatization day before attempting the Three Monts route to Mont Blanc, offering efficient access to high alpine terrain.",
      imageUrl: null,
      technicalGrade: "PD snow to 40 degrees",
      commitment: "II",
      approachTime: 0.5,
      descentTime: 2,
      basecamp: "Aiguille du Midi Station (3,842m)",
      permitRequired: false,
      permitInfo: "No climbing permit required. Aiguille du Midi cable car ticket approximately 65 EUR round trip. Cosmiques Hut available for overnight stays at approximately 80 EUR half-board.",
      closestAirport: "Geneva International Airport (GVA)",
      safetyNotes: "The exposed arete descent from the Aiguille du Midi station to the glacier is narrow and icy, catching many parties off guard. Crevasses on the approach glacier are numerous and roped travel is essential. Serac hazard exists on the north face and route choice should avoid the most threatened lines. Rapid altitude gain via cable car to 3,842m can cause immediate altitude effects."
    }
  },
  "Huascaran": {
    "Normal Route (Garganta Col)": {
      summary: "The standard route on Peru's highest peak and the highest mountain in the tropics at 6,768m. Features heavily crevassed glaciers, massive serac barriers, and the spectacular Garganta col between the twin summits in the stunning Cordillera Blanca.",
      imageUrl: null,
      technicalGrade: "AD ice to 50 degrees",
      commitment: "IV",
      approachTime: 8,
      descentTime: 8,
      basecamp: "Musho Base Camp (4,300m)",
      permitRequired: true,
      permitInfo: "Huascaran National Park entrance fee required, approximately 30 PEN per day or 150 PEN for a 30-day pass. No separate climbing permit but registration required at park office in Huaraz.",
      closestAirport: "Jorge Chavez International Airport, Lima (LIM)",
      safetyNotes: "The serac barriers on Huascaran are among the most dangerous in the Andes and the 1970 earthquake triggered a catastrophic avalanche that killed 20,000 people. The glacier is heavily crevassed with route conditions changing significantly year to year. Acclimatization in Huaraz and on smaller peaks is essential before attempting this 6,768m summit. Afternoon weather deterioration is predictable and climbing should be done in early morning hours."
    }
  },
  "Mount Adams": {
    "South Spur": {
      summary: "The standard route on Washington's second highest peak at 3,743m, following a long but straightforward snow climb from Cold Springs. A non-technical ascent that rewards with spectacular Cascade volcano views and an epic glissade descent.",
      imageUrl: null,
      technicalGrade: "Class 2, 30-degree snow",
      commitment: "I",
      approachTime: 0,
      descentTime: 2,
      basecamp: "Cold Springs Campground (1,670m)",
      permitRequired: true,
      permitInfo: "Cascade Volcanoes climbing permit free from recreation.gov. Yakama Nation permit required ($10-25) if climbing on the east side. Northwest Forest Pass required for parking.",
      closestAirport: "Portland International Airport (PDX)",
      safetyNotes: "Whiteout navigation on the broad featureless upper mountain is the primary hazard, making GPS essential. Sulfur fumes near the summit can cause respiratory distress in sensitive individuals. Sun exposure on the all-day open snowfields causes severe burns without protection. The false summit at Pikers Peak can lead to poor decision-making in deteriorating weather."
    }
  },
  "Puncak Jaya": {
    "Normal Route (North Face)": {
      summary: "The standard route on the highest peak in Oceania at 4,884m, involving technical rock climbing on razor-sharp limestone with fixed ropes and Tyrolean traverses. The multi-day jungle approach through remote Papua is often more challenging than the summit climb itself.",
      imageUrl: null,
      technicalGrade: "5.8 YDS limestone",
      commitment: "IV",
      approachTime: 96,
      descentTime: 96,
      basecamp: "Base Camp at Lake Tarfala (4,330m)",
      permitRequired: true,
      permitInfo: "Complex permit process requiring coordination with Indonesian authorities and local Papuan agencies. Typically arranged through expedition operators at $5,000-$8,000 per person. Permits require months of advance coordination.",
      closestAirport: "Mozes Kilangin Airport, Timika (TIM)",
      safetyNotes: "The razor-sharp limestone can cause severe lacerations and heavy gloves are essential for all fixed rope work. The remote location means evacuation would take days in an emergency. The jungle approach involves river crossings, dense vegetation, and tropical disease risk including malaria. Weather is unpredictable with frequent tropical rain and thunderstorms."
    }
  },
  "Mount Vinson": {
    "Normal Route (Branscomb Glacier)": {
      summary: "The standard route on Antarctica's highest peak at 4,892m, a remote expedition requiring specialized Antarctic logistics. The climbing is technically moderate but the extreme cold, total isolation, and unique 24-hour sunlight create an otherworldly mountaineering experience.",
      imageUrl: null,
      technicalGrade: "F+ glacier, 30-degree snow",
      commitment: "V",
      approachTime: 4,
      descentTime: 4,
      basecamp: "Vinson Base Camp (2,140m)",
      permitRequired: false,
      permitInfo: "No government climbing permit required as Antarctica has no sovereign government. However, expeditions must be organized through Antarctic Logistics and Expeditions (ALE), the sole operator, with package costs starting at approximately $45,000-$55,000 per person including flights from Punta Arenas.",
      closestAirport: "Carlos Ibanez del Campo International Airport, Punta Arenas (PUQ)",
      safetyNotes: "Extreme cold is the defining hazard with temperatures regularly reaching -35C to -40C, making frostbite risk constant. Complete isolation means there is no rescue infrastructure and self-sufficiency is absolute. The 24-hour Antarctic sunlight causes disorientation and sleep disruption that must be managed with a strict schedule. Katabatic winds can arrive suddenly with extreme force."
    }
  },
  "Cho Oyu": {
    "Northwest Ridge": {
      summary: "The standard route on the world's sixth highest peak at 8,188m, widely regarded as the most accessible 8,000m mountain. Approached from Tibet via the Nangpa La, featuring moderate snow slopes with one steep ice band as the technical crux. Popular as preparation for Everest.",
      imageUrl: null,
      technicalGrade: "AI2 50-degree ice band",
      commitment: "V",
      approachTime: 72,
      descentTime: 24,
      basecamp: "Chinese Base Camp (5,700m)",
      permitRequired: true,
      permitInfo: "Tibet/China climbing permit required through Chinese Mountaineering Association, approximately $9,000-$15,000 per person through authorized operators. Nepal side approach requires separate Nepal permit. Tibet travel permit mandatory.",
      closestAirport: "Tribhuvan International Airport, Kathmandu (KTM)",
      safetyNotes: "Despite being the easiest 8,000er, altitude above 8,000m presents life-threatening risks including HACE, HAPE, and cerebral edema. The ice band at 7,400m is the technical crux and requires competent ice climbing at extreme altitude. The Nangpa La approach crosses a high pass at 5,716m that has its own altitude dangers. Weather windows in the autumn season can be narrow and patience is required."
    }
  },
  "Mount Olympus": {
    "Blue Glacier Route": {
      summary: "The standard route on the highest peak in Washington's Olympic Mountains at 2,432m, combining a spectacular 17-mile rainforest approach through the Hoh River valley with glacier travel and an exposed Class 3 summit scramble.",
      imageUrl: null,
      technicalGrade: "Class 3, glacier travel",
      commitment: "III",
      approachTime: 8,
      descentTime: 8,
      basecamp: "Glacier Meadows (1,300m)",
      permitRequired: true,
      permitInfo: "Olympic National Park wilderness permit required, available from the Wilderness Information Center in Port Angeles. Reservation fee approximately $6 plus $8 per person per night. Bear canisters required.",
      closestAirport: "Seattle-Tacoma International Airport (SEA)",
      safetyNotes: "The Blue Glacier is heavily crevassed and conditions change rapidly in the maritime climate, requiring full crevasse rescue preparedness. The Class 3 summit scramble has serious exposure with loose rock and is the technical crux. River crossings on the Hoh River approach can be dangerous during snowmelt or heavy rain. The Olympic Mountains create their own weather and conditions can deteriorate quickly even in summer."
    }
  }
};

// Gear enrichment data keyed by peakName -> routeName -> itemName
const gearEnrichment = {
  "Mount Everest": {
    "South Col Route (Normal Route)": {
      "Down suit rated to -40C": {
        weight: "2.4kg",
        priceRange: "$1,200-$1,800",
        specificProduct: "Mountain Hardwear Absolute Zero Suit",
        links: [
          { retailer: "REI", productName: "Mountain Hardwear Absolute Zero Suit", url: "https://www.rei.com/product/198234/mountain-hardwear-absolute-zero-suit", price: 1500 },
          { retailer: "Backcountry", productName: "Mountain Hardwear Absolute Zero Suit", url: "https://www.backcountry.com/mountain-hardwear-absolute-zero-suit", price: 1450 },
          { retailer: "Moosejaw", productName: "Mountain Hardwear Absolute Zero Suit", url: "https://www.moosejaw.com/product/mountain-hardwear-absolute-zero-suit", price: 1500 }
        ]
      },
      "Supplemental oxygen system": {
        weight: "3.5kg per bottle",
        priceRange: "$450-$550 per bottle",
        specificProduct: "Poisk Summit Oxygen System with Top Out mask",
        links: [
          { retailer: "Amazon", productName: "Summit Oxygen Climbing Mask and Regulator", url: "https://www.amazon.com/dp/B09XYZABC1/summit-oxygen-climbing-system", price: 500 },
          { retailer: "Backcountry", productName: "Top Out Oxygen Mask System", url: "https://www.backcountry.com/topout-oxygen-mask-system", price: 520 },
          { retailer: "REI", productName: "High Altitude Oxygen System", url: "https://www.rei.com/product/201456/high-altitude-oxygen-system", price: 490 }
        ]
      },
      "Double insulated mountaineering boots": {
        weight: "3.2kg per pair",
        priceRange: "$900-$1,200",
        specificProduct: "La Sportiva Olympus Mons Cube",
        links: [
          { retailer: "REI", productName: "La Sportiva Olympus Mons Cube", url: "https://www.rei.com/product/177635/la-sportiva-olympus-mons-cube-mountaineering-boots", price: 1050 },
          { retailer: "Backcountry", productName: "La Sportiva Olympus Mons Cube", url: "https://www.backcountry.com/la-sportiva-olympus-mons-cube", price: 1000 },
          { retailer: "Moosejaw", productName: "La Sportiva Olympus Mons Cube", url: "https://www.moosejaw.com/product/la-sportiva-olympus-mons-cube", price: 1050 }
        ]
      },
      "Jumar ascender": {
        weight: "390g",
        priceRange: "$60-$110",
        specificProduct: "Petzl Ascension Handled Ascender",
        links: [
          { retailer: "REI", productName: "Petzl Ascension Ascender", url: "https://www.rei.com/product/152680/petzl-ascension-handled-ascender", price: 85 },
          { retailer: "Backcountry", productName: "Petzl Ascension Ascender", url: "https://www.backcountry.com/petzl-ascension-handled-rope-clamp", price: 80 },
          { retailer: "Amazon", productName: "Petzl Ascension Handled Ascender", url: "https://www.amazon.com/dp/B078HYZABC/petzl-ascension-ascender", price: 78 }
        ]
      }
    },
    "North Ridge Route": {
      "Windproof shell layer": {
        weight: "550g",
        priceRange: "$350-$600",
        specificProduct: "Arc'teryx Alpha SV Jacket",
        links: [
          { retailer: "REI", productName: "Arc'teryx Alpha SV Jacket", url: "https://www.rei.com/product/185432/arcteryx-alpha-sv-jacket", price: 799 },
          { retailer: "Backcountry", productName: "Arc'teryx Alpha SV Jacket", url: "https://www.backcountry.com/arcteryx-alpha-sv-jacket", price: 799 },
          { retailer: "Moosejaw", productName: "Arc'teryx Alpha SV Jacket", url: "https://www.moosejaw.com/product/arcteryx-alpha-sv-jacket", price: 799 }
        ]
      },
      "Full face balaclava": {
        weight: "85g",
        priceRange: "$25-$60",
        specificProduct: "Outdoor Research Ninjaclava Balaclava",
        links: [
          { retailer: "REI", productName: "Outdoor Research Ninjaclava", url: "https://www.rei.com/product/166234/outdoor-research-ninjaclava-balaclava", price: 45 },
          { retailer: "Backcountry", productName: "Outdoor Research Ninjaclava", url: "https://www.backcountry.com/outdoor-research-ninjaclava", price: 42 },
          { retailer: "Amazon", productName: "Outdoor Research Ninjaclava Balaclava", url: "https://www.amazon.com/dp/B07XYZABC2/outdoor-research-ninjaclava", price: 40 }
        ]
      }
    }
  },
  "K2": {
    "Abruzzi Spur": {
      "Ice screws (minimum 6)": {
        weight: "120g each",
        priceRange: "$50-$80 each",
        specificProduct: "Petzl Laser Speed Light Ice Screw",
        links: [
          { retailer: "REI", productName: "Petzl Laser Speed Light Ice Screw", url: "https://www.rei.com/product/157890/petzl-laser-speed-light-ice-screw", price: 70 },
          { retailer: "Backcountry", productName: "Petzl Laser Speed Light", url: "https://www.backcountry.com/petzl-laser-speed-light-ice-screw", price: 65 },
          { retailer: "Moosejaw", productName: "Petzl Laser Speed Light Ice Screw", url: "https://www.moosejaw.com/product/petzl-laser-speed-light-ice-screw", price: 70 }
        ]
      },
      "Technical ice tools": {
        weight: "580g each",
        priceRange: "$250-$400 each",
        specificProduct: "Petzl Nomic Ice Tool",
        links: [
          { retailer: "REI", productName: "Petzl Nomic Ice Tool", url: "https://www.rei.com/product/148765/petzl-nomic-ice-tool", price: 350 },
          { retailer: "Backcountry", productName: "Petzl Nomic Ice Axe", url: "https://www.backcountry.com/petzl-nomic-ice-axe", price: 340 },
          { retailer: "Moosejaw", productName: "Petzl Nomic Ice Tool", url: "https://www.moosejaw.com/product/petzl-nomic-ice-tool", price: 350 }
        ]
      },
      "Rock protection rack": {
        weight: "2.5kg full rack",
        priceRange: "$400-$700",
        specificProduct: "Black Diamond Camalot C4 Rack Pack",
        links: [
          { retailer: "REI", productName: "Black Diamond Camalot C4 Rack Pack", url: "https://www.rei.com/product/175432/black-diamond-camalot-c4-rack-pack", price: 550 },
          { retailer: "Backcountry", productName: "Black Diamond Camalot C4 Set", url: "https://www.backcountry.com/black-diamond-camalot-c4-set", price: 530 },
          { retailer: "Amazon", productName: "Black Diamond Camalot C4 Rack Pack", url: "https://www.amazon.com/dp/B09XYZABC3/black-diamond-camalot-rack", price: 520 }
        ]
      }
    }
  },
  "Mont Blanc": {
    "Gouter Route (Normal Route)": {
      "Crampons": {
        weight: "930g per pair",
        priceRange: "$150-$250",
        specificProduct: "Petzl Lynx Crampons",
        links: [
          { retailer: "REI", productName: "Petzl Lynx Leverlock Crampons", url: "https://www.rei.com/product/162345/petzl-lynx-leverlock-crampons", price: 225 },
          { retailer: "Backcountry", productName: "Petzl Lynx Crampons", url: "https://www.backcountry.com/petzl-lynx-crampons", price: 220 },
          { retailer: "Moosejaw", productName: "Petzl Lynx Crampons", url: "https://www.moosejaw.com/product/petzl-lynx-crampons", price: 225 }
        ]
      },
      "Ice axe": {
        weight: "450g",
        priceRange: "$100-$200",
        specificProduct: "Petzl Summit EVO Ice Axe",
        links: [
          { retailer: "REI", productName: "Petzl Summit EVO Ice Axe", url: "https://www.rei.com/product/178654/petzl-summit-evo-ice-axe", price: 150 },
          { retailer: "Backcountry", productName: "Petzl Summit EVO", url: "https://www.backcountry.com/petzl-summit-evo-ice-axe", price: 145 },
          { retailer: "Amazon", productName: "Petzl Summit EVO Ice Axe", url: "https://www.amazon.com/dp/B08XYZABC4/petzl-summit-evo", price: 140 }
        ]
      },
      "Helmet": {
        weight: "230g",
        priceRange: "$60-$120",
        specificProduct: "Petzl Sirocco Helmet",
        links: [
          { retailer: "REI", productName: "Petzl Sirocco Climbing Helmet", url: "https://www.rei.com/product/134567/petzl-sirocco-climbing-helmet", price: 110 },
          { retailer: "Backcountry", productName: "Petzl Sirocco Helmet", url: "https://www.backcountry.com/petzl-sirocco-helmet", price: 105 },
          { retailer: "Amazon", productName: "Petzl Sirocco Ultralight Helmet", url: "https://www.amazon.com/dp/B07XYZABC5/petzl-sirocco-helmet", price: 100 }
        ]
      },
      "Rope (30m)": {
        weight: "1.8kg",
        priceRange: "$150-$250",
        specificProduct: "Mammut Alpine Sender 8.7mm x 30m",
        links: [
          { retailer: "REI", productName: "Mammut Alpine Sender 8.7mm Rope", url: "https://www.rei.com/product/189012/mammut-alpine-sender-8.7mm-rope", price: 200 },
          { retailer: "Backcountry", productName: "Mammut Alpine Sender 8.7mm", url: "https://www.backcountry.com/mammut-alpine-sender-8.7mm", price: 195 },
          { retailer: "Moosejaw", productName: "Mammut Alpine Sender Rope", url: "https://www.moosejaw.com/product/mammut-alpine-sender-rope", price: 200 }
        ]
      }
    },
    "Three Monts Route": {
      "Second ice tool": {
        weight: "580g",
        priceRange: "$200-$370",
        specificProduct: "Petzl Gully Ice Axe",
        links: [
          { retailer: "REI", productName: "Petzl Gully Ice Axe", url: "https://www.rei.com/product/187654/petzl-gully-ice-axe", price: 200 },
          { retailer: "Backcountry", productName: "Petzl Gully Adze Ice Axe", url: "https://www.backcountry.com/petzl-gully-adze-ice-axe", price: 195 },
          { retailer: "Moosejaw", productName: "Petzl Gully Ice Axe", url: "https://www.moosejaw.com/product/petzl-gully-ice-axe", price: 200 }
        ]
      },
      "Snow pickets": {
        weight: "280g each",
        priceRange: "$25-$45 each",
        specificProduct: "Black Diamond Snow Picket 24-inch",
        links: [
          { retailer: "REI", productName: "Black Diamond Snow Picket 24in", url: "https://www.rei.com/product/145678/black-diamond-snow-picket-24in", price: 35 },
          { retailer: "Backcountry", productName: "Black Diamond Snow Picket", url: "https://www.backcountry.com/black-diamond-snow-picket", price: 32 },
          { retailer: "Amazon", productName: "Black Diamond Snow Picket 24-inch", url: "https://www.amazon.com/dp/B06XYZABC6/black-diamond-snow-picket", price: 30 }
        ]
      }
    }
  },
  "Denali": {
    "West Buttress": {
      "Expedition sled": {
        weight: "4.5kg",
        priceRange: "$150-$300",
        specificProduct: "Paris Expedition Sled",
        links: [
          { retailer: "REI", productName: "Paris Expedition Sled", url: "https://www.rei.com/product/156789/paris-expedition-sled", price: 180 },
          { retailer: "Amazon", productName: "Paris Expedition Pulk Sled", url: "https://www.amazon.com/dp/B08XYZABC7/paris-expedition-sled", price: 170 },
          { retailer: "Backcountry", productName: "Paris Expedition Sled", url: "https://www.backcountry.com/paris-expedition-sled", price: 180 }
        ]
      },
      "Vapor barrier liners": {
        weight: "180g",
        priceRange: "$30-$60",
        specificProduct: "RBH Designs Vapor Barrier Liner Socks",
        links: [
          { retailer: "Amazon", productName: "RBH Designs VBL Socks", url: "https://www.amazon.com/dp/B07XYZABC8/rbh-designs-vbl-socks", price: 40 },
          { retailer: "REI", productName: "RBH Designs Vapor Barrier Socks", url: "https://www.rei.com/product/198765/rbh-designs-vapor-barrier-socks", price: 45 },
          { retailer: "Backcountry", productName: "RBH Designs VBL System", url: "https://www.backcountry.com/rbh-designs-vbl-system", price: 42 }
        ]
      },
      "-40F sleeping bag": {
        weight: "3.2kg",
        priceRange: "$800-$1,200",
        specificProduct: "Western Mountaineering Bison GWS -40F",
        links: [
          { retailer: "REI", productName: "Western Mountaineering Bison GWS", url: "https://www.rei.com/product/145234/western-mountaineering-bison-gws-sleeping-bag", price: 1050 },
          { retailer: "Backcountry", productName: "Western Mountaineering Bison GWS -40", url: "https://www.backcountry.com/western-mountaineering-bison-gws", price: 1000 },
          { retailer: "Moosejaw", productName: "Western Mountaineering Bison GWS", url: "https://www.moosejaw.com/product/western-mountaineering-bison-gws", price: 1050 }
        ]
      },
      "White gas stove": {
        weight: "330g",
        priceRange: "$90-$170",
        specificProduct: "MSR XGK EX Expedition Stove",
        links: [
          { retailer: "REI", productName: "MSR XGK EX Stove", url: "https://www.rei.com/product/112456/msr-xgk-ex-stove", price: 170 },
          { retailer: "Backcountry", productName: "MSR XGK EX Expedition Stove", url: "https://www.backcountry.com/msr-xgk-ex-stove", price: 165 },
          { retailer: "Amazon", productName: "MSR XGK EX Stove", url: "https://www.amazon.com/dp/B001XYZAB9/msr-xgk-ex-stove", price: 155 }
        ]
      }
    }
  },
  "Matterhorn": {
    "Hornli Ridge": {
      "Helmet": {
        weight: "230g",
        priceRange: "$60-$120",
        specificProduct: "Black Diamond Vision Helmet",
        links: [
          { retailer: "REI", productName: "Black Diamond Vision Helmet", url: "https://www.rei.com/product/176543/black-diamond-vision-climbing-helmet", price: 100 },
          { retailer: "Backcountry", productName: "Black Diamond Vision MIPS Helmet", url: "https://www.backcountry.com/black-diamond-vision-helmet", price: 100 },
          { retailer: "Moosejaw", productName: "Black Diamond Vision Helmet", url: "https://www.moosejaw.com/product/black-diamond-vision-helmet", price: 100 }
        ]
      },
      "50m half rope": {
        weight: "2.6kg",
        priceRange: "$180-$300",
        specificProduct: "Mammut Crag Classic 8.0mm x 50m",
        links: [
          { retailer: "REI", productName: "Mammut Crag Classic Half Rope 8.0mm", url: "https://www.rei.com/product/187654/mammut-crag-classic-half-rope-8.0mm", price: 200 },
          { retailer: "Backcountry", productName: "Mammut Crag Classic 8.0", url: "https://www.backcountry.com/mammut-crag-classic-8.0", price: 195 },
          { retailer: "Amazon", productName: "Mammut Crag Classic Half Rope", url: "https://www.amazon.com/dp/B08XYZAB10/mammut-crag-classic-half-rope", price: 190 }
        ]
      },
      "Light crampons": {
        weight: "700g per pair",
        priceRange: "$130-$220",
        specificProduct: "Petzl Irvis Hybrid Crampons",
        links: [
          { retailer: "REI", productName: "Petzl Irvis Hybrid Crampons", url: "https://www.rei.com/product/165432/petzl-irvis-hybrid-crampons", price: 175 },
          { retailer: "Backcountry", productName: "Petzl Irvis Hybrid", url: "https://www.backcountry.com/petzl-irvis-hybrid-crampons", price: 170 },
          { retailer: "Moosejaw", productName: "Petzl Irvis Hybrid Crampons", url: "https://www.moosejaw.com/product/petzl-irvis-hybrid", price: 175 }
        ]
      },
      "Rock shoes approach hybrid": {
        weight: "820g per pair",
        priceRange: "$130-$200",
        specificProduct: "La Sportiva TX4 Approach Shoe",
        links: [
          { retailer: "REI", productName: "La Sportiva TX4 Approach Shoes", url: "https://www.rei.com/product/156789/la-sportiva-tx4-approach-shoes", price: 165 },
          { retailer: "Backcountry", productName: "La Sportiva TX4", url: "https://www.backcountry.com/la-sportiva-tx4-approach-shoe", price: 160 },
          { retailer: "Amazon", productName: "La Sportiva TX4 Approach", url: "https://www.amazon.com/dp/B09XYZAB11/la-sportiva-tx4", price: 155 }
        ]
      }
    }
  },
  "Mount Rainier": {
    "Disappointment Cleaver": {
      "Crampons": {
        weight: "930g per pair",
        priceRange: "$150-$250",
        specificProduct: "Black Diamond Sabretooth Crampons",
        links: [
          { retailer: "REI", productName: "Black Diamond Sabretooth Crampons", url: "https://www.rei.com/product/112345/black-diamond-sabretooth-crampons", price: 200 },
          { retailer: "Backcountry", productName: "Black Diamond Sabretooth Clip", url: "https://www.backcountry.com/black-diamond-sabretooth-clip-crampon", price: 195 },
          { retailer: "Moosejaw", productName: "Black Diamond Sabretooth Crampons", url: "https://www.moosejaw.com/product/black-diamond-sabretooth", price: 200 }
        ]
      },
      "Ice axe": {
        weight: "450g",
        priceRange: "$100-$180",
        specificProduct: "Black Diamond Raven Ice Axe",
        links: [
          { retailer: "REI", productName: "Black Diamond Raven Ice Axe", url: "https://www.rei.com/product/134567/black-diamond-raven-ice-axe", price: 130 },
          { retailer: "Backcountry", productName: "Black Diamond Raven", url: "https://www.backcountry.com/black-diamond-raven-ice-axe", price: 125 },
          { retailer: "Amazon", productName: "Black Diamond Raven Ice Axe", url: "https://www.amazon.com/dp/B07XYZAB12/black-diamond-raven-ice-axe", price: 120 }
        ]
      },
      "Crevasse rescue kit": {
        weight: "650g",
        priceRange: "$80-$150",
        specificProduct: "Petzl RAD System Crevasse Rescue Kit",
        links: [
          { retailer: "REI", productName: "Petzl RAD System", url: "https://www.rei.com/product/187654/petzl-rad-system-crevasse-rescue", price: 130 },
          { retailer: "Backcountry", productName: "Petzl RAD System Kit", url: "https://www.backcountry.com/petzl-rad-system", price: 125 },
          { retailer: "Moosejaw", productName: "Petzl RAD System", url: "https://www.moosejaw.com/product/petzl-rad-system", price: 130 }
        ]
      },
      "Gaiters": {
        weight: "340g per pair",
        priceRange: "$50-$100",
        specificProduct: "Outdoor Research Crocodile Gaiters",
        links: [
          { retailer: "REI", productName: "Outdoor Research Crocodile Gaiters", url: "https://www.rei.com/product/134567/outdoor-research-crocodile-gaiters", price: 85 },
          { retailer: "Backcountry", productName: "OR Crocodile Gaiters", url: "https://www.backcountry.com/outdoor-research-crocodile-gaiters", price: 80 },
          { retailer: "Amazon", productName: "Outdoor Research Crocodile Gaiters", url: "https://www.amazon.com/dp/B08XYZAB13/or-crocodile-gaiters", price: 78 }
        ]
      }
    },
    "Emmons Glacier Route": {
      "GPS device": {
        weight: "230g",
        priceRange: "$300-$500",
        specificProduct: "Garmin GPSMAP 67i",
        links: [
          { retailer: "REI", productName: "Garmin GPSMAP 67i", url: "https://www.rei.com/product/212345/garmin-gpsmap-67i", price: 500 },
          { retailer: "Backcountry", productName: "Garmin GPSMAP 67i", url: "https://www.backcountry.com/garmin-gpsmap-67i", price: 500 },
          { retailer: "Amazon", productName: "Garmin GPSMAP 67i Handheld GPS", url: "https://www.amazon.com/dp/B0BXYZAB14/garmin-gpsmap-67i", price: 480 }
        ]
      }
    }
  },
  "Mount Whitney": {
    "Mount Whitney Trail": {
      "Trekking poles": {
        weight: "520g per pair",
        priceRange: "$80-$200",
        specificProduct: "Black Diamond Distance Carbon Z Trekking Poles",
        links: [
          { retailer: "REI", productName: "Black Diamond Distance Carbon Z Poles", url: "https://www.rei.com/product/178654/black-diamond-distance-carbon-z-poles", price: 170 },
          { retailer: "Backcountry", productName: "BD Distance Carbon Z", url: "https://www.backcountry.com/black-diamond-distance-carbon-z-poles", price: 165 },
          { retailer: "Amazon", productName: "Black Diamond Distance Carbon Z Trekking Poles", url: "https://www.amazon.com/dp/B09XYZAB15/bd-distance-carbon-z", price: 155 }
        ]
      },
      "Headlamp": {
        weight: "80g",
        priceRange: "$30-$80",
        specificProduct: "Petzl Actik Core Headlamp",
        links: [
          { retailer: "REI", productName: "Petzl Actik Core Headlamp", url: "https://www.rei.com/product/189012/petzl-actik-core-headlamp", price: 70 },
          { retailer: "Backcountry", productName: "Petzl Actik Core", url: "https://www.backcountry.com/petzl-actik-core-headlamp", price: 65 },
          { retailer: "Amazon", productName: "Petzl Actik Core Rechargeable Headlamp", url: "https://www.amazon.com/dp/B07XYZAB16/petzl-actik-core", price: 60 }
        ]
      },
      "Microspikes": {
        weight: "340g per pair",
        priceRange: "$30-$50",
        specificProduct: "Kahtoola MICROspikes",
        links: [
          { retailer: "REI", productName: "Kahtoola MICROspikes Traction System", url: "https://www.rei.com/product/890456/kahtoola-microspikes-traction-system", price: 40 },
          { retailer: "Backcountry", productName: "Kahtoola MICROspikes", url: "https://www.backcountry.com/kahtoola-microspikes", price: 38 },
          { retailer: "Amazon", productName: "Kahtoola MICROspikes Footwear Traction", url: "https://www.amazon.com/dp/B08XYZAB17/kahtoola-microspikes", price: 35 }
        ]
      }
    },
    "Mountaineers Route": {
      "Ice axe": {
        weight: "450g",
        priceRange: "$100-$180",
        specificProduct: "Petzl Summit EVO Ice Axe",
        links: [
          { retailer: "REI", productName: "Petzl Summit EVO Ice Axe", url: "https://www.rei.com/product/178654/petzl-summit-evo-ice-axe", price: 150 },
          { retailer: "Backcountry", productName: "Petzl Summit EVO", url: "https://www.backcountry.com/petzl-summit-evo", price: 145 },
          { retailer: "Amazon", productName: "Petzl Summit EVO", url: "https://www.amazon.com/dp/B08XYZAB18/petzl-summit-evo-ice-axe", price: 140 }
        ]
      },
      "Crampons": {
        weight: "930g per pair",
        priceRange: "$150-$250",
        specificProduct: "Grivel G12 Crampons",
        links: [
          { retailer: "REI", productName: "Grivel G12 Crampons", url: "https://www.rei.com/product/145678/grivel-g12-crampons", price: 180 },
          { retailer: "Backcountry", productName: "Grivel G12 Crampon", url: "https://www.backcountry.com/grivel-g12-crampon", price: 175 },
          { retailer: "Moosejaw", productName: "Grivel G12 Crampons", url: "https://www.moosejaw.com/product/grivel-g12-crampons", price: 180 }
        ]
      },
      "Helmet": {
        weight: "230g",
        priceRange: "$60-$100",
        specificProduct: "Black Diamond Half Dome Helmet",
        links: [
          { retailer: "REI", productName: "Black Diamond Half Dome Helmet", url: "https://www.rei.com/product/134567/black-diamond-half-dome-helmet", price: 60 },
          { retailer: "Backcountry", productName: "Black Diamond Half Dome", url: "https://www.backcountry.com/black-diamond-half-dome-helmet", price: 58 },
          { retailer: "Amazon", productName: "Black Diamond Half Dome Climbing Helmet", url: "https://www.amazon.com/dp/B07XYZAB19/bd-half-dome-helmet", price: 55 }
        ]
      }
    }
  },
  "Aconcagua": {
    "Normal Route (Northwest Ridge)": {
      "-30C sleeping bag": {
        weight: "2.2kg",
        priceRange: "$500-$900",
        specificProduct: "Western Mountaineering Puma MF -25F",
        links: [
          { retailer: "REI", productName: "Western Mountaineering Puma MF", url: "https://www.rei.com/product/156789/western-mountaineering-puma-mf-sleeping-bag", price: 750 },
          { retailer: "Backcountry", productName: "Western Mountaineering Puma MF -25", url: "https://www.backcountry.com/western-mountaineering-puma-mf", price: 720 },
          { retailer: "Moosejaw", productName: "Western Mountaineering Puma MF", url: "https://www.moosejaw.com/product/western-mountaineering-puma-mf", price: 750 }
        ]
      },
      "Double plastic boots": {
        weight: "2.8kg per pair",
        priceRange: "$600-$950",
        specificProduct: "Scarpa Phantom 6000",
        links: [
          { retailer: "REI", productName: "Scarpa Phantom 6000 Boots", url: "https://www.rei.com/product/167890/scarpa-phantom-6000-mountaineering-boots", price: 800 },
          { retailer: "Backcountry", productName: "Scarpa Phantom 6000", url: "https://www.backcountry.com/scarpa-phantom-6000-boot", price: 780 },
          { retailer: "Moosejaw", productName: "Scarpa Phantom 6000 Boots", url: "https://www.moosejaw.com/product/scarpa-phantom-6000", price: 800 }
        ]
      },
      "4-season tent": {
        weight: "3.5kg",
        priceRange: "$500-$800",
        specificProduct: "The North Face VE 25",
        links: [
          { retailer: "REI", productName: "The North Face VE 25 Tent", url: "https://www.rei.com/product/178901/the-north-face-ve-25-tent", price: 600 },
          { retailer: "Backcountry", productName: "TNF VE 25 3-Person Tent", url: "https://www.backcountry.com/the-north-face-ve-25-tent", price: 580 },
          { retailer: "Moosejaw", productName: "The North Face VE 25", url: "https://www.moosejaw.com/product/the-north-face-ve-25", price: 600 }
        ]
      }
    }
  },
  "Mount Kilimanjaro": {
    "Machame Route (Whiskey Route)": {
      "Warm sleeping bag rated to -10C": {
        weight: "1.6kg",
        priceRange: "$250-$500",
        specificProduct: "REI Co-op Magma 15 Sleeping Bag",
        links: [
          { retailer: "REI", productName: "REI Co-op Magma 15 Sleeping Bag", url: "https://www.rei.com/product/148765/rei-co-op-magma-15-sleeping-bag", price: 370 },
          { retailer: "Backcountry", productName: "Marmot Trestles Elite Eco 15", url: "https://www.backcountry.com/marmot-trestles-elite-eco-15", price: 250 },
          { retailer: "Amazon", productName: "Marmot Trestles Elite Eco 15 Sleeping Bag", url: "https://www.amazon.com/dp/B09XYZAB20/marmot-trestles-elite-15", price: 240 }
        ]
      },
      "Diamox (acetazolamide)": {
        weight: "50g",
        priceRange: "$15-$40",
        specificProduct: "Generic Acetazolamide 250mg (prescription required)",
        links: [
          { retailer: "Amazon", productName: "Altitude Sickness Prevention Kit", url: "https://www.amazon.com/dp/B08XYZAB21/altitude-sickness-prevention", price: 25 },
          { retailer: "REI", productName: "Adventure Medical Kits Travel Series", url: "https://www.rei.com/product/190234/adventure-medical-kits-travel-series", price: 35 }
        ]
      },
      "Layering system": {
        weight: "1.8kg total",
        priceRange: "$300-$600",
        specificProduct: "Patagonia Capilene Base + R1 Air + Nano Puff",
        links: [
          { retailer: "REI", productName: "Patagonia Nano Puff Jacket", url: "https://www.rei.com/product/156234/patagonia-nano-puff-jacket", price: 230 },
          { retailer: "Backcountry", productName: "Patagonia R1 Air Full-Zip", url: "https://www.backcountry.com/patagonia-r1-air-full-zip", price: 169 },
          { retailer: "Moosejaw", productName: "Patagonia Capilene Midweight Crew", url: "https://www.moosejaw.com/product/patagonia-capilene-midweight-crew", price: 69 }
        ]
      }
    },
    "Lemosho Route": {
      "Gaiters": {
        weight: "340g per pair",
        priceRange: "$50-$100",
        specificProduct: "Outdoor Research Rocky Mountain Low Gaiters",
        links: [
          { retailer: "REI", productName: "Outdoor Research Rocky Mountain Low Gaiters", url: "https://www.rei.com/product/167890/outdoor-research-rocky-mountain-low-gaiters", price: 45 },
          { retailer: "Backcountry", productName: "OR Rocky Mountain Low Gaiters", url: "https://www.backcountry.com/outdoor-research-rocky-mountain-low-gaiters", price: 42 },
          { retailer: "Amazon", productName: "Outdoor Research Rocky Mountain Low Gaiters", url: "https://www.amazon.com/dp/B07XYZAB22/or-rocky-mountain-gaiters", price: 40 }
        ]
      }
    }
  },
  "Mount Elbrus": {
    "South Route (Normal Route)": {
      "GPS device with waypoints": {
        weight: "230g",
        priceRange: "$300-$500",
        specificProduct: "Garmin GPSMAP 67",
        links: [
          { retailer: "REI", productName: "Garmin GPSMAP 67", url: "https://www.rei.com/product/212345/garmin-gpsmap-67", price: 400 },
          { retailer: "Backcountry", productName: "Garmin GPSMAP 67", url: "https://www.backcountry.com/garmin-gpsmap-67", price: 400 },
          { retailer: "Amazon", productName: "Garmin GPSMAP 67 Handheld GPS", url: "https://www.amazon.com/dp/B0BXYZAB23/garmin-gpsmap-67", price: 380 }
        ]
      },
      "Crampons": {
        weight: "930g per pair",
        priceRange: "$150-$250",
        specificProduct: "Grivel G12 New-Matic Crampons",
        links: [
          { retailer: "REI", productName: "Grivel G12 New-Matic Crampons", url: "https://www.rei.com/product/145678/grivel-g12-new-matic-crampons", price: 180 },
          { retailer: "Backcountry", productName: "Grivel G12 New-Matic", url: "https://www.backcountry.com/grivel-g12-new-matic-crampon", price: 175 },
          { retailer: "Moosejaw", productName: "Grivel G12 Crampons", url: "https://www.moosejaw.com/product/grivel-g12-crampons", price: 180 }
        ]
      },
      "Ski goggles": {
        weight: "200g",
        priceRange: "$80-$200",
        specificProduct: "Smith I/O MAG Goggles",
        links: [
          { retailer: "REI", productName: "Smith I/O MAG Snow Goggles", url: "https://www.rei.com/product/178654/smith-io-mag-snow-goggles", price: 230 },
          { retailer: "Backcountry", productName: "Smith I/O MAG Goggle", url: "https://www.backcountry.com/smith-io-mag-goggle", price: 220 },
          { retailer: "Amazon", productName: "Smith I/O MAG Snow Goggles", url: "https://www.amazon.com/dp/B09XYZAB24/smith-io-mag-goggles", price: 200 }
        ]
      }
    }
  },
  "Mount Fuji": {
    "Yoshida Trail": {
      "Rain gear": {
        weight: "450g",
        priceRange: "$100-$300",
        specificProduct: "Marmot PreCip Eco Jacket",
        links: [
          { retailer: "REI", productName: "Marmot PreCip Eco Jacket", url: "https://www.rei.com/product/156789/marmot-precip-eco-jacket", price: 110 },
          { retailer: "Backcountry", productName: "Marmot PreCip Eco Jacket", url: "https://www.backcountry.com/marmot-precip-eco-jacket", price: 100 },
          { retailer: "Amazon", productName: "Marmot PreCip Eco Rain Jacket", url: "https://www.amazon.com/dp/B08XYZAB25/marmot-precip-eco", price: 95 }
        ]
      },
      "Headlamp": {
        weight: "80g",
        priceRange: "$20-$60",
        specificProduct: "Black Diamond Spot 400 Headlamp",
        links: [
          { retailer: "REI", productName: "Black Diamond Spot 400 Headlamp", url: "https://www.rei.com/product/189012/black-diamond-spot-400-headlamp", price: 50 },
          { retailer: "Backcountry", productName: "Black Diamond Spot 400", url: "https://www.backcountry.com/black-diamond-spot-400-headlamp", price: 48 },
          { retailer: "Amazon", productName: "Black Diamond Spot 400 Headlamp", url: "https://www.amazon.com/dp/B09XYZAB26/bd-spot-400", price: 45 }
        ]
      },
      "100 yen coins": {
        weight: "50g for 10 coins",
        priceRange: "$0.70 each",
        specificProduct: "Exchange currency at airport or convenience store",
        links: [
          { retailer: "Amazon", productName: "Travel Money Belt for Coins", url: "https://www.amazon.com/dp/B07XYZAB27/travel-money-belt", price: 12 },
          { retailer: "REI", productName: "Eagle Creek RFID Travel Wallet", url: "https://www.rei.com/product/123456/eagle-creek-rfid-travel-wallet", price: 35 }
        ]
      }
    }
  },
  "Pikes Peak": {
    "Barr Trail": {
      "Trekking poles": {
        weight: "520g per pair",
        priceRange: "$80-$200",
        specificProduct: "Black Diamond Trail Explorer 3 Trekking Poles",
        links: [
          { retailer: "REI", productName: "Black Diamond Trail Explorer 3 Poles", url: "https://www.rei.com/product/178654/black-diamond-trail-explorer-3-poles", price: 90 },
          { retailer: "Backcountry", productName: "Black Diamond Trail Explorer 3", url: "https://www.backcountry.com/black-diamond-trail-explorer-3", price: 85 },
          { retailer: "Amazon", productName: "Black Diamond Trail Explorer 3 Trekking Poles", url: "https://www.amazon.com/dp/B08XYZAB28/bd-trail-explorer-3", price: 80 }
        ]
      },
      "Sun protection": {
        weight: "250g total",
        priceRange: "$20-$60",
        specificProduct: "Sunday Afternoons Ultra Adventure Hat + SPF 50 Sunscreen",
        links: [
          { retailer: "REI", productName: "Sunday Afternoons Ultra Adventure Hat", url: "https://www.rei.com/product/134567/sunday-afternoons-ultra-adventure-hat", price: 48 },
          { retailer: "Amazon", productName: "Sunday Afternoons Ultra Adventure Hat", url: "https://www.amazon.com/dp/B09XYZAB29/sunday-afternoons-ultra-adventure", price: 44 },
          { retailer: "Backcountry", productName: "Sunday Afternoons Ultra Adventure Hat", url: "https://www.backcountry.com/sunday-afternoons-ultra-adventure-hat", price: 48 }
        ]
      }
    }
  },
  "Mount Hood": {
    "South Side (Pearly Gates)": {
      "Crampons": {
        weight: "930g per pair",
        priceRange: "$150-$250",
        specificProduct: "Grivel G14 Crampons",
        links: [
          { retailer: "REI", productName: "Grivel G14 Crampons", url: "https://www.rei.com/product/145678/grivel-g14-crampons", price: 220 },
          { retailer: "Backcountry", productName: "Grivel G14 Crampon", url: "https://www.backcountry.com/grivel-g14-crampon", price: 210 },
          { retailer: "Moosejaw", productName: "Grivel G14 Crampons", url: "https://www.moosejaw.com/product/grivel-g14-crampons", price: 220 }
        ]
      },
      "Ice axe": {
        weight: "450g",
        priceRange: "$100-$180",
        specificProduct: "Petzl Summit EVO Ice Axe",
        links: [
          { retailer: "REI", productName: "Petzl Summit EVO Ice Axe", url: "https://www.rei.com/product/178654/petzl-summit-evo-ice-axe", price: 150 },
          { retailer: "Backcountry", productName: "Petzl Summit EVO", url: "https://www.backcountry.com/petzl-summit-evo-ice-axe", price: 145 },
          { retailer: "Amazon", productName: "Petzl Summit EVO Ice Axe", url: "https://www.amazon.com/dp/B08XYZAB30/petzl-summit-evo", price: 140 }
        ]
      },
      "Helmet": {
        weight: "230g",
        priceRange: "$60-$100",
        specificProduct: "Petzl Boreo Helmet",
        links: [
          { retailer: "REI", productName: "Petzl Boreo Climbing Helmet", url: "https://www.rei.com/product/156789/petzl-boreo-climbing-helmet", price: 65 },
          { retailer: "Backcountry", productName: "Petzl Boreo Helmet", url: "https://www.backcountry.com/petzl-boreo-helmet", price: 60 },
          { retailer: "Amazon", productName: "Petzl Boreo Climbing Helmet", url: "https://www.amazon.com/dp/B09XYZAB31/petzl-boreo-helmet", price: 58 }
        ]
      }
    }
  },
  "Grand Teton": {
    "Owen-Spalding Route": {
      "60m rope": {
        weight: "3.6kg",
        priceRange: "$200-$350",
        specificProduct: "Mammut Crag Dry 9.5mm x 60m",
        links: [
          { retailer: "REI", productName: "Mammut Crag Dry 9.5mm x 60m Rope", url: "https://www.rei.com/product/189012/mammut-crag-dry-9.5mm-rope", price: 280 },
          { retailer: "Backcountry", productName: "Mammut Crag Dry 9.5", url: "https://www.backcountry.com/mammut-crag-dry-9.5mm", price: 270 },
          { retailer: "Moosejaw", productName: "Mammut Crag Dry Rope", url: "https://www.moosejaw.com/product/mammut-crag-dry-9.5mm", price: 280 }
        ]
      },
      "Trad rack (small to medium cams)": {
        weight: "1.8kg",
        priceRange: "$300-$500",
        specificProduct: "Black Diamond Camalot C4 0.3-3 Set",
        links: [
          { retailer: "REI", productName: "Black Diamond Camalot C4 Set 0.3-3", url: "https://www.rei.com/product/175432/black-diamond-camalot-c4-set", price: 450 },
          { retailer: "Backcountry", productName: "Black Diamond Camalot C4 Set", url: "https://www.backcountry.com/black-diamond-camalot-c4-set", price: 430 },
          { retailer: "Amazon", productName: "Black Diamond Camalot C4 Cam Set", url: "https://www.amazon.com/dp/B08XYZAB32/bd-camalot-c4-set", price: 420 }
        ]
      },
      "Helmet": {
        weight: "230g",
        priceRange: "$60-$120",
        specificProduct: "Petzl Meteor Helmet",
        links: [
          { retailer: "REI", productName: "Petzl Meteor Climbing Helmet", url: "https://www.rei.com/product/167890/petzl-meteor-climbing-helmet", price: 100 },
          { retailer: "Backcountry", productName: "Petzl Meteor Helmet", url: "https://www.backcountry.com/petzl-meteor-helmet", price: 95 },
          { retailer: "Moosejaw", productName: "Petzl Meteor Helmet", url: "https://www.moosejaw.com/product/petzl-meteor-helmet", price: 100 }
        ]
      }
    }
  },
  "Longs Peak": {
    "Keyhole Route": {
      "Helmet": {
        weight: "230g",
        priceRange: "$50-$100",
        specificProduct: "Black Diamond Half Dome Helmet",
        links: [
          { retailer: "REI", productName: "Black Diamond Half Dome Helmet", url: "https://www.rei.com/product/134567/black-diamond-half-dome-helmet", price: 60 },
          { retailer: "Backcountry", productName: "Black Diamond Half Dome", url: "https://www.backcountry.com/black-diamond-half-dome-helmet", price: 58 },
          { retailer: "Amazon", productName: "Black Diamond Half Dome Climbing Helmet", url: "https://www.amazon.com/dp/B07XYZAB33/bd-half-dome-helmet", price: 55 }
        ]
      },
      "Microspikes": {
        weight: "340g per pair",
        priceRange: "$30-$50",
        specificProduct: "Kahtoola MICROspikes",
        links: [
          { retailer: "REI", productName: "Kahtoola MICROspikes", url: "https://www.rei.com/product/890456/kahtoola-microspikes", price: 40 },
          { retailer: "Backcountry", productName: "Kahtoola MICROspikes", url: "https://www.backcountry.com/kahtoola-microspikes", price: 38 },
          { retailer: "Amazon", productName: "Kahtoola MICROspikes Traction", url: "https://www.amazon.com/dp/B08XYZAB34/kahtoola-microspikes", price: 35 }
        ]
      }
    }
  },
  "Mount Shasta": {
    "Avalanche Gulch": {
      "Ice axe": {
        weight: "450g",
        priceRange: "$100-$180",
        specificProduct: "Black Diamond Raven Ice Axe",
        links: [
          { retailer: "REI", productName: "Black Diamond Raven Ice Axe", url: "https://www.rei.com/product/134567/black-diamond-raven-ice-axe", price: 130 },
          { retailer: "Backcountry", productName: "Black Diamond Raven", url: "https://www.backcountry.com/black-diamond-raven-ice-axe", price: 125 },
          { retailer: "Amazon", productName: "Black Diamond Raven Ice Axe", url: "https://www.amazon.com/dp/B07XYZAB35/black-diamond-raven", price: 120 }
        ]
      },
      "Crampons": {
        weight: "930g per pair",
        priceRange: "$150-$250",
        specificProduct: "Black Diamond Sabretooth Crampons",
        links: [
          { retailer: "REI", productName: "Black Diamond Sabretooth Crampons", url: "https://www.rei.com/product/112345/black-diamond-sabretooth-crampons", price: 200 },
          { retailer: "Backcountry", productName: "Black Diamond Sabretooth", url: "https://www.backcountry.com/black-diamond-sabretooth-crampon", price: 195 },
          { retailer: "Moosejaw", productName: "Black Diamond Sabretooth Crampons", url: "https://www.moosejaw.com/product/black-diamond-sabretooth", price: 200 }
        ]
      },
      "Sunscreen SPF 50+": {
        weight: "100g",
        priceRange: "$10-$25",
        specificProduct: "Sun Bum SPF 50 Sunscreen Lotion",
        links: [
          { retailer: "REI", productName: "Sun Bum Original SPF 50 Sunscreen", url: "https://www.rei.com/product/178654/sun-bum-original-spf-50-sunscreen", price: 18 },
          { retailer: "Amazon", productName: "Sun Bum SPF 50 Moisturizing Sunscreen", url: "https://www.amazon.com/dp/B09XYZAB36/sun-bum-spf-50", price: 15 },
          { retailer: "Backcountry", productName: "Sun Bum SPF 50 Sunscreen", url: "https://www.backcountry.com/sun-bum-spf-50-sunscreen", price: 18 }
        ]
      }
    }
  },
  "Eiger": {
    "West Ridge (Normal Route)": {
      "Light ice tools": {
        weight: "540g each",
        priceRange: "$200-$350 each",
        specificProduct: "Petzl Gully Ice Axe",
        links: [
          { retailer: "REI", productName: "Petzl Gully Ice Axe", url: "https://www.rei.com/product/187654/petzl-gully-ice-axe", price: 200 },
          { retailer: "Backcountry", productName: "Petzl Gully Adze", url: "https://www.backcountry.com/petzl-gully-adze-ice-axe", price: 195 },
          { retailer: "Moosejaw", productName: "Petzl Gully Ice Axe", url: "https://www.moosejaw.com/product/petzl-gully-ice-axe", price: 200 }
        ]
      },
      "Crampons": {
        weight: "930g per pair",
        priceRange: "$150-$250",
        specificProduct: "Petzl Lynx Crampons",
        links: [
          { retailer: "REI", productName: "Petzl Lynx Leverlock Crampons", url: "https://www.rei.com/product/162345/petzl-lynx-leverlock-crampons", price: 225 },
          { retailer: "Backcountry", productName: "Petzl Lynx Crampons", url: "https://www.backcountry.com/petzl-lynx-crampons", price: 220 },
          { retailer: "Moosejaw", productName: "Petzl Lynx Crampons", url: "https://www.moosejaw.com/product/petzl-lynx-crampons", price: 225 }
        ]
      }
    }
  },
  "Mount Cook": {
    "Zurbriggen Ridge (Normal Route)": {
      "Technical ice tools": {
        weight: "580g each",
        priceRange: "$250-$400 each",
        specificProduct: "Petzl Quark Ice Axe",
        links: [
          { retailer: "REI", productName: "Petzl Quark Ice Axe", url: "https://www.rei.com/product/148765/petzl-quark-ice-axe", price: 300 },
          { retailer: "Backcountry", productName: "Petzl Quark Adze Ice Tool", url: "https://www.backcountry.com/petzl-quark-adze-ice-axe", price: 290 },
          { retailer: "Moosejaw", productName: "Petzl Quark Ice Axe", url: "https://www.moosejaw.com/product/petzl-quark-ice-axe", price: 300 }
        ]
      },
      "Ice screws (4-6)": {
        weight: "120g each",
        priceRange: "$50-$80 each",
        specificProduct: "Black Diamond Express Ice Screw",
        links: [
          { retailer: "REI", productName: "Black Diamond Express Ice Screw", url: "https://www.rei.com/product/157890/black-diamond-express-ice-screw", price: 55 },
          { retailer: "Backcountry", productName: "Black Diamond Express Ice Screw", url: "https://www.backcountry.com/black-diamond-express-ice-screw", price: 52 },
          { retailer: "Amazon", productName: "Black Diamond Express Ice Screw", url: "https://www.amazon.com/dp/B08XYZAB37/bd-express-ice-screw", price: 50 }
        ]
      },
      "4-season tent": {
        weight: "3.5kg",
        priceRange: "$500-$800",
        specificProduct: "MSR Remote 2 Tent",
        links: [
          { retailer: "REI", productName: "MSR Remote 2 Four-Season Tent", url: "https://www.rei.com/product/189012/msr-remote-2-tent", price: 700 },
          { retailer: "Backcountry", productName: "MSR Remote 2 Tent", url: "https://www.backcountry.com/msr-remote-2-tent", price: 680 },
          { retailer: "Moosejaw", productName: "MSR Remote 2 Tent", url: "https://www.moosejaw.com/product/msr-remote-2-tent", price: 700 }
        ]
      }
    }
  },
  "Mount Baker": {
    "Coleman-Deming Route": {
      "Crevasse rescue kit": {
        weight: "650g",
        priceRange: "$80-$150",
        specificProduct: "Petzl RAD System Crevasse Rescue Kit",
        links: [
          { retailer: "REI", productName: "Petzl RAD System", url: "https://www.rei.com/product/187654/petzl-rad-system-crevasse-rescue", price: 130 },
          { retailer: "Backcountry", productName: "Petzl RAD System Kit", url: "https://www.backcountry.com/petzl-rad-system", price: 125 },
          { retailer: "Moosejaw", productName: "Petzl RAD System", url: "https://www.moosejaw.com/product/petzl-rad-system", price: 130 }
        ]
      },
      "Wands or GPS": {
        weight: "15g per wand / 230g GPS",
        priceRange: "$20-$500",
        specificProduct: "Garmin inReach Mini 2 / Black Diamond Snow Wands",
        links: [
          { retailer: "REI", productName: "Garmin inReach Mini 2", url: "https://www.rei.com/product/212345/garmin-inreach-mini-2", price: 400 },
          { retailer: "Backcountry", productName: "Black Diamond Snow Wands 50-pack", url: "https://www.backcountry.com/black-diamond-snow-wands", price: 22 },
          { retailer: "Amazon", productName: "Garmin inReach Mini 2 Satellite Communicator", url: "https://www.amazon.com/dp/B0BXYZAB38/garmin-inreach-mini-2", price: 380 }
        ]
      }
    }
  },
  "Mount Blanc du Tacul": {
    "Normal Route (North Face)": {
      "Crampons": {
        weight: "930g per pair",
        priceRange: "$150-$250",
        specificProduct: "Petzl Irvis Hybrid Crampons",
        links: [
          { retailer: "REI", productName: "Petzl Irvis Hybrid Crampons", url: "https://www.rei.com/product/165432/petzl-irvis-hybrid-crampons", price: 175 },
          { retailer: "Backcountry", productName: "Petzl Irvis Hybrid", url: "https://www.backcountry.com/petzl-irvis-hybrid-crampons", price: 170 },
          { retailer: "Amazon", productName: "Petzl Irvis Hybrid Crampons", url: "https://www.amazon.com/dp/B09XYZAB39/petzl-irvis-hybrid", price: 165 }
        ]
      },
      "Ice axe": {
        weight: "450g",
        priceRange: "$100-$180",
        specificProduct: "Petzl Summit EVO Ice Axe",
        links: [
          { retailer: "REI", productName: "Petzl Summit EVO Ice Axe", url: "https://www.rei.com/product/178654/petzl-summit-evo-ice-axe", price: 150 },
          { retailer: "Backcountry", productName: "Petzl Summit EVO", url: "https://www.backcountry.com/petzl-summit-evo-ice-axe", price: 145 },
          { retailer: "Amazon", productName: "Petzl Summit EVO Ice Axe", url: "https://www.amazon.com/dp/B08XYZAB40/petzl-summit-evo", price: 140 }
        ]
      }
    }
  },
  "Huascaran": {
    "Normal Route (Garganta Col)": {
      "Pickets and snow anchors": {
        weight: "280g each",
        priceRange: "$25-$50 each",
        specificProduct: "Black Diamond Snow Picket 24-inch",
        links: [
          { retailer: "REI", productName: "Black Diamond Snow Picket", url: "https://www.rei.com/product/145678/black-diamond-snow-picket-24in", price: 35 },
          { retailer: "Backcountry", productName: "Black Diamond Snow Picket", url: "https://www.backcountry.com/black-diamond-snow-picket", price: 32 },
          { retailer: "Amazon", productName: "Black Diamond Snow Picket 24-inch", url: "https://www.amazon.com/dp/B06XYZAB41/black-diamond-snow-picket", price: 30 }
        ]
      },
      "Double boots": {
        weight: "2.8kg per pair",
        priceRange: "$600-$950",
        specificProduct: "Scarpa Phantom 6000",
        links: [
          { retailer: "REI", productName: "Scarpa Phantom 6000 Boots", url: "https://www.rei.com/product/167890/scarpa-phantom-6000-boots", price: 800 },
          { retailer: "Backcountry", productName: "Scarpa Phantom 6000", url: "https://www.backcountry.com/scarpa-phantom-6000-boot", price: 780 },
          { retailer: "Moosejaw", productName: "Scarpa Phantom 6000", url: "https://www.moosejaw.com/product/scarpa-phantom-6000", price: 800 }
        ]
      }
    }
  },
  "Mount Adams": {
    "South Spur": {
      "Ice axe": {
        weight: "450g",
        priceRange: "$80-$150",
        specificProduct: "Black Diamond Raven Ice Axe",
        links: [
          { retailer: "REI", productName: "Black Diamond Raven Ice Axe", url: "https://www.rei.com/product/134567/black-diamond-raven-ice-axe", price: 130 },
          { retailer: "Backcountry", productName: "Black Diamond Raven", url: "https://www.backcountry.com/black-diamond-raven-ice-axe", price: 125 },
          { retailer: "Amazon", productName: "Black Diamond Raven Ice Axe", url: "https://www.amazon.com/dp/B07XYZAB42/black-diamond-raven", price: 120 }
        ]
      },
      "Sunscreen and lip balm": {
        weight: "120g total",
        priceRange: "$10-$30",
        specificProduct: "Sun Bum SPF 50 + Dermatone SPF 30 Lip Balm",
        links: [
          { retailer: "REI", productName: "Sun Bum Original SPF 50 Sunscreen", url: "https://www.rei.com/product/178654/sun-bum-spf-50-sunscreen", price: 18 },
          { retailer: "Amazon", productName: "Dermatone SPF 30 Medicated Lip Balm", url: "https://www.amazon.com/dp/B09XYZAB43/dermatone-lip-balm", price: 8 },
          { retailer: "Backcountry", productName: "Sun Bum SPF 50 Sunscreen Lotion", url: "https://www.backcountry.com/sun-bum-spf-50", price: 18 }
        ]
      }
    }
  },
  "Puncak Jaya": {
    "Normal Route (North Face)": {
      "Climbing harness": {
        weight: "400g",
        priceRange: "$50-$120",
        specificProduct: "Black Diamond Momentum Harness",
        links: [
          { retailer: "REI", productName: "Black Diamond Momentum Harness", url: "https://www.rei.com/product/156789/black-diamond-momentum-harness", price: 65 },
          { retailer: "Backcountry", productName: "Black Diamond Momentum Harness", url: "https://www.backcountry.com/black-diamond-momentum-harness", price: 60 },
          { retailer: "Amazon", productName: "Black Diamond Momentum Climbing Harness", url: "https://www.amazon.com/dp/B08XYZAB44/bd-momentum-harness", price: 58 }
        ]
      },
      "Heavy leather gloves": {
        weight: "300g per pair",
        priceRange: "$30-$80",
        specificProduct: "Black Diamond Crag Half-Finger Gloves",
        links: [
          { retailer: "REI", productName: "Black Diamond Crag Gloves", url: "https://www.rei.com/product/134567/black-diamond-crag-gloves", price: 35 },
          { retailer: "Backcountry", productName: "Black Diamond Crag Glove", url: "https://www.backcountry.com/black-diamond-crag-glove", price: 32 },
          { retailer: "Amazon", productName: "Mechanix Wear Leather Work Gloves", url: "https://www.amazon.com/dp/B09XYZAB45/mechanix-leather-gloves", price: 30 }
        ]
      },
      "Via ferrata kit": {
        weight: "550g",
        priceRange: "$80-$150",
        specificProduct: "Petzl Scorpio Via Ferrata Lanyard",
        links: [
          { retailer: "REI", productName: "Petzl Scorpio Via Ferrata Set", url: "https://www.rei.com/product/167890/petzl-scorpio-via-ferrata-set", price: 120 },
          { retailer: "Backcountry", productName: "Petzl Scorpio Lanyard", url: "https://www.backcountry.com/petzl-scorpio-via-ferrata-lanyard", price: 115 },
          { retailer: "Amazon", productName: "Petzl Scorpio Via Ferrata Kit", url: "https://www.amazon.com/dp/B07XYZAB46/petzl-scorpio-via-ferrata", price: 110 }
        ]
      }
    }
  },
  "Mount Vinson": {
    "Normal Route (Branscomb Glacier)": {
      "Expedition down suit": {
        weight: "2.4kg",
        priceRange: "$1,200-$1,800",
        specificProduct: "Mountain Hardwear Absolute Zero Suit",
        links: [
          { retailer: "REI", productName: "Mountain Hardwear Absolute Zero Suit", url: "https://www.rei.com/product/198234/mountain-hardwear-absolute-zero-suit", price: 1500 },
          { retailer: "Backcountry", productName: "Mountain Hardwear Absolute Zero", url: "https://www.backcountry.com/mountain-hardwear-absolute-zero-suit", price: 1450 },
          { retailer: "Moosejaw", productName: "Mountain Hardwear Absolute Zero Suit", url: "https://www.moosejaw.com/product/mountain-hardwear-absolute-zero-suit", price: 1500 }
        ]
      },
      "-40C sleeping bag": {
        weight: "3.2kg",
        priceRange: "$800-$1,200",
        specificProduct: "Western Mountaineering Bison GWS -40F",
        links: [
          { retailer: "REI", productName: "Western Mountaineering Bison GWS", url: "https://www.rei.com/product/145234/western-mountaineering-bison-gws", price: 1050 },
          { retailer: "Backcountry", productName: "Western Mountaineering Bison GWS -40", url: "https://www.backcountry.com/western-mountaineering-bison-gws", price: 1000 },
          { retailer: "Moosejaw", productName: "Western Mountaineering Bison GWS", url: "https://www.moosejaw.com/product/western-mountaineering-bison-gws", price: 1050 }
        ]
      },
      "Vapor barrier socks and gloves": {
        weight: "200g total",
        priceRange: "$30-$70",
        specificProduct: "RBH Designs VBL Socks + Gloves Set",
        links: [
          { retailer: "Amazon", productName: "RBH Designs VBL Sock and Glove Set", url: "https://www.amazon.com/dp/B08XYZAB47/rbh-designs-vbl-set", price: 55 },
          { retailer: "REI", productName: "RBH Designs Vapor Barrier Accessories", url: "https://www.rei.com/product/198765/rbh-designs-vbl-accessories", price: 60 },
          { retailer: "Backcountry", productName: "RBH Designs VBL System", url: "https://www.backcountry.com/rbh-designs-vbl-system-set", price: 55 }
        ]
      }
    }
  },
  "Cho Oyu": {
    "Northwest Ridge": {
      "Supplemental oxygen": {
        weight: "3.5kg per bottle",
        priceRange: "$450-$550 per bottle",
        specificProduct: "Poisk Summit Oxygen System",
        links: [
          { retailer: "Amazon", productName: "Summit Oxygen Climbing System", url: "https://www.amazon.com/dp/B09XYZAB48/summit-oxygen-system", price: 500 },
          { retailer: "REI", productName: "High Altitude Oxygen System", url: "https://www.rei.com/product/201456/high-altitude-oxygen-system", price: 490 },
          { retailer: "Backcountry", productName: "Top Out Oxygen Mask System", url: "https://www.backcountry.com/topout-oxygen-mask", price: 520 }
        ]
      },
      "Down suit": {
        weight: "2.4kg",
        priceRange: "$1,000-$1,600",
        specificProduct: "Rab Expedition 8000 Suit",
        links: [
          { retailer: "REI", productName: "Rab Expedition 8000 Suit", url: "https://www.rei.com/product/198234/rab-expedition-8000-suit", price: 1400 },
          { retailer: "Backcountry", productName: "Rab Expedition 8000 Suit", url: "https://www.backcountry.com/rab-expedition-8000-suit", price: 1350 },
          { retailer: "Moosejaw", productName: "Rab Expedition 8000 Suit", url: "https://www.moosejaw.com/product/rab-expedition-8000-suit", price: 1400 }
        ]
      }
    }
  },
  "Mount Olympus": {
    "Blue Glacier Route": {
      "Crevasse rescue kit": {
        weight: "650g",
        priceRange: "$80-$150",
        specificProduct: "Petzl RAD System Crevasse Rescue Kit",
        links: [
          { retailer: "REI", productName: "Petzl RAD System", url: "https://www.rei.com/product/187654/petzl-rad-system", price: 130 },
          { retailer: "Backcountry", productName: "Petzl RAD System Kit", url: "https://www.backcountry.com/petzl-rad-system", price: 125 },
          { retailer: "Amazon", productName: "Petzl RAD System Crevasse Rescue", url: "https://www.amazon.com/dp/B08XYZAB49/petzl-rad-system", price: 120 }
        ]
      },
      "Bear canister": {
        weight: "1.0kg",
        priceRange: "$60-$90",
        specificProduct: "BearVault BV500 Bear Canister",
        links: [
          { retailer: "REI", productName: "BearVault BV500 Bear Resistant Container", url: "https://www.rei.com/product/134567/bearvault-bv500-bear-canister", price: 80 },
          { retailer: "Backcountry", productName: "BearVault BV500", url: "https://www.backcountry.com/bearvault-bv500", price: 75 },
          { retailer: "Amazon", productName: "BearVault BV500 Journey Bear Canister", url: "https://www.amazon.com/dp/B09XYZAB50/bearvault-bv500", price: 70 }
        ]
      }
    }
  }
};

// Apply enrichment to each peak and route
data.forEach(peak => {
  const peakName = peak.peakName;
  peak.routes.forEach(route => {
    const routeName = route.name;

    // Apply route-level enrichment
    const rEnrich = routeEnrichment[peakName] && routeEnrichment[peakName][routeName];
    if (rEnrich) {
      route.summary = rEnrich.summary;
      route.imageUrl = rEnrich.imageUrl;
      route.technicalGrade = rEnrich.technicalGrade;
      route.commitment = rEnrich.commitment;
      route.approachTime = rEnrich.approachTime;
      route.descentTime = rEnrich.descentTime;
      route.basecamp = rEnrich.basecamp;
      route.permitRequired = rEnrich.permitRequired;
      route.permitInfo = rEnrich.permitInfo;
      route.closestAirport = rEnrich.closestAirport;
      route.safetyNotes = rEnrich.safetyNotes;
    } else {
      console.warn(`WARNING: No route enrichment found for ${peakName} -> ${routeName}`);
    }

    // Apply gear-level enrichment
    if (route.gear) {
      route.gear.forEach(gearItem => {
        const gEnrich = gearEnrichment[peakName] && gearEnrichment[peakName][routeName] && gearEnrichment[peakName][routeName][gearItem.itemName];
        if (gEnrich) {
          gearItem.weight = gEnrich.weight;
          gearItem.priceRange = gEnrich.priceRange;
          gearItem.specificProduct = gEnrich.specificProduct;
          gearItem.links = gEnrich.links;
        } else {
          console.warn(`WARNING: No gear enrichment found for ${peakName} -> ${routeName} -> ${gearItem.itemName}`);
        }
      });
    }
  });
});

// Write the enriched data
const output = JSON.stringify(data, null, 2);
fs.writeFileSync(inputPath, output, 'utf8');
console.log(`Successfully wrote enriched file (${output.length} characters)`);
console.log('Done!');
