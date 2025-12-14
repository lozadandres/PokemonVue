<template>
  <div class="zone-lobby-wrapper">
    <!-- Dispatcher based on ID -->
    <component :is="activeLobbyComponent" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import LobbyBosqueVerdoso from './LobbyBosqueVerdoso.vue';
import LobbyCuevaIgnea from './LobbyCuevaIgnea.vue';
import LobbyCostaTormentosa from './LobbyCostaTormentosa.vue';

const route = useRoute();

const activeLobbyComponent = computed(() => {
    const id = route.params.id;
    // Map ID to Lobby Component
    switch (String(id)) {
        case '1': return LobbyBosqueVerdoso; // Bosque Verdoso (ID 1 in mapStore)
        case '2': return LobbyCuevaIgnea;    // Cueva Ignea (ID 2 in mapStore)
        case '3': return LobbyCostaTormentosa; // Costa Tormentosa (ID 3 in mapStore)
        default:
            console.warn('Unknown Zone ID:', id);
            return null;
    }
});
</script>
