import * as THREE from 'three';

// APEX RACING — self-contained procedural 3D racing prototype.
const $ = (id) => document.getElementById(id);
const ui = {
  loading: $('loading'), loadFill: $('load-fill'), loadText: $('load-text'), hud: $('hud'),
  start: $('start-screen'), pause: $('pause-screen'), finish: $('finish-screen'),
  countdown: $('countdown'), error: $('error-message'), toast: $('toast'),
  speed: $('speed'), gear: $('gear'), rpm: $('rpm-fill'), rpmLabel: $('rpm-label'),
  nitro: $('nitro-fill'), nitroLabel: $('nitro-label'), lap: $('lap'), lapTime: $('lap-time'),
  bestTime: $('best-time'), position: $('position'), finishTitle: $('finish-title'),
  finishMessage: $('finish-message'), finishBest: $('finish-best'),
  levelGrid: $('level-grid'), careerProgressText: $('career-progress-text'),
  careerProgressFill: $('career-progress-fill'), selectedLevelTitle: $('selected-level-title'),
  selectedLevelDetail: $('selected-level-detail'), sessionLabel: $('session-label'),
  resultsBody: $('results-table-body'), nextLevelBtn: $('next-level-btn'),
  environmentName: $('environment-name'), environmentDescription: $('environment-description'),
  environmentTier: $('environment-tier'), environmentSwatches: $('environment-swatches'), trackName: $('track-name')
};

const ROAD_WIDTH = 22;
const HALF_ROAD = ROAD_WIDTH / 2;
const SAMPLE_COUNT = 720;
const TOTAL_LAPS = 3;
const MAX_LEVEL = 70;
const TIER_NAMES = ['ROOKIE', 'CLUB', 'SPORT', 'PRO', 'ELITE', 'MASTER', 'LEGEND'];
const ENVIRONMENTS = [
  {
    tier:'ROOKIE', name:'GREEN VALLEY CIRCUIT', short:'GREEN VALLEY', region:'Rolling countryside',
    description:'A bright beginner circuit through green hills, pine woods and open farm country.',
    track:'GREEN VALLEY GP', sky:0x8bc8eb, fog:0x9fc9d8, fogNear:230, fogFar:760,
    ground:0x58884b, road:0x343a3c, verge:0xb9c8a0, line:0xf6f2d8, curbA:0xf2f1e8, curbB:0x5ab849, barrier:0xcbd5cb,
    hemiSky:0xeaf7ff, hemiGround:0x4a623c, hemiIntensity:1.95, sun:0xfff0d4, sunIntensity:2.8, exposure:1.14,
    accent:'#8ee06a', swatches:['#8bc8eb','#58884b','#5ab849'], weather:['CLEAR MORNING','SUNLIT','SOFT CLOUDS','GOLDEN AFTERNOON','CLEAR SKIES']
  },
  {
    tier:'CLUB', name:'AZURE COAST GRAND PRIX', short:'AZURE COAST', region:'Harbour city',
    description:'A seaside street race with turquoise water, palms, beach promenades and a modern skyline.',
    track:'AZURE COAST GP', sky:0x75b9d5, fog:0x8cb9c4, fogNear:210, fogFar:690,
    ground:0xc9b98c, road:0x303b43, verge:0xe7d4a7, line:0xffffff, curbA:0xfff0d1, curbB:0x239eb0, barrier:0xc1d9dc,
    hemiSky:0xccefff, hemiGround:0x7d8266, hemiIntensity:1.75, sun:0xffe2b2, sunIntensity:2.65, exposure:1.18,
    accent:'#39c6d2', swatches:['#75b9d5','#c9b98c','#239eb0'], weather:['SEA BREEZE','SUNLIT COAST','SEA MIST','GOLDEN HOUR','HARBOUR LIGHTS']
  },
  {
    tier:'SPORT', name:'RED DUNE DESERT RUN', short:'RED DUNE', region:'Desert canyon',
    description:'A high-speed desert route framed by sandstone mesas, red rock spires and dry cactus plains.',
    track:'RED DUNE GP', sky:0xe3ad78, fog:0xd2a27a, fogNear:190, fogFar:650,
    ground:0xb98250, road:0x373331, verge:0xd9aa75, line:0xffe6b5, curbA:0xf2d0a1, curbB:0xb64f34, barrier:0xc49b75,
    hemiSky:0xffd8a8, hemiGround:0x76513a, hemiIntensity:1.65, sun:0xffd09a, sunIntensity:3.0, exposure:1.2,
    accent:'#f09a54', swatches:['#e3ad78','#b98250','#b64f34'], weather:['DRY HEAT','DUSTY WIND','DESERT SUN','DUNE HAZE','RED SUNSET']
  },
  {
    tier:'PRO', name:'ALPINE SUMMIT CIRCUIT', short:'ALPINE SUMMIT', region:'Snowy mountain pass',
    description:'A technical mountain race through snow-covered peaks, icy valleys and dense evergreen forests.',
    track:'ALPINE SUMMIT GP', sky:0x9abbd2, fog:0xb8cbd5, fogNear:175, fogFar:610,
    ground:0xd7e0e2, road:0x343d45, verge:0xc7d4d7, line:0xffffff, curbA:0xf8fbff, curbB:0x4d91bd, barrier:0xe0e8ed,
    hemiSky:0xe2f4ff, hemiGround:0x647982, hemiIntensity:1.8, sun:0xf5fbff, sunIntensity:2.25, exposure:1.12,
    accent:'#8ed5ff', swatches:['#9abbd2','#d7e0e2','#4d91bd'], weather:['FRESH SNOW','MOUNTAIN SUN','ICY MIST','COLD FRONT','BLUE HOUR']
  },
  {
    tier:'ELITE', name:'NEON METROPOLIS NIGHT', short:'NEON METRO', region:'Midnight downtown',
    description:'A futuristic night race among glass skyscrapers, glowing signs, neon barriers and wet streets.',
    track:'NEON METRO GP', sky:0x090f26, fog:0x171c3b, fogNear:145, fogFar:510,
    ground:0x151b2a, road:0x171d2b, verge:0x252b43, line:0x8efaff, curbA:0x15d9e8, curbB:0xc32cff, barrier:0x303b58,
    hemiSky:0x394b9a, hemiGround:0x090b18, hemiIntensity:0.95, sun:0x9c8cff, sunIntensity:0.75, exposure:1.35,
    accent:'#36e7ff', swatches:['#090f26','#15d9e8','#c32cff'], weather:['NEON NIGHT','RAIN-SLICK','CITY GLOW','MIDNIGHT FOG','AFTER DARK']
  },
  {
    tier:'MASTER', name:'MAGMA RIDGE VOLCANO', short:'MAGMA RIDGE', region:'Volcanic badlands',
    description:'A dangerous volcanic circuit surrounded by black lava rock, glowing magma fissures and smoking peaks.',
    track:'MAGMA RIDGE GP', sky:0x3a2024, fog:0x58352d, fogNear:145, fogFar:520,
    ground:0x282526, road:0x17191c, verge:0x51403b, line:0xffc17b, curbA:0xff9b4a, curbB:0x7d2525, barrier:0x65534c,
    hemiSky:0x9c5b43, hemiGround:0x171415, hemiIntensity:0.92, sun:0xff9b54, sunIntensity:1.35, exposure:1.28,
    accent:'#ff713e', swatches:['#3a2024','#282526','#ff713e'], weather:['ASH FALL','MAGMA GLOW','SMOKE HAZE','EMBER STORM','ERUPTION LIGHT']
  },
  {
    tier:'LEGEND', name:'CELESTIAL SKYWAY', short:'CELESTIAL SKYWAY', region:'Futuristic sky islands',
    description:'The ultimate championship track above the clouds, with floating platforms, aurora skies and luminous towers.',
    track:'CELESTIAL SKYWAY', sky:0x101747, fog:0x28376d, fogNear:175, fogFar:640,
    ground:0x283b64, road:0x18233d, verge:0x586c9e, line:0xb8f8ff, curbA:0x7cf4ff, curbB:0x8a65ff, barrier:0x667fc1,
    hemiSky:0x8faaff, hemiGround:0x172041, hemiIntensity:1.4, sun:0x9bdcff, sunIntensity:1.65, exposure:1.3,
    accent:'#8af5ff', swatches:['#101747','#283b64','#8a65ff'], weather:['AURORA GLOW','CLOUD SEA','STARLIGHT','COSMIC DAWN','STELLAR STORM']
  }
];
// Every event now owns a distinct world identity, palette, scenery signature and circuit layout.
// Only the selected event is built, keeping memory use suitable for integrated graphics.
const LEVEL_WORLD_META = [
  // ROOKIE · 01–10
  {name:'GREEN VALLEY',region:'Rolling green highlands',description:'A welcoming countryside route through soft hills, pine groves and open meadows.',weather:'CLEAR MORNING',feature:'pine',hue:.30,accent:'#8ee06a',layout:0},
  {name:'AUTUMN MAPLE RUN',region:'Amber woodland',description:'A winding forest road under glowing maple canopies and drifting autumn leaves.',weather:'GOLDEN LEAVES',feature:'autumn',hue:.09,accent:'#e7a24d',layout:1},
  {name:'SAKURA BLOSSOM',region:'Cherry blossom valley',description:'A peaceful valley framed by pink flowering trees, petals and a mountain river.',weather:'PETAL BREEZE',feature:'blossom',hue:.93,accent:'#f29fce',layout:2},
  {name:'SUNFLOWER PLAINS',region:'Golden farm country',description:'Bright sunflower fields, windmills and country barns stretch along a fast rural circuit.',weather:'SUNNY FIELDS',feature:'sunflower',hue:.14,accent:'#e9ce45',layout:3},
  {name:'RIVERBEND MEADOWS',region:'Riverside grasslands',description:'A flowing road beside blue water, green banks and rolling meadow hills.',weather:'RIVER BREEZE',feature:'river',hue:.50,accent:'#65c9b4',layout:4},
  {name:'REDWOOD RIDGE',region:'Ancient redwood forest',description:'Towering redwood trunks, fern-covered slopes and shafts of warm forest light.',weather:'FOREST SHAFTS',feature:'redwood',hue:.36,accent:'#77ad69',layout:5},
  {name:'WINDMILL HIGHLANDS',region:'Wind-powered uplands',description:'Open highland ridges dotted with giant turbines and vivid green slopes.',weather:'HIGHLAND WIND',feature:'windmill',hue:.27,accent:'#a4d76c',layout:6},
  {name:'APPLE ORCHARD LOOP',region:'Orchard farmland',description:'Neat fruit-tree rows, farmhouses and red-roofed barns surround a flowing loop.',weather:'HARVEST SUN',feature:'orchard',hue:.06,accent:'#dd8b4b',layout:7},
  {name:'MIRROR LAKE RUN',region:'Alpine lake country',description:'A reflective mountain lake, rocky shoreline and distant pine-covered peaks.',weather:'LAKE MIST',feature:'lake',hue:.56,accent:'#75c4d9',layout:8},
  {name:'EMERALD CANYON',region:'Green sandstone gorge',description:'A dramatic green canyon with high rock walls, scattered trees and a winding pass.',weather:'CANYON SUN',feature:'canyon',hue:.24,accent:'#87bd68',layout:9},
  // CLUB · 11–20
  {name:'AZURE MARINA',region:'Modern yacht harbour',description:'A bright marina circuit with yacht slips, coastal towers and glittering blue water.',weather:'SEA BREEZE',feature:'marina',hue:.54,accent:'#39c6d2',layout:10},
  {name:'CORAL BAY ISLAND',region:'Tropical island coast',description:'Turquoise shallows, white sand, palms and lush island cliffs surround the road.',weather:'TROPICAL SUN',feature:'tropical',hue:.47,accent:'#43d3bb',layout:11},
  {name:'GOLDEN BOARDWALK',region:'Beachfront promenade',description:'A sunset beachfront boulevard lined with palms, hotels and a long wooden pier.',weather:'GOLDEN HOUR',feature:'boardwalk',hue:.11,accent:'#e6b06b',layout:12},
  {name:'SEACLIFF HIGHWAY',region:'Ocean cliff road',description:'A spectacular coastal road carved into high cliffs above deep blue water.',weather:'CLIFFTOP MIST',feature:'cliff',hue:.58,accent:'#70b8d9',layout:13},
  {name:'CONTAINER PORT SPRINT',region:'Industrial shipping port',description:'A fast harbour sprint between container stacks, cranes and cargo terminals.',weather:'HARBOUR HAZE',feature:'port',hue:.04,accent:'#e18b48',layout:14},
  {name:'BLUE LAGOON',region:'Hidden tropical lagoon',description:'Calm lagoon water, small islands and dense palm groves create a vivid resort setting.',weather:'LAGOON GLOW',feature:'lagoon',hue:.50,accent:'#4ec9c0',layout:15},
  {name:'CANAL DISTRICT',region:'Waterfront old town',description:'A waterfront city with canal bridges, pastel buildings and glowing street lamps.',weather:'CANAL SUNSET',feature:'canal',hue:.10,accent:'#d9a36e',layout:16},
  {name:'LIGHTHOUSE POINT',region:'Rocky lighthouse coast',description:'A classic lighthouse watches over rugged rocks, foamy water and a coastal raceway.',weather:'OCEAN SPRAY',feature:'lighthouse',hue:.57,accent:'#7bc7da',layout:17},
  {name:'RIVIERA CLIFF RUN',region:'Mediterranean resort coast',description:'A luxury coastal resort road with terraces, cliffside villas and bright sea views.',weather:'RIVIERA SUN',feature:'riviera',hue:.12,accent:'#e5bd79',layout:18},
  {name:'SUNSET HARBOUR',region:'Warm southern bay',description:'A colourful harbour skyline glows orange and pink as the sun drops into the bay.',weather:'SUNSET GLOW',feature:'sunset',hue:.02,accent:'#f18a65',layout:19},
  // SPORT · 21–30
  {name:'SANDSTONE CANYON',region:'Layered sandstone gorge',description:'A high-speed canyon route surrounded by tall orange walls and sculpted rock towers.',weather:'DESERT SUN',feature:'sandstone',hue:.06,accent:'#ed9b59',layout:20},
  {name:'DUNE SERPENT',region:'Rolling sand sea',description:'A flowing desert course between high golden dunes, wind-carved ridges and dust plumes.',weather:'DUSTY WIND',feature:'dunes',hue:.12,accent:'#e5bc70',layout:21},
  {name:'RED MESA RUN',region:'Red-rock tablelands',description:'Flat-topped red mesas rise above a rugged plain of rust-coloured stone.',weather:'RED ROCK HEAT',feature:'mesa',hue:.03,accent:'#d76f4d',layout:22},
  {name:'WHITE SALT FLATS',region:'Open salt desert',description:'A vast white salt pan with distant mountains, reflective patches and a minimalist horizon.',weather:'MIRAGE HEAT',feature:'salt',hue:.56,accent:'#b8d8df',layout:23},
  {name:'BADLANDS EXPRESS',region:'Eroded desert badlands',description:'Jagged hoodoos, dry gullies and layered cliffs create a rugged technical route.',weather:'DRY HEAT',feature:'badlands',hue:.08,accent:'#d78b5d',layout:24},
  {name:'OASIS MIRAGE',region:'Desert palm oasis',description:'A vivid oasis of palms and blue pools tucked between towering dunes.',weather:'OASIS BREEZE',feature:'oasis',hue:.34,accent:'#76bd83',layout:25},
  {name:'CANYON ARCH RUN',region:'Natural stone arches',description:'A dramatic race through monumental stone arches and narrow canyon passages.',weather:'CANYON HAZE',feature:'arch',hue:.07,accent:'#e2a16a',layout:26},
  {name:'COPPER QUARRY',region:'Abandoned copper mine',description:'Terraced quarry walls, ore conveyors and copper-coloured cliffs surround the circuit.',weather:'QUARRY DUST',feature:'quarry',hue:.04,accent:'#d47b4e',layout:27},
  {name:'DESERT NIGHT RUN',region:'Moonlit desert highway',description:'A moonlit desert track with illuminated rock spires and cool midnight shadows.',weather:'MOONLIT DUNES',feature:'night',hue:.65,accent:'#8d9ed8',layout:28},
  {name:'DRY LAKE SPEEDWAY',region:'Cracked dry lakebed',description:'A broad dry lakebed with cracked earth, salt ridges and distant storm clouds.',weather:'STORM FRONT',feature:'drylake',hue:.10,accent:'#d4a36e',layout:29},
  // PRO · 31–40
  {name:'ALPINE PASS',region:'High alpine mountain pass',description:'Sharp alpine peaks, timber pines and a winding road above the cloud line.',weather:'CRISP ALPINE AIR',feature:'alpine',hue:.56,accent:'#8ed5ff',layout:30},
  {name:'GLACIER EDGE',region:'Blue glacier valley',description:'Towering blue ice walls, crevasses and frozen waterfalls frame the circuit.',weather:'GLACIER MIST',feature:'glacier',hue:.53,accent:'#76d4eb',layout:31},
  {name:'PINE SHADOW VALLEY',region:'Deep evergreen valley',description:'Dark conifer forests, steep ridges and narrow shafts of mountain sunlight.',weather:'VALLEY FOG',feature:'taiga',hue:.39,accent:'#6ab49d',layout:32},
  {name:'FROZEN LAKE CIRCUIT',region:'Frozen alpine lake',description:'A glassy frozen lake, snowbanks and distant icy peaks create a crisp winter arena.',weather:'FROST GLOW',feature:'ice',hue:.57,accent:'#a3dff0',layout:33},
  {name:'SNOW VILLAGE RUN',region:'Snowbound mountain village',description:'Wooden chalets, warm windows and snow-covered rooftops line this alpine village route.',weather:'SOFT SNOWFALL',feature:'village',hue:.60,accent:'#a4d0e8',layout:34},
  {name:'ICE CAVE SPRINT',region:'Glacial ice cavern',description:'A dramatic blue-ice cavern with crystalline formations and glowing frozen walls.',weather:'ICE CAVE GLOW',feature:'cave',hue:.55,accent:'#70cde8',layout:35},
  {name:'FJORDLINE GP',region:'Northern fjord coastline',description:'Steep snow-capped cliffs rise from dark fjord water beside the winding race route.',weather:'FJORD BREEZE',feature:'fjord',hue:.52,accent:'#77bdd0',layout:36},
  {name:'SUMMIT SKIWAY',region:'High mountain ski resort',description:'A high-altitude resort with ski lifts, snow fences and bright summit views.',weather:'BLUEBIRD SNOW',feature:'ski',hue:.58,accent:'#83c9f4',layout:37},
  {name:'SILVER BIRCH SNOW',region:'Silver birch winter forest',description:'White-barked birch trees and soft blue twilight create a quiet winter woodland.',weather:'WINTER TWILIGHT',feature:'birch',hue:.62,accent:'#b4d7e6',layout:38},
  {name:'POLAR NIGHT CIRCUIT',region:'Arctic polar landscape',description:'An arctic night race under aurora ribbons, stars and distant ice ridges.',weather:'AURORA NIGHT',feature:'polar',hue:.68,accent:'#83a9f5',layout:39},
  // ELITE · 41–50
  {name:'NEON DOWNTOWN',region:'Futuristic financial district',description:'Glowing glass towers and animated-looking neon accents fill a deep-blue downtown skyline.',weather:'NEON NIGHT',feature:'downtown',hue:.68,accent:'#36e7ff',layout:40},
  {name:'SAKURA CYBERWAY',region:'Neon garden metropolis',description:'Cherry-blossom trees meet futuristic towers, holographic signage and violet city light.',weather:'PINK NEON',feature:'sakuraCity',hue:.88,accent:'#f27ce5',layout:41},
  {name:'RAINFALL BOULEVARD',region:'Rain-soaked city streets',description:'A reflective midnight boulevard with rain haze, illuminated signs and wet asphalt.',weather:'RAIN-SLICK NIGHT',feature:'rain',hue:.58,accent:'#66d8ef',layout:42},
  {name:'HOLOGRAM DISTRICT',region:'Holographic technology quarter',description:'Luminous hologram rings, glass towers and violet-blue projections line the track.',weather:'HOLOGRAM GLOW',feature:'holo',hue:.76,accent:'#b18aff',layout:43},
  {name:'CHROME INDUSTRIAL',region:'Neon industrial zone',description:'Chrome refineries, steam stacks and electric warning lights frame a technical circuit.',weather:'INDUSTRIAL HAZE',feature:'industrial',hue:.53,accent:'#86c7d8',layout:44},
  {name:'SKYLINE EXPRESS',region:'High-rise skyline',description:'A fast city circuit with towering skyscrapers, elevated signs and long illuminated straights.',weather:'CITY GLOW',feature:'skyline',hue:.63,accent:'#5aaaff',layout:45},
  {name:'ELEVATED METRO',region:'Elevated rail district',description:'An urban race beneath elevated metro tracks, station platforms and bright city lights.',weather:'MIDNIGHT METRO',feature:'elevated',hue:.72,accent:'#ad83ff',layout:46},
  {name:'NEON TUNNEL RUN',region:'Underground neon expressway',description:'A sequence of luminous tunnel portals and high-contrast neon trackside structures.',weather:'TUNNEL LIGHTS',feature:'tunnel',hue:.83,accent:'#e06bff',layout:47},
  {name:'CYBER HARBOR',region:'Futuristic container harbour',description:'A high-tech shipping port with cyan cranes, glowing cargo stacks and a dark waterfront.',weather:'CYBER SEA FOG',feature:'cyberport',hue:.54,accent:'#45e5db',layout:48},
  {name:'AFTERDARK GRAND PRIX',region:'Midnight entertainment city',description:'A dramatic night skyline with magenta marquees, blue spotlights and glossy streets.',weather:'AFTER DARK',feature:'afterdark',hue:.82,accent:'#fa69c8',layout:49},
  // MASTER · 51–60
  {name:'MAGMA RIDGE',region:'Active volcanic ridge',description:'Glowing lava fissures, black volcanic rock and smoking peaks surround the circuit.',weather:'MAGMA GLOW',feature:'lava',hue:.03,accent:'#ff713e',layout:50},
  {name:'ASHFALL PLAINS',region:'Volcanic ash desert',description:'A grey ash plain with drifting smoke, pumice boulders and distant eruptions.',weather:'ASH FALL',feature:'ash',hue:.02,accent:'#c47c68',layout:51},
  {name:'OBSIDIAN CLIFFS',region:'Black glass mountains',description:'Tall obsidian formations, dark cliffs and glowing red cracks create a stark landscape.',weather:'OBSIDIAN HAZE',feature:'obsidian',hue:.94,accent:'#c05c82',layout:52},
  {name:'EMBER FOREST',region:'Burning woodland edge',description:'Charred tree silhouettes, ember-lit rocks and smoky orange skies line the course.',weather:'EMBER WIND',feature:'ember',hue:.06,accent:'#ff9448',layout:53},
  {name:'CALDERA RING',region:'Volcanic crater basin',description:'A vast volcanic caldera with a glowing crater rim and layered lava fields.',weather:'CRATER HEAT',feature:'caldera',hue:.01,accent:'#ff7447',layout:54},
  {name:'LAVA BRIDGE RUN',region:'Molten ravine crossing',description:'A dramatic elevated crossing above molten channels and jagged volcanic walls.',weather:'LAVA RIVER',feature:'lavaBridge',hue:.04,accent:'#ff9b44',layout:55},
  {name:'BASALT DESERT',region:'Basalt column desert',description:'Hexagonal basalt pillars, dark sand and distant red peaks shape a technical run.',weather:'HOT BASALT',feature:'basalt',hue:.02,accent:'#bf765d',layout:56},
  {name:'FIREPEAK PASS',region:'Erupting fire mountain',description:'A twisting road at the foot of an erupting peak, with sparks and glowing vents.',weather:'ERUPTION LIGHT',feature:'firepeak',hue:.05,accent:'#ff7840',layout:57},
  {name:'SMOKE VALLEY',region:'Volcanic smoke basin',description:'Dense volcanic haze, fumaroles and rugged dark ridges create an atmospheric race.',weather:'SMOKE HAZE',feature:'smoke',hue:.98,accent:'#b67d75',layout:58},
  {name:'ERUPTION GRAND PRIX',region:'Lava eruption arena',description:'A spectacular final volcanic arena surrounded by magma channels and blazing peaks.',weather:'EMBER STORM',feature:'eruption',hue:.025,accent:'#ff5d35',layout:59},
  // LEGEND · 61–70
  {name:'CLOUDSPIRE ISLANDS',region:'Floating mountain islands',description:'Floating green islands, waterfalls and luminous towers hang above a sea of clouds.',weather:'CLOUD SEA',feature:'cloudislands',hue:.55,accent:'#8af5ff',layout:60},
  {name:'ORBITAL RINGWAY',region:'Outer-space orbital city',description:'A futuristic orbital route with ring structures, satellite towers and deep-space stars.',weather:'ORBITAL DAWN',feature:'orbital',hue:.67,accent:'#8e9cff',layout:61},
  {name:'AURORA CLOUDWAY',region:'Aurora-lit sky corridor',description:'Colourful aurora ribbons illuminate floating cliffs and luminous cloud banks.',weather:'AURORA GLOW',feature:'aurora',hue:.43,accent:'#65edc7',layout:62},
  {name:'CELESTIAL CITY',region:'City above the clouds',description:'A radiant sky city of crystal towers, suspended bridges and brilliant blue atmosphere.',weather:'CELESTIAL DAWN',feature:'celestial',hue:.60,accent:'#7bdfff',layout:63},
  {name:'NEBULA BRIDGE',region:'Nebula-lit space bridge',description:'A sweeping bridge crosses a violet nebula between floating cosmic platforms.',weather:'NEBULA STORM',feature:'nebula',hue:.78,accent:'#c17cff',layout:64},
  {name:'LUNAR OUTPOST',region:'Moon-base race colony',description:'A lunar racing colony with domes, antenna arrays and a bright view of distant Earth.',weather:'LUNAR LIGHT',feature:'lunar',hue:.62,accent:'#b0c5ea',layout:65},
  {name:'CRYSTAL SKYGARDEN',region:'Floating crystal gardens',description:'Giant glowing crystals, suspended gardens and glassy sky platforms surround the track.',weather:'CRYSTAL SHIMMER',feature:'crystal',hue:.52,accent:'#74f0e8',layout:66},
  {name:'STARFALL TOWERS',region:'Starlight megastructures',description:'Tall luminous towers rise from floating islands beneath a brilliant meteor field.',weather:'STARFALL',feature:'starfall',hue:.70,accent:'#8eb6ff',layout:67},
  {name:'COSMIC STORMWAY',region:'Interstellar storm corridor',description:'A bold race through a cosmic storm of glowing clouds, stars and electric sky bridges.',weather:'COSMIC STORM',feature:'cosmic',hue:.82,accent:'#bd83ff',layout:68},
  {name:'INFINITY CROWN',region:'Ultimate celestial circuit',description:'The final championship world combines radiant sky islands, monumental gates and an endless cosmic horizon.',weather:'INFINITY LIGHT',feature:'infinity',hue:.58,accent:'#a5fff4',layout:69}
];

