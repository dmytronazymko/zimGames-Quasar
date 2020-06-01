<template>
  <div style="width: 100%; text-align: center;">
    <div :id="holder + 'Container'"><div :id="holder"></div></div>
  </div>
</template>

<script>
import GameShellMixin from "../../library/mixins/zimGameShell";
export default {
  name: 'zim-racing',
  mixins: [GameShellMixin],
  data () {
    return {
      assets: ["racing.png", "racing.json"],
      path: "statics/game/zimracing/",
      roadBgs: [],
      speed: 2,
      carXs: [200, 340, 480],
      changing: false,
      currentLane: 1,
      nextMove: '',
      flagContainers: [],
      answerSelected: false
    }
  },
  methods: {
    initGame () {
      this.frame.loadAssets(this.assets, this.path)
      this.frame.on("complete", () => {

        this.showHeaderLine()
        this.setLeftRightControl()
        
        this.subContentLayer = new zim.Container(0, 0, this.contentLayerWidth, this.height - 150)
        this.subContentLayer.y = 155

        let _rect = new zim.Rectangle(this.contentLayerWidth, this.height - 150, "white")
        _rect.y = 155
        _rect.alpha = 0
        this.subContentLayer.setMask(_rect)

        this.createTrees()

        this.contentLayer.addChild(this.subContentLayer)

        this.createCar()

        this.createFlag()

        zim.Ticker.add(() => {
          if (this.gameStarted) {
            this.moveRoadBg()
          }
        }, this.stage)
      })
    },
    createFlag () {
      for (let i = 0; i < 3; i++) {
        let _flagContainer = new zim.Container()
        let _flag = new zim.Sprite({json: this.frame.asset("racing.json")})
        _flag.gotoAndPlay('flag')
        _flag.scale = 0.65
        _flagContainer.regX = _flag.width / 2
        _flagContainer.regY = _flag.height
        _flagContainer.x = this.carXs[i] + 38
        _flagContainer.y = 0
        let _optionContainer = new zim.Container(0, 0, _flag.width, _flag.height / 2)
        _optionContainer.y = 10
        _flagContainer.addChild(_flag, _optionContainer)
        this.optionContainers[i] = _optionContainer

        this.subContentLayer.addChild(_flagContainer)

        this.flagContainers[i] = _flagContainer
      }
    },
    moveLeftStart () {
      if (!this.changing) {
        if (this.currentLane > 0) {
          this.changing = true
          this.currentLane--
          this.car.animate({ props: { x: this.carXs[this.currentLane]}, time: 300, call: this.moveDone })
          this.car.animate({ props: { rotation: -2 }, time: 150, rewind: true })
        }
      } else {
        this.nextMove = 'left'
      }
    },
    moveRightStart () {
      if (!this.changing) {
        if (this.currentLane < 2) {
          this.changing = true
          this.currentLane++
          this.car.animate({ props: { x: this.carXs[this.currentLane]}, time: 300, call: this.moveDone })
          this.car.animate({ props: { rotation: 2 }, time: 150, rewind: true })
        }
      } else {
        this.nextMove = 'right'
      }
    },
    moveDone () {
      this.changing = false
      if (this.nextMove === 'left') {
        this.moveLeftStart()
      } else if (this.nextMove === 'right') {
        this.moveRightStart()
      }
      this.nextMove = ''
    },
    createCar () {
      this.car = new zim.Sprite({json: this.frame.asset("racing.json")})
      this.car.gotoAndPlay('race-car')

      this.car.scale = 0.7

      this.car.x = this.carXs[1]
      this.car.y = 500

      this.subContentLayer.addChild(this.car)
      // this.car.outline()
    },
    moveRoadBg () {
      let _minY = 0

      for (let i = 0; i < this.roadBgs.length; i++) {
        if (this.roadBgs[i].y < _minY) {
          _minY = this.roadBgs[i].y
        }
      }

      for (let i = 0; i < this.roadBgs.length; i++) {
        if (this.roadBgs[i].y > this.subContentLayer.height) {
          this.roadBgs[i].y = _minY - this.roadBgs[i].height
        }
      }

      for (let i = 0; i < this.roadBgs.length; i++) {
        this.roadBgs[i].y += this.speed
        this.flagContainers[i].y += this.speed
      }

      if (this.car.y <= this.flagContainers[0].y) {
        if (!this.answerSelected) {
          this.answerSelected = true
          if (this.optionContainers[this.currentLane].correct) {
            this.handleCorrect()
          } else {
            this.handleWrong()
          }
        }
      }

      if (this.flagContainers[0].y > this.subContentLayer.height + this.flagContainers[0].height) {
        this.showNextQuestion()
      }

    },
    createTrees () {
      let _y = 0
      for (let i = 0; i < 3; i++) {
        let _roadBg = new zim.Container()
        _roadBg.y = _y
        this.roadBgs.push(_roadBg)
        this.subContentLayer.addChild(_roadBg)

        let _treesLeft = new zim.Sprite({json: this.frame.asset("racing.json")})
        _treesLeft.gotoAndPlay('trees-left')
        _treesLeft.scale = 0.7
        _roadBg.addChild(_treesLeft)
        
        let _roadSideLeft = new zim.Sprite({json: this.frame.asset("racing.json")})
        _roadSideLeft.gotoAndPlay('road-side')
        _roadSideLeft.scaleY = 0.7
        _roadSideLeft.scaleX = 0.5
        _roadSideLeft.x = _treesLeft.width + 50
        _roadBg.addChild(_roadSideLeft)

        let _roadLine = new zim.Sprite({json: this.frame.asset("racing.json")})
        _roadLine.gotoAndPlay('road-line')
        _roadLine.x = 307
        _roadLine.scaleY = 0.7
        _roadLine.scaleX = 0.5
        _roadBg.addChild(_roadLine)

        _y += _roadLine.height

        _roadLine = new zim.Sprite({json: this.frame.asset("racing.json")})
        _roadLine.gotoAndPlay('road-line')
        _roadLine.x = 448
        _roadLine.scaleY = 0.7
        _roadLine.scaleX = 0.5
        _roadBg.addChild(_roadLine)

        let _treesRight = new zim.Sprite({json: this.frame.asset("racing.json")})
        _treesRight.gotoAndPlay('trees-right')
        _treesRight.scale = 0.7
        _treesRight.x = this.contentLayerWidth - _treesRight.width
        _roadBg.addChild(_treesRight)

        let _roadSideRight = new zim.Sprite({json: this.frame.asset("racing.json")})
        _roadSideRight.gotoAndPlay('road-sideInv')
        _roadSideRight.scaleY = 0.7
        _roadSideRight.scaleX = 0.5
        _roadSideRight.x = this.contentLayerWidth - _treesRight.width - _roadSideRight.width - 50
        _roadBg.addChild(_roadSideRight)
      }
      
    },
    resetGame () {
      this.changing = false,
      this.nextMove = ''
      this.answerSelected = false
      for (let i = 0; i < 3; i++) {
        this.flagContainers[i].y = 0
      }
    },
    showNextQuestion () {
      if (this.noOfLifeRemained > 0) {
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