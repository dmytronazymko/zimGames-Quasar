<template>
  <flappy-bird-game :questions="questions" :noOfLife="1"></flappy-bird-game>
</template>

<script>
import flappyBirdGame from './flappyBird'
export default {
  name: 'flappy-bird-container',
  components: {
    flappyBirdGame
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