const CAREER_STORAGE_KEY = 'apex-racing-career-v1';
const clock = new THREE.Clock();
const keys = new Set();
let renderer, scene, camera, player, playerWheels = [], curve, trackSamples = [];
let environmentRoot, trackRoot, hemiLight, sunLight, activeEnvironmentIndex = -1, activeLevelNumber = -1, activeTheme = null;
let opponents = [], decor = [], running = false, paused = false, raceStarted = false;
let gameOver = false, countdownActive = false, countdownStart = 0;
let raceTime = 0, lapStartTime = 0, bestLap = Infinity, lapCount = 0;
let lastCountdownCue = -1;
let prevProgress = 0, playerProgress = 0, nitro = 100, gear = 1, cameraMode = 0;
let toastTimer = 0, lastFrame = performance.now(), audioContext = null;
let masterGain = null, engineGain = null, engineOscillator = null, engineHarmonic = null;
let engineFilter = null, tireNoiseGain = null, windNoiseGain = null, tireNoiseFilter = null, windNoiseFilter = null;
let audioInitialized = false, audioEnabled = true, audioVolume = 0.68;
let audioLastGear = 1, lastImpactSoundAt = 0; 
const SOUND_STORAGE_KEY = 'apex-racing-sound-v1';
let career = loadCareerProgress();
const savedSoundPreferences = loadSoundPreferences();
audioEnabled = savedSoundPreferences.enabled;
audioVolume = savedSoundPreferences.volume;
let selectedLevel = career.unlockedLevel;
let currentLevel = 1;
const playerState = { velocity: new THREE.Vector3(), yaw: 0, steer: 0, steerAngle: 0, speed: 0, onRoad: true, nitroUsed: false };

const clamp = THREE.MathUtils.clamp;
const lerp = THREE.MathUtils.lerp;
const moveTowards = (current, target, maxDelta) => current < target
  ? Math.min(current + maxDelta, target)
  : Math.max(current - maxDelta, target);
const fmtTime = (seconds) => {
  if (!Number.isFinite(seconds)) return '--:--.---';
  const m = Math.floor(seconds / 60), s = seconds % 60;
  return `${String(m).padStart(2,'0')}:${s.toFixed(3).padStart(6,'0')}`;
};

function loadCareerProgress() {
  const fallback = { unlockedLevel: 1, completedLevels: {} };
  try {
    const saved = JSON.parse(localStorage.getItem(CAREER_STORAGE_KEY) || 'null');
    if (!saved || typeof saved !== 'object') return fallback;
    const unlockedLevel = Math.min(MAX_LEVEL, Math.max(1, Math.floor(Number(saved.unlockedLevel) || 1)));
    const completedLevels = saved.completedLevels && typeof saved.completedLevels === 'object'
      ? saved.completedLevels : {};
    return { unlockedLevel, completedLevels };
  } catch {
    return fallback;
  }
}

function saveCareerProgress() {
  try { localStorage.setItem(CAREER_STORAGE_KEY, JSON.stringify(career)); }
  catch { showToast('PROGRESS COULD NOT BE SAVED'); }
}

function getLevelTier(level) {
  return TIER_NAMES[Math.min(TIER_NAMES.length - 1, Math.floor((level - 1) / 10))];
}

function mixThemeHex(baseHex, hue, saturation, lightness, amount) {
  return new THREE.Color(baseHex).lerp(new THREE.Color().setHSL((hue % 1 + 1) % 1, saturation, lightness), amount).getHex();
}

function getLevelTheme(level) {
  const safeLevel = Math.max(1, Math.min(MAX_LEVEL, Math.floor(level || 1)));
  const tierIndex = Math.floor((safeLevel - 1) / 10);
  const base = ENVIRONMENTS[tierIndex];
  const meta = LEVEL_WORLD_META[safeLevel - 1];
  const strength = tierIndex >= 4 ? .34 : .42;
  const theme = {
    ...base,
    ...meta,
    tier: base.tier,
    short: meta.name,
    track: `${meta.name} GP`,
    weather: [meta.weather],
    sky: mixThemeHex(base.sky, (meta.hue + safeLevel * .003) % 1, .48, tierIndex >= 4 ? .19 : .67, .34),
    fog: mixThemeHex(base.fog, (meta.hue + safeLevel * .002) % 1, .38, tierIndex >= 4 ? .20 : .62, .34),
    ground: mixThemeHex(base.ground, meta.hue, .56, tierIndex >= 4 ? .18 : .40, .43),
    road: mixThemeHex(base.road, meta.hue, .28, .17, .11),
    verge: mixThemeHex(base.verge, meta.hue, .56, .48, .35),
    curbA: mixThemeHex(base.curbA, meta.hue, .32, .83, .28),
    curbB: new THREE.Color().setHSL((meta.hue + .08) % 1, .65, .55).getHex(),
    barrier: mixThemeHex(base.barrier, meta.hue, .38, .48, .22),
    hemiSky: mixThemeHex(base.hemiSky, meta.hue, .34, .72, .15),
    hemiGround: mixThemeHex(base.hemiGround, meta.hue, .36, .28, .18),
    sun: new THREE.Color().setHSL((meta.hue + .08) % 1, .42, .78).getHex(),
    accent: meta.accent,
    swatches: [new THREE.Color().setHSL(meta.hue, .52, .62).getStyle(), `#${new THREE.Color(base.ground).getHexString()}`, meta.accent]
  };
  theme.swatches = [
    `#${new THREE.Color(theme.sky).getHexString()}`,
    `#${new THREE.Color(theme.ground).getHexString()}`,
    theme.accent
  ];
  return theme;
}

