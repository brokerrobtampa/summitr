const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'peaks-world.json');
const peaks = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

// Enrichment data keyed by peak name
const enrichment = {
  // === 8000m HIMALAYAN PEAKS (Nepal side) ===
  "Mount Everest": {
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e7/Everest_North_Face_toward_Base_Camp_Tibet_Luca_Galuzzi_2006.jpg",
    closestAirport: "Tribhuvan International Airport (KTM)",
    closestAirportDistance: "140 km by road to Lukla, then trek to Base Camp",
    permitRequired: true,
    permitInfo: "Nepal Mountaineering Association permit required; royalty fee of $11,000 per climber for standard route. Liaison officer required.",
    bestMonths: "April-May, September-October"
  },
  "K2": {
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e2/K2_2006b.jpg",
    closestAirport: "Islamabad International Airport (ISB)",
    closestAirportDistance: "620 km by road to Skardu, then trek to Base Camp",
    permitRequired: true,
    permitInfo: "Pakistan Alpine Club permit required; approximately $7,200 per climber plus peak fee. Liaison officer and environmental bond required.",
    bestMonths: "June-August"
  },
  "Kangchenjunga": {
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/8/8f/Kangchenjunga_from_Darjeeling.jpg",
    closestAirport: "Tribhuvan International Airport (KTM)",
    closestAirportDistance: "Flight to Bhadrapur then drive and trek, approx 2 weeks approach",
    permitRequired: true,
    permitInfo: "Nepal Mountaineering Association permit required; royalty fee applies. Climbers traditionally stop short of the true summit out of respect for local beliefs.",
    bestMonths: "April-May, September-October"
  },
  "Lhotse": {
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4d/Lhotse-2012.jpg",
    closestAirport: "Tribhuvan International Airport (KTM)",
    closestAirportDistance: "140 km by road to Lukla, then trek to Base Camp",
    permitRequired: true,
    permitInfo: "Nepal Mountaineering Association permit required; shares Everest Base Camp approach. Royalty fee of approximately $10,000 per climber.",
    bestMonths: "April-May, September-October"
  },
  "Makalu": {
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/5/55/Makalu.jpg",
    closestAirport: "Tribhuvan International Airport (KTM)",
    closestAirportDistance: "Flight to Tumlingtar then multi-day trek to Base Camp",
    permitRequired: true,
    permitInfo: "Nepal Mountaineering Association permit required; royalty fee applies. Remote approach adds logistical complexity.",
    bestMonths: "April-May, September-October"
  },
  "Cho Oyu": {
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/2/2e/Cho_Oyu.jpg",
    closestAirport: "Tribhuvan International Airport (KTM)",
    closestAirportDistance: "Drive to Tingri (Tibet side) or trek from Namche (Nepal side)",
    permitRequired: true,
    permitInfo: "Nepal or China/Tibet Mountaineering Association permit required depending on route. Royalty fee applies.",
    bestMonths: "April-May, September-October"
  },
  "Dhaulagiri": {
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/4/49/Dhaulagiri_mountain.jpg",
    closestAirport: "Tribhuvan International Airport (KTM)",
    closestAirportDistance: "200 km by road to Beni, then multi-day trek to Base Camp",
    permitRequired: true,
    permitInfo: "Nepal Mountaineering Association permit required; royalty fee applies.",
    bestMonths: "April-May, September-October"
  },
  "Manaslu": {
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/e/ec/Manaslu%2C_from_base_camp_trip.jpg",
    closestAirport: "Tribhuvan International Airport (KTM)",
    closestAirportDistance: "Drive to Arughat then multi-day trek to Base Camp",
    permitRequired: true,
    permitInfo: "Nepal Mountaineering Association permit required; restricted area permit also needed for the Manaslu Conservation Area.",
    bestMonths: "April-May, September-October"
  },
  "Nanga Parbat": {
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/2/21/Nanga_Parbat.jpg",
    closestAirport: "Islamabad International Airport (ISB)",
    closestAirportDistance: "Flight to Gilgit then drive to Tato village, approx 600 km total",
    permitRequired: true,
    permitInfo: "Pakistan Alpine Club permit required. Peak fee and liaison officer mandatory.",
    bestMonths: "June-August"
  },
  "Annapurna I": {
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/a/ac/Annapurna_I.jpg",
    closestAirport: "Tribhuvan International Airport (KTM)",
    closestAirportDistance: "200 km by road to Pokhara, then trek to Base Camp",
    permitRequired: true,
    permitInfo: "Nepal Mountaineering Association permit required; Annapurna Conservation Area permit also needed. High fatality rate.",
    bestMonths: "April-May, September-October"
  },
  "Gasherbrum I": {
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c8/GasherbrumI-fromSW.jpg",
    closestAirport: "Islamabad International Airport (ISB)",
    closestAirportDistance: "620 km by road to Skardu, then trek to Base Camp via Baltoro Glacier",
    permitRequired: true,
    permitInfo: "Pakistan Alpine Club permit required. Peak fee and liaison officer mandatory.",
    bestMonths: "June-August"
  },
  "Broad Peak": {
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Broad_Peak.jpg",
    closestAirport: "Islamabad International Airport (ISB)",
    closestAirportDistance: "620 km by road to Skardu, then trek to Base Camp via Baltoro Glacier",
    permitRequired: true,
    permitInfo: "Pakistan Alpine Club permit required. Peak fee and liaison officer mandatory.",
    bestMonths: "June-August"
  },
  "Gasherbrum II": {
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/7/72/Gasherbrum2.jpg",
    closestAirport: "Islamabad International Airport (ISB)",
    closestAirportDistance: "620 km by road to Skardu, then trek to Base Camp via Baltoro Glacier",
    permitRequired: true,
    permitInfo: "Pakistan Alpine Club permit required. Peak fee and liaison officer mandatory.",
    bestMonths: "June-August"
  },
  "Shishapangma": {
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/3/36/Shishapangma_from_Tingri.jpg",
    closestAirport: "Tribhuvan International Airport (KTM)",
    closestAirportDistance: "Drive via Friendship Highway to Nyalam (Tibet side), approx 170 km",
    permitRequired: true,
    permitInfo: "China/Tibet Mountaineering Association permit required. Must be organized through a licensed Chinese agency.",
    bestMonths: "April-May, September-October"
  },

  // === SEVEN SUMMITS & MAJOR WORLD PEAKS ===
  "Denali": {
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e5/Denali_Mt_McKinley.jpg",
    closestAirport: "Ted Stevens Anchorage International Airport (ANC)",
    closestAirportDistance: "240 km by road to Talkeetna, then bush plane to Kahiltna Glacier",
    permitRequired: true,
    permitInfo: "National Park Service special use permit required; approximately $415 per climber. 60-day advance registration mandatory.",
    bestMonths: "May-July"
  },
  "Aconcagua": {
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/0/0b/Aconcagua_13.jpg",
    closestAirport: "Governor Francisco Gabrielli International Airport (MDZ)",
    closestAirportDistance: "180 km by road from Mendoza to Horcones trailhead",
    permitRequired: true,
    permitInfo: "Permit from Aconcagua Provincial Park required; approximately $800-$1,000 depending on season. Online reservation system.",
    bestMonths: "December-February"
  },
  "Mount Kilimanjaro": {
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/6/6b/Mt._Kilimanjaro_12.2006.JPG",
    closestAirport: "Kilimanjaro International Airport (JRO)",
    closestAirportDistance: "50 km by road from airport to Moshi town, trailheads nearby",
    permitRequired: true,
    permitInfo: "Tanzania National Parks Authority permit required; park fees approximately $70/day. Licensed guide mandatory.",
    bestMonths: "January-March, June-October"
  },
  "Mount Elbrus": {
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/2/21/Mount_Elbrus_May_2008.jpg",
    closestAirport: "Mineralnye Vody Airport (MRV)",
    closestAirportDistance: "160 km by road from airport to Terskol base village",
    permitRequired: true,
    permitInfo: "Russian border zone permit required for the area. Registration with local authorities needed.",
    bestMonths: "June-September"
  },
  "Mount Vinson": {
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/5/58/Vinson_Massif_from_NW_at_Vinson_Plateau%2C_2006.jpg",
    closestAirport: "Punta Arenas Airport (PUQ)",
    closestAirportDistance: "Fly from Punta Arenas to Union Glacier Camp (4.5 hr flight), then ski plane to Vinson Base Camp",
    permitRequired: true,
    permitInfo: "Antarctic Logistics & Expeditions manages all access. Costs approximately $45,000-$50,000 including flights. No government climbing permit needed.",
    bestMonths: "November-January"
  },
  "Puncak Jaya": {
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/4/41/Puncak_jaya.jpg",
    closestAirport: "Mozes Kilangin Airport (TIM)",
    closestAirportDistance: "Flight to Timika, then helicopter or multi-day trek to Base Camp",
    permitRequired: true,
    permitInfo: "Special permit from Indonesian government required; surat jalan (travel permit) for Papua. Access logistics complex due to Grasberg mine.",
    bestMonths: "May-November"
  },
  "Mount Kosciuszko": {
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d7/Kosciuszko_from_Kangaroo_Ridge.jpg",
    closestAirport: "Canberra Airport (CBR)",
    closestAirportDistance: "200 km by road from Canberra to Charlotte Pass or Thredbo",
    permitRequired: false,
    permitInfo: null,
    bestMonths: "November-March"
  },

  // === ALPS ===
  "Mont Blanc": {
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Mont_Blanc_depuis_Dome_Gouter.jpg",
    closestAirport: "Geneva Airport (GVA)",
    closestAirportDistance: "88 km by road from Geneva to Chamonix",
    permitRequired: true,
    permitInfo: "Since 2019, reservation at a mountain hut is mandatory. Some routes require booking through the Chamonix guides office. Equipment checks enforced.",
    bestMonths: "June-September"
  },
  "Matterhorn": {
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b4/Matterhorn_from_Domh%C3%BCtte_-_2.jpg",
    closestAirport: "Geneva Airport (GVA)",
    closestAirportDistance: "220 km by road from Geneva to Zermatt (car-free, train from Tasch)",
    permitRequired: false,
    permitInfo: "No permit required but a licensed mountain guide is strongly recommended. Hornli Hut reservation needed.",
    bestMonths: "July-September"
  },
  "Eiger": {
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/7/7d/Eiger_north_face.jpg",
    closestAirport: "Zurich Airport (ZRH)",
    closestAirportDistance: "150 km by road/train from Zurich to Grindelwald",
    permitRequired: false,
    permitInfo: "No permit required. Mountain rescue insurance strongly recommended.",
    bestMonths: "July-September"
  },
  "Jungfrau": {
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f4/Jungfrau_from_Kleine_Scheidegg.jpg",
    closestAirport: "Zurich Airport (ZRH)",
    closestAirportDistance: "150 km by road/train from Zurich to Grindelwald or Lauterbrunnen",
    permitRequired: false,
    permitInfo: "No permit required. Hut reservations recommended.",
    bestMonths: "June-September"
  },
  "Monte Rosa": {
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/9/97/Monte_Rosa_east.jpg",
    closestAirport: "Geneva Airport (GVA)",
    closestAirportDistance: "230 km by road from Geneva to Zermatt",
    permitRequired: false,
    permitInfo: "No permit required. Hut reservations recommended for the Monte Rosa Hut.",
    bestMonths: "June-September"
  },
  "Dom": {
    imageUrl: null,
    closestAirport: "Geneva Airport (GVA)",
    closestAirportDistance: "230 km by road/train to Randa or Saas-Fee",
    permitRequired: false,
    permitInfo: "No permit required. Dom Hut reservation recommended.",
    bestMonths: "June-September"
  },
  "Weisshorn": {
    imageUrl: null,
    closestAirport: "Geneva Airport (GVA)",
    closestAirportDistance: "220 km by road/train to Randa",
    permitRequired: false,
    permitInfo: "No permit required. Serious alpine route requiring experience.",
    bestMonths: "July-September"
  },
  "Gran Paradiso": {
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a7/GranParadiso.jpg",
    closestAirport: "Turin Airport (TRN)",
    closestAirportDistance: "120 km by road from Turin to Pont Valsavarenche",
    permitRequired: false,
    permitInfo: "No permit required. Located in Gran Paradiso National Park.",
    bestMonths: "June-September"
  },
  "Grossglockner": {
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/5/57/Grossglockner_from_south.jpg",
    closestAirport: "Salzburg Airport (SZG)",
    closestAirportDistance: "160 km by road from Salzburg to Kals am Grossglockner",
    permitRequired: false,
    permitInfo: "No permit required. Guide recommended for glacier travel.",
    bestMonths: "June-September"
  },
  "Zugspitze": {
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/d/da/Zugspitze_von_Ehrwald.jpg",
    closestAirport: "Munich Airport (MUC)",
    closestAirportDistance: "110 km by road from Munich to Garmisch-Partenkirchen",
    permitRequired: false,
    permitInfo: "No permit required. Accessible by cable car and cog railway.",
    bestMonths: "June-September"
  },
  "Mount Blanc du Tacul": {
    imageUrl: null,
    closestAirport: "Geneva Airport (GVA)",
    closestAirportDistance: "88 km by road from Geneva to Chamonix",
    permitRequired: false,
    permitInfo: "No specific permit required. Part of the Three Monts route to Mont Blanc.",
    bestMonths: "June-September"
  },
  "Dent Blanche": {
    imageUrl: null,
    closestAirport: "Geneva Airport (GVA)",
    closestAirportDistance: "200 km by road/train to Arolla or Zermatt",
    permitRequired: false,
    permitInfo: "No permit required. Serious alpine climb requiring experience.",
    bestMonths: "July-September"
  },
  "Aiguille Verte": {
    imageUrl: null,
    closestAirport: "Geneva Airport (GVA)",
    closestAirportDistance: "88 km by road from Geneva to Chamonix",
    permitRequired: false,
    permitInfo: "No permit required. Serious mountaineering objective.",
    bestMonths: "June-September"
  },
  "Grandes Jorasses": {
    imageUrl: null,
    closestAirport: "Geneva Airport (GVA)",
    closestAirportDistance: "88 km by road from Geneva to Chamonix",
    permitRequired: false,
    permitInfo: "No permit required. One of the great north faces of the Alps.",
    bestMonths: "July-September"
  },
  "Mount Blanc de Courmayeur": {
    imageUrl: null,
    closestAirport: "Milan Malpensa Airport (MXP)",
    closestAirportDistance: "220 km by road from Milan to Courmayeur",
    permitRequired: false,
    permitInfo: "No specific permit required. Part of the Mont Blanc massif.",
    bestMonths: "June-September"
  },
  "Lyskamm": {
    imageUrl: null,
    closestAirport: "Geneva Airport (GVA)",
    closestAirportDistance: "230 km by road from Geneva to Zermatt",
    permitRequired: false,
    permitInfo: "No permit required. Dangerous corniced ridge requires experience.",
    bestMonths: "July-September"
  },
  "Mount Blanc de Cheilon": {
    imageUrl: null,
    closestAirport: "Geneva Airport (GVA)",
    closestAirportDistance: "180 km by road from Geneva to Arolla",
    permitRequired: false,
    permitInfo: "No permit required.",
    bestMonths: "June-September"
  },
  "Breithorn": {
    imageUrl: null,
    closestAirport: "Geneva Airport (GVA)",
    closestAirportDistance: "230 km by road from Geneva to Zermatt",
    permitRequired: false,
    permitInfo: "No permit required. Accessible from Klein Matterhorn cable car.",
    bestMonths: "June-September"
  },
  "Castor": {
    imageUrl: null,
    closestAirport: "Geneva Airport (GVA)",
    closestAirportDistance: "230 km by road from Geneva to Zermatt",
    permitRequired: false,
    permitInfo: "No permit required. Glacier travel skills needed.",
    bestMonths: "June-September"
  },
  "Schreckhorn": {
    imageUrl: null,
    closestAirport: "Zurich Airport (ZRH)",
    closestAirportDistance: "150 km by road/train to Grindelwald",
    permitRequired: false,
    permitInfo: "No permit required. Serious alpine climb.",
    bestMonths: "July-September"
  },
  "Monch": {
    imageUrl: null,
    closestAirport: "Zurich Airport (ZRH)",
    closestAirportDistance: "150 km by road/train to Grindelwald",
    permitRequired: false,
    permitInfo: "No permit required. Accessible from Jungfraujoch railway station.",
    bestMonths: "June-September"
  },
  "Piz Bernina": {
    imageUrl: null,
    closestAirport: "Zurich Airport (ZRH)",
    closestAirportDistance: "200 km by road to Pontresina",
    permitRequired: false,
    permitInfo: "No permit required. The Biancograt is a classic alpine route.",
    bestMonths: "July-September"
  },
  "Aiguille du Midi": {
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/0/00/Aiguille_du_Midi_-_IMG_8443.jpg",
    closestAirport: "Geneva Airport (GVA)",
    closestAirportDistance: "88 km by road from Geneva to Chamonix",
    permitRequired: false,
    permitInfo: "No climbing permit required. Cable car provides access to the summit.",
    bestMonths: "June-September"
  },
  "Triglav": {
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/6/65/Triglav_from_SP.jpg",
    closestAirport: "Ljubljana Joze Pucnik Airport (LJU)",
    closestAirportDistance: "90 km by road from Ljubljana to Bohinj trailheads",
    permitRequired: false,
    permitInfo: "No permit required. Located in Triglav National Park. Hut reservations recommended in summer.",
    bestMonths: "June-September"
  },

  // === US CASCADES ===
  "Mount Rainier": {
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e7/Mount_Rainier_from_west.jpg",
    closestAirport: "Seattle-Tacoma International Airport (SEA)",
    closestAirportDistance: "100 km by road from Seattle to Paradise (south side)",
    permitRequired: true,
    permitInfo: "Climbing permit required from Mount Rainier National Park; $57 per climber. Advance reservation recommended for popular routes.",
    bestMonths: "May-September"
  },
  "Mount Hood": {
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Mount_Hood_reflected_in_Mirror_Lake%2C_Oregon.jpg",
    closestAirport: "Portland International Airport (PDX)",
    closestAirportDistance: "100 km by road from Portland to Timberline Lodge",
    permitRequired: true,
    permitInfo: "Climbing permit required; available at Timberline Lodge or Mazamas. Annual permit fee approximately $20.",
    bestMonths: "April-June"
  },
  "Mount Shasta": {
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/0/09/MtShasta_aerial.jpg",
    closestAirport: "Redding Municipal Airport (RDD)",
    closestAirportDistance: "100 km by road from Redding to Mount Shasta city",
    permitRequired: true,
    permitInfo: "Summit pass required ($25); wilderness permit also required. Self-issued at trailhead.",
    bestMonths: "May-September"
  },
  "Mount Adams": {
    imageUrl: null,
    closestAirport: "Portland International Airport (PDX)",
    closestAirportDistance: "160 km by road from Portland to Trout Lake or Randle",
    permitRequired: true,
    permitInfo: "Cascade Volcanoes climbing permit required ($15-$30). Yakama Nation permit required for south side routes.",
    bestMonths: "May-September"
  },
  "Mount Baker": {
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b4/Mount_Baker_from_Boulder_Creek.jpg",
    closestAirport: "Seattle-Tacoma International Airport (SEA)",
    closestAirportDistance: "200 km by road from Seattle to trailheads",
    permitRequired: true,
    permitInfo: "Climbing permit required. Northwest Forest Pass needed for trailhead parking.",
    bestMonths: "May-September"
  },
  "Mount Shuksan": {
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/6/6f/MtShuksan_Picture_lake.jpg",
    closestAirport: "Seattle-Tacoma International Airport (SEA)",
    closestAirportDistance: "210 km by road from Seattle to trailheads",
    permitRequired: true,
    permitInfo: "North Cascades wilderness permit required. Northwest Forest Pass needed.",
    bestMonths: "June-September"
  },
  "Mount Olympus (Washington)": {
    imageUrl: null,
    closestAirport: "Seattle-Tacoma International Airport (SEA)",
    closestAirportDistance: "250 km by road from Seattle to Hoh River trailhead",
    permitRequired: true,
    permitInfo: "Olympic National Park wilderness permit required. Bear canister required.",
    bestMonths: "June-September"
  },
  "Mount Stuart": {
    imageUrl: null,
    closestAirport: "Seattle-Tacoma International Airport (SEA)",
    closestAirportDistance: "170 km by road from Seattle to Leavenworth area trailheads",
    permitRequired: true,
    permitInfo: "Alpine Lakes Wilderness permit required for overnight trips.",
    bestMonths: "July-September"
  },
  "Glacier Peak": {
    imageUrl: null,
    closestAirport: "Seattle-Tacoma International Airport (SEA)",
    closestAirportDistance: "200 km by road from Seattle to trailheads",
    permitRequired: true,
    permitInfo: "Glacier Peak Wilderness permit required for overnight trips.",
    bestMonths: "June-September"
  },

  // === SIERRA NEVADA ===
  "Mount Whitney": {
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/8/83/Mt._Whitney_from_Whitney_Portal_Road.jpg",
    closestAirport: "Fresno Yosemite International Airport (FAT)",
    closestAirportDistance: "210 km by road from Fresno to Whitney Portal via Lone Pine",
    permitRequired: true,
    permitInfo: "Inyo National Forest wilderness permit required for all routes. Lottery system for Mount Whitney Trail. Day use and overnight permits available.",
    bestMonths: "June-September"
  },
  "Mount Williamson": {
    imageUrl: null,
    closestAirport: "Fresno Yosemite International Airport (FAT)",
    closestAirportDistance: "220 km by road from Fresno to Shepherd Pass trailhead",
    permitRequired: true,
    permitInfo: "Inyo National Forest wilderness permit required.",
    bestMonths: "June-September"
  },
  "Half Dome": {
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d6/Half_Dome_from_Glacier_Point%2C_Yosemite_NP_-_Diliff.jpg",
    closestAirport: "Fresno Yosemite International Airport (FAT)",
    closestAirportDistance: "150 km by road from Fresno to Yosemite Valley",
    permitRequired: true,
    permitInfo: "Day-use permit required for the cables route via lottery system. Wilderness permit required for overnight trips.",
    bestMonths: "May-October"
  },
  "El Capitan": {
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/5/55/El_Capitan%2C_Yosemite.jpg",
    closestAirport: "Fresno Yosemite International Airport (FAT)",
    closestAirportDistance: "150 km by road from Fresno to Yosemite Valley",
    permitRequired: true,
    permitInfo: "Big wall permits required for overnight climbs on El Capitan. Free, obtained at the Yosemite Valley Wilderness Center.",
    bestMonths: "April-October"
  },

  // === ALASKA PEAKS ===
  "Mount Foraker": {
    imageUrl: null,
    closestAirport: "Ted Stevens Anchorage International Airport (ANC)",
    closestAirportDistance: "240 km by road to Talkeetna, then bush plane to Kahiltna Glacier",
    permitRequired: true,
    permitInfo: "National Park Service permit required; same system as Denali. Approximately $415 per climber.",
    bestMonths: "May-July"
  },
  "Mount Hunter": {
    imageUrl: null,
    closestAirport: "Ted Stevens Anchorage International Airport (ANC)",
    closestAirportDistance: "240 km by road to Talkeetna, then bush plane",
    permitRequired: true,
    permitInfo: "National Park Service permit required for Denali National Park.",
    bestMonths: "May-July"
  },
  "Mount Saint Elias": {
    imageUrl: null,
    closestAirport: "Ted Stevens Anchorage International Airport (ANC)",
    closestAirportDistance: "Bush plane from Yakutat to base area, approx 450 km from Anchorage",
    permitRequired: true,
    permitInfo: "Wrangell-St. Elias National Park permit may be required. Remote expedition logistics needed.",
    bestMonths: "May-July"
  },
  "Mount Bona": {
    imageUrl: null,
    closestAirport: "Ted Stevens Anchorage International Airport (ANC)",
    closestAirportDistance: "Bush plane to glacier, approx 500 km from Anchorage",
    permitRequired: false,
    permitInfo: "Registration with Wrangell-St. Elias National Park recommended.",
    bestMonths: "May-July"
  },
  "Mount Blackburn": {
    imageUrl: null,
    closestAirport: "Ted Stevens Anchorage International Airport (ANC)",
    closestAirportDistance: "Bush plane from McCarthy, approx 480 km from Anchorage",
    permitRequired: false,
    permitInfo: "Registration with Wrangell-St. Elias National Park recommended.",
    bestMonths: "May-July"
  },
  "Mount Sanford": {
    imageUrl: null,
    closestAirport: "Ted Stevens Anchorage International Airport (ANC)",
    closestAirportDistance: "Bush plane access, approx 450 km from Anchorage",
    permitRequired: false,
    permitInfo: "Registration with Wrangell-St. Elias National Park recommended.",
    bestMonths: "May-July"
  },
  "Mount Fairweather": {
    imageUrl: null,
    closestAirport: "Juneau International Airport (JNU)",
    closestAirportDistance: "Bush plane or boat access from Juneau area, approx 200 km",
    permitRequired: true,
    permitInfo: "Glacier Bay National Park backcountry permit required.",
    bestMonths: "May-July"
  },

  // === CANADA ===
  "Mount Logan": {
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/7/7f/Mt_Logan.jpg",
    closestAirport: "Erik Nielsen Whitehorse International Airport (YXY)",
    closestAirportDistance: "Bush plane from Kluane Lake area to glacier, approx 300 km from Whitehorse",
    permitRequired: true,
    permitInfo: "Kluane National Park mountaineering registration required. Mandatory check-in with park wardens.",
    bestMonths: "May-July"
  },
  "Mount Robson": {
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/9/9a/Mount_Robson_-_North_Face.jpg",
    closestAirport: "Edmonton International Airport (YEG)",
    closestAirportDistance: "380 km by road from Edmonton via Yellowhead Highway",
    permitRequired: true,
    permitInfo: "Mount Robson Provincial Park backcountry permit required. Limited access to Berg Lake trail.",
    bestMonths: "July-September"
  },
  "Mount Columbia (Canada)": {
    imageUrl: null,
    closestAirport: "Edmonton International Airport (YEG)",
    closestAirportDistance: "350 km by road from Edmonton to Columbia Icefield area",
    permitRequired: true,
    permitInfo: "Jasper National Park backcountry permit required.",
    bestMonths: "May-July"
  },
  "Mount Waddington": {
    imageUrl: null,
    closestAirport: "Vancouver International Airport (YVR)",
    closestAirportDistance: "Bush plane or helicopter access, approx 350 km north of Vancouver",
    permitRequired: false,
    permitInfo: "No permit required but remote access. Helicopter or long approach needed.",
    bestMonths: "July-September"
  },
  "Mount Sir Donald": {
    imageUrl: null,
    closestAirport: "Calgary International Airport (YYC)",
    closestAirportDistance: "400 km by road from Calgary through Rogers Pass",
    permitRequired: true,
    permitInfo: "Glacier National Park of Canada backcountry use permit required.",
    bestMonths: "July-September"
  },
  "Bugaboo Spire": {
    imageUrl: null,
    closestAirport: "Calgary International Airport (YYC)",
    closestAirportDistance: "450 km by road from Calgary via Brisco",
    permitRequired: true,
    permitInfo: "Bugaboo Provincial Park camping permit required. Reservations for Conrad Kain Hut recommended.",
    bestMonths: "July-September"
  },

  // === SOUTH AMERICA ===
  "Ojos del Salado": {
    imageUrl: null,
    closestAirport: "Desierto de Atacama Airport (CPO)",
    closestAirportDistance: "400 km by road from Copiapo to base area",
    permitRequired: true,
    permitInfo: "Permit from Chilean DIFROL required for border area peaks. Advance application needed.",
    bestMonths: "November-March"
  },
  "Huascaran": {
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/1/11/Huascaran_in_Peru.jpg",
    closestAirport: "Jorge Chavez International Airport (LIM)",
    closestAirportDistance: "420 km by road from Lima to Huaraz",
    permitRequired: true,
    permitInfo: "Huascaran National Park entry fee required. Licensed guide recommended. Park fee approximately $20.",
    bestMonths: "May-September"
  },
  "Chimborazo": {
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/6/6e/Chimborazo_from_arenal.jpg",
    closestAirport: "Jose Joaquin de Olmedo International Airport (GYE)",
    closestAirportDistance: "230 km by road from Guayaquil to Chimborazo base",
    permitRequired: true,
    permitInfo: "Licensed guide mandatory. Registration with Chimborazo Wildlife Reserve required.",
    bestMonths: "December-January, June-September"
  },
  "Cotopaxi": {
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b5/Cotopaxi_volcano_2008-06-27T1322.jpg",
    closestAirport: "Mariscal Sucre International Airport (UIO)",
    closestAirportDistance: "60 km by road from Quito to Cotopaxi National Park entrance",
    permitRequired: true,
    permitInfo: "Cotopaxi National Park entry fee required. Licensed guide mandatory. Park may close during volcanic activity.",
    bestMonths: "August-February"
  },
  "Illimani": {
    imageUrl: null,
    closestAirport: "El Alto International Airport (LPB)",
    closestAirportDistance: "60 km by road from La Paz to trailhead",
    permitRequired: false,
    permitInfo: "No formal permit required. Licensed guide recommended.",
    bestMonths: "May-September"
  },
  "Sajama": {
    imageUrl: null,
    closestAirport: "El Alto International Airport (LPB)",
    closestAirportDistance: "310 km by road from La Paz to Sajama village",
    permitRequired: true,
    permitInfo: "Sajama National Park entry fee required. Local guide recommended.",
    bestMonths: "April-October"
  },
  "Alpamayo": {
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4f/Alpamayo.jpg",
    closestAirport: "Jorge Chavez International Airport (LIM)",
    closestAirportDistance: "450 km by road from Lima to Huaraz, then drive to trailhead",
    permitRequired: true,
    permitInfo: "Huascaran National Park entry fee required. Technical ice climbing skills needed.",
    bestMonths: "May-September"
  },
  "Fitz Roy": {
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f5/Fitz_Roy_Massif.jpg",
    closestAirport: "El Calafate Airport (FTE)",
    closestAirportDistance: "220 km by road from El Calafate to El Chalten",
    permitRequired: false,
    permitInfo: "No permit required. Free registration at Los Glaciares National Park visitor center in El Chalten.",
    bestMonths: "November-March"
  },
  "Cerro Torre": {
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/a/aa/Cerro_Torre_from_route_to_Campamento_Bridwell.jpg",
    closestAirport: "El Calafate Airport (FTE)",
    closestAirportDistance: "220 km by road from El Calafate to El Chalten",
    permitRequired: false,
    permitInfo: "No permit required. Free registration at Los Glaciares National Park visitor center in El Chalten.",
    bestMonths: "November-March"
  },
  "Cerro Aconcagua": {
    imageUrl: null,
    closestAirport: "Governor Francisco Gabrielli International Airport (MDZ)",
    closestAirportDistance: "180 km by road from Mendoza to Horcones trailhead",
    permitRequired: true,
    permitInfo: "Permit from Aconcagua Provincial Park required. Same system as main Aconcagua summit.",
    bestMonths: "December-February"
  },
  "Nevado Huascaran Norte": {
    imageUrl: null,
    closestAirport: "Jorge Chavez International Airport (LIM)",
    closestAirportDistance: "420 km by road from Lima to Huaraz",
    permitRequired: true,
    permitInfo: "Huascaran National Park entry fee required.",
    bestMonths: "May-September"
  },
  "Mercedario": {
    imageUrl: null,
    closestAirport: "Governor Francisco Gabrielli International Airport (MDZ)",
    closestAirportDistance: "350 km by road from Mendoza, plus approach trek",
    permitRequired: true,
    permitInfo: "Permit from San Juan provincial government required.",
    bestMonths: "December-February"
  },
  "Nevado de Cachi": {
    imageUrl: null,
    closestAirport: "Martin Miguel de Guemes International Airport (SLA)",
    closestAirportDistance: "170 km by road from Salta to Cachi town",
    permitRequired: false,
    permitInfo: "No formal permit required. Local guide recommended.",
    bestMonths: "May-October"
  },
  "Tres Cruces": {
    imageUrl: null,
    closestAirport: "Desierto de Atacama Airport (CPO)",
    closestAirportDistance: "350 km by road from Copiapo to base area",
    permitRequired: true,
    permitInfo: "Chilean DIFROL permit required for border area peaks.",
    bestMonths: "November-March"
  },
  "Pissis": {
    imageUrl: null,
    closestAirport: "Catamarca Airport (CTC)",
    closestAirportDistance: "500 km by road from Catamarca via 4WD tracks",
    permitRequired: false,
    permitInfo: "No formal permit required. Very remote, 4WD essential.",
    bestMonths: "November-March"
  },
  "Bonete": {
    imageUrl: null,
    closestAirport: "Catamarca Airport (CTC)",
    closestAirportDistance: "550 km by road from Catamarca via 4WD tracks",
    permitRequired: false,
    permitInfo: "No formal permit required. Very remote, 4WD essential.",
    bestMonths: "November-March"
  },

  // === COLORADO 14ERS ===
  "Mount Elbert": {
    imageUrl: null,
    closestAirport: "Denver International Airport (DEN)",
    closestAirportDistance: "190 km by road from Denver via Leadville",
    permitRequired: false,
    permitInfo: null,
    bestMonths: "June-September"
  },
  "Mount Massive": {
    imageUrl: null,
    closestAirport: "Denver International Airport (DEN)",
    closestAirportDistance: "190 km by road from Denver via Leadville",
    permitRequired: false,
    permitInfo: null,
    bestMonths: "June-September"
  },
  "Mount Harvard": {
    imageUrl: null,
    closestAirport: "Denver International Airport (DEN)",
    closestAirportDistance: "225 km by road from Denver via Buena Vista",
    permitRequired: false,
    permitInfo: null,
    bestMonths: "June-September"
  },
  "Blanca Peak": {
    imageUrl: null,
    closestAirport: "Denver International Airport (DEN)",
    closestAirportDistance: "310 km by road from Denver via Alamosa",
    permitRequired: false,
    permitInfo: null,
    bestMonths: "June-September"
  },
  "La Plata Peak": {
    imageUrl: null,
    closestAirport: "Denver International Airport (DEN)",
    closestAirportDistance: "210 km by road from Denver via Independence Pass",
    permitRequired: false,
    permitInfo: null,
    bestMonths: "June-September"
  },
  "Uncompahgre Peak": {
    imageUrl: null,
    closestAirport: "Denver International Airport (DEN)",
    closestAirportDistance: "460 km by road from Denver via Lake City",
    permitRequired: false,
    permitInfo: null,
    bestMonths: "June-September"
  },
  "Crestone Peak": {
    imageUrl: null,
    closestAirport: "Denver International Airport (DEN)",
    closestAirportDistance: "310 km by road from Denver via Crestone",
    permitRequired: false,
    permitInfo: null,
    bestMonths: "June-September"
  },
  "Mount Lincoln": {
    imageUrl: null,
    closestAirport: "Denver International Airport (DEN)",
    closestAirportDistance: "140 km by road from Denver via Fairplay",
    permitRequired: false,
    permitInfo: null,
    bestMonths: "June-September"
  },
  "Grays Peak": {
    imageUrl: null,
    closestAirport: "Denver International Airport (DEN)",
    closestAirportDistance: "100 km by road from Denver via I-70",
    permitRequired: false,
    permitInfo: null,
    bestMonths: "June-September"
  },
  "Mount Antero": {
    imageUrl: null,
    closestAirport: "Denver International Airport (DEN)",
    closestAirportDistance: "250 km by road from Denver via Salida",
    permitRequired: false,
    permitInfo: null,
    bestMonths: "June-September"
  },
  "Torreys Peak": {
    imageUrl: null,
    closestAirport: "Denver International Airport (DEN)",
    closestAirportDistance: "100 km by road from Denver via I-70",
    permitRequired: false,
    permitInfo: null,
    bestMonths: "June-September"
  },
  "Castle Peak": {
    imageUrl: null,
    closestAirport: "Denver International Airport (DEN)",
    closestAirportDistance: "320 km by road from Denver via Aspen",
    permitRequired: false,
    permitInfo: null,
    bestMonths: "June-September"
  },
  "Quandary Peak": {
    imageUrl: null,
    closestAirport: "Denver International Airport (DEN)",
    closestAirportDistance: "130 km by road from Denver via Breckenridge",
    permitRequired: false,
    permitInfo: null,
    bestMonths: "June-September"
  },
  "Mount Evans": {
    imageUrl: null,
    closestAirport: "Denver International Airport (DEN)",
    closestAirportDistance: "105 km by road from Denver via Idaho Springs",
    permitRequired: false,
    permitInfo: "Timed entry reservation required for Mount Evans Scenic Byway in summer.",
    bestMonths: "June-September"
  },
  "Longs Peak": {
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/8/88/Longs_Peak.jpg",
    closestAirport: "Denver International Airport (DEN)",
    closestAirportDistance: "115 km by road from Denver via Estes Park",
    permitRequired: true,
    permitInfo: "Rocky Mountain National Park timed entry permit required in summer. No climbing-specific permit for day use.",
    bestMonths: "July-September"
  },
  "Mount Wilson": {
    imageUrl: null,
    closestAirport: "Denver International Airport (DEN)",
    closestAirportDistance: "530 km by road from Denver via Telluride",
    permitRequired: false,
    permitInfo: null,
    bestMonths: "July-September"
  },
  "Mount Cameron": {
    imageUrl: null,
    closestAirport: "Denver International Airport (DEN)",
    closestAirportDistance: "140 km by road from Denver via Fairplay",
    permitRequired: false,
    permitInfo: null,
    bestMonths: "June-September"
  },
  "Mount Shavano": {
    imageUrl: null,
    closestAirport: "Denver International Airport (DEN)",
    closestAirportDistance: "240 km by road from Denver via Salida",
    permitRequired: false,
    permitInfo: null,
    bestMonths: "June-September"
  },
  "Mount Belford": {
    imageUrl: null,
    closestAirport: "Denver International Airport (DEN)",
    closestAirportDistance: "210 km by road from Denver via Buena Vista",
    permitRequired: false,
    permitInfo: null,
    bestMonths: "June-September"
  },
  "Crestone Needle": {
    imageUrl: null,
    closestAirport: "Denver International Airport (DEN)",
    closestAirportDistance: "310 km by road from Denver via Crestone",
    permitRequired: false,
    permitInfo: null,
    bestMonths: "July-September"
  },
  "Mount Princeton": {
    imageUrl: null,
    closestAirport: "Denver International Airport (DEN)",
    closestAirportDistance: "225 km by road from Denver via Buena Vista",
    permitRequired: false,
    permitInfo: null,
    bestMonths: "June-September"
  },
  "Mount Yale": {
    imageUrl: null,
    closestAirport: "Denver International Airport (DEN)",
    closestAirportDistance: "225 km by road from Denver via Buena Vista",
    permitRequired: false,
    permitInfo: null,
    bestMonths: "June-September"
  },
  "Mount Bross": {
    imageUrl: null,
    closestAirport: "Denver International Airport (DEN)",
    closestAirportDistance: "140 km by road from Denver via Fairplay",
    permitRequired: false,
    permitInfo: null,
    bestMonths: "June-September"
  },
  "Kit Carson Mountain": {
    imageUrl: null,
    closestAirport: "Denver International Airport (DEN)",
    closestAirportDistance: "310 km by road from Denver via Crestone",
    permitRequired: false,
    permitInfo: null,
    bestMonths: "July-September"
  },
  "El Diente Peak": {
    imageUrl: null,
    closestAirport: "Denver International Airport (DEN)",
    closestAirportDistance: "530 km by road from Denver via Telluride",
    permitRequired: false,
    permitInfo: null,
    bestMonths: "July-September"
  },
  "Maroon Peak": {
    imageUrl: null,
    closestAirport: "Denver International Airport (DEN)",
    closestAirportDistance: "320 km by road from Denver via Aspen",
    permitRequired: false,
    permitInfo: null,
    bestMonths: "July-September"
  },
  "Tabeguache Peak": {
    imageUrl: null,
    closestAirport: "Denver International Airport (DEN)",
    closestAirportDistance: "240 km by road from Denver via Salida",
    permitRequired: false,
    permitInfo: null,
    bestMonths: "June-September"
  },
  "Mount Oxford": {
    imageUrl: null,
    closestAirport: "Denver International Airport (DEN)",
    closestAirportDistance: "210 km by road from Denver via Buena Vista",
    permitRequired: false,
    permitInfo: null,
    bestMonths: "June-September"
  },
  "Mount Sneffels": {
    imageUrl: null,
    closestAirport: "Denver International Airport (DEN)",
    closestAirportDistance: "500 km by road from Denver via Ouray",
    permitRequired: false,
    permitInfo: null,
    bestMonths: "July-September"
  },
  "Mount Democrat": {
    imageUrl: null,
    closestAirport: "Denver International Airport (DEN)",
    closestAirportDistance: "140 km by road from Denver via Fairplay",
    permitRequired: false,
    permitInfo: null,
    bestMonths: "June-September"
  },
  "Capitol Peak": {
    imageUrl: null,
    closestAirport: "Denver International Airport (DEN)",
    closestAirportDistance: "330 km by road from Denver via Aspen",
    permitRequired: false,
    permitInfo: null,
    bestMonths: "July-September"
  },
  "Pikes Peak": {
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/7/73/Pikes_Peak_from_Garden_of_the_Gods.jpg",
    closestAirport: "Denver International Airport (DEN)",
    closestAirportDistance: "130 km by road from Denver via Colorado Springs",
    permitRequired: false,
    permitInfo: "Pikes Peak Highway has a toll fee. Barr Trail does not require a permit.",
    bestMonths: "June-September"
  },
  "Snowmass Mountain": {
    imageUrl: null,
    closestAirport: "Denver International Airport (DEN)",
    closestAirportDistance: "340 km by road from Denver via Aspen",
    permitRequired: false,
    permitInfo: null,
    bestMonths: "July-September"
  },
  "Mount Eolus": {
    imageUrl: null,
    closestAirport: "Denver International Airport (DEN)",
    closestAirportDistance: "560 km by road from Denver via Durango (train to Needleton)",
    permitRequired: false,
    permitInfo: "Weminuche Wilderness entry is free. Durango & Silverton Railroad ticket needed for standard approach.",
    bestMonths: "July-September"
  },
  "Windom Peak": {
    imageUrl: null,
    closestAirport: "Denver International Airport (DEN)",
    closestAirportDistance: "560 km by road from Denver via Durango (train to Needleton)",
    permitRequired: false,
    permitInfo: "Weminuche Wilderness entry is free. Durango & Silverton Railroad ticket needed for standard approach.",
    bestMonths: "July-September"
  },
  "Challenger Point": {
    imageUrl: null,
    closestAirport: "Denver International Airport (DEN)",
    closestAirportDistance: "310 km by road from Denver via Crestone",
    permitRequired: false,
    permitInfo: null,
    bestMonths: "July-September"
  },
  "Mount Columbia": {
    imageUrl: null,
    closestAirport: "Denver International Airport (DEN)",
    closestAirportDistance: "230 km by road from Denver via Buena Vista",
    permitRequired: false,
    permitInfo: null,
    bestMonths: "June-September"
  },
  "Missouri Mountain": {
    imageUrl: null,
    closestAirport: "Denver International Airport (DEN)",
    closestAirportDistance: "210 km by road from Denver via Buena Vista",
    permitRequired: false,
    permitInfo: null,
    bestMonths: "June-September"
  },
  "Humboldt Peak": {
    imageUrl: null,
    closestAirport: "Denver International Airport (DEN)",
    closestAirportDistance: "310 km by road from Denver via Crestone",
    permitRequired: false,
    permitInfo: null,
    bestMonths: "June-September"
  },
  "Mount Bierstadt": {
    imageUrl: null,
    closestAirport: "Denver International Airport (DEN)",
    closestAirportDistance: "90 km by road from Denver via Guanella Pass",
    permitRequired: false,
    permitInfo: null,
    bestMonths: "June-September"
  },
  "Sunlight Peak": {
    imageUrl: null,
    closestAirport: "Denver International Airport (DEN)",
    closestAirportDistance: "560 km by road from Denver via Durango (train to Needleton)",
    permitRequired: false,
    permitInfo: "Weminuche Wilderness entry is free. Durango & Silverton Railroad ticket needed for standard approach.",
    bestMonths: "July-September"
  },
  "Handies Peak": {
    imageUrl: null,
    closestAirport: "Denver International Airport (DEN)",
    closestAirportDistance: "470 km by road from Denver via Lake City",
    permitRequired: false,
    permitInfo: null,
    bestMonths: "June-September"
  },
  "Culebra Peak": {
    imageUrl: null,
    closestAirport: "Denver International Airport (DEN)",
    closestAirportDistance: "370 km by road from Denver via San Luis",
    permitRequired: true,
    permitInfo: "Private land access fee required (approximately $150 per person). Advance reservation needed through Cielo Vista Ranch.",
    bestMonths: "June-September"
  },
  "North Maroon Peak": {
    imageUrl: null,
    closestAirport: "Denver International Airport (DEN)",
    closestAirportDistance: "320 km by road from Denver via Aspen",
    permitRequired: false,
    permitInfo: null,
    bestMonths: "July-September"
  },
  "Mount Lindsey": {
    imageUrl: null,
    closestAirport: "Denver International Airport (DEN)",
    closestAirportDistance: "310 km by road from Denver via Alamosa",
    permitRequired: false,
    permitInfo: null,
    bestMonths: "June-September"
  },
  "Little Bear Peak": {
    imageUrl: null,
    closestAirport: "Denver International Airport (DEN)",
    closestAirportDistance: "310 km by road from Denver via Alamosa",
    permitRequired: false,
    permitInfo: null,
    bestMonths: "July-September"
  },
  "Mount Sherman": {
    imageUrl: null,
    closestAirport: "Denver International Airport (DEN)",
    closestAirportDistance: "160 km by road from Denver via Fairplay",
    permitRequired: false,
    permitInfo: null,
    bestMonths: "June-September"
  },
  "Redcloud Peak": {
    imageUrl: null,
    closestAirport: "Denver International Airport (DEN)",
    closestAirportDistance: "470 km by road from Denver via Lake City",
    permitRequired: false,
    permitInfo: null,
    bestMonths: "June-September"
  },
  "Pyramid Peak": {
    imageUrl: null,
    closestAirport: "Denver International Airport (DEN)",
    closestAirportDistance: "320 km by road from Denver via Aspen",
    permitRequired: false,
    permitInfo: null,
    bestMonths: "July-September"
  },
  "Wilson Peak": {
    imageUrl: null,
    closestAirport: "Denver International Airport (DEN)",
    closestAirportDistance: "530 km by road from Denver via Telluride",
    permitRequired: false,
    permitInfo: null,
    bestMonths: "July-September"
  },
  "Wetterhorn Peak": {
    imageUrl: null,
    closestAirport: "Denver International Airport (DEN)",
    closestAirportDistance: "470 km by road from Denver via Lake City",
    permitRequired: false,
    permitInfo: null,
    bestMonths: "July-September"
  },
  "San Luis Peak": {
    imageUrl: null,
    closestAirport: "Denver International Airport (DEN)",
    closestAirportDistance: "380 km by road from Denver via Creede",
    permitRequired: false,
    permitInfo: null,
    bestMonths: "June-September"
  },
  "Sunshine Peak": {
    imageUrl: null,
    closestAirport: "Denver International Airport (DEN)",
    closestAirportDistance: "470 km by road from Denver via Lake City",
    permitRequired: false,
    permitInfo: null,
    bestMonths: "June-September"
  },
  "Mount of the Holy Cross": {
    imageUrl: null,
    closestAirport: "Denver International Airport (DEN)",
    closestAirportDistance: "200 km by road from Denver via Minturn",
    permitRequired: false,
    permitInfo: null,
    bestMonths: "July-September"
  },
  "Huron Peak": {
    imageUrl: null,
    closestAirport: "Denver International Airport (DEN)",
    closestAirportDistance: "240 km by road from Denver via Buena Vista",
    permitRequired: false,
    permitInfo: null,
    bestMonths: "June-September"
  },

  // === OTHER WORLD PEAKS ===
  "Mount Olympus": {
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/0/09/Olympus_from_Litochoro.jpg",
    closestAirport: "Thessaloniki Airport (SKG)",
    closestAirportDistance: "90 km by road from Thessaloniki to Litochoro",
    permitRequired: false,
    permitInfo: "No permit required. Free access to Mount Olympus National Park. Hut reservations recommended.",
    bestMonths: "May-October"
  },
  "Mount Fuji": {
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/1/1b/080103_hakridge_fuji.jpg",
    closestAirport: "Narita International Airport (NRT)",
    closestAirportDistance: "130 km by road/train from Tokyo to Fuji 5th Station",
    permitRequired: true,
    permitInfo: "Climbing fee of 2,000 yen per person since 2024. Online reservation system. Climbing season is July-September only.",
    bestMonths: "July-September"
  },
  "Mount Cook": {
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/7/74/Aoraki_Mount_Cook.jpg",
    closestAirport: "Christchurch Airport (CHC)",
    closestAirportDistance: "330 km by road from Christchurch to Mount Cook Village",
    permitRequired: false,
    permitInfo: "No permit required but registration with Department of Conservation recommended. Mountain hut passes needed for overnight stays.",
    bestMonths: "November-March"
  },
  "Mount Kenya": {
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c6/Mt._Kenya.jpg",
    closestAirport: "Jomo Kenyatta International Airport (NBO)",
    closestAirportDistance: "175 km by road from Nairobi to Naro Moru gate",
    permitRequired: true,
    permitInfo: "Kenya Wildlife Service park entry fees required. Licensed guide mandatory for technical summit (Batian/Nelion).",
    bestMonths: "January-February, August-September"
  },
  "Mount Stanley": {
    imageUrl: null,
    closestAirport: "Entebbe International Airport (EBB)",
    closestAirportDistance: "400 km by road from Kampala to Kasese, then trek to base",
    permitRequired: true,
    permitInfo: "Rwenzori Mountains National Park entry fees required. Licensed guide and porters mandatory.",
    bestMonths: "January-February, June-August"
  },
  "Mount Erebus": {
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/5/57/Mount_Erebus_from_Scott_Base.jpg",
    closestAirport: "Christchurch Airport (CHC)",
    closestAirportDistance: "McMurdo Station via military/research flights from Christchurch (3,800 km)",
    permitRequired: true,
    permitInfo: "Access only through Antarctic research programs. Private expeditions possible through specialized operators at extreme cost.",
    bestMonths: "November-January"
  },
  "Ama Dablam": {
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e3/Ama_Dablam%2C_November_2004.jpg",
    closestAirport: "Tribhuvan International Airport (KTM)",
    closestAirportDistance: "140 km by road to Lukla, then trek to Base Camp",
    permitRequired: true,
    permitInfo: "Nepal Mountaineering Association permit required; royalty fee approximately $3,000. Sagarmatha National Park entry fee also needed.",
    bestMonths: "October-November, April-May"
  },
  "Island Peak": {
    imageUrl: null,
    closestAirport: "Tribhuvan International Airport (KTM)",
    closestAirportDistance: "140 km by road to Lukla, then trek to Base Camp",
    permitRequired: true,
    permitInfo: "Nepal Mountaineering Association trekking peak permit required; approximately $400 per climber.",
    bestMonths: "April-May, October-November"
  },
  "Pumori": {
    imageUrl: null,
    closestAirport: "Tribhuvan International Airport (KTM)",
    closestAirportDistance: "140 km by road to Lukla, then trek to Gorak Shep",
    permitRequired: true,
    permitInfo: "Nepal Mountaineering Association permit required; royalty fee applies.",
    bestMonths: "April-May, September-October"
  },
  "Nuptse": {
    imageUrl: null,
    closestAirport: "Tribhuvan International Airport (KTM)",
    closestAirportDistance: "140 km by road to Lukla, then trek to Base Camp",
    permitRequired: true,
    permitInfo: "Nepal Mountaineering Association permit required; royalty fee applies.",
    bestMonths: "April-May, September-October"
  },
  "Annapurna III": {
    imageUrl: null,
    closestAirport: "Tribhuvan International Airport (KTM)",
    closestAirportDistance: "200 km by road to Pokhara, then trek to approach",
    permitRequired: true,
    permitInfo: "Nepal Mountaineering Association permit required. Annapurna Conservation Area permit also needed.",
    bestMonths: "April-May, September-October"
  },
  "Masherbrum": {
    imageUrl: null,
    closestAirport: "Islamabad International Airport (ISB)",
    closestAirportDistance: "620 km by road to Skardu, then trek to Hushe Valley",
    permitRequired: true,
    permitInfo: "Pakistan Alpine Club permit required. Peak fee and liaison officer mandatory.",
    bestMonths: "June-August"
  },
  "Kazbek": {
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a5/Kazbek.jpg",
    closestAirport: "Shota Rustaveli Tbilisi International Airport (TBS)",
    closestAirportDistance: "155 km by road from Tbilisi to Stepantsminda (Kazbegi)",
    permitRequired: false,
    permitInfo: "No permit required from Georgian side. Border zone registration may be needed.",
    bestMonths: "June-September"
  },
  "Mount Ararat": {
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f3/Agri_Dagi_or_Ararat.jpg",
    closestAirport: "Igdir Airport (IGD)",
    closestAirportDistance: "50 km by road from Igdir to Dogubayazit basecamp area",
    permitRequired: true,
    permitInfo: "Turkish government climbing permit required through a licensed Turkish tour agency. Special military zone restrictions apply.",
    bestMonths: "July-September"
  },
  "Mount Damavand": {
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4d/Damavand_in_winter.jpg",
    closestAirport: "Imam Khomeini International Airport (IKA)",
    closestAirportDistance: "100 km by road from Tehran to Reineh or Polour trailheads",
    permitRequired: true,
    permitInfo: "Permit from Iran Mountaineering Federation required. Licensed local guide recommended.",
    bestMonths: "June-September"
  },
  "Mount Kinabalu": {
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/2/26/Mount_Kinabalu.jpg",
    closestAirport: "Kota Kinabalu International Airport (BKI)",
    closestAirportDistance: "90 km by road from Kota Kinabalu to Kinabalu Park HQ",
    permitRequired: true,
    permitInfo: "Sabah Parks climbing permit mandatory; approximately RM200. Licensed guide mandatory. Advance booking essential due to limited daily summit slots.",
    bestMonths: "February-April"
  },
  "Mount Tyree": {
    imageUrl: null,
    closestAirport: "Punta Arenas Airport (PUQ)",
    closestAirportDistance: "Fly from Punta Arenas to Union Glacier Camp, then ski plane to base area",
    permitRequired: true,
    permitInfo: "Access only through specialized Antarctic logistics operators. Extremely rarely climbed.",
    bestMonths: "November-January"
  },
  "Pico de Orizaba": {
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/b/bc/Pico_de_Orizaba_desde_Hidalgo%2C_Puebla.jpg",
    closestAirport: "Benito Juarez International Airport (MEX)",
    closestAirportDistance: "280 km by road from Mexico City to Tlachichuca",
    permitRequired: true,
    permitInfo: "Entry fee for Pico de Orizaba National Park. Registration at park ranger station required.",
    bestMonths: "October-March"
  },
  "Iztaccihuatl": {
    imageUrl: null,
    closestAirport: "Benito Juarez International Airport (MEX)",
    closestAirportDistance: "80 km by road from Mexico City to La Joya trailhead",
    permitRequired: true,
    permitInfo: "Izta-Popo National Park entry fee required. Park may close during Popocatepetl volcanic activity.",
    bestMonths: "October-March"
  },
  "Popocatepetl": {
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Popocatepetl_volcano_eruption_2024.jpg",
    closestAirport: "Benito Juarez International Airport (MEX)",
    closestAirportDistance: "70 km by road from Mexico City",
    permitRequired: true,
    permitInfo: "Currently closed to climbing due to ongoing volcanic activity. Exclusion zone enforced by authorities.",
    bestMonths: "Closed indefinitely due to volcanic activity"
  },
  "Mount Hua": {
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a0/Huashan.jpg",
    closestAirport: "Xi'an Xianyang International Airport (XIY)",
    closestAirportDistance: "120 km by road from Xi'an to Huashan village",
    permitRequired: true,
    permitInfo: "National park entry fee required (approximately 160 CNY). Cable car available for partial ascent.",
    bestMonths: "April-October"
  },
  "Toubkal": {
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/3/35/Jbel_Toubkal_from_Imlil.jpg",
    closestAirport: "Marrakech Menara Airport (RAK)",
    closestAirportDistance: "70 km by road from Marrakech to Imlil",
    permitRequired: false,
    permitInfo: "No permit required. Licensed mountain guide recommended. Hut fees for Toubkal Refuge.",
    bestMonths: "April-June, September-November"
  },
  "Teide": {
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/5/59/Teide_Tenerife.jpg",
    closestAirport: "Tenerife South Airport (TFS)",
    closestAirportDistance: "60 km by road from airport to Teide National Park",
    permitRequired: true,
    permitInfo: "Free permit required for the final summit section. Must be reserved online in advance through the Spanish national parks website.",
    bestMonths: "May-October"
  },
  "Mount Aspiring": {
    imageUrl: null,
    closestAirport: "Queenstown Airport (ZQN)",
    closestAirportDistance: "90 km by road from Queenstown to Wanaka, then drive to trailhead",
    permitRequired: false,
    permitInfo: "No permit required. Department of Conservation hut passes needed for backcountry huts.",
    bestMonths: "November-March"
  },
  "Ben Nevis": {
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f5/Ben_Nevis_from_Banavie.jpg",
    closestAirport: "Inverness Airport (INV)",
    closestAirportDistance: "110 km by road from Inverness to Fort William",
    permitRequired: false,
    permitInfo: "No permit required. Free access under Scottish right to roam legislation.",
    bestMonths: "May-September"
  },

  // === US REGIONAL PEAKS ===
  "Grand Teton": {
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d0/Grand_Teton_NP.jpg",
    closestAirport: "Jackson Hole Airport (JAC)",
    closestAirportDistance: "20 km by road from Jackson to Lupine Meadows trailhead",
    permitRequired: true,
    permitInfo: "Grand Teton National Park climbing permit required (free). Backcountry camping permit needed for overnight trips.",
    bestMonths: "July-September"
  },
  "Gannett Peak": {
    imageUrl: null,
    closestAirport: "Jackson Hole Airport (JAC)",
    closestAirportDistance: "130 km by road from Jackson to Elkhart Park trailhead",
    permitRequired: false,
    permitInfo: "No permit required. Located in the Bridger Wilderness, Bridger-Teton National Forest.",
    bestMonths: "July-September"
  },
  "Mount Mitchell": {
    imageUrl: null,
    closestAirport: "Asheville Regional Airport (AVL)",
    closestAirportDistance: "55 km by road from Asheville via Blue Ridge Parkway",
    permitRequired: false,
    permitInfo: "No permit required. Mount Mitchell State Park is free to visit.",
    bestMonths: "May-October"
  },
  "Mount Washington": {
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/4/40/Mount_Washington.jpg",
    closestAirport: "Portland International Jetport (PWM)",
    closestAirportDistance: "210 km by road from Portland, ME to Pinkham Notch",
    permitRequired: false,
    permitInfo: "No permit required. USFS parking fee at Pinkham Notch. Cog railway and auto road also provide summit access.",
    bestMonths: "June-September"
  },
  "Mount Katahdin": {
    imageUrl: null,
    closestAirport: "Bangor International Airport (BGR)",
    closestAirportDistance: "130 km by road from Bangor to Baxter State Park",
    permitRequired: true,
    permitInfo: "Baxter State Park day-use reservation required. Limited daily summit access. Advance reservation strongly recommended.",
    bestMonths: "June-October"
  },
  "Mauna Kea": {
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/2/28/Mauna_Kea_from_the_sea.jpg",
    closestAirport: "Ellison Onizuka Kona International Airport (KOA)",
    closestAirportDistance: "60 km by road from Kona to Mauna Kea Visitor Station",
    permitRequired: true,
    permitInfo: "Reservation required for summit access. Managed by the University of Hawaii. 4WD vehicle required.",
    bestMonths: "Year-round (best May-September)"
  },
  "Mauna Loa": {
    imageUrl: null,
    closestAirport: "Ellison Onizuka Kona International Airport (KOA)",
    closestAirportDistance: "50 km by road from Kona to Mauna Loa Observatory Road",
    permitRequired: true,
    permitInfo: "Hawaii Volcanoes National Park backcountry permit required (free). Trail may close during volcanic activity.",
    bestMonths: "Year-round (best May-September)"
  },
  "Wheeler Peak": {
    imageUrl: null,
    closestAirport: "Albuquerque International Sunport (ABQ)",
    closestAirportDistance: "240 km by road from Albuquerque to Taos Ski Valley trailhead",
    permitRequired: false,
    permitInfo: "No permit required. Located in the Sangre de Cristo Mountains near Taos Ski Valley.",
    bestMonths: "June-October"
  },
  "Humphreys Peak": {
    imageUrl: null,
    closestAirport: "Flagstaff Pulliam Airport (FLG)",
    closestAirportDistance: "25 km by road from Flagstaff to trailhead",
    permitRequired: false,
    permitInfo: "No permit required. Located in the Kachina Peaks Wilderness.",
    bestMonths: "June-October"
  },
  "Borah Peak": {
    imageUrl: null,
    closestAirport: "Idaho Falls Regional Airport (IDA)",
    closestAirportDistance: "170 km by road from Idaho Falls to trailhead",
    permitRequired: false,
    permitInfo: "No permit required. Salmon-Challis National Forest.",
    bestMonths: "July-September"
  },
  "Kings Peak": {
    imageUrl: null,
    closestAirport: "Salt Lake City International Airport (SLC)",
    closestAirportDistance: "250 km by road from Salt Lake City to Henry's Fork trailhead",
    permitRequired: false,
    permitInfo: "No permit required. Located in the High Uintas Wilderness.",
    bestMonths: "July-September"
  },
  "Granite Peak": {
    imageUrl: null,
    closestAirport: "Billings Logan International Airport (BIL)",
    closestAirportDistance: "130 km by road from Billings to trailhead via Red Lodge",
    permitRequired: false,
    permitInfo: "No permit required. Located in the Absaroka-Beartooth Wilderness.",
    bestMonths: "July-September"
  },
  "Cloud Peak": {
    imageUrl: null,
    closestAirport: "Sheridan County Airport (SHR)",
    closestAirportDistance: "70 km by road from Sheridan to trailhead",
    permitRequired: false,
    permitInfo: "No permit required. Located in the Cloud Peak Wilderness.",
    bestMonths: "July-September"
  },
  "Guadalupe Peak": {
    imageUrl: null,
    closestAirport: "El Paso International Airport (ELP)",
    closestAirportDistance: "180 km by road from El Paso to Guadalupe Mountains National Park",
    permitRequired: false,
    permitInfo: "No climbing permit required. Park entrance fee applies.",
    bestMonths: "October-April"
  },
  "Mount Marcy": {
    imageUrl: null,
    closestAirport: "Albany International Airport (ALB)",
    closestAirportDistance: "200 km by road from Albany to Adirondack Loj trailhead",
    permitRequired: false,
    permitInfo: "No permit required. Adirondack Loj parking fee applies. Bear canister required for overnight trips.",
    bestMonths: "June-October"
  },
  "Clingmans Dome": {
    imageUrl: null,
    closestAirport: "McGhee Tyson Airport (TYS)",
    closestAirportDistance: "100 km by road from Knoxville to Clingmans Dome parking area",
    permitRequired: false,
    permitInfo: "No permit required for the paved summit trail. Great Smoky Mountains National Park is free to enter.",
    bestMonths: "April-October"
  },
  "Devils Tower": {
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/4/45/Devils_Tower_CROP.jpg",
    closestAirport: "Gillette-Campbell County Airport (GCC)",
    closestAirportDistance: "100 km by road from Gillette to Devils Tower National Monument",
    permitRequired: false,
    permitInfo: "No climbing permit required but voluntary June climbing closure out of respect for Native American ceremonies. Park entrance fee applies.",
    bestMonths: "May-September"
  },
  "Shiprock": {
    imageUrl: null,
    closestAirport: "Four Corners Regional Airport (FMN)",
    closestAirportDistance: "50 km by road from Farmington to Shiprock",
    permitRequired: true,
    permitInfo: "Climbing has been banned since 1970 by the Navajo Nation. No climbing is allowed.",
    bestMonths: "Climbing prohibited"
  }
};

