<template>
  <div style="padding: 1em">
    <q-card style="padding: 1em; font-family: 'Comic Sans MS'">
      <q-list>
        <q-collapsible group="sample" icon="search" label="Preparation">
          <div>
            <div>Create two new files under pages/game directory by copying sample.vue and sampleContainer.vue
              <li>gameName.vue</li>
              <li>gameNameContainer.vue</li>
            </div>
            <div>Create a new directory statics/game/gameName</div>
            <div>Modify sample-game, and SampleGame to game-name and GameName in gameNameContainer.vue</div>
            <div>Copy image and image json file to statics/game/gameName</div>
            <div>Add a new route in src/router/routes.js
              <li>{ path: '/gameName', component: () => import('pages/game/gameNameContainer.vue') },</li>
            </div>
            <div>Open URL
              <li>http://localhost:8080/#/gameName/</li>
            </div>
            <div style="padding: 1em;">
              <q-btn color="primary" no-caps @click="openGame({})">Show</q-btn>
            </div>
          </div>
        </q-collapsible>
        <q-card-separator/>
        <q-collapsible group="sample" icon="search" label="Set Background">
          <div>Add "background.png" to the assets array</div>
          <div>Add the following lines in initGame function
            <div class="code-container">
              <code>
                <pre style="font-size: 0.9em;">
let _background = this.frame.asset('background.png')
_background.width = this.width
_background.height = this.height
this.backgroundLayer.addChild(_background)</pre>
              </code>
            </div>
          </div>
          <div style="padding: 1em;">
            <q-btn color="primary" no-caps @click="openGame({setBackground: true})">Show</q-btn>
          </div>
        </q-collapsible>
        <q-card-separator/>
        <q-collapsible group="sample" icon="search" label="Load image from sprite">
          <div>
            <div>Add "gameName.json" and "gameName.png" to the assets array</div>
            <div>Create Sprite with gameName.json</div>
            <div class="code-container">
              <code>
                <pre style="font-size: 0.9em;">let _button = new zim.Sprite({json: this.frame.asset("gameName.json")})
_button.gotoAndPlay('button1')
this.contentLayer.addChild(_button)</pre>
              </code>
            </div>
          </div>
          <div style="padding: 1em;">
            <q-btn color="primary" no-caps @click="openGame({loadSprite: true})">Show</q-btn>
          </div>
        </q-collapsible>
        <q-card-separator/>
        <q-collapsible group="sample" icon="search" label="Set question and standard option">
          <div>Add a function createButton and call this function in function initGame
            <div class="code-container">
              <code>
                <pre style="font-size: 0.9em;">createButton () {
  let _button1 = new zim.Sprite({json: this.frame.asset("gameName.json")})
  _button1.gotoAndPlay('button1')
  let _button2 = new zim.Sprite({json: this.frame.asset("gameName.json")})
  _button2.gotoAndPlay('button2')
  let _button3 = new zim.Sprite({json: this.frame.asset("gameName.json")})
  _button3.gotoAndPlay('button3')

  this.createStandardOptions({
    optionBgs: [
      _button1,
      _button2,
      _button3
    ]
  })
},</pre>
              </code>
            </div>
          </div>
          <div>
            <div>Add the following lines in function showNextQuestion</div>
            <div class="code-container">
              <code>
                <pre style="font-size: 0.9em;">this.setQuestion()
// By the default, the content in option is displayed at center, shiftX and shiftY are used to control the position
this.setQuestionAndOption({ shiftX: 0.3, color: 'white' })</pre>
              </code>
            </div>
          </div>
          <div style="padding: 1em;">
            <q-btn color="primary" no-caps @click="openGame({setQuestionAndOption: true})">Show</q-btn>
          </div>
        </q-collapsible>
        <q-card-separator/>
        <q-collapsible group="sample" icon="search" label="Check result and show next question">
          <div>
            <div>Add a function named optionClicked</div>
            <div class="code-container">
              <code>
                <pre style="font-size: 0.9em;">// This function is called after an option is clicked 