function renderCareerMenu() {
  if (!ui.levelGrid) return;
  ui.levelGrid.innerHTML = '';
  let completedCount = 0;
  for (let level = 1; level <= MAX_LEVEL; level++) {
    const isUnlocked = level <= career.unlockedLevel;
    const isCompleted = Object.prototype.hasOwnProperty.call(career.completedLevels, String(level));
    if (isCompleted) completedCount++;
    const tierIndex = Math.floor((level - 1) / 10);
    const tile = document.createElement('button');
    tile.type = 'button';
    tile.className = `level-tile tier-${tierIndex}${isUnlocked ? ' unlocked' : ' locked'}${isCompleted ? ' completed' : ''}${level === selectedLevel ? ' selected' : ''}`;
    tile.style.setProperty('--tier-accent', LEVEL_WORLD_META[level - 1].accent);
    tile.title = `LEVEL ${String(level).padStart(2,'0')} · ${LEVEL_WORLD_META[level - 1].name} — ${LEVEL_WORLD_META[level - 1].region}`;
    tile.setAttribute('aria-label', tile.title + (isUnlocked ? ', unlocked' : ', locked'));
    tile.disabled = !isUnlocked;
    tile.innerHTML = `<span class="level-number">${String(level).padStart(2, '0')}</span><small>${isCompleted ? 'CLEARED' : isUnlocked ? 'OPEN' : 'LOCKED'}</small>`;
    if (isUnlocked) tile.addEventListener('click', () => {
      selectedLevel = level;
      renderCareerMenu();
    });
    ui.levelGrid.appendChild(tile);
  }
  const unlockedCount = career.unlockedLevel;
  ui.careerProgressText.textContent = `${unlockedCount} / ${MAX_LEVEL} LEVELS UNLOCKED · ${completedCount} CLEARED`;
  ui.careerProgressFill.style.width = `${(unlockedCount / MAX_LEVEL) * 100}%`;
  const theme = getLevelTheme(selectedLevel);
  const eventInTier = ((selectedLevel - 1) % 10) + 1;
  const weather = theme.weather[0];
  const paceBonus = ((selectedLevel - 1) * 0.24).toFixed(1);
  ui.selectedLevelTitle.textContent = `LEVEL ${String(selectedLevel).padStart(2, '0')} · ${getLevelTier(selectedLevel)}`;
  ui.selectedLevelDetail.textContent = `${theme.region} · ${weather} · UNIQUE TRACK · AI +${paceBonus} m/s · Top 3 to unlock next level.`;
  if (ui.environmentName) ui.environmentName.textContent = theme.name;
  if (ui.environmentDescription) ui.environmentDescription.textContent = theme.description;
  if (ui.environmentTier) ui.environmentTier.textContent = `${theme.tier} · UNIQUE WORLD ${String(selectedLevel).padStart(2,'0')}/70 · EVENT ${eventInTier}/10 · ${weather}`;
  if (ui.environmentSwatches) ui.environmentSwatches.innerHTML = theme.swatches.map(c => `<i style="background:${c}"></i>`).join('');
  if (ui.trackName) ui.trackName.textContent = theme.track;
  document.documentElement.style.setProperty('--environment-accent', theme.accent);
  $('start-btn').innerHTML = `START LEVEL ${selectedLevel} <span>→</span>`;
  setLevelEnvironment(selectedLevel);
}
const makeMat = (color, roughness = .7, metalness = 0) => new THREE.MeshStandardMaterial({ color, roughness, metalness });

function showError(message) {
  ui.error.textContent = message;
  ui.error.classList.remove('hidden');
  ui.loading.classList.add('hidden');
}

function initRenderer() {
  renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;
  renderer.domElement.id = 'game-canvas';
  $('game-root').prepend(renderer.domElement);
}

function initScene() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x8bc8eb);
  scene.fog = new THREE.Fog(0x9fc9d8, 230, 760);
  camera = new THREE.PerspectiveCamera(66, window.innerWidth / window.innerHeight, .1, 1400);
  camera.position.set(0, 8, 18);

  environmentRoot = new THREE.Group();
  environmentRoot.name = 'environment-root';
  trackRoot = new THREE.Group();
  trackRoot.name = 'track-root';
  scene.add(environmentRoot, trackRoot);

  hemiLight = new THREE.HemisphereLight(0xeaf7ff, 0x4a623c, 1.95);
  scene.add(hemiLight);
  sunLight = new THREE.DirectionalLight(0xfff0d4, 2.8);
  sunLight.position.set(-90, 150, 75);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.set(2048, 2048);
  sunLight.shadow.camera.left = -190; sunLight.shadow.camera.right = 190;
  sunLight.shadow.camera.top = 190; sunLight.shadow.camera.bottom = -190;
  sunLight.shadow.normalBias = .035;
  scene.add(sunLight);
}

function disposeGroup(group) {
  while (group.children.length) {
    const child = group.children[group.children.length - 1];
    child.traverse?.(node => {
      if (node.geometry) node.geometry.dispose();
      if (node.material) {
        const mats = Array.isArray(node.material) ? node.material : [node.material];
        mats.forEach(mat => mat.dispose());
      }
    });
    group.remove(child);
  }
}

function addEnvironmentMesh(mesh) { environmentRoot.add(mesh); return mesh; }
function addTrackMesh(mesh) { trackRoot.add(mesh); return mesh; }

function makeEmissiveMat(color, emissive, intensity = 1.0, roughness = .45) {
  return new THREE.MeshStandardMaterial({ color, emissive, emissiveIntensity: intensity, roughness, metalness: .18 });
}

function addGround(theme) {
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(1600, 1600), makeMat(theme.ground, .98));
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -.22;
  ground.receiveShadow = true;
  addEnvironmentMesh(ground);
}

function addMountainRing(color, count = 18, radius = 345, minHeight = 40, maxHeight = 105, width = 70) {
  const mat = makeMat(color, .98);
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2;
    const h = minHeight + (i % 5) / 4 * (maxHeight - minHeight);
    const w = width + (i % 4) * 11;
    const mountain = new THREE.Mesh(new THREE.ConeGeometry(w, h, 7), mat);
    mountain.position.set(Math.cos(a) * radius, h / 2 - 4, Math.sin(a) * radius);
    mountain.rotation.y = a * .7;
    addEnvironmentMesh(mountain);
  }
}

function addPine(x, z, scale, leafColor, trunkColor = 0x62452f) {
  const group = new THREE.Group();
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(.22*scale,.38*scale,2.8*scale,7), makeMat(trunkColor));
  trunk.position.y = 1.4*scale; group.add(trunk);
  const leaves = makeMat(leafColor, .9);
  for (let k = 0; k < 3; k++) {
    const crown = new THREE.Mesh(new THREE.ConeGeometry((1.8-k*.3)*scale, 2.8*scale, 7), leaves);
    crown.position.y = (2.6+k*1.12)*scale; crown.castShadow = true; group.add(crown);
  }
  group.position.set(x,0,z); addEnvironmentMesh(group);
}

function addPalm(x, z, scale = 1) {
  const group = new THREE.Group();
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(.28*scale,.48*scale,6.5*scale,7), makeMat(0x8c6545));
  trunk.position.y=3.25*scale; trunk.rotation.z=-.08; group.add(trunk);
  const leafMat=makeMat(0x23805e);
  for(let i=0;i<7;i++){
    const leaf=new THREE.Mesh(new THREE.ConeGeometry(.55*scale,4.2*scale,5),leafMat);
    leaf.position.y=6.45*scale; leaf.rotation.z=Math.PI*.43; leaf.rotation.y=i*Math.PI*2/7; leaf.scale.z=.45; group.add(leaf);
  }
  group.position.set(x,0,z); addEnvironmentMesh(group);
}

function addBuilding(x, z, width, depth, height, color, glow = null) {
  const mat = glow ? makeEmissiveMat(color, glow, 1.25, .32) : makeMat(color, .82, .12);
  const building = new THREE.Mesh(new THREE.BoxGeometry(width,height,depth),mat);
  building.position.set(x,height/2,z); building.castShadow=true; building.receiveShadow=true; addEnvironmentMesh(building);
  if (glow) {
    const strip = new THREE.Mesh(new THREE.BoxGeometry(width*1.02,.32,depth*1.02),makeEmissiveMat(glow,glow,2.2,.25));
    strip.position.set(x,height*.72,z); addEnvironmentMesh(strip);
  }
  return building;
}

function addCactus(x,z,scale=1,color=0x3d7848){
  const mat=makeMat(color);
  const main=new THREE.Mesh(new THREE.CylinderGeometry(.42*scale,.5*scale,4.4*scale,7),mat);main.position.set(x,2.2*scale,z);addEnvironmentMesh(main);
  for(const side of [-1,1]){
    const arm=new THREE.Mesh(new THREE.CylinderGeometry(.22*scale,.27*scale,2.0*scale,7),mat);arm.position.set(x+side*.72*scale,2.6*scale,z);arm.rotation.z=side*.25;addEnvironmentMesh(arm);
    const tip=new THREE.Mesh(new THREE.CylinderGeometry(.23*scale,.23*scale,1.35*scale,7),mat);tip.position.set(x+side*1.05*scale,3.65*scale,z);addEnvironmentMesh(tip);
  }
}

function addCloud(x,y,z,scale,color=0xeaf2f6){
  const mat=makeMat(color,.98);
  for(let i=0;i<4;i++){
    const puff=new THREE.Mesh(new THREE.SphereGeometry((5+i%2*2)*scale,9,7),mat);
    puff.position.set(x+(i-1.5)*4*scale,y+(i%2)*1.7*scale,z+Math.sin(i*1.7)*2*scale);
    puff.scale.y=.55;addEnvironmentMesh(puff);
  }
}

function addLavaCrack(x,z,length,rotation=0){
  const glow=makeEmissiveMat(0xff6a24,0xff3b12,2.8,.3);
  const crack=new THREE.Mesh(new THREE.BoxGeometry(.65,.12,length),glow);
  crack.position.set(x,.03,z);crack.rotation.y=rotation;addEnvironmentMesh(crack);
}

