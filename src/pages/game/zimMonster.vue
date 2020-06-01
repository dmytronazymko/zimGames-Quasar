<template>
  <div></div>
</template>

<script>
import GameShellMixin from '../../library/mixins/zimGameShell'
export default {
  name: 'zim-monster',
  mixins: [GameShellMixin],
  data () {
    return {
      assets: ["monster.png", "monster.json"],
      path: "statics/game/zimMonster/",
    }
  },
  methods: {
    initGame () {
      this.waitForNext = 2000
      this.frame.loadAssets(this.assets, this.path)
      this.frame.on("complete", () => {

/*
        var borders = {x:0, y:0, width: this.contentLayerWidth, height: this.height}
        var physics = new Physics(this.frame, borders)

        var circleBody = physics.makeCircle({
          radius: 30,
          angular: .75,
          restitution: .5
        });

        var circle = new Circle(30, frame.pink).center()
        physics.addMap(circleBody, circle)

        circleBody.x = 400
        circleBody.y = 200
        */

        this.stage.update()
      })
    },
    showNextQuestion () {
      if (this.noOfLifeRemained > 0) {
        this.setQuestion()
        this.setOptionContent()
      }
    },
    startGame () {
      this.showNextQuestion()
    }
  },
  mounted () {
    this.initGameShell()
  },
  beforeDestroy () {
    this.cleanUp()
  }
}
</script>