# APEX RACING — 70 Totally Unique Racing Worlds

A browser-based 3D racing game built with HTML, CSS, JavaScript and Three.js. This build combines the 70-level career campaign, individual post-race standings, car physics, AI rivals and browser-generated audio with 70 separately composed procedural environments.

## Run in VS Code

1. Extract the ZIP.
2. Open the `APEX_RACING_70_TOTALLY_UNIQUE_WORLDS` folder in Visual Studio Code.
3. Open a terminal in that folder.
4. Run:

   ```powershell
   py -m http.server 8000
   ```

5. Open `http://localhost:8000` in Chrome or Edge.

An internet connection is required to load Three.js from jsDelivr. Audio begins after the first user interaction, as required by browser audio policies.

## 70-level career mode

- Seven tiers, ten levels each: Rookie (01–10), Club (11–20), Sport (21–30), Pro (31–40), Elite (41–50), Master (51–60) and Legend (61–70).
- Level 1 is available initially. Finish in the top three to clear the current level and unlock the next level.
- Any previously unlocked level can be replayed.
- AI pace increases as the campaign progresses.
- Career progress is saved in local storage in the current browser.

## 70 individual environments — not just seven tier themes

Every level has its own scene-builder case and landmark composition. The environment is rebuilt when a level is selected; the previous scene is disposed, so the game does not keep all 70 worlds in memory at once. A level changes more than its colour: its major landscape silhouette, signature objects, scenery arrangement, sky/fog tint, ground palette, lighting tint and racing circuit are specific to that event.

