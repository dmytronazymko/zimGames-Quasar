<template>
  <ninja-jezzball-game :questions="questions" :noOfLife="2"></ninja-jezzball-game>
</template>

<script>
import NinjaJezzballGame from "./ninjaJezzball";
export default {
  name: "ninja-jezzball-container",
  components: {
    NinjaJezzballGame
  },
  computed: {
    questions () {
      return [
        { title: '21 × 2 - 20 - 7', options: [ {value: 17, correct: false}, {value: 13, correct: false}, {value: 15, correct: true} ] },
        { title: '16 ÷ 4 + 7 - 2 × 3', options: [ {value: 5, correct: true}, {value: 4, correct: false}, {value: 3, correct: false} ] }
      ]
    }
  }
};
</script>