optionClicked (index) {
  // index is the option index
  // To check whether the answer is correct or not, check this.optionContainers[index].correct
  // put your logic here to show the corresponding animation
  // call this.handleCorrect() if the result is correct
  // call this.handleWrong() if the result is wrong
  // call waitForNextQuestion to show next question
  // here is a simple example
  if (this.optionContainers[index].correct) {
    this.handleCorrect()
  } else {
    this.handleWrong()
  }
  // By default, the next question is show after 2 seconds. Please update this.waitForNext if necessary
  this.waitForNextQuestion()
}</pre>
              </code>
            </div>
          </div>
          <div style="padding: 1em;">
            <q-btn
              color="primary"
              no-caps
              @click="openGame({setQuestionAndOption: true, checkResult: true})"
            >Show</q-btn>
          </div>
        </q-collapsible>
        <q-card-separator/>
        <q-collapsible group="sample" icon="search" label="Set custom option">
          <div>
            <div>Add option with background image</div>
            <div class="code-container">
              <code>
                <pre style="font-size: 0.9em;">// create the following function and call this function in function initGame
createOptions () {
  for (let i = 0; i &lt; 3; i++) {
    let _bg = new zim.Sprite({json: this.frame.asset("gameName.json")})
    _bg.gotoAndPlay('objectName')
    this.containers[i] = new zim.Container()
    this.containers[i].addChild(_bg)
    // set the index of the container 
    this.containers[i].index = i 
    // set the container name to optionContainer so that this.getParentContainer can find it
    this.containers[i].name = 'optionContainer'

    // set the dimension of option container so that the content can be displayed at center
    let _optionContainer = new zim.Container(0, 0, _bg.width, _bg.height)
    this.containers[i].addChild(_optionContainer)
    // set the created _optionContainer to this.optionContainers array
    this.optionContainers[i] = _optionContainer

    this.containers[i].on('click', event => {
      if (this.optionEnabled) {
        // prevent more than one option clicked
        this.optionEnabled = false
        // get the container
        let _container = this.getParentContainer(event.target)
        this.optionClicked(_container.index)
      }
    })
    
    this.containers[i].x = 100 + i * 200
    this.containers[i].y = 300
    this.contentLayer.addChild(this.containers[i])
  }
}</pre>
              </code>
            </div>
          </div>
          <div style="padding: 1em;">
            <q-btn
              color="primary"
              no-caps
              @click="openGame({setOption: true, checkResult: true})"
            >Show</q-btn>
          </div>
        </q-collapsible>
        <q-card-separator/>
        <q-collapsible group="sample" icon="search" label="Show arrow control">
          <div>Call this.setArrowControl (4 arrows) or this.setLeftRightControl (left, right arrows) in initGame</div>
          <div>Set these function to receive arrow control event
            <div class="code-container">
              <code>
                <pre style="font-size: 0.9em;">// this function is called when left arrow button or left key is pressed
