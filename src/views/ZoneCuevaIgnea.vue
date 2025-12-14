<template>
  <div class="gym-zone">
    <div class="gym-header">
      <button class="back-btn" @click="goBack">← Volver al Mapa</button>
      <div class="gym-info">
        <h1>Cueva Ígnea</h1>
        <p>Tipo: Fuego/Roca</p>
      </div>
      <div class="stats-bar">
        <span class="stat-item">Pasos: {{ stepCount }}</span>
        <span class="stat-item">Pokémon: {{ pokemonCaptured }}/2</span>
        <span class="stat-item">Objetos: {{ itemsFound }}/2</span>
      </div>
    </div>

    <div class="gym-map-container">
      <div ref="mapCanvas" class="map-canvas">
        <img ref="mapImg" :src="zoneImage" alt="Cueva Ignea" class="map-image" />

        <PlayerCharacter :x="playerPosition.x" :y="playerPosition.y" :is-moving="isMoving" :image-src="playerImage" label="Jugador" />

         <!-- Leader NPC -->
         <GameLeader
            name="Líder Vulcano"
            :image="leaderImage"
            :x="leaderPos.x"
            :y="leaderPos.y"
            @interact="interactWithLeader"
        />

        <div class="npc trainer" :style="trainer1Style" v-if="!trainersDefeated.trainer1">
          <div class="npc-sprite"><img :src="playerImage" alt="Montañero Bruno" class="npc-image small" /></div>
          <div class="npc-label trainer">Montañero Bruno</div>
        </div>

        <div class="npc trainer" :style="trainer2Style" v-if="!trainersDefeated.trainer2">
          <div class="npc-sprite"><img :src="playerImage" alt="Domadora Flavia" class="npc-image small" /></div>
          <div class="npc-label trainer">Domadora Flavia</div>
        </div>
      </div>
    </div>

    <!-- Leader Interaction Modal (Bubble Style) -->
    <GameLeaderDialog
        v-if="showLeaderDialog"
        leaderName="Líder Vulcano"
        color="#bf360c"
        :accepted="showRoute"
        @accept="acceptMission"
        @close="showLeaderDialog = false"
    >
        <div v-if="!showRoute">
            <p>
                ¡Alto ahí! El calor de esta cueva no es para los débiles de corazón. Soy <strong>Vulcano</strong>, maestro del fuego.
            </p>
            <p>
                Si quieres enfrentarme, primero debes sobrevivir al calor. Captura 2 Pokémon de tipo roca o fuego y encuentra 2 objetos resistentes al calor.
            </p>
        </div>
        <div v-else>
            <p>
                ¡Tu espíritu arde con determinación! Eso me gusta.
            </p>
            <p>
                No te rindas ante el calor. ¡Demuestra que puedes soportarlo y completa tu misión!
            </p>
        </div>
    </GameLeaderDialog>

    <div class="mobile-controls">
      <div class="control-row"><button class="control-btn" @click="handleMove('up')">↑</button></div>
      <div class="control-row">
        <button class="control-btn" @click="handleMove('left')">←</button>
        <button class="control-btn" @click="handleMove('down')">↓</button>
        <button class="control-btn" @click="handleMove('right')">→</button>
      </div>
    </div>

    <div v-if="currentEncounter?.type === 'pokemon'" class="modal-overlay">
      <div class="modal pokemon-modal">
        <div class="modal-header pokemon"><h2>Pokémon Salvaje</h2></div>
        <div class="modal-content">
          <div class="encounter-info">
            <div class="encounter-name">{{ currentEncounter.data.name }}</div>
            <div class="encounter-level">Nivel {{ currentEncounter.data.level }}</div>
          </div>
          <p class="encounter-text">Un {{ currentEncounter.data.name }} apareció entre las rocas calientes.</p>
        </div>
        <div class="modal-actions">
          <button class="btn-primary" @click="fightPokemon">Pelear</button>
          <button class="btn-secondary" @click="fleePokemon">Huir</button>
        </div>
      </div>
    </div>

    <div v-if="showPokemonResult" class="modal-overlay">
      <div class="modal result-modal">
        <div class="modal-header success"><h2>Victoria</h2></div>
        <div class="modal-content"><p class="result-text">Has derrotado al Pokémon salvaje.</p></div>
        <div class="modal-actions"><button class="btn-primary" @click="closePokemonResult">Continuar</button></div>
      </div>
    </div>

    <div v-if="currentEncounter?.type === 'item'" class="modal-overlay">
      <div class="modal item-modal">
        <div class="modal-header item"><h2>Objeto Encontrado</h2></div>
        <div class="modal-content">
          <div class="item-info"><div class="item-name">{{ currentEncounter.data.name }}</div></div>
          <p class="item-description">{{ currentEncounter.data.description }}</p>
        </div>
        <div class="modal-actions"><button class="btn-primary" @click="collectItem">Recoger</button></div>
      </div>
    </div>

    <!-- ROUTE MARKERS -->
    <div v-if="showRoute" class="route-overlay">
        <div class="route-marker" style="top: 40%; left: 30%">
             <div class="pokeball-icon"></div>
            <span class="marker-label">Charmander</span>
        </div>
        <div class="route-marker" style="top: 70%; left: 60%">
             <div class="pokeball-icon"></div>
            <span class="marker-label">Vulpix</span>
        </div>
        <div class="route-marker" style="top: 25%; left: 75%">
             <div class="pokeball-icon"></div>
            <span class="marker-label">Magmar</span>
        </div>
    </div>
  </div>

  <!-- Backpack Modal -->
  <BackpackHud v-if="showBackpack" @close="showBackpack = false" />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import zoneImage from '../assets/zona/cuevaignea.png'
