<template>
  <racing-game :questions="questions" :noOfLife="2"></racing-game>
</template>

<script>
import RacingGame from './zimRacing'
export default {
  name: 'zim-racing-container',
  components: {
    RacingGame
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