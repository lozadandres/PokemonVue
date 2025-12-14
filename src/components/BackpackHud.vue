<template>
  <div class="backpack-hud">
    <!-- Backpack Button (Bottom Left) -->
    <button class="backpack-btn" @click="isOpen = true">
        🎒 Mochila
    </button>

    <!-- Modal -->
    <div v-if="isOpen" class="modal-overlay" @click.self="isOpen = false">
        <div class="backpack-modal">
            <div class="modal-header">
                <h2>Mochila Pokémon</h2>
                <button class="close-btn" @click="isOpen = false">X</button>
            </div>

            <div class="modal-content">
                <div v-if="loading" class="loading-state">Cargando datos de la mochila...</div>
                <div v-else-if="pokemonDataList.length === 0" class="empty-msg">
                    Aún no has capturado ningún Pokémon.
                </div>
                <div v-else class="pokemon-grid">
                    <PokemonCard
                        v-for="poke in pokemonDataList"
                        :key="poke.name"
                        :name="poke.name"
                        :sprite="poke.sprite"
                        :types="poke.types"
                    />
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useMapStore } from '../stores/mapStore';
import PokemonCard from './PokemonCard.vue';

interface PokemonData {
    name: string;
    sprite: string;
    types: string[];
}

const mapStore = useMapStore();
const isOpen = ref(false);
const loading = ref(false);
const pokemonDataList = ref<PokemonData[]>([]);

const capturedPokemonNames = computed(() => mapStore.myPokemon);

// Fetch data when modal opens
watch(isOpen, async (newVal) => {
    if (newVal) {
        await fetchBackpackData();
    }
});

const fetchBackpackData = async () => {
    loading.value = true;
    pokemonDataList.value = [];

    // Create promises for all captured pokemon
    const promises = capturedPokemonNames.value.map(async (name) => {
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
            if (!response.ok) return null;
            const data = await response.json();
            return {
                name: data.name,
                sprite: data.sprites.front_default,
                types: data.types.map((t: { type: { name: string } }) => t.type.name),
            };
        } catch (e) {
            console.error(`Error fetching ${name}:`, e);
            return null;
        }
    });

    const results = await Promise.all(promises);
    pokemonDataList.value = results.filter((p): p is PokemonData => p !== null);
    loading.value = false;
};
</script>

<style scoped>
.backpack-hud {
    position: fixed;
    bottom: 20px;
    left: 20px;
    z-index: 1000;
}

.backpack-btn {
    background: linear-gradient(135deg, #ff9800, #f57c00);
    color: white;
    border: 2px solid white;
    border-radius: 50px;
    padding: 12px 24px;
    font-size: 1.2rem;
    font-weight: bold;
    cursor: pointer;
    box-shadow: 0 4px 10px rgba(0,0,0,0.3);
    transition: transform 0.2s;
}

.backpack-btn:hover {
    transform: scale(1.05);
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0,0,0,0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2000;
}

.backpack-modal {
    background: white;
    width: min(800px, 90vw);
    height: min(600px, 80vh);
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0,0,0,0.5);
}

.modal-header {
    background: #ff9800;
    padding: 15px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: white;
}

.modal-header h2 { margin: 0; }

.close-btn {
    background: rgba(255,255,255,0.2);
    border: none;
    color: white;
    font-weight: bold;
    font-size: 1.2rem;
    cursor: pointer;
    padding: 5px 12px;
    border-radius: 8px;
}

.modal-content {
    padding: 20px;
    overflow-y: auto;
    flex-grow: 1;
    background: #f5f5f5;
}

.pokemon-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: center;
}

.empty-msg, .loading-state {
    text-align: center;
    color: #777;
    margin-top: 50px;
    font-size: 1.2rem;
}
</style>
