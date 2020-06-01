<template>
  <div style="width: 100%; text-align: center;">
    <div :id="holder + 'Container'"><div :id="holder"></div></div>
  </div>
</template>

<script>
import GameShellMixin from '../../library/mixins/zimGameShell'
export default {
  name: 'zim-demo',
  mixins: [GameShellMixin],
  data () {
    return {
      assets: ["background.png"],
      path: "statics/game/tutorial/"
    }
  },
  computed: {
  },
  methods: {
    initGame () {
      this.frame.loadAssets(this.assets, this.path)
      frame.on("complete", () => {

        let _background = this.frame.asset('background.png')
        _background.width = this.width
        _background.height = this.height
        this.backgroundLayer.addChild(_background)
         
        zim.Ticker.add((event) => {

        }, this.stage)

        this.stage.update()
      })
    },
    showNextQuestion () {
      this.setQuestion()
      this.setOptionContent()
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
