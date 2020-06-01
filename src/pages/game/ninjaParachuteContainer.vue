<template>
  <ninja-parachute :setting="setting" :questions="questions" :noOfLife="2"></ninja-parachute>
</template>

<script>
import NinjaParachute from './ninjaParachute'
export default {
  name: 'zim-demo-container',
  props: {
    setting: {
      default: () => { return {} }
    }
  },
  components: {
    NinjaParachute
  },
  computed: {
    questions () {
      return [
        [ { title: '1 + 1', answer: 2}, { title: '1 + 2', answer: 3 }, { title: '1 + 3', answer: 4 } ],
        [ { title: '2 + 2', answer: 4}, { title: '2 + 3', answer: 5 }, { title: '2 + 4', answer: 6 } ]
      ]
    }
  }
}
</script>