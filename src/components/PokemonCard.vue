<template>
  <div class="pokemon-card" :class="typeClass">
    <div class="card-content">
        <img :src="sprite" :alt="name" class="pokemon-sprite" />
        <div class="pokemon-info">
            <h3 class="pokemon-name">{{ capitalizedName }}</h3>
            <div class="pokemon-types">
                <span v-for="t in types" :key="t" class="type-badge">{{ t }}</span>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
    name: string;
    sprite: string;
    types: string[];
}>();

const capitalizedName = computed(() => {
    return props.name.charAt(0).toUpperCase() + props.name.slice(1);
});

const typeClass = computed(() => {
    return props.types.length > 0 ? `type-${props.types[0]}` : '';
});
</script>

<style scoped>
.pokemon-card {
    width: 120px;
    height: 160px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 10px;
    transition: transform 0.2s;
    border: 2px solid #ddd;
}
.pokemon-card:hover { transform: translateY(-5px); }

.pokemon-sprite {
    width: 80px;
    height: 80px;
    image-rendering: pixelated;
}

.pokemon-info {
    width: 100%;
}

.pokemon-name {
    margin: 4px 0;
    font-size: 0.9rem;
    font-weight: bold;
    color: #333;
}

.pokemon-types {
    display: flex;
    justify-content: center;
    gap: 4px;
}

.type-badge {
    font-size: 0.6rem;
    padding: 2px 6px;
    border-radius: 4px;
    background: #eee;
    text-transform: capitalize;
}

/* Type Colors */
.type-fire { border-color: #f44336; background: #ffebee; }
.type-water { border-color: #2196f3; background: #e3f2fd; }
.type-grass { border-color: #4caf50; background: #e8f5e9; }
.type-electric { border-color: #ffeb3b; background: #fffde7; }
.type-bug { border-color: #8bc34a; background: #f1f8e9; }
</style>
