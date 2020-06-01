<template>
  <div style="width: 100%; text-align: center;">
    <div :id="holder + 'Container'"><div :id="holder"></div></div>
  </div>
</template>

<script>
import GameShellMixin from '../../library/mixins/zimGameShell'
export default {
  name: 'zim-tennis',
  mixins: [GameShellMixin],
  data () {
    return {
      assets: ["background.png", "tennis.png", "tennis.json", "opponent.png", "player.png", "player-power.png"],
      path: "statics/game/zimtennis/",
      containers: [],
      ball: null,
      player: null,
      powerPlayer: null,
      opponent: null,
      positions: ['left', 'mid', 'right'],
      opponentPositions: { left: 170, mid: 300, right: 450},
      playerPositions: { left: 80, mid: 280, right: 480 },
      throwBallPosition: { x: 360, y: 460 },
      throwBallPath: [[143,174.8,0,0,5.3,51.2,-5.3,-51.2],[175.6,31.8,0,0,-17.6,-1.8,17.6,1.8],[213.6,123.6,0,0,-10.6,-38.8,10.6,38.8]],
      servePosition: { x: 360, y: 460 },
      servePath: [[211.9,123.6,0,0,5.3,51.2,-5.3,-51.2],[89.1,-75.9,0,0,45.9,58.3,-45.9,-58.3],[-59.6,-152.3,0,0,5.3,1.8,-5.3,-1.8],[-93.2,-245.9,0,0,21.1,24.6,-16.3,-19,"straight"],[-160.8,-291.3,0,0,33.6,8.9,-33.6,-8.9]],
      powerLevel: 0,
      maxPowerLevel: 5,
      powerHit: false
    }
  },
  methods: {
    setBallPath (hitter, playerPosition, opponentPosition) {
      let _points = []
      if (hitter === 'player') {
        if (playerPosition === 'right' && opponentPosition === 'left') {
          _points = [[400.8,455.5,0,0,-30,0,30,0],[237.4,162.4,0,0,65.3,65.3,-65.3,-65.3],[57.3,60,0,0,-7,-8.8,7,8.8],[-0.1,-22.9,0,0,51.2,5.3,-51.2,-5.3]]
        } else if (playerPosition === 'mid' && opponentPosition === 'left') {
          _points = [[203.1,455.5,0,0,-5.3,35.3,5.3,-35.3],[179.1,171.2,0,0,54.7,88.3,-54.7,-88.3],[57.3,60,0,0,-7,-8.8,7,8.8],[-0.1,-22.9,0,0,51.2,5.3,-51.2,-5.3]]
        } else if (playerPosition === 'left' && opponentPosition === 'left') {
          _points = [[-72.4,455.5,0,0,-5.3,35.3,5.3,-35.3],[-48.6,195.9,0,0,-23,74.1,23,-74.1],[37.9,72.4,0,0,-7,-8.8,7,8.8],[5.7,-14.5,0,0,-1.8,44.1,1.8,-44.1]]
        } else if (playerPosition === 'right' && opponentPosition === 'mid') {
          _points = [[400.8,455.5,0,0,-12.3,24.7,12.3,-24.7],[295.7,153.6,0,0,65.3,65.3,-65.3,-65.3],[186.2,63.5,0,0,-7,-8.8,7,8.8],[134.1,-24.7,0,0,51.2,5.3,-51.2,-5.3]]
        } else if (playerPosition === 'mid' && opponentPosition === 'mid') {
          _points = [[206.6,446.7,0,0,-12.3,24.7,12.3,-24.7],[207.4,144.8,0,0,15.9,114.7,-15.9,-114.7],[173.8,61.7,0,0,-1.7,3.6,1.7,-3.6],[134.1,-24.7,0,0,44.1,-17.7,-44.1,17.7]]
        } else if (playerPosition === 'left' && opponentPosition === 'mid') {
          _points = [[-75.9,455.5,0,0,7.1,54.7,-7.1,-54.7],[7.9,162.4,0,0,-56.5,93.5,56.5,-93.5],[106.8,61.7,0,0,-1.7,3.6,1.7,-3.6],[134.1,-24.7,0,0,-38.8,3.5,38.8,-3.5]]
        } else if (playerPosition === 'right' && opponentPosition === 'right') {
          _points = [[400.8,455.5,0,0,-12.3,24.7,12.3,-24.7],[368.1,174.8,0,0,15.9,58.2,-15.9,-58.2],[316.8,60,0,0,3.6,10.6,-3.6,-10.6],[333.6,-22.9,0,0,0,8.8,0,-8.8]]
        } else if (playerPosition === 'mid' && opponentPosition === 'right') {
          _points = [[206.6,448.4,0,0,-12.3,24.7,12.3,-24.7],[230.4,185.4,0,0,-30,86.5,30,-86.5],[316.8,60,0,0,3.6,10.6,-3.6,-10.6],[333.6,-22.9,0,0,-31.8,7.1,31.8,-7.1]]
        } else if (playerPosition === 'left' && opponentPosition === 'right') {
          _points = [[-74.1,455.5,0,0,-12.3,24.7,12.3,-24.7],[129.7,151.8,0,0,-102.4,84.7,102.4,-84.7],[279.8,61.7,0,0,3.6,10.6,-3.6,-10.6],[333.6,-22.9,0,0,-31.8,7.1,31.8,-7.1]]
        }
      } else if (hitter === 'opponent') {
        if (playerPosition === 'right' && opponentPosition === 'left') {
          _points = [[1.8,-24.7,0,0,-30,0,30,0],[225,125.3,0,0,-98.9,-102.4,98.9,102.4],[345.1,384.9,0,0,-7,-8.8,7,8.8],[402.4,457.3,0,0,-15.9,-42.4,15.9,42.4]]
        } else if (playerPosition === 'mid' && opponentPosition === 'left') {
          _points = [[1.8,-24.7,0,0,-30,0,30,0],[124.4,148.3,0,0,-17.7,-49.4,17.7,49.4],[168.5,383.1,0,0,-7,-8.8,7,8.8,"straight"],[206.4,452,0,0,0,-58.3,0,58.3]]
        } else if (playerPosition === 'left' && opponentPosition === 'left') {
          _points = [[-1.7,-15.9,0,0,28.3,3.5,-28.3,-3.5],[-41.6,180,0,0,3.5,-54.7,-3.5,54.7],[-25.7,386.7,0,0,0.1,-1.7,-0.1,1.7],[-83.1,455.5,0,0,3.5,-63.6,-3.5,63.6]]
        } else if (playerPosition === 'right' && opponentPosition === 'mid') {
          _points = [[130.7,-22.9,0,0,-30,0,30,0],[283.3,130.6,0,0,-30,-51.2,30,51.2],[345.1,384.9,0,0,-7,-8.8,7,8.8],[402.4,457.3,0,0,-15.9,-42.4,15.9,42.4]]
          // _points = [[328.4,-24.7,0,0,-12.3,24.7,12.3,-24.7],[214.4,171.2,0,0,12.3,-65.3,-12.3,65.3],[218,376.1,0,0,-4.4,-13.3,3.9,11.8,"straight"],[206.4,452,0,0,-21.2,-51.2,21.2,51.2]]
        } else if (playerPosition === 'mid' && opponentPosition === 'mid') {
          _points = [[128.9,-24.7,0,0,-30,0,30,0],[193.2,178.3,0,0,-7.1,-61.8,7.1,61.8],[193.3,383.1,0,0,-7,-8.8,7,8.8,"straight"],[206.4,452,0,0,0,-58.3,0,58.3]]
        } else if (playerPosition === 'left' && opponentPosition === 'mid') {
          _points = [[128.9,-24.7,0,0,31.8,-37.1,-31.8,37.1],[14.9,190.6,0,0,22.9,-91.8,-22.9,91.8],[-11.5,416.7,0,0,-7,-8.8,7,8.8],[-74.3,452,0,0,-15.9,-42.4,15.9,42.4]]
        } else if (playerPosition === 'right' && opponentPosition === 'right') {
          _points = [[330.2,-24.7,0,0,-30,0,30,0],[398,222.4,0,0,-1.8,-51.2,1.8,51.2],[385.7,377.8,0,0,-7,-8.8,7,8.8],[402.4,457.3,0,0,15.9,-54.8,-15.9,54.8]]
        } else if (playerPosition === 'mid' && opponentPosition === 'right') {
          _points = [[328.4,-24.7,0,0,-12.3,24.7,12.3,-24.7],[214.4,171.2,0,0,12.3,-65.3,-12.3,65.3],[218,376.1,0,0,-4.4,-13.3,3.9,11.8,"straight"],[206.4,452,0,0,-21.2,-51.2,21.2,51.2]]
          // _points = [[130.7,-22.9,0,0,-30,0,30,0],[283.3,130.6,0,0,-30,-51.2,30,51.2],[345.1,384.9,0,0,-7,-8.8,7,8.8],[402.4,457.3,0,0,-15.9,-42.4,15.9,42.4]]
        } else if (playerPosition === 'left' && opponentPosition === 'right') {
          _points = [[328.4,-24.7,0,0,-12.3,24.7,12.3,-24.7],[108.5,143,0,0,58.2,-65.3,-58.2,65.3],[-11.5,416.7,0,0,-7,-8.8,7,8.8],[-74.3,452,0,0,-15.9,-42.4,15.9,42.4]]
        }
      }

      this.ballPath = new zim.Squiggle({
        points: _points,
        onTop:false,
        interactive: false,
        showControls: false,
      })
      this.ballPath.x = 200
      this.ballPath.y = 200
    },
    getPlayerSprite (playerImage) {
      return new zim.Sprite({
        image: this.frame.asset(playerImage),
        cols: 9,
        rows: 3,
        animations: {
          throwBall: { frames: [20, 21, 22, 23], next: '', speed: 0.05 },
          afterThrowBall: { frames: [23, 22, 21, 19, 18], next: '', speed: 0.1 },
          holdBall: 20,
          serve: 24,
          leftHit: 7,
          rightHit: 16,
          stand: 18,
          leftHit: 7,
          rightHit: 16,
          moveLeft: { frames: [9, 10, 11, 12, 13, 14], speed: 0.2 },
          prepareLeftHit: { frames: [15, 16], next: '', speed: 0.1 },
          startLeftHit: { frames: [17, 16], next: '', speed: 0.1 },
          afterLeftHit: 17,
          moveRight: { frames: [0, 1, 2, 3, 4, 5], next: '', speed: 0.1},
          prepareRightHit: { frames: [6, 7], next: '', speed: 0.1 },
          startRightHit: { frames: [8, 7], next: '', speed: 0.1 },
          afterRightHit: 8
        }
      })
    },
    getOpponentSprite () {
      return new zim.Sprite({
        image: this.frame.asset("opponent.png"),
        cols: 9,
        rows: 3,
        animations: {
          stand: 18,
          leftHit: 7,
          rightHit: 16,
          moveLeft: { frames: [9, 10, 11, 12, 13, 14], speed: 0.2 },
          prepareLeftHit: { frames: [15, 16], next: '', speed: 0.1 },
          startLeftHit: { frames: [17, 16], next: '', speed: 0.1 },
          afterLeftHit: 16,
          moveRight: { frames: [0, 1, 2, 3, 4, 5], next: '', speed: 0.1},
          prepareRightHit: { frames: [6, 7], next: '', speed: 0.1 },
          startRightHit: { frames: [8, 7], next: '', speed: 0.1 },
          afterRightHit: 8
        }
      })
    },
    initGame () {
      this.waitForNext = 500
      this.frame.loadAssets(this.assets, this.path)
      frame.on("complete", () => {
        let _background = this.frame.asset('background.png')
        _background.width = this.width
        _background.height = this.height
        this.backgroundLayer.addChild(_background)

        let _button1 = new zim.Sprite({json: this.frame.asset("tennis.json")})
        _button1.gotoAndPlay('button1')
        let _button2 = new zim.Sprite({json: this.frame.asset("tennis.json")})
        _button2.gotoAndPlay('button2')
        let _button3 = new zim.Sprite({json: this.frame.asset("tennis.json")})
        _button3.gotoAndPlay('button3')

        this.createStandardOptions({
          optionBgs: [
            _button1,
            _button2,
            _button3
          ]
        })

        this.playerContainer = new zim.Container()
      
        this.player = this.getPlayerSprite("player.png")
        this.player.scale = 0.6
        this.player.alpha = 1
        this.player.gotoAndStop('holdBall')

        this.powerPlayer = this.getPlayerSprite("player-power.png")
        this.powerPlayer.scale = 0.6
        this.powerPlayer.alpha = 0
        this.powerPlayer.gotoAndStop('holdBall')

        this.playerContainer.x = 480
        this.playerContainer.y = 570

        this.playerContainer.addChild(this.player, this.powerPlayer)

        this.opponentContainer = new zim.Container()

        this.opponent = this.getOpponentSprite()
        this.opponent.gotoAndStop('rightHit')
        this.opponent.scale = 0.4
        this.opponentContainer.x = 300
        this.opponentContainer.y = 120

        this.opponentContainer.addChild(this.opponent)

        this.contentLayer.addChild(this.opponentContainer)

        this.ball = new zim.Sprite({json: this.frame.asset("tennis.json")})
        this.ball.gotoAndPlay('ball')
        this.ball.regX = this.ball.width / 2
        this.ball.regY = this.ball.height / 2
        this.contentLayer.addChild(this.ball)
        this.ball.alpha = 0

        this.throwBallPath.x = 100
        this.throwBallPath.y = 100

        this.throwBallSquiggle = new zim.Squiggle({
          points: this.throwBallPath,
          onTop:false,
          interactive: false,
          showControls: false
        })

        this.serveSquiggle = new zim.Squiggle({
          points: this.servePath,
          onTop:false,
          interactive: false,
          showControls: false
        })

        this.throwBallSquiggle.x = 360
        this.throwBallSquiggle.y = 460

        this.serveSquiggle.x = 360
        this.serveSquiggle.y = 460

        this.contentLayer.addChild(this.playerContainer)

        let _gaugeBg = new zim.Sprite({json: this.frame.asset("tennis.json")})
        _gaugeBg.gotoAndStop('gauge-empty')
        _gaugeBg.scale = 0.5
        _gaugeBg.x = 60
        _gaugeBg.y = 270
        this.panelLayer.addChild(_gaugeBg)

        this.gaugeFull = new zim.Sprite({json: this.frame.asset("tennis.json")})
        this.gaugeFull.gotoAndStop('gauge-full')
        this.gaugeFull.scale = 0.5
        this.gaugeFull.x = 60
        this.gaugeFull.y = 270
        this.panelLayer.addChild(this.gaugeFull)

        this.maskGauge = new zim.Rectangle(1, _gaugeBg.height, "rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0)", 0)
        this.maskGauge.x = 60
        this.maskGauge.y = 270
        this.panelLayer.addChild(this.maskGauge)
        this.gaugeFull.setMask(this.maskGauge, true)

        // this.maskGauge.animate({ width: _gaugeBg.width }, 1000)
        
        zim.Ticker.add((event) => {

        }, this.stage)

        this.stage.update()
      })
    },
    optionClicked (index) {
      this.selectedIndex = index
      this.opponentReturn(index)
    },
    showNextQuestion () {
      this.setQuestion()
      this.setOptionContent({ shiftX: 0.3, color: 'white', hideOption: true })
    },
    initObject () {
      if (this.noOfLifeRemained > 0) {
        this.powerHit = false
        this.resetGauge()
        this.powerPlayer.alpha = 0
        this.player.alpha = 1
        this.ball.alpha = 1
        this.opponent.gotoAndStop('rightHit')
        this.opponentContainer.x = 300
        this.opponentContainer.y = 120

        this.ball.animate( { props: {path: this.throwBallSquiggle}, time: 1000, ease: "linear", call: () => { this.afterThrow() } })

        this.player.gotoAndStop('holdBall')
        this.powerPlayer.gotoAndStop('holdBall')
        this.playerContainer.x = 480
        this.playerContainer.y = 570

        this.player.gotoAndPlay('throwBall')
        this.powerPlayer.gotoAndPlay('throwBall')
        this.playerContainer.currentPosition = 'right'
      }
    },
    startGame () {
      this.initObject()
      this.showNextQuestion()
    },
    afterThrow () {
      this.player.gotoAndStop('serve')
      this.powerPlayer.gotoAndStop('serve')
      setTimeout(() => {
        this.player.gotoAndPlay('afterThrowBall')
        this.powerPlayer.gotoAndPlay('afterThrowBall')
      }, 200)
      this.ball.animate( { props: {path: this.serveSquiggle, scale: 0.7}, time: 2000, ease: "linear", call: () => { this.afterServe('left') } })
      this.opponentContainer.animate( { props: { x: this.opponentPositions['left'] }, throwBallSquiggle: 1000, wait: 500, call: () => { this.opponentReady('left') } } )
      setTimeout(() => {
        this.opponent.gotoAndPlay('moveLeft')
        this.opponentContainer.currentPosition = 'left'
      }, 500)
    },
    afterServe () {
      // this.opponentReturn()
      // this.ball.animate( { props: {path: this.ballPath, scale: 1}, time: 2000, ease: "linear", call: () => { this.opponentReturn('right') } })
      this.opponent.gotoAndPlay('startLeftHit')
      setTimeout(() => {
        this.opponent.gotoAndStop('afterLeftHit')
      }, 300)
    },
    getReturnPosition () {
      let _positions = ['left', 'mid', 'right']
      // return zim.shuffle(_positions)[0]
      return 'left'
    },
    opponentReturn (index) {
      this.setBallPath('opponent', this.positions[this.correctOptionIndex()], this.opponentContainer.currentPosition)
      this.ball.animate( { props: {path: this.ballPath, scale: 1}, time: 2000, ease: "linear", call: () => { this.playerReturn(this.correctOptionIndex() === index) } })
      this.movePlayer(this.positions[index])
      if (this.opponentContainer.currentPosition === 'left') {
        this.opponent.gotoAndPlay('startLeftHit')
      } else {
        this.opponent.gotoAndPlay('startRightHit')
      }
    },
    movePlayer (position) {
      if (this.playerContainer.currentPosition !== position) {
        if (position === 'right') {
          this.playerContainer.animate( { props: { x: this.playerPositions['right'] }, throwBallSquiggle: 1000, wait: 500, call: () => { this.playerReady('right') } } )
          setTimeout(() => {
            this.player.gotoAndPlay('moveRight')
            this.powerPlayer.gotoAndPlay('moveRight')
            this.playerContainer.currentPosition = 'right'
          }, 500)
        } else if (position === 'left') {
          this.playerContainer.animate( { props: { x: this.playerPositions['left'] }, throwBallSquiggle: 1000, wait: 500, call: () => { this.playerReady('left') } } )
          setTimeout(() => {
            this.player.gotoAndPlay('moveLeft')
            this.powerPlayer.gotoAndPlay('moveLeft')
            this.playerContainer.currentPosition = 'left'
          }, 500)
        } else if (position === 'mid') {
          if (this.playerContainer.currentPosition === 'left') {
            this.playerContainer.animate( { props: { x: this.playerPositions['mid'] }, throwBallSquiggle: 1000, wait: 500, call: () => { this.playerReady('right') } } )
            setTimeout(() => {
              this.player.gotoAndPlay('moveRight')
              this.powerPlayer.gotoAndPlay('moveRight')
              this.playerContainer.currentPosition = 'mid'
            }, 500)
          } else if (this.playerContainer.currentPosition === 'right') {
            this.playerContainer.animate( { props: { x: this.playerPositions['mid'] }, throwBallSquiggle: 1000, wait: 500, call: () => { this.playerReady('left') } } )
            setTimeout(() => {
              this.player.gotoAndPlay('moveLeft')
              this.powerPlayer.gotoAndPlay('moveLeft')
              this.playerContainer.currentPosition = 'mid'
            }, 500)
          }
        }
      } else {
        setTimeout(() => {
          this.playerReady(position)
        }, 1500) 
      }
    },
    moveOpponent (position) {
      if (this.opponentContainer.currentPosition !== position) {
        if (position === 'right') {
          this.opponentContainer.animate( { props: { x: this.opponentPositions['right'] }, throwBallSquiggle: 1000, wait: 500, call: () => { this.opponentReady('right') } } )
          setTimeout(() => {
            this.opponent.gotoAndPlay('moveRight')
            this.opponentContainer.currentPosition = 'right'
          }, 500)
        } else if (position === 'left') {
          this.opponentContainer.animate( { props: { x: this.opponentPositions['left'] }, throwBallSquiggle: 1000, wait: 500, call: () => { this.opponentReady('left') } } )
          setTimeout(() => {
            this.opponent.gotoAndPlay('moveLeft')
            this.opponentContainer.currentPosition = 'left'
          }, 500)
        } else if (position === 'mid') {
          if (this.opponentContainer.currentPosition === 'left') {
            this.opponentContainer.animate( { props: { x: this.opponentPositions['mid'] }, throwBallSquiggle: 1000, wait: 500, call: () => { this.opponentReady('right') } } )
            setTimeout(() => {
              this.opponent.gotoAndPlay('moveRight')
              this.opponentContainer.currentPosition = 'mid'
            }, 500)
          } else if (this.opponentContainer.currentPosition === 'right') {
            this.opponentContainer.animate( { props: { x: this.opponentPositions['mid'] }, throwBallSquiggle: 1000, wait: 500, call: () => { this.opponentReady('left') } } )
            setTimeout(() => {
              this.opponent.gotoAndPlay('moveLeft')
              this.opponentContainer.currentPosition = 'mid'
            }, 500)
          }
        }
      } else {
        setTimeout(() => {
          this.opponentReady(position)
        }, 1500)
      }
    },
    resetGauge () {
      this.powerLevel = 0
      this.maskGauge.width = 0
    },
    isMaxPowerLevel () {
      return this.powerLevel === this.maxPowerLevel
    },
    handlePlayerReturn () {
      if (this.powerHit) {
        setTimeout(() => {
          this.handleCorrect()
          this.initObject()
          this.waitForNextQuestion()
        }, 1000)
      }
    },
    playerReturn () {
      if (this.optionContainers[this.selectedIndex].correct) {
        let _time = 2000
        if (this.isMaxPowerLevel()) {
          this.player.alpha = 0
          this.powerPlayer.alpha = 1
          this.opponent.gotoAndStop('stand')
          this.powerHit = true
          _time = 500
        } else {
          this.powerLevel++

          if (this.isMaxPowerLevel()) {
            setTimeout(() => {
              this.powerPlayer.alpha = 1
              this.player.alpha = 0
            }, 500)
          }
        }

        this.maskGauge.animate({ width: this.gaugeFull.width * this.powerLevel / this.maxPowerLevel }, 1000)
        let _returnPosition = this.getReturnPosition()
        this.setBallPath('player', this.playerContainer.currentPosition, _returnPosition)
        
        this.ball.animate( { props: {path: this.ballPath, scale: 0.7}, time: _time, ease: "linear", call: () => { this.handlePlayerReturn() } })
        this.moveOpponent(_returnPosition)
        if (this.playerContainer.currentPosition === 'left') {
          this.player.gotoAndPlay('startLeftHit')
          this.powerPlayer.gotoAndPlay('startLeftHit')
        } else {
          this.player.gotoAndPlay('startRightHit')
          this.powerPlayer.gotoAndPlay('startRightHit')
        }

        if (!this.powerHit) {
          this.handleCorrect()
          this.waitForNextQuestion()
        }
      } else {
        this.handleWrong()
        this.ball.alpha = 0

        setTimeout(() => {
          this.initObject()
          this.waitForNextQuestion()

          setTimeout(() => {
            this.showOption()
          }, 2000)
        }, 2000)
      }
      
    },
    opponentReady (position) {
      if (position === 'left') {
        this.opponent.gotoAndPlay('prepareLeftHit')
      } else if (position === 'right' || position === 'mid') {
        this.opponent.gotoAndPlay('prepareRightHit')
      }
      setTimeout(() => {
        this.showOption()
      }, 500)
    },
    playerReady (position) {
      if (position === 'left' || position === 'mid') {
        this.player.gotoAndPlay('prepareLeftHit')
        this.powerPlayer.gotoAndPlay('prepareLeftHit')
      } else if (position === 'right') {
        this.player.gotoAndPlay('prepareRightHit')
        this.powerPlayer.gotoAndPlay('prepareRightHit')
      }
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

