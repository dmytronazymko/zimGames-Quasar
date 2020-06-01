<template>
  <monster-game :questions="questions" :noOfLife="2"></monster-game>
</template>

<script>
import monsterGame from './zimMonster'
export default {
  name: 'monster-container',
  components: {
    monsterGame
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