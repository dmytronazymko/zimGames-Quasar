<template>
  <arithmetic-game :questions="questions" :noOfLife="2"></arithmetic-game>
</template>

<script>
import ArithmeticGame from "./Arithmetic";
export default {
  name: "arithmetic-container",
  components: {
    ArithmeticGame
  },
  computed: {
    questions () {
      return [
        { target: 10, operators: [ '+', '-', '*', '/'], numbers: [2, 3, 5, 6, 4] },
		{ target: 7, operators: [ '+', '-', '*' ], numbers: [2, 3, 5] },
      ]
    }
  }
};
</script>