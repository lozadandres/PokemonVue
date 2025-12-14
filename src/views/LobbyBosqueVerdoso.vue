<template>
  <div class="lobby-view">
    <!-- GAME LAYER: Background & Interactive Elements -->
    <div class="lobby-map-container">
        <img :src="lobbyImage" alt="Lobby Bosque Verdoso" class="lobby-bg" />

        <PlayerCharacter
            :x="playerPosition.x"
            :y="playerPosition.y"
            :is-moving="isMoving"
            :image-src="playerImage"
            label="Jugador"
        />

        <!-- Leader positioned in the world -->
        <div class="world-leader-container" style="left: 50%; top: 40%">
            <LobbyLeader
                name="Líder Flora"
                :image="leaderImage"
                @interact="showLeaderDialog = true"
            />
        </div>
    </div>

    <!-- UI LAYER: HUD & Menus -->
    <div class="lobby-ui-overlay">
        <div class="lobby-header">
            <h1>Lobby: Bosque Verdoso</h1>
            <button class="back-btn" @click="goBack"> Volver al Mapa</button>
        </div>
        <!-- LISTS LAYOUT -->
        <div class="lobby-layout">
            <!-- Left: NPC List (Ref: npcs) -->
            <div class="panel-left">
                <div class="panel-header">
                    <h3>NPCs Locales ({{ npcs.length }})</h3>
                    <button class="action-btn-small" @click="addVisitor">➕ Agregar Visitante</button>
                </div>
                <LobbyNpcList :npcs="npcs" />
            </div>

            <!-- Right: Player List (Condition: showPlayers) -->
            <div class="panel-right">
                <div class="panel-header">
                    <h3>Entrenadores Online</h3>
                    <label class="switch">
                        <input type="checkbox" v-model="showPlayers">
                        <span class="slider round"></span>
                    </label>
                </div>
                <LobbyPlayerList v-if="showPlayers" :players="onlinePlayers" />
                <div v-else class="offline-msg">Lista oculta por el usuario</div>
            </div>
        </div>

        <div class="lobby-actions">
            <LobbyActionMenu @start-capture="handleStartCapture" />
        </div>
    </div>

    <!-- MODALS -->
    <LeaderInteractionModal
        v-if="showLeaderDialog"
        leaderName="Líder Flora"
        @accept="startAsyncSearch"
        @close="showLeaderDialog = false"
    >
        <p>¡Bienvenido al Bosque Verdoso! Soy Flora, y protejo este ecosistema.</p>
        <p>Necesito tu ayuda para investigar la fauna local. Deberás capturar 2 Pokémon tipo Bicho/Planta y encontrar 2 muestras biológicas.</p>
    </LeaderInteractionModal>

    <!-- ASYNC SEARCH OVERLAY -->
    <div v-if="isSearching" class="searching-overlay">
        <div class="searching-content">
            <div class="spinner"></div>
            <h2>Buscando Pokémon salvaje...</h2>
            <p>Rastreando señales en la zona...</p>
        </div>
    </div>

    <BackpackHud />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import lobbyImage from '../assets/loby/lobybosqueverdoso.png';
import playerImage from '../assets/player.png';
import leaderImage from '../assets/lideres/liderbosque.png';
import LobbyLeader from '../components/lobby/LobbyLeader.vue';
import LobbyNpcList, { type LobbyNpc } from '../components/lobby/LobbyNpcList.vue';
import LobbyPlayerList from '../components/lobby/LobbyPlayerList.vue';
import LobbyActionMenu from '../components/lobby/LobbyActionMenu.vue';
import LeaderInteractionModal from '../components/lobby/LeaderInteractionModal.vue';
import BackpackHud from '../components/BackpackHud.vue';
import PlayerCharacter from '../components/PlayerCharacter.vue';
import { useKeyboardMovement } from '../composables/useKeyboardMovement';

const router = useRouter();
const showLeaderDialog = ref(false);
const showPlayers = ref(true); // State 2: Conditional Rendering
const isSearching = ref(false); // State 3: Async State