function addSkyEnvironment(theme, level) {
  // Each of the 70 events has its own landmark composition. The selected scene alone is built.
  addGround(theme);
  const world = LEVEL_WORLD_META[level - 1];
  const f = world.feature;
  const accent = new THREE.Color(world.accent);
  const neutral = (c, r = .88, m = 0) => makeMat(c, r, m);
  const put = (geometry, material, x, y, z, rx = 0, ry = 0, rz = 0, sx = 1, sy = 1, sz = 1) => {
    const o = new THREE.Mesh(geometry, material);
    o.position.set(x, y, z); o.rotation.set(rx, ry, rz); o.scale.set(sx, sy, sz);
    addEnvironmentMesh(o); return o;
  };
  const box = (x,y,z,w,h,d,c,glow=null) => put(new THREE.BoxGeometry(w,h,d), glow ? makeEmissiveMat(c,glow,1.7,.3) : neutral(c), x,y,z);
  const cone = (x,y,z,r,h,c,sides=7) => put(new THREE.ConeGeometry(r,h,sides),neutral(c),x,y,z);
  const cylinder = (x,y,z,rt,rb,h,c,sides=9,metal=0) => put(new THREE.CylinderGeometry(rt,rb,h,sides),neutral(c,.72,metal),x,y,z);
  const sphere = (x,y,z,r,c,sx=1,sy=1,sz=1) => put(new THREE.SphereGeometry(r,12,9),neutral(c,.88),x,y,z,0,0,0,sx,sy,sz);
  const water = (x,z,w,d,c) => put(new THREE.PlaneGeometry(w,d),new THREE.MeshStandardMaterial({color:c,roughness:.2,metalness:.22,transparent:true,opacity:.91}),x,-.12,z,-Math.PI/2);
  const ridge = (x,z,w,h,d,c,rot=0) => put(new THREE.ConeGeometry(w,h,6),neutral(c),x,h/2-3,z,0,rot,0,1,d/Math.max(1,w),1);
  const treeLine = (count, color, trunk, shape='cone', radius=255) => {
    for(let i=0;i<count;i++){
      const a=i/count*Math.PI*2, r=radius+(i%4)*17, x=Math.cos(a)*r, z=Math.sin(a)*r;
      if(shape==='pine') addPine(x,z,.85+(i%4)*.17,color,trunk);
      else addWorldTree(x,z,.95+(i%3)*.2,color,trunk,shape);
    }
  };
  const particleCloud = (color, count=150, yMin=8, yMax=170, size=1.5) => {
    const p=[]; for(let i=0;i<count;i++) p.push((Math.random()-.5)*900,yMin+Math.random()*(yMax-yMin),(Math.random()-.5)*900);
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));
    addEnvironmentMesh(new THREE.Points(g,new THREE.PointsMaterial({color,size,sizeAttenuation:true,transparent:true,opacity:.82})));
  };
  const archRow = (color, glow=null, count=4, z=-270) => {
    for(let i=0;i<count;i++){
      const a=put(new THREE.TorusGeometry(19+(i%2)*3,1.4,8,28,Math.PI),glow?makeEmissiveMat(color,glow,1.8):neutral(color),-245+i*165,18+(i%2)*4,z-(i%2)*24);
      a.rotation.z=Math.PI;
    }
  };
  const buildingRow = (count, palette, glowPalette=null, startX=-285, z=-285) => {
    for(let i=0;i<count;i++) addBuilding(startX+i*(570/count),z+(i%3)*13,18+(i%3)*5,18+(i%2)*7,35+(i*17%6)*13,palette[i%palette.length],glowPalette?glowPalette[i%glowPalette.length]:null);
  };
  const mountainWall = (color, count=14, radius=340, low=55, high=125) => addMountainRing(color,count,radius,low,high,82);
  const lightMat = (c) => makeEmissiveMat(c,c,2.0,.25);

  switch(f) {
    // ROOKIE · ten distinctly composed rural worlds
    case 'pine':
      mountainWall(0x6c9660,18,350,35,90); treeLine(62,0x286447,0x60452f,'pine',205);
      for(let i=0;i<9;i++) sphere(-280+i*70,3,-300-(i%3)*35,24,0x77a65b,1.8,.42,1.25);
      break;
    case 'autumn':
      mountainWall(0x9b7658,13,365,26,74); treeLine(44,0xc96b35,0x61402f,'round',220);
      for(let i=0;i<170;i++) sphere((Math.random()-.5)*520,4+Math.random()*24,(Math.random()-.5)*520,.55, i%3?0xe39a43:0xa9442d);
      particleCloud(0xe8a24b,190,9,85,1.25);
      break;
    case 'blossom':
      mountainWall(0x7896a4,12,360,35,75); treeLine(42,0xf2a8cb,0x624434,'round',215);
      water(240,-260,250,145,0x48a9cf); archRow(0xb94757,0xd86a85,3,-230);
      for(let i=0;i<4;i++) box(-240+i*160,1,-180,8,2,105,0xb98962);
      particleCloud(0xf6c2df,180,5,65,1.1);
      break;
    case 'sunflower':
      for(let row=0;row<8;row++) for(let i=0;i<13;i++){
        const x=-310+i*52,z=-330+row*88;
        cylinder(x,2.6,z,.22,.28,5.2,0x4e8738,6); sphere(x,5.7,z,1.65,0xf2c82e,1,1,.55); sphere(x,5.75,z-.8,.62,0x754d24,1,1,.5);
      }
      box(-235,9,-285,42,18,34,0xc9a56f); cone(-235,23,-285,31,16,0x9b493a,4);
      addWorldWindTurbine(235,-280,1.35,0xf2efe1); addWorldWindTurbine(275,210,.9,0xf2efe1);
      break;
    case 'river':
      water(245,-250,430,155,0x318fb4); water(-245,245,360,135,0x3ba7bb);
      for(let i=0;i<3;i++) addWorldBridge(-205+i*205,-245+(i%2)*420,0x9d7954,0x66cbe1);
      treeLine(24,0x669b5a,0x5e4934,'round',310);
      for(let i=0;i<12;i++) sphere(175+(i%4)*35,2,-315+Math.floor(i/4)*26,5+i%3,0x7b8a79,1.6,.5,1);
      break;
    case 'redwood':
      for(let i=0;i<34;i++){
        const a=i/34*Math.PI*2,r=220+(i%4)*36,x=Math.cos(a)*r,z=Math.sin(a)*r,h=74+(i%5)*22;
        cylinder(x,h/2,z,3.4+(i%3),4.5+(i%3),h,0x714632,9);
        sphere(x,h+7,z,12+(i%4)*2,0x2c613d,1.4,.7,1.2);
      }
      mountainWall(0x4b7652,12,375,25,60);
      break;
    case 'windmill':
      for(let i=0;i<11;i++){const x=-300+(i%6)*118,z=-330+Math.floor(i/6)*390;addWorldWindTurbine(x,z,.8+(i%3)*.2,0xf2f4ef);}
      for(let i=0;i<18;i++) ridge(-330+i*39,300,32,18+(i%4)*7,55,0x75a35a,(i%2)*.18);
      treeLine(12,0x4c804b,0x624a33,'round',300);
      break;
    case 'orchard':
      for(let row=0;row<7;row++) for(let i=0;i<8;i++){
        const x=-280+i*78,z=-320+row*105;addWorldTree(x,z,1.2,0x558f46,0x735039,'round');
        for(let k=0;k<4;k++) sphere(x+Math.cos(k*1.57)*2.2,4.6+Math.sin(k*1.57)*1.4,z+Math.sin(k*1.57)*2.2,.52,0xc94b35);
      }
      box(235,10,-275,46,20,36,0xd4b47f);cone(235,24,-275,34,15,0x873b32,4);
      break;
    case 'lake':
      water(250,-245,540,350,0x3d9bb5); mountainWall(0x617e8d,18,365,55,145);
      for(let i=0;i<5;i++) box(-255+i*110,1,-90,5,1.4,95,0x97724f);
      for(let i=0;i<8;i++) addPine(-300+i*85,230+(i%3)*24,1.1,0x2c6049);
      sphere(240,2,-245,17,0x6a9c76,2,.25,1.2);
      break;
    case 'canyon':
      for(let side of [-1,1]) for(let i=0;i<10;i++){
        const x=side*(250+(i%3)*26),z=-340+i*72,h=75+(i%5)*18;
        put(new THREE.BoxGeometry(48,h,68),neutral(0x527c54),x,h/2-4,z,0,(i%3)*.12,side*.08,1,1,1);
      }
      water(245,-245,75,200,0x56b9c6); box(245,35,-245,42,70,4,0x72d3d7);
      for(let i=0;i<15;i++) addWorldTree(-300+i*40,285+(i%3)*13,.75,0x477a4a);
      break;

    // CLUB · ten different coastal / industrial destinations
    case 'marina':
      water(245,-255,620,450,0x1689b2);
      for(let i=0;i<5;i++){
        box(-270+i*135,1,-220,8,1,100,0x99724f);
        const hull=put(new THREE.ConeGeometry(12,40,4),neutral(0xf0eee5),-270+i*135,4,-280);hull.rotation.x=Math.PI/2;
        cylinder(-270+i*135,13,-280,.55,.55,20,0xf4eee0,7);
      }
      buildingRow(18,[0xe1e6df,0x8db8c9,0xd8c6a3],null,-300,-340); break;
    case 'tropical':
      water(240,-255,650,520,0x18b9b4); for(let i=0;i<18;i++){
        const x=-300+(i%6)*115,z=-340+Math.floor(i/6)*330;
        put(new THREE.SphereGeometry(1,12,8),neutral(0x4a9b67),x,2,z,0,0,0,44,1.8,35);
        addPalm(x+24,z+8,.9+(i%3)*.2);
      }
      for(let i=0;i<7;i++){cylinder(-260+i*85,5,-300,5,8,10,0xd0b482,7);cone(-260+i*85,13,-300,9,7,0x9a6741,6);}
      break;
    case 'boardwalk':
      box(240,1,-270,520,1.2,42,0x98724f); for(let i=0;i<17;i++) box(-15+i*31,1.8,-270,1,.5,42,0x634f3d);
      water(240,-370,680,190,0x3298b8); buildingRow(12,[0xf1d7ad,0xe6b88e,0xaed0d2],null,-280,-340);
      // Ferris wheel landmark
      put(new THREE.TorusGeometry(42,2.2,9,48),neutral(0xd6d9d8),230,53,-300);
      for(let i=0;i<12;i++){const a=i/12*Math.PI*2;box(230+Math.cos(a)*42,53+Math.sin(a)*42,-300,5,6,4,0xffd08a);}
      break;
    case 'cliff':
      water(270,-280,700,600,0x155d91);
      for(let side of [-1,1]) for(let i=0;i<7;i++) ridge(side*285,-320+i*95,45,95+(i%3)*24,80,side<0?0x8c806c:0x786f62,side*.2);
      for(let i=0;i<4;i++) addWorldBridge(-220+i*150, -250+(i%2)*170,0x8d9290,0x8ad6e7);
      break;
    case 'port':
      for(let i=0;i<4;i++){
        const z=-330+i*180;
        for(let k=0;k<7;k++) box(-300+k*95,7+(k%3)*8,z,62,14+(k%3)*16,28,[0xc45a39,0x28708a,0xd6a33d,0x4c617c][(i+k)%4]);
      }
      for(let i=0;i<5;i++){cylinder(-250+i*125,42,-360,1.2,1.8,82,0x667d85,8,.5);box(-250+i*125,82,-360,3,3,95,0xd5a45c);}
      break;
    case 'lagoon':
      water(240,-250,470,350,0x21c3cb); for(let i=0;i<5;i++){
        sphere(-230+i*115,0,-275+(i%2)*170,32,0xd6c28e,1.6,.14,1.2);
        addPalm(-230+i*115,-275+(i%2)*170,.95);
      }
      for(let i=0;i<4;i++){box(-250+i*165,7,-350,30,2,20,0x8e6844);cone(-250+i*165,14,-350,20,14,0xc68b59,5);}
      break;
    case 'canal':
      water(245,-255,180,600,0x277f9d); for(let side of [-1,1]) for(let i=0;i<10;i++){
        const x=side*150,z=-330+i*72;addBuilding(x,z,38,45,24+(i%4)*9,[0xd2a57f,0xc77e68,0xe1c7a0,0x8eabb2][i%4],i%3===0?0xffd18a:null);
      }
      for(let i=0;i<3;i++) addWorldBridge(245,-265+i*185,0xb58a60,0x64c6d5);
      break;
    case 'lighthouse':
      water(245,-250,620,420,0x1c6c96); cylinder(-245,22,-290,5,8,44,0xece7d7,14); cylinder(-245,47,-290,6,6,7,0x9f3d3d,12); sphere(-245,56,-290,3.6,0xffe69b);
      for(let i=0;i<7;i++) ridge(170+i*32,-330,23,38+(i%3)*14,40,0x746d63);
      // lighthouse beam
      put(new THREE.ConeGeometry(2,180,16,1,true),new THREE.MeshBasicMaterial({color:0xffedb0,transparent:true,opacity:.16,side:THREE.DoubleSide}),-155,47,-290,0,0,-Math.PI/2);
      break;
    case 'riviera':
      water(255,-300,620,320,0x39a4b8); for(let terrace=0;terrace<4;terrace++) for(let i=0;i<7;i++){
        const x=-290+i*95,z=-350+terrace*115;addBuilding(x,z,30,28,19+(i%3)*8,[0xf1d7ae,0xe2bd92,0xd4a58c][(i+terrace)%3]);
        addPalm(x+20,z+18,.72);
      }
      for(let i=0;i<7;i++) ridge(-320+i*105,210,28,32+(i%3)*8,38,0x668154);
      break;
    case 'sunset':
      water(245,-280,650,450,0x9f6375); sphere(-230,128,-390,47,0xffb16d,1,1,1);
      for(let i=0;i<7;i++){const x=-250+i*85;put(new THREE.ConeGeometry(9,32,3),neutral(0xe9e2d2),x,16,-270-(i%2)*38,0,0,Math.PI/2);box(x,1,-270-(i%2)*38,28,1.5,5,0x6c5146);}
      particleCloud(0xffc28d,90,8,100,1.7); break;

    // SPORT · ten different desert destinations
    case 'sandstone':
      for(let side of [-1,1]) for(let i=0;i<8;i++){
        const x=side*(250+(i%3)*22),z=-340+i*92,h=80+(i%4)*23;
        box(x,h/2-4,z,48,h,82,i%2?0xb56a43:0xd28a57);
        box(x,h+1,z,52,3,86,0xe0a16a);
      } break;
    case 'dunes':
      for(let i=0;i<28;i++){
        const x=-350+(i%7)*112,z=-360+Math.floor(i/7)*240;
        sphere(x,0,z,1,i%2?0xd9b777:0xc89b58,2.8,1.0,1.7);
      }
      particleCloud(0xe4c58d,70,2,30,1.3); break;
    case 'mesa':
      for(let i=0;i<12;i++){
        const x=-330+(i%4)*220,z=-360+Math.floor(i/4)*230,h=65+(i%5)*20;
        cylinder(x,h/2,z,22,37,h,0xa84f3c,5);cylinder(x,h+2,z,43,43,5,0xc17a4f,5);
      } break;
    case 'salt':
      put(new THREE.PlaneGeometry(1100,900),new THREE.MeshStandardMaterial({color:0xe8e9e4,roughness:.18,metalness:.12}),0,-.15,0,-Math.PI/2);
      for(let i=0;i<52;i++){
        const x=-330+(i%13)*55,z=-330+Math.floor(i/13)*220;
        box(x,.02,z,.35,.05,30+(i%4)*9,0x9faeae);
      }
      for(let i=0;i<12;i++) addWorldCrystal(-280+i*48,3+(i%3)*2,-350,4+(i%3)*3,0xe4f6f5);
      mountainWall(0xa7b9be,16,400,20,55); break;
    case 'badlands':
      for(let i=0;i<24;i++){
        const x=-340+(i%8)*96,z=-350+Math.floor(i/8)*260,h=32+(i*19%65);
        cone(x,h/2,z,8+(i%3)*4,h,0xa85d48,5);
        cylinder(x,h+2,z,5,5,4,0xd28c67,5);
      } break;
    case 'oasis':
      water(245,-245,270,210,0x1faaa5); sphere(245,1,-245,1,0x62a45a,2.2,.18,1.6);
      for(let i=0;i<15;i++){const x=110+(i%5)*60,z=-330+Math.floor(i/5)*85;addPalm(x,z,.9+(i%3)*.2);}
      for(let i=0;i<10;i++) ridge(-320+i*68,260,35,27+(i%3)*11,45,0xd2a35d);
      break;
    case 'arch':
      for(let i=0;i<5;i++){
        const a=put(new THREE.TorusGeometry(30+(i%2)*8,7,8,28,Math.PI),neutral(0xc17d4c),-280+i*140,45+(i%2)*8,-300-(i%2)*25);
        a.rotation.z=Math.PI;
      }
      for(let i=0;i<16;i++) ridge(-330+i*44,270,20,40+(i%4)*13,35,0xa95f3e);
      break;
    case 'quarry':
      for(let tier=0;tier<5;tier++){
        const y=10+tier*15, width=620-tier*75;
        box(0,y,-340,width,14,42,[0xa15d42,0xb16c49,0x8e5745][tier%3]);
        box(0,y,340,width,14,42,[0x8d5741,0xc17a4c][tier%2]);
      }
      for(let i=0;i<6;i++){cylinder(-260+i*104,15,-270,1.6,2.2,30,0x596b70,8);box(-260+i*104,31,-270,3,2,85,0xd0a25e);}
      break;
    case 'night':
      mountainWall(0x343746,16,370,35,95); particleCloud(0xcbdcff,250,45,280,1.7);
      sphere(-245,165,-350,25,0xe6e3cf); for(let i=0;i<30;i++) addCactus(-300+(i%10)*66,-260+Math.floor(i/10)*230,.6+(i%3)*.22,0x3f554c);
      break;
    case 'drylake':
      put(new THREE.PlaneGeometry(1100,900),neutral(0xb79b7d,.6),0,-.15,0,-Math.PI/2);
      for(let i=0;i<85;i++){
        const x=-340+(i%17)*42,z=-340+Math.floor(i/17)*150,rot=(i%6)*.35;
        const crack=box(x,.02,z,.35,.035,18+(i%4)*8,0x7d6a5d);crack.rotation.y=rot;
      }
      mountainWall(0x756a66,14,390,25,70); particleCloud(0xcab39a,65,2,55,1.2); break;

    // PRO · ten visually different cold / mountain worlds
    case 'alpine':
      mountainWall(0x607e91,22,355,70,190); for(let i=0;i<55;i++) addPine(Math.cos(i*2.4)*(160+i%7*27),Math.sin(i*2.4)*(160+i%7*27),.8+(i%4)*.17,0x2f5d4d);
      break;
    case 'glacier':
      for(let side of [-1,1]) for(let i=0;i<7;i++){
        const x=side*(245+(i%2)*25),z=-350+i*105,h=95+(i%4)*22;
        put(new THREE.ConeGeometry(34,h,5),new THREE.MeshStandardMaterial({color:0x8ed8e8,roughness:.22,metalness:.12,transparent:true,opacity:.86}),x,h/2-5,z,0,(i%3)*.2,0,1,1,.75);
      }
      water(245,-245,110,430,0x77d1e4); break;
    case 'taiga':
      mountainWall(0x334f4a,15,360,60,150); treeLine(78,0x183f37,0x453d35,'pine',190);
      for(let i=0;i<16;i++) ridge(-340+i*45,-350,20,65+(i%3)*17,28,0x3c5b52);
      break;
    case 'ice':
      put(new THREE.CircleGeometry(235,64),new THREE.MeshStandardMaterial({color:0xa7dce9,roughness:.14,metalness:.22}),245,.01,-245,-Math.PI/2);
      for(let i=0;i<75;i++){const x=-300+Math.random()*600,z=-300+Math.random()*600;const l=8+Math.random()*24;const c=box(x,.04,z,.25,.04,l,i%3?0x6caab9:0xd7eff4);c.rotation.y=Math.random()*Math.PI;}
      for(let i=0;i<22;i++) addWorldCrystal(-300+(i%6)*100,4+(i%4)*3,-330+Math.floor(i/6)*180,6+(i%3)*4,0xa6eaf7);
      break;
    case 'village':
      mountainWall(0xaabdc7,14,390,65,145); for(let i=0;i<18;i++){
        const x=-300+(i%6)*115,z=-340+Math.floor(i/6)*190;box(x,9,z,34,18,30,[0x8c6b56,0x9b8170,0x6d7d8b][i%3]);cone(x,21,z,26,13,0x46515b,4);box(x-7,7,z+15,5,9,1,0xffd48b);
      }
      addCloud(-220,35,-320,1.3,0xe5edf3); addCloud(230,40,-340,1.2,0xf2f4f6); break;
    case 'cave':
      box(-260,40,-270,60,100,100,0x344e69);box(260,40,-270,60,100,100,0x344e69);
      for(let i=0;i<13;i++){
        const x=-300+i*50;cone(x,48,-340,9+(i%3)*3,50+(i%4)*10,0x5caac5,6);
        cone(x,40,-220,8+(i%2)*3,38+(i%3)*9,0x8bd9e8,6).rotation.z=Math.PI;
      }
      archRow(0x45c4e6,0x257ba9,5,-285); break;
    case 'fjord':
      water(245,-260,630,500,0x123e5d); for(let side of [-1,1]) for(let i=0;i<8;i++) ridge(side*(250+(i%2)*35),-350+i*95,44,100+(i%4)*25,82,0x607e8a,side*.12);
      for(let i=0;i<7;i++) addCloud(-300+i*95,45+(i%3)*12,-360,1.1,0xd3e2e8); break;
    case 'ski':
      mountainWall(0xa5c9df,18,370,70,185); for(let i=0;i<9;i++){
        const x=-320+i*80; cylinder(x,22,-300,1,1.5,44,0x596b78,8); cylinder(x,22,120,1,1.5,44,0x596b78,8);
        box(x,44,-90,1.4,1.4,420,0x7d8d99);
      }
      for(let i=0;i<8;i++) addWorldBridge(-260+i*75,-260,0xa4b7c4); break;
    case 'birch':
      mountainWall(0x859c9d,12,370,35,88); for(let i=0;i<58;i++){
        const x=Math.cos(i*2.4)*(180+i%6*25),z=Math.sin(i*2.4)*(180+i%6*25),h=18+(i%4)*4;
        cylinder(x,h/2,z,.65,.95,h,0xe5e6df,7); sphere(x,h+1,z,4.5,0xadb87b,1.7,.8,1.2);
        for(let k=0;k<3;k++) box(x+(k-1)*.3,h*.3+k*4,z+.9,.2,1.8,.12,0x525a52);
      } break;
    case 'polar':
      mountainWall(0x526d8f,18,380,40,110); for(let i=0;i<20;i++) addWorldCrystal(-330+(i%5)*165,5+(i%4)*6,-340+Math.floor(i/5)*220,9+(i%3)*5,0x9bd9ff);
      for(let i=0;i<4;i++){const aur=put(new THREE.TorusGeometry(145+i*22,1.9,6,90,Math.PI*1.25),makeEmissiveMat([0x43e3bd,0x568de8,0x9c70ed,0x54cde9][i],[0x1fc79c,0x3c58d6,0x8042c7,0x288fce][i],2.4),0,145+i*8,-330);aur.rotation.x=Math.PI/2;}
      particleCloud(0xd6efff,180,50,300,1.2); break;

    // ELITE · ten distinctive city, technology and industrial worlds
    case 'downtown':
      buildingRow(30,[0x101d39,0x182a4b,0x243d59,0x1d2440],[0x27cfea,0x7b54e8],-320,-350);
      for(let i=0;i<8;i++) box(-300+i*85,1,-160,3,45,3,0x1a2538,0x2fcbef); break;
    case 'sakuraCity':
      buildingRow(18,[0x1c2748,0x38254f,0x3d345d],[0xe96fbd,0x64dff0],-300,-330); treeLine(28,0xe995c5,0x5c3b51,'round',245);
      archRow(0xdb77d4,0xff8ad6,4,-255); particleCloud(0xffb9dd,100,8,90,1.15); break;
    case 'rain':
      buildingRow(28,[0x111d2b,0x25384a,0x162b3a],[0x47b9d4,0x8a72d4],-310,-345);
      water(0,250,720,90,0x253d50); particleCloud(0x8cbccc,500,12,180,0.8);
      for(let i=0;i<12;i++) box(-300+i*52,.03,235,.5,.04,85,0x4c9bb2); break;
    case 'holo':
      for(let i=0;i<18;i++){
        const x=-320+(i%6)*128,z=-350+Math.floor(i/6)*220;
        cylinder(x,28,z,10,10,56,0x173c66,8,.5);
        put(new THREE.TorusGeometry(17+(i%3)*5,.7,8,40),lightMat(i%2?0x5d70ff:0x55e7f0),x,46,z,Math.PI/2,0,0);
        box(x,1,z,42,1.2,42,0x24365a,0x4c6dff);
      } break;
    case 'industrial':
      for(let i=0;i<9;i++){
        const x=-300+i*75; cylinder(x,32,-330,8,11,64,0x53636d,12,.6); cylinder(x,67,-330,10,10,7,0x293841,12,.5);
        box(x+20,18,-250,15,36,20,0x52636a); box(x+20,38,-250,16,2,21,0xff9a3b,0xff6b28);
      }
      for(let i=0;i<7;i++) addCloud(-270+i*84,62,-320,1.3,0x707c84); break;
    case 'skyline':
      buildingRow(24,[0x132b47,0x1c4263,0x2b4a68],[0x53bdff,0x8c8cff],-310,-350);
      for(let i=0;i<5;i++){
        const x=-250+i*125; cylinder(x,35,-265,2,2.4,70,0x71869d,8); sphere(x,72,-265,4,0xbdefff);
      } break;
    case 'elevated':
      for(let i=0;i<9;i++){
        const x=-320+i*80; cylinder(x,24,-320,2,2,48,0x647887,8); cylinder(x,24,70,2,2,48,0x647887,8);
        box(x,48,-125,5,2,420,0x526b83); box(x,51,-125,2,.7,420,0x8b9eae);
      }
      buildingRow(14,[0x192d49,0x263f5b,0x34475b],[0x6c8df2],-300,-350); break;
    case 'tunnel':
      for(let i=0;i<8;i++){
        const x=-315+i*90; const a=put(new THREE.TorusGeometry(29,2.7,9,34,Math.PI),neutral(0x26384d),x,13,-300);a.rotation.z=Math.PI;
        box(x,1,-300,56,1.5,3,0x1d293d,0x4ae8ff);
      }
      for(let i=0;i<24;i++) box(-320+(i%12)*58,12,-330+Math.floor(i/12)*60,1,1,1,0x49dff1,0x49dff1); break;
    case 'cyberport':
      for(let i=0;i<24;i++){
        const x=-300+(i%8)*84,z=-340+Math.floor(i/8)*185;box(x,10,z,58,20+(i%4)*7,35,[0x13485a,0x1b6373,0x303b65][i%3],i%2?0x3cebe0:0x2889ff);
      }
      for(let i=0;i<4;i++){cylinder(-250+i*160,54,-330,1,1.6,105,0x397c87,8);box(-250+i*160,100,-330,3,2,130,0x36cde0);}
      water(245,-250,220,190,0x0d5e7d); break;
    case 'afterdark':
      buildingRow(20,[0x171932,0x251b3a,0x33234b],[0xf04cbd,0x35d9fa,0x9c67ff],-300,-330);
      for(let i=0;i<8;i++){
        box(-280+i*80,14,220,25,28,4,0x4b2654,0xf15bb9);box(-280+i*80,30,218,20,3,1,0xf8a0d6,0xff69d2);
      }
      for(let i=0;i<5;i++) put(new THREE.ConeGeometry(2,170,12,1,true),new THREE.MeshBasicMaterial({color:i%2?0x4d6cff:0xff4fcf,transparent:true,opacity:.12,side:THREE.DoubleSide}),-240+i*120,85,-280,0,0,(i-2)*.12);
      break;

    // MASTER · ten volcanic / geological worlds with different silhouettes
    case 'lava':
      mountainWall(0x302628,20,350,65,190); for(let i=0;i<18;i++){
        const a=i/18*Math.PI*2,r=230+(i%4)*23;cone(Math.cos(a)*r,42,Math.sin(a)*r,23+(i%3)*6,84+(i%4)*24,0x3a2928,8);
      }
      for(let i=0;i<22;i++) addLavaCrack(Math.cos(i*2.4)*(100+i%5*35),Math.sin(i*2.4)*(100+i%5*35),20+(i%4)*10,i*.4); break;
    case 'ash':
      for(let i=0;i<42;i++){
        const x=(Math.random()-.5)*650,z=(Math.random()-.5)*650;
        put(new THREE.DodecahedronGeometry(4+Math.random()*8,0),neutral(i%2?0x625b5a:0x807775),x,2+Math.random()*4,z,Math.random(),Math.random(),Math.random(),1.5,1,1.2);
      }
      for(let i=0;i<9;i++){cylinder(-300+i*75,45,-340,9,15,90,0x4a4445,7);sphere(-300+i*75,93,-340,9,0x716565,1.7,.8,1.7);}
      particleCloud(0x8a7470,180,4,95,1.4); break;
    case 'obsidian':
      for(let i=0;i<34;i++){
        const x=-320+(i%9)*80,z=-350+Math.floor(i/9)*210,h=25+(i*13%95);
        put(new THREE.OctahedronGeometry(12+(i%4)*6,0),makeEmissiveMat(0x242735,i%2?0x9d3d70:0x573f94,.85,.22),x,h/2,z,0,(i%4)*.3,.1,1,h/22,1);
      }
      for(let i=0;i<8;i++) addLavaCrack(-300+i*85,250,38,i*.17); break;
    case 'ember':
      for(let i=0;i<48;i++){
        const x=Math.cos(i*2.4)*(175+i%7*28),z=Math.sin(i*2.4)*(175+i%7*28),h=17+(i%5)*8;
        cylinder(x,h/2,z,.55,.9,h,0x302b29,6); for(let k=0;k<3;k++) box(x+(k-1)*2,h-k*2,z,2,1.1,2,0x4a3028);
      }
      particleCloud(0xff7b31,220,3,55,1.1); for(let i=0;i<12;i++) addLavaCrack(-280+i*50,-285+(i%3)*220,18,i*.3); break;
    case 'caldera':
      put(new THREE.TorusGeometry(265,40,8,80),neutral(0x393032),0,4,0,0,0,0,1,1.2,1);
      put(new THREE.TorusGeometry(205,2.8,8,80),lightMat(0xff5722),0,8,0);
      water(0,0,220,220,0x3b2021); for(let i=0;i<15;i++) cone(Math.cos(i*.42)*310,30,Math.sin(i*.42)*310,25,60+(i%4)*20,0x493234,7);
      break;
    case 'lavaBridge':
      water(250,-280,620,500,0x431a19); for(let i=0;i<17;i++) addLavaCrack(-330+i*40,-270+(i%3)*180,42,i*.18);
      addWorldBridge(245,-245,0x312b2b,0xff4b1d); addWorldBridge(-245,210,0x312b2b,0xff4b1d);
      mountainWall(0x362a2a,15,385,45,115); break;
    case 'basalt':
      for(let side of [-1,1]) for(let i=0;i<28;i++){
        const x=side*(220+(i%4)*27),z=-340+Math.floor(i/4)*95,h=38+(i%6)*12;
        cylinder(x,h/2,z,7,7,h,0x34363b,6);
      }
      mountainWall(0x51403c,12,380,35,90); break;
    case 'firepeak':
      cone(245,120,-300,72,240,0x3a2a28,9); put(new THREE.TorusGeometry(24,4,8,32),lightMat(0xff6322),245,220,-300,Math.PI/2);
      for(let i=0;i<12;i++) cone(245+(Math.random()-.5)*45,220+Math.random()*95,-300+(Math.random()-.5)*45,2+Math.random()*3,15+Math.random()*25,0xff6929,6);
      particleCloud(0xff8a4b,160,15,160,1.7); mountainWall(0x332a2c,14,410,35,110); break;
    case 'smoke':
      for(let i=0;i<14;i++){
        const x=-300+(i%7)*100,z=-300+Math.floor(i/7)*250;cylinder(x,5,z,7,12,10,0x4b4647,8);
        for(let k=0;k<5;k++) sphere(x+(Math.random()-.5)*8,13+k*11,z+(Math.random()-.5)*8,7+k*2,0x777273,1.25,.85,1.2);
      }
      particleCloud(0x898184,220,15,150,2.1); mountainWall(0x4b4142,13,390,35,120); break;
    case 'eruption':
      for(let i=0;i<7;i++){
        const x=-300+i*100,z=-340-(i%2)*65,h=95+(i%4)*28;cone(x,h/2,z,45+(i%2)*10,h,0x302628,9);
        put(new THREE.TorusGeometry(12+(i%3)*4,2,7,20),lightMat(0xff5223),x,h-4,z,Math.PI/2);
      }
      for(let i=0;i<26;i++) addLavaCrack(-320+(i%13)*54,-250+Math.floor(i/13)*430,25+(i%4)*8,i*.21);
      particleCloud(0xff7035,180,8,115,1.5); break;

    // LEGEND · ten different futuristic / celestial destinations
    case 'cloudislands':
      for(let i=0;i<14;i++){
        const x=-330+(i%5)*165,z=-340+Math.floor(i/5)*230,y=35+(i%4)*18;
        cylinder(x,y,z,28,48,24,0x3f6880,7);sphere(x,y+14,z,37,0x4b9a83,1.5,.45,1.2);
        for(let k=0;k<3;k++) addWorldTree(x+(k-1)*13,z+12,.9,0x438d68,0x5c4a3f,'round');
        box(x,y-7,z,3,22,3,0x42b9c9,0x42b9c9);
      }
      for(let i=0;i<6;i++) addCloud(-300+i*105,14+(i%3)*12,-330,1.7,0xb8d7ef); break;
    case 'orbital':
      put(new THREE.TorusGeometry(260,5,8,100),makeEmissiveMat(0x4d9dff,0x225dff,2),0,85,-260,Math.PI/2);
      sphere(245,95,-300,55,0x355f9c,1,1,1); put(new THREE.TorusGeometry(68,3,7,48),lightMat(0x8ccaff),245,95,-300,.35,0,0);
      for(let i=0;i<18;i++){const x=-320+(i%6)*125,z=-350+Math.floor(i/6)*220;box(x,36,z,20,65,20,0x536b91,0x5aa9ff);}
      particleCloud(0xd6e8ff,260,40,310,1.5); break;
    case 'aurora':
      for(let i=0;i<5;i++){
        const arc=put(new THREE.TorusGeometry(210+i*28,2.4,8,100,Math.PI*1.3),makeEmissiveMat([0x4ce3ba,0x58b6ef,0x8d70ed,0x61e6d2,0x4f9cff][i],[0x20c69e,0x338ce0,0x6f4ed4,0x2ebdbe,0x365bd2][i],2.7),0,145+i*10,-330);
        arc.rotation.x=Math.PI/2;arc.rotation.z=.12*i;
      }
      for(let i=0;i<16;i++) addWorldCrystal(-320+(i%8)*90,6+(i%3)*5,-350+Math.floor(i/8)*250,8+(i%4)*4,0x9aeaf0);particleCloud(0xd8f1ff,200,70,310,1.2); break;
    case 'celestial':
      for(let i=0;i<17;i++){
        const x=-320+(i%6)*125,z=-350+Math.floor(i/6)*220,h=55+(i*17%70);
        cylinder(x,h/2,z,6+(i%3)*2,13,h,[0x547eaa,0x536b9d,0x557e91][i%3],7,.4);
        sphere(x,h+7,z,10,0x8feaff,1,1.5,1);
      }
      for(let i=0;i<5;i++) addWorldBridge(-260+i*130, -250+(i%2)*420,0x6c8cae,0x68eaff); break;
    case 'nebula':
      for(let i=0;i<18;i++){
        const x=-330+(i%6)*130,z=-350+Math.floor(i/6)*220,y=55+(i%4)*45;
        sphere(x,y,z,28+(i%4)*9,[0x6c3f9a,0x3c5da4,0x993f85,0x405fa8][i%4],1.8,1.1,1.3);
      }
      for(let i=0;i<6;i++){const ring=put(new THREE.TorusGeometry(38+i*6,1.5,8,54),lightMat(i%2?0x9f6eff:0x5e9cff),-270+i*105,60+i*13,-310);ring.rotation.x=Math.PI/2;}
      particleCloud(0xdcaaff,300,15,310,1.7); break;
    case 'lunar':
      for(let i=0;i<13;i++){
        const x=-320+(i%5)*150,z=-340+Math.floor(i/5)*230,r=25+(i%4)*12;
        put(new THREE.TorusGeometry(r,.9,6,40),neutral(0x778294),x,.4,z,Math.PI/2);
        put(new THREE.CircleGeometry(r,24),neutral(0x858d9a),x,.02,z,-Math.PI/2);
      }
      for(let i=0;i<5;i++){const x=-270+i*135;put(new THREE.SphereGeometry(18,16,12,0,Math.PI*2,0,Math.PI/2),neutral(0xc7d0de,.38,.3),x,0,-320);box(x,18,-320,30,2,30,0x9aa9bc);}
      sphere(240,190,-380,38,0x3b79ca,1,1,1); break;
    case 'crystal':
      for(let i=0;i<42;i++){
        const x=-330+(i%7)*100,z=-350+Math.floor(i/7)*115,y=4+(i%4)*3;
        const col=[0x52dfdf,0x8a79ef,0x7ec9ff,0xd18bff][i%4];addWorldCrystal(x,y,z,6+(i%5)*2,col);
        if(i%3===0) addWorldCrystal(x+9,y+5,z+4,4+(i%3)*2,col);
      }
      break;
    case 'starfall':
      for(let i=0;i<17;i++){
        const x=-320+(i%6)*125,z=-350+Math.floor(i/6)*220,h=55+(i*23%95);
        cylinder(x,h/2,z,5,9,h,0x344a72,7);put(new THREE.OctahedronGeometry(11+(i%3)*3,0),lightMat(i%2?0x6c9fff:0xb2d5ff),x,h+10,z,0,.25,0,1,1.6,1);
      }
      for(let i=0;i<18;i++){const x=-340+i*38;const streak=box(x,100+(i%5)*25,-360+(i%4)*95,1.2,1.2,50,0xbad8ff,0x77aaff);streak.rotation.x=.6;streak.rotation.z=-.4;}
      particleCloud(0xe4edff,260,60,300,1.4); break;
    case 'cosmic':
      for(let i=0;i<10;i++){
        const x=-300+i*67,y=55+(i%4)*28,z=-300-(i%3)*25;
        const ring=put(new THREE.TorusGeometry(24+(i%3)*7,2.2,8,48),makeEmissiveMat(i%2?0xa96dff:0x59d8f4,i%2?0x6432cf:0x269acb,2.5),x,y,z,.4,i*.19,.1);
      }
      for(let i=0;i<12;i++) sphere(-300+(i%6)*120,60+(i%4)*45,-340+Math.floor(i/6)*260,24,[0x443d9d,0x386ca5,0x7d459e][i%3],1.6,1.2,1.1);
      particleCloud(0xbca9ff,320,15,310,1.5); break;
    case 'infinity':
      for(let i=0;i<7;i++){
        const gate=put(new THREE.TorusGeometry(48+i*13,3.1,10,72),makeEmissiveMat([0x54dff1,0x7f8dff,0xa26bff,0x5af0c8][i%4],[0x278bd8,0x4d52d8,0x6e35d4,0x1aa98c][i%4],2.6),-300+i*100,58+(i%3)*21,-300-(i%2)*32);
        gate.rotation.y=(i-3)*.12;
      }
      for(let i=0;i<14;i++){const x=-320+(i%7)*105,z=-340+Math.floor(i/7)*240; cylinder(x,40,z,10,22,80,0x385b87,7,.4);}
      particleCloud(0xc8f6ff,260,25,330,1.8); break;
    default:
      // Safety fallback: unique deterministic landmark set for any future event.
      mountainWall(new THREE.Color().setHSL(world.hue,.35,.38).getHex(),16,360,35,110);
      for(let i=0;i<24;i++) addWorldCrystal(-300+(i%6)*100,5+(i%4)*5,-320+Math.floor(i/6)*210,5+(i%4)*2,accent.getHex());
  }

  // Every world also has its own atmosphere particles when its biome calls for them;
  // the palette tint makes the background itself level-specific, not tier-only.
}

