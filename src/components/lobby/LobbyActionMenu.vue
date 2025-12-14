<template>
  <div class="lobby-action-menu">
    <h3>Acciones</h3>
    <button class="action-btn capture" @click="$emit('start-capture')">
        <span class="icon">🔍</span> Iniciar Captura
    </button>
    <button class="action-btn missions" @click="$router.push('/missions')">
        <span class="icon">📜</span> Ver Misiones
    </button>
    <button class="action-btn pvp" @click="$router.push('/pvp')">
        <span class="icon">⚔️</span> Batalla PVP
    </button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
// Emits 'start-capture' for the parent to handle specific zone logic if needed
</script>

<style scoped>
.lobby-action-menu {
    display: flex;
    flex-direction: column;
    gap: 10px;
    background: rgba(255, 255, 255, 0.9);
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.3);
    min-width: 200px;
}
h3 { margin: 0 0 10px 0; color: #333; text-align: center; border-bottom: 2px solid #eee; padding-bottom: 8px; }
.action-btn {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: bold;
    font-size: 1rem;
    transition: transform 0.1s, box-shadow 0.1s;
    color: white;
}
.action-btn:active { transform: scale(0.98); }
.icon { margin-right: 10px; font-size: 1.2rem; }

.capture { background: linear-gradient(135deg, #42a5f5, #1976d2); }
.missions { background: linear-gradient(135deg, #ffa726, #f57c00); }
.pvp { background: linear-gradient(135deg, #ef5350, #c62828); }
</style>
