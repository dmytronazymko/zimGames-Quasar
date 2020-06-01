<template>
  <div style="width: 100%; text-align: center;">
    <div :id="holder + 'Container'"><div :id="holder"></div></div>
  </div>
</template>

<script>
import GameShellMixin from '../../library/mixins/zimGameShell'
export default {
  name: 'shooting-bee',
  mixins: [GameShellMixin],
  data () {
    return {
      assets: ["background.png", "shootingBee.png", "shootingBee.json"],
      path: "statics/game/shootingBee/",
      answerSelected: false,
      result: null,
      timeouts: [],
      noOfBeeDone: 0
    }
  },
  methods: {
    initGame () {
      this.frame.loadAssets(this.assets, this.path)
      this.frame.on("complete", () => {
        let _background = this.frame.asset('background.png')
        _background.width = this.width
        _background.height = this.height
        this.backgroundLayer.addChild(_background)

        this.result = new zim.Sprite({json: this.frame.asset("shootingBee.json")})
        this.result.gotoAndPlay('icon-check')

        this.createPath()
        this.createBees()

        this.stage.update()
      })
    },
    createBees () {
      this.bees = []
      this.beeContainers = []
      for (let i = 0; i < 3; i++) {
        let _beeContainer = new zim.Container()
        let _bee = new zim.Sprite({json: this.frame.asset("shootingBee.json")})
        _bee.gotoAndPlay('beeFly')
        _beeContainer.regX = _bee.width / 2
        _beeContainer.regY = _bee.height / 2
        _beeContainer.index = i

        _beeContainer.on('click', event => {
          if (!this.answerSelected) {
            for (let i = 0; i < this.timeouts.length; i++) {
              clearTimeout(this.timeouts[i])
            }
            this.timeouts = []
            for (let j = 0; j < this.beeContainers.length; j++) {
              this.beeContainers[j].stopAnimate()
            }
            this.answerSelected = true
            let _index = event.currentTarget.index
            this.result.x = this.optionContainers[_index].width
            this.result.y = this.optionContainers[_index].height
            if (this.optionContainers[_index].correct) {
              this.handleCorrect(this.optionContainers[_index].value)
              this.result.gotoAndPlay('icon-check')
            } else {
              this.handleWrong()
              this.result.gotoAndPlay('icon-cross')
            }
            _beeContainer.addChild(this.result)
            setTimeout(() => {
              this.showNextQuestion()
            }, this.waitForNext)
          }
        })
        
        _beeContainer.x = 100
        _beeContainer.y = 300 + i * 150

        _beeContainer.bee = _bee

        let _optionContainer = new zim.Container(0, 0, _bee.width * 0.75, _bee.height / 2)
        _optionContainer.y = _bee.height / 2

        _beeContainer.addChild(_bee, _optionContainer)

        this.optionContainers[i] = _optionContainer

        // this.contentLayer.addChild(_beeContainer)
        this.beeContainers[i] = _beeContainer
        this.bees[i] = _bee
        this.beeContainers[i].addTo(this.contentLayer)
        this.beeContainers[i].alpha = 0
        // _beeContainer.addTo().animate({path: this.path, orient: false}, 10000, null, () => { console.log('done') })
      }
    },
    createPath () {
      this.path = new zim.Squiggle({
        points: [[-169,115.7,0,0,100,0,50,0,"mirror"],[50.1,-36.3,0,0,194.4,11.3,-194.4,-11.3,"mirror"],[141.2,126.7,0,0,-112.1,0,112.1,0,"mirror"],[193.2,-158.4,0,0,186.4,-19.3,-186.4,19.3,"mirror"],[395.6,135.7,0,0,-70.7,4.8,70.7,-4.8,"mirror"],[519.3,-12.2,0,0,184.8,14.5,-184.8,-14.5,"mirror"],[652.9,120.9,0,0,-102.4,40.2,102.4,-40.2,"mirror"]],
        onTop:false,
        interactive: false,
        showControls: false
      })

      this.path.x = 100
      this.path.y = 400
      this.path.visible = false

      this.contentLayer.addChild(this.path)
    },
    setBeeDone () {
      this.noOfBeeDone++
      if (this.noOfBeeDone === this.optionContainers.length) {
        if (this.answerSelected === false) {
          this.handleWrong()
          setTimeout(() => {
            this.showNextQuestion()
          }, this.waitForNext)
        }
      }
    },
    flyBees () {
      this.noOfBeeDone = 0
      this.hideBees()
      for (let i = 0; i < this.optionContainers.length; i++) {
        // this.timeouts.push(setTimeout(() => {
          // this.beeContainers[i].removeFrom(this.contentLayer)
          this.beeContainers[i].animate({ props: {alpha: 1}, wait: i * 2000, time: 100 })
          this.beeContainers[i].animate({ wait: i * 2000, from: true, ease: 'linear', props: {path: this.path, orient: false}, time: 15000, call: () => { this.setBeeDone() } })
        // }, i * 2000))
      }
    },
    hideBees () {
      if (this.result.parent !== null) {
        this.result.parent.removeChild(this.result)
      }
      for (let i = 0; i < this.optionContainers.length; i++) {
        this.beeContainers[i].alpha = 0
      }
    },
    showNextQuestion () {
      if (this.noOfLifeRemained > 0) {
        this.answerSelected = false
        this.setQuestion()
        this.setOptionContent()
        this.flyBees()
      } else {
        this.hideBees()
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