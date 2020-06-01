<template>
  <ninja-dart-game :questions="questions" :noOfLife="2"></ninja-dart-game>
</template>

<script>
import NinjaDartGame from "./ninjadart";
export default {
  name: "ninja-dart-container",
  components: {
    NinjaDartGame
  },
  computed: {
    questions () {
      return [
        [ { title: 'multiple of 5', answer: 25}, { title: 'multiple of 3', answer: 27 }, { title: 'multiple of 4', answer: 28 } ],
        [ { title: 'multiple of 3', answer: 21}, { title: 'multiple of 4', answer: 16 }, { title: 'multiple of 5', answer: 10 } ],
      ]
    }
  }
};
</script>