<template>
  <whack-game :questions="questions" :noOfLife="2"></whack-game>
</template>

<script>
import WhackGame from './zimWhack'
export default {
  name: 'zim-ninja-river-container',
  components: {
    WhackGame
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