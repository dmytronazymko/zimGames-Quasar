<template>
  <div style="width: 100%; text-align: center;">
    <div :id="holder + 'Container'"><div :id="holder"></div></div>
  </div>
</template>

<script>
import GameShellMixin from '../../library/mixins/zimGameShell'
export default {
  name: 'ninja-ghost-leg',
  mixins: [GameShellMixin],
  data () {
    return {
      assets: ["background.png", "ninjaghostleg.json", "ninjaghostleg.png"],
      path: "statics/game/ninjaghostleg/",
      xs: [220, 415, 610],
      columnDistance: 0,
      ninjas: [],
      ninjaSelected: false,
      paths: [],
      currentNode: 0,
      currentPosition: '', // left, middle, right
      currentNinja: {},
      pathHeight: 0,
      ninjaColors: ['green', 'blue', 'purple']
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

        this.pathLayer = new zim.Container()
        this.contentLayer.addChild(this.pathLayer)


        this.columnDistance = this.xs[1] - this.xs[0]

        this.createPath()
        this.createAnswerBox()
        this.createButtons()

        this.createNinja({ color: 'green', x: this.xs[0], y: 250 })
        this.createNinja({ color: 'blue', x: this.xs[1], y: 250 })
        this.createNinja({ color: 'purple', x: this.xs[2], y: 250 })

        for (let i = 0; i < this.ninjas.length; i++) {
          this.ninjas[i].alpha = 0
        }

        this.stage.update()
      })
    },
    selectNinja (index) {
      this.currentNinja = {}
      this.currentNinja['ninja'] = this.ninjas[index]
      this.currentNinja['node'] = 0
      
      if (index === 0) {
        this.currentNinja['position'] = 'left'
        this.currentNinja['color'] = 'green'
      } else if (index === 1) {
        this.currentNinja['position'] = 'middle'
        this.currentNinja['color'] = 'blue'
      } else if (index === 2) {
        this.currentNinja['position'] = 'right'
        this.currentNinja['color'] = 'purple'
      }
      this.currentNinja['ninja'].gotoAndPlay(this.currentNinja['color'] + 'Down')
      this.currentNinja['ninja'].animate({ props: { y: this.currentNinja['ninja'].y + 60}, time: 300, ease: "linear" })
      setTimeout(() => {
        this.moveNinja()
      }, 300)
    },
    getDirection () {
      if (this.paths[this.currentNinja['node']] === '') {
        return 'Down'
      } else if (this.paths[this.currentNinja['node']] === 'l') {
        if (this.currentNinja['position'] === 'right') {
          return 'Down'
        } else if (this.currentNinja['position'] === 'middle') {
          return 'Left'
        } else if (this.currentNinja['position'] === 'left') {
          return 'Right'
        }
      } else if (this.paths[this.currentNinja['node']] === 'r') {
        if (this.currentNinja['position'] === 'right') {
          return 'Left'
        } else if (this.currentNinja['position'] === 'middle') {
          return 'Right'
        } else if (this.currentNinja['position'] === 'left') {
          return 'Down'
        }
      }
    },
    moveNinjaDown () {
      if (this.currentNinja['ninja'].currentAnimation !== this.currentNinja['color'] + 'Down') {
        this.currentNinja['ninja'].gotoAndPlay(this.currentNinja['color'] + 'Down')
      }
      this.currentNinja['ninja'].animate({ props: { y: this.currentNinja['ninja'].y + this.pathHeight}, time: 300, ease: "linear" })
      setTimeout(() => {
        this.currentNinja['node']++
        this.moveNinja()
      }, 300)
    },
    updateNinjaPosition (direction) {
      if (this.currentNinja['position'] === 'left') {
        if (direction === 'right') {
          this.currentNinja['position'] = 'middle'
        }
      } else if (this.currentNinja['position'] === 'middle') {
        if (direction === 'right') {
          this.currentNinja['position'] = 'right'
        } else if (direction === 'left') {
          this.currentNinja['position'] = 'left'
        }
      } else if (this.currentNinja['position'] === 'right') {
        if (direction === 'left') {
          this.currentNinja['position'] = 'middle'
        }
      }
    },
    moveNinja () {
      if (this.currentNinja['node'] < this.paths.length) {
        let _direction = this.getDirection()

        if (this.currentNinja['ninja'].currentAnimation !== this.currentNinja['color'] + _direction) {
          this.currentNinja['ninja'].gotoAndPlay(this.currentNinja['color'] + _direction)
        }

        if (_direction === 'Down') {
          this.moveNinjaDown()
        } else if (_direction === 'Left') {
          this.currentNinja['ninja'].animate({ props: { x: this.currentNinja['ninja'].x - this.columnDistance}, time: 800, ease: "linear" })
          setTimeout(() => {
            this.updateNinjaPosition('left')
            this.moveNinjaDown()
          }, 800)
        } else if (_direction === 'Right') {
          this.currentNinja['ninja'].animate({ props: { x: this.currentNinja['ninja'].x + this.columnDistance}, time: 800, ease: "linear" })
          setTimeout(() => {
            this.updateNinjaPosition('right')
            this.moveNinjaDown()
          }, 800)
        }
      } else {
        this.currentNinja['ninja'].gotoAndPlay(this.currentNinja['color'] + 'Stand')
        this.checkAnswer()
      }
    },
    checkAnswer () {
      let _correct = false
      if (this.currentNinja['position'] === 'left') {
        if (this.optionContainers[0].correct) {
          _correct = true
        }
      } else if (this.currentNinja['position'] === 'middle') {
        if (this.optionContainers[1].correct) {
          _correct = true
        }
      } else if (this.currentNinja['position'] === 'right') {
        if (this.optionContainers[2].correct) {
          _correct = true
        }
      }
      if (_correct) {
        this.currentNinja['ninja'].gotoAndPlay(this.currentNinja['color'] + 'Win')
        this.handleCorrect()
      } else {
        this.currentNinja['ninja'].gotoAndPlay(this.currentNinja['color'] + 'Lose')
        this.handleWrong()
      }
      if (this.noOfLifeRemained > 0) {
        setTimeout(() => {
          this.showNextQuestion()
        }, this.waitForNext)
      }
    },
    createButton (params) {
      let _button = new zim.Sprite({json: this.frame.asset("ninjaghostleg.json")})
      _button.gotoAndPlay('button' + params.buttonIndex)
      _button.x = params.x
      _button.y = params.y
      _button.index = params.index
      _button.scale = 0.75
      _button.on('click', event => {
        if (!this.ninjaSelected) {
          this.ninjaSelected = true
          this.selectNinja(event.target.index)
        }
      })
      return _button
    },
    createButtons () {
      let _button = this.createButton({ x: 35, y: 450, buttonIndex: 1, index: 0})
      this.panelLayer.addChild(_button)
      _button = this.createButton({ x: 35, y: 550, buttonIndex: 2, index: 1})
      this.panelLayer.addChild(_button)
      _button = this.createButton({ x: 35, y: 650, buttonIndex: 3, index: 2})
      this.panelLayer.addChild(_button)
    },
    createAnswerBox () {
      for (let i = 0; i < 3; i++) {
        let _answerBoxContainer = new zim.Container()
        let _answerBoxBg = new zim.Sprite({json: this.frame.asset("ninjaghostleg.json")})
        _answerBoxBg.gotoAndPlay('answer-box')
        let _optionContainer = new zim.Container()
        _answerBoxContainer.addChild(_answerBoxBg)
        _optionContainer.setBounds(0, 0, _answerBoxBg.width, _answerBoxBg.height)
        _answerBoxContainer.regX = _answerBoxContainer.width / 2
        _answerBoxContainer.regY = _answerBoxContainer.height / 2
        _answerBoxContainer.y = 680
        _answerBoxContainer.x = this.xs[i]
        this.contentLayer.addChild(_answerBoxContainer)
        _answerBoxContainer.addChild(_optionContainer)
        this.optionContainers[i] = _optionContainer
      }
    },
    getPath (path) {
      let _path = new zim.Sprite({json: this.frame.asset("ninjaghostleg.json")})
      _path.gotoAndPlay(path)
      _path.regX = _path.width / 2
      _path.regY = _path.height
      return _path
    },
    createPath () {
      let _pathLength = 8
      this.pathLayer.removeAllChildren()

      let _paths = []
      let _noOfNode = Math.floor(Math.random() * 4) + 4

      let _noOfLeft = Math.floor(_noOfNode / 2)
      let _noOfRight = _noOfNode - _noOfLeft

      for (let j = 0; j < _noOfLeft; j++) {
        _paths.push('l')
      }
      for (let j = 0; j < _noOfRight; j++) {
        _paths.push('r')
      }
      for (let j = 0; j < _pathLength - _noOfNode; j++) {
        _paths.push('')
      }

      _paths = zim.shuffle(_paths)
      this.paths = _paths

      for (let i = 0; i < this.xs.length; i++) {
        let _y = 270

        let _path
        _path = this.getPath('start')
        _path.x = this.xs[i]
        _path.y = _y
        _y += 18
        this.pathLayer.addChild(_path)

        for (let j = 0; j < _pathLength; j++) {
          if (i === 0) {
            if (_paths[j] === 'l') {
              _path = this.getPath('mid-right')
              let _subPath = this.getPath('right')
              _subPath.y = _y + _path.height 
              _subPath.x = this.xs[i] + _subPath.width
              this.pathLayer.addChild(_subPath)

              for (let k = 0; k < 2; k++) {
                _subPath = this.getPath('turn-mid')
                _subPath.y = _y + _path.height - 5
                _subPath.x = this.xs[i] + (k + 2) * _subPath.width
                this.pathLayer.addChild(_subPath)
              }

              _subPath = this.getPath('left')
              _subPath.y = _y + _path.height - 1
              _subPath.x = this.xs[i] + 4 * _subPath.width
              this.pathLayer.addChild(_subPath)
            } else {
              _path = this.getPath('mid')
              this.pathHeight = _path.height
            }
          } else if (i === 1) {
            if (_paths[j] === 'l') {
              _path = this.getPath('mid-left')
            } else if (_paths[j] === 'r') {
              _path = this.getPath('mid-right')
              let _subPath = this.getPath('right')
              _subPath.y = _y + _path.height 
              _subPath.x = this.xs[i] + _subPath.width
              this.pathLayer.addChild(_subPath)

              for (let k = 0; k < 2; k++) {
                
                _subPath = this.getPath('turn-mid')
                _subPath.y = _y + _path.height - 5
                _subPath.x = this.xs[i] + (k + 2) * _subPath.width
                this.pathLayer.addChild(_subPath)
              }

              _subPath = this.getPath('left')
              _subPath.y = _y + _path.height - 1
              _subPath.x = this.xs[i] + 4 * _subPath.width
              this.pathLayer.addChild(_subPath)

              _path = this.getPath('mid-right')
            } else {
              _path = this.getPath('mid')
            }
          } else {
            if (_paths[j] === 'r') {
              _path = this.getPath('mid-left')
            } else {
              _path = this.getPath('mid')
            }
          }
          
          _path.x = this.xs[i]
          _path.y = _y + _path.height
          _y += _path.height
          this.pathLayer.addChild(_path)
        }

        _path = this.getPath('end')
        _path.y = _y + 21
        _path.x = this.xs[i]
        this.pathLayer.addChild(_path)
      }

    },
    createNinja (params) {
      let _ninja = new zim.Sprite({json: this.frame.asset("ninjaghostleg.json")})
      _ninja.gotoAndPlay(params.color + 'Stand')
      
      _ninja.x = params.x
      _ninja.y = params.y
      _ninja.regX = 74
      _ninja.regY = _ninja.height

      this.ninjas.push(_ninja)

      this.contentLayer.addChild(_ninja)
    },
    initObjects () {
      
      for (let i = 0; i < this.ninjas.length; i++) {
        this.ninjas[i].animate({ alpha: 0 }, 100)
        this.ninjas[i].gotoAndPlay(this.ninjaColors[i] + 'Stand')
        setTimeout(() => {
          for (let j = 0; j < this.ninjas.length; j++) {
            this.ninjas[j].x = this.xs[j]
            this.ninjas[j].y = 250
            this.ninjas[j].animate({ alpha: 1 }, 100)
          }
        }, 100)
      }
      this.ninjaSelected = false
      this.currentNode = 0
    },
    showNextQuestion () {
      this.initObjects()
      this.createPath()
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