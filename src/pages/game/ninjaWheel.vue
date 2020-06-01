<template>
  <div style="width: 100%; text-align: center;">
    <div :id="holder + 'Container'">
      <div :id="holder"></div>
    </div>
  </div>
</template>

<script>
import GameShellMixin from "../../library/mixins/zimGameShell";
export default {
  name: "ninja-wheel",
  mixins: [GameShellMixin],
  data() {
    return {
      assets: [
        "background.png",
        "ninjawheel.json",
        "ninja.png",
        "wheel-base.json",
        "wheel-base.png",
        "arrow2.json",
        "arrow2.png",
        "wheelbutton.json",
        "wheelbutton.png",
        "wheel.json",
        "wheel.png",
        "target.json",
        "target.png",
      ],
			path: "statics/game/ninjawheel/",
			hero: null,
			arrow: null,
			wheelmiddle: null,
			rotatedegree: 0,
			arcContainer:[],
			rotating:true,
		//  objectLayer:null,
			arccnt:0,
			arcsContainer: null,
			fired:false,
			arcColors: ['#ea8b00', '#13b86c', '#ee2c2d', '#2cd9ee']
    };
  },
  methods: {
    initGame() {
      this.frame.loadAssets(this.assets, this.path);

      this.frame.on("complete", () => {
        let _background = this.frame.asset("background.png");
        _background.width = this.width;
        _background.height = this.height;
        this.backgroundLayer.addChild(_background);

        this.objectLayer = new zim.Container();
				this.contentLayer.addChild(this.objectLayer);
				
				this.arcsContainer = new zim.Container()
				
				this.arcsContainer.x = 340
				this.arcsContainer.y = 255

				this.contentLayer.addChild(this.arcsContainer)
				this.arcsContainer.setBounds(0, 0, 300, 300)
				this.arcsContainer.centerReg()


				this.questionContainer = new zim.Container()
				this.questionContainer = this.questionContainer.setBounds(0, 0, this.contentLayerWidth, 90)
				this.questionContainer.x = 0
				this.questionContainer.y = 0
				this.contentLayer.addChild(this.questionContainer)

        this.createPlatform();

        this.stage.update();
      });
	},
	createArcs () {
		this.optionContainers = []
		this.arcsContainer.removeAllChildren()
		for (let i = 0; i < this.currentOptions.length; i++) {
			this.createArc({arcindex: i, arcAngle: 360 / this.currentOptions.length, angle : 360 / this.currentOptions.length * i})
		}
	},
	createArc(params){
		let _arcContainer = new zim.Container()
		let _arcLength = 150
		_arcContainer.x = _arcLength
		_arcContainer.y = _arcLength
		_arcContainer.regX = _arcLength
		_arcContainer.regY = _arcLength
		let _arc = new zim.Shape()
		_arc.graphics.setStrokeStyle(2).beginStroke("#000000").beginFill(this.arcColors[params.arcindex]).arc(_arcLength, _arcLength, _arcLength, (90 - params.arcAngle / 2) * (Math.PI / 180), (90 + params.arcAngle / 2) * (Math.PI / 180), false).lineTo(_arcLength, _arcLength).closePath()
		_arcContainer.addChild(_arc)
		
		let _optionContainer = new zim.Container()
		_optionContainer.setBounds(0, 0, _arcLength, _arcLength * 0.6)
		_optionContainer.x = _arcLength / 2
		_optionContainer.y = _arcLength * 1.4
		_optionContainer.hit = false
		_optionContainer.balloonIndex = params.arcindex
		_arcContainer.addChild(_optionContainer)
		
		this.optionContainers[params.arcindex] = _optionContainer

		_arcContainer.rotation = params.angle

		this.arcsContainer.addChild(_arcContainer)
	},
  createPlatform() {
    this.platformContainer = new zim.Container();

	  this.arrow = new zim.Sprite({
        json: this.frame.asset("arrow2.json")
	  });
	  this.arrow.scale = 0.3;
	  this.arrow.x = 370;
	  this.arrow.y = -300;

      this.hero = new zim.Sprite({
        json: this.frame.asset("ninjawheel.json")
      });
      this.hero.gotoAndPlay("a");
      this.hero.x = 180;
      this.hero.y = 530;
      this.hero.scale = 0.3;

      let _wheelbase = new zim.Sprite({
        json: this.frame.asset("wheel-base.json")
      });
      _wheelbase.gotoAndPlay("a");
      _wheelbase.x = 170;
      _wheelbase.y = 78;
	  _wheelbase.scale = 0.2;

	  let _firebutton = new zim.Sprite({
        json: this.frame.asset("wheelbutton.json")
	  });
		_firebutton.scale = 0.7;
		_firebutton.x = 40
	  _firebutton.y = 500;
	  _firebutton.on("click", () => {
        this.fire();
	  });

	  this.wheelmiddle = new zim.Sprite({
        json: this.frame.asset("wheel.json")
	  });
	  this.wheelmiddle.scale = 0.3;
	  this.wheelmiddle.x = 285;
	  this.wheelmiddle.y = 200;
	  
	  let target = new zim.Sprite({
        json: this.frame.asset("target.json")
	  });
	  target.scale = 0.6;
	  target.x = 340;
	  target.y = 300;
	  
	  this.platformContainer.addChild(this.hero,  _wheelbase, this.wheelmiddle, target, this.arrow);
	  this.contentLayer.addChild(this.platformContainer);
		this.panelLayer.addChild(_firebutton);

	  zim.Ticker.add(event => {
			this.rotatewheel();
		}, this.stage);
	},
	fire(){
		if(!this.gameStarted) return;		
		if(this.fired) return;
		this.fired = true;
		this.arrow.y = 330;
		this.rotating = false;
		this.hero.gotoAndPlay("fire");
		for(let i = 0; i < this.optionContainers.length; i ++)
		{
			if (this.arrow.hitTestBounds(this.optionContainers[i])) {
				//console.log(i);
				this.checkanswer(i);
			}
		}
	},
	rotatewheel()
	{
     	if (this.gameStarted && this.rotating) {
			this.rotatedegree += 1;
			if(this.rotatedegree == 360)
				this.rotatedegree = 0;
			this.wheelmiddle.rot(this.rotatedegree);
			
			let wmscale = 0.3;
			let radius = 76;
			
			let degree = 45 - this.rotatedegree;
			this.wheelmiddle.rotation = this.rotatedegree;
			this.wheelmiddle.x = 285 + 180 * wmscale - Math.sin(degree * 3.14 / 180) * radius;
			this.wheelmiddle.y = 200 + 180 * wmscale - Math.cos(degree * 3.14 / 180) * radius;
			
			this.arcsContainer.rotation = this.rotatedegree;
			this.stage.update();
		}
	},
  initObjects() {
		this.arrow.y = -100;
		this.rotatedegree = 0;
		this.arccnt = this.currentOptions.length;
		this.rotating = true;
		this.hero.gotoAndPlay("a");
		this.fired = false;
	},
  showNextQuestion() {
			this.initObjects();
			this.createArcs();
			this.setQuestion();
      this.setOptionContent({ color: "white" });
    },
    startGame() {
      this.showNextQuestion();
    },
	checkanswer(index)
	{
		if (this.optionContainers[index].correct) {
			this.handleCorrect();
			this.hero.gotoAndPlay("fire-s");
		} else {
			this.handleWrong();
			this.hero.gotoAndPlay("fire-f");
		}
		if (this.noOfLifeRemained > 0) {
			setTimeout(() => {
			this.showNextQuestion();
			}, this.waitForNext);
		}
	},
  },
  mounted() {
    this.initGameShell();
  },
  beforeDestroy() {
    this.cleanUp();
  }
};
</script>