<template>
  <div class="npc leader" :style="positionStyle" @click="$emit('interact')">
    <div class="npc-sprite">
      <img :src="image" :alt="name" class="npc-image large" />
    </div>
    <div class="npc-label leader">{{ name }}</div>
    <div class="interaction-hint">!</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  name: string;
  image: string;
  x: number;
  y: number;
}>();

defineEmits(['interact']);

const positionStyle = computed(() => ({
  left: `${props.x}%`,
  top: `${props.y}%`
}));
</script>

<style scoped>
.npc {
  position: absolute;
  transform: translate(-50%, -50%);
  z-index: 40;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
}

.npc-sprite {
  position: relative;
}

.npc-image.large {
  width: 110px;
  height: 130px;
  object-fit: contain;
  image-rendering: pixelated;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.5));
}

.npc-label {
  margin-top: 4px;
  padding: 3px 10px;
  color: white;
  font-size: 0.7rem;
  font-weight: 600;
  border-radius: 10px;
  text-align: center;
}

.npc-label.leader {
  background: linear-gradient(135deg, #e65100, #bf360c);
  border: 2px solid gold;
}

.interaction-hint {
  position: absolute;
  top: -20px;
  font-weight: bold;
  color: yellow;
  animation: bounce 1s infinite;
  text-shadow: 0 2px 4px black;
  font-size: 1.5rem;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}
</style>
