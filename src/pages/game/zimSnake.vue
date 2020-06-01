<template>
  <div style="width: 100%; text-align: center;">
    <div :id="holder + 'Container'"><div :id="holder"></div></div>
  </div>
</template>

<script>
import GameShellMixin from '../../library/mixins/zimGameShell'
export default {
  name: 'snake',
  mixins: [GameShellMixin],
  data () {
    return {
      assets: ['snake.png', 'snake.json'],
      path: "statics/game/snake/",
      frame: null,
      snakeSpeed: 500,
      gridSize: 28,
      gridDimension: 20,
      initCoord: { x: 10, y: 10 },
      snakeDirection: 'left',
      snakeInitLength: 4,
      snakeGrowth: false,
      snakeBodys: [],
      snakeDie: false,
      snakeCreated: false,
      selectedFruitPositions: [],
      supportLargeContent: true
    }
  },
  computed: {
  },
  methods: {
    createSnake () {
      this.snakeHead = new zim.Sprite({json: this.frame.asset("snake.json")})
      this.snakeHead.gotoAndPlay('snake-head-left')
      this.snakeHead.scale = 0.58
      this.snakeHead.x = this.initCoord.x * this.gridSize
      this.snakeHead.y = this.initCoord.y * this.gridSize
      this.snakeHead.posX = this.initCoord.x
      this.snakeHead.posY = this.initCoord.y

      for (let i = 0; i < this.snakeInitLength; i++) {
        let _snakeBody = new zim.Sprite({json: this.frame.asset("snake.json")})
        if (i === this.snakeInitLength - 2) {
          _snakeBody.gotoAndPlay('snake-tail-b')
        } else if (i === this.snakeInitLength - 1) {
          _snakeBody.gotoAndPlay('snake-tail-a')
        } else {
          _snakeBody.gotoAndPlay('snake-body')
        }
        _snakeBody.scaleY = 0.6
        _snakeBody.scaleX = 0.68
        _snakeBody.posX = (this.initCoord.x + i + 1)
        _snakeBody.posY = this.initCoord.y
        _snakeBody.x = _snakeBody.posX * this.gridSize
        _snakeBody.y = _snakeBody.posY * this.gridSize
        this.movingArea.addChild(_snakeBody)
        this.snakeBodys.push(_snakeBody)
      }

      this.movingArea.addChild(this.snakeHead)
      this.snakeCreated = true
    },
    initGame () {
      this.frame.loadAssets(this.assets, this.path)
      frame.on("complete", () => {
        
        let _borderBox = new zim.Sprite({json: this.frame.asset("snake.json")})
        _borderBox.gotoAndPlay('borderbox')
        _borderBox.x = 70
        _borderBox.y = 130
        _borderBox.width = 600
        _borderBox.height = 600
        this.movingArea = new zim.Container(0, 0, 560, 560)
        this.movingArea.x = 105
        this.movingArea.y = 160
        this.fruitArea = new zim.Container(0, 0, this.movingArea.getBounds().width, this.movingArea.getBounds().height)
        this.fruitArea.x = this.movingArea.x
        this.fruitArea.y = this.movingArea.y
        this.contentLayer.addChild(_borderBox, this.fruitArea, this.movingArea)
        // this.movingArea.outline()

        this.optionArea = new zim.Container(0, 0, this.movingArea.getBounds().width, this.movingArea.getBounds().height)
        this.optionArea.x = this.movingArea.x
        this.optionArea.y = this.movingArea.y
        this.contentLayer.addChild(this.optionArea)

        this.createSnake()

        zim.Ticker.add((event) => {
          if (this.gameStarted && this.snakeCreated && !this.snakeDie) {
            if (this.timeElasped === null) {
              this.timeElasped = new Date().getTime()
            } else {
              let _now = new Date().getTime()
              if (_now - this.timeElasped > this.snakeSpeed) {
                this.timeElasped = _now
                if (this.snakeHead) {
                  let _lastBodyPosX = this.snakeBodys[0].posX
                  let _lastBodyPosY = this.snakeBodys[0].posY
                  if (this.snakeGrowth) {
                    this.snakeGrowth = false
                    let _snakeBody = new zim.Sprite({json: this.frame.asset("snake.json")})
                    _snakeBody.gotoAndPlay('snake-body')
                    _snakeBody.posX = this.snakeHead.posX
                    _snakeBody.posY = this.snakeHead.posY
                    _snakeBody.scaleY = 0.6
                    _snakeBody.scaleX = 0.68
                    this.movingArea.addChild(_snakeBody)
                    this.snakeBodys.unshift(_snakeBody)
                    this.movingArea.addChild(this.snakeHead)
                  } else {
                    for (let i = this.snakeBodys.length - 1; i >= 1; i--) {
                      this.snakeBodys[i].posX = this.snakeBodys[i - 1].posX
                      this.snakeBodys[i].posY = this.snakeBodys[i - 1].posY
                    }
                    this.snakeBodys[0].posX = this.snakeHead.posX
                    this.snakeBodys[0].posY = this.snakeHead.posY
                  }
                  for (let i = 0; i < this.snakeBodys.length; i++) {
                    // console.log(this.snakeBodys[i].posX + ' ' + this.snakeBodys[i].posY)
                    this.snakeBodys[i].x = this.snakeBodys[i].posX * this.gridSize
                    this.snakeBodys[i].y = this.snakeBodys[i].posY * this.gridSize
                  }
                  if (this.snakeDirection === 'left') {
                    if (this.snakeHead.currentAnimation !== 'snake-head-left') {
                      this.snakeHead.gotoAndPlay('snake-head-left')
                    }
                    if (_lastBodyPosY !== this.snakeHead.posY || _lastBodyPosX !== this.snakeHead.posX - 1) {
                      this.snakeHead.posX--
                    }
                  } else if (this.snakeDirection === 'right') {
                    if (this.snakeHead.currentAnimation !== 'snake-head-right') {
                      this.snakeHead.gotoAndPlay('snake-head-right')
                    }
                    if (_lastBodyPosY !== this.snakeHead.posY || _lastBodyPosX !== this.snakeHead.posX + 1) {
                      this.snakeHead.posX++
                    }
                  } else if (this.snakeDirection === 'up') {
                    if (this.snakeHead.currentAnimation !== 'snake-head-top') {
                      this.snakeHead.gotoAndPlay('snake-head-top')
                    }
                    if (_lastBodyPosY !== this.snakeHead.posY - 1 || _lastBodyPosX !== this.snakeHead.posX) {
                      this.snakeHead.posY--
                    }
                  } else if (this.snakeDirection === 'down') {
                    if (this.snakeHead.currentAnimation !== 'snake-head-bottom') {
                      this.snakeHead.gotoAndPlay('snake-head-bottom')
                    }
                    if (_lastBodyPosY !== this.snakeHead.posY + 1 || _lastBodyPosX !== this.snakeHead.posX) {
                      this.snakeHead.posY++
                    }
                  }
                  this.snakeHead.x = this.snakeHead.posX * this.gridSize
                  this.snakeHead.y = this.snakeHead.posY * this.gridSize
                  if (this.snakeHead.posY !== this.snakeBodys[0].posY) {
                    this.snakeBodys[0].rotation = 90
                  } else {
                    this.snakeBodys[0].rotation = 0
                  }
                  for (let i = 1; i < this.snakeBodys.length; i++) {
                    if (this.snakeBodys[i].posY !== this.snakeBodys[i-1].posY) {
                    this.snakeBodys[i].rotation = 90
                    } else {
                      this.snakeBodys[i].rotation = 0
                    }
                  }
                }
                this.checkMovement()
              }
            }
          }
        }, this.stage)

        this.stage.update()
      })
    },
    cleanSnake () {
      this.snakeCreated = false
      this.movingArea.removeAllChildren()
      this.snakeBodys = []
      this.snakeDirection = 'left'
    },
    die () {
      this.snakeDie = true
      this.deduceLife()
      if (this.noOfLifeRemained > 0) {
        setTimeout(() => {
          this.cleanSnake()
          this.createSnake()
          this.showNextQuestion()
        }, this.waitForNext)
      }
    },
    getOptionPosition () {
      let _dif = 4
      let _xArray = zim.shuffle(Array.from(Array(this.gridDimension).keys()))
      let _yArray = zim.shuffle(Array.from(Array(this.gridDimension).keys()).splice(3))

      let _pointFound = false
      for (let i = 0; i < _xArray.length && !_pointFound; i++) {
        if (Math.abs(_xArray[i] - this.snakeHead.posX) > 0) {
          for (let j = 0; j < _yArray.length && !_pointFound; j++) {
            if (Math.abs(_yArray[j] - this.snakeHead.posY) > _dif && Math.abs(_xArray[i] - this.snakeHead.posX) > _dif) {
              if (this.selectedFruitPositions.length === 0) {
                this.selectedFruitPositions.push({ posX: _xArray[i], posY: _yArray[j] })
                _pointFound = true
              } else {
                let _match = true
                for (let k = 0; k < this.selectedFruitPositions.length; k++) {
                  if (Math.abs(this.selectedFruitPositions[k].posX - _xArray[i]) <= _dif && Math.abs(this.selectedFruitPositions[k].posY - _yArray[j]) <= _dif) {
                    _match = false
                  }
                }
                if (_match) {
                  this.selectedFruitPositions.push({ posX: _xArray[i], posY: _yArray[j] })
                  _pointFound = true
                }
              }
            }
          }
        }
      }
    },
    setOptions () {
      // get option positions
      this.selectedFruitPositions = []
      this.optionContainers = []
      for (let i = 0; i < this.currentOptions.length; i++) {
        this.getOptionPosition()
      }
      this.fruitArea.removeAllChildren()
      this.optionArea.removeAllChildren()
      this.fruits = []
      for (let i = 0; i < this.currentOptions.length; i++) {
        let _fruit = new zim.Sprite({json: this.frame.asset("snake.json")})
        _fruit.gotoAndPlay('fruit')
        _fruit.scale = 0.6
        _fruit.x = this.selectedFruitPositions[i].posX * this.gridSize
        _fruit.y = this.selectedFruitPositions[i].posY * this.gridSize
        _fruit.eaten = false
        this.fruitArea.addChild(_fruit)
        this.fruits[i] = _fruit

        let _optionContainer = new zim.Container()
        let _optionBg = new zim.Sprite({json: this.frame.asset("snake.json")})
        _optionBg.gotoAndPlay('answer-box')
        _optionContainer.bg = _optionBg
        _optionContainer.x = this.selectedFruitPositions[i].posX * this.gridSize
        _optionContainer.y = this.selectedFruitPositions[i].posY * this.gridSize
        
        _optionContainer.displayWidth = _optionBg.width

      //  this.optionArea.addChild(_optionContainer)
        this.optionContainers[i] = _optionContainer
      }
      this.setOptionContent({ alpha: 0.8, shiftY: -0.1 })
    },
    checkMovement () {
      if (this.snakeHead.posX < 0 || this.snakeHead.posX >= 20) {
        this.die()
      } else if (this.snakeHead.posY < 0 || this.snakeHead.posY >= 20) {
        this.die()
      } else {
        for (let i = 0; i < this.optionContainers.length; i++) {
          if (this.fruits[i].eaten === false && this.snakeHead.posX === this.snakeBodys[i].posX && this.snakeHead.posY === this.snakeBodys[i].posY) {
            this.die()
          }
        }
      }
      if (!this.snakeDie) {
        for (let i = 0; i < this.selectedFruitPositions.length; i++) {
          if (this.selectedFruitPositions[i].posX === this.snakeHead.posX && this.selectedFruitPositions[i].posY === this.snakeHead.posY) {
            if (this.optionContainers[i].correct) {
              if (this.handleCorrect(this.currentOptions[i].value)) {
                this.snakeGrowth = true
              }
              this.showNextQuestion()
            } else {
              this.handleWrong(false)
              this.hideOption(i)
              if (this.noOfLifeRemained === 0) {
                this.snakeDie = true
              }
            }
          }
        }
      }
    },
    hideOption (index) {
      this.fruits[index].eaten = true
      this.fruits[index].animate({alpha: 0}, 100)
      this.optionContainers[index].animate({alpha: 0}, 100)
    },
    showNextQuestion () {
      if (this.snakeDie) {
        this.cleanSnake()
        this.createSnake()
        this.snakeDie = false
      }
      this.timeElasped = null
      this.setQuestion()
      this.setOptions()
    },
    moveLeftStart () { 
      this.snakeDirection = 'left'
    },
    moveLeftStop () { },
    moveRightStart () { 
      this.snakeDirection = 'right'
    },
    moveRightStop () { },
    moveUpStart () { 
      this.snakeDirection = 'up'
    },
    moveUpStop () { },
    moveDownStart () { 
      this.snakeDirection = 'down'
    },
    moveDownStop () { },
    startGame () {
      this.showNextQuestion()
    }
  },
  created () {
  },
  mounted () {
    this.initGameShell({ arrowControl: true })
  },
  beforeDestroy () {
    this.cleanUp()
  }
}
</script>
