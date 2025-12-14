<template>
  <div class="dialog-overlay" @click.self="$emit('close')">
    <div class="dialog-bubble">
      <div class="dialog-header">
          <h3>{{ leaderName }}</h3>
      </div>
      <div class="dialog-content">
          <slot></slot>
          <p class="question">¿Te atreves a aceptar el desafío?</p>
      </div>
      <div class="dialog-actions">
          <button class="btn-yes" @click="$emit('accept')">¡SÍ, Acepto!</button>
          <button class="btn-no" @click="$emit('close')">Mejor me quedo en tierra</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
    leaderName: string;
}>();

defineEmits(['accept', 'close']);
</script>

<style scoped>
.dialog-overlay {
    position: fixed;
    inset: 0;
    z-index: 300;
    display: flex;
    justify-content: center;
    align-items: center; /* Center vertically for Lobby */
    padding-bottom: 50px;
    background: rgba(0,0,0,0.6);
}

.dialog-bubble {
    background: white;
    padding: 24px;
    border-radius: 20px;
    width: min(600px, 90vw);
    box-shadow: 0 10px 40px rgba(0,0,0,0.5);
    border: 4px solid #1565c0;
    position: relative;
    /* Removed the :after triangle because position varies in lobby */
}

.dialog-header h3 {
    margin: 0 0 10px;
    color: #1565c0;
    font-size: 1.4rem;
    border-bottom: 2px solid #eee;
    padding-bottom: 10px;
    text-align: center;
}

.dialog-content {
    color: #333;
    font-size: 1.1rem;
    line-height: 1.5;
    text-align: center;
}

.dialog-content .question {
    font-weight: bold;
    color: #d84315;
    font-size: 1.2rem;
    margin-top: 16px;
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
}

.btn-yes { background: #1565c0; color: white; box-shadow: 0 4px 0 #0d47a1; }
.btn-yes:active { transform: translateY(2px); box-shadow: 0 2px 0 #0d47a1; }

.btn-no { background: #e0e0e0; color: #555; box-shadow: 0 4px 0 #9e9e9e; }
.btn-no:active { transform: translateY(2px); box-shadow: 0 2px 0 #9e9e9e; }
</style>
