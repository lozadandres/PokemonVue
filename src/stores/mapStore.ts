// src/stores/mapStore.ts

import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { SubZoneNode, Zone } from '../types/zone';

// --- Datos de Zonas (Bosque, Cueva, Costa) ---
const initialZones: Zone[] = [
    {
        id: 3,
        name: 'Costa Tormentosa',
        description: 'Una costa azotada por tormentas eléctricas.',
        position: { x: 600, y: 1600 }, // Bottom-Center (Start)
        state: 'active',
        progress: 0,
        nextZoneId: 1,
    },
    {
        id: 1,
        name: 'Bosque Verdoso',
        description: 'Un bosque lleno de vida y Pokémon bicho.',
        position: { x: 200, y: 400 }, // Top-Left
        state: 'locked',
        progress: 0,
        requirements: 'Completar "Costa Tormentosa"',
        nextZoneId: 2,
    },
    {
        id: 2,
        name: 'Cueva Ígnea',
        description: 'Una cueva volcánica de intenso calor.',
        position: { x: 1000, y: 400 }, // Top-Right
        state: 'locked',
        progress: 0,
        requirements: 'Completar "Bosque Verdoso"',
    },
];

export const useMapStore = defineStore('map', () => {
    // STATE
    const zones = ref<Zone[]>(initialZones);
    const selectedZoneId = ref<number | null>(null);
    const capturedPokemon = ref<string[]>([
        'pikachu',
        'eevee',
        'bulbasaur',
        'charmander',
        'squirtle'
    ]); // Initial list for demo

    // GETTERS
    const allZones = computed(() => zones.value);
    const myPokemon = computed(() => capturedPokemon.value);

    const getSelectedZone = computed<Zone | null>(() => {
        if (selectedZoneId.value === null) return null;
        return zones.value.find(z => z.id === selectedZoneId.value) || null;
    });

    // ACTIONS
    function setSelectedZone(zone: Zone | null) {
        selectedZoneId.value = zone ? zone.id : null;
    }

    function capturePokemon(name: string) {
        if (!capturedPokemon.value.includes(name.toLowerCase())) {
            capturedPokemon.value.push(name.toLowerCase());
            console.log(`¡Capturaste a ${name}!`);
        }
    }

    /**
     * Obtiene una zona por su ID
     */
    function getZoneById(zoneId: number): Zone | null {
        return zones.value.find(z => z.id === zoneId) || null;
    }

    /**
     * Obtiene los nodos de sub-zona para una zona específica
     * Retorna una copia profunda para evitar mutaciones directas
     */
    function getSubZoneNodes(zoneId: number): SubZoneNode[] | undefined {
        const zone = zones.value.find(z => z.id === zoneId);
        if (!zone?.subZoneMap?.nodes) return undefined;
        return JSON.parse(JSON.stringify(zone.subZoneMap.nodes));
    }

    /**
     * Actualiza el estado de un nodo de sub-zona
     */
    function updateSubZoneNodeState(zoneId: number, nodeId: string, newState: 'active' | 'completed') {
        const zone = zones.value.find(z => z.id === zoneId);
        if (!zone?.subZoneMap) return;

        const node = zone.subZoneMap.nodes.find(n => n.id === nodeId);
        if (node) {
            node.state = newState;

            // Recalcular progreso (solo nodos de tipo 'mission' y 'wild_pokemon')
            const missionNodes = zone.subZoneMap.nodes.filter(
                n => n.type === 'mission' || n.type === 'wild_pokemon'
            );
            const completedMissions = missionNodes.filter(n => n.state === 'completed').length;
            const totalMissions = missionNodes.length;

            if (totalMissions > 0) {
                zone.progress = Math.floor((completedMissions / totalMissions) * 100);
            }
        }
    }

    /**
     * Marca una zona como completada y activa la siguiente
     */
    function completeZone(zoneId: number) {
        const zoneIndex = zones.value.findIndex(z => z.id === zoneId);
        if (zoneIndex === -1) return;

        const zone = zones.value[zoneIndex];
        if (!zone) return;

        zone.state = 'completed';
        zone.progress = 100;

        // Activar la siguiente zona si existe
        const nextZoneId = zone.nextZoneId;
        if (nextZoneId) {
            const nextZone = zones.value.find(z => z.id === nextZoneId);
            if (nextZone && nextZone.state === 'locked') {
                nextZone.state = 'active';
                nextZone.progress = 0;
                delete nextZone.requirements;
            }
        }

        setSelectedZone(null);
        console.log(`Zona ${zoneId} completada. ¡Progreso guardado!`);
    }

    /**
     * Desbloquea la siguiente zona
     */
    function unlockNextZone(currentZoneId: number): Zone | null {
        const currentZone = zones.value.find(z => z.id === currentZoneId);
        if (!currentZone?.nextZoneId) return null;

        const nextZone = zones.value.find(z => z.id === currentZone.nextZoneId);
        if (!nextZone) return null;

        if (nextZone.state === 'locked') {
            nextZone.state = 'active';
            nextZone.progress = 0;
            delete nextZone.requirements;
            console.log(`Zona "${nextZone.name}" desbloqueada.`);
            return nextZone;
        }

        return null;
    }

    return {
        // State & Getters
        allZones,
        getSelectedZone,
        myPokemon,
        // Actions
        setSelectedZone,
        getZoneById,
        getSubZoneNodes,
        updateSubZoneNodeState,
        completeZone,
        unlockNextZone,
        capturePokemon,
    };
});
