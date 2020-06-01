<template>
  <ninja-hole-game :questions="questions" :noOfLife="2"></ninja-hole-game>
</template>

<script>
import NinjaHoleGame from "./ninjahole";
export default {
  name: "ninja-hole-container",
  components: {
    NinjaHoleGame
  },
  computed: {
    questions () {
      return [
        { noOfDirection: 8, compassRotation: true },
		{ noOfDirection: 4, compassRotation: true },
		{ noOfDirection: 8, compassRotation: false },
		{ noOfDirection: 8, compassRotation: true }
      ]
    }
  }
};
</script>