import playerImage from '../assets/player.png'
import leaderImage from '../assets/lideres/lidercueva.png'
import PlayerCharacter from '../components/PlayerCharacter.vue'
import GameLeader from '../components/GameLeader.vue'
import GameLeaderDialog from '../components/GameLeaderDialog.vue'
import { useKeyboardMovement } from '../composables/useKeyboardMovement'
import BackpackHud from '../components/BackpackHud.vue'

import { useMapStore } from '../stores/mapStore'

const router = useRouter()
const route = useRoute()
const mapStore = useMapStore()

const showBackpack = ref(false)
const showRoute = computed(() => route.query.showRoute === 'true')

const showLeaderDialog = ref(false)

const wildPokemon = [
  { id: 1, name: 'Geodude', level: 12, found: false },
  { id: 2, name: 'Magmar', level: 15, found: false },
]

const items = [
  { id: 1, name: 'Antiquemar', description: 'Cura las quemaduras.', found: false },
  { id: 2, name: 'Super Poción', description: 'Restaura 50 PS.', found: false },
]

type Encounter =
  | { type: 'pokemon'; data: { id: number; name: string; level: number; found: boolean } }
  | { type: 'item'; data: { id: number; name: string; description: string; found: boolean } }

const stepCount = ref(0)
const currentEncounter = ref<Encounter | null>(null)
const showPokemonResult = ref(false)
const pokemonCaptured = ref(0)
const itemsFound = ref(0)
const pokemonDefeated = ref<number[]>([])
const itemsCollected = ref<number[]>([])

// Check for zone completion
const checkCompletion = () => {
  if (pokemonCaptured.value >= 2 && itemsFound.value >= 2) {
    mapStore.completeZone(2) // Cueva Ignea ID
    alert('¡Zona Completada! Se ha desbloqueado la siguiente zona.')
  }
}

const trainersDefeated = ref({ trainer1: false, trainer2: false })
const trainers = {
  trainer1: { name: 'Montañero Bruno', dialogue: '¡La montaña es mi hogar!', pokemon: 'Onix', pokemonLevel: 14, position: { x: 30, y: 55 } },
  trainer2: { name: 'Domadora Flavia', dialogue: '¡El fuego purifica!', pokemon: 'Vulpix', pokemonLevel: 14, position: { x: 65, y: 40 } },
}

// Leader Position
const leaderPos = { x: 85, y: 15 }

const trainer1Style = computed(() => ({ left: `${trainers.trainer1.position.x}%`, top: `${trainers.trainer1.position.y}%` }))
const trainer2Style = computed(() => ({ left: `${trainers.trainer2.position.x}%`, top: `${trainers.trainer2.position.y}%` }))

const { position: playerPosition, isMoving, move } = useKeyboardMovement({
  initialPosition: { x: 50, y: 85 },
  speed: 2,
  bounds: { minX: 10, maxX: 90, minY: 15, maxY: 95 },
  onMove: () => {
    if (!currentEncounter.value) {
      stepCount.value++
      checkRandomEncounter()
    }
  },
})

const handleMove = (direction: 'up' | 'down' | 'left' | 'right') => { if (!currentEncounter.value) move(direction) }

const interactWithLeader = () => {
    showLeaderDialog.value = true
}

const acceptMission = () => {
    showLeaderDialog.value = false;
    alert("¡Misión Aceptada! ¡Captura los Pokémon!")
}

const checkRandomEncounter = () => {
  if (stepCount.value % 6 !== 0) return
  const chance = Math.random()
  if (chance < 0.2 && pokemonDefeated.value.length < 2) {
    const available = wildPokemon.filter(p => !pokemonDefeated.value.includes(p.id))
    if (available.length > 0) currentEncounter.value = { type: 'pokemon', data: available[Math.floor(Math.random() * available.length)]! }
    return
  }
  if (chance >= 0.2 && chance < 0.3 && itemsCollected.value.length < 2) {
    const available = items.filter(i => !itemsCollected.value.includes(i.id))
    if (available.length > 0) currentEncounter.value = { type: 'item', data: available[Math.floor(Math.random() * available.length)]! }
  }
}

const fightPokemon = () => {
  if (currentEncounter.value?.type === 'pokemon') {
    pokemonDefeated.value.push(currentEncounter.value.data.id);
    pokemonCaptured.value++;
    currentEncounter.value = null;
    showPokemonResult.value = true;
    checkCompletion();
  }
}
const fleePokemon = () => { currentEncounter.value = null }
const closePokemonResult = () => { showPokemonResult.value = false }
const collectItem = () => {
  if (currentEncounter.value?.type === 'item') {
    itemsCollected.value.push(currentEncounter.value.data.id);
    itemsFound.value++;
    currentEncounter.value = null;
    checkCompletion();
  }
}
const goBack = () => { router.push('/zone/2') }
</script>