function addWorldTree(x, z, scale, crownColor, trunkColor = 0x66503b, crownShape = 'round') {
  const group = new THREE.Group();
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(.18 * scale, .34 * scale, 3.5 * scale, 7), makeMat(trunkColor));
  trunk.position.y = 1.75 * scale; group.add(trunk);
  const crownGeometry = crownShape === 'cone'
    ? new THREE.ConeGeometry(2.5 * scale, 5.2 * scale, 8)
    : new THREE.IcosahedronGeometry(2.45 * scale, 1);
  const crown = new THREE.Mesh(crownGeometry, makeMat(crownColor, .88));
  crown.position.y = 4.5 * scale; crown.scale.y = crownShape === 'round' ? 1.22 : 1; crown.castShadow = true; group.add(crown);
  group.position.set(x, 0, z); addEnvironmentMesh(group);
}

function addWorldBridge(x, z, color, glow = null) {
  const deckMat = makeMat(color, .58, .25);
  const railMat = glow ? makeEmissiveMat(glow, glow, 1.35, .3) : makeMat(0xe0e6ea, .42, .3);
  const deck = new THREE.Mesh(new THREE.BoxGeometry(68, 2.2, 12), deckMat);
  deck.position.set(x, 12, z); addEnvironmentMesh(deck);
  for (const side of [-1, 1]) {
    const rail = new THREE.Mesh(new THREE.BoxGeometry(68, 1.1, .55), railMat);
    rail.position.set(x, 13.5, z + side * 5.7); addEnvironmentMesh(rail);
    for (let i = 0; i < 5; i++) {
      const pylon = new THREE.Mesh(new THREE.BoxGeometry(1.1, 24, 1.1), deckMat);
      pylon.position.set(x - 29 + i * 14.5, 12, z + side * 5.5); addEnvironmentMesh(pylon);
    }
  }
  const arch = new THREE.Mesh(new THREE.TorusGeometry(18, .75, 8, 40, Math.PI), railMat);
  arch.position.set(x, 14, z); arch.rotation.z = Math.PI; addEnvironmentMesh(arch);
}

