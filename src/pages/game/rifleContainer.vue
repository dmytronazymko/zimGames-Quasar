<template>
  <rifle-game :questions="questions" :noOfLife="2"></rifle-game>
</template>

<script>
import RifleGame from './rifle'
export default {
  name: 'zim-demo-container',
  components: {
    RifleGame
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