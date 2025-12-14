<template>
  <div class="missions-view">
    <h1>Misiones de la Zona</h1>
    <div class="mission-list">
        <div class="mission-card">
            <h3>Captura Inicial</h3>
            <p>Captura 2 Pokémon de la zona.</p>
            <span class="reward">Recompensa: 500 Monedas</span>
        </div>
        <div class="mission-card">
            <h3>Búsqueda del Tesoro</h3>
            <p>Encuentra 2 objetos ocultos.</p>
            <span class="reward">Recompensa: 2 Super Pociones</span>
        </div>
    </div>
    <button @click="$router.go(-1)">Volver</button>
  </div>
</template>

<style scoped>
.missions-view {
    padding: 20px;
    color: white;
    background: #333;
    min-height: 100vh;
    text-align: center;
}
.mission-card {
    background: rgba(255,255,255,0.1);
    margin: 10px auto;
    padding: 15px;
    border-radius: 8px;
    max-width: 400px;
}
.reward { color: gold; font-weight: bold; }
button { margin-top: 20px; padding: 10px 20px; cursor: pointer; }
</style>
