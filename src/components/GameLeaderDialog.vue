<template>
  <div class="dialog-overlay" @click.self="$emit('close')">
    <div class="dialog-bubble" :style="{ borderColor: color }">
      <div class="dialog-header">
          <h3 :style="{ color: color, borderBottomColor: color }">{{ leaderName }}</h3>
      </div>
      <div class="dialog-content">
          <slot></slot>
          <p v-if="!accepted" class="question" :style="{ color: questionColor }">¿Aceptas el desafío de la naturaleza?</p>
      </div>
      <div class="dialog-actions">
          <template v-if="!accepted">
            <button
                class="btn-yes"
                :style="{ background: color, boxShadow: `0 4px 0 ${darkerColor}` }"
                @click="$emit('accept')"
                @mousedown="activeBtn($event, true)"
                @mouseup="activeBtn($event, false)"
                @mouseleave="activeBtn($event, false)"
            >
                ¡SÍ, Acepto!
            </button>
            <button class="btn-no" @click="$emit('close')">No por ahora</button>
          </template>
          <template v-else>
               <button class="btn-no" @click="$emit('close')">¡En eso estoy!</button>
          </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
    leaderName: string;
    color?: string; // Main theme color (e.g., #2e7d32)
    accepted?: boolean;
}>();

defineEmits(['accept', 'close']);

const color = computed(() => props.color || '#1565c0');

// Calculate darker variant for shadow/active states (simplified)
const darkerColor = computed(() => {
    // Very basic darkening for demo purposes, or we can just use the same color with opacity
    return color.value; // In a real app, use a color manipulator
});

const questionColor = '#d84315';

const activeBtn = (e: MouseEvent, active: boolean) => {
    const btn = e.target as HTMLElement;
    btn.style.transform = active ? 'translateY(2px)' : 'none';
};
</script>

<style scoped>
.dialog-overlay {
    position: fixed;
    inset: 0;
    z-index: 500;
    display: flex;
    justify-content: center;
    align-items: flex-end; /* Game view style (bottom) */
    padding-bottom: 50px;
    background: rgba(0,0,0,0.4);
}

.dialog-bubble {
    background: white;
    padding: 24px;
    border-radius: 20px;
    width: min(600px, 90vw);
    box-shadow: 0 10px 40px rgba(0,0,0,0.3);
    border-width: 4px;
    border-style: solid;
    position: relative;
}

/* Triangle indicator */
.dialog-bubble::after {
    content: '';
    position: absolute;
    bottom: -20px;
    right: 40px;
    border-width: 20px 20px 0;
    border-style: solid;
    border-color: inherit; /* Inherit border color from parent */
    border-left-color: transparent;
    border-right-color: transparent;
    border-bottom-color: transparent;
    display: block;
    width: 0;
}

.dialog-header h3 {
    margin: 0 0 10px;
    font-size: 1.4rem;
    border-bottom-width: 1px;
    border-bottom-style: solid;
}

.dialog-content {
    font-size: 1.1rem;
    line-height: 1.5;
    margin-bottom: 12px;
    color: #333;
}

.dialog-content .question {
    font-weight: bold;
    font-size: 1.2rem;
    margin-top: 16px;
    text-align: center;
}

.dialog-actions {
    display: flex;
    gap: 16px;
    margin-top: 20px;
}

.btn-yes, .btn-no {
    flex: 1;
    padding: 12px;
    font-size: 1.1rem;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    font-weight: bold;
    transition: transform 0.1s;
    color: white;
}

.btn-no { background: #e0e0e0; color: #555; box-shadow: 0 4px 0 #9e9e9e; }
.btn-no:active { transform: translateY(2px); box-shadow: 0 2px 0 #9e9e9e; }
</style>
