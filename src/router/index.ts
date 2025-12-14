// src/router/index.ts

import { createRouter, createWebHistory } from 'vue-router';
import WorldMapViewPage from '../views/WorldMapViewPage.vue';
import ZoneBosqueVerdoso from '../views/ZoneBosqueVerdoso.vue';
import ZoneCuevaIgnea from '../views/ZoneCuevaIgnea.vue';
import ZoneCostaTormentosa from '../views/ZoneCostaTormentosa.vue';
import ZoneLobbyWrapper from '../views/ZoneLobbyWrapper.vue';
import MissionsView from '../views/MissionsView.vue';
import PvpBattleView from '../views/PvpBattleView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: '/mapa',
    },
    {
      path: '/mapa',
      name: 'world-map',
      component: WorldMapViewPage,
    },
    // Dynamic Lobby Route
    {
      path: '/zone/:id',
      name: 'zone-lobby',
      component: ZoneLobbyWrapper,
    },
    // Actual Gameplay Routes (accessed from Lobby)
    {
      path: '/game/bosque-verdoso',
      name: 'game-bosque',
      component: ZoneBosqueVerdoso,
    },
    {
      path: '/game/cueva-ignea',
      name: 'game-cueva',
      component: ZoneCuevaIgnea,
    },
    {
      path: '/game/costa-tormentosa',
      name: 'game-costa',
      component: ZoneCostaTormentosa,
    },
    {
      path: '/missions',
      name: 'missions',
      component: MissionsView,
    },
    {
      path: '/pvp',
      name: 'pvp',
      component: PvpBattleView,
    },
  ],
});

export default router;
