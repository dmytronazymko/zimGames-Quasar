<template>
  <ninja-wheel-game :questions="questions" :noOfLife="2"></ninja-wheel-game>
</template>

<script>
import NinjaWheelGame from "./ninjaWheel";
export default {
  name: "ninja-wheel-container",
  components: {
    NinjaWheelGame
  },
  computed: {
    questions () {
      return [
        { title: 'Multiple of 3', options: [ {value: 5, correct: false}, {value: 4, correct: false}, {value: 6, correct: true} ] },
        { title: 'Multiple of 2', options: [ {value: 7, correct: false}, {value: 5, correct: false}, {value: 3, correct: false}, {value: 4, correct: true}] },
      ]
    }
  }
};
</script>