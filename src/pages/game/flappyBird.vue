<template>
  <div style="width: 100%; text-align: center;">
    <div :id="holder + 'Container'"><div :id="holder"></div></div>
  </div>
</template>

<script>
import GameShellMixin from '../../library/mixins/zimGameShell'
export default {
  name: 'flappy-bird',
  mixins: [GameShellMixin],
  data () {
    return {
      assets: ["flappy.json", "flappy.png"],
      path: "statics/game/flappy/",
      pipe1Container: null,
      pipe2Container: null,
      topGround1: null,
      topGround2: null,
      bottomGround1: null,
      bottomGround2: null,
      birdDie: false,
      flying: false,
      diveSpeed: 0.01,
      pipeDistance: 600,
      obstacles: [],
      answerSelected: false
    }
  },
  methods: {
    initGame () {
      this.frame.loadAssets(this.assets, this.path)

      this.frame.on("complete", () => {
        
        this.createPipe()
        this.createPipe2()
        this.createGround()

        this.createBird()
        this.createButton()
        this.initObjects()

        zim.Ticker.add((event) => {
          this.moveScene()
        })

        this.stage.update()
      })
    },
    initObjects () {
      this.diveSpeed = 0.01
      this.birdDie = false
      this.bird.x = 100
      this.bird.y = 400
      this.bird.gotoAndPlay('bird-fly')
      this.pipe2Container.x = 800
      this.pipe1Container.x = this.pipe2Container.x + this.pipeDistance
    },
    updateButton () {
      this.button.animate({ props: {x: this.button.originalX + 2, y: this.button.originalY + 2}, time: 100, 
        call: () => { this.button.animate({ props: {x: this.button.originalX, y: this.button.originalY}, time: 100 }) }
      })
      // this.button.x += 1
      // this.button.y -= 1
    },
    createButton () {
      this.button = new zim.Sprite({json: this.frame.asset("flappy.json")})
      this.button.gotoAndPlay('flappy-button')
      this.button.on('click', (event) => {
        if (this.gameStarted && !this.birdDie) {
          this.updateButton()
          this.bird.gotoAndPlay('bird-fly')
          this.bird.rotation = 0
          let _birdY = this.bird.y
          this.flying = true
          this.diveSpeed = 0.01
          this.bird.animate({ props: { y: _birdY - 20}, time: 200, ease:"quadOut",
            call: () => { setTimeout( () => { this.flying = false }, 0) }
          })
        }
      })
      this.button.x = this.button.originalX = 50
      this.button.y = this.button.originalY = 600

      this.button.scale = 0.7
      this.panelLayer.addChild(this.button)
    },
    createBird () {
      this.birdContainer = new zim.Container()
      this.bird = new zim.Sprite({json: this.frame.asset("flappy.json")})
      this.bird.gotoAndPlay('bird-fly')
      this.bird.regX = this.bird.width / 2
      this.bird.regY = this.bird.height / 2
      this.bird.scale = 0.4
      this.bird.x = 100
      this.bird.y = 400
      this.contentLayer.addChild(this.bird)
    },
    moveScene () {
      if (this.gameStarted && !this.birdDie) {
        if (!this.flying) {
          if (this.diveSpeed > 1) {
            this.bird.gotoAndPlay('dive')
            this.bird.rotation = 40
          }
          this.bird.y += this.diveSpeed
          if (this.diveSpeed < 3) {
            this.diveSpeed *= 1.2
          } else {
            this.diveSpeed *= 1.05
          }
        }
        
        let _speed = 2
        this.topGround1.x -= _speed
        this.topGround2.x -= _speed
        this.bottomGround1.x -= _speed
        this.bottomGround2.x -= _speed
        
        this.pipe1Container.x -= _speed
        this.pipe2Container.x -= _speed

        if (this.topGround1.x < this.topGround2.x) {
          if (this.topGround2.x <= 0) {
            this.topGround1.x = this.topGround2.x + this.topGround2.width
            this.bottomGround1.x = this.bottomGround2.x + this.bottomGround2.width
          }
        } else {
          if (this.topGround1.x <= 0) {
            this.topGround2.x = this.topGround1.x + this.topGround1.width
            this.bottomGround2.x = this.bottomGround1.x + this.bottomGround1.width
          }
        }

        if (this.pipe1Container.x < -this.pipe1Container.width) {
          this.pipe1Container.x = this.pipe2Container.x + this.pipeDistance

          this.showNextQuestion()
        }
        if (this.pipe2Container.x < -this.pipe2Container.width) {
          this.pipe2Container.x = this.pipe1Container.x + this.pipeDistance
        }

        if (!this.birdDie && this.bird.hitTestBounds(this.topGround1)) {
          this.handleBirdDie()
        }

        if (!this.birdDie && this.bird.hitTestBounds(this.topGround2)) {
          this.handleBirdDie()
        }

        if (!this.birdDie && this.bird.hitTestBounds(this.bottomGround1)) {
          this.handleBirdDie()
        }

        if (!this.birdDie && this.bird.hitTestBounds(this.bottomGround2)) {
          this.handleBirdDie()
        }

        if (!this.birdDie) {
          for (let i = 0; i < this.obstacles.length; i++) {
            if (this.bird.hitTestBounds(this.obstacles[i])) {
              this.handleBirdDie()
            }
          }
        }

        if (!this.birdDie && !this.answerSelected) {
          for (let i = 0; i < this.optionContainers.length; i++) {
            if (this.bird.hitTestBounds(this.optionContainers[i])) {
              this.answerSelected = true
              if (this.optionContainers[i].correct) {
                this.handleCorrect()
              } else {
                this.handleWrong()
              }
            }
          }
        }

        this.stage.update()
      }
    },
    handleBirdDie () {
      this.birdDie = true
      let _y = this.bottomGround1.y - this.bird.height / 2
      this.bird.gotoAndPlay('dive')
      this.bird.rotation = 40
      this.handleWrong()
      if (this.bird.y < _y) {
        this.bird.animate(
          { props: { y: _y, time: 200, ease:"quadIn",
            call: () => {
              if (this.noOfLifeRemained > 0) {
                this.showNextQuestion()
              }
            }
          }
        })
      }
    },
    createPipe () {
      let _scale = 0.6
      this.pipe1Container = new zim.Container()
      this.contentLayer.addChild(this.pipe1Container)
      this.pipe1Container.y = 170

      let _topPipe = new zim.Sprite({json: this.frame.asset("flappy.json")})
      _topPipe.gotoAndPlay('pipe-top1')
      _topPipe.scale = _scale
      this.pipe1Container.addChild(_topPipe)
      this.obstacles.push(_topPipe)

      let _mid1Pipe = new zim.Sprite({json: this.frame.asset("flappy.json")})
      _mid1Pipe.gotoAndPlay('pipe-mid1')
      _mid1Pipe.y = 155
      _mid1Pipe.scale = _scale
      this.pipe1Container.addChild(_mid1Pipe)
      this.obstacles.push(_mid1Pipe)

      let _mid2Pipe = new zim.Sprite({json: this.frame.asset("flappy.json")})
      _mid2Pipe.gotoAndPlay('pipe-mid1')
      _mid2Pipe.y = 325
      _mid2Pipe.scale = _scale
      this.pipe1Container.addChild(_mid2Pipe)
      this.obstacles.push(_mid2Pipe)

      let _bottomPipe = new zim.Sprite({json: this.frame.asset("flappy.json")})
      _bottomPipe.gotoAndPlay('pipe-bot1')
      _bottomPipe.y = 500
      _bottomPipe.scale = _scale
      this.pipe1Container.addChild(_bottomPipe)
      this.obstacles.push(_bottomPipe)

      for (let i = 0; i < 3; i++) {
        let _answerBoxContainer = new zim.Container()
        let _answerBox = new zim.Sprite({json: this.frame.asset("flappy.json")})
        _answerBox.gotoAndPlay('answer-box')
        _answerBoxContainer.bg = _answerBox
        _answerBox.scale = 0.9
        _answerBox.x = _topPipe.width / 2 - _answerBox.width / 2
        
        _answerBoxContainer.addChild(_answerBox)
        _answerBoxContainer.y = 65 + i * 170
        this.pipe1Container.addChild(_answerBoxContainer)
        this.optionContainers[i] = _answerBoxContainer
      }
    },
    createPipe2 () {
      let _scale = 0.65
      this.pipe2Container = new zim.Container()
      this.contentLayer.addChild(this.pipe2Container)
      this.pipe2Container.y = 170

      let _topPipe = new zim.Sprite({json: this.frame.asset("flappy.json")})
      _topPipe.gotoAndPlay('pipe-top2')
      _topPipe.scale = _scale
      this.pipe2Container.addChild(_topPipe)
      this.obstacles.push(_topPipe)

      let _bottomPipe = new zim.Sprite({json: this.frame.asset("flappy.json")})
      _bottomPipe.gotoAndPlay('pipe-bot2')
      _bottomPipe.y = 440
      _bottomPipe.scale = _scale
      this.pipe2Container.addChild(_bottomPipe)
      this.obstacles.push(_bottomPipe)

      let _middlePipe = new zim.Sprite({json: this.frame.asset("flappy.json")})
      _middlePipe.gotoAndPlay('pipe-mid2')
      _middlePipe.y = 250
      _middlePipe.scale = _scale
      this.pipe2Container.addChild(_middlePipe)
      this.obstacles.push(_middlePipe)
    },
    createGround () {
      this.bottomGround1 = new zim.Container()

      this.bottomGround2 = new zim.Container()
      
      let _ground =  new zim.Sprite({json: this.frame.asset("flappy.json")})
      _ground.gotoAndPlay('floor-block')

      for (let i = 0; i < 12; i++) {
        let _ground =  new zim.Sprite({json: this.frame.asset("flappy.json")})
        _ground.gotoAndPlay('floor-block')
        _ground.scaleY = 0.6
        _ground.x = i * _ground.width
        this.bottomGround1.addChild(_ground)

        this.bottomGround1.y = this.height - _ground.height
      }
      this.contentLayer.addChild(this.bottomGround1)

      for (let i = 0; i < 12; i++) {
        let _ground =  new zim.Sprite({json: this.frame.asset("flappy.json")})
        _ground.gotoAndPlay('floor-block')
        _ground.scaleY = 0.6
        _ground.x = i * _ground.width
        this.bottomGround2.addChild(_ground)

        this.bottomGround2.y = this.height - _ground.height
      }
      this.bottomGround2.x = this.bottomGround1.width
      this.contentLayer.addChild(this.bottomGround2)

      this.topGround1 = new zim.Container()

      for (let i = 0; i < 12; i++) {
        let _ground =  new zim.Sprite({json: this.frame.asset("flappy.json")})
        _ground.gotoAndPlay('floor-block')
        _ground.scaleY = 0.6
        _ground.x = i * _ground.width
        _ground.y = 140
        this.topGround1.addChild(_ground)
      }

      this.contentLayer.addChild(this.topGround1)

      this.topGround2 = new zim.Container()

      for (let i = 0; i < 12; i++) {
        let _ground =  new zim.Sprite({json: this.frame.asset("flappy.json")})
        _ground.gotoAndPlay('floor-block')
        _ground.scaleY = 0.6
        _ground.x = i * _ground.width
        _ground.y = 140
        this.topGround2.addChild(_ground)
      }
      this.topGround2.x = this.topGround1.width

      this.contentLayer.addChild(this.topGround2)
    },
    showNextQuestion () {
      this.answerSelected = false
      this.setQuestion()
      this.setOptionContent()
    },
    startGame () {
      this.initObjects()
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