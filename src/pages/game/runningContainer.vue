<template>
  <running-game :questions="questions" :noOfLife="2"></running-game>
</template>

<script>
import RunningGame from "./running";
export default {
  name: "running-container",
  components: {
    RunningGame
  },
  computed: {
    questions () {
      return [
        { title: '6 + 6 = ?', options: [ {value: 13, correct: false}, {value: 14, correct: false}, {value: 12, correct: true} ] },
        { title: '12 - 7 = ?', options: [ {value: 5, correct: true}, {value: 6, correct: false}, {value: 7, correct: false} ] }
      ]
    }
  }
};
</script>