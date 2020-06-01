<template>
  <ninja-fight2-game :questions="questions" :noOfLife="2"></ninja-fight2-game>
</template>

<script>
import ninjaFight2Game from './ninjaFight2'
export default {
  name: 'ninja-fight2-container',
  components: {
    ninjaFight2Game
  },
  computed: {
    questions () {
      return [
        [ { title: '1 + 1', answer: 2}, { title: '1 + 2', answer: 3 }, { title: '1 + 3', answer: 4 } ],
        [ { title: '2 + 2', answer: 4}, { title: '2 + 3', answer: 5 }, { title: '2 + 4', answer: 6 } ]
      ]
    }
  }
}
</script>