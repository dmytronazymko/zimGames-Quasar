<template>
  <div style="width: 100%; text-align: center;">
    <div :id="holder + 'Container'"><div :id="holder"></div></div>
  </div>
</template>

<script>
import GameShellMixin from '../../library/mixins/zimGameShell'
export default {
  name: 'zombie',
  mixins: [GameShellMixin],
  data () {
    return {
      assets: ["zombieItem.png", "zombieItem.json", "runner.png", "zombie.png"],
      path: "statics/game/zombie/",
      runnerDirection: '',
      ladders: [],
      doors: [],
      currentLadderIndex: -1,
      currentZombieLadderIndex: -1,
      climbing: false,
      zombieClimbing: false,
      prepareToGoDown: false,
      grounds: [],
      currentGroundIndex: -1,
      disableInput: false,
      restoreOriginalPositon: true,
      runnerOriginalPosition: { x: 250, y: 700 },
      runnerSpeed: 2,
      zombieOriginalPosition: { x: 50, y: 700 },
      zombieSpeed: 1,
      zombieDirection: '',
      answerChosen: false,
      caught: false, // whether runner being caught
      nextMove: '' // store the next move during animation
    }
  },
  computed: {
    currentGround () {
      if (this.currentGroundIndex !== '') {
        return this.grounds[this.currentGroundIndex]
      }
    }
  },
  methods: {
    initGame () {
      this.waitForNext = 2000
      this.frame.loadAssets(this.assets, this.path)
      frame.on("complete", () => {

        this.createGround({ x: 0, y: 700})
        this.createGround({ x: 0, y: 550})
        this.createGround({ x: 0, y: 400})
        this.createGround({ x: 0, y: 250})

        this.createLadder({ x: 150, y: 550 })
        this.createLadder({ x: 500, y: 550 })
        this.createLadder({ x: 250, y: 400 })
        this.createLadder({ x: 650, y: 400 })
        this.createLadder({ x: 400, y: 250 })

        this.createDoor({ x: 350, y: 700 })
        this.createDoor({ x: 400, y: 550 })
        this.createDoor({ x: 150, y: 400 })
        this.createDoor({ x: 550, y: 400 })
        this.createDoor({ x: 250, y: 250 })

        this.createRunner({ x: this.runnerOriginalPosition.x, y: this.runnerOriginalPosition.y })
        this.createZombie({ x: this.zombieOriginalPosition.x, y: this.zombieOriginalPosition.y })
        // this.stage.update()

        this.setCurrentGround()

        zim.Ticker.add((event) => {
          this.ticker()
        }, this.stage)
      })
    },
    ticker (event) {
      if (this.gameStarted) {
        if (!this.caught) {
          this.runnerMovement()
          this.zombieMovement()
          this.beingCaught()
        }

        if (this.showTimer && this.updateTimer) {
          this.updateTimer()
        }

        this.stage.update(event)
      }
    },
    openDoor () {
      for (let i = 0; i < this.doors.length; i++) {
        if (Math.abs(this.runnerContainer.y - this.doors[i].y) < 5) {
          if (Math.abs(this.runnerContainer.x - this.doors[i].x) < this.runner.getBounds().width / 2) {
            if (this.doors[i].correct !== null) {
              this.disableInput = true
              this.runnerContainer.x = this.doors[i].x
              this.runner.gotoAndPlay('enter')
              this.doors[i].door.gotoAndPlay('opening')
              this.runner.enteringDoor = true
              this.answerChosen = true

              if (this.doors[i].correct) {
                this.handleCorrect(this.doors[i].value)
              } else {
                this.handleWrong()
              }
              if (this.noOfLifeRemained > 0) {
                setTimeout(() => {
                  this.showNextQuestion()
                }, this.waitForNext)
              }
            }
          }
        }
      }
    },
    setCurrentGround () {
      this.currentGroundIndex = -1
      for (let i = 0; i < this.grounds.length; i++) {
        if (Math.abs(this.runnerContainer.y - this.grounds[i].y) < 5) {
          if (this.runnerContainer.x >= this.grounds[i].x && this.runnerContainer.x <= this.grounds[i].rightX) {
            this.currentGroundIndex = i
          }
        }
      }
    },
    runnerMovement () {
      if (this.runnerContainer) {
        if (this.runnerDirection === 'right') {
          if (this.currentGroundIndex !== -1) {
            this.runnerContainer.x += this.runnerSpeed
            if (this.runnerContainer.x + this.runnerContainer.marginWidth > this.currentGround.rightX) {
              this.runnerContainer.x = this.currentGround.rightX - this.runnerContainer.marginWidth
            }
          }
        } else if (this.runnerDirection === 'left') {
          if (this.currentGroundIndex !== -1) {
            this.runnerContainer.x -= this.runnerSpeed
            if (this.runnerContainer.x - this.runnerContainer.marginWidth < this.currentGround.x) {
              this.runnerContainer.x = this.currentGround.x + this.runnerContainer.marginWidth
            }
          }
        } else if (this.runnerDirection === 'up') {
          this.runnerContainer.y -= this.runnerSpeed / 2

          if (this.runnerContainer.y <= (this.ladders[this.currentLadderIndex].y + 50)) {
            this.runnerContainer.y = this.ladders[this.currentLadderIndex].y
            this.runner.gotoAndPlay('upFinal')
            this.disableInput = true
            this.runnerDirection = ''
            this.climbing = false
            this.currentLadderIndex = -1

            this.setCurrentGround()
          }
        } else if (this.runnerDirection === 'down') {
          this.runnerContainer.y += this.runnerSpeed / 2

          if (this.runnerContainer.y >= this.ladders[this.currentLadderIndex].bottomY) {
            this.runnerContainer.y = this.ladders[this.currentLadderIndex].bottomY
            this.runnerDirection = ''
            this.runner.gotoAndPlay('idle')
            this.climbing = false
            this.currentLadderIndex = -1

            this.setCurrentGround()
          }
        }
      }
    },
    createDoor (params) {
      let _doorContainer = new zim.Container()
      let _door = new zim.Sprite({json: this.frame.asset("zombieItem.json")})
      _door.gotoAndPlay('door1')
      _doorContainer.x = params.x
      _doorContainer.y = params.y
      _doorContainer.door = _door
      _doorContainer.regX = _door.getBounds().width / 2
      _doorContainer.regY = _door.getBounds().height
      _doorContainer.scaleX = 1
      _doorContainer.scaleY = 0.75
      _doorContainer.addChild(_door)
      this.contentLayer.addChild(_doorContainer)

      this.doors.push(_doorContainer)

      _door.addEventListener('animationend', event => {
        this.handleDoorAnimationEnd(event)
      })
    },
    createLadder (params) {
      let _ladderContainer = new zim.Container()
      let _ladder = new zim.Sprite({json: this.frame.asset("zombieItem.json")})
      _ladder.gotoAndPlay('ladder')
      _ladderContainer.x = params.x
      _ladderContainer.regX = _ladder.width / 2
      _ladderContainer.y = params.y
      _ladderContainer.scale = 0.75
      _ladderContainer.addChild(_ladder)
      this.contentLayer.addChild(_ladderContainer)

      _ladderContainer.bottomY = _ladderContainer.y + _ladder.height * 0.75

      this.ladders.push(_ladderContainer)
    },
    createGround (params) {
      let _ground = new zim.Sprite({json: this.frame.asset("zombieItem.json")})
      _ground.gotoAndPlay('wood')
      _ground.scale = 0.74
      _ground.x = params.x
      _ground.y = params.y
      _ground.rightX = _ground.width + params.x
      this.contentLayer.addChild(_ground)
      _ground

      this.grounds.push(_ground)
    },
    createZombie (params) {
      this.zombieContainer = new zim.Container()
      this.zombie = new zim.Sprite({
        image: this.frame.asset("zombie.png"),
        cols: 6,
        rows: 3,
        animations: {
          zombie_idle: 2,
          zombie_run: [0, 7, 'zombie_run', 0.05],
          zombie_UpInitial: [8, 8, '', 0.05],
          zombie_UpStair: {
            frames: [9, 10, 9, 10],
            next: 'zombie_UpStair',
            speed: 0.05
          },
          zombie_climb: 9,
          // zombie_UpFinal: [11, 14, "zombie_run", 0.1],
          zombie_DownInitial: {
            frames: [11, 12, 13, 14],
            next: 'zombie_UpStair',
            speed: 0.05
          },
          zombie_UpFinal: {
            frames: [14, 13, 12, 11],
            next: 'zombie_run',
            speed: 0.1
          },
          zombie_DownStair: {
            frames: [10, 9, 10, 9],
            next: 'zombie_DownStair',
            speed: 0.05
          },
          zombie_DownFinal: [8, 8, 'zombie_run', 0.1]
        }
      })
      this.zombie.gotoAndPlay('zombie_run')
      
      this.zombie.regX = this.zombie.width / 2
      this.zombie.regY = this.zombie.height
      this.zombie.scale = 0.8
      this.zombieContainer.x = params.x
      this.zombieContainer.y = params.y
      this.zombieContainer.addChild(this.zombie)
      this.contentLayer.addChild(this.zombieContainer)
      this.zombie.addEventListener('animationend', event => {
        this.handleZombieAnimationEnd()
      })
    },
    createRunner (params) {
      let _runnerSpriteSheet = 
      
      this.runnerContainer = new zim.Container()
      this.runner = new zim.Sprite({
        image: this.frame.asset("runner.png"),
        cols: 6,
        rows: 5,
        animations: {
          run: { frames: [0, 1, 2, 3, 4, 5, 6, 7, 8], next: true, speed: 0.1 },
          // downInitial: [8, 8, "", 0.1],
          downInitial: [11, 14, 'up', 0.1],
          idle: [15, 15, ''],
          enter: [15, 16, '', 0.05],
          exit: [17, 17, '', 0.05],
          up: [18, 21, 'up', 0.05],
          climb: [18, 18, '', 0.05],
          upFinal: [24, 27, 'idle', 0.1]
        }
      })

      this.runner.gotoAndPlay('idle')
      this.runner.regX = this.runner.width / 2
      this.runner.regY = this.runner.height
      this.runnerContainer.x = params.x
      this.runnerContainer.y = params.y
      this.runner.scale = 0.8
      this.runnerContainer.addChild(this.runner)
      this.contentLayer.addChild(this.runnerContainer)
      this.runnerContainer.marginWidth = this.runner.width / 4

      this.runner.addEventListener('animationend', event => {
        this.handleRunnerAnimationEnd()
      })
    },
    zombieMoveLeft () {
      this.zombieContainer.x -= this.zombieSpeed
      this.zombie.scaleX = -0.8
    },
    zombieMoveRight () {
      this.zombieContainer.x += this.zombieSpeed
      this.zombie.scaleX = 0.8
    },
    zombieMovement () {
      if (this.zombieContainer) {
        if (this.prepareToGoDown) {
          // waiting for animation complete for going down
        } else if (!this.zombieClimbing) {
          if (Math.abs(this.zombieContainer.y - this.runnerContainer.y) < 5) {
            if (this.zombieContainer.x > this.runnerContainer.x) {
              // move left
              this.zombieMoveLeft()
            } else if (this.zombieContainer.x < this.runnerContainer.x) {
              // move right
              this.zombieMoveRight()
            }
          } else {
            this.findLadder()
            if (Math.abs(this.ladders[this.currentZombieLadderIndex].x - this.zombieContainer.x) < this.zombieSpeed) {
              this.zombieContainer.x = this.ladders[this.currentZombieLadderIndex].x
              if (this.zombieContainer.y === this.ladders[this.currentZombieLadderIndex].y) {
                // go down
                this.prepareToGoDown = true
                this.zombie.gotoAndPlay('zombie_DownInitial')
              }
              this.zombieClimbing = true
            } else {
              if (this.ladders[this.currentZombieLadderIndex].x > this.zombieContainer.x) {
                this.zombieMoveRight()
              } else if (this.ladders[this.currentZombieLadderIndex].x < this.zombieContainer.x) {
                this.zombieMoveLeft()
              }
            }
          }
        } else {
          if (Math.abs(this.zombieContainer.y - this.runnerContainer.y) < this.zombieSpeed / 2) {
            this.zombie.gotoAndPlay('zombie_climb')
          } else {
            if (this.zombieContainer.y < this.runnerContainer.y) {
              if (Math.abs(this.zombieContainer.y - this.ladders[this.currentZombieLadderIndex].bottomY) < this.zombieSpeed) {
                this.zombieClimbing = false
                this.zombie.gotoAndPlay('zombie_run')
              } else {
                // climb down
                this.zombieContainer.y += this.zombieSpeed / 2
                if (this.zombie.currentAnimation !== 'zombie_UpStair') {
                  this.zombie.gotoAndPlay('zombie_UpStair')
                }
              }
            } else if (this.zombieContainer.y > this.runnerContainer.y) {
              // climb up
              if (Math.abs(this.zombieContainer.y - this.ladders[this.currentZombieLadderIndex].y) < this.zombie.getBounds().height / 2) {
                this.zombieContainer.y = this.ladders[this.currentZombieLadderIndex].y
                this.zombie.gotoAndPlay('zombie_UpFinal')
                this.zombieClimbing = false
              } else {
                this.zombieContainer.y -= this.zombieSpeed / 2
                if (this.zombie.currentAnimation !== 'zombie_UpStair') {
                  this.zombie.gotoAndPlay('zombie_UpStair')
                }
              }
            }
          }
        }
      }
    },
    beingCaught () {
      if (this.answerChosen !== true) {
        if (Math.abs(this.runnerContainer.x - this.zombieContainer.x) < this.runner.getBounds().width / 2) {
          if (Math.abs(this.runnerContainer.y - this.zombieContainer.y) < this.runner.getBounds().height / 2) {
            this.caught = true
            this.runner.gotoAndPlay('idle')
            this.zombie.gotoAndPlay('zombie_idle')
            this.restoreOriginalPositon = true
            this.handleWrong()
            this.zombieClimbing = false
            if (this.noOfLifeRemained > 0) {
              setTimeout(() => {
                this.showNextQuestion()
              }, this.waitForNext)
            }
          }
        }
      }
    },
    findLadder () {
      let _leftX, _rightX
      if (this.zombieContainer.x > this.runnerContainer.x) {
        // zombie on the right
        _leftX = this.runnerContainer.x
        _rightX = this.zombieContainer.x
      } else {
        // zombie on the left
        _leftX = this.zombieContainer.x
        _rightX = this.runnerContainer.x
      }

      let _minDif = Number.MAX_SAFE_INTEGER
      let _targetLadderIndex = -1
      for (let i = 0; i < this.ladders.length; i++) {
        let _y
        if (this.zombieContainer.y > this.runnerContainer.y) {
          // zombie needs to climb up
          _y = this.ladders[i].bottomY
        } else {
          // zombie need to climb down
          _y = this.ladders[i].y
        }
        if (Math.abs(_y - this.zombieContainer.y) < 5) {
          if (this.ladders[i].x <= _rightX && this.ladders[i].x >= _leftX) {
            this.currentZombieLadderIndex = i
            return
          }
          if (Math.abs(this.ladders[i].x - this.zombieContainer.x) < _minDif) {
            _targetLadderIndex = i
            _minDif = Math.abs(this.ladders[i].x - this.zombieContainer.x)
          }
        }
      }
      // no ladder between zombie and runner
      // find the nearest ladder
      this.currentZombieLadderIndex = _targetLadderIndex
    },
    moveRightStart () {
      this.nextMove = 'right'
      if (!this.disableInput && !this.climbing) {
        if (this.runner.currentAnimation !== 'run') {
          this.runner.gotoAndPlay('run')
        }
        this.runner.scaleX = 0.8
        this.runnerDirection = 'right'
      }
    },
    moveRightStop () {
      if (this.nextMove === 'right') {
        this.nextMove = ''
      }
      if (!this.disableInput) {
        if (this.runnerDirection === 'right') {
          this.runner.gotoAndPlay('idle')
          this.runnerDirection = ''
        }
      }
    },
    moveLeftStart () {
      this.nextMove = 'left'
      if (!this.disableInput && !this.climbing) {
        if (this.runner.currentAnimation !== 'run') {
          this.runner.gotoAndPlay('run')
        }
        this.runner.scaleX = -0.8
        this.runnerDirection = 'left'
      }
    },
    moveLeftStop () {
      if (this.nextMove === 'left') {
        this.nextMove = ''
      }
      if (!this.disableInput) {
        if (this.runnerDirection === 'left') {
          this.runner.gotoAndPlay('idle')
          this.runnerDirection = ''
        }
      }
    },
    moveUpStart () {
      this.nextMove = 'up'
      if (!this.disableInput) {
        this.runnerDirection = ''
        if (this.climbing) {
          if (this.runner.currentAnimation !== 'up') {
            this.runner.gotoAndPlay('up')
          }
          this.runnerDirection = 'up'
        } else {
          let _ladderFound = -1
          for (let i = 0; i < this.ladders.length; i++) {
            if (Math.abs(this.runnerContainer.x - this.ladders[i].x) < this.ladders[i].width / 2) {
              if (Math.abs(this.runnerContainer.y - this.ladders[i].bottomY) < 5) {
                _ladderFound = i
              }
            }
          }
          if (_ladderFound !== -1) {
            this.currentLadderIndex = _ladderFound
            this.runnerContainer.x = this.ladders[this.currentLadderIndex].x
            this.climbing = true
            this.runner.gotoAndPlay('up')
            this.runnerDirection = 'up'
          } else {
            this.openDoor()
          }
        }
      }
    },
    moveUpStop () {
      if (this.nextMove === 'up') {
        this.nextMove = ''
      }
      if (!this.disableInput) {
        if (this.runnerDirection === 'up') {
          this.runnerDirection = ''
          this.runner.gotoAndPlay('climb')
        }
      }
    },
    moveDownStart () {
      this.nextMove = 'down'
      if (!this.disableInput) {
        this.runnerDirection = ''
        if (this.climbing) {
          if (this.runner.currentAnimation !== 'up') {
            this.runner.gotoAndPlay('up')
          }
          this.runnerDirection = 'down'
        } else {
          let _ladderFound = -1
          for (let i = 0; i < this.ladders.length; i++) {
            if (Math.abs(this.runnerContainer.x - this.ladders[i].x) < this.ladders[i].getBounds().width / 2) {
              if (Math.abs(this.runnerContainer.y - this.ladders[i].y) < 5) {
                _ladderFound = i
              }
            }
          }
          if (_ladderFound !== -1) {
            this.currentLadderIndex = _ladderFound
            this.runnerContainer.x = this.ladders[this.currentLadderIndex].x
            this.climbing = true
            this.disableInput = true
            this.nextMove = 'down'
            this.runner.gotoAndPlay('downInitial')
          }
        }
      }
    },
    moveDownStop () {
      if (this.nextMove === 'down') {
        this.nextMove = ''
      }
      if (this.runnerDirection === 'down') {
        this.runnerDirection = ''
        this.runner.gotoAndPlay('climb')
      }
    },
    handleDoorAnimationEnd (event) {
      let _target = event.currentTarget
      if (_target.currentAnimation === 'closing') {
        _target.gotoAndPlay('door1')
      } else if (_target.currentAnimation === 'opening') {
        _target.gotoAndPlay('closing')
        if (this.runner.enteringDoor) {
          this.runner.enteringDoor = false
          this.runnerContainer.alpha = 0
        } else if (this.runner.exitingDoor) {
          this.runner.exitingDoor = false
          this.runnerContainer.alpha = 1
        }
      }
    },
    handleZombieAnimationEnd () {
      if (this.zombie.currentAnimation === 'zombie_DownInitial') {
        this.zombieClimbing = true
        this.prepareToGoDown = false
        this.zombieContainer.y += this.zombie.height / 2
      }
    },
    handleRunnerAnimationEnd () {
      if (this.runner.currentAnimation === 'upFinal') {
        this.disableInput = false
      } else if (this.runner.currentAnimation === 'downInitial') {
        this.disableInput = false
        this.runnerContainer.y += this.runner.height / 2
        if (this.nextMove !== '') {
          this.runnerDirection = this.nextMove
        } else {
          this.runner.gotoAndPlay('climb')
        }
      }
    },
    clearDoorsOption () {
      for (let i = 0; i < this.doors.length; i++) {
        let _door = this.doors[i].door
        this.doors[i].removeAllChildren()
        this.doors[i].addChild(_door)
        this.doors[i].correct = null
        this.doors[i].value = ''
      }
    },
    calculateZombieDoorDifference (door) {
      return (door.x - this.zombieContainer.x) * (door.x - this.zombieContainer.x) +
        (door.y - this.zombieContainer.y) * (door.y - this.zombieContainer.y)
    },
    createRandomOrder (noOfItem) {
      return zim.shuffle(Array.from(Array(noOfItem).keys()))
    },
    initObjects () {
      let _randomOrder = this.createRandomOrder(this.doors.length)
      let _noOfOption = this.currentOptions.length
      this.caught = false
      this.climbing = false
      // this.zombieClimbing = false
      this.answerChosen = false
      this.zombie.gotoAndPlay('zombie_run')
      this.runner.gotoAndPlay('idle')

      if (this.restoreOriginalPositon) {
        // if game restarts, place runner to original position
        this.runnerContainer.x = this.runnerOriginalPosition.x
        this.runnerContainer.y = this.runnerOriginalPosition.y
        this.runnerContainer.alpha = 1

        this.zombieContainer.x = this.zombieOriginalPosition.x
        this.zombieContainer.y = this.zombieOriginalPosition.y
      } else {
        // runner comes out from empty door
        let _maxDif = this.calculateZombieDoorDifference(this.doors[_randomOrder[_noOfOption]])
        let _targetDoor = _randomOrder[_noOfOption]
        for (let i = _noOfOption + 1; i < this.doors.length; i++) {
          // choose the door far from zombie
          let _dif = this.calculateZombieDoorDifference(this.doors[_randomOrder[i]])
          if (_dif > _maxDif) {
            _maxDif = _dif
            _targetDoor = _randomOrder[i]
          }
        }
        this.runnerContainer.x = this.doors[_targetDoor].x
        this.runnerContainer.y = this.doors[_targetDoor].y
        this.runner.exitingDoor = true
        this.doors[_targetDoor].door.gotoAndPlay('opening')
      }
      this.restoreOriginalPositon = false
      this.disableInput = false
      this.gameReady = true

      this.clearDoorsOption()

      for (let i = 0; i < _noOfOption; i++) {
        let _container = this.doors[_randomOrder[i]]
        _container.correct = this.currentOptions[i].correct
        _container.value = this.currentOptions[i].value
        
        let _displayObject = this.getDisplayObject({ value: this.getOptionValue(this.currentOptions[i]) })
        _displayObject.center(_container)
      }
    },
    showNextQuestion () {
      this.initObjects()
      this.setQuestion()
    },
    startGame () {
      this.zombieClimbing = false
      this.showNextQuestion()
    }
  },
  mounted () {
    this.initGameShell({ arrowControl: true })
  },
  beforeDestroy () {
    this.cleanUp()
  }
}
</script>