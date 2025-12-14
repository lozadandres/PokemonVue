<template>
  <div class="lobby-player-list">
    <h3>Jugadores Online</h3>
    <ul>
      <li v-for="player in players" :key="player.id" class="player-item">
        <span class="status-indicator">●</span>
        <span class="player-name">{{ player.name }}</span>
        <span class="player-level">Lv. {{ player.level }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
export interface OnlinePlayer {
    id: number;
    name: string;
    level: number;
}

defineProps<{
    players: OnlinePlayer[]
}>();
</script>

<style scoped>
.lobby-player-list {
    background: rgba(0, 0, 0, 0.6);
    padding: 15px;
    border-radius: 8px;
    color: white;
    width: 250px;
}
h3 { margin-top: 0; color: #4caf50; border-bottom: 2px solid #4caf50; padding-bottom: 5px; }
ul { list-style: none; padding: 0; }
.player-item { display: flex; align-items: center; margin-bottom: 8px; font-size: 0.9rem; }
.status-indicator { color: #4caf50; margin-right: 8px; font-size: 1.2rem; }
.player-name { flex-grow: 1; font-weight: bold; }
.player-level { color: #aaa; font-size: 0.8rem; }
</style>
