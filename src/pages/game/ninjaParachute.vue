<template>
  <div style="width: 100%; text-align: center;">
    <div :id="holder + 'Container'"><div :id="holder"></div></div>
  </div>
</template>

<script>
import GameShellMixin from '../../library/mixins/zimGameShell'
export default {
  name: 'sample',
  mixins: [GameShellMixin],
  data () {
    return {
      assets: ["background.png", "ninjaparachute.png", "ninjaparachute.json", "ninja.png"],
      path: "statics/game/ninjaparachute/",
      containers: [],
      colors: ['red', 'blue', 'green'],
      ninjaContainers: [],
      speed: 0.5,
      yPositions: [-50, 0, 100],
      xPositions: [120, 390, 660],
      xShift: [-20, 0, 20],
      changeXPosDuration: 500,
      noOfLanded: 0
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

        this.createAnswerBox()
        this.createNinja()
        this.createBox()
        this.createAnswerContainer()
         
        zim.Ticker.add((event) => {
          this.moveNinja()
        }, this.stage)

        this.stage.update()
      })
    },
    moveNinja () {
      if (this.gameStarted) {
        for (let i = 0; i < this.ninjaContainers.length; i++) {
          if (this.ninjaContainers[i].y < 710) {
            this.ninjaContainers[i].y += this.speed
            this.ninjaContainers[i].ninja.scale = 0.2 + (this.ninjaContainers[i].y / 640) * 0.4
            this.ninjaContainers[i].regX = this.ninjaContainers[i].ninja.width / 2
            this.ninjaContainers[i].regY = this.ninjaContainers[i].ninja.height
          } else if (!this.ninjaContainers[i].landed) {
            this.noOfLanded++
            this.ninjaContainers[i].landed = true
            if (this.answers[this.ninjaContainers[i].xPosition] === this.currentQuestion[i].answer) {
              this.addScore()
              this.ninjaContainers[i].ninja.gotoAndPlay(this.colors[i] + '-win')
            } else {
              this.deduceLife()
              this.ninjaContainers[i].ninja.gotoAndPlay(this.colors[i] + '-lose')
            }
            this.isCompleted()
          }
        }
      }
    },
    isCompleted () {
      if (this.noOfLanded === this.colors.length) {
        this.updateCurrentQuestionIndex()
        this.waitForNextQuestion()
      }
    },
    createAnswerContainer () {
      for (let i = 0; i < this.colors.length; i++) {
        let _answerContainer = new zim.Container(0, 0, 115, 80)
        _answerContainer.x = i * 275 + 50
        _answerContainer.y = 660

        this.answerContainers[i] = _answerContainer

        this.contentLayer.addChild(_answerContainer)
      }
    },
    createBox () {
      let _boxes = new zim.Sprite({json: this.frame.asset("ninjaparachute.json")})
      _boxes.gotoAndPlay('boxes')
      _boxes.scale = 0.75
      _boxes.y = this.height - _boxes.height

      this.contentLayer.addChild(_boxes)
    },
    createNinjaSprite () {
      return new zim.Sprite({
        image: this.frame.asset("ninja.png"),
        cols: 5,
        rows: 3,
        animations: {
          "green-fly": { frames: [0, 1, 2], next: "green-fly", speed: 0.1  },
          "red-fly": { frames: [5, 6, 7], next: "red-fly", speed: 0.1  },
          "blue-fly": { frames: [10, 11, 12], next: "blue-fly", speed: 0.1  },
          "green-win": { frames: 3 },
          "green-lose": { frames: 4 },
          "red-win": { frames: 8 },
          "red-lose": { frames: 9 },
          "blue-win": { frames: 13 },
          "blue-lose": { frames: 14 }
        }
      })
    },
    createNinja () {
      let _yPositions = zim.shuffle(this.yPositions)
      for (let i = 0; i < this.colors.length; i++) {
        let _ninja = this.createNinjaSprite()
        _ninja.gotoAndPlay(this.colors[i] + '-fly')
        _ninja.x = this.xShift[i]

        let _ninjaContainer = new zim.Container()

        _ninjaContainer.addChild(_ninja)

        _ninjaContainer.ninja = _ninja


        this.ninjaContainers[i] = _ninjaContainer

        this.contentLayer.addChild(_ninjaContainer)
      }

      this.resetNinja()
    },
    resetNinja () {
      let _yPositions = zim.shuffle(this.yPositions)
      for (let i = 0; i < this.colors.length; i++) {
        this.ninjaContainers[i].ninja.gotoAndPlay(this.colors[i] + '-fly')
        this.ninjaContainers[i].x = this.xPositions[i]
        this.ninjaContainers[i].xPosition = i
        this.ninjaContainers[i].y = _yPositions[i]

        this.ninjaContainers[i].ninja.scale = 0.2 + (this.ninjaContainers[i].y / 640) * 0.4

        this.ninjaContainers[i].regY = this.ninjaContainers[i].ninja.height
        this.ninjaContainers[i].regX = this.ninjaContainers[i].ninja.width / 2
      }
    },
    createAnswerBox () {
      for (let i = 0; i < this.colors.length; i++) {
        let _answerBoxContainer = new zim.Container()

        let _answerBoxBg = new zim.Sprite({json: this.frame.asset("ninjaparachute.json")})
        _answerBoxBg.gotoAndStop('button-bg-' + this.colors[i])
        _answerBoxBg.scale = 0.7
        _answerBoxContainer.addChild(_answerBoxBg)

        let _leftButton = new zim.Sprite({json: this.frame.asset("ninjaparachute.json")})
        _leftButton.gotoAndStop(this.colors[i] + '-left')
        _leftButton.scale = 0.8
        _leftButton.x = 20
        _leftButton.y = 80
        _leftButton.index = i

        _leftButton.on('click', event => {
          this.clickButton('left', event.target.index)
        })

        let _rightButton = new zim.Sprite({json: this.frame.asset("ninjaparachute.json")})
        _rightButton.gotoAndStop(this.colors[i] + '-right')
        _rightButton.scale = 0.8
        _rightButton.x = 110
        _rightButton.y = 80
        _rightButton.index = i

        _rightButton.on('click', event => {
          this.clickButton('right', event.target.index)
        })

        _answerBoxContainer.addChild(_leftButton, _rightButton)

        _answerBoxContainer.x = (this.panelWidth - _answerBoxBg.width) / 2
        _answerBoxContainer.y = 280 + _answerBoxBg.height * 1.05 * i

        let _questionContainer = new zim.Container(0, 0, _answerBoxBg.width, _answerBoxBg.height / 2)
        this.questionContainers[i] = _questionContainer
        this.questionContainers[i].displayWidth = _answerBoxBg.width,
        _answerBoxContainer.addChild(_questionContainer)

        this.panelLayer.addChild(_answerBoxContainer)
      }
    },
    clickButton (direction, index) {
      this.moveDirection(direction, index)
    },
    moveDirection (direction, index) {
      if (!this.ninjaContainers[index].landed) {
        if (this.ninjaContainers[index].moving === false) {
          if (direction === 'left' && this.ninjaContainers[index].xPosition > 0) {
            this.ninjaContainers[index].moving = true
            let _xPositionIndex = this.ninjaContainers[index].xPosition - 1
            this.ninjaContainers[index].xPosition = _xPositionIndex
            this.ninjaContainers[index].ninja.rotation = -10
            this.ninjaContainers[index].animate({ props: { x: this.xPositions[_xPositionIndex] }, time: this.changeXPosDuration })
            setTimeout(() => {
              this.moveDone(index)
            }, this.changeXPosDuration)
          } else if (direction === 'right' && this.ninjaContainers[index].xPosition < 2) {
            this.ninjaContainers[index].moving = true
            let _xPositionIndex = this.ninjaContainers[index].xPosition + 1
            this.ninjaContainers[index].xPosition = _xPositionIndex
            this.ninjaContainers[index].ninja.rotation = 10
            this.ninjaContainers[index].animate({ props: { x: this.xPositions[_xPositionIndex] }, time: this.changeXPosDuration })
            setTimeout(() => {
              this.moveDone(index)
            }, this.changeXPosDuration)
          }
        } else {
          this.ninjaContainers[index].nextMove = direction
        }
      }
    },
    moveDone (index) {
      this.ninjaContainers[index].moving = false
      this.ninjaContainers[index].ninja.rotation = 0
      if (this.ninjaContainers[index].nextMove !== '') {
        this.moveDirection(this.ninjaContainers[index].nextMove, index)
        this.ninjaContainers[index].nextMove = ''
      }
    },
    initObject () {
      this.noOfLanded = 0
      this.resetNinja()
      for (let i = 0; i < this.colors.length; i++) {
        this.ninjaContainers[i].moving = false
        this.ninjaContainers[i].nextMove = ''
        this.ninjaContainers[i].landed = false
      }
    },
    showNextQuestion () {
      this.initObject()
      this.setQuestions({ color: 'white' })
      this.setAnswers()
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