// Movement Logic
const { position: playerPosition, isMoving } = useKeyboardMovement({
  initialPosition: { x: 50, y: 80 }, // Start near bottom
  speed: 2,
  bounds: { minX: 5, maxX: 95, minY: 30, maxY: 90 }, // Walkable area
});

// Mock Data (State 1: Reactive List)
const npcs = ref<LobbyNpc[]>([
    { id: 2, name: 'Cazabichos José', role: 'Entrenador' },
    { id: 3, name: 'Jardinera Rosa', role: 'Entrenador' },
    { id: 4, name: 'Enfermera Joy', role: 'Sanadora' },
]);
const onlinePlayers = ref([{ id: 1, name: 'Red', level: 25 }, { id: 2, name: 'Blue', level: 24 }]);

// Feature A: Add Visitor
const addVisitor = () => {
    npcs.value.push({
        id: Date.now(),
        name: `Visitante ${Math.floor(Math.random() * 100)}`,
        role: 'Turista'
    });
};

const handleStartCapture = () => {
    startAsyncSearch();
}

// Feature C: Async Search with Route Parameter
const startAsyncSearch = () => {
    showLeaderDialog.value = false;
    isSearching.value = true;

    setTimeout(() => {
        isSearching.value = false;
        // Pass query param for Game View feature
        router.push({ name: 'game-bosque', query: { showRoute: 'true' } });
    }, 3000);
};

const goBack = () => { router.push('/mapa'); };
</script>

<style scoped>
.lobby-view {
    width: 100%;
    height: 100vh;
    position: relative;
    overflow: hidden;
    background: #000;
}

/* GAME LAYER */
.lobby-map-container {
    position: absolute;
    inset: 0;
    z-index: 0;
}
.lobby-bg {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
.world-leader-container {
    position: absolute;
    transform: translate(-50%, -50%);
    z-index: 10; /* Below UI but above BG */
}

/* UI LAYER */
.lobby-ui-overlay {
    position: absolute;
    inset: 0;
    z-index: 20;
    display: flex;
    flex-direction: column;
    padding: 20px;
    pointer-events: none; /* Let clicks pass through to game */
}

/* Enable clicks on specific UI elements */
.lobby-header, .panel-left, .panel-right, .lobby-actions {
    pointer-events: auto;
}

.lobby-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.lobby-header h1 { color: white; background: rgba(46, 125, 50, 0.8); padding: 10px 20px; border-radius: 8px; margin: 0; box-shadow: 0 4px 6px rgba(0,0,0,0.3); }
.back-btn { padding: 8px 16px; background: rgba(255,255,255,0.2); color: white; border: 1px solid white; border-radius: 4px; cursor: pointer; backdrop-filter: blur(4px); }

.lobby-layout { display: flex; justify-content: space-between; align-items: flex-start; flex-grow: 1; }
.panel-left, .panel-right { display: flex; flex-direction: column; gap: 10px; min-width: 250px; }

.panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: rgba(0,0,0,0.6);
    padding: 8px 12px;
    border-radius: 8px;
    color: white;
}
.panel-header h3 { margin: 0; font-size: 1rem; }

.action-btn-small {
    background: #4caf50;
    border: none;
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.8rem;
}
.action-btn-small:hover { background: #43a047; }

.offline-msg {
    color: #bbb;
    font-style: italic;
    background: rgba(0,0,0,0.5);
    padding: 10px;
    border-radius: 8px;
    text-align: center;
}

.lobby-actions { position: absolute; bottom: 20px; right: 20px; }

/* Switch Styles */
.switch { position: relative; display: inline-block; width: 40px; height: 20px; }
.switch input { opacity: 0; width: 0; height: 0; }
.slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 20px; }
.slider:before { position: absolute; content: ""; height: 16px; width: 16px; left: 2px; bottom: 2px; background-color: white; transition: .4s; border-radius: 50%; }
input:checked + .slider { background-color: #2196F3; }
input:checked + .slider:before { transform: translateX(20px); }

/* Searching Overlay */
.searching-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.85);
    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
}
.searching-content { text-align: center; }
.spinner {
    border: 6px solid #f3f3f3;
    border-top: 6px solid #4CAF50;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: spin 1s linear infinite;
    margin: 0 auto 20px;
}
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
</style>
