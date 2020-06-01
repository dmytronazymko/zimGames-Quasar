<template>
  <sum-crush-game :questions="questions" :noOfLife="2"></sum-crush-game>
</template>

<script>
import SumCrushGame from "./sumcrush";
export default {
  name: "sum-crush-container",
  components: {
    SumCrushGame
  },
  computed: {
    questions () {
      return [
        { operator: '-', numbers: [1, 2, 3, 4, 5, 6, 7] ,positveOnly : true},
        { operator: '-', numbers: [1, 2, 4, 5, 6, 8, 9] ,positveOnly : false},
        { operator: '+', numbers: [1, 2, 3, 5, 6, 7, 9] },
      ]
    }
  }
};
</script>