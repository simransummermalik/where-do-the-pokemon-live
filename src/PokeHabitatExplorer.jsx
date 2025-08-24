import React, { useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// --- icon with image ---
const makeIcon = (imagePath) =>
  L.icon({
    iconUrl: imagePath,
    iconSize: [48, 48],
    iconAnchor: [24, 24],
    popupAnchor: [0, -20],
    className: "pokemon-icon"
  });

// --- example data with image icons ---
const POKEMON = [
    {id:10,
     name:"Caterpie",
     types:["Bug"],
     icon:"/assets/caterpie.png",
     coords:[35.6532, -83.5070],
     habitat:["Caterpie thrives in temperate broadleaf forests, feeding on leaves and hiding among foliage for protection. Its design closely mirrors real caterpillars like the Eastern Tiger Swallowtail, which are native to this region. The misty, densely wooded mountains are rich in host plants such as oak, maple, and tulip trees, making them the perfect environment for Caterpie colonies to grow. In Pokémon lore, Caterpie is one of the earliest encounters for trainers, much like how these forests are teeming with insects and butterflies from spring to autumn."],
     region:["Great Smoky Mountains (Tennessee / North Carolina, USA)"]

    },
    {id:11,
     name:"Metapod",
     types:["Bug"],
     icon:"/assets/metapod.png",
     coords:[35.68, -83.5070],
     habitat:["Metapod remains motionless in the forest canopy, camouflaged against bark and leaves while it waits for evolution. Its cocoon blends in with tree trunks and branches, making it nearly invisible among the dense foliage. Just like the real chrysalises of swallowtail butterflies, it is highly vulnerable at this stage, relying only on its hardened shell for defense. In the misty woods of the Smokies, Metapod would be seen clinging silently to branches, hidden in plain sight."],
     region:["Great Smoky Mountains (Tennessee / North Carolina, USA)"]
    },
    {id:12,
     name:"Butterfree",
     types:["Bug","Flying"],
     icon:"/assets/butterfree.png",
     coords:[35.6734, -83.5070],
     habitat:["Butterfree soars above wildflower fields and forest clearings, seeking out nectar-rich blossoms. Its compound eyes allow it to detect even the faintest traces of pollen, making the Smoky Mountains’ diverse flora an ideal home. In spring and summer, swarms of butterflies migrate through this region, mirroring Butterfree’s tendency to gather in large numbers. With the misty peaks and flower-filled valleys, the Smokies provide a perfect setting for Butterfree to thrive while completing the Caterpie line’s life cycle."],
     region:["Great Smoky Mountains (Tennessee / North Carolina, USA)"]
    
    },
    {id:13,
    name:"Weedle",
    types:["Bug","Poison"],
    icon:"/assets/weedle.png",
    coords:[35.6700, -83.5300],
    habitat:["Weedle hides among bushes, shrubs, and low branches, feeding on fresh leaves while staying close to cover. Its sharp stinger defends it from birds and other predators, similar to the defense strategies of real-world wasp and sawfly larvae found in Appalachian forests. In Pokémon lore, Weedle is often found in the same habitats as Caterpie, creating a natural rivalry as they compete for food and territory in the dense woodlands."],
    region:["Great Smoky Mountains (Tennessee / North Carolina, USA)"]

    },
    {id:14,
    types:["Bug","Poison"],
    name:"Kakuna",
    icon:"/assets/kakuna.png",
    coords:[35.6850,-83.5450],
    habitat:["Kakuna attaches itself to tree trunks and branches, blending in with bark and moss while it prepares to emerge as Beedrill. It hardly moves, much like the real-world pupal stage of bees and wasps, where the insect is sealed inside a hardened case while its body restructures for adulthood. In forests like the Smokies, this strategy offers camouflage and protection in an ecosystem filled with birds, reptiles, and mammals that would otherwise eat them. In entomology, this stage is called the pupa. Wasps, hornets, and bees all go through complete metamorphosis: egg → larva → pupa → adult. During the pupal stage, their bodies literally dissolve and rebuild, forming wings, stingers, and new organs. Kakuna reflects this real-world phenomenon almost perfectly, only exaggerated with its iconic golden shell and tiny defensive stinger. Forest pupae often appear like dried leaves or pods clinging to trees, and historically, naturalists in Appalachia described the forests as “alive with cocoons” during summer months. This is exactly where Kakuna would fit in — silent, fragile, but hiding the transformation into something far more dangerous."],
    region:["Great Smoky Mountains (Tennessee / North Carolina, USA)"]
    },
    {id:15,
    types:["Bug","Poison"],
    name: "Beedrill",
    icon:"assets/beedrill.png",
    coords:[35.6900, -83.5600],
    habitat:["Beedrill lives in forest colonies and is highly territorial, attacking intruders with fast, repeated stings much like real hornets and wasps. Unlike honeybees, which sting once, hornets can sting multiple times, and Beedrill reflects this with its three oversized stingers and coordinated swarm tactics. The Smokies give it perfect cover for building nests and feeding on flowers and smaller insects, and hikers in the region would likely fear stumbling into a Beedrill hive just as they do with wasp nests in real life. Folklore across Appalachia often warned of angry swarms in the woods, and Japanese culture reveres the giant hornet as both feared and respected—parallels that make Beedrill feel like a natural extension of how people have always viewed stinging insects."],
    region:["Great Smoky Mountains (Tennessee / North Carolina, USA)"]
    },
    {id:16,
    types:["Normal","Flying"],
    name: "Pidgey",
    icon:"assets/pidgey.png",
    coords:[51.5072, 0.1276],
    habitat:["Pidgey is small, cautious, and often overlooked, but in times of need it proves surprisingly loyal. During wartime in England, messenger Pidgey flocks were used much like carrier pigeons, flying over long distances to deliver notes when no other communication was possible. Some were even “awarded medals” for their bravery, their timid nature set aside in the service of survival. Today, they are a common sight in city parks and rooftops, pecking at crumbs among sparrows and pigeons, but their legacy carries a quiet dignity."],
    region:["England (London and surrounding countryside)"]
    },
    {id:17,
     types:["Normal","Flying"],
     name: "Pidgeotto",
     icon:"assets/pidgeotto.png",
     coords:[52.5200, 1.7300],
     habitat:["Where Pidgey is timid and skittish, Pidgeotto has the confidence of a seasoned scout. In England’s wartime past, larger Pidgeotto were trusted to carry longer-distance messages across dangerous skies, often flying through storms or gunfire. Soldiers spoke of their sharp vision and endurance, able to cross open fields and farmland without faltering. Outside of war, they’re seen patrolling the countryside skies, fiercely defending their territory from intruders. They earned a reputation not just as messengers, but as guardians of their flocks."],
     region:["England (Battlefields and Countryside)"]
    },
    {id:18,
     types:["Normal","Flying"],
     name: "Pidgeot",
     icon:"assets/pidgeot.png",
     coords:[51.1290, 1.3210],
     habitat:["Pidgeot was never really used as a messenger — it was simply too large to cage or transport like Pidgey. Instead, people noticed its speed and how it could cut through rough weather. Pilots reported seeing Pidgeot flying high above the Channel during missions, sometimes appearing just before the skies cleared. Its ability to steady itself in crosswinds (what trainers call Tangled Feet) made it stand out, almost like it knew how to read the air better than we could. These days, locals say if you spot one circling above Dover, it’s a sign the storm will break soon."],
     region:["England (White Cliffs of Dover, English Channel)"]
    },
    {id:19,
     types:["Normal"],
     name: "Rattata",
     icon:"assets/Rattata.png",
     coords:[40.7128, -74.0060],
     habitat:["Rattata lives anywhere people do, but nowhere are they more infamous than the alleys and subways of New York. They dart across streets and vanish into cracks with lightning speed, impossible to catch once they’ve chosen their escape path. Small but relentless, Rattata can survive on scraps, endure poisons, and adapt to nearly any trap set against them. Their numbers make them impossible to wipe out, and in a strange way, their persistence has earned them a kind of respect — a symbol of survival in a city that never slows down."]
     ,region:["New York City, USA"]
    },
    {id:20,
    types:["Normal"],
    name:"Raticate",
    icon:"assets/raticate.png",
    coords:[40.7295, -73.9965],
    habitat:["Where Rattata swarm in numbers, Raticate is the one that rules them. Bigger, heavier, and far more aggressive, it’s the boss of subway tunnels and waterfront warehouses. Its teeth never stop growing, strong enough to chew through wood, plastic, and even thin metal — which makes it both a menace and a survivor in an urban landscape. Raticate doesn’t scatter at the first sign of danger the way Rattata do; it stands its ground, baring its fangs until it decides to lunge. In modern New York, exterminators say if you find a Raticate nest, you’ve already lost the fight — the city belongs to them."],
    region:["New York City, USA"]
    },
    {id:21,
    types:["Normal","Flying"],
    name:"Spearow",
    icon:"assets/spearow.png",
    coords:[-19.4914, 132.5509],
    habitat:["Spearow live low to the ground, darting through dry grasslands and scrub with a chip on their shoulder. They’re fiercely territorial, screaming and dive-bombing anything that strays too close, and while farmers curse them for raiding seed sacks, those same farmers know Spearow flocks will rip through locust swarms before they ruin a harvest. Bold and hot-headed, they pick fights just to prove they can, and the noise they make has become part of the Outback’s background — a sharp, constant reminder of how alive the land is. Modern life treats them as both a nuisance and a warning system: when the chatter stops, locals know a hawk, a dingo, or a storm isn’t far behind."],
    region:["Australian Outback (Northern Territory)"]
    },
    {id:22,
    types:["Normal","Flying"],
    name:"Fearow",
    icon:"assets/fearow.png",
    coords:[-20.9176, 142.7028],
    habitat:["Fearow is one of the Outback’s oldest birds, a shape that’s been in the sky for as long as anyone can remember. Farmers compare them to wedge-tailed eagles — circling for hours on a rising thermal, conserving every ounce of energy until the exact moment to strike. But unlike eagles, Fearow don’t wait for you to notice them. The instant they sense danger, they tear into the air with a screech, climbing higher than you think possible, sometimes vanishing into the blinding sun. Old timers say that’s why you never hear a Fearow twice — if you hear it again, it’s because it chose to come back down.Stockmen tell stories of Fearow shadowing their herds for days, swooping down not for cattle but for the snakes flushed from tall grass. Others say a Fearow followed their truck across the desert highway, gliding in perfect silence for miles like it was testing them. Aboriginal lore paints Fearow as a boundary-keeper: a bird that decides who gets to cross safely and who gets lost in the storm. Even today, travelers crossing the Barkly Tableland swear the land feels different when a Fearow is overhead — quieter, sharper, like the whole Outback is holding its breath."],
    region:["Australian Outback (Northern Territory)"]
    },
    {id:23,
    types:["Poison"],
    name:"Ekans",
    icon:"assets/ekans.png",
    coords:[-3.4653, -62.2159],
    habitat:["Ekans slip through the rainforest floor like living shadows, coiling low in the brush and striking fast when prey wanders close. They swallow whole like boas, then vanish into the undergrowth to sleep off the meal, leaving only shed skins draped on branches — which locals sometimes hang above doors as charms against misfortune. Farmers both fear and tolerate them: an Ekans near the field means fewer rats, but step on one and you’ll hear its warning hiss before anything else. In the Amazon, people say the forest belongs to whatever Ekans is watching you from the grass."],
    region:["Amazon Rainforest (Brazil)"]
    },
    {id:24,
    types:["Poison"],
    name:"Arbok",
    icon:"assets/arbok.png",
    coords:[26.0, 92.9376],
    habitat:["Arbok is the serpent people whisper about before they ever see it — coiled at the edges of rice paddies, sliding through villages at dusk, its hood spreading wide to reveal patterns that look like glaring eyes. In real life, cobras display similar markings, and stories say those “faces” are not just for show but for warding off spirits as well as enemies. Farmers treat Arbok with a mix of fear and reverence: its presence keeps rodent populations down, but no one dares disturb it, believing that killing one brings misfortune to the whole household. Modern sightings are told like ghost stories — a black shadow uncoiling near the riverbank, the flash of painted scales, and the silence that falls as if the world itself is holding its breath."],
    region:["India (Assam and surrounding regions)"],
    
    },
    {id:130,
     name:"Gyarados",
     types: ["Water","Flying"],
     icon:"/assets/gyarados.png",
     coords:[31.2400, 121.4900],
     habitat:["Magikarp is common in rivers, ponds, and harbors. Gyarados would logically appear in large connected waterways","In Pokémon lore, Gyarados is infamous for appearing after Magikarp are neglected or disturbed.","In real life Shanghai, rapid urbanization and heavy river use would easily “stress” Magikarp populations triggering Gyarados appearances.","Its temper and destructive force line up with stories of dragons and sea serpents in Chinese mythology, like the flooding river dragons of old folklore."],
     region:["Huangpu River near The Bund (central Shanghai)"]
    },
  {
    id: 25,
    name: "Pikachu",
    types: ["Electric"],
    icon: "/assets/pikachu.png",
    coords: [35.6762, 139.6503],
    habitat:["Pikachu nest at the edges of forests and farmland, darting through branches and fields while charging their cheeks like living batteries. Old folktales said that groves with Pikachu were lightning magnets, and farmers swore those storms left behind “thunder berries” that the Pokémon would rush to collect, feeding on fruit singed by the strike. In modern Japan, they’ve become part of daily life — gathering near rural train stations where people leave food, slipping up poles to run along the wires, and vanishing into the treeline before anyone gets too close. Locals like to say Pikachu keep the current flowing, caretakers of the grid in their own mischievous way: when lights flicker back after a blackout, it’s often credited to a Pikachu giving the line a spark."],
    region:["Kyoto and surrounding areas"],
  },{
  id: 7,
  name: "Squirtle",
  types: ["Water"],
  icon: "/assets/squirtle.png",
  coords: [35.3180, 139.5467],
  habitat: ["Squirtle live in clear rivers and lakes, their shells blending into stones as they lurk just under the surface. Old fishermen claimed a Squirtle’s glowing shell under moonlight could guide them safely back to shore — but the same stories warn of them flipping boats for fun if they felt ignored. On land, Squirtle are playful tricksters, spraying jets of water at farmers, tipping over buckets, or darting away just before you can grab them. In modern life, they’re magnets for kids at water parks and city fountains, diving in and out of the spray, splashing anyone nearby, and turning the whole place into a game. Mischievous but friendly, Squirtle thrive where laughter echoes — the more squeals and splashes, the happier they are."],
  region: ["Kanagawa Prefecture, Japan"],
},

  {
  id: 26,
  name: "Raichu",
  types: ["Electric"],
  icon: "/assets/raichu.png",
  coords: [34.2260, 134.6060],
  habitat: ["Raichu are rarer than Pikachu, but when they appear, the weather always seems to follow — lightning splitting the sky, sea air thick with static, and orchards shaking under the crack of thunder. Farmers once believed Raichu claimed the 'thunder trees,' groves where bolts struck again and again, feeding on the scorched berries left behind. Unlike Pikachu, which play along train lines and power poles, Raichu are too powerful for small tricks; their discharges can ground an entire village, only for the lights to flare back stronger as if the grid itself bent to their will. Modern sightings usually come with storm warnings, and locals still whisper that Raichu aren’t just Pokémon — they’re little thunder gods walking the earth."],
  region: ["Tokushima, Shikoku, Japan"],
},
{
  id: 27,
  name: "Sandshrew",
  types: ["Ground"],
  icon: "/assets/sandshrew.png",
  coords: [32.2226, -110.9747],
  habitat: ["Sandshrew are the desert’s little architects, carving burrows deep enough to outlast the midday sun and vanishing into the ground at the first sign of trouble. Their armor-like scales lock in water so well that old travelers swore spotting one meant an oasis was near. When threatened, they snap into tight, rolling spheres that barrel down dunes like living stones, too fast to catch and too tough to break. In modern times, they surface at dawn to forage before disappearing beneath the sand; ranchers say fresh Sandshrew tracks outside a homestead are a good omen—the land is solid, the ground won’t give way, and the desert has accepted you for another day."],
  region: ["Sonoran Desert (Arizona, USA)"],
},
{
  id: 28,
  name: "Sandslash",
  types: ["Ground"],
  icon: "/assets/sandslash.png",
  coords: [31.9686, -99.9018],
  habitat: ["Sandslash are the desert’s armored guardians, their backs bristling with spines sharp as cactus thorns and claws strong enough to split rock. Old frontier tales said a single Sandslash could turn an arroyo into a fortress overnight, carving trenches and leaving only a crown of spines showing above the sand. At night they patrol their territory with eerie silence, and ranchers swear their livestock sleeps more soundly when a Sandslash is near, as if predators can feel its presence in the dark. In modern times, desert engineers even credit them with stabilizing loose dunes—burrows woven so deep and wide they anchor the sand itself. To travelers, stumbling across fresh claw marks isn’t just a warning; it’s proof that something powerful is watching over the desert’s edge."],
  region: ["Chihuahuan Desert (Texas, USA)"],
},
{
  id: 29,
  name: "Nidoran♀",
  types: ["Poison"],
  icon: "/assets/nidoran.png",
  coords: [47.4979, 19.0402],
  habitat: ["Nidoran♀ are small but cautious foragers, padding through tall grass at dawn to sniff out edible shoots and herbs. Their whiskers are finely tuned to wind and scent, letting them stay downwind of predators — a survival trick that farmers once mimicked to avoid wolves. In folklore they were seen as guardians of the garden, little blue bodies darting between rows of crops, their toxic quills keeping pests and thieves at bay. In modern life, Nidoran♀ are happiest when left to safe, green spaces — they’d spend hours in community gardens, nibbling herbs and watching children play, fiercely protective of any place that feels like home."],
  region: ["Hungarian plains (near Budapest)"],



},

  {
    id: 129,
    name: "Magikarp",
    types: ["Water"],
    icon: "/assets/magikarp.png",
    coords: [31.2304, 121.4737],
    habitat: "Slow-moving rivers, estuaries, and harbors worldwide.",
    region: "Global coastal + freshwater",
    appearances: ["Gen I onward"]
  },
{
  id: 4,
  name: "Charmander",
  types: ["Fire"],
  icon: "/assets/charmander.png",
  coords: [35.4606, 138.7274],
  habitat: ["Charmander make their dens on warm hillsides and volcanic slopes, soaking in heat from sun-baked stones and curling up beside cracks that vent soft steam. Old mountain villages saw them as hearth spirits, little fire-keepers who’d sneak into homes to sit by the stove and keep families warm through the night. Their tails never go out, so they move carefully — but not always carefully enough. Curious and eager to please, Charmander have a habit of singeing laundry lines, melting toys, or lighting candles just to see them glow. In modern life, they’re drawn to campsites, chimneys, and anywhere with a cozy fire. Around kids, they’re gentle and shy at first — but once they feel safe, they’ll join marshmallow roasts, wagging their tails like torches and laughing when sparks fly."],
  region: ["Mt. Fuji foothills, Japan"],
},
{
  id: 79,
  name: "Slowpoke",
  types: ["Water", "Psychic"],
  icon: "/assets/slowpoke.png",
  coords: [24.5551, -81.7800],
  habitat: ["Slowpoke love warm docks and shallow waters, where they can dangle their tails for hours without moving. In Key West, they’ve become part of the scenery — locals joke that traffic jams happen because Slowpoke wander into the road and nap right in the middle, too lazy to move when honked at. Tourists find them sunbathing on piers, oblivious to fishing lines tangling on their tails. Despite their dopey look, sailors say spotting one is good luck: storms pass slower, and voyages feel calmer with a Slowpoke nearby."],
  region: ["Key West, Florida, USA"],
},
{
  id: 94,
  name: "Gengar",
  types: ["Ghost", "Poison"],
  icon: "/assets/gengar.png",
  coords: [36.1716, -115.1525],
  habitat: ["Gengar thrives in neon-lit nights, making Las Vegas its perfect home. It slips between casino floors, flickering lights right as jackpots hit and whispering in gamblers’ ears before they pull the lever. Tourists swear they’ve seen their own shadows grin back at them on the Strip. Bartenders know the trick too: when drinks mysteriously vanish, it’s usually a Gengar enjoying a laugh. In Vegas lore, if you hear a giggle behind you at the slot machines, don’t turn around — the shadow’s already gone."],
  region: ["Las Vegas, Nevada, USA"],
},

{
  id: 1,
  name: "Bulbasaur",
  types: ["Grass", "Poison"],
  icon: "/assets/bulbasaur.png",
  coords: [30.3859, 130.5571],
  habitat: ["Bulbasaur spend their days like tiny retirees, waddling to sunny patches of grass to nap and occasionally shuffling over to hot springs where they sink in with a long sigh, vines draped over the rocks like a towel. Locals joke that Bulbasaur give off 'grandpa energy' — slow to get moving in the morning, grumbling when kids run too fast, but secretly delighted when someone sits beside them. In folklore, their bulbs were said to glow brightest in the steam, blessing anyone who bathed with them. In modern life, Bulbasaur happily lounge around parks and gardens, occasionally slipping into public hot springs like regulars who’ve been coming there for decades."],
  region: ["Yakushima Island, Japan"],
},
{
  id: 143,
  name: "Snorlax",
  types: ["Normal"],
  icon: "/assets/snorlax.png",
  coords: [39.7391, -75.5398], // Wilmington, Delaware
  habitat: ["Snorlax thrives in Delaware because the state moves at exactly its pace: slow, quiet, and uneventful enough for a nap that lasts all week. Locals say nothing really happens here — which makes it perfect for a Pokémon that only wakes up to eat. You’ll find Snorlax stretched across backroads, sunning itself by the river, or dozing in the middle of town squares where nobody bothers to move it. Children climb its belly like a bouncy castle, fishermen sit beside it while waiting for a bite, and commuters just sigh and drive around. In a place known for being small, calm, and a little boring, Snorlax has become Delaware’s true mascot — a giant reminder that there’s no rush when the whole state feels like nap time."],
  region: ["Delaware, USA"],
},
{
  id: 39,
  name: "Jigglypuff",
  types: ["Normal", "Fairy"],
  icon: "/assets/jigglypuff.png",
  coords: [36.1627, -86.7816], // Nashville, Tennessee
  habitat: ["Jigglypuff loves music more than anything, which makes Nashville its perfect home. On late nights downtown, you can spot one waddling into crowded bars, climbing onto a stool, and belting out its lullaby — much to the frustration of every band it interrupts. Whole streets have been lulled into naps mid-song, and Jigglypuff has been known to doodle on the faces of anyone who dared fall asleep during its performance. Despite the mischief, locals treat it like a tiny diva: musicians leave out water bottles and snacks by the stage, and tourists whisper about catching a 'surprise show' if they’re lucky. In Music City, Jigglypuff isn’t just a Pokémon — it’s a headliner."],
  region: ["Nashville, Tennessee, USA"],
},
{
  id: 484,
  name: "Palkia",
  types: ["Water", "Dragon"],
  icon: "/assets/palkia.png",
  coords: [29.5597, -95.0831], // Johnson Space Center, Houston
  habitat: ["Palkia embodies space itself, and in the modern world, nowhere feels more like its domain than NASA. Engineers at the Johnson Space Center whisper that strange distortions ripple across telescope feeds at night — flashes of light where no star should be, shadows bending where the sky should be empty. Astronauts preparing for launch sometimes report hearing low, echoing roars through the static of comms, like something vast breathing just beyond the atmosphere. In folklore, Palkia was painted as a dragon whose steps opened the heavens; today, NASA staff joke that if a rocket disappears too smoothly into orbit, it might not just be physics — it might be Palkia making sure space is ready to hold it."],
  region: ["NASA Johnson Space Center, Houston, Texas, USA"],
},
{
  id: 483,
  name: "Dialga",
  types: ["Steel", "Dragon"],
  icon: "/assets/dialga.png",
  coords: [46.2331, 6.0550], // CERN, Switzerland
  habitat: ["Dialga governs time, and scientists at CERN often speak half-seriously of its shadow stretching across the Large Hadron Collider. Legends once claimed its roar could freeze moments forever, and modern researchers joke that if any clock on campus drifts, it’s Dialga resetting the rhythm. Security cameras around the LHC have occasionally recorded flickers — frames repeating, moments vanishing — that staff chalk up to glitches, though some whisper Dialga is watching, curious about humans daring to toy with spacetime. In old stories, Dialga was feared for stopping harvests or hastening decay; at CERN, it feels less like a threat and more like a reminder: every experiment runs only because time itself allows it."],
  region: ["CERN, Geneva, Switzerland"],
},
{
  id: 52,
  name: "Meowth",
  types: ["Normal"],
  icon: "/assets/meowth.png",
  coords: [36.1699, -115.1398], // Las Vegas, Nevada
  habitat: ["Meowth thrive under neon lights, slipping in and out of casinos along the Las Vegas Strip. They’re infamous for pawing at slot machines, batting coins across hotel lobbies, and vanishing into alleyways with chips clinking in their claws. Locals swear that a Meowth sighting before a game is a sign of luck — though whether it’s good or bad depends on how many of your coins it decides to steal. At night, they can be seen perched on marquees and rooftops, eyes glowing gold under flashing billboards, as if the whole city was built for them. In Vegas, Meowth aren’t pests — they’re the Strip’s real high-rollers."],
  region: ["Las Vegas, Nevada, USA"],
},
{
  id: 132,
  name: "Ditto",
  types: ["Normal"],
  icon: "/assets/ditto.png",
  coords: [34.0928, -118.3287], // Hollywood, California
  habitat: ["Ditto fit perfectly in Hollywood, the city of constant transformation. On studio lots, they’ve been spotted mimicking actors mid-scene, blending so well that crews don’t realize until the script goes off the rails. Paparazzi whisper about celebrity sightings that turn out to be Ditto imposters, and directors half-jokingly call them the cheapest special effects in town. Locals say every red carpet has at least one Ditto slipping through, trying on different faces just for fun. In Hollywood, Ditto aren’t just Pokémon — they’re the ultimate actors, living mirrors of a city built on performance."],
  region: ["Hollywood, California, USA"],
},
{
  id: 54,
  name: "Psyduck",
  types: ["Water"],
  icon: "/assets/psyduck.png",
  coords: [35.6812, 139.7671], // Tokyo Station
  habitat: ["Psyduck are a common (and often chaotic) sight on Tokyo’s crowded subway lines, clutching their heads as the noise and rush hour crowds give them splitting headaches. Conductors groan when a Psyduck waddles on board, because within minutes the train car is filled with confused passengers, luggage floating, and lights flickering as Psyduck’s stress spills out as uncontrolled psychic bursts. Despite the chaos, locals find them oddly endearing — commuters even joke that a delayed train just means a Psyduck rode that morning. Strangely enough, some Psyduck sneak out of the city on weekends, spotted lounging in mountain hot springs beside Bulbasaur, both of them soaking like old men escaping the world. City chaos by day, grandpa spa retreat by night — that’s Psyduck’s Tokyo life."],
  region: ["Tokyo, Japan"],
},
{
  id: 53,
  name: "Persian",
  types: ["Normal"],
  icon: "/assets/persian.png",
  coords: [40.7736, -73.9566], // Upper East Side, Manhattan, NYC
  habitat: ["Persian are the aristocrats of the Pokémon world, gliding through city streets with silent paws and a jewel that glints like stolen treasure. In New York, they’re most at home in penthouses overlooking Central Park, pampered by the wealthy but just as often slipping into the night to hunt or prowl. Unlike the scrappy Meowth of Las Vegas, Persian operate like mob bosses — graceful, calculating, and quick to bare claws if anyone disrespects them. In folklore, their glowing foreheads were said to ward off misfortune, though in modern life they’re better known for appearing in tabloids when someone’s jewelry heist goes unsolved. Elegant, dangerous, and untouchable — Persian doesn’t beg for attention, it commands it."],
  region: ["New York City, USA"],
},
{
  id: 65,
  name: "Alakazam",
  types: ["Psychic"],
  icon: "/assets/alakazam.png",
  coords: [37.3875, -122.0575], // Mountain View, California (Silicon Valley)
  habitat: ["Alakazam thrive in the brain-buzz of Silicon Valley, drawn to server farms and research labs like moths to flame. With an IQ said to rival supercomputers, they spend their days perched in cafés staring at laptops they don’t need, occasionally correcting code by floating the cursor on the screen. Engineers whisper that unexplained bugs vanishing overnight are really the work of a bored Alakazam cleaning up. They’re smug about it too — playing chess in the park, winning in ten moves, then walking off with both spoons twirling in the air. In folklore they were feared as mind-readers, but in modern life, they’ve become the Valley’s unofficial consultants: unpaid, unasked for, but always certain they know better than you."],
  region: ["Silicon Valley, California, USA"],
},
{
  id: 487,
  name: "Giratina",
  types: ["Ghost", "Dragon"],
  icon: "/assets/giratina.png",
  coords: [51.2766, 30.2210], // Chernobyl Exclusion Zone, Ukraine
  habitat: ["The Chernobyl Exclusion Zone is one of the few places on Earth where Giratina feels at home. When Reactor 4 exploded in 1986, witnesses said the sky bent and shadows crawled in directions that made no sense. Locals later whispered that the blast tore a hole into the Distortion World, and something slipped through. Radiation didn’t repel it — it warped the air further, amplifying the distortion until the Zone itself felt unstable. Even now, explorers report Geiger counters spiking in clear areas, then dropping to silence, as though the machines are tracking something that isn’t fully here. Time feels unreliable; watches skip forward minutes at a time, and film from cameras comes back blurred by shapes no one saw. Some stalkers tell of six black wings unfolding in the ruins of cooling towers, or a centipede-shaped shadow slithering upside down across ceilings in abandoned schools. Scientists dismiss these as paranoia or 'radiation sickness,' but folklore says Giratina is the warden of places humans tried to erase. In Chernobyl, the abandoned ferris wheels, silent apartments, and glowing forests are more than ruins — they are echoes, held together by Giratina’s distorted gravity, where past and present never fully separate."],
  region: ["Chernobyl Exclusion Zone, Ukraine"],
},
{
  id: 491,
  name: "Darkrai",
  types: ["Dark"],
  icon: "/assets/darkrai.png",
  coords: [78.6500, 16.5500], // Pyramiden, Svalbard, Norway
  habitat: ["In Pyramiden, an abandoned Soviet mining town on the Arctic island of Svalbard, the sun sets in November and does not rise again for months. Locals say this is where Darkrai lingers, moving between the silence of empty apartment blocks and the frozen streets where statues of old workers still stand. In the endless polar night, sleep becomes fragile; explorers describe nights of shallow rest broken by jolts of panic, as if someone whispered their name in the dark. Dreams blur with waking — footsteps echo in hallways, shadows stretch across walls without a light source, and time itself feels unreliable. Some return from expeditions with missing hours they cannot account for. Scientists dismiss it as isolation sickness, but others believe Darkrai feeds here, weaving nightmares that leave scars long after the dreamer wakes. Radiation meters and compasses sometimes falter in its presence, spinning or going dead, as though reality itself dips out. Pyramiden’s folklore now calls it 'the town that never wakes.' For many, the fear is not that Darkrai causes nightmares — but that in the dark months, you may never realize when you’ve left reality and slipped into one."],
  region: ["Pyramiden, Svalbard (Norwegian Arctic)"],
},
{
  id: 488,
  name: "Cresselia",
  types: ["Psychic"],
  icon: "/assets/cresselia.png",
  coords: [69.2167, -51.1000], // Ilulissat Icefjord, Greenland
  habitat: ["Cresselia glides silently over Greenland’s Ilulissat Icefjord, a place where the night sky burns with shifting aurora and glaciers echo with the sound of calving ice. Travelers who camp beneath the northern lights often speak of dreams so vivid they blur with waking life — visions of home, loved ones, or futures that feel achingly real. Local hunters describe waking from a night in -40°C with warmth still on their skin, as though the cold had forgotten them. Inuit folklore once told of moon-spirits that descended on beams of light to bless hunters and heal fevers; modern stories tie those legends to Cresselia, the 'Dream Swan' of the Arctic sky. Where Darkrai feeds on fear, Cresselia is said to weave serenity — bending nightmares into quiet visions that guide people safely through the harshest nights. Scientists dismiss it as the psychological comfort of the aurora, but in villages along the fjord, families still leave carved moon talismans on the ice, believing Cresselia watches over anyone who dares to dream so far north."],
  region: ["Ilulissat Icefjord, Greenland"],
},
{
  id: 607,
  name: "Litwick",
  types: ["Ghost", "Fire"],
  icon: "/assets/litwick.png",
  coords: [42.5195, -70.8967], // Salem, Massachusetts
  habitat: ["Litwick gather in old towns heavy with ghost stories, flickering innocently in windows or guiding travelers down side streets. In Salem, their tiny flames are often mistaken for lanterns or candles in historic houses, but folklore warns that following one too long leaves you weak and drowsy, your energy feeding the flame. During October, tourists report Litwick bobbing in graveyards, their light dancing among jack-o’-lanterns. Locals say the trick is simple: if the candlelight feels too cold, don’t follow it — it’s not a candle at all."],
  region: ["Salem, Massachusetts, USA"],
},
{
  id: 608,
  name: "Lampent",
  types: ["Ghost", "Fire"],
  icon: "/assets/lampent.png",
  coords: [50.0755, 14.4378], // Prague, Czech Republic
  habitat: ["Lampent drift through Europe’s oldest cities, drawn to doorways where death has lingered. In Prague, with its winding Gothic alleys and centuries of plague history, they are said to hover outside hospitals and cemeteries, their blue flames swaying like funeral lanterns. Old tales describe them as omens — if you see one hovering by your window, someone in the house will not wake by morning. Modern tourists sometimes spot strange flames in castle chandeliers or in the Astronomical Clock tower at night, swaying with no draft. Locals keep their distance, calling them 'the lights that choose when to burn.'"],
  region: ["Prague, Czech Republic"],
},
{
  id: 609,
  name: "Chandelure",
  types: ["Ghost", "Fire"],
  icon: "/assets/chandelure.png",
  coords: [48.8338, 2.3324], // Paris Catacombs
  habitat: ["Chandelure are said to haunt the Paris Catacombs, where miles of tunnels hold the remains of millions. Urban explorers tell of chandeliers igniting in bone-lined chambers with no source of flame, their violet fire casting shadows that move out of sync with the living. Legends say each flame burns with the soul of someone lost in the dark, flickering brighter when new wanderers stray too far from their group. Some explorers report feeling light-headed, as if their spirit itself is being tugged toward the fire. While Litwick trick the unwary and Lampent linger as omens, Chandelure reigns as the collector — a reminder that in the catacombs, the light is never your friend."],
  region: ["Paris Catacombs, France"],
},
{
  id: 373,
  name: "Salamence",
  types: ["Dragon", "Flying"],
  icon: "/assets/salamence.png",
  coords: [47.5812, 10.7498], // Bavarian Alps, Germany
  habitat: ["Salamence haunt the skies of the Bavarian Alps, soaring between peaks where storms gather. Their legend mirrors old European dragon tales — shepherds once spoke of shadows that split the clouds and melted the snowpack with fire, mistaking Salamence for the same monsters painted on medieval maps. They are not graceful fliers; their wings were born from rage and desire, and they cut through the air with a violence that rattles windows in mountain villages. Pilots in training sometimes report being chased by 'something huge' above the ridgelines, and locals still say avalanches can be blamed on Salamence roaring overhead. In modern times, hikers treat sightings like omens: if you hear the air shatter with a sudden boom, it means a Salamence has taken to the sky, and it will not land until its fury is spent."],
  region: ["Bavarian Alps, Germany"],
},
{
  id: 109,
  name: "Koffing",
  types: ["Poison"],
  icon: "/assets/koffing.png",
  coords: [34.0522, -118.2437], // Los Angeles, California
  habitat: ["Koffing drift lazily through the smoggiest corners of Los Angeles, floating between traffic jams on the I-405 like balloons that nobody asked for. They thrive on exhaust and factory fumes, expanding happily the worse the air gets. Locals joke that every bad smog day is just 'Koffing season,' and more than one yoga studio has had classes interrupted when one floated inside and popped. They’re pranksters too — slipping into movie sets, leaking just enough gas to ruin takes, or bursting over food trucks for a free laugh. In the old games, they were symbols of pollution; in modern life, they’re basically mascots for L.A. traffic: annoying, unavoidable, and somehow kind of iconic."],
  region: ["Los Angeles, California, USA"],
},

{
  id: 108,
  name: "Lickitung",
  types: ["Normal"],
  icon: "/assets/lickitung.png",
  coords: [40.5740, -73.9850], // Coney Island, Brooklyn
  habitat: ["Lickitung treats Coney Island like an endless tasting menu: it waddles the boardwalk licking everything it shouldn’t—railing, signage, the side of the roller coaster—before zeroing in on funnel cakes, hot-dog stands, and dripping cones. Vendors keep a stack of napkins just for it; kids dare each other to hold out a pretzel and see how fast it vanishes; lifeguards swear it can taste salt on the wind and beeline to the beach before anyone says 'surf’s up.' Its tongue is a built-in critic—sticky and unstoppable—so on summer nights you’ll hear the usual boardwalk noise plus one unmistakable sound: a delighted slurp followed by a chorus of 'Hey! Not the banner!'" ],
  region: ["Coney Island, Brooklyn, New York, USA"],
},
{
  id: 359,
  name: "Absol",
  types: ["Dark"],
  icon: "/assets/absol.png",
  coords: [27.9878, 86.9250], // Mount Everest region, Nepal
  habitat: ["Absol has long been seen as a wandering omen in the Himalayas, padding silently across ridgelines just before avalanches, landslides, or storms strike. Locals never blame it for disaster—rather, they believe it warns those wise enough to listen. Shepherds in mountain villages tell stories of Absol standing outside their doors the night before an earthquake, its white fur glowing faintly against the dark slopes. Climbers whisper of glimpses in the snow near base camps, a horned silhouette against blizzards that arrive hours later. In modern times, Absol has become both feared and revered: hikers leave offerings of food at shrines to appease it, hoping for safe passage. Whether myth or truth, the presence of Absol in the Himalayas makes even the bravest traveler tread carefully."],
  region: ["Himalayas (Nepal/Tibet)"],
},
{
  id: 392,
  name: "Infernape",
  types: ["Fire", "Fighting"],
  icon: "/assets/infernape.png",
  coords: [32.4420, 114.0290], // Mount Huaguo, Jiangsu Province, China
  habitat: ["Infernape is tied to legend as much as to nature, and no place claims it better than Mount Huaguo — the mythical home of the Monkey King. Locals tell stories of flames flickering at the mountaintop during festivals, said to be Infernape sparring with its own shadow, training endlessly like its folkloric ancestor Sun Wukong. Agile, fierce, and proud, it leaps between cliffside trees, leaving scorch marks on stone where its feet land. Pilgrims say spotting Infernape mid-battle is a blessing — a sign of perseverance and strength — though few ever get close before the fire and laughter vanish into the peaks. In modern times, the mountain celebrates the connection: statues of Infernape appear alongside depictions of the Monkey King, a living reminder of myth carried forward in flame."],
  region: ["Mount Huaguo, Jiangsu Province, China"],
},
{
  id: 68,
  name: "Machamp",
  types: ["Fighting"],
  icon: "/assets/machamp.png",
  coords: [33.9850, -118.4695], // Venice Beach, California
  habitat: ["Machamp treat Venice Beach like their natural gym, strutting up and down Muscle Beach with four arms full of dumbbells. Tourists gather to watch them bench-press picnic tables, curl bicycles, and pose for photos in between sets. Locals swear Machamp flexes so hard it scares off the seagulls, clearing entire stretches of boardwalk in a single glare. Despite the showboating, they’re surprisingly social — spotting one spotting a human lifter is considered a rite of passage. In modern life, Machamp are Venice legends: workout partners, unofficial lifeguards, and the loudest hype-men on the sand."],
  region: ["Venice Beach, California, USA"],
},
{
  id: 5,
  name: "Charmeleon",
  types: ["Fire"],
  icon: "/assets/charmeleon.png",
  coords: [35.3606, 138.6274], // Mt. Fuji slopes, Japan
  habitat: ["Charmeleon prowl the volcanic ridges of Mt. Fuji like restless spirits, halfway between playful fire-sprite and true dragon. Where Charmander curled up by stoves and campfires, Charmeleon pick fights with bonfires, sparklers, and even passing trains that throw sparks from their brakes. Hikers tell stories of 'red shadows' charging at them from the mist, only to veer off at the last second, leaving scorched shoeprints in the gravel. Folklore calls them the 'rebellious flames' of the mountain — creatures who burn bright because they don’t yet know how to burn steady. Modern climbers sometimes leave offerings of matches or lighters at shrines, hoping to appease Charmeleon so their tempers don’t spark wildfires. They’re feared for their outbursts, but admired too: the mountain feels more alive with a Charmeleon stalking its slopes."],
  region: ["Mt. Fuji volcanic slopes, Japan"],
},

{
  id: 501,
  name: "Oshawott",
  types: ["Water"],
  icon: "/assets/oshawott.png",
  coords: [35.69,139.78],// Tokyo
  habitat: ["Oshawott thinks it’s the hero of the group  constantly striking sword poses with its scalchop, bragging about its 'skills,' and then immediately tripping over its own feet. It insists on being the cool one, but usually ends up face-first in the harbor while everyone else laughs. Locals see Oshawott as a lovable try-hard: always dramatic, always soaked, and always ready to start another round of 'look at me!' no matter how many times it fails."],
  region: ["Tokyo, Japan"],
},
{
  id: 393,
  name: "Piplup",
  types: ["Water"],
  icon: "/assets/piplup.png",
  coords: [35.7100, 139.76], // Tokyo Skytree area, a little offset
  habitat: ["Piplup is convinced it’s royalty, waddling around with its head held high and refusing to take orders from anyone — especially Oshawott. It bosses the others around, gets furious when ignored, and dramatically storms off… only to come back five minutes later because it doesn’t like being left out. Its rivalry with Oshawott is constant, with endless splashing contests and ego battles, while Pachirisu usually makes things worse by egging them both on. Despite its diva act, everyone knows Piplup secretly loves the chaos."],
  region: ["Tokyo, Japan"],
},
{
  id: 417,
  name: "Pachirisu",
  types: ["Electric"],
  icon: "/assets/pachirisu.png",
  coords: [35.7000, 139.7700], // Ueno Park, close by
  habitat: ["Pachirisu is the chaos engine of the trio — a sugar-high gremlin that zooms around, steals everyone’s food, and zaps Oshawott mid-pose just to watch it fall over. It lives for stirring up trouble: one second it’s sitting innocently, the next it’s vanished with Piplup’s snack or tangled everyone in its tail. Pachirisu is the glue that keeps the squabbling going, because without it, Oshawott and Piplup might actually calm down. Modern sightings usually involve three drenched, screaming Pokémon and one very smug electric squirrel in the middle."],
  region: ["Tokyo, Japan"],
},
{
  id: 122,
  name: "Mr. Mime",
  types: ["Psychic", "Fairy"],
  icon: "/assets/mrmime.png",
  coords: [48.8867, 2.3431],
  habitat: ["Mr. Mime thrive in Paris’s busy squares and boulevards, blending in with street performers so well that tourists often mistake them for humans in costume. In Montmartre especially, they hold invisible walls in the air, pretending to be part of the act until an unsuspecting passerby bumps into them and realizes the wall was real. Locals joke that Mr. Mime doesn’t work for applause — it works for tips, following anyone stingy with coins until they finally pay up. In modern Paris, spotting one is almost a rite of passage; the city feels incomplete without a Mr. Mime waiting to box you in on a cobblestone street."],
  region: ["Paris, France (Montmartre District)"],
},
{
  id: 6,
  name: "Charizard",
  types: ["Fire", "Flying"],
  icon: "/assets/charizard.png",
  coords: [35.3622, 138.7300],
  habitat: ["Charizard settle on the ridges of Mt. Fuji, where thin air and rising thermals let them soar for hours without landing. Prideful to a fault, they pick the tallest peaks not just for warmth but for visibility — it’s not enough to live, they have to be *seen*. In the past, villagers told stories of fiery shadows crossing the moon and took it as a warning of eruptions. In modern Japan, hikers sometimes glimpse them circling above sunrise climbs, wings flashing in the first light. They don’t hide in caves like dragons of legend; they own the skyline, occasionally swooping low to challenge helicopters or chase jets as if daring the machines to keep up. For Charizard, the mountain isn’t just home — it’s a stage."],
  region: ["Mt. Fuji, Japan"],
},
{
  id: 9,
  name: "Blastoise",
  types: ["Water"],
  icon: "/assets/blastoise.png",
  coords: [45.4408, 12.3155], // Venice, Italy
  habitat: ["Blastoise treat the canals of Venice like their personal battleground and playground. Tourists think of them as mascots, but gondoliers know better — a Blastoise blasting its water cannons can rock a whole boat if it’s in the mood. Protective by nature, they’ll scare off anyone littering in the canals or splashing too close to children, but they also love showing off by spraying arches of water over passing ferries. Locals joke that Venice doesn’t need fountains because Blastoise provide them daily. In the anime they stood firm as tanks; in modern life they’ve become lifeguards, pranksters, and hydraulic showmen rolled into one."],
  region: ["Venice, Italy"],
},
{
  id: 8,
  name: "Wartortle",
  types: ["Water"],
  icon: "/assets/wartortle.png",
  coords: [35.0954, 135.7480], // Lake Biwa, Japan
  habitat: ["Wartortle hang around deep lakes and temple ponds, where locals once thought their long, fluffy tails marked them as guardians of long life. In truth, they’re rowdy little show-offs — darting circles around boats, splashing tourists, and pretending to be Blastoise-in-training. They’ll challenge fishermen by tugging at nets, then vanish in a swirl of bubbles, only to pop back up minutes later grinning. In modern Japan, Wartortle are equal parts pranksters and mascots at lakeside festivals, often seen sunning themselves on shrine steps like they own the place. They carry an aura of wisdom thanks to old legends, but anyone who’s actually dealt with one knows they’re more teenage troublemaker than sage turtle."],
  region: ["Lake Biwa, Japan"],
},


];

const ALL_TYPES = [
  "Bug","Dark","Dragon","Electric","Fairy","Fighting","Fire","Flying","Ghost","Grass","Ground","Ice","Normal","Poison","Psychic","Rock","Steel","Water"
];

function FitBoundsOnData({ items }) {
  const map = useMap();
  useMemo(() => {
    if (!items?.length) return;
    const group = L.featureGroup(
      items.map(p => L.marker(p.coords, { icon: makeIcon(p.icon) }))
    );
    map.fitBounds(group.getBounds().pad(0.2), { animate: false });
  }, [items, map]);
  return null;
}

export default function PokeHabitatExplorer() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("All");

  const filtered = useMemo(() => {
    return POKEMON.filter(p => {
      const nameMatch = p.name.toLowerCase().includes(query.toLowerCase());
      const typeMatch = type === "All" || p.types.includes(type);
      return nameMatch && typeMatch;
    });
  }, [query, type]);

  return (
    <div style={{ width: "100vw", height: "100vh", margin: 0, padding: 0 }}>
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: 12, display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center", borderBottom: "1px solid #e5e7eb" }}>
          <h1 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>PokéHabitat Explorer</h1>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Pokémon…"
            style={{ padding: "8px 12px", border: "1px solid #d1d5db", borderRadius: 6, width: 220 }}
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            style={{ padding: "8px 12px", border: "1px solid #d1d5db", borderRadius: 6 }}
          >
            <option>All</option>
            {ALL_TYPES.map(t => (
              <option key={t}>{t}</option>
            ))}
          </select>
          <span style={{ fontSize: 12, color: "#4b5563" }}>{filtered.length} result(s)</span>
        </div>

        <div style={{ flex: 1 }}>
          <MapContainer
            center={[20, 0]}
            zoom={2}
            minZoom={2}
            worldCopyJump
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://carto.com/">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />

            <FitBoundsOnData items={filtered} />
              {filtered.map(p => (
                <Marker key={p.id} position={p.coords} icon={makeIcon(p.icon)}>
                  <Popup>
                    <div style={{ maxWidth: 260 }}>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <img src={p.icon} alt={p.name} style={{ width: 36, height: 36 }} />
                        <div>
                          <div style={{ fontWeight: 700 }}>{p.name}</div>
                          <div style={{ fontSize: 12, opacity: 0.8 }}>{p.types.join(" · ")}</div>
                        </div>
                      </div>
                      <hr style={{ margin: "8px 0" }} />
                      <div style={{ fontSize: 13 }}>
                        <b>Region:</b> {p.region}<br/>
                        <b>Habitat:</b> {p.habitat}
                      </div>
                      {p.appearances?.length ? (
                        <div style={{ marginTop: 8 }}>
                          <b>Appearances</b>
                          <ul style={{ margin: 0, paddingLeft: 18 }}>
                            {p.appearances.map((a, i) => <li key={i}>{a}</li>)}
                          </ul>
                        </div>
                      ) : null}
                    </div>
                  </Popup>
                </Marker>
              ))}
          </MapContainer>
        </div>

        <div style={{ padding: 8, textAlign: "center", fontSize: 12, color: "#4b5563", borderTop: "1px solid #e5e7eb", background: "rgba(255,255,255,.7)", backdropFilter: "blur(4px)" }}>
          Demo data only. Add your own Pokémon + image paths + habitats for a full Pokédex map.
        </div>
      </div>
    </div>
  );
}
