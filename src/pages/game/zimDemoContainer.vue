<template>
  <zim-demo :questions="questions" :noOfLife="2"></zim-demo>
</template>

<script>
import zimDemo from './zimDemo'
export default {
  name: 'zim-demo-container',
  components: {
    zimDemo
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