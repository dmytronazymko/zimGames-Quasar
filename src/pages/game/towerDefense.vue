<template>
  <div style="width: 100%; text-align: center;">
    <div :id="holder + 'Container'"><div :id="holder"></div></div>
  </div>
</template>

<script>
import GameShellMixin from '../../library/mixins/zimGameShell'
export default {
  name: 'tower-defense',
  mixins: [GameShellMixin],
  data () {
    return {
      assets: ["background.png", "towerDefense.png", "towerDefense.json", "enemy.png", "hero.png"],
      path: "statics/game/towerdefense/",
      enemyContainers: [],
      fired: false,
      towerHp: 0,
      defaultTowerHp: 3,
      nextAttackDuration: 10000,
      enemyDuration: 15000,
      nextSpawnDuration: 10000,
      nextSpawnTimeout: null,
      enemyPaths: []
    }
  },
  computed: {
    targetEnemy () {
      if (this.enemyContainers && this.enemyContainers[0]) {
        return this.enemyContainers[0]
      } else {
        return null
      }
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

        this.createHeroAndTower()

        let _button1 = new zim.Sprite({json: this.frame.asset("towerDefense.json")})
        _button1.gotoAndPlay('button1')
        let _button2 = new zim.Sprite({json: this.frame.asset("towerDefense.json")})
        _button2.gotoAndPlay('button2')
        let _button3 = new zim.Sprite({json: this.frame.asset("towerDefense.json")})
        _button3.gotoAndPlay('button3')

        this.createStandardOptions({
          optionBgs: [
            _button1,
            _button2,
            _button3
          ]
        })

        this.createEnemyPath()

        this.stage.update()
      })
    },
    createEnemyPath () {
      let _path1 = new zim.Squiggle({
        points: [[-357.7,369.2,0,0,-30,0,30,0],[263.8,365.8,0,0,-30,0,30,0],[341.6,287.5,0,0,-1.8,71.8,1.8,-71.8],[185.6,219.2,0,0,32,7,-32,-7],[95.8,174.4,0,0,25.4,2.8,-25.4,-2.8],[-142.5,170.5,0,0,-30,0,30,0]],
        onTop:false,
        interactive: false,
        showControls: false
      })

      _path1.x = 360
      _path1.y = 350
      _path1.visible = false

      this.enemyPaths[0] = _path1

      this.contentLayer.addChild(_path1)

      let _path2 = new zim.Squiggle({
        points: [[-259.1,-208.2,0,0,0.8,-37,-0.8,37],[-241.2,-69.6,0,0,-20.8,-21.6,20.8,21.6],[-193.2,-42.5,0,0,0,0,0,0],[59,-38.6,0,0,-30,0,30,0],[117.1,19.9,0,0,-0.7,-27.8,0.7,27.8],[118.4,168.8,0,0,0,-10.8,0,10.8],[-162.7,171.2,0,0,-30,0,30,0]],
        onTop:false,
        interactive: false,
        showControls: false
      })

      _path2.x = 360
      _path2.y = 350
      _path2.visible = false

      this.enemyPaths[1] = _path2

      this.contentLayer.addChild(_path2)
    },
    createHeroAndTower () {
      this.towerContainer = new zim.Container()
      this.heroContainer = new zim.Container()
      this.hero = new zim.Sprite({
        image: this.frame.asset("hero.png"),
        cols: 7,
        rows: 2,
        animations: {
          stand_right: 0,
          fire_right: 1,
          stand_right_down: 2,
          fire_right_down: 3,
          stand_right_top: 4,
          fire_right_top: 5,
          stand_left_top: 6,
          fire_left_top: 7,
          stand_left_down: 8,
          fire_left_down: 9,
          stand_down: 10,
          fire_down: 11,
          stand_top: 12,
          fire_top: 13
        }
      })
      this.hero.direction = 'right'
      this.hero.scale = 0.8
      this.hero.x = 60
      this.hero.y = -80
      this.hero.regX = this.hero.width / 2
      this.hero.gotoAndPlay('stand_right')
      this.towerContainer.addChild(this.hero)
      this.contentLayer.addChild(this.towerContainer)
      this.createTower()
    },
    createTower () {
      this.tower = new zim.Sprite({json: this.frame.asset("towerDefense.json")})
      this.tower.gotoAndPlay('tower1')

      this.towerContainer.x = 180
      this.towerContainer.y = 400
      this.towerContainer.tower = this.tower
      this.tower.scale = 0.6

      this.towerLifeBg = new zim.Sprite({json: this.frame.asset("towerDefense.json")})
      this.towerLifeBg.gotoAndPlay('tower-life-empty')
      this.towerLifeBg.x = 35
      this.towerLifeBg.y = 30
      this.towerLifeBg.alpha = 0.7

      this.towerLife = new zim.Sprite({json: this.frame.asset("towerDefense.json")})
      this.towerLife.gotoAndPlay('tower-life-full')
      this.towerLife.x = 35
      this.towerLife.y = 30
      this.towerLife.alpha = 0.7

      this.towerContainer.addChild(this.tower, this.towerLifeBg, this.towerLife)
    },
    createEnemy (params) {
      if (this.noOfLifeRemained === 0 || this.towerHp === 0) {
        return
      }
      let _enemyContainer = new zim.Container()
      let _enemy = new zim.Sprite({
        image: this.frame.asset("enemy.png"),
        cols: 6,
        rows: 2,
        animations: {
          enemy_stop_down: {
            frames: 0
          },
          enemy_down: {
            frames: [0, 1, 2],
            next: 'enemy_down',
            speed: 0.1
          },
          enemy_right: {
            frames: [3, 4, 5],
            next: 'enemy_right',
            speed: 0.1
          },
          enemy_up: {
            frames: [6, 7, 8],
            next: 'enemy_up',
            speed: 0.1
          },
          enemy_attack: {
            frames: [9, 10],
            next: 'enemy_up',
            speed: 0.1
          },
          enemy_wait_attack: {
            frames: 9
          }
        }
      })
      _enemy.gotoAndPlay('enemy_' + params.direction)

      let _enemyLifeBg = new zim.Sprite({json: this.frame.asset("towerDefense.json")})
      _enemyLifeBg.gotoAndPlay('enemy-life-empty')
      _enemyLifeBg.x = 0
      _enemyLifeBg.y = -20

      let _enemyLife = new zim.Sprite({json: this.frame.asset("towerDefense.json")})
      _enemyLife.gotoAndPlay('enemy-life-full')
      _enemyLife.x = 0
      _enemyLife.y = -20

      _enemyContainer.lifeBg = _enemyLifeBg
      _enemyContainer.life = _enemyLife
      
      _enemyContainer.regX = _enemy.width / 2
      _enemyContainer.regY = _enemy.height
      _enemyContainer.scale = 0.8
      _enemyContainer.enemy = _enemy
      _enemyContainer.addChild(_enemy, _enemyLifeBg, _enemyLife)
      this.contentLayer.addChild(_enemyContainer)

      this.enemyContainers.push(_enemyContainer)

      _enemy.addEventListener('animationend', event => {
        if (event.target.currentAnimation === 'enemy_attack') {
          event.target.gotoAndPlay('enemy_wait_attack')
          let _nextAttackTimeout = setTimeout(() => {
            this.attackTower(event.target.parent)
          }, this.nextAttackDuration)
          event.target.parent.nextAttackTimeout = _nextAttackTimeout
        }
      })

      let _path = this.enemyPaths[Math.random() > 0.5 ? 0 : 1]
      
      _enemyContainer.animate({ props: { path: _path, orient: false, flip:true }, time: this.enemyDuration, ease: 'linear', override:false, events: true, call: () => { this.attackTower(_enemyContainer) } })

      _enemyContainer.on('animation', event => {
        if (event.target === this.targetEnemy) {
          let _heroPosition = this.towerContainer.localToGlobal(this.hero.x, this.hero.y)
          
          let _enemyPosition = event.target
          
          let dy = _enemyPosition.y - _heroPosition.y
          let dx = _enemyPosition.x - _heroPosition.x

          let theta = Math.atan2(Math.abs(dy), Math.abs(dx))
          theta *= 180/ Math.PI

          if (dy < 0 && dx < 0) {
            // zone 4
            if (theta >= 0 && theta < 22.5) {
              this.hero.direction = 'left_top'
            } else if (theta >= 22.5 && theta < 67.5) {
              this.hero.direction = 'left_top'
            } else if (theta >= 67.5 && theta <= 90) {
              this.hero.direction = 'top'
            }
          } else if (dy < 0 && dx >= 0) {
            // zone 1
            if (theta >= 0 && theta < 22.5) {
              this.hero.direction = 'right'
            } else if (theta >= 22.5 && theta < 67.5) {
              this.hero.direction = 'right_top'
            } else if (theta >= 67.5 && theta <= 90) {
              this.hero.direction = 'top'
            }
          } else if (dy >= 0 && dx >= 0) {
            // zone 2
            if (theta >= 0 && theta < 22.5) {
              this.hero.direction = 'right'
            } else if (theta >= 22.5 && theta < 67.5) {
              this.hero.direction = 'right_down'
            } else if (theta >= 67.5 && theta <= 90) {
              this.hero.direction = 'down'
            }
          } else if (dy >= 0 && dx <= 0) {
            // zone 3
            if (theta >= 0 && theta < 22.5) {
              this.hero.direction = 'down'
            } else if (theta >= 22.5 && theta < 67.5) {
              this.hero.direction = 'left_down'
            } else if (theta >= 67.5 && theta <= 90) {
              this.hero.direction = 'left_down'
            }
          }

          if (this.fired) {
            this.hero.gotoAndPlay('fire_' + this.hero.direction)
          } else {
            this.hero.gotoAndPlay('stand_' + this.hero.direction)
          }
        }
      })

      if (this.nextSpawnTimeout !== null) {
        clearTimeout(this.nextSpawnTimeout)
      }
      this.nextSpawnTimeout = setTimeout(() => {
        this.createEnemy({ direction: 'down' })
      }, this.nextSpawnDuration)
    },
    attackTower (enemyContainer) {
      enemyContainer.enemy.gotoAndPlay('enemy_attack')
      if (this.towerHp > 0) {
        this.towerHp--
        if (this.towerHp === 0) {
          this.towerContainer.tower.gotoAndPlay('tower3')
          this.optionEnabled = false
          setTimeout(() => {
            this.gameOver()
          }, this.waitForNext)
        } else {
          this.towerContainer.tower.gotoAndPlay('tower2')
        }
        let _scaleX = this.towerHp / this.defaultTowerHp
        this.towerLife.animate({ props: { scaleX: _scaleX }, time: 100 })
      }
    },
    optionClicked (index) {
      this.fired = true
      console.log('direction: ' + this.hero.direction)
      this.hero.gotoAndPlay('fire_' + this.hero.direction)

      if (this.optionContainers[index].correct) {
        if (this.targetEnemy) {
          let _currentTargetEnemy = this.targetEnemy
          this.targetEnemy.stopAnimate()
          this.targetEnemy.enemy.gotoAndPlay('enemy_stop_down')
          this.targetEnemy.life.animate({ props: { scaleY: 1, scaleX: 0}, time: 100, ease: 'linear' })
          this.targetEnemy.animate({ props: { alpha: 0 }, time: 1000, ease: 'linear', call: () => { _currentTargetEnemy.parent.removeChild(_currentTargetEnemy) } })

          if (typeof this.targetEnemy.nextAttackTimeout !== 'undefined') {
            clearTimeout(this.targetEnemy.nextAttackTimeout)
          }

          this.enemyContainers.shift()
        }
        this.handleCorrect()
        setTimeout(() => {
          this.showNextQuestion()
        }, this.waitForNext)
      } else {
        this.handleWrong(false)
        this.$nextTick(() => {
          this.optionEnabled = true
          this.fired = false
        }) 
      }
    },
    showNextQuestion () {
      if (this.noOfLifeRemained > 0) {
        if (this.enemyContainers.length === 0) {
          this.createEnemy({ direction: 'down' })
        }
        this.fired = false
        this.setQuestion()
        this.setOptionContent({ shiftX: 0.3, color: 'white' })
      }
    },
    startGame () {
      for (let i = 0; i < this.enemyContainers.length; i++) {
        if (typeof this.enemyContainers[i].nextAttackTimeout !== 'undefined') {
          clearTimeout(this.enemyContainers[i].nextAttackTimeout)
        }
        this.enemyContainers[i].parent.removeChild(this.enemyContainers[i])
      }
      this.enemyContainers = []
      this.tower.gotoAndPlay('tower1')
      this.towerHp = this.defaultTowerHp
      this.towerLife.scaleX = 1
      this.createEnemy({ direction: 'down' })
      this.showNextQuestion()
    }
  },
  mounted () {
    this.initGameShell()
  },
  beforeDestroy () {
    if (this.nextSpawnTimeout !== null) {
      clearTimeout(this.nextSpawnTimeout)
    }
    this.cleanUp()
  }
}
</script>