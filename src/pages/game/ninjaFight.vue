<template>
  <div style="width: 100%; text-align: center;">
    <div :id="holder + 'Container'"><div :id="holder"></div></div>
  </div>
</template>

<script>
import GameShellMixin from '../../library/mixins/zimGameShell'
export default {
  name: 'ninja-fight',
  mixins: [GameShellMixin],
  data () {
    return {
      assets: ["background.png", "button-bow.png", "button-shuricane.png", "button-sword.png", "enemy.png", "hero.png", "hero.json"],
      path: "statics/game/zimninjafight/",
      hero: null,
      enemy: null,
      enemyColors: ['green', 'blue', 'purple', 'red'],
      heroDie: false,
      enemyDie: false,
      currentEnemyColor: '',
      selectedOptionIndex: ''
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
          this.checkAnswer()
        }
      })
      this.contentLayer.addChild(this.hero)
    },
    createEnemy (params) {
      if (this.enemy === null) {
        this.enemy = this.getEnemySprite()
        this.currentEnemyColor = zim.shuffle(this.enemyColors)[0]
        this.enemy.regY = this.enemy.height / 2
        this.enemy.scale = 0.5
      }
      this.enemy.gotoAndPlay(this.currentEnemyColor + 'Walk')
      if (params) {
        if (params.x) {
          this.enemy.x = params.x
        }
        if (params.y) {
          this.enemy.y = params.y
        }
      }
      this.contentLayer.addChild(this.enemy)
    },
    getEnemySprite () {
      return new zim.Sprite({
        image: this.frame.asset("enemy.png"),
        cols:13,
        rows:4,
        animations:{
          blueWalk: [0, 3, 'blueWalk', 0.05],
          blueStop: { frames: [0]},
          blueSword: [4, 6, '', 0.2],
          blueBow: [7, 9, '', 0.05],
          blueShuricane: [10, 12, '', 0.2],
          greenWalk: [13, 16, 'greenWalk', 0.05],
          greenStop: { frames: [13]},
          greenSword: [17, 19, '', 0.2],
          greenBow: [20, 22, '', 0.2],
          greenShuricane: [23, 25, '', 0.2],
          purpleWalk: [26, 29, 'purpleWalk', 0.05],
          purpleStop: { frames: [26]},
          purpleSword: [30, 32, '', 0.2],
          purpleBow: [33, 35, '', 0.2],
          purpleShuricane: [36, 38, '', 0.2],
          redWalk: [39, 42, 'redWalk', 0.05],
          redStop: { frames: [39]},
          redSword: [43, 45, '', 0.2],
          redBow: [46, 48, '', 0.2],
          redShuricane: [49, 51, '', 0.2],
        }
      })
    },
    initGame () {
      this.frame.loadAssets(this.assets, this.path)
      frame.on("complete", () => {
        let _background = this.frame.asset('background.png')
        _background.width = this.width
        _background.height = this.height
        this.backgroundLayer.addChild(_background)

        this.createHero({ x: 100, y: 550 })

        zim.Ticker.add((event) => {
          this.moveEnemy()
        }, this.stage)

        this.createStandardOptions({
          optionBgs: [
            this.frame.asset('button-bow.png'),
            this.frame.asset('button-shuricane.png'),
            this.frame.asset('button-sword.png')
          ]
        })

        this.stage.update()
      })
    },
    heroKilled () {
      this.heroDie = true
      this.enemy.gotoAndPlay(this.currentEnemyColor + 'Stop')
      this.handleWrong()
    },
    moveEnemy () {
      if (this.gameStarted && !this.heroDie && !this.enemyDie) {

        if (this.enemy.x <= this.hero.x - 10) {
          this.heroKilled()
          if (this.noOfLifeRemained > 0) {
            setTimeout(() => {
              this.showNextQuestion()
            }, this.waitForNext)
          }
        } else {
          this.enemy.x -= 1
        }
        this.stage.update()
      }
    },
    showNextQuestion () {
      if (this.noOfLifeRemained > 0) {
        this.heroDie = false
        this.enemyDie = false
        this.hero.gotoAndPlay('heroStand')
        this.createEnemy({ x: 550, y: 550 })
        this.setQuestion()
        this.setOptionContent({ shiftX: 0.2, color: 'white' })
      }
    },
    checkAnswer () {
      if (!this.heroDie) {
        if (this.currentOptions[this.selectedOptionIndex].correct) {
          if (this.selectedOptionIndex === 0) {
            this.enemy.gotoAndPlay(this.currentEnemyColor + 'Bow')
          } else if (this.selectedOptionIndex === 1) {
            this.enemy.gotoAndPlay(this.currentEnemyColor + 'Shuricane')
          } else if (this.selectedOptionIndex === 2) {
            this.enemy.gotoAndPlay(this.currentEnemyColor + 'Sword')
          }
          this.hero.gotoAndPlay('heroWin')
          this.enemyDie = true
          this.handleCorrect()
          if (this.noOfLifeRemained > 0) {
            setTimeout(() => {
              this.showNextQuestion()
            }, this.waitForNext)
          }
        } else {
          this.enemy.animate({ x: this.hero.x - 10 }, 100)
        }
      }
    },
    optionClicked (index) {
      this.selectedOptionIndex = index
      if (index === 0) {
        this.hero.gotoAndPlay('heroBow')
      } else if (index === 1) {
        this.hero.gotoAndPlay('heroShuricane')
      } else if (index === 2) {
        this.hero.gotoAndPlay('heroSword')
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