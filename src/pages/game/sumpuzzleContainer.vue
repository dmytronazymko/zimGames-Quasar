<template>
  <sum-puzzle-game :questions="questions" :noOfLife="2"></sum-puzzle-game>
</template>

<script>
import SumPuzzleGame from "./sumpuzzle";
export default {
  name: "sum-puzzle-container",
  components: {
    SumPuzzleGame
  },
  computed: {
    questions () {
      return [
        { numbers: [3, 2, 4] },
        { numbers: [3, 4, 5] }
      ]
    }
  }
};
</script>