// Apply enrichment to all peaks
const enrichedPeaks = peaks.map(peak => {
  const data = enrichment[peak.name];
  if (data) {
    return {
      ...peak,
      imageUrl: data.imageUrl,
      closestAirport: data.closestAirport,
      closestAirportDistance: data.closestAirportDistance,
      permitRequired: data.permitRequired,
      permitInfo: data.permitInfo,
      bestMonths: data.bestMonths
    };
  } else {
    // Fallback: provide reasonable defaults based on range/region
    console.warn(`No enrichment data for: ${peak.name} (${peak.range}, ${peak.country})`);
    let fallback = {
      imageUrl: null,
      closestAirport: "Unknown",
      closestAirportDistance: "Unknown",
      permitRequired: false,
      permitInfo: null,
      bestMonths: "Varies"
    };
    return { ...peak, ...fallback };
  }
});

// Verify count
console.log(`Total peaks: ${enrichedPeaks.length}`);
console.log(`Peaks with enrichment data: ${peaks.filter(p => enrichment[p.name]).length}`);
console.log(`Peaks missing enrichment: ${peaks.filter(p => !enrichment[p.name]).map(p => p.name).join(', ')}`);

// Write output
const outputPath = inputPath;
fs.writeFileSync(outputPath, JSON.stringify(enrichedPeaks, null, 2) + '\n', 'utf8');
console.log(`Wrote enriched data to ${outputPath}`);
