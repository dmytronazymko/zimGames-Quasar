
const routes = [
  {
    path: '/physics',
    component: () => import('pages/physics.vue')
  },
  {
    path: '/tennis',
    component: () => import('pages/game/zimTennisContainer.vue')
  },
  {
    path: '/missile',
    component: () => import('pages/game/missileContainer.vue')
  },
  {
    path: '/ninja-parachute',
    component: () => import('pages/game/ninjaParachuteContainer.vue')
  },
  {
    path: '/sample',
    component: () => import('pages/game/sampleContainer.vue')
  },{
    path: '/zim-demo',
    component: () => import('pages/game/zimDemoContainer.vue')
  },{
    path: '/rifle',
    component: () => import('pages/game/rifleContainer.vue')
  },{
    path: '/racing',
    component: () => import('pages/game/zimRacingContainer.vue')
  },{
    path: '/whack',
    component: () => import('pages/game/zimWhackContainer.vue')
  },{
    path: '/ninja-river',
    component: () => import('pages/game/zimNinjaRiverContainer.vue')
  },{
    path: '/ninja-jump',
    component: () => import('pages/game/zimNinjaJumpContainer.vue')
  },{
    path: '/monster',
    component: () => import('pages/game/zimMonsterContainer.vue')
  },{
    path: '/tower-defense',
    component: () => import('pages/game/towerDefenseContainer.vue')
  },{
    path: '/shooting-bee',
    component: () => import('pages/game/shootingBeeContainer.vue')
  },{
    path: '/path-demo',
    component: () => import('pages/game/pathDemo.vue')
  },{
    path: '/zombie',
    component: () => import('pages/game/zombieContainer.vue')
  },{
    path: '/ninja-fight2',
    component: () => import('pages/game/ninjaFight2Container.vue')
  },{
    path: '/ninja-ghost-leg',
    component: () => import('pages/game/zimNinjaGhostLegContainer.vue')
  },{
    path: '/ninja-shooting',
    component: () => import('pages/game/ninjaShootingContainer.vue')
  }, {
	path: '/ninja-wheel',
	component: () => import('pages/game/ninjaWheelContainer.vue')
  },  {
	path: '/ninja-slash',
	component: () => import('pages/game/ninjaslashContainer.vue')
  },{
	path: '/ninja-jezzball',
	component: () => import('pages/game/ninjaJezzballContainer.vue')
  },{
    path: '/flappy-bird',
    component: () => import('pages/game/flappyBirdContainer.vue')
  },{
    path: '/ninja-fight',
    component: () => import('pages/game/ninjaFightContainer.vue')
  },{
    path: '/snake',
    component: () => import('pages/game/zimSnakeContainer.vue')
  },{
    path: '/running',
    component: () => import('pages/game/runningContainer.vue')
  },{
    path: '/sumpuzzle',
    component: () => import('pages/game/sumpuzzleContainer.vue')
  },{
    path: '/sumcrush',
    component: () => import('pages/game/sumcrushContainer.vue')
  },{
    path: '/ninjahole',
    component: () => import('pages/game/ninjaholeContainer.vue')
  },{
    path: '/ninjadart',
    component: () => import('pages/game/ninjadartContainer.vue')
  },{
    path: '/arithmetic',
    component: () => import('pages/game/ArithmeticContainer.vue')
  },{
    path: '/',
    component: () => import('pages/Index.vue')
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
