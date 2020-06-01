<template>
  <ninja-ghost-leg-game :questions="questions" :noOfLife="2"></ninja-ghost-leg-game>
</template>

<script>
import NinjaGhostLegGame from './zimNinjaGhostLeg'
export default {
  name: 'ninja-ghost-leg-container',
  components: {
    NinjaGhostLegGame
  },
  computed: {
    questions () {
      return [
        { title: 'Multiple of 3', options: [ {value: 7, correct: false}, {value: 6, correct: true}, {value: 5, correct: false} ] },
        { title: 'Multiple of 2', options: [ {value: 9, correct: false}, {value: 4, correct: true}, {value: 5, correct: false} ] }
      ]
    }
  }
}
</script>