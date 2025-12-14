<template>
  <div class="npc leader-lobby" :title="name" @click="$emit('interact')">
    <div class="npc-sprite">
        <img :src="image" :alt="name" class="npc-image large" />
    </div>
    <div class="npc-label leader">{{ name }}</div>
    <div class="interaction-hint">!</div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
    name: string;
    image: string;
}>();

defineEmits(['interact']);
</script>

<style scoped>
/* Copied styles for consistent "World" look */
.npc.leader-lobby {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 20px auto;
    cursor: pointer;
    transform: scale(1.2);
    /* Ensure it stands out */
    z-index: 50;
}

.npc-sprite { position: relative; }

.npc-image.large {
    width: 110px;
    height: 130px;
    object-fit: contain;
    image-rendering: pixelated;
    filter: drop-shadow(0 4px 8px rgba(0,0,0,0.5));
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
    left: 50%;
    transform: translateX(-50%);
}

@keyframes bounce { 0%, 100% { transform: translate(-50%, 0); } 50% { transform: translate(-50%, -5px); } }
</style>
