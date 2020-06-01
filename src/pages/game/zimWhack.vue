<template>
  <div style="width: 100%; text-align: center;">
    <div :id="holder + 'Container'"><div :id="holder"></div></div>
  </div>
</template>

<script>
import GameShellMixin from '../../library/mixins/zimGameShell'
export default {
  name: 'zim-monster',
  mixins: [GameShellMixin],
  data () {
    return {
      assets: ["whack.png", "whack.json", "background.png"],
      path: "statics/game/zimwhack/",
      holeProperies: [{x: 450, y: 300, scale: 0.6}, {x: 200, y: 400, scale: 0.8}, {x: 600, y: 600, scale: 0.9}],
      holes: [],
      ninjaAppearSequence: [],
      ninjaAppearDuration: 5000,
      nextNinjaAppear: 1000,
      lastNinjaShowTime: null,
      noOfNinjaHide: 0,
      optionSelected: false,
      flagContainers: []
    }
  },
  methods: {
    initGame () {
      this.frame.loadAssets(this.assets, this.path)

      this.stage.on('stagemousemove', evt => {
        if (this.gameStarted) {
          if (this.hammer && this.hammer.currentStatus === '') {
            let _coords = evt.target.globalToLocal(evt.stageX, evt.stageY)
            this.hammer.scale = (_coords.y / this.height) * 1.2
            this.hammer.x = _coords.x
            this.hammer.y = _coords.y
          }
        }
      })

      this.frame.on("complete", () => {

        let _background = this.frame.asset('background.png')
        _background.width = this.width
        _background.height = this.height
        this.backgroundLayer.addChild(_background)

        this.createOptionContainer()
        this.createHole()

        this.iconTick = new zim.Sprite({json: this.frame.asset("whack.json")})
        this.iconTick.gotoAndPlay('icon-check')
        this.iconTick.alpha = 0
        this.contentLayer.addChild(this.iconTick)

        this.iconCross = new zim.Sprite({json: this.frame.asset("whack.json")})
        this.iconCross.gotoAndPlay('icon-cross')
        this.iconCross.alpha = 0
        this.contentLayer.addChild(this.iconCross)

        this.createHammer()

        zim.Ticker.add(() => {
          if (this.gameStarted) {
            this.moveNinja()
          }
        }, this.stage)
      })
    },
    createOptionContainer () {
      for (let i = 0; i < this.holeProperies.length; i++) {
        let _flagContainer = new zim.Container()
        let _flag = new zim.Sprite({json: this.frame.asset("whack.json")})
        _flag.gotoAndPlay('answer-flag')
        _flagContainer.addChild(_flag)
        _flagContainer.regX = _flagContainer.width / 2
        _flagContainer.regY = _flagContainer.height / 2
        _flagContainer.x = this.holeProperies[i].x - 150 * this.holeProperies[i].scale
        _flagContainer.y = this.holeProperies[i].y - 25

        let _optionContainer = new zim.Container(0, 0, _flagContainer.width, _flagContainer.height)
        _flagContainer.addChild(_optionContainer)
        this.optionContainers[i] = _optionContainer

        this.contentLayer.addChild(_flagContainer)

        this.flagContainers.push(_flagContainer)
      }
    },
    createHammer () {
      this.hammer = new zim.Sprite({json: this.frame.asset("whack.json")})
      this.hammer.gotoAndPlay('hammer-idle')

      this.hammer.x = this.contentLayer.width / 2
      this.hammer.y = this.height / 2
      this.hammer.regX = this.hammer.width * 0.4
      this.hammer.regY = this.hammer.height * 0.6
      this.hammer.currentStatus = ''
      this.hammer.scale = 0.8

      this.contentLayer.addChild(this.hammer)
    },
    hideNinja () {
      this.noOfNinjaHide++
      if (this.noOfNinjaHide === this.holes.length) {
        this.handleWrong()
        this.waitForNextQuestion()
      }
    },
    createHole() {
      for (let i = 0; i < this.holeProperies.length; i++) {
        let _hole = new zim.Sprite({json: this.frame.asset("whack.json")})
        _hole.gotoAndPlay('hole-empty')
        _hole.x = this.holeProperies[i].x
        _hole.y = this.holeProperies[i].y
        _hole.regX = _hole.width / 2
        _hole.regY = _hole.height / 2
        _hole.index = i

        _hole.scale = this.holeProperies[i].scale
        _hole.addEventListener('animationend', event => {
          if (event.target.currentAnimation === 'hole-hide') {
            this.hideNinja()
          }
        })
        _hole.currentStatus = ''
        this.contentLayer.addChild(_hole)

        this.holes.push(_hole)

       _hole.addEventListener('click', (event) => {
          let _index = event.target.index
          if (this.holes[_index].currentStatus === 'appear' || this.holes[_index].currentStatus === 'hiding') {
            if (this.hammer.currentStatus === '') {
              this.hammer.gotoAndPlay('hammer-hit')
              this.hammer.currentStatus = 'hit'
              this.holes[_index].gotoAndPlay('hole-hit')
              this.holes[_index].currentStatus = 'hit'
              this.optionSelected = true

              if (this.optionContainers[_index].correct) {
                this.showTick(_index)
                this.handleCorrect()
              } else {
                this.showCross(_index)
                this.handleWrong()
              }
              setTimeout(() => {
                this.showNextQuestion()
              }, this.waitForNext)
            }
          }
        })
      }
    },
    showTick (index) {
      this.iconTick.x = this.flagContainers[index].x + this.flagContainers[index].width - this.iconTick.width
      this.iconTick.y = this.flagContainers[index].y + this.flagContainers[index].height / 2
      this.contentLayer.addChild(this.iconTick)
      this.iconTick.animate({alpha: 1}, 200)
    },
    showCross (index) {
      this.iconCross.x = this.flagContainers[index].x + this.flagContainers[index].width - this.iconCross.width
      this.iconCross.y = this.flagContainers[index].y + this.flagContainers[index].height / 2
      this.contentLayer.addChild(this.iconCross)
      this.iconCross.animate({alpha: 1}, 200)
    },
    moveNinja () {
      let _now = (new Date()).getTime()
      if (this.lastNinjaShowTime !== null &&  (_now - this.lastNinjaShowTime) >= this.nextNinjaAppear) {
        let _targetNinjaIndexes = []
        for (let i = 0; i < this.holes.length; i++) {
          if (this.holes[i].currentStatus === '') {
            _targetNinjaIndexes.push(i)
          }
        }
        if (_targetNinjaIndexes.length > 0) {
          this.lastNinjaShowTime = _now
          if (_targetNinjaIndexes.length > 1) {
            _targetNinjaIndexes = zim.shuffle(_targetNinjaIndexes)
          }
          let _targetIndex = _targetNinjaIndexes[0]
          this.holes[_targetIndex].currentStatus = 'appear'
          this.holes[_targetIndex].hideTime = _now + (this.ninjaAppearDuration / 2) + Math.random() * (this.ninjaAppearDuration / 2)
          this.holes[_targetIndex].gotoAndPlay('hole-appear')

          // this.$createjs.Tween.get(this.optionContainers[_targetIndex]).to({alpha: 1}, 200)
        }
      }

      for (let i = 0; i < this.holes.length; i++) {
        if (this.holes[i].currentStatus === 'appear') {
          if (_now > this.holes[i].hideTime) {
            this.holes[i].currentStatus = 'hiding'
            this.holes[i].gotoAndPlay('hole-hide')
          }
        }
      }
    },
    resetGame() {
      this.noOfNinjaHide = 0
      this.optionSelected = false
      this.secondsRemaining = this.maxSeconds
      this.hammer.currentStatus = ''
      this.hammer.gotoAndPlay('hammer-idle')
      this.iconTick.alpha = 0
      this.iconCross.alpha = 0

      for (let i = 0; i < this.holes.length; i++) {
        this.holes[i].gotoAndPlay('hole-empty')
        this.holes[i].currentStatus = ''
      }
    },
    showNextQuestion () {
      if (this.noOfLifeRemained > 0) {
        this.lastNinjaShowTime = (new Date()).getTime()
        this.ninjaAppearSequence = zim.shuffle([0, 1, 2])
        this.resetGame()
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