<style scoped>
.gym-zone{width:100%;min-height:100vh;background:linear-gradient(135deg,#d84315 0%,#ff8a65 50%,#bf360c 100%);position:relative;overflow:hidden}
.gym-header{position:fixed;top:0;left:0;right:0;display:flex;justify-content:space-between;align-items:center;padding:12px 20px;background:linear-gradient(to bottom,rgba(0,0,0,0.85),rgba(0,0,0,0.5),transparent);z-index:100}
.back-btn{padding:8px 16px;background:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.3);color:white;border-radius:20px;cursor:pointer;font-weight:500}
.gym-info{text-align:center;color:white}
.stats-bar{display:flex;gap:12px}
.stat-item{padding:6px 12px;background:rgba(0,0,0,0.6);border-radius:15px;color:white;font-size:.75rem;font-weight:500}
.gym-map-container{width:100%;height:100vh;display:flex;align-items:center;justify-content:center;padding:80px 20px 20px}
.map-canvas{position:relative;width:min(600px,90vw);aspect-ratio:2/3;border-radius:12px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,.4)}
.map-image{position:absolute;inset:0;width:100%;height:100%;pointer-events:none; object-fit: cover;}
.npc{position:absolute;transform:translate(-50%,-50%);z-index:40;display:flex;flex-direction:column;align-items:center}
.npc.leader { cursor: pointer; }
.npc-sprite{position:relative}
.npc-image{width:100px;height:120px;object-fit:contain;image-rendering:pixelated;filter:drop-shadow(0 4px 8px rgba(0,0,0,.5))}
.npc-image.small{width:80px;height:100px}
.npc-image.large{width:110px;height:130px}
.npc-label{margin-top:4px;padding:3px 10px;color:white;font-size:.7rem;font-weight:600;border-radius:10px;text-align:center}
.npc-label.trainer{background:linear-gradient(135deg,#1565c0,#0d47a1)}
/* CSS Cleaned up - GameLeader component handles specific styles */

/* Dialog Styles handled by GameLeaderDialog */

/* ... (Rest of existing styles) ... */
.mobile-controls{display:none;position:fixed;bottom:20px;right:20px;z-index:100;flex-direction:column;gap:4px}
.control-row{display:flex;justify-content:center;gap:4px}
.control-btn{width:50px;height:50px;border:none;border-radius:12px;background:rgba(255,255,255,.9);font-size:1.2rem;font-weight:bold;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,.15)}
@media (max-width:768px),(hover:none){.mobile-controls{display:flex}}
.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.8);display:flex;align-items:center;justify-content:center;z-index:200}
.modal{background:#f5f5f5;border-radius:12px;width:min(380px,90vw);overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,.5)}
.modal-header{padding:16px;text-align:center;color:white}
.modal-header.pokemon{background:linear-gradient(135deg,#7cb342,#558b2f)}
.modal-header.item{background:linear-gradient(135deg,#ff8f00,#e65100)}
.modal-header.success{background:linear-gradient(135deg,#43a047,#2e7d32)}
.modal-content{padding:20px;text-align:center}
.encounter-info{margin-bottom:12px}
.encounter-name{font-size:1.3rem;font-weight:bold;color:#333}
.encounter-level{font-size:.9rem;color:#666}
.encounter-text{font-size:.95rem;color:#555;line-height:1.5;margin-bottom:12px}
.modal-actions{display:flex;gap:10px;padding:16px;background:rgba(0,0,0,.05)}
.btn-primary,.btn-secondary{flex:1;padding:12px;border:none;border-radius:8px;font-size:.95rem;font-weight:600;cursor:pointer}
.btn-primary{background:linear-gradient(135deg,#43a047,#2e7d32);color:white}
.btn-secondary{background:linear-gradient(135deg,#757575,#424242);color:white}

/* Route Marker Styles */
.route-marker {
    position: absolute;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 500;
    animation: float 2s infinite ease-in-out;
}

.pokeball-icon {
    width: 40px;
    height: 40px;
    background: radial-gradient(white 33%, black 33%, black 40%, transparent 40%),
                linear-gradient(to bottom, #f44336 48%, black 48%, black 52%, white 52%);
    border: 3px solid black;
    border-radius: 50%;
    box-shadow: 0 4px 8px rgba(0,0,0,0.5);
    cursor: pointer;
    transition: transform 0.2s;
}

.pokeball-icon:hover {
    transform: scale(1.2) rotate(180deg);
}

.marker-label {
    margin-top: 5px;
    background: rgba(0,0,0,0.8);
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.8rem;
    white-space: nowrap;
    opacity: 0;
    transition: opacity 0.3s;
    pointer-events: none;
}

.route-marker:hover .marker-label {
    opacity: 1;
}

@keyframes float {
    0%, 100% { transform: translate(-50%, -50%); }
    50% { transform: translate(-50%, -60%); }
}
</style>
