<template>
  <ninja-fight-game :questions="questions" :noOfLife="2"></ninja-fight-game>
</template>

<script>
import ninjaFightGame from './ninjaFight'
export default {
  name: 'ninja-fight-container',
  components: {
    ninjaFightGame
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