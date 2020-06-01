<template>
  <div style="width: 100%; text-align: center;">
    <div :id="holder + 'Container'"><div :id="holder"></div></div>
  </div>
</template>

<script>
import GameShellMixin from '../../library/mixins/zimGameShell'
export default {
  name: 'sample',
  mixins: [GameShellMixin],
  data () {
    return {
      assets: ["background.png", "sample.png", "sample.json"],
      path: "statics/game/tutorial/",
      containers: []
    }
  },
  methods: {
    initGame () {
      this.frame.loadAssets(this.assets, this.path)
      frame.on("complete", () => {
         
        zim.Ticker.add((event) => {

        }, this.stage)

        this.stage.update()
      })
    },
    showNextQuestion () {
    },
    startGame () {
      this.showNextQuestion()
    }
  },
  created () {
  },
  mounted () {
    this.initGameShell()
  },
  beforeDestroy () {
    this.cleanUp()
  }
}
</script>

