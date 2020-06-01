<template>
  <div style="width: 100%; text-align: center;">
    <div :id="holder + 'Container'"><div :id="holder"></div></div>
  </div>
</template>

<script>
import GameShellMixin from '../../library/mixins/zimGameShell'
export default {
  name: 'zim-ninja-river',
  mixins: [GameShellMixin],
  data () {
    return {
      assets: ["river-sprite-4x4.png", "log.png", "hero.png", "button1.png", "button2.png", "button3.png"],
      path: "statics/game/zimninjariver/",
      logs: [],
      selectedIndex: ''
    }
  },
  methods: {
    initGame () {
      this.frame.loadAssets(this.assets, this.path)
      this.frame.on("complete", () => {
        
        this.createRiver()
        this.createLogs()
        this.createHeroAndLog()
        this.createButton()
        
        zim.Ticker.add(() => {
        }, this.stage)
      })
    },
    createHero () {
      this.hero = new zim.Sprite({
        image: this.frame.asset("hero.png"),
        cols:6,
        rows:3,
        animations:{
          preJump: { frames: [0, 1], next: 'preJump', speed: 0.07 },
          rightJump: 2,
          leftJump: 3,
          midJump: 4,
          postJump: { frames: [5, 6, 7], next: '', speed: 0.1 },
          panicMovements: { frames: [6, 7, 8, 9, 10, 11], next: '', speed: 0.3 },
          afterLogSinking: { frames: [12, 13, 12, 13, 14, 15, 14, 15, 16, 17], next: '', speed: 0.1 }
        }
      })
      this.hero.gotoAndPlay('preJump')
      this.hero.x = this.heroLog.x
      this.hero.y = this.heroLog.y + 40
      this.hero.regX = this.hero.width / 2
      this.hero.regY = this.hero.height
      this.hero.scale = 0.8
      this.contentLayer.addChild(this.hero)
    },
    createHeroAndLog () {
      this.heroLog = this.createLog({ x: 390, y: 600, scale: 0.8 })
      this.heroLog.gotoAndPlay('withHero')
      this.createHero()
    },
    createLogs () {
      this.logs.push(this.createLog({ x: 140, y: 400, scale: 0.8 }))
      this.logs.push(this.createLog({ x: 380, y: 300, scale: 0.8 }))
      this.logs.push(this.createLog({ x: 600, y: 400, scale: 0.8 }))
    },
    createLog (params) {
      let _log = new zim.Sprite({
        image: this.frame.asset("log.png"),
        cols:8,
        rows:4,
        animations:{
          float: { frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], next: 'float', speed: 0.2 },
          dive: { frames: [24, 25, 26, 27, 28, 29], next: '', speed: 0.1 },
          withHero: { frames: [16, 17, 18, 19, 20, 21], next: 'withHero', speed: 0.1 }
        }
      })
      _log.gotoAndPlay('float')
      _log.x = params.x
      _log.y = params.y
      _log.regX = _log.width / 2
      _log.scale = params.scale || 1

      _log.addEventListener('animationend', event => {
        if (event.target.currentAnimation === 'dive') {
        }
      })

      this.contentLayer.addChild(_log)

      return _log
    },
    createRiver () {
      let _river = new zim.Sprite({
        image: this.frame.asset("river-sprite-4x4.png"),
        cols:4,
        rows:4,
        animations:{
          flow: { frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], next: "flow", speed: 0.1 }
        }
      })
      _river.gotoAndPlay('flow')
      _river.scaleX = 2
      _river.scaleY = 4
      this.contentLayer.addChild(_river)
    },
    createButton () {
      let _button1 = this.frame.asset("button1.png")
      let _button2 = this.frame.asset("button2.png")
      let _button3 = this.frame.asset("button3.png")

      this.createStandardOptions({
        optionBgs: [
          _button1,
          _button2,
          _button3
        ]
      })
    },
    showNextQuestion () {
      if (this.noOfLifeRemained > 0) {
        this.heroReturn()
        this.resetLog()
        this.setQuestion()
        this.setOptionContent({ shiftX: 0.3, color: 'white' })
      }
    },
    optionClicked (index) {
      this.selectedIndex = index
      this.heroLog.gotoAndPlay('float')
      if (index === 0) {
        this.hero.gotoAndPlay('leftJump')
      } else if (index === 1) {
        this.hero.gotoAndPlay('midJump')
      } else if (index === 2) {
        this.hero.gotoAndPlay('rightJump')
      }
      this.hero.animate( { props: { x: this.logs[index].x, y: this.logs[index].y + 40 }, time: 300, call: this.heroPostJump })
      this.heroLog.gotoAndPlay('dive')
    },
    heroPostJump () {
      this.hero.gotoAndPlay('postJump')
      setTimeout(() => {
        this.showResult()
      }, 500)
      this.logs[this.selectedIndex].gotoAndPlay('withHero')
    },
    showResult () {
      for (let i = 0; i < this.logs.length; i++) {
        if (!this.optionContainers[i].correct) {
          this.logs[i].gotoAndPlay('dive')
        }
      }
      if (!this.optionContainers[this.selectedIndex].correct) {
        this.hero.gotoAndPlay('panicMovements')
        setTimeout(() => {
          this.hero.gotoAndPlay('afterLogSinking')
        }, 500)
        this.handleWrong()
      } else {
        this.hero.gotoAndPlay('preJump')
        this.handleCorrect()
      }

      setTimeout(() => {
        this.showNextQuestion()
      }, this.waitForNext)
    },
    resetLog () {
      for (let i = 0; i < this.logs.length; i++) {
        this.logs[i].gotoAndPlay('float')
      }
    },
    heroReturn () {
      this.hero.x = this.heroLog.x
      this.hero.y = this.heroLog.y + 40
      this.heroLog.gotoAndPlay('withHero')
      this.hero.gotoAndPlay('preJump')
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