moveLeftStart () { },
// this function is called when left key is released
moveLeftStop () { },
moveRightStart () { },
moveRightStop () { },
moveUpStart () { },
moveUpStop () { },
moveDownStart () { },
moveDownStop () { },</pre>
              </code>
            </div>
          </div>
          <div style="padding: 1em;">
            <q-btn
              color="primary"
              no-caps
              @click="openGame({setArrowControl: true})"
            >Show (4 arrows)</q-btn>
            <q-btn
              color="primary"
              no-caps
              @click="openGame({setLeftRightControl: true})"
            >Show (left, right arrows)</q-btn>
          </div>
        </q-collapsible>
        <q-card-separator/>
        <q-collapsible group="sample" icon="search" label="Control animation">
          <div>
            <div>To control the speed and looping, set animations in gameName.json</div>
            <div>Set "next" to control looping and "speed" to control speed</div>
            <div class="code-container">
              <code>
                <pre style="font-size: 0.9em;">"animations": {
    "rocketExplosion": { "frames": [1, 2, 6, 7, 9, 11, 14], "next": "", "speed": 0.2 },
    "blueKilledByBow": { "frames": [3, 4, 5], "next": "", "speed": 0.1 },
    "blueWalk": { "frames": [8, 10, 12, 13], "next": "blueWalk", "speed": 0.1 }
},</pre>
              </code>
            </div>
            <div style="padding: 1em;">
              <q-btn color="primary" no-caps @click="openGame({showAnimation: true})">Show</q-btn>
            </div>
          </div>
        </q-collapsible>
        <q-card-separator/>
        <q-collapsible group="sample" icon="search" label="Move along path">
          <div>
            <div>Create animation path</div>
            <div style="padding: 1em;">
              <q-btn
                color="primary"
                no-caps
                @click="openGame({setBackground: true, showPathCreation: true})"
              >Show</q-btn>
            </div>
            <div>Play animation path</div>
            <div style="padding: 1em;">
              <q-btn
                color="primary"
                no-caps
                @click="openGame({setBackground: true, playPathAnimation: true})"
              >Show</q-btn>
            </div>
          </div>
        </q-collapsible>
        <q-card-separator/>
        <q-collapsible group="sample" icon="search" label="Zim Library Reference">
          <div>
            <a href="https://zimjs.com/docs.html" target="_blank">Zim Document</a>
          </div>
          <div>
            <a href="https://zimjs.com/learn.html" target="_blank">Learn Zim</a>
          </div>
          <div>
            <a href="https://zimjs.com/examples.html" target="_blank">Zim Example</a>
          </div>
        </q-collapsible>
        <q-card-separator/>
        <q-collapsible group="sample" icon="search" label="Sample Games">
          <div>
            <div>
              <q-btn color="primary" no-caps @click="openSampleGame('flappyBird')">Flappy Bird</q-btn>
              <q-btn color="primary" no-caps @click="openSampleGame('ninjaFight')">Ninja Fight</q-btn>
              <q-btn color="primary" no-caps @click="openSampleGame('ninjaFight2')">Ninja Fight2</q-btn>
              <q-btn color="primary" no-caps @click="openSampleGame('ninjaShooting')">Ninja Shooting</q-btn>
              <q-btn
                color="primary"
                no-caps
                @click="openSampleGame('ninjaGhostLeg')"
              >Ninja Ghost Leg</q-btn>
              <q-btn color="primary" no-caps @click="openSampleGame('ninjaJump')">Ninja Jump</q-btn>
              <q-btn color="primary" no-caps @click="openSampleGame('ninjaRiver')">Ninja River</q-btn>
              <q-btn color="primary" no-caps @click="openSampleGame('racing')">Racing</q-btn>
              <q-btn color="primary" no-caps @click="openSampleGame('snake')">Snake</q-btn>
              <q-btn color="primary" no-caps @click="openSampleGame('whack')">Whack</q-btn>
              <q-btn color="primary" no-caps @click="openSampleGame('zombie')">Zombie</q-btn>
              <q-btn color="primary" no-caps @click="openSampleGame('ninjaWheel')">Ninja Wheel</q-btn>
              <q-btn color="primary" no-caps @click="openSampleGame('ninjaJezzball')">Ninja Jezzball</q-btn>
              <q-btn color="primary" no-caps @click="openSampleGame('ninjaSlash')">Ninja Slash</q-btn>
              <q-btn color="primary" no-caps @click="openSampleGame('running')">Running</q-btn>
              <q-btn color="primary" no-caps @click="openSampleGame('sumpuzzle')">Sum Puzzle</q-btn>
              <q-btn color="primary" no-caps @click="openSampleGame('sumcrush')">Sum Crush</q-btn>
              <q-btn color="primary" no-caps @click="openSampleGame('ninjahole')">Ninja Hole</q-btn>
              <q-btn color="primary" no-caps @click="openSampleGame('ninjadart')">Ninja Dart</q-btn>
              <q-btn color="primary" no-caps @click="openSampleGame('arithmetic')">Arithmetic</q-btn>
            </div>
          </div>
        </q-collapsible>
        <q-card-separator/>
      </q-list>
    </q-card>
    <q-modal v-model="sampleGameOpened" maximized>
      <div style="position: relative;">
        <flappy-bird-container v-if="currentGame === 'flappyBird'"></flappy-bird-container>
        <ninja-fight-container v-if="currentGame === 'ninjaFight'"></ninja-fight-container>
        <ninja-fight2-container v-if="currentGame === 'ninjaFight2'"></ninja-fight2-container>
        <ninja-shooting-container v-if="currentGame === 'ninjaShooting'"></ninja-shooting-container>
        <ninja-ghost-leg-container v-if="currentGame === 'ninjaGhostLeg'"></ninja-ghost-leg-container>
        <ninja-jump-container v-if="currentGame === 'ninjaJump'"></ninja-jump-container>
        <ninja-river-container v-if="currentGame === 'ninjaRiver'"></ninja-river-container>
        <racing-container v-if="currentGame === 'racing'"></racing-container>
        <snake-container v-if="currentGame === 'snake'"></snake-container>
        <whack-container v-if="currentGame === 'whack'"></whack-container>
        <zombie-container v-if="currentGame === 'zombie'"></zombie-container>
        <ninja-wheel-container v-if="currentGame === 'ninjaWheel'"></ninja-wheel-container>
        <ninja-jezzball-container v-if="currentGame === 'ninjaJezzball'"></ninja-jezzball-container>
        <ninja-slash-container v-if="currentGame === 'ninjaSlash'"></ninja-slash-container>
        <running-container v-if="currentGame === 'running'"></running-container>
        <sum-puzzle-container v-if="currentGame === 'sumpuzzle'"></sum-puzzle-container>
        <sum-crush-container v-if="currentGame === 'sumcrush'"></sum-crush-container>
        <ninja-hole-container v-if="currentGame === 'ninjahole'"></ninja-hole-container>
        <ninja-dart-container v-if="currentGame === 'ninjadart'"></ninja-dart-container>
        <arithmetic-container v-if="currentGame === 'arithmetic'"></arithmetic-container>
        <div style="position: absolute; top: 0px; right: 0px;">
          <q-btn color="primary" @click="sampleGameOpened = false; currentGame = ''" label="Close"/>
        </div>
      </div>
    </q-modal>
    <q-modal v-model="gameOpened" maximized>
      <div style="position: relative;">
        <tutorial-container :setting="setting" v-if="gameOpened"></tutorial-container>
        <div style="position: absolute; top: 0px; right: 0px;">
          <q-btn color="primary" @click="gameOpened = false" label="Close"/>
        </div>
      </div>
    </q-modal>
  </div>
