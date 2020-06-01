<template>
  <div style="width: 100%; text-align: center;">
    <div :id="holder + 'Container'"><div :id="holder"></div></div>
  </div>
</template>

<script>
import GameShellMixin from '../../library/mixins/zimGameShell'
export default {
  name: 'rifle',
  mixins: [GameShellMixin],
  data () {
    return {
      targets: [],
      targetColors: ['red', 'green', 'yellow'],
      targetPositions: [
        {x: 52, y: 318}, {x: 120, y: 318}, {x: 188, y: 318},
        {x: 52, y: 418}, {x: 120, y: 418}, {x: 188, y: 418},
        {x: 52, y: 518}, {x: 120, y: 518}, {x: 188, y: 518},
        {x: 52, y: 618}, {x: 120, y: 618}, {x: 188, y: 618},
        {x: 52, y: 718}, {x: 120, y: 718}, {x: 188, y: 718},
        {x: 405, y: 408}, {x: 475, y: 408}, {x: 600, y: 335},
        {x: 369, y: 506}, {x: 410, y: 506}, {x: 451, y: 506}, {x: 492, y: 506}, {x: 534, y: 506}, {x: 575, y: 506}, {x: 617, y: 506},
        {x: 290, y: 653}, {x: 339, y: 653}, {x: 388, y: 653}, {x: 437, y: 653}, {x: 486, y: 653}, {x: 535, y: 653}, {x: 582, y: 653}, {x: 631, y: 653},
        {x: 290, y: 713}, {x: 339, y: 713}, {x: 388, y: 713}, {x: 437, y: 713}, {x: 486, y: 713}, {x: 535, y: 713}, {x: 582, y: 713}, {x: 631, y: 713},
      ],
      assets: ["bg.png", "bg-buildings.png", "bg-dark.png", "Kill Target-33.png", "rifle.png", "rifle.json"],
      path: "statics/game/rifle/",
      rifleScopeContainer: null,
      joystickPosition: null,
      joystick: null,
      dragging: false,
      maskScope: null,
      rifleScope: null,
      fireEnabled: true,
      rifleScopeInitPosition: { x: 400, y: 400 }
    }
  },
  computed: {
    optionColors () {
      return ['#6d031f', '#11632e', '#c47b12']
    }
  },
  methods: {
    resetRifleScopePosition () {
      this.rifleScope.gotoAndPlay('rifle-scope-original')
      this.rifleScopeContainer.animate({props: {x: this.rifleScopeInitPosition.x, y: this.rifleScopeInitPosition.y }, time: 100})

      this.maskScope.animate({props: {x: this.rifleScopeInitPosition.x, y: this.rifleScopeInitPosition.y }, time: 100})
    },
    updateRifleScope () {
      if (this.gameStarted && this.dragging) {
        let _difX = this.joystick.x - this.joystickPosition.x
        let _difY = this.joystick.y - this.joystickPosition.y

        let _nextX = this.rifleScopeContainer.x + _difX / (this.joystick.width / 2) * 5
        let _nextY = this.rifleScopeContainer.y + _difY / (this.joystick.height / 2) * 5
        if (_nextX < 0) {
          _nextX = 0
        }
        if (_nextX > 750) {
          _nextX = 750
        }

        if (_nextY < 200) {
          _nextY = 200
        }
        if (_nextY > 768) {
          _nextY = 768
        }

        this.rifleScopeContainer.x = _nextX
        this.rifleScopeContainer.y = _nextY

        if (this.maskScope) {
          this.maskScope.x = this.rifleScopeContainer.x
          this.maskScope.y = this.rifleScopeContainer.y
        }
      }
    },
    getTargetSprite (frame) {
      let _spriteImage = frame.asset("Kill Target-33.png")
      return new zim.Sprite({
          image: _spriteImage,
          cols:8,
          rows:3,
          animations:{
            redStand:0, greenStand:8, yellowStand:16,
            redKill: [1, 7, '', 0.2],
            greenKill: [9, 15, '', 0.2],
            yellowKill: [17, 23, '', 0.2]
          }
      })
    },
    initGame () {
      this.waitForNext = 2000
      this.frame.loadAssets(this.assets, this.path)
      frame.on("complete", () => {
         let _darkBg = this.frame.asset("bg-dark.png")
        _darkBg.width = this.width
        _darkBg.height = this.height
        this.contentLayer.addChild(_darkBg)

        let _targetContainer = new zim.Container(0, 0, this.width, this.height)

        this.contentLayer.addChild(_targetContainer)

        let _bg = this.frame.asset("bg.png")
        _targetContainer.addChild(_bg)
        _bg.width = this.width
        _bg.height = this.height

        for (let i = 0; i < this.targetColors.length; i++) {
          this.targets[i] = this.getTargetSprite(this.frame)
          this.targets[i].gotoAndPlay(this.targetColors[i] + 'Stand')
          this.targets[i].regX = this.targets[i].width / 2
          this.targets[i].regY = this.targets[i].height / 2
          this.targets[i].index = i
        }

        let _targetLayer = new zim.Container(0, 0, this.width, this.height)
        _targetContainer.addChild(_targetLayer)

        let _building = this.frame.asset('bg-buildings.png')
        _targetContainer.addChild(_building)
        _building.width = this.width
        _building.height = this.height

        let _positions = zim.shuffle(this.targetPositions)

        for (let i = 0; i < this.targets.length; i++) {
          _targetLayer.addChild(this.targets[i])
          this.targets[i].width = 50
          this.targets[i].x = _positions[i].x + this.targets[i].width / 2
          this.targets[i].y = _positions[i].y + this.targets[i].height / 2
          this.targets[i].alpha = 0

          this.targets[i].addEventListener('animationend', event => {
            if (event.target.currentAnimation.indexOf('Kill') !== -1) {
              event.target.alpha = 0
            }
          })
        }

        let _joystickContainer = new zim.Container()
        let _joystickBg = new zim.Sprite({json: this.frame.asset("rifle.json")}) //this.frame.asset("joystick-bg.png")
        _joystickBg.gotoAndPlay('joystick-bg')
        _joystickBg.center(_joystickContainer)

        _joystickContainer.regX = _joystickBg.width / 2
        _joystickContainer.regY = _joystickBg.height / 2

        _joystickContainer.scale = 0.6
        _joystickContainer.x = 90
        _joystickContainer.y = 650
        this.panelLayer.addChild(_joystickContainer)

        this.joystick = new zim.Sprite({json: this.frame.asset("rifle.json")}) // this.frame.asset("joystick.png")
        this.joystick.gotoAndPlay('joystick')

        let _boundary = new zim.Boundary(0, 0 , _joystickContainer.width / 2, _joystickContainer.height / 2).contract(this.joystick.width / 2)
        this.joystick.center(_joystickContainer)
        this.joystick.drag({boundary: _boundary, localBounds: true})

        this.joystickPosition = {x: this.joystick.x, y: this.joystick.y}

        this.joystick.on("mousedown", (e) => {
          this.dragging = true
        })

        this.joystick.on("pressup", (e) => {
          this.dragging = false
          this.joystick.animate({x: this.joystickPosition.x, y: this.joystickPosition.y}, 50)
        })

        this.rifleScopeContainer = new zim.Container()
        this.rifleScope = new zim.Sprite({json: this.frame.asset("rifle.json")}) // this.frame.asset("rifle-scope.png")
        this.rifleScope.gotoAndPlay('rifle-scope-original')
        /*
        this.rifleScope = new zim.Sprite({
          image: _rifleScopeImage,
          cols:3,
          rows:1,
          animations:{
            trace:0, correct:1, wrong:2
          }
        })
        */
        // this.rifleScope.gotoAndPlay('trace')
        
        this.rifleScope.center(this.rifleScopeContainer)
        this.rifleScopeContainer.scale = 0.4
        this.contentLayer.addChild(this.rifleScopeContainer)

        this.rifleScopeContainer.regX = this.rifleScope.width / 2
        this.rifleScopeContainer.regY = this.rifleScope.height / 2

        this.rifleScopeContainer.x = this.rifleScopeInitPosition.x
        this.rifleScopeContainer.y = this.rifleScopeInitPosition.y

        // Ticker.add(this.updateRifleScope, this.contentLayer)
        // Ticker.remove(this.updateRifleScope, this.stage)
        zim.Ticker.add((event) => {
          this.updateRifleScope()
        }, this.stage)

        this.maskScope = new zim.Circle(this.rifleScopeContainer.width * 0.45, "rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0)", 0)
        this.contentLayer.addChild(this.maskScope)

        this.resetRifleScopePosition()

        _targetContainer.setMask(this.maskScope, true)

        let _fireButton = new zim.Sprite({json: this.frame.asset("rifle.json")}) // this.frame.asset("button-fire.png")
        _fireButton.gotoAndPlay('button-fire')
        _fireButton.on('click', () => {
          if (this.gameStarted && this.fireEnabled) {
            for (let i = 0; i < this.targets.length; i++) {
              if (Math.abs(this.targets[i].x - this.rifleScopeContainer.x) < this.targets[i].width / 2 &&
                Math.abs(this.targets[i].y - this.rifleScopeContainer.y) < this.targets[i].height / 2) {
                this.fireEnabled = false
                this.targets[i].gotoAndPlay(this.targetColors[i] + 'Kill')
                this.checkAnswer(i)
              }
            }
          }
        })
        _fireButton.scale = 0.8
        _fireButton.x = 170
        _fireButton.y = 660
        this.panelLayer.addChild(_fireButton)

        let _iconY = 280
        for (let i = 0; i < this.targetColors.length; i++) {
          let _icon = new zim.Sprite({json: this.frame.asset("rifle.json")}) // this.frame.asset('icon-' + this.targetColors[i] + '.png')
          _icon.gotoAndPlay('icon-' + this.targetColors[i])
          let _y = _iconY + i * _icon.height * 1.3
          _icon.scale = 0.8
          _icon.y = _y
          _icon.x = 5

          let _left = 5 + _icon.width + 5
          let _optionContaierWidth = this.panelLayer.width - _left
          this.optionContainers[i] = new zim.Container(_left, _y - _icon.height * 0.15, _optionContaierWidth, _icon.height * 1.3)
          
          this.panelLayer.addChild(_icon, this.optionContainers[i])
        }
        
        this.stage.update()
      })
    },
    setTargetPosition () {
      let _positions = zim.shuffle(this.targetPositions)
          
      for (let i = 0; i < this.targets.length; i++) {
        this.targets[i].gotoAndPlay(this.targetColors[i] + 'Stand')
        this.targets[i].x = _positions[i].x + this.targets[i].width / 2
        this.targets[i].y = _positions[i].y + this.targets[i].height / 2
        this.targets[i].alpha = 1
      }
    },
    showNextQuestion () {
      this.setTargetPosition()
      this.resetRifleScopePosition()
      this.fireEnabled = true
      this.setQuestion()
      this.setOptionContent()
      this.updateCurrentQuestionIndex()
    },
    checkAnswer (index) {
      if (this.optionContainers[index].correct) {
        this.rifleScope.gotoAndPlay('rifle-scope-correct')
        this.addScore()
      } else {
        this.rifleScope.gotoAndPlay('rifle-scope-wrong')
        this.deduceLife()
      }

      if (this.noOfLifeRemained) {
        setTimeout(() => {
          this.showNextQuestion()
        }, this.waitForNext)
      }
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