| Level | Unique world | Main visual identity |
|---:|---|---|
| 01 | Green Valley | Rolling green hills and dense pine forest |
| 02 | Autumn Maple Run | Amber canopy woodland and drifting leaves |
| 03 | Sakura Blossom | Pink flowering trees, river and red gates |
| 04 | Sunflower Plains | Huge sunflower fields, farmhouse and wind turbines |
| 05 | Riverbend Meadows | Wide waterways, stone bridges and river stones |
| 06 | Redwood Ridge | Giant redwood trunks and high forest canopy |
| 07 | Windmill Highlands | Open green ridges and turbine fields |
| 08 | Apple Orchard Loop | Orchard rows, fruit trees and farmhouse |
| 09 | Mirror Lake Run | Large alpine lake, docks and mountain ring |
| 10 | Emerald Canyon | Tall green gorge walls and waterfall |
| 11 | Azure Marina | Yacht slips, piers and modern harbour skyline |
| 12 | Coral Bay Island | Tropical islets, palms and beach huts |
| 13 | Golden Boardwalk | Wooden pier, beachfront hotels and Ferris wheel |
| 14 | Seacliff Highway | Ocean cliffs and elevated crossings |
| 15 | Container Port Sprint | Stacked shipping containers and cargo cranes |
| 16 | Blue Lagoon | Turquoise pool, sandy islets and overwater huts |
| 17 | Canal District | Canal water, pastel buildings and bridges |
| 18 | Lighthouse Point | Tall lighthouse, rocky shore and sea |
| 19 | Riviera Cliff Run | Terraced coastal villas and palms |
| 20 | Sunset Harbour | Rose-coloured sea, setting sun and sailboats |
| 21 | Sandstone Canyon | Layered vertical sandstone walls |
| 22 | Dune Serpent | Broad golden dune fields and drifting sand |
| 23 | Red Mesa Run | Flat-topped red mesas |
| 24 | White Salt Flats | Bright reflective salt pan and salt crystals |
| 25 | Badlands Express | Eroded hoodoos and jagged rock spires |
| 26 | Oasis Mirage | Blue oasis pool and clustered palms |
| 27 | Canyon Arch Run | Giant natural stone arches |
| 28 | Copper Quarry | Terraced quarry walls and ore conveyors |
| 29 | Desert Night Run | Moon, stars and dark desert silhouettes |
| 30 | Dry Lake Speedway | Cracked lakebed, salt ridges and dust haze |
| 31 | Alpine Pass | High snowy peaks and conifer forest |
| 32 | Glacier Edge | Tall translucent blue glacier walls |
| 33 | Pine Shadow Valley | Deep taiga forest and dark mountain ridges |
| 34 | Frozen Lake Circuit | Frozen lake, ice cracks and crystal shards |
| 35 | Snow Village Run | Alpine chalets and warm-lit windows |
| 36 | Ice Cave Sprint | Ice cavern, hanging icicles and glowing portals |
| 37 | Fjordline GP | Deep fjord water and steep coastal cliffs |
| 38 | Summit Skiway | Ski-lift pylons, cables and snow slopes |
| 39 | Silver Birch Snow | White-barked birch grove |
| 40 | Polar Night Circuit | Aurora arcs and arctic crystal monoliths |
| 41 | Neon Downtown | Dense glass towers and electric street lights |
| 42 | Sakura Cyberway | Neon towers, pink blossom trees and petals |
| 43 | Rainfall Boulevard | Rainy skyline, reflective puddles and rain particles |
| 44 | Hologram District | Holographic pylons and floating light rings |
| 45 | Chrome Industrial | Refinery stacks, pipes and industrial haze |
| 46 | Skyline Express | High-rise skyline and observation structures |
| 47 | Elevated Metro | Raised rail viaduct and support columns |
| 48 | Neon Tunnel Run | Repeated illuminated tunnel portals |
| 49 | Cyber Harbor | Glowing cargo stacks and futuristic cranes |
| 50 | Afterdark Grand Prix | Nightlife marquees, neon towers and light beams |
| 51 | Magma Ridge | Volcanic cones and glowing lava fissures |
| 52 | Ashfall Plains | Grey ash plain, pumice and smoke plumes |
| 53 | Obsidian Cliffs | Dark crystal pillars and magenta fissures |
| 54 | Ember Forest | Charred trees and floating embers |
| 55 | Caldera Ring | Huge crater rim around a molten basin |
| 56 | Lava Bridge Run | Elevated bridges above glowing lava channels |
| 57 | Basalt Desert | Hexagonal basalt columns |
| 58 | Firepeak Pass | Giant erupting volcano and sparks |
| 59 | Smoke Valley | Fumarole vents and thick smoke columns |
| 60 | Eruption Grand Prix | Multiple erupting peaks and lava channels |
| 61 | Cloudspire Islands | Floating green islands, trees and waterfalls |
| 62 | Orbital Ringway | Orbital rings, space station towers and planet |
| 63 | Aurora Cloudway | Multiple luminous aurora ribbons |
| 64 | Celestial City | Crystal towers and suspended bridges |
| 65 | Nebula Bridge | Coloured nebula clouds and orbital rings |
| 66 | Lunar Outpost | Moon craters, lunar domes and distant Earth |
| 67 | Crystal Skygarden | Large multi-colour crystal formations |
| 68 | Starfall Towers | Luminous monoliths and meteor streaks |
| 69 | Cosmic Stormway | Cosmic portals, nebula spheres and star field |
| 70 | Infinity Crown | Monumental radiant gates and sky towers |

These environments are procedural Three.js scenes made from custom combinations of geometric assets and materials. They are intentionally designed to be visually distinct while remaining lightweight; they are not 70 photogrammetry scans or hand-authored AAA asset packs. Actual visual quality and frame rate depend on the device and browser.

## Race results

After each race, the results panel shows the actual final classification of the player and all four AI cars, including position, driver/car, lap progress and status.

## Controls

| Action | Keyboard |
|---|---|
| Accelerate | `W` / `↑` |
| Brake / reverse | `S` / `↓` |
| Steer | `A` / `←`, `D` / `→` |
| Handbrake / drift | `Space` |
| Nitro | `Shift` |
| Change camera | `C` |
| Reset car | `R` |
| Pause / resume | `P` / `Esc` |

Touch controls are available on phones and tablets.

## Sound

- Web Audio synthesizes the engine note from speed, throttle, revs and nitro.
- Tyre scrub, wind, gear-shift, nitro, brake, countdown, lap, collision and result cues are included.
- The **SOUND ON / SOUND OFF** button and volume slider control the whole game.
- Sound preferences are saved in browser local storage. A user interaction is required before audio playback.

## Notes

This is an original arcade-style browser racing prototype, not a licensed commercial simulator. It uses procedural cars and scenery, simplified vehicle physics, five-car races and a 70-level progression campaign. It is designed with integrated graphics and 8 GB RAM in mind, but should be tested on the target PC with WebGL enabled.