</template>

<style>
</style>

<script>
import FlappyBirdContainer from "./game/flappyBirdContainer";
import NinjaFightContainer from "./game/ninjaFightContainer";
import NinjaFight2Container from "./game/ninjaFight2Container";
import NinjaShootingContainer from "./game/ninjaShootingContainer";
import RifleContainer from "./game/rifleContainer";
import NinjaGhostLegContainer from "./game/zimNinjaGhostLegContainer";
import NinjaJumpContainer from "./game/zimNinjaJumpContainer";
import NinjaRiverContainer from "./game/zimNinjaRiverContainer";
import RacingContainer from "./game/zimRacingContainer";
import SnakeContainer from "./game/zimSnakeContainer";
import WhackContainer from "./game/zimWhackContainer";
import ZombieContainer from "./game/zombieContainer";
import TutorialContainer from "./game/tutorialContainer";
import NinjaWheelContainer from "./game/ninjaWheelContainer";
import NinjaJezzballContainer from "./game/ninjaJezzballContainer";
import NinjaSlashContainer from "./game/ninjaslashContainer";
import RunningContainer from "./game/runningContainer";
import SumPuzzleContainer from "./game/sumpuzzleContainer";
import SumCrushContainer from "./game/sumcrushContainer";
import NinjaHoleContainer from "./game/ninjaholeContainer";
import NinjaDartContainer from "./game/ninjadartContainer";
import ArithmeticContainer from "./game/ArithmeticContainer";
export default {
  name: "PageIndex",
  components: {
    TutorialContainer,
    FlappyBirdContainer,
    NinjaFightContainer,
    NinjaFight2Container,
    NinjaShootingContainer,
    NinjaGhostLegContainer,
    NinjaJumpContainer,
    NinjaRiverContainer,
    RacingContainer,
    SnakeContainer,
    WhackContainer,
    ZombieContainer,
    NinjaWheelContainer,
	NinjaJezzballContainer,
	NinjaSlashContainer,
	RunningContainer,
	SumPuzzleContainer,
	SumCrushContainer,
	NinjaHoleContainer,
	NinjaDartContainer,
	ArithmeticContainer,
  },
  data() {
    return {
      setting: {},
      gameOpened: false,
      sampleGameOpened: false,
      showSampleGame: false,
      currentGame: ""
    };
  },
  methods: {
    openSampleGame(game) {
      this.sampleGameOpened = true;
      this.showSampleGame = false;
      this.currentGame = game;
      this.$nextTick(() => {
        this.showSampleGame = true;
      });
    },
    openGame(setting) {
      this.setting = setting;
      this.gameOpened = true;
    }
  }
};
</script>

<style>
.code-container {
  width: 100%;
  background: black;
  margin: 1em 0;
  padding: 0.2em 0.5em;
}
code {
  width: 100%;
  background: black;
  color: white;
}
</style>
