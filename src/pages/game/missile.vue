<template>
  <div style="width: 100%; text-align: center;">
    <div :id="holder + 'Container'"><div :id="holder"></div></div>
  </div>
</template>

<script>
import GameShellMixin from '../../library/mixins/zimGameShell'
export default {
  name: 'missile',
  mixins: [GameShellMixin],
  data () {
    return {
      assets: ["background.png", "missile.png", "missile.json"],
      path: "statics/game/missile/",
      turning: '',
      rocketContainers: [],
      rocketXPositions: [20, 220, 420],
      rocketSpeed: 1,
      missileSpeed: 3,
      missiles: [],
      firing: false,
      firingFrequency: 1000,
      gameLose: false
    }
  },
  methods: {
    initGame () {
      this.frame.loadAssets(this.assets, this.path)
      frame.on("complete", () => {

        let _background = this.frame.asset('background.png')
        _background.width = this.width
        _background.height = this.height
        this.backgroundLayer.addChild(_background)

        this.createMissileLayer()

        this.createBase()
        this.setLeftRightControl()
        this.createQuestionContainer()
        this.createRocket()
        this.createFireButton()
         
        zim.Ticker.add((event) => {
          this.moveObject()
        }, this.stage)

        this.stage.update()
      })
    },
    createMissileLayer() {
      this.missileLayer = this.createContentLayer()
      this.contentLayer.addChild(this.missileLayer)
    },
    moveObject () {
      if (this.gameStarted) {
        if (this.turning === 'left') {
          this.tankContainer.rotation--
        } else if (this.turning === 'right') {
          this.tankContainer.rotation++
        }

        for (let i = 0; i < this.rocketContainers.length; i++) {
          this.rocketContainers[i].y += this.rocketSpeed
        }

        for (let i = 0; i < this.missiles.length; i++) {
          this.missiles[i].x += this.missileSpeed * Math.sin(this.missiles[i].rotation / 180 * Math.PI)
          this.missiles[i].y -= this.missileSpeed * Math.cos(this.missiles[i].rotation / 180 * Math.PI)
        }

        for (let i = 0; i < this.missiles.length; i++) {
          for (let j = 0; j < this.rocketContainers.length; j++) {
            if (!this.rocketContainers[j].exploded) {
              if (this.missiles[i].hitTestBounds(this.rocketContainers[j].rocketBody)) {
                this.missiles[i].animate({ props: { alpha: 0}, time: 300 })
                this.rocketContainers[j].exploded = true
                this.optionContainers[j].animate({ props: { alpha: 0}, time: 300 })
                this.rocketContainers[j].rocket.gotoAndPlay('rocketExplosion')

                if (this.optionContainers[j].correct) {
                  this.handleCorrect()
                  this.waitForNextQuestion()

                  // explode other missiles
                  for (let k = 0; k < this.rocketContainers.length; k++) {
                    if (!this.rocketContainers[k].exploded) {
                      this.rocketContainers[k].exploded = true
                      setTimeout(() => {
                        this.optionContainers[k].animate({ props: { alpha: 0}, time: 300 })
                        this.rocketContainers[k].rocket.gotoAndPlay('rocketExplosion')
                      }, 300)
                    }
                  }
                } else {
                  this.deduceLife()
                }
              }
            }
          }
        }

        for (let i = 0; i < this.rocketContainers.length; i++) {
          if (!this.rocketContainers[i].exploded) {
            if (this.rocketContainers[i].rocketBody.hitTestBounds(this.base)) {
              this.optionContainers[i].animate({ props: { alpha: 0}, time: 300 })
              this.rocketContainers[i].exploded = true
              this.rocketContainers[i].rocket.gotoAndPlay('rocketExplosion')
              if (!this.gameLose) {
                this.gameLose = true
                this.handleWrong()
                if (this.noOfLifeRemained > 0) {
                  this.waitForNextQuestion()
                  this.base.gotoAndStop('base-c')
                } else {
                  this.base.gotoAndStop('base-d')
                }
              }
            }
          }
        }
      }
    },
    moveLeftStart () {
      if (!this.firing) {
        this.turning = 'left'
      }
    },
    moveLeftStop () {
      this.turning = ''
    },
    moveRightStart () {
      if (!this.firing) {
        this.turning = 'right'
      }
    },
    moveRightStop () {
      this.turning = ''
    },
    createFireButton () {
      let _fireButton = new zim.Sprite({json: this.frame.asset("missile.json")})
      _fireButton.gotoAndStop('button-fire')
      _fireButton.scale = 0.8
      _fireButton.x = 70
      _fireButton.y = 500

      _fireButton.on('click', event => {
        if (!this.firing && !this.gameLose) {
          this.firing = true
          this.fireMissile()
          setTimeout(() => {
            this.firing = false
            this.tankContainer.tankGear.gotoAndStop('tank-gear')
          }, this.firingFrequency)
        }
      })

      this.panelLayer.addChild(_fireButton)
    },
    fireMissile () {
      let _missile = new zim.Sprite({json: this.frame.asset("missile.json")})
      _missile.gotoAndStop('missile')
      
      _missile.regX = _missile.width / 2
      _missile.regY = _missile.height
      _missile.scale = 0.7
      _missile.x = this.tankContainer.x
      _missile.y = this.tankContainer.y
      _missile.rotation = this.tankContainer.rotation
      this.missiles.push(_missile)
      this.missileLayer.addChild(_missile)    

      this.tankContainer.tankGear.gotoAndStop('tank-gear2')
    },
    createRocket () {
      for (let i = 0; i < 3; i++) {
        let _rocketContainer = new zim.Container()
        let _rocket = new zim.Sprite({json: this.frame.asset("missile.json")})
        _rocket.gotoAndStop('rocket')
        _rocket.scale = 0.9
        _rocketContainer.addChild(_rocket)
        _rocketContainer.x = this.rocketXPositions[i]

        let _rocketBody = new zim.Container(0, 0, _rocket.width * 0.3, _rocket.height * 0.3)

        let _optionContainer = new zim.Container(0, 0, _rocket.width * 0.3, _rocket.height * 0.3)
        this.optionContainers[i] = _optionContainer

        this.rocketContainers[i] = _rocketContainer
        this.rocketContainers[i].rocket = _rocket
        this.rocketContainers[i].rocketBody = _rocketBody
        _rocketBody.center(_rocketContainer)
        _optionContainer.center(_rocketContainer)
        _optionContainer.y += 10
        this.contentLayer.addChild(_rocketContainer)
        // _rocketBody.outline()
      }

      this.setRocketPosition()
    },
    setRocketPosition () {
      for (let i = 0; i < this.rocketContainers.length; i++) {
        this.rocketContainers[i].exploded = false
        this.rocketContainers[i].y = zim.rand(-400, -200)
      }
    },
    createQuestionContainer () {
      this.questionContainer = new zim.Container(0, 0, 270, 60)
      this.questionContainer.x = 30
      this.questionContainer.y = 690
      this.questionContainer.displayWidth = 270
      this.contentLayer.addChild(this.questionContainer)
    },
    createBase () {
      this.tankContainer = new zim.Container()
      let _tank = new zim.Sprite({json: this.frame.asset("missile.json")})
      _tank.gotoAndStop('tank')
      _tank.scale = 0.8
      this.tankContainer.x = 380
      this.tankContainer.y = 690
      
      this.tankContainer.regX = _tank.width / 2
      this.tankContainer.regY = _tank.height * 0.7

      let _tankGear = new zim.Sprite({json: this.frame.asset("missile.json")})
      _tankGear.gotoAndStop('tank-gear')
      _tankGear.scale = 0.8
      _tankGear.y = 72
      _tankGear.x = 11

      this.tankContainer.tankGear = _tankGear

      this.tankContainer.addChild(_tank, _tankGear)

      this.contentLayer.addChild(this.tankContainer)
      // this.tankContainer.outline()


      this.base = new zim.Sprite({json: this.frame.asset("missile.json")})
      this.base.gotoAndStop('base-a')
      this.contentLayer.addChild(this.base)
      this.base.scale = 0.75
      this.base.y = this.height - this.base.height
      // this.base.outline()
    },
    initObject () {
      this.gameLose = false
      this.setRocketPosition()
      this.missileLayer.removeAllChildren()
      this.missiles = []
      for (let i = 0; i < this.optionContainers.length; i++) {
        this.optionContainers[i].alpha = 1
      }
      for (let i = 0; i < this.rocketContainers.length; i++) {
        this.rocketContainers[i].rocket.gotoAndStop('rocket')
        this.rocketContainers[i].exploded = false
      }
    },
    showNextQuestion () {
      this.initObject()
      this.setQuestion()
      this.setOptionContent()
    },
    startGame () {
      this.base.gotoAndStop('base-a')
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