function addWorldWindTurbine(x, z, scale, color) {
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(.65 * scale, 1.05 * scale, 25 * scale, 8), makeMat(0xe2e7e5));
  pole.position.set(x, 12.5 * scale, z); addEnvironmentMesh(pole);
  const hub = new THREE.Mesh(new THREE.SphereGeometry(1.5 * scale, 10, 8), makeMat(0x78868a));
  hub.position.set(x, 25 * scale, z); addEnvironmentMesh(hub);
  for (let i = 0; i < 3; i++) {
    const blade = new THREE.Mesh(new THREE.BoxGeometry(.65 * scale, 12 * scale, .8 * scale), makeMat(color));
    blade.position.set(x, 25 * scale, z); blade.rotation.z = i * Math.PI * 2 / 3; addEnvironmentMesh(blade);
  }
}

function addWorldCrystal(x, y, z, scale, color) {
  const mat = makeEmissiveMat(color, color, 1.15, .22);
  const crystal = new THREE.Mesh(new THREE.OctahedronGeometry(scale, 0), mat);
  crystal.position.set(x, y, z); crystal.scale.y = 1.8; crystal.rotation.y = x * .013; crystal.castShadow = true; addEnvironmentMesh(crystal);
}


function setLevelEnvironment(level, force = false) {
  const safeLevel = Math.max(1, Math.min(MAX_LEVEL, Math.floor(level || 1)));
  if (!force && safeLevel === activeLevelNumber) return;
  const tierIndex = Math.min(6, Math.max(0, Math.floor((safeLevel - 1) / 10)));
  const theme = getLevelTheme(safeLevel);
  const variant = (safeLevel - 1) % 10;
  activeEnvironmentIndex = tierIndex;
  activeLevelNumber = safeLevel;
  activeTheme = theme;

  const skyColor = new THREE.Color(theme.sky);
  const eventTint = new THREE.Color().setHSL((LEVEL_WORLD_META[safeLevel - 1].hue + .04) % 1, .28, .68);
  skyColor.lerp(eventTint, .035 + (variant / 9) * .045);
  scene.background.copy(skyColor);
  scene.fog = new THREE.Fog(theme.fog, theme.fogNear, theme.fogFar - (variant >= 7 ? 38 : variant >= 4 ? 16 : 0));
  hemiLight.color.setHex(theme.hemiSky);
  hemiLight.groundColor.setHex(theme.hemiGround);
  hemiLight.intensity = theme.hemiIntensity * (variant >= 8 ? .94 : 1);
  sunLight.color.setHex(theme.sun);
  sunLight.intensity = theme.sunIntensity * (variant >= 8 ? .88 : variant >= 5 ? .95 : 1);
  sunLight.position.set(tierIndex===4?45:tierIndex===5?-55:-90, 150, tierIndex===2?-45:75);
  renderer.toneMappingExposure = theme.exposure + (variant >= 8 ? .025 : 0);

  // Rebuild both the full scenery and the circuit for every level, not just each tier.
  disposeGroup(environmentRoot);
  disposeGroup(trackRoot);
  createTrackCurve(safeLevel);
  addSkyEnvironment(theme, safeLevel);
  addTrack(theme);

  // Keep the showroom cars on the newly generated track when the player previews another event.
  if (player) {
    resetPlayer();
    opponents.forEach((ai, i) => {
      ai.progress = .014 + i * .007;
      ai.prev = ai.progress;
      setCarAtProgress(ai.mesh, ai.progress, ai.lane);
    });
  }
}

function createTrackCurve(level = 1) {
  const world = LEVEL_WORLD_META[Math.max(0, Math.min(MAX_LEVEL - 1, level - 1))];
  const layout = world.layout;
  const variant = layout % 10;
  const tier = Math.floor(layout / 10);
  const count = 12 + (variant % 3) * 2;
  const phase = (layout + 1) * .317;
  const pts = [];
  for (let i = 0; i < count; i++) {
    const angle = -Math.PI / 2 + (i / count) * Math.PI * 2;
    const waveA = Math.sin(angle * (2 + (variant % 4)) + phase) * (.075 + (variant % 3) * .012);
    const waveB = Math.cos(angle * (3 + (tier % 3)) - phase * 1.3) * (.045 + (variant % 4) * .009);
    const waveC = Math.sin(angle * 5 + phase * .7) * (.025 + (tier % 2) * .012);
    const radius = 1 + waveA + waveB + waveC;
    const rx = 112 + (variant % 4) * 5 + tier * 1.4;
    const rz = 100 + ((variant + 2) % 5) * 4 + tier * 1.1;
    const x = Math.cos(angle) * rx * radius + Math.sin(angle * 2 + phase) * (variant % 3) * 4;
    const z = Math.sin(angle) * rz * radius + Math.cos(angle * 3 - phase) * (variant % 4) * 3;
    pts.push(new THREE.Vector3(x, 0, z));
  }
  curve = new THREE.CatmullRomCurve3(pts, true, 'catmullrom', .28 + (variant % 4) * .025);
  curve.closed = true;
  trackSamples = [];
  for (let i = 0; i <= SAMPLE_COUNT; i++) {
    const u = i / SAMPLE_COUNT;
    const p = curve.getPointAt(u);
    const tangent = curve.getTangentAt(u).normalize();
    const side = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();
    trackSamples.push({ u, p, tangent, side });
  }
}

function makeRibbon(name, innerOffset, outerOffset, y, material) {
  const positions = [], indices = [];
  for (let i = 0; i <= SAMPLE_COUNT; i++) {
    const s = trackSamples[i];
    const a = s.p.clone().addScaledVector(s.side, innerOffset); a.y = y;
    const b = s.p.clone().addScaledVector(s.side, outerOffset); b.y = y;
    positions.push(a.x,a.y,a.z,b.x,b.y,b.z);
    if (i < SAMPLE_COUNT) {
      const k = i * 2;
      indices.push(k, k + 2, k + 1, k + 1, k + 2, k + 3);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  g.setIndex(indices); g.computeVertexNormals();
  const mesh = new THREE.Mesh(g, material); mesh.name = name; mesh.receiveShadow = true; addTrackMesh(mesh);
  return mesh;
}

function addTrack(theme = ENVIRONMENTS[0]) {
  const roadMat=new THREE.MeshStandardMaterial({color:theme.road,roughness:theme.tier==='ELITE'?.42:.9,metalness:theme.tier==='ELITE'?.3:.04,side:THREE.DoubleSide});
  makeRibbon('asphalt',-HALF_ROAD,HALF_ROAD,.015,roadMat);
  makeRibbon('left-verge',-HALF_ROAD-4,-HALF_ROAD,.005,makeMat(theme.verge));
  makeRibbon('right-verge',HALF_ROAD,HALF_ROAD+4,.005,makeMat(theme.verge));
  makeRibbon('left-line',-HALF_ROAD+.5,-HALF_ROAD+.82,.055,makeMat(theme.line));
  makeRibbon('right-line',HALF_ROAD-.82,HALF_ROAD-.5,.055,makeMat(theme.line));
  const dashMat=makeMat(theme.line);
  for(let i=0;i<SAMPLE_COUNT;i+=18){
    const s=trackSamples[i],yaw=Math.atan2(s.tangent.x,-s.tangent.z);
    const dash=new THREE.Mesh(new THREE.BoxGeometry(.18,.035,4.2),dashMat);
    dash.position.copy(s.p);dash.position.y=.075;dash.rotation.y=yaw;addTrackMesh(dash);
  }
  const curbA=makeMat(theme.curbA),curbB=makeMat(theme.curbB),barrierMat=makeMat(theme.barrier,.5,.18);
  const glowStripe=(theme.tier==='ELITE'||theme.tier==='LEGEND')?makeEmissiveMat(theme.curbB,theme.curbB,1.6,.3):null;
  for(let i=0;i<SAMPLE_COUNT;i+=7){
    const s=trackSamples[i],yaw=Math.atan2(s.tangent.x,-s.tangent.z);
    for(const sign of [-1,1]){
      const curb=new THREE.Mesh(new THREE.BoxGeometry(1.4,.12,3.2),(Math.floor(i/7)%2)?curbA:curbB);
      curb.position.copy(s.p).addScaledVector(s.side,sign*(HALF_ROAD-.45));curb.position.y=.09;curb.rotation.y=yaw;addTrackMesh(curb);
      if(i%35===0){
        const wall=new THREE.Mesh(new THREE.BoxGeometry(1.3,1.05,8.5),barrierMat);
        wall.position.copy(s.p).addScaledVector(s.side,sign*(HALF_ROAD+2.3));wall.position.y=.57;wall.rotation.y=yaw;wall.castShadow=true;wall.receiveShadow=true;addTrackMesh(wall);
        const stripe=new THREE.Mesh(new THREE.BoxGeometry(1.31,.22,8.52),glowStripe||((Math.floor(i/35)%2)?curbA:curbB));
        stripe.position.copy(wall.position);stripe.position.y+=.31;stripe.rotation.y=yaw;addTrackMesh(stripe);
      }
    }
  }
  const start=trackSamples[0],tileCount=16;
  for(let i=0;i<tileCount;i++){
    const tile=new THREE.Mesh(new THREE.BoxGeometry(ROAD_WIDTH/tileCount,.035,2.3),((i+Math.floor(i/2))%2)?makeMat(0xffffff):makeMat(0x111820));
    tile.position.copy(start.p).addScaledVector(start.side,-HALF_ROAD+(i+.5)*ROAD_WIDTH/tileCount);
    tile.position.y=.085;tile.rotation.y=Math.atan2(start.tangent.x,-start.tangent.z);addTrackMesh(tile);
  }
}

function createCar(colorHex, isPlayer=false) {
  const root = new THREE.Group();
  const paint = new THREE.MeshStandardMaterial({ color: colorHex, metalness: .72, roughness: .27 });
  const dark = makeMat(0x101820,.35,.15), glass = new THREE.MeshPhysicalMaterial({ color:0x172d3d, metalness:.45, roughness:.14, transparent:true, opacity:.88 });
  const rubber = makeMat(0x111214, .96), rim = makeMat(0xb9c7cb,.24,.82);

  const chassis = new THREE.Mesh(new THREE.BoxGeometry(2.25,.62,4.55),paint);
  chassis.position.y=.88; chassis.castShadow=true; root.add(chassis);
  const hood = new THREE.Mesh(new THREE.BoxGeometry(2.12,.27,1.18),paint);
  hood.position.set(0,1.18,-1.52); hood.castShadow=true; root.add(hood);
  const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.72,.78,1.9),glass);
  cabin.position.set(0,1.47,.08); cabin.castShadow=true; root.add(cabin);
  const roof = new THREE.Mesh(new THREE.BoxGeometry(1.66,.12,1.48),paint);
  roof.position.set(0,1.89,.13); root.add(roof);
  const frontBumper = new THREE.Mesh(new THREE.BoxGeometry(2.22,.22,.18),dark); frontBumper.position.set(0,.62,-2.28); root.add(frontBumper);
  const rearBumper = new THREE.Mesh(new THREE.BoxGeometry(2.22,.22,.18),dark); rearBumper.position.set(0,.62,2.28); root.add(rearBumper);
  const splitter = new THREE.Mesh(new THREE.BoxGeometry(2.35,.09,.38),dark); splitter.position.set(0,.48,-2.31); root.add(splitter);
  const spoilerBar = new THREE.Mesh(new THREE.BoxGeometry(2,.12,.25),dark); spoilerBar.position.set(0,1.62,2.05); root.add(spoilerBar);
  for(const x of [-.78,.78]){
    const support = new THREE.Mesh(new THREE.BoxGeometry(.09,.48,.1),dark); support.position.set(x,1.39,2.02); root.add(support);
  }
  const headMat = new THREE.MeshBasicMaterial({color:0xe9f6ff});
  const tailMat = new THREE.MeshBasicMaterial({color:0xff2828});
  for(const x of [-.78,.78]){
    const head = new THREE.Mesh(new THREE.BoxGeometry(.42,.12,.08),headMat); head.position.set(x,.99,-2.29); root.add(head);
    const tail = new THREE.Mesh(new THREE.BoxGeometry(.42,.15,.08),tailMat); tail.position.set(x,.98,2.29); root.add(tail);
  }
  const wheels=[];
  for(const x of [-1.12,1.12]) for(const z of [-1.48,1.48]){
    const pivot = new THREE.Group(); pivot.position.set(x,.56,z); root.add(pivot);
    const tire = new THREE.Mesh(new THREE.CylinderGeometry(.48,.48,.32,18),rubber);
    tire.rotation.z=Math.PI/2; tire.castShadow=true; pivot.add(tire);
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(.245,.245,.34,12),rim); hub.rotation.z=Math.PI/2; pivot.add(hub);
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(.10,.10,.35,12),dark); cap.rotation.z=Math.PI/2; pivot.add(cap);
    wheels.push({pivot,tire,front:z<0});
  }
  root.userData.wheels=wheels;
  root.userData.isPlayer=isPlayer;
  root.scale.setScalar(isPlayer?1.03:.96);
  scene.add(root);
  return root;
}

function buildCars() {
  player = createCar(0xc5ff3d,true);
  player.position.y=0;
  const colors=[0xe94b45,0x2787d8,0xf1f1ed,0xf29c38];
  opponents=[];
  for(let i=0;i<4;i++){
    const car=createCar(colors[i],false);
    const baseSpeed = 47 + Math.random() * 7;
    const driverNames = ['NOVA', 'BLAZE', 'STORM', 'VIPER'];
    const carNames = ['Falcon GT', 'Vector R', 'Aero S', 'Phantom X'];
    opponents.push({mesh:car, name:driverNames[i], carName:carNames[i], progress:.015+i*.007, speed:baseSpeed, baseSpeed, lane:(i%2===0?1:-1)*(2.1+(i%3)*.35), laps:0, prev:.015+i*.007});
  }
  resetPlayer();
}

function resetPlayer() {
  const s=curve.getPointAt(.004), tangent=curve.getTangentAt(.004).normalize();
  playerState.yaw=Math.atan2(tangent.x,-tangent.z);
  playerState.velocity.set(0,0,0); playerState.speed=0; playerState.steer=0; playerState.steerAngle=0;
  player.position.set(s.x,.02,s.z+5.2); player.rotation.y=-playerState.yaw; player.rotation.z=0;
  playerProgress=0; prevProgress=0; nitro=100; gear=1;
}

