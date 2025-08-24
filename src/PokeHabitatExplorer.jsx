import React, { useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";

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
    habitat: "Woodlands and urban parks with abundant berries; near power substations during storms.",
    region: "Kanto (JP analog)",
    appearances: ["Gen I", "Let's Go Pikachu", "Scarlet/Violet"]
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
    coords: [19.4326, -99.1332],
    habitat: "Warm rocky slopes, dormant volcanic foothills; shelters in caves at night.",
    region: "Trans-Mexican Volcanic Belt (analogue)",
    appearances: ["Gen I", "Sword/Shield"]
  }
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

            <MarkerClusterGroup chunkedLoading>
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
            </MarkerClusterGroup>
          </MapContainer>
        </div>

        <div style={{ padding: 8, textAlign: "center", fontSize: 12, color: "#4b5563", borderTop: "1px solid #e5e7eb", background: "rgba(255,255,255,.7)", backdropFilter: "blur(4px)" }}>
          Demo data only. Add your own Pokémon + image paths + habitats for a full Pokédex map.
        </div>
      </div>
    </div>
  );
}
