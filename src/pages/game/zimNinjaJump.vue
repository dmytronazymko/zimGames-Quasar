<template>
  <div style="width: 100%; text-align: center;">
    <div :id="holder + 'Container'"><div :id="holder"></div></div>
  </div>
</template>

<script>
import GameShellMixin from '../../library/mixins/zimGameShell'
export default {
  name: 'zim-ninja-jump',
  mixins: [GameShellMixin],
  data () {
    return {
      assets: ["ninjajump.png", "ninjajump.json", "lava.png", "ninja.png"],
      path: "statics/game/zimninjajump/",
      platforms: [],
      platformPositions: [{x: 200, y: 400}, {x: 400, y: 250}, {x: 600, y: 400}],
      heroPlatform: null,
      heroPlatformPosition: {x: 400, y: 550},
      selectedIndex: ''
    }
  },
  methods: {
    initGame () {
      this.frame.loadAssets(this.assets, this.path)
      this.frame.on("complete", () => {

        let _wall = new zim.Sprite({json: this.frame.asset("ninjajump.json")})
        _wall.gotoAndPlay('bg-wall')
        _wall.scale = 0.74

        this.contentLayer.addChild(_wall)

        this.createLava()
        this.createPlatform()
        this.createHeroPlatform()
        this.createHero()
        this.createButton()

        this.stage.update()
      })
    },
    createButton () {
      let _button1 = new zim.Sprite({json: this.frame.asset("ninjajump.json")})
      _button1.gotoAndPlay('button1')
      let _button2 = new zim.Sprite({json: this.frame.asset("ninjajump.json")})
      _button2.gotoAndPlay('button2')
      let _button3 = new zim.Sprite({json: this.frame.asset("ninjajump.json")})
      _button3.gotoAndPlay('button3')

      this.createStandardOptions({
        optionBgs: [
          _button1,
          _button2,
          _button3
        ]
      })
    },
    createLava () {
      let _lava = new zim.Sprite({
        image: this.frame.asset("lava.png"),
        cols:7,
        rows:2,
        animations:{
          flow: { frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], next: "flow", speed: 0.1 }
        }
      })
      _lava.gotoAndPlay('flow')
      _lava.x = -2
      _lava.y = this.height - _lava.height / 2
      _lava.scaleX = 1.3
      _lava.scaleY = 1
      this.contentLayer.addChild(_lava)
    },
    createPlatform () {
      for (let i = 0; i < 3; i++) {
        let _platform = new zim.Sprite({json: this.frame.asset("ninjajump.json")})
        _platform.gotoAndPlay('platform' + i)
        _platform.x = this.platformPositions[i].x
        _platform.y = this.platformPositions[i].y
        _platform.regX = _platform.width / 2
        _platform.scale = 0.6

        // _platform.wiggle("x", _platform.x, 10, 20, 1000, 2000)

        this.contentLayer.addChild(_platform)

        this.platforms[i] = _platform
      }
    },
    createHeroPlatform () {
      this.heroPlatformContainer = new zim.Container()
      
      this.heroPlatform = new zim.Sprite({json: this.frame.asset("ninjajump.json")})
      this.heroPlatform.gotoAndPlay('platform0')
      this.heroPlatform.x = this.heroPlatformPosition.x
      this.heroPlatform.y = this.heroPlatformPosition.y
      this.heroPlatform.regX = this.heroPlatform.width / 2
      this.heroPlatform.scale = 0.6

      this.contentLayer.addChild(this.heroPlatform)
    },
    createHero () {
      this.hero = new zim.Sprite({
        image: this.frame.asset("ninja.png"),
        cols:7,
        rows:3,
        animations: {
          preJump: [0, 0],
          mid: [1, 1, 'midJump', 0.1],
          midJump: [2],
          right: [7, 7, 'rightJump', 0.1],
          rightJump: [8],
          left: [14, 14, 'leftJump', 0.1],
          leftJump: [15],
          postJump: [3, 6, 'preJump', 0.1]
        }
      })

      this.hero.regX = this.hero.width / 2
      this.hero.regY = this.hero.height

      this.hero.x = this.heroPlatform.x
      this.hero.y = this.heroPlatform.y + 20
      this.hero.scale = 0.7
      this.contentLayer.addChild(this.hero)

      zim.Ticker.add(() => {
        
      }, this.stage)
    },
    showNextQuestion () {
      if (this.noOfLifeRemained > 0) {
        this.setQuestion()
        this.setOptionContent({ shiftX: 0.3, color: 'white' })
      }
    },
    optionClicked (index) {
      this.selectedIndex = index
      if (index === 0) {
        this.hero.gotoAndPlay('left')
      } else if (index === 1) {
        this.hero.gotoAndPlay('mid')
      } else if (index === 2) {
        this.hero.gotoAndPlay('right')
      }
      this.hero.animate( { props: { x: this.platformPositions[index].x, y: this.platformPositions[index].y + 20 }, time: 300, call: this.heroPostJump })
    },
    heroPostJump () {
      this.hero.gotoAndPlay('postJump')
      for (let i = 0; i < this.platforms.length; i++) {
        if (!this.optionContainers[i].correct) {
          this.platforms[i].animate({ props: { y: this.height * 1.5}, time: 500, wait: 300 })
        }
      }
      if (!this.optionContainers[this.selectedIndex].correct) {
        this.hero.animate({ props: { alpha: 0 }, time: 300, wait: 300, call: this.heroReturn })
        this.handleWrong()
      } else {
        this.handleCorrect()
        setTimeout(() => {
          if (this.selectedIndex === 0) {
            this.hero.gotoAndPlay('right')
          } else if (this.selectedIndex === 1) {
            this.hero.gotoAndPlay('mid')
          } else if (this.selectedIndex === 2) {
            this.hero.gotoAndPlay('left')
          }
          this.hero.animate( { props: { x: this.heroPlatform.x, y: this.heroPlatform.y + 20 }, time: 300, call: () => { this.hero.gotoAndPlay('postJump'); this.heroReturn() } })
        }, 1000)        
      }
    },
    heroReturn () {
      if (this.noOfLifeRemained > 0) {
        this.hero.x = this.heroPlatformPosition.x
        this.hero.y = this.heroPlatformPosition.y + 20
        this.hero.animate({ props: { alpha: 1 }, time: 300 })
        this.hero.gotoAndPlay('postJump')

        for (let i = 0; i < this.platforms.length; i++) {
          this.platforms[i].animate({ props: { y: this.platformPositions[i].y}, time: 1000, wait: 1000 })
        }

        setTimeout(() => {
          this.showNextQuestion()
        }, this.waitForNext)
      }
    },
    resetPosition () {
      this.hero.x = this.heroPlatform.x
      this.hero.y = this.heroPlatform.y + 20
      this.hero.alpha = 1
      this.hero.gotoAndPlay('preJump')

      for (let i = 0; i < this.platforms.length; i++) {
        this.platforms[i].y = this.platformPositions[i].y
      }
    },
    startGame () {
      this.resetPosition()
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