function nearestTrackInfo(position) {
  let best=Infinity, bestIndex=0;
  // Coarse search over the precomputed centre line is fast enough for this small circuit.
  for(let i=0;i<SAMPLE_COUNT;i+=2){
    const dx=position.x-trackSamples[i].p.x, dz=position.z-trackSamples[i].p.z;
    const d=dx*dx+dz*dz;
    if(d<best){best=d;bestIndex=i;}
  }
  // Refine around the best sample.
  for(let j=-2;j<=2;j++){
    const i=(bestIndex+j+SAMPLE_COUNT)%SAMPLE_COUNT, s=trackSamples[i];
    const dx=position.x-s.p.x,dz=position.z-s.p.z,d=dx*dx+dz*dz;
    if(d<best){best=d;bestIndex=i;}
  }
  const sample=trackSamples[bestIndex];
  const delta=new THREE.Vector3(position.x-sample.p.x,0,position.z-sample.p.z);
  return {progress:bestIndex/SAMPLE_COUNT,distance:Math.sqrt(best),lateral:delta.dot(sample.side),sample};
}

function setCarAtProgress(mesh, progress, lateral=0) {
  const p=curve.getPointAt((progress%1+1)%1);
  const t=curve.getTangentAt((progress%1+1)%1).normalize();
  const side=new THREE.Vector3(-t.z,0,t.x).normalize();
  mesh.position.copy(p).addScaledVector(side,lateral); mesh.position.y=.02;
  mesh.rotation.y=-Math.atan2(t.x,-t.z);
}

function updateOpponents(dt) {
  for(const ai of opponents){
    if(raceStarted && !paused && !gameOver){
      ai.progress += (ai.speed/curve.getLength())*dt;
      if(ai.progress>=1){ai.progress-=1;ai.laps++;}
    }
    const target=curve.getPointAt(ai.progress%1);
    const tangent=curve.getTangentAt(ai.progress%1).normalize();
    const side=new THREE.Vector3(-tangent.z,0,tangent.x).normalize();
    const desired=target.addScaledVector(side,ai.lane);
    ai.mesh.position.lerp(desired,clamp(dt*7,0,1));
    ai.mesh.position.y=.02;
    ai.mesh.rotation.y=-Math.atan2(tangent.x,-tangent.z);
    const wheels=ai.mesh.userData.wheels;
    for(const w of wheels) w.tire.rotation.x-=ai.speed*dt*1.7;
  }
}

function updatePlayer(dt) {
  // The car model points along local -Z. The physics heading uses +X as
  // positive steering, so the rendered model uses the opposite Y rotation.
  const forward = new THREE.Vector3(Math.sin(playerState.yaw), 0, -Math.cos(playerState.yaw));
  const right = new THREE.Vector3(Math.cos(playerState.yaw), 0, Math.sin(playerState.yaw));

  const throttle = keys.has('ArrowUp') || keys.has('KeyW');
  const brake = keys.has('ArrowDown') || keys.has('KeyS');
  const handbrake = keys.has('Space');
  const steerInput = (keys.has('ArrowRight') || keys.has('KeyD') ? 1 : 0)
    - (keys.has('ArrowLeft') || keys.has('KeyA') ? 1 : 0);
  const boost = (keys.has('ShiftLeft') || keys.has('ShiftRight')) && nitro > 0 && throttle;

  const trackBefore = nearestTrackInfo(player.position);
  const onRoad = trackBefore.distance <= HALF_ROAD + 1.25;
  playerState.onRoad = onRoad;

  if (raceStarted && !paused && !gameOver) {
    // Resolve velocity into the car's forward and sideways axes.
    let forwardSpeed = playerState.velocity.dot(forward);
    let lateralSpeed = playerState.velocity.dot(right);

    // Sports-car acceleration with a gentle power fall-off near top speed.
    const normalTopSpeed = onRoad ? 72 : 25; // m/s: about 259 km/h on tarmac
    const topSpeed = boost && onRoad ? 81 : normalTopSpeed;
    if (throttle) {
      const speedRatio = clamp(Math.max(forwardSpeed, 0) / topSpeed, 0, 1);
      const engineAcceleration = 15.5 * (1 - 0.52 * speedRatio);
      forwardSpeed += engineAcceleration * dt;
    }

    // Brake pedal first slows the car to a stop, then engages reverse.
    if (brake) {
      if (forwardSpeed > 0.35) {
        forwardSpeed = Math.max(0, forwardSpeed - 27 * dt);
      } else {
        forwardSpeed = Math.max(-13, forwardSpeed - 8.5 * dt);
      }
    } else if (!throttle) {
      // Rolling resistance and aerodynamic drag when the accelerator is released.
      const rollingResistance = onRoad ? 0.52 : 2.2;
      const aeroCoefficient = onRoad ? 0.00072 : 0.0020;
      const dragAcceleration = rollingResistance + aeroCoefficient * forwardSpeed * forwardSpeed;
      forwardSpeed = moveTowards(forwardSpeed, 0, dragAcceleration * dt);
    }

    if (handbrake) {
      // A handbrake initiates a controllable rear slide; it is not the foot brake.
      forwardSpeed = moveTowards(forwardSpeed, 0, 4.5 * dt);
    }

    if (boost) {
      forwardSpeed += 7.5 * dt;
      nitro = Math.max(0, nitro - 23 * dt);
    } else {
      nitro = Math.min(100, nitro + 5 * dt);
    }

    // Gradually limit speed rather than snapping the car down to the road limit.
    forwardSpeed = clamp(forwardSpeed, -13, 86);
    if (forwardSpeed > topSpeed) {
      forwardSpeed = moveTowards(forwardSpeed, topSpeed, (onRoad ? 9 : 24) * dt);
    }

    // Steering self-centres smoothly and becomes less sensitive at high speed.
    const speedRatio = clamp(Math.abs(forwardSpeed) / 72, 0, 1);
    const maxSteeringAngle = lerp(0.56, 0.245, speedRatio);
    const steeringTarget = steerInput * maxSteeringAngle;
    const steeringResponse = steerInput === 0 ? 8.5 : 5.5;
    playerState.steerAngle = lerp(
      playerState.steerAngle,
      steeringTarget,
      1 - Math.exp(-steeringResponse * dt)
    );

    // Bicycle-model yaw: steering only turns the car when it has some speed.
    const wheelbase = 2.85;
    let yawRate = (forwardSpeed / wheelbase) * Math.tan(playerState.steerAngle) * 0.62;
    yawRate = clamp(yawRate, -1.9, 1.9);
    if (handbrake) yawRate *= 1.12;
    playerState.yaw += yawRate * dt;

    // Tyre grip removes side-slip. Holding Space deliberately lowers rear grip.
    const lateralGrip = onRoad
      ? (handbrake ? 1.65 : 9.5)
      : (handbrake ? 0.75 : 2.35);
    lateralSpeed *= Math.exp(-lateralGrip * dt);

    const newForward = new THREE.Vector3(Math.sin(playerState.yaw), 0, -Math.cos(playerState.yaw));
    const newRight = new THREE.Vector3(Math.cos(playerState.yaw), 0, Math.sin(playerState.yaw));
    playerState.velocity.copy(newForward).multiplyScalar(forwardSpeed)
      .addScaledVector(newRight, lateralSpeed);

    // Off-road terrain costs grip and speed, but does not apply an artificial
    // sideways teleport/push that would make steering feel unpredictable.
    const speedBeforeMove = Math.abs(forwardSpeed);
    player.position.addScaledVector(playerState.velocity, dt);
    player.position.y = 0.02;
    player.rotation.y = -playerState.yaw;
    player.rotation.z = -playerState.steerAngle * clamp(speedBeforeMove / 55, 0, 1) * 0.10;

    const updated = nearestTrackInfo(player.position);
    if (updated.distance > HALF_ROAD + 1.0) {
      // A light slowdown on the verge helps the player recover naturally.
      playerState.velocity.multiplyScalar(Math.exp(-0.22 * dt));
    }

    // Recover only when the car is genuinely far away from the circuit.
    if (updated.distance > 85) {
      const recoveryPoint = curve.getPointAt(updated.progress);
      player.position.set(recoveryPoint.x, 0.02, recoveryPoint.z);
      playerState.velocity.multiplyScalar(0.18);
      showToast('BACK ON THE CIRCUIT');
    }

    // Soft vehicle contact: separate overlapping cars and bleed off a little speed.
    for (const ai of opponents) {
      const distance = player.position.distanceTo(ai.mesh.position);
      if (distance < 3.25) {
        const away = player.position.clone().sub(ai.mesh.position);
        away.y = 0;
        if (away.lengthSq() < 0.001) away.set(1, 0, 0);
        away.normalize();
        player.position.addScaledVector(away, (3.25 - distance) * 0.7);
        playerState.velocity.multiplyScalar(0.90);
        const now=performance.now();
        if(now-lastImpactSoundAt>550){lastImpactSoundAt=now;playSoundCue('impact');}
      }
    }
    updateLapProgress(updated.progress);
    playerState.speed = playerState.velocity.dot(newForward);
  }

  const speedKmh = Math.max(0, Math.round(Math.abs(playerState.speed) * 3.6));
  ui.speed.textContent = String(speedKmh).padStart(3, '0');
  gear = Math.max(1, Math.min(6, Math.floor(speedKmh / 48) + 1));
  if(raceStarted && gear!==audioLastGear && playerState.speed>5){playSoundCue('gear');}
  audioLastGear=gear;
  ui.gear.textContent = playerState.speed < -0.8 ? 'R' : String(gear);
  const rpm = 1200 + (speedKmh / 300) * 5900;
  ui.rpm.style.width = `${clamp((rpm - 1000) / 6200 * 100, 8, 100)}%`;
  ui.rpmLabel.textContent = `RPM ${Math.round(rpm).toLocaleString('en-US')}`;
  ui.nitro.style.width = `${nitro}%`;
  ui.nitroLabel.textContent = `${Math.round(nitro)}%`;

  player.userData.wheels.forEach(w => {
    if (w.front) w.pivot.rotation.y = -playerState.steerAngle;
    w.tire.rotation.x -= playerState.speed * dt * 1.7;
  });
  playerState.steer = steerInput;
}
function updateLapProgress(progress) {
  playerProgress=progress;
  if(prevProgress>.88 && progress<.12 && raceTime>5){
    const lapDuration=raceTime-lapStartTime;
    if(lapDuration>10){bestLap=Math.min(bestLap,lapDuration);ui.bestTime.textContent=fmtTime(bestLap);}
    lapCount++;
    lapStartTime=raceTime;
    ui.lap.textContent=`${Math.min(lapCount+1,TOTAL_LAPS)} / ${TOTAL_LAPS}`;
    showToast(lapCount>=TOTAL_LAPS?'CHEQUERED FLAG':'LAP COMPLETE');
    playSoundCue('lap');
    if(lapCount>=TOTAL_LAPS) finishRace();
  }
  prevProgress=progress;
}

function updateRaceStats() {
  const standings=[{score:lapCount+playerProgress,player:true}];
  for(const ai of opponents) standings.push({score:ai.laps+ai.progress,player:false});
  standings.sort((a,b)=>b.score-a.score);
  const place=standings.findIndex(s=>s.player)+1;
  const suffix=place===1?'ST':place===2?'ND':place===3?'RD':'TH';
  ui.position.innerHTML=`${place}<span>${suffix}</span>`;
  ui.lapTime.textContent=fmtTime(raceTime-lapStartTime);
}

function updateCamera(dt) {
  const forward=new THREE.Vector3(Math.sin(playerState.yaw),0,-Math.cos(playerState.yaw));
  let desired, look;
  if(cameraMode===0){
    desired=player.position.clone().addScaledVector(forward,-11.5); desired.y+=5.2;
    look=player.position.clone().addScaledVector(forward,7); look.y+=1.25;
  }else{
    desired=player.position.clone().addScaledVector(forward,1.8); desired.y+=2.55;
    look=player.position.clone().addScaledVector(forward,25); look.y+=1.7;
  }
  camera.position.lerp(desired,1-Math.exp(-dt*4.6));
  const target=new THREE.Vector3(); camera.getWorldDirection(target);
  camera.lookAt(look);
}

function drawMinimap() {
  const canvas=$('minimap'),ctx=canvas.getContext('2d');
  const w=canvas.width,h=canvas.height;ctx.clearRect(0,0,w,h);
  const xs=trackSamples.map(s=>s.p.x),zs=trackSamples.map(s=>s.p.z);
  const minX=Math.min(...xs)-22,maxX=Math.max(...xs)+22,minZ=Math.min(...zs)-22,maxZ=Math.max(...zs)+22;
  const scale=Math.min((w-24)/(maxX-minX),(h-24)/(maxZ-minZ));
  const toXY=p=>({x:12+(p.x-minX)*scale,y:12+(p.z-minZ)*scale});
  ctx.beginPath();trackSamples.forEach((s,i)=>{const p=toXY(s.p);if(i===0)ctx.moveTo(p.x,p.y);else ctx.lineTo(p.x,p.y);});
  ctx.closePath();ctx.lineWidth=9;ctx.strokeStyle='rgba(255,255,255,.2)';ctx.stroke();
  ctx.lineWidth=5;ctx.strokeStyle='#c5ff3d';ctx.stroke();
  for(const ai of opponents){const p=toXY(ai.mesh.position);ctx.beginPath();ctx.arc(p.x,p.y,3.4,0,Math.PI*2);ctx.fillStyle='#f06b52';ctx.fill();}
  const pp=toXY(player.position);ctx.save();ctx.translate(pp.x,pp.y);ctx.rotate(playerState.yaw);ctx.beginPath();ctx.moveTo(0,-7);ctx.lineTo(4.5,5);ctx.lineTo(-4.5,5);ctx.closePath();ctx.fillStyle='#ffffff';ctx.fill();ctx.restore();
}

function showToast(message) {
  ui.toast.textContent=message;ui.toast.classList.add('show');toastTimer=1.6;
}

function startCountdown() {
  countdownActive=true;countdownStart=performance.now();ui.countdown.classList.remove('hidden');
  const tick=()=>{
    if(!countdownActive)return;
    const elapsed=(performance.now()-countdownStart)/1000;
    const n=3-Math.floor(elapsed);
    if(elapsed<3){
      ui.countdown.textContent=String(Math.max(1,n));
      if(n!==lastCountdownCue){lastCountdownCue=n;playSoundCue('countdown');}
      requestAnimationFrame(tick);
    }
    else if(elapsed<3.7){
      ui.countdown.textContent='GO!';
      if(lastCountdownCue!==0){lastCountdownCue=0;playSoundCue('go');}
      raceStarted=true;raceTime=0;lapStartTime=0;requestAnimationFrame(tick);
    }
    else{countdownActive=false;ui.countdown.classList.add('hidden');}
  };tick();
}

function getFinalStandings() {
  const rows = [{
    name: 'YOU', carName: 'APEX RS', isPlayer: true,
    score: lapCount + playerProgress, laps: lapCount, progress: playerProgress,
    speed: Math.round(Math.abs(playerState.speed) * 3.6)
  }];
  for (const ai of opponents) {
    rows.push({
      name: ai.name, carName: ai.carName, isPlayer: false,
      score: ai.laps + ai.progress, laps: ai.laps, progress: ai.progress,
      speed: Math.round(ai.speed * 3.6)
    });
  }
  rows.sort((a, b) => b.score - a.score);
  rows.forEach((row, index) => { row.position = index + 1; });
  return rows;
}

function renderFinalStandings(standings) {
  ui.resultsBody.innerHTML = standings.map(row => {
    const lapText = row.laps >= TOTAL_LAPS
      ? `${TOTAL_LAPS} / ${TOTAL_LAPS}`
      : `${Math.min(row.laps + 1, TOTAL_LAPS)} / ${TOTAL_LAPS} · ${Math.floor(row.progress * 100)}%`;
    const status = row.laps >= TOTAL_LAPS ? 'FINISHED' : 'ON TRACK';
    const rankClass = row.position === 1 ? 'rank-gold' : row.position === 2 ? 'rank-silver' : row.position === 3 ? 'rank-bronze' : '';
    return `<tr class="${row.isPlayer ? 'player-row' : ''}">
      <td><span class="rank-pill ${rankClass}">P${row.position}</span></td>
      <td><strong>${row.name}${row.isPlayer ? ' (YOU)' : ''}</strong><small>${row.carName}</small></td>
      <td>${lapText}</td>
      <td><span class="status-text ${row.laps >= TOTAL_LAPS ? 'finished' : ''}">${status}</span></td>
    </tr>`;
  }).join('');
}

