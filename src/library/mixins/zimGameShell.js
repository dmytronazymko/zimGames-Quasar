import PinyinMixin from './pinyin'
import MathDisplayMixin from './mathDisplay'

export default {
  name: 'zim-game-shell',
  mixins: [PinyinMixin, MathDisplayMixin],
  props: {
    // properties in game shell
    questions: {
      default: () => { return [] }
    },
    noOfLife: {
      type: Number,
      default: 1
    },
    scorePerAnswer: {
      type: Number,
      default: 10
    },
    timePerQuestion: {
      type: Number,
      default: 10
    },
    gameId: {
      default: -1
    },
    gameHeight: {
      default: ''
    },
    gameWidth: {
      default: ''
    }
  },
  data () {
    return {
      zimEngine: true,
      questionContainer: null,
      formationContainer: null,
      currentQuestionIndex: 0,
      currentSubquestionIndex: 0,
      backgroundLayer: null,
      contentLayer: null,
      panelLayer: null,
      panelWidth: 264,
      // scaling: 'fit',
      scaling: 'holder',
      width: 1024,
      height: 768,
      color: '',
      outerColor: '',
      gameShellAssets: ['background.png', 'zimGameShell.png', 'zimGameShell.json'],
      gameShellPath: 'statics/game/theme2/',
      frame: null,
      stage: null,
      stageW: 0,
      stageH: 0,
      gameOverContainer: null,
      restartButton: null,
      startBoxContainer: null,
      gameStarted: false,
      optionContainers: [],
      questionContainers: [],
      answerContainers: [],
      score: 0,
      scoreLabel: null,
      heartIcon: null,
      lifeLabel: null,
      noOfLifeRemained: 0,
      waitForNext: 2000,
      panelLeft: 760,
      contentLayerWidth: 760,
      supportLargeContent: false,
      formationItems: [],
      optionEnabled: true,
      answerBoxContainer: null,
      nextQuestionTimeout: null,
      answers: []
    }
  },
  computed: {
    holder () {
      // return 'holder'
      return 'holder' + zim.rand(1000000, 9999999)
    },
    supportSubquestion () {
      if (typeof this.currentQuestion.subquestions !== 'undefined') {
        return true
      } else {
        return false
      }
    },
    currentQuestion () {
      return this.questions[this.currentQuestionIndex]
    },
    currentOptions () {
      if (this.supportSubquestion) {
        return this.currentSubquestion.options
      } else {
        return this.currentQuestion.options
      }
    },
    currentQuestionType () {
      if (typeof this.currentQuestion.questionType !== 'undefined') {
        return this.currentQuestion.questionType
      } else {
        return ''
      }
    },
    currentQuestionSubtype () {
      if (typeof this.currentQuestion.questionSubtype !== 'undefined') {
        return this.currentQuestion.questionSubtype
      } else {
        return ''
      }
    },
    currentSubquestion () {
      if (this.supportSubquestion) {
        return this.currentQuestion.subquestions[this.currentSubquestionIndex]
      }
    },
    currentSubquestionType () {
      if (this.supportSubquestion) {
        return this.currentSubquestion.type
      }
    },
    currentLargeContent () {
      if (typeof this.currentQuestion.largeContent !== 'undefined') {
        return this.currentQuestion.largeContent
      } else {
        return false
      }
    }
  },
  methods: {
    hideOption () {
      for (let i = 0; i < this.optionContainers.length; i++) {
        this.optionContainers[i].alpha = 0
      }
    },
    showOption () {
      for (let i = 0; i < this.optionContainers.length; i++) {
        this.optionContainers[i].alpha = 1
      }
    },
    correctOptionIndex () {
      for (let i = 0; i < this.optionContainers.length; i++) {
        if (this.optionContainers[i].correct) {
          return i
        }
      }
    },
    updateCurrentQuestionIndex () {
      if (this.supportSubquestion) {
        this.currentSubquestionIndex++
        if (this.currentQuestion.subquestions.length === this.currentSubquestionIndex) {
          this.currentSubquestionIndex = 0
          this.currentQuestionIndex++
        }
      } else {
        this.currentQuestionIndex++
      }
      if (this.currentQuestionIndex === this.questions.length) {
        this.currentQuestionIndex = 0
      }
    },
    setGameStartBox () {
      this.startBoxContainer = new zim.Container()
      let _startBox = new zim.Sprite({json: this.frame.asset("zimGameShell.json")})
      _startBox.width = 800
      _startBox.height = 600
      _startBox.gotoAndPlay('start-box')

      this.gameMenuLayer = new zim.Container()
      let _gameMenuRect = new zim.Rectangle(this.width, this.height, "rgba(255, 255, 255, 0.8)")
      this.gameMenuLayer.addChild(_gameMenuRect)
      this.gameMenuLayer.alpha = 1
      this.stage.addChild(this.gameMenuLayer)

      let _startGamelabel = new zim.Label({
        text: "Start Game",
        size: 80,
        font: "Comic Sans MS",
        color: "black"
      });
      _startGamelabel.regX = _startGamelabel.width / 2
      _startGamelabel.x = _startBox.width / 2
      _startGamelabel.y = 30

      let _playButton = new zim.Sprite({json: this.frame.asset("zimGameShell.json")})
      _playButton.gotoAndPlay('button-play')
      _playButton.regX = _playButton.width / 2
      _playButton.cursor = "pointer"
      _playButton.scale = 0.8
      _playButton.x = _startBox.width / 2
      _playButton.y = 220

      _playButton.on('click', () => {
        this.gameMenuLayer.animate( { props: {alpha: 0}, time: 0 })
        this.startBoxContainer.animate({props: {y: -this.startBoxContainer.height}, time: 500, call: () => { this.prepareToStartGame() }})
      })

      this.startBoxContainer.addChild(_startBox, _startGamelabel, _playButton)

      this.startBoxContainer.center(this.stage)
    },
    showGameOverBox () {
      this.gameStarted = false
      this.gameMenuLayer.animate({props: {alpha: 1}, time: 500})
      this.gameOverContainer.animate({props: {y: -50}, time: 500, call: () => {
        this.restartButton.animate({props: {alpha: 1}, time: 500})
      }})
    },
    setGameOverBox () {
      this.gameOverContainer = new zim.Container()
      this.gameOverContainer.setBounds(0, 0, this.width, this.height)
      let _gameOverBox = new zim.Sprite({json: this.frame.asset("zimGameShell.json")})
      _gameOverBox.width = 800
      _gameOverBox.height = 600
      _gameOverBox.gotoAndPlay('game-over-box')
      this.gameOverContainer.regX = _gameOverBox.width / 2
      // this.gameOverContainer.y = -50
      this.gameOverContainer.y = -this.gameOverContainer.height
      this.gameOverContainer.x = 512

      let _gameOver = new zim.Sprite({json: this.frame.asset("zimGameShell.json")})
      _gameOver.gotoAndPlay('game-over')
      _gameOver.scale = 0.7
      _gameOver.regX = _gameOver.width / 2
      _gameOver.x = 270
      _gameOver.y = 270

      this.restartButton = new zim.Sprite({json: this.frame.asset("zimGameShell.json")})
      this.restartButton.gotoAndPlay('button-restart')
      this.restartButton.regX = this.restartButton.width / 2
      this.restartButton.cursor = "pointer"
      this.restartButton.scale = 0.6
      this.restartButton.x = _gameOverBox.width / 2
      this.restartButton.y = 620
      this.restartButton.alpha = 0
      this.restartButton.on('click', () => {
        this.restartButton.alpha = 0
        this.gameMenuLayer.animate( { props: {alpha: 0}, time: 0 })
        this.gameOverContainer.animate({props: {y: -this.gameOverContainer.height}, ease:"quadInOut", time: 500, call: () => { this.prepareToStartGame() }})
      })

      this.gameOverContainer.addChild(_gameOverBox, _gameOver, this.restartButton)

      this.stage.addChild(this.gameOverContainer)
    },
    createContentLayer () {
      let _contentLayer = new zim.Container()
      
      let _rect = new zim.Rectangle(this.contentLayerWidth, this.height, "white")
      _rect.alpha = 0
      _contentLayer.setMask(_rect)

      return _contentLayer
    },
    setContentLayer () {
      this.contentLayer = this.createContentLayer()
      this.stage.addChild(this.contentLayer)
    },
    setPanelLayer () {
      this.panelLayer = new zim.Container()
      this.panelLayer.setBounds(0, 0, this.panelWidth, this.height)
      
      this.panelLayer.width = this.panelWidth
      this.panelLayer.x = this.panelLeft
      this.stage.addChild(this.panelLayer)
      // this.panelLayer.outline()

      let _scoreContainer = new zim.Container()
      let _scoreBg = new zim.Sprite({json: this.frame.asset("zimGameShell.json")})
      _scoreBg.gotoAndPlay('score-bg')
      _scoreBg.regX = _scoreBg.width / 2
      _scoreBg.x = this.panelWidth / 2
      _scoreBg.y = 10
      _scoreBg.scaleX = 0.5
      _scoreBg.scaleY = 0.4
      _scoreBg.center(_scoreContainer)

      this.scoreLabel = new zim.Label({
        text:"0",
        size:50,
        font:"Comic Sans MS",
        color:"black",
        align:"center"
      });
      this.scoreLabel.center(_scoreContainer)

      let _lifeContainer = new zim.Container(0, 0, this.panelWidth, 80)
      _lifeContainer.y = 120

      this.heartIconContainer = new zim.Container()
      this.heartIcon = new zim.Sprite({json: this.frame.asset("zimGameShell.json")})
      this.heartIcon.gotoAndPlay('heart-icon')
      this.heartIcon.scale = 0.7
      this.heartIconContainer.regX = this.heartIcon.width / 2
      this.heartIconContainer.regY = this.heartIcon.height / 2
      this.heartIconContainer.x = 40 + this.heartIcon.width / 2
      this.heartIconContainer.y = this.heartIcon.height / 2

      this.heartIcon.center(this.heartIconContainer)

      let _lifeCross = new zim.Label({
        text:"x",
        size:55,
        font:"Comic Sans MS",
        color:"#c20000",
      });
      _lifeCross.x = 115
      _lifeContainer.addChild(_lifeCross, this.heartIconContainer)

      this.lifeLabel = new zim.Label({
        text: this.noOfLife,
        size: 65,
        font: "Comic Sans MS",
        color: "#c20000"
      });
      this.lifeLabel.x = 160
      _lifeContainer.addChild(this.lifeLabel)

      this.panelLayer.addChild(_lifeContainer)

      this.panelLayer.addChild(_scoreContainer)
    },
    prepareToStartGame () {
      this.score = 0
      this.scoreLabel.text = '0'
      this.noOfLifeRemained = this.noOfLife
      this.lifeLabel.text = this.noOfLife
      this.gameStarted = true
      this.currentQuestionIndex = 0
      this.currentSubquestionIndex = 0
      this.startGame()
    },
    moveLeftStart () { },
    moveLeftStop () { },
    moveRightStart () { },
    moveRightStop () { },
    moveUpStart () { },
    moveUpStop () { },
    moveDownStart () { },
    moveDownStop () { },
    setLeftRightControl () {
      let _leftArrowButton = new zim.Sprite({json: this.frame.asset("zimGameShell.json")})
      _leftArrowButton.gotoAndPlay('button-left')
      _leftArrowButton.on('mousedown', () => { if (this.gameStarted) this.moveLeftStart() })
      _leftArrowButton.on('pressup', () => { if (this.gameStarted) this.moveLeftStop() })
      _leftArrowButton.regX = _leftArrowButton.width / 2
      _leftArrowButton.regY = _leftArrowButton.height / 2
      _leftArrowButton.x = this.panelLayer.width * 0.25
      _leftArrowButton.y = 680
      _leftArrowButton.scale = 0.8
      this.panelLayer.addChild(_leftArrowButton)

      let _rightArrowButton = new zim.Sprite({json: this.frame.asset("zimGameShell.json")})
      _rightArrowButton.gotoAndPlay('button-right')
      _rightArrowButton.regX = _rightArrowButton.width / 2
      _rightArrowButton.regY = _rightArrowButton.height / 2
      _rightArrowButton.x = this.panelLayer.width * 0.75
      _rightArrowButton.y = 680
      _rightArrowButton.scale = 0.8
      _rightArrowButton.on('mousedown', () => { if (this.gameStarted) this.moveRightStart() })
      _rightArrowButton.on('pressup', () => { if (this.gameStarted) this.moveRightStop() })
      this.panelLayer.addChild(_rightArrowButton)
    },
    setArrowControl () {
      let _leftArrowButton = new zim.Sprite({json: this.frame.asset("zimGameShell.json")})
      _leftArrowButton.gotoAndPlay('arrow-left')
      _leftArrowButton.regX = _leftArrowButton.width / 2
      _leftArrowButton.regY = _leftArrowButton.height / 2
      _leftArrowButton.x = this.panelLayer.width * 0.2
      _leftArrowButton.y = 630
      _leftArrowButton.scale = 0.8
      _leftArrowButton.on('mousedown', () => { if (this.gameStarted) this.moveLeftStart() })
      _leftArrowButton.on('pressup', () => { if (this.gameStarted) this.moveLeftStop() })
      this.panelLayer.addChild(_leftArrowButton)

      let _rightArrowButton = new zim.Sprite({json: this.frame.asset("zimGameShell.json")})
      _rightArrowButton.gotoAndPlay('arrow-right')
      _rightArrowButton.regX = _rightArrowButton.width / 2
      _rightArrowButton.regY = _rightArrowButton.height / 2
      _rightArrowButton.x = this.panelLayer.width * 0.8
      _rightArrowButton.y = 630
      _rightArrowButton.scale = 0.8
      _rightArrowButton.on('mousedown', () => { if (this.gameStarted) this.moveRightStart() })
      _rightArrowButton.on('pressup', () => { if (this.gameStarted) this.moveRightStop() })
      this.panelLayer.addChild(_rightArrowButton)

      let _upArrowButton = new zim.Sprite({json: this.frame.asset("zimGameShell.json")})
      _upArrowButton.gotoAndPlay('arrow-up')
      _upArrowButton.regX = _upArrowButton.width / 2
      _upArrowButton.regY = _upArrowButton.height / 2
      _upArrowButton.x = this.panelLayer.width / 2
      _upArrowButton.y = 550
      _upArrowButton.scale = 0.8
      _upArrowButton.on('mousedown', () => { if (this.gameStarted) this.moveUpStart() })
      _upArrowButton.on('pressup', () => { if (this.gameStarted) this.moveUpStop() })
      this.panelLayer.addChild(_upArrowButton)

      let _downArrowButton = new zim.Sprite({json: this.frame.asset("zimGameShell.json")})
      _downArrowButton.gotoAndPlay('arrow-down')
      _downArrowButton.regX = _downArrowButton.width / 2
      _downArrowButton.regY = _downArrowButton.height / 2
      _downArrowButton.x = this.panelLayer.width / 2
      _downArrowButton.y = 710
      _downArrowButton.scale = 0.8
      _downArrowButton.on('mousedown', () => { if (this.gameStarted) this.moveDownStart() })
      _downArrowButton.on('pressup', () => { if (this.gameStarted) this.moveDownStop() })
      this.panelLayer.addChild(_downArrowButton)
    },
    getNumPad (index) {
      let _num = new zim.Sprite({json: this.frame.asset("zimGameShell.json")})
      _num.gotoAndPlay('num' + index)
      _num.scale = 0.75
      return _num
    },
    resetNumPadValue () {
      this.answerBoxContainer.value = ''
      this.setAnswerBoxValue()
    },
    waitForNextQuestion () {
      if (this.noOfLifeRemained > 0) {
        this.nextQuestionTimeout = setTimeout(() => {
          this.showNextQuestion()
        }, this.waitForNext)
      }
    },
    numberPadEvent (value) {
    },
    setNumberPad () {
      let _numPads = []

      let _numPadSetting = [
        { x: 0, y: 0, value: '1', imageSubfix: '1' },
        { x: 1, y: 0, value: '2', imageSubfix: '2' },
        { x: 2, y: 0, value: '3', imageSubfix: '3' },
        { x: 0, y: 1, value: '4', imageSubfix: '4' },
        { x: 1, y: 1, value: '5', imageSubfix: '5' },
        { x: 2, y: 1, value: '6', imageSubfix: '6' },
        { x: 0, y: 2, value: '7', imageSubfix: '7' },
        { x: 1, y: 2, value: '8', imageSubfix: '8' },
        { x: 2, y: 2, value: '9', imageSubfix: '9' },
        { x: 0, y: 3, value: '0', imageSubfix: '0' },
        { x: 1, y: 3, value: 'enter', imageSubfix: '-enter' },
      ]

      let _numberPadContainer = new zim.Container()
      let _dummyNumPad = this.getNumPad(0)

      for (let i = 0; i < _numPadSetting.length; i++) {
        let _numPad = _numPadSetting[i]
        _numPads[_numPad.value] = this.getNumPad(_numPad.imageSubfix)
        _numPads[_numPad.value].x = _numPad.x * _dummyNumPad.width * 1.05
        _numPads[_numPad.value].y = _numPad.y * _dummyNumPad.height * 1.05
        _numPads[_numPad.value].value = _numPad.value
        _numPads[_numPad.value].on('click', event => {
          let _value = event.target.value
          if (_value !== 'enter') {
            this.addAnswerBoxValue(_value)
          } else {
            this.checkAnswerBox()
          }
        })
        _numberPadContainer.addChild(_numPads[_numPad.value])
      }

      _numberPadContainer.x = 20
      _numberPadContainer.y = 400

      this.answerBoxContainer = new zim.Container()

      let _answerBoxBg = new zim.Sprite({json: this.frame.asset("zimGameShell.json")})
      _answerBoxBg.gotoAndPlay('answer-box')
      _answerBoxBg.scaleX = 1
      _answerBoxBg.scaleY = 0.6

      this.answerBoxContainer.x = 25
      this.answerBoxContainer.y = 320
      this.answerBoxContainer.bg = _answerBoxBg
      this.answerBoxContainer.value = ''
      this.answerBoxContainer.addChild(_answerBoxBg)

      this.answerBoxContainer.label = 
      new zim.Label({ text: '',
        size: 50,
        font: "Comic Sans MS"
      })
      this.answerBoxContainer.label.center(this.answerBoxContainer)
      
      // this.answerBox.label.center(this.answerBox)

      this.panelLayer.addChild(_numberPadContainer, this.answerBoxContainer)
    },
    addAnswerBoxValue (value) {
      this.answerBoxContainer.value += value
      this.setAnswerBoxValue()
    },
    setAnswerBoxValue () {
      this.answerBoxContainer.label.text = this.answerBoxContainer.value

      this.answerBoxContainer.label.scale = 1
      if (this.answerBoxContainer.label.width > this.answerBoxContainer.bg.width * 0.95) {
        this.answerBoxContainer.label.scale = this.answerBoxContainer.bg.width / this.answerBoxContainer.label.width * 0.95
      }

      this.answerBoxContainer.label.center(this.answerBoxContainer)
    },
    checkAnswerBox () {
    },
    setContainerCss () {
      document.getElementById(this.holder + 'Container').style['text-align'] = 'center'
      document.getElementById(this.holder + 'Container').style['margin'] = '0 auto'
      document.getElementById(this.holder + 'Container').style['overflow'] = 'hidden'

      document.getElementById(this.holder).style['width'] = '100%'
      document.getElementById(this.holder).style['position'] = 'relative%'
      document.getElementById(this.holder).style['text-align'] = 'center'

      document.getElementById(this.holder + 'Canvas').style['width'] = '100%'
    },
    initGameShell (params) {
      this.color = zim.white
      this.outerColor = zim.dark

      this.scaling = this.holder

      this.frame = new zim.Frame({
        scaling: this.scaling, 
        width: this.width,
        height: this.height,
        assets: this.gameShellAssets,
        path: this.gameShellPath
      });
      window.frame = this.frame
      this.frame.on("keydown", (e) => {
        if (this.gameStarted) {
          switch (e.keyCode) {
            case 37:
            this.moveLeftStart()
            break
            case 38:
            this.moveUpStart()
            break
            case 39:
            this.moveRightStart()
            break
            case 40:
            this.moveDownStart()
            break
          }
        }
      })
      this.frame.on("keyup", (e) => {
        if (this.gameStarted) {
          switch (e.keyCode) {
            case 37:
            this.moveLeftStop()
            break
            case 38:
            this.moveUpStop()
            break
            case 39:
            this.moveRightStop()
            break
            case 40:
            this.moveDownStop()
            break
          }
        }
      })
      this.frame.on("ready", () => {
        this.stage = this.frame.stage
        this.stageW = this.frame.width
        this.stageH = this.frame.height

        this.backgroundLayer = new zim.Container()

        let _background = this.frame.asset("background.png")
        _background.width = this.stageW
        _background.height = this.stageH
        this.backgroundLayer.addChild(_background)
        this.stage.addChild(this.backgroundLayer)

        this.setContentLayer()
        this.setPanelLayer()

        if (params && params.arrowControl) {
          this.setArrowControl()
        }

        this.setGameStartBox()
        this.setGameOverBox()

        this.initGame()

        this.setContainerCss()
        window.addEventListener('resize', this.resizeGameCanvas, false)
        this.resizeGameCanvas()
      })
    },
    resizeGameCanvas () {
      var _width = window.innerWidth || document.body.clientWidth
      var _height = window.innerHeight || document.body.clientHeight
      var _ratio = _width / this.width
      if (_width / this.width > _height / this.height) {
        _ratio = _height / this.height
      }

      document.getElementById(this.holder + 'Container').style.width = Math.floor(_ratio * this.width) + 'px'
      document.getElementById(this.holder + 'Container').style.height = Math.floor(_ratio * this.height) + 'px'
    },
    showHeaderLine () {
      let _headerLine = new zim.Sprite({json: this.frame.asset("zimGameShell.json")})
      _headerLine.gotoAndPlay('header-line')
      _headerLine.y = 120
      _headerLine.scale = 0.75
      this.contentLayer.addChild(_headerLine)
    },
    createLabel (params) {
      return new zim.Label({
        text: params.value,
        size: 45,
        font: 'Comic Sans MS',
        color: params.color || 'black'
      })
    },
    getDisplayObject (params) {
      let _params = params || {}
      let _displayObjectContainer = new zim.Container()
      let _value = _params.value
      let _color = _params.color || 'black'
      let _found = [],
          _rxp = /{{([^}]+)}}/g,
          _curMatch

      while( _curMatch = _rxp.exec( _value ) ) {
          _found.push( _curMatch );
      }
      if (_found.length === 0) {
        _displayObjectContainer.addChild(
          this.createLabel({ value: _value, color: _color })
        )
      } else {
        let _currentIndex = 0
        let _x = 0
        for (let i = 0; i < _found.length; i++) {
          if (_found[i].index > _currentIndex) {
            let _labelValue = _value.substr(_currentIndex, _found[i].index - _currentIndex)
            let _label = this.createLabel({ value: _labelValue, color: _color })
            _label.x = _x
            _displayObjectContainer.addChild(_label)
            _x = _label.width
            
          }
          let _displayObject = this.generateDisplayObject({ value: _found[i][1], color: _color })
          _displayObject.x = _x
          _displayObjectContainer.addChild(_displayObject)
          _x += _displayObject.width
          _currentIndex += _found[i].index + _found[i][0].length
        }
        if (_currentIndex < _value.length) {
          let _labelValue = _value.substr(_currentIndex, _value.length - _currentIndex)
          let _label = this.createLabel({ value: _labelValue, color: _color })
          _label.x = _x
          _displayObjectContainer.addChild(_label)
          _x = _label.width
        }
      }
      return _displayObjectContainer
    },
    generateEmptyDisplay () {
      return new zim.Container(0, 0, 0, 0)
    },
    generateDisplayObject (params) {
      let _type = params.value.split(',')[0]
      let _values = params.value.split(',')[1]
      let _textColor = params.color || 'black'

      switch (_type) {
        case 'clock':
        return this.generateClock({ value: _values, color: _textColor })
        case 'fn':
        return this.generateFraction({ value: _values, color: _textColor })
        case 'py':
        return this.generatePinyinDisplay({ value: _values, color: _textColor })
        case 'tone':
        return this.generateToneDisplay(_values)
        default:
        console.log(_type + ' is not implemented')
        return this.generateEmptyDisplay()
      }
    },
    setQuestion (params) {
      let _color = 'black'
      if (params && params.color) {
        _color = params.color
      }
      if (!this.supportSubquestion || this.currentSubquestionIndex === 0) {
        if (this.questionContainer === null) {
          this.questionContainer = new zim.Container()
          this.questionContainer.setBounds(0, 0, this.contentLayerWidth, 120)
          this.questionContainer.x = 0
          this.questionContainer.y = 0
          this.contentLayer.addChild(this.questionContainer)
        }
        if (this.currentQuestionType === 'formation') {
          this.questionContainer.setBounds(0, 0, this.panelWidth, 120)
          this.questionContainer.x = 0
          this.questionContainer.y = 300
          this.panelLayer.addChild(this.questionContainer)
        }
        this.questionContainer.removeAllChildren()

        if (this.currentQuestionType === 'formation') {
          this.formationItems = []
          if (this.formationContainer === null) {
            this.formationContainer = new zim.Container(0, 0, 760, 120)
            this.contentLayer.addChild(this.formationContainer)
          }
        }
        if (this.formationContainer) {
          setTimeout(() => {
            this.formationContainer.removeAllChildren()
          }, 1000)
          // this.formationContainer.outline()
        }

        let _displayObject = this.getDisplayObject({ value: this.currentQuestion.title, color: _color })

        if (typeof this.questionContainer.displayWidth !== 'undefined' && _displayObject.width > this.questionContainer.displayWidth * 0.9) {
          _displayObject.scale = this.questionContainer.displayWidth / _displayObject.width * 0.9
        } else {
          _displayObject.scale = 1
        }

        _displayObject.center(this.questionContainer)


        this.questionContainer.alpha = 0
        this.questionContainer.animate({ alpha: 1}, 300)
      }
    },
    setQuestions (params) {
      for (let i = 0; i < this.questionContainers.length; i++) {
        let _value = this.currentQuestion[i].title
        let _color = 'black'
        if (params && params.color) {
          _color = params.color
        }
        let _displayObject = this.getDisplayObject({ value: _value, color: _color})
        if (typeof this.questionContainers[i].displayWidth !== 'undefined' && _displayObject.width > this.questionContainers[i].displayWidth * 0.9) {
          _displayObject.scale = this.questionContainers[i].displayWidth / _displayObject.width * 0.9
        } else {
          _displayObject.scale = 1
        }
        this.questionContainers[i].removeAllChildren()
        _displayObject.center(this.questionContainers[i])
        this.questionContainers[i].alpha = 0
        this.questionContainers[i].animate({ alpha: 1 }, 300)
      }
    },
    setRandomizedAnswer () {
      let _answers = []
      for (let i = 0; i < this.currentQuestion.length; i++) {
        _answers.push(this.currentQuestion[i].answer)
      }
      this.answers = zim.shuffle(_answers)
    },
    setAnswers (params) {
      this.setRandomizedAnswer()
      for (let i = 0; i < this.answerContainers.length; i++) {
        let _value = this.answers[i]
        let _color = 'black'
        if (params && params.color) {
          _color = params.color
        }
        let _displayObject = this.getDisplayObject({ value: _value, color: _color})
        if (typeof this.answerContainers[i].displayWidth !== 'undefined' && _displayObject.width > this.answerContainers[i].displayWidth * 0.9) {
          _displayObject.scale = this.answerContainers[i].displayWidth / _displayObject.width * 0.9
        }
        this.answerContainers[i].removeAllChildren()
        _displayObject.center(this.answerContainers[i])
        this.answerContainers[i].alpha = 0
        this.answerContainers[i].animate({ alpha: 1 }, 300)
      }
    },
    getOptionValue (option) {
      let _value = option.value
      if (typeof option.display !== 'undefined') {
        _value = option.display
      }
      return _value
    },
    setOptionContent (params) {
      this.optionEnabled = true
      let _shuffledOptions = zim.shuffle(this.currentOptions)
      for (let i = 0; i < this.optionContainers.length; i++) {
        let _color = 'black'
        if (params && params.color) {
          _color = params.color
        }
        if (this.optionColors && this.optionColors[i]) {
          _color = this.optionColors[i]
        }
        let _displayObject = this.getDisplayObject({ value: this.getOptionValue(_shuffledOptions[i]), color: _color})

        if (typeof this.optionContainers[i].displayWidth !== 'undefined' && _displayObject.width > this.optionContainers[i].displayWidth * 0.9) {
          _displayObject.scale = this.optionContainers[i].displayWidth / _displayObject.width * 0.9
        }
        this.optionContainers[i].removeAllChildren()
        if (this.optionContainers[i].bg) {
          this.optionContainers[i].addChild(this.optionContainers[i].bg)
        }
        this.optionContainers[i].correct = _shuffledOptions[i].correct
        _displayObject.center(this.optionContainers[i])

        if (params && params.shiftX) {
          _displayObject.x = _displayObject.x + this.optionContainers[i].height * params.shiftX
        }
        if (params && params.shiftY) {
          _displayObject.y = _displayObject.y + this.optionContainers[i].height * params.shiftY
        }
        
        this.optionContainers[i].alpha = 0
        let _alpha = 1
        if (params && params.alpha) {
          _alpha = params.alpha
        }
        if (this.supportLargeContent && this.currentLargeContent) {
          this.optionContainers[i].scale = 1.5
        } else {
          this.optionContainers[i].scale = 1
        }
        if (params && params.hideOption) {
          this.optionContainers[i].alpha = 0
        } else {
          this.optionContainers[i].animate({ alpha: _alpha }, 300)
        }
      }
    },
    handleCorrect (value) {
      let _addScore = false
      if (this.supportSubquestion) {
        if (this.currentQuestionType === 'formation') {
          this.formationItems[this.currentSubquestionType] = value
          this.updateFormationDisplay()
        }
        if (this.currentSubquestionIndex === this.currentQuestion.subquestions.length - 1) {
          this.addScore()
          _addScore = true
        } else {
          _addScore = false
        }
      } else {
        this.addScore()
        _addScore = true
      }
      
      this.updateCurrentQuestionIndex()
      return _addScore
    },
    handleWrong (updateIndex = true) {
      this.deduceLife()
      if (!this.supportSubquestion && updateIndex) {
        this.updateCurrentQuestionIndex()
      }
    },
    updateFormationDisplay () {
      if (this.currentQuestionSubtype === 'pinyin') {
        let _container = this.generatePinyinDisplay({ value: (this.formationItems['pinyin1'] || '') + (this.formationItems['pinyin2'] || '') + (this.formationItems['tone'] || '') })
        _container.regX = _container.width / 2
        _container.regY = _container.height / 2
        _container.scale = 1.5
        this.stage.addChild(_container)
        this.formationContainer.removeAllChildren()
        _container.center(this.formationContainer)
      }
    },
    generateToneDisplay (tone) {
      let _width = 40
      let _height = 40

      let _displayContainer = new zim.Container(0, 0, _width, _height)

      let _toneShape = new zim.Shape(0, 0, _width, _height)
      if (tone + '' === '1') {
        _toneShape.graphics.setStrokeStyle(4).beginStroke("#000000").moveTo(3, _height / 2 - 5).lineTo(_width - 3, _height / 2 - 5)
      } else if (tone + ''  === '2') {
        _toneShape.graphics.setStrokeStyle(4).beginStroke("#000000").moveTo(3, _height / 2).lineTo(_width - 3, _height / 2 - 10)
      } else if (tone + ''  === '3') {
        let _midX = _width * 0.4
        _toneShape.graphics.setStrokeStyle(4).beginStroke("#000000").moveTo(3, _height / 2).lineTo(_midX, 30).lineTo(_width - 3, _height / 2 - 5)
      } else if (tone + ''  === '4') {
        _toneShape.graphics.setStrokeStyle(4).beginStroke("#000000").moveTo(3, _height / 2 - 10).lineTo(_width - 3, _height / 2)
      }
      _toneShape.center(_displayContainer)

      return _displayContainer
    },
    checkOptionResult (index) {
      if (this.optionContainers[index].correct === true) {
        this.handleCorrect()
      } else {
        this.handleWrong()
      }
    },
    optionClicked (index) {
      this.checkOptionResult(index)
    },
    createStandardOptions (params) {
      let _noOfOption = 3
      let _height = 100
      let _y = 400
      if (params && params.noOfOption) {
        _noOfOption = params.noOfOption
      }
      for (let i = 0; i < _noOfOption; i++) {
        this.optionContainers[i] = new zim.Container()
        
        this.optionContainers[i].y = _y + i * _height * 1.1
        this.optionContainers[i].setBounds(0, 0, this.panelWidth, _height)
        if (params && params.optionBgs && params.optionBgs[i]) {
          if (params.optionBgs[i].height > _height) {
            params.optionBgs[i].scale = _height / params.optionBgs[i].height
          }
          this.optionContainers[i].bg = params.optionBgs[i]
          params.optionBgs[i].center(this.optionContainers[i])
        }
        this.panelLayer.addChild(this.optionContainers[i])
        this.optionContainers[i].index = i
        this.optionContainers[i].name = 'optionContainer'
        this.optionContainers[i].on('click', (event) => {
          if (this.optionEnabled) {
            let _target = event.target.parent
            if (typeof _target.name === 'undefined' || _target.name !== 'optionContainer') {
              _target = event.target.parent.parent
            }
            this.optionClicked(_target.index)
            this.optionEnabled = false
          }
        })
        // this.optionContainers[i].outline()
      }
    },
    getParentContainer (object) {
      if (typeof object.name !== 'undefined' && object.name === 'optionContainer') {
        return object
      } else {
        if (typeof object.parent !== 'undefined') {
          return this.getParentContainer(object.parent)
        } else {
          return {}
        }
      }
    },
    addScore () {
      this.score += this.scorePerAnswer
      this.scoreLabel.text = this.score
      this.scoreLabel.animate({ props: { scale: 1.3 }, time: 100, rewind: true })
    },
    deduceLife () {
      if (this.noOfLifeRemained > 0) {
        this.noOfLifeRemained--
        this.lifeLabel.text = this.noOfLifeRemained
      }
      this.heartIconContainer.animate({ props: { scale: 1.3, alpha: 0 }, time: 100, rewind: true })
      
      if (this.noOfLifeRemained === 0) {
        setTimeout(() => {
          this.showGameOverBox()
        }, this.waitForNext)
      }
    },
    gameOver () {
      setTimeout(() => {
        this.showGameOverBox()
      }, this.waitForNext)
    },
    cleanUp () {
      if (this.nextQuestionTimeout !== null) {
        clearTimeout(this.nextQuestionTimeout)
      }
      window.removeEventListener('resize', this.resizeGameCanvas)
      zim.Ticker.removeAll()
      if (this.stage) {
        this.stage.removeAllChildren();
        this.stage.update();
      }
      if (window.frame) {
        window.frame = null
      }
      if (this.frame) {
        this.frame = null
      }
    }
  }
}