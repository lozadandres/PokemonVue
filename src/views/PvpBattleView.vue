<template>
  <div class="pvp-view">
    <h1>Arena de Combate PVP</h1>
    <div class="battle-area">
        <p>Buscando oponentes...</p>
        <div class="loader"></div>
    </div>
    <button @click="$router.go(-1)">Salir de la Arena</button>
  </div>
</template>

<style scoped>
.pvp-view {
    padding: 20px;
    color: white;
    background: #1a1a1a;
    min-height: 100vh;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.battle-area {
    margin: 40px;
    padding: 40px;
    border: 2px dashed #666;
    border-radius: 12px;
}
.loader {
    border: 4px solid #f3f3f3;
    border-top: 4px solid #e53935;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
    margin: 20px auto;
}
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
button { padding: 10px 20px; cursor: pointer; background: #e53935; color: white; border: none; border-radius: 4px; }
</style>
