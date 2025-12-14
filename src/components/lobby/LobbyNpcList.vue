<template>
  <div class="lobby-npc-list">
    <h3>NPCs Disponibles</h3>
    <ul>
      <li v-for="npc in npcs" :key="npc.id" class="npc-item">
        <div class="npc-info">
            <img v-if="npc.image" :src="npc.image" alt="npc" class="npc-thumb" />
            <div class="npc-text">
                <span class="npc-name">{{ npc.name }}</span>
                <span class="npc-role">{{ npc.role }}</span>
            </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
export interface LobbyNpc {
    id: number;
    name: string;
    role: string;
    image?: string;
}

defineProps<{
    npcs: LobbyNpc[]
}>();
</script>

<style scoped>
.lobby-npc-list {
    background: rgba(0, 0, 0, 0.6);
    padding: 15px;
    border-radius: 8px;
    color: white;
    width: 250px;
}
h3 { margin-top: 0; color: #ffeb3b; border-bottom: 2px solid #ffeb3b; padding-bottom: 5px; }
ul { list-style: none; padding: 0; }
.npc-item { margin-bottom: 12px; font-size: 0.9rem; }
.npc-info { display: flex; align-items: center; gap: 10px; }
.npc-thumb { width: 40px; height: 40px; object-fit: contain; image-rendering: pixelated; background: rgba(255,255,255,0.1); border-radius: 50%; padding: 2px; border: 1px solid #aaa; }
.npc-text { display: flex; flex-direction: column; }
.npc-name { font-weight: bold; }
.npc-role { color: #aaa; font-style: italic; font-size: 0.8rem; }
</style>
