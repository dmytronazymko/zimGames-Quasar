<template>
  <tutorial-game :setting="setting" :questions="questions" :noOfLife="2"></tutorial-game>
</template>

<script>
import TutorialGame from './tutorial'
export default {
  name: 'zim-demo-container',
  props: {
    setting: {
      default: () => { return {} }
    }
  },
  components: {
    TutorialGame
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