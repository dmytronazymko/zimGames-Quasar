<template>
  <ninja-slash-game :questions="questions" :noOfLife="2"></ninja-slash-game>
</template>

<script>
import NinjaSlashGame from "./ninjaslash";
export default {
  name: "ninja-slash-container",
  components: {
    NinjaSlashGame
  },
  computed: {
    questions () {
      return [
        { title: '14 + 2 = ?', options: [ {value: 20, correct: false}, {value: 18, correct: false}, {value: 16, correct: true} ] },
        { title: '6 + 7 = ?', options: [ {value: 13, correct: true}, {value: 12, correct: false}, {value: 14, correct: false} ] }
      ]
    }
  }
};
</script>