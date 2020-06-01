<template>
  <div style="width: 100%; text-align: center;">
    <div :id="holder + 'Container'"><div :id="holder"></div></div>
  </div>
</template>

<script>
import GameShellMixin from '../../library/mixins/zimGameShell'
export default {
  name: 'ninja-fight2',
  mixins: [GameShellMixin],
  data () {
    return {
      assets: ["background2.png", "enemy.png", "hero.png", "hero.json", "q-balloon.png"],
      path: "statics/game/zimninjafight/",
      hero: null,
      enemies: [],
      enemyContainers: [],
      enemyColors: ['green', 'blue', 'purple', 'red'],
      heroDie: false,
      currentEnemyColor: '',
      selectedOptionIndex: '',
      weapsons: ['Bow', 'Shuricane', 'Sword'],
      answered: [],
      currentTarget: '',
      currentWeapon: '',
      heroDie: false
    }
  },
  methods: {
    createHero (params) {
      this.hero = new zim.Sprite({json: this.frame.asset("hero.json")})
      this.hero.gotoAndPlay('heroStand')
      // 
      this.hero.regX = this.hero.width
      this.hero.regY = this.hero.height / 2
      this.hero.scale = 0.5
      if (params) {
        if (params.x) {
          this.hero.x = params.x
        }
        if (params.y) {
          this.hero.y = params.y
        }
      }
      this.hero.addEventListener('animationend', event => {
        if (event.target.currentAnimation === 'heroBow' ||
          event.target.currentAnimation === 'heroShuricane' ||
          event.target.currentAnimation === 'heroSword') {
          this.killEnemy()
        }
      })
      this.contentLayer.addChild(this.hero)
    },
    createBubble () {
      let _bubble = new zim.Sprite({
        image: this.frame.asset("q-balloon.png"),
        cols:1,
        rows:1,
        animations:{
          bubble: [0]
        }
      })
      _bubble.gotoAndPlay('bubble')

      return _bubble
    },
    createEnemies () {
      let _enemyColors = zim.shuffle(this.enemyColors)
      let _balloons = []
      this.balloonContainers = []

      for (let i = 0; i < 3; i++) {
        this.enemyContainers[i] = new zim.Container()

        this.balloonContainers[i] = new zim.Container()
        this.balloonContainers[i].y = -160
        this.balloonContainers[i].x = 20

        _balloons[i] = this.createBubble()
        _balloons[i].alpha = 0.6
        this.balloonContainers[i].addChild(_balloons[i])
        
        this.enemies[i] = this.getEnemySprite()
        this.enemies[i].regY = this.enemies[i].height / 2
        this.enemies[i].scale = 0.5

        this.enemies[i].gotoAndPlay(_enemyColors[i] + 'Walk')

        this.enemyContainers[i].x = 1000
        this.enemyContainers[i].y = 450 + i * 100
        this.enemyContainers[i].color = _enemyColors[i]

        let _questionContainer = new zim.Container(0, 0, _balloons[i].width, _balloons[i].height * 0.8)
        this.questionContainers[i] = _questionContainer
        this.questionContainers[i].displayWidth = _balloons[i].width
        this.balloonContainers[i].addChild(_questionContainer)

        this.enemyContainers[i].addChild(this.enemies[i], this.balloonContainers[i])
        // _questionContainer.outline()

        this.contentLayer.addChild(this.enemyContainers[i])
      }
    },
    initEnemies () {
      for (let i = 0; i < 3; i++) {
        this.enemies[i].gotoAndPlay(this.enemyContainers[i].color + 'Walk')
        this.enemyContainers[i].x = 650 + Math.floor(Math.random() * 400)
        this.enemyContainers[i].y = 450 + i * 100
        this.balloonContainers[i].alpha = 1

        let _time = Math.floor(Math.random() * 10000) + 10000
        this.enemyContainers[i].animate({ id: i, props: { x: 80, y: 550 }, time: _time, ease: 'linear', call: () => { this.killHero() } })
      }
    },
    killHero () {
      if (!this.heroDie) {
        this.heroDie = true
        this.hero.gotoAndPlay('heroLose')
        this.handleWrong()
        this.stopEnemies()

        if (this.noOfLifeRemained > 0) {
          setTimeout(() => {
            this.showNextQuestion()
          }, this.waitForNext)
        }
      }
    },
    getEnemySprite () {
      return new zim.Sprite({
        image: this.frame.asset("enemy.png"),
        cols:13,
        rows:4,
        animations:{
          blueWalk: [0, 3, 'blueWalk', 0.05],
          blueStop: { frames: [0]},
          blueSword: [4, 6, '', 0.1],
          blueBow: [7, 9, '', 0.05],
          blueShuricane: [10, 12, '', 0.1],
          greenWalk: [13, 16, 'greenWalk', 0.05],
          greenStop: { frames: [13]},
          greenSword: [17, 19, '', 0.1],
          greenBow: [20, 22, '', 0.1],
          greenShuricane: [23, 25, '', 0.1],
          purpleWalk: [26, 29, 'purpleWalk', 0.05],
          purpleStop: { frames: [26]},
          purpleSword: [30, 32, '', 0.1],
          purpleBow: [33, 35, '', 0.1],
          purpleShuricane: [36, 38, '', 0.1],
          redWalk: [39, 42, 'redWalk', 0.05],
          redStop: { frames: [39]},
          redSword: [43, 45, '', 0.1],
          redBow: [46, 48, '', 0.1],
          redShuricane: [49, 51, '', 0.1],
        }
      })
    },
    initGame () {
      this.frame.loadAssets(this.assets, this.path)
      frame.on("complete", () => {
        let _background = this.frame.asset('background2.png')
        _background.width = this.width
        _background.height = this.height
        this.backgroundLayer.addChild(_background)

        this.createHero({ x: 100, y: 550 })
        this.createEnemies()

        zim.Ticker.add((event) => {
          this.moveEnemy()
        }, this.stage)

        this.setNumberPad()

        this.stage.update()
      })
    },
    moveEnemy () {
      if (this.gameStarted && !this.heroDie && !this.enemyDie) {
        this.stage.update()
      }
    },
    checkAnswerBox () {
      let _value = this.answerBoxContainer.value
      let _correct = false
      this.currentTarget = -1
      if (_value !== '') {
        for (let i = 0; i < this.currentQuestion.length; i++) {
          if (typeof this.answered[i] === 'undefined') {
            if (_value + '' === this.currentQuestion[i].answer + '') {
              _correct = true
              this.currentTarget = i
              this.answered[i] = true
            }
          }
        }
      }
      
      if (_correct) {
        this.fireWeapon()
      } else {
        this.hero.gotoAndPlay('heroLose')
        this.deduceLife()
        if (this.noOfLifeRemained === 0) {
          this.stopEnemies()
        }
      }
      this.resetNumPadValue()
    },
    stopEnemies () {
      for (let i = 0; i < 3; i++) {
        if (typeof this.answered[i] === 'undefined') {
          this.enemyContainers[i].stopAnimate()
          this.enemies[i].gotoAndPlay(this.enemyContainers[i].color + 'Stop')
        }
      }
    },
    allAnswered () {
      let _allAnswered = true
      for (let i = 0; i < this.currentQuestion.length; i++) {
        if (typeof this.answered[i] === 'undefined') {
          _allAnswered = false
        }
      }
      return _allAnswered
    },
    killEnemy () {
      this.enemyContainers[this.currentTarget].stopAnimate()
      this.enemies[this.currentTarget].gotoAndPlay(this.enemyContainers[this.currentTarget].color + this.currentWeapon)
      this.balloonContainers[this.currentTarget].animate({ alpha: 0 }, 100)

      if (this.allAnswered()) {
        this.hero.gotoAndPlay('heroWin')
        this.handleCorrect()
        setTimeout(() => {
          this.showNextQuestion()
        }, this.waitForNext)
      } else {
        this.addScore()
        this.hero.gotoAndPlay('heroStand')
      }
    },
    fireWeapon () {
      this.currentWeapon = zim.shuffle(this.weapsons)[0]
      this.hero.gotoAndPlay('hero' + this.currentWeapon)
    },
    initObjects () {
      this.currentTarget = ''
      this.currentWeapon = ''
      this.heroDie = false
      this.hero.gotoAndPlay('heroStand')
    },
    showNextQuestion () {
      this.answered = []
      this.initObjects()
      this.initEnemies()
      this.setQuestions()
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