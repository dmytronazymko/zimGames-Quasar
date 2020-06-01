<template>
  <tennis-game :questions="questions" :noOfLife="2"></tennis-game>
</template>

<script>
import TennisGame from './zimTennis'
export default {
  name: 'zim-demo-container',
  components: {
    TennisGame
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