<template>
  <div style="width: 100%; text-align: center;">
    <div :id="holder + 'Container'"><div :id="holder"></div></div>
  </div>
</template>

<script>
import GameShellMixin from '../../library/mixins/zimGameShell'
export default {
  name: 'ninja-shooting',
  mixins: [GameShellMixin],
  data () {
    return {
      assets: ["background.png", "ninjashooting.json", "ninjashooting.png"],
      path: "statics/game/ninjashooting/",
      balloonContainers: [],
      balloons: [],
      arrows: [],
      platformGear: null,
      platformContainer: null,
      hero: null,
      moving: false,
      firing: false,
      balloonXs: [350, 450, 550],
      balloonYs: [700, 900, 1100],
      balloonSpeed: 1
    }
  },
  methods: {
    initGame () {
      this.frame.loadAssets(this.assets, this.path)

      this.frame.on("keydown", (e) => {
        switch (e.keyCode) {
          case 32:
          this.prepareToFireArrow()
          break
        }
      })

      this.frame.on("complete", () => {
        let _background = this.frame.asset('background.png')
        _background.width = this.width
        _background.height = this.height
        this.backgroundLayer.addChild(_background)

        this.objectLayer = new zim.Container()
        this.contentLayer.addChild(this.objectLayer)

        this.createBalloon({ balloonIndex: 1, index: 0, x: 0, y: 1000 })
        this.createBalloon({ balloonIndex: 2, index: 1, x: 0, y: 1000 })
        this.createBalloon({ balloonIndex: 3, index: 2, x: 0, y: 1000 })

        this.createPlatform()
        this.createButtons()

        zim.Ticker.add((event) => {
          this.moveObjects()
        }, this.stage)

        this.stage.update()
      })
    },
    prepareToFireArrow () {
      if (!this.firing) {
        this.firing = true
        this.hero.gotoAndPlay('ninja-fire')
      }
    },
    moveObjects () {
      if (this.gameStarted) {
        for (let i = 0; i < this.balloonContainers.length; i++) {
          if (this.optionContainers[i].hit === false) {
            this.balloonContainers[i].y -= this.balloonSpeed
          }
        }
        for (let i = 0; i < this.arrows.length; i++) {
          this.arrows[i].x += 6
        }

        for (let i = 0; i < this.arrows.length; i++) {
          for (let j = 0; j < this.optionContainers.length; j++) {
            if (this.optionContainers[j].hit === false && this.arrows[i].hit === false) {
              if (this.arrows[i].hitTestBounds(this.optionContainers[j])) {
                this.arrows[i].animate({ alpha: 0 }, 200)
                this.optionContainers[j].hit = true
                this.arrows[i].hit = true
                this.balloons[j].gotoAndPlay('balloon' + this.optionContainers[j].balloonIndex + '-pop')
                this.checkAnswer(j)
              }
            }
          }
        }
        this.stage.update()
      }
    },
    checkAnswer (index) {
      if (this.optionContainers[index].correct) {
        this.handleCorrect()
      } else {
        this.handleWrong()
      }
      if (this.noOfLifeRemained > 0) {
        setTimeout(() => {
          this.showNextQuestion()
        }, this.waitForNext)
      }
    },
    moveUp () {
      if (!this.moving && this.platformContainer.y > 160) {
        this.moving = true
        this.platformContainer.animate({ props: { y: this.platformContainer.y - 180 }, time: 300, ease: "sineInOut", call: () => { this.moving = false } })
        this.platformGear.animate({ props: { rotation: this.platformGear.rotation + 120 }, time: 300, ease: "sineInOut" })
      }
    },
    moveDown () {
      if (!this.moving && this.platformContainer.y < 520) {
        this.moving = true
        this.platformContainer.animate({ props: { y: this.platformContainer.y + 180 }, time: 300, ease: "sineInOut", call: () => { this.moving = false } })
        this.platformGear.animate({ props: { rotation: this.platformGear.rotation - 120 }, time: 300, ease: "sineInOut" })
      }
    },
    moveUpStart () {
      this.moveUp()
    },
    moveDownStart () {
      this.moveDown()
    },
    createButtons () {
      let _buttonContainer = new zim.Container()

      let _buttonUp = new zim.Sprite({json: this.frame.asset("ninjashooting.json")})
      _buttonUp.gotoAndPlay('button-up')
      _buttonUp.scale = 0.6
      _buttonUp.on('click', () => {
        this.moveUp()
      })

      let _buttonDown = new zim.Sprite({json: this.frame.asset("ninjashooting.json")})
      _buttonDown.gotoAndPlay('button-down')
      _buttonDown.scale = 0.6
      _buttonDown.y = 180
      _buttonDown.on('click', () => {
        this.moveDown()
      })

      let _buttonFire = new zim.Sprite({json: this.frame.asset("ninjashooting.json")})
      _buttonFire.gotoAndPlay('button-fire')
      _buttonFire.scale =0.8
      _buttonFire.x = 0
      _buttonFire.y = 90

      _buttonFire.on('click', () => {
        this.prepareToFireArrow()
      })

      _buttonContainer.addChild(_buttonUp, _buttonDown, _buttonFire)

      _buttonContainer.x = 80
      _buttonContainer.y = 450
      this.panelLayer.addChild(_buttonContainer)
    },
    createPlatform () {
      this.platformContainer = new zim.Container()
      this.platformGear = new zim.Sprite({json: this.frame.asset("ninjashooting.json")})
      this.platformGear.gotoAndPlay('platform-gear')
      
      this.platformGear.regX = this.platformGear.width / 2
      this.platformGear.regY = this.platformGear.height / 2
      this.platformGear.x = 30
      this.platformGear.y = 45
      this.platformGear.scale = 0.7
      let _platform = new zim.Sprite({json: this.frame.asset("ninjashooting.json")})
      _platform.gotoAndPlay('platform')
      _platform.y = 50
      this.platformContainer.x = 10
      this.platformContainer.y = 520
      _platform.x = 20
      _platform.scale = 0.7

      this.hero = new zim.Sprite({json: this.frame.asset("ninjashooting.json")})
      this.hero.gotoAndPlay('ninja-stand')
      this.hero.scale = 0.4
      this.hero.x = 80
      this.hero.y = -65
      this.hero.addEventListener('animationend', event => {
        if (event.target.currentAnimation === 'ninja-fire') {
          this.firing = false
          this.fireArrow()
        }
      })
      this.platformContainer.addChild(this.platformGear, _platform, this.hero)
      this.contentLayer.addChild(this.platformContainer)
    },
    fireArrow () {
      let _arrow = new zim.Sprite({json: this.frame.asset("ninjashooting.json")})
      _arrow.gotoAndPlay('arrow')
      _arrow.hit = false
      _arrow.x = this.platformContainer.x + this.hero.x + this.hero.width
      _arrow.y = this.platformContainer.y + this.hero.y + this.hero.height / 2
      this.objectLayer.addChild(_arrow)

      this.arrows.push(_arrow)
    },
    createBalloon (params) {
      let _balloonContainer = new zim.Container()
      let _optionContainer = new zim.Container()
      let _balloon = new zim.Sprite({json: this.frame.asset("ninjashooting.json")})
      _balloon.gotoAndPlay('balloon' + params.balloonIndex)
      _balloon.addEventListener('animationend', event => {
        if (event.target.currentAnimation.indexOf('pop') !== -1) {
          this.balloonSpeed = 10
          event.target.animate({ alpha: 0 }, 100)
        }
      })
      _balloonContainer.x = params.x
      _balloonContainer.y = params.y
      _optionContainer.x = _balloon.width / 2
      _optionContainer.y = _balloon.height * 0.15
      _optionContainer.balloonIndex = params.balloonIndex
      _optionContainer.hit = false
      _balloonContainer.addChild(_balloon, _optionContainer)
      _optionContainer.setBounds(0, 0, _balloon.width, _balloon.height / 2)
      this.contentLayer.addChild(_balloonContainer)
      this.balloonContainers.push(_balloonContainer)
      this.balloons.push(_balloon)
      this.optionContainers[params.index] = _optionContainer
    },
    initObjects () {
      this.balloonSpeed = 1
      this.objectLayer.removeAllChildren()
      this.arrows = []
      let _balloonXs = zim.shuffle(this.balloonXs)
      let _balloonYs = zim.shuffle(this.balloonYs)
      for (let i = 0; i < this.balloonContainers.length; i++) {
        this.balloonContainers[i].x = _balloonXs[i]
        this.balloonContainers[i].y = _balloonYs[i]
        this.optionContainers[i].hit = false
        this.balloonContainers[i].alpha = 1
        this.balloons[i].alpha = 1
        this.balloons[i].gotoAndPlay('balloon' + this.optionContainers[i].balloonIndex)
      }
    },
    showNextQuestion () {
      this.initObjects()
      this.setQuestion()
      this.setOptionContent({ color: 'white' })
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