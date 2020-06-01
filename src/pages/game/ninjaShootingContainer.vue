<template>
  <ninja-shooting-game :questions="questions" :noOfLife="2"></ninja-shooting-game>
</template>

<script>
import NinjaShootingGame from './ninjaShooting'
export default {
  name: 'ninja-shooting-container',
  components: {
    NinjaShootingGame
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