function startRace() {
  activateAudio();
  currentLevel = selectedLevel;
  setLevelEnvironment(currentLevel);
  ui.start.classList.add('hidden');ui.pause.classList.add('hidden');ui.finish.classList.add('hidden');
  ui.hud.classList.remove('hidden');
  ui.sessionLabel.textContent = `LEVEL ${currentLevel} · ${TOTAL_LAPS} LAPS`;
  paused=false;gameOver=false;raceStarted=false;raceTime=0;lapStartTime=0;lapCount=0;bestLap=Infinity;audioLastGear=1;
  ui.lap.textContent=`1 / ${TOTAL_LAPS}`;ui.bestTime.textContent='--:--.---';ui.position.innerHTML='1<span>ST</span>';
  resetPlayer();
  const levelBonus = (currentLevel - 1) * 0.24;
  opponents.forEach((ai,i)=>{
    ai.progress=.014+i*.007;ai.prev=ai.progress;ai.laps=0;
    ai.speed=ai.baseSpeed+levelBonus;
    setCarAtProgress(ai.mesh,ai.progress,ai.lane);
  });
  keys.clear();startCountdown();
}

function finishRace() {
  if(gameOver)return;
  gameOver=true;raceStarted=false;
  const standings = getFinalStandings();
  const playerResult = standings.find(row => row.isPlayer);
  const position = playerResult.position;
  const qualified = position <= 3;
  playSoundCue(qualified ? 'victory' : 'defeat');
  if (qualified) {
    const key = String(currentLevel);
    const previousBest = Number(career.completedLevels[key]) || position;
    career.completedLevels[key] = Math.min(previousBest, position);
    if (currentLevel < MAX_LEVEL) career.unlockedLevel = Math.max(career.unlockedLevel, currentLevel + 1);
    saveCareerProgress();
  }

  ui.finishTitle.innerHTML = position === 1
    ? 'RACE<br /><em>VICTORY.</em>'
    : qualified ? 'PODIUM<br /><em>FINISH.</em>' : 'RACE<br /><em>COMPLETE.</em>';
  let message;
  if (qualified && currentLevel === MAX_LEVEL) {
    message = `P${position} finish! You completed all 70 APEX RACING levels. Championship conquered!`;
  } else if (qualified) {
    message = `P${position} finish! Level ${currentLevel + 1} is now unlocked.`;
  } else if (currentLevel === MAX_LEVEL) {
    message = `You finished P${position}. A top-3 finish is required to complete the 70-level championship. Replay the final level and try again.`;
  } else {
    message = `You finished P${position}. A top-3 finish is required to unlock Level ${currentLevel + 1}. Replay this level and try again.`;
  }
  ui.finishMessage.textContent = message;
  ui.finishBest.textContent=fmtTime(bestLap);
  renderFinalStandings(standings);

  const hasNextLevel = qualified && currentLevel < MAX_LEVEL;
  ui.nextLevelBtn.classList.toggle('hidden', !hasNextLevel);
  ui.nextLevelBtn.textContent = hasNextLevel ? `NEXT LEVEL ${currentLevel + 1}  →` : 'CHAMPIONSHIP COMPLETE';
  $('race-again-btn').textContent = 'RETRY THIS LEVEL';
  setTimeout(()=>ui.finish.classList.remove('hidden'),600);
}

function returnToLevelSelect() {
  selectedLevel = currentLevel;
  ui.finish.classList.add('hidden');
  ui.pause.classList.add('hidden');
  ui.hud.classList.add('hidden');
  ui.start.classList.remove('hidden');
  gameOver = true;
  renderCareerMenu();
}

function togglePause(force) {
  if(!raceStarted||gameOver||countdownActive)return;
  paused=typeof force==='boolean'?force:!paused;
  ui.pause.classList.toggle('hidden',!paused);
  keys.clear();
}

function loadSoundPreferences() {
  try {
    const saved=JSON.parse(localStorage.getItem(SOUND_STORAGE_KEY)||'null');
    return {
      enabled: saved && typeof saved.enabled==='boolean' ? saved.enabled : true,
      volume: saved && Number.isFinite(Number(saved.volume)) ? Math.min(1,Math.max(0,Number(saved.volume))) : 0.68
    };
  } catch { return {enabled:true,volume:0.68}; }
}

function saveSoundPreferences() {
  try { localStorage.setItem(SOUND_STORAGE_KEY,JSON.stringify({enabled:audioEnabled,volume:audioVolume})); }
  catch { /* sound remains available for this session if storage is disabled */ }
}

function updateSoundControls() {
  const toggle=$('sound-toggle'),label=$('sound-label'),icon=$('sound-icon'),slider=$('sound-volume');
  if(!toggle)return;
  toggle.setAttribute('aria-pressed',String(audioEnabled));
  toggle.setAttribute('aria-label',audioEnabled?'Turn game sound off':'Turn game sound on');
  if(label)label.textContent=audioEnabled?'SOUND ON':'SOUND OFF';
  if(icon)icon.textContent=audioEnabled?'♫':'♪̸';
  if(slider)slider.value=String(Math.round(audioVolume*100));
}

function setAudioParam(param,value,timeConstant=0.055) {
  if(!param||!audioContext)return;
  const now=audioContext.currentTime;
  try { param.setTargetAtTime(Math.max(0,value),now,timeConstant); }
  catch { param.value=Math.max(0,value); }
}

function activateAudio() {
  // Web Audio is created only after a real user gesture, as required by browsers.
  try {
    if(!audioContext){
      const AudioContextClass=window.AudioContext||window.webkitAudioContext;
      if(!AudioContextClass)return;
      audioContext=new AudioContextClass();
    }
    if(audioContext.state==='suspended')audioContext.resume();
    if(!audioInitialized){
      masterGain=audioContext.createGain();
      masterGain.gain.value=audioEnabled?audioVolume:0;
      masterGain.connect(audioContext.destination);

      engineFilter=audioContext.createBiquadFilter();
      engineFilter.type='lowpass';engineFilter.frequency.value=1250;engineFilter.Q.value=.65;
      engineGain=audioContext.createGain();engineGain.gain.value=0;
      engineOscillator=audioContext.createOscillator();engineOscillator.type='sawtooth';engineOscillator.frequency.value=42;
      engineHarmonic=audioContext.createOscillator();engineHarmonic.type='triangle';engineHarmonic.frequency.value=84;
      const harmonicGain=audioContext.createGain();harmonicGain.gain.value=.22;
      engineOscillator.connect(engineFilter);engineHarmonic.connect(harmonicGain);harmonicGain.connect(engineFilter);
      engineFilter.connect(engineGain);engineGain.connect(masterGain);
      engineOscillator.start();engineHarmonic.start();

      // A looping noise bed is shaped into tyre scrub and rushing air.
      const buffer=audioContext.createBuffer(1,audioContext.sampleRate*2,audioContext.sampleRate);
      const data=buffer.getChannelData(0);
      for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1)*.55;
      const noise=audioContext.createBufferSource();noise.buffer=buffer;noise.loop=true;
      tireNoiseFilter=audioContext.createBiquadFilter();tireNoiseFilter.type='bandpass';tireNoiseFilter.frequency.value=1150;tireNoiseFilter.Q.value=.55;
      tireNoiseGain=audioContext.createGain();tireNoiseGain.gain.value=0;
      windNoiseFilter=audioContext.createBiquadFilter();windNoiseFilter.type='lowpass';windNoiseFilter.frequency.value=620;
      windNoiseGain=audioContext.createGain();windNoiseGain.gain.value=0;
      noise.connect(tireNoiseFilter);tireNoiseFilter.connect(tireNoiseGain);tireNoiseGain.connect(masterGain);
      noise.connect(windNoiseFilter);windNoiseFilter.connect(windNoiseGain);windNoiseGain.connect(masterGain);
      noise.start();
      audioInitialized=true;
    }
    setAudioParam(masterGain.gain,audioEnabled?audioVolume:0,.035);
  } catch(err) {
    console.warn('Game audio could not be initialized:',err);
  }
}

function setSoundEnabled(enabled) {
  audioEnabled=Boolean(enabled);
  if(audioEnabled)activateAudio();
  if(masterGain&&audioContext)setAudioParam(masterGain.gain,audioEnabled?audioVolume:0,.035);
  saveSoundPreferences();updateSoundControls();
}

function playSoundCue(kind) {
  if(!audioEnabled)return;
  activateAudio();
  if(!audioContext||!masterGain)return;
  const ctx=audioContext;
  const tone=(frequency,endFrequency,duration,wave='sine',when=0,gainLevel=.16)=>{
    const osc=ctx.createOscillator(),gain=ctx.createGain();
    const start=ctx.currentTime+when,stop=start+duration;
    osc.type=wave;osc.frequency.setValueAtTime(frequency,start);
    osc.frequency.exponentialRampToValueAtTime(Math.max(25,endFrequency),stop);
    gain.gain.setValueAtTime(.0001,start);gain.gain.exponentialRampToValueAtTime(gainLevel,start+.012);
    gain.gain.exponentialRampToValueAtTime(.0001,stop);
    osc.connect(gain);gain.connect(masterGain);osc.start(start);osc.stop(stop+.025);
  };
  switch(kind){
    case 'countdown': tone(620,420,.13,'triangle',0,.105); break;
    case 'go': tone(480,980,.34,'sawtooth',0,.14);tone(720,1180,.22,'sine',.07,.07);break;
    case 'gear': tone(205,92,.105,'sawtooth',0,.095);break;
    case 'nitro': tone(165,620,.28,'sawtooth',0,.075);tone(390,1120,.22,'sine',.045,.045);break;
    case 'brake': tone(280,95,.16,'triangle',0,.075);break;
    case 'lap': tone(680,990,.16,'triangle',0,.09);tone(920,1320,.19,'sine',.11,.07);break;
    case 'impact': tone(105,42,.19,'sawtooth',0,.18);tone(72,34,.23,'triangle',.015,.10);break;
    case 'victory': tone(523,660,.28,'triangle',0,.12);tone(659,820,.30,'triangle',.18,.12);tone(784,1040,.48,'triangle',.36,.14);break;
    case 'defeat': tone(260,145,.48,'triangle',0,.13);tone(190,88,.52,'sine',.24,.10);break;
    case 'click': tone(440,590,.065,'sine',0,.055);break;
  }
}

function updateAudio() {
  if(!audioInitialized||!audioContext)return;
  const active=audioEnabled&&raceStarted&&!paused&&!gameOver;
  const speed=Math.abs(playerState.speed||0);
  const throttle=keys.has('ArrowUp')||keys.has('KeyW');
  const brake=keys.has('ArrowDown')||keys.has('KeyS');
  const handbrake=keys.has('Space');
  const speedRatio=clamp(speed/78,0,1);
  const engineHz=35+speedRatio*112+(throttle?11:0)+(keys.has('ShiftLeft')||keys.has('ShiftRight')?13:0);
  setAudioParam(engineOscillator?.frequency,engineHz,.075);
  setAudioParam(engineHarmonic?.frequency,engineHz*2.015,.075);
  setAudioParam(engineFilter?.frequency,760+speedRatio*1500+(throttle?380:0),.09);
  const engineLevel=active?(0.075+speedRatio*.075+(throttle?.025:0)):(audioEnabled&&countdownActive?0.055:0);
  setAudioParam(engineGain?.gain,engineLevel,.10);
  const right=new THREE.Vector3(Math.cos(playerState.yaw),0,Math.sin(playerState.yaw));
  const sideways=Math.abs(playerState.velocity.dot(right));
  const skid=active?clamp((sideways-1.6)/9,0,.24)+(handbrake?clamp(speed/85,0,.20):0):0;
  setAudioParam(tireNoiseGain?.gain,skid,.07);
  setAudioParam(tireNoiseFilter?.frequency,850+speedRatio*900,.10);
  setAudioParam(windNoiseGain?.gain,active?speedRatio*.055:0,.12);
  setAudioParam(windNoiseFilter?.frequency,320+speedRatio*1050,.12);
  if(brake&&active&&speed>18&&sideways>2.5){setAudioParam(tireNoiseGain?.gain,Math.min(.38,skid+.075),.06);}
}

function setupSoundControls() {
  updateSoundControls();
  $('sound-toggle')?.addEventListener('click',()=>{
    setSoundEnabled(!audioEnabled);
    if(audioEnabled)playSoundCue('click');
  });
  $('sound-volume')?.addEventListener('input',event=>{
    audioVolume=clamp(Number(event.target.value)/100,0,1);
    if(masterGain&&audioContext)setAudioParam(masterGain.gain,audioEnabled?audioVolume:0,.035);
    saveSoundPreferences();
  });
}

function animate(now) {
  requestAnimationFrame(animate);
  const dt=Math.min((now-lastFrame)/1000,.04);lastFrame=now;
  if(!paused && !gameOver){
    if(raceStarted){raceTime+=dt;updatePlayer(dt);updateRaceStats();}
    updateOpponents(dt);
    if(player)updateCamera(dt);
    if(toastTimer>0){toastTimer-=dt;if(toastTimer<=0)ui.toast.classList.remove('show');}
  }
  updateAudio();
  if(renderer&&scene&&camera){drawMinimap();renderer.render(scene,camera);}
}

function resize() {
  if(!renderer||!camera)return;
  camera.aspect=window.innerWidth/window.innerHeight;camera.updateProjectionMatrix();renderer.setSize(window.innerWidth,window.innerHeight);
}

function bindControls() {
  setupSoundControls();
  window.addEventListener('keydown',e=>{
    if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space','KeyW','KeyA','KeyS','KeyD','ShiftLeft','ShiftRight'].includes(e.code))activateAudio();
    if(!e.repeat&&(e.code==='ShiftLeft'||e.code==='ShiftRight'))playSoundCue('nitro');
    if(!e.repeat&&(e.code==='Space'||e.code==='ArrowDown'||e.code==='KeyS'))playSoundCue('brake');
    const blocked=['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'];
    if(blocked.includes(e.code))e.preventDefault();
    if(e.code==='Escape'||e.code==='KeyP'){togglePause();return;}
    if(e.code==='KeyC'&&!e.repeat){cameraMode=(cameraMode+1)%2;showToast(cameraMode===0?'CHASE CAMERA':'COCKPIT CAMERA');}
    if(e.code==='KeyR'&&!e.repeat&&raceStarted){resetPlayer();showToast('CAR RESET');}
    keys.add(e.code);
  },{passive:false});
  window.addEventListener('keyup',e=>keys.delete(e.code));
  window.addEventListener('blur',()=>keys.clear());
  $('start-btn').addEventListener('click',()=>{activateAudio();playSoundCue('click');startRace();});
  $('pause-btn').addEventListener('click',()=>{playSoundCue('click');togglePause(true);});
  $('resume-btn').addEventListener('click',()=>{playSoundCue('click');togglePause(false);});
  $('restart-btn').addEventListener('click',()=>{playSoundCue('click');startRace();});
  $('race-again-btn').addEventListener('click',()=>{playSoundCue('click');selectedLevel=currentLevel;startRace();});
  ui.nextLevelBtn.addEventListener('click',()=>{playSoundCue('click');selectedLevel=Math.min(currentLevel+1,MAX_LEVEL);renderCareerMenu();startRace();});
  $('level-select-btn').addEventListener('click',()=>{playSoundCue('click');returnToLevelSelect();});
  document.querySelectorAll('[data-control]').forEach(btn=>{
    const key=btn.dataset.control;
    const down=e=>{
      e.preventDefault();activateAudio();
      if(key==='ShiftLeft')playSoundCue('nitro');
      if(key==='ArrowDown')playSoundCue('brake');
      keys.add(key);
    };
    const up=e=>{e.preventDefault();keys.delete(key);};
    btn.addEventListener('pointerdown',down);btn.addEventListener('pointerup',up);
    btn.addEventListener('pointercancel',up);btn.addEventListener('pointerleave',up);
  });
  window.addEventListener('resize',resize);
}

async function boot() {
  try {
    ui.loadFill.style.width='12%';ui.loadText.textContent='Loading 3D engine...';
    initRenderer();ui.loadFill.style.width='34%';
    initScene();ui.loadFill.style.width='52%';
    ui.loadFill.style.width='62%';
    setLevelEnvironment(selectedLevel, true);ui.loadFill.style.width='82%';
    buildCars();renderCareerMenu();bindControls();ui.loadFill.style.width='100%';
    ui.loadText.textContent='Circuit ready. Get on the grid.';
    drawMinimap();
    setTimeout(()=>{ui.loading.classList.add('hidden');ui.start.classList.remove('hidden');},450);
    requestAnimationFrame(animate);
  } catch(err) {
    console.error(err);
    showError(`The game could not start: ${err.message}. Please use a modern browser with WebGL enabled and an internet connection.`);
  }
}

boot();
