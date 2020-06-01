<template>
  <div style="width: 100%; text-align: center;">
    <div :id="holder + 'Container'"><div :id="holder"></div></div>
  </div>
</template>

<script>
import GameShellMixin from '../../library/mixins/zimGameShell'
export default {
  name: "running",
  mixins: [GameShellMixin],
  data() {
    return {
      assets: [
		  "clouds.png",
		  "button1.png",
		  "button2.png",
		  "button3.png",
		  "brick-floor.png",
		  "brick-floor.json",
		  "monster.json",
		  "monster-sprites.png",
		  "Cat-sprites.png",
		  "block.png",
		  "block.json",
      ],
	  path: "statics/game/running/",	
	  buttonarea: null, 
	  brickfloor: [],
	  monster: null,
	  cat: null,
	  catBody: null,
	  physics: null,
	  block: null,
	  blockBody: null,
	  blockpos: 1000,
	  checking: false,
	  checked: false,
	  movingstop: false
    };
  },
  methods: {
    initGame() {
      this.frame.loadAssets(this.assets, this.path);
      this.frame.on("complete", () => {
        var borders = {x:-200, y:0, width:2500, height:610}
		this.physics = new zim.Physics(frame, borders)
		
		let _clouds = this.frame.asset("clouds.png");
		_clouds.y = 200;
        _clouds.width = 750;
        this.backgroundLayer.addChild(_clouds);
        
        this.objectLayer = new zim.Container();

		this.buttonarea = new zim.Container(0, 0, 500, 1000);
		this.buttonarea.x = 0;
		this.buttonarea.y = 0;
		this.panelLayer.addChild(this.buttonarea);
		
		for(let i = 0; i < 2; i ++)
		{
			this.brickfloor[i] = new zim.Sprite({json: this.frame.asset("brick-floor.json")});
			this.brickfloor[i].width = 780;
			this.brickfloor[i].x = i * 780;
			this.brickfloor[i].y = 600;
			this.contentLayer.addChild(this.brickfloor[i]);
		}		

	//	this.resetCat();
		
		this.monster = new zim.Sprite({json: this.frame.asset("monster.json")});
		this.monster.gotoAndPlay("move");
		this.monster.scale = 1.8;
		this.monster.x = -100;
		this.monster.y = 390;
		this.contentLayer.addChild(this.monster);
		this.block = new zim.Container();
		let _block = new zim.Sprite({json: this.frame.asset("block.json")});
		let _block1 = new zim.Sprite({json: this.frame.asset("block.json")});
		let _block2 = new zim.Sprite({json: this.frame.asset("block.json")});
		_block.scale = 0.8;
		_block1.scale = 0.8;
		_block2.scale = 0.8;
		_block1.y = 40;
		_block2.y = 80;
		this.block.addChild(_block);
		this.block.addChild(_block1);
		this.block.addChild(_block2);
		this.block.centerReg();
		this.block.y = 600;
		this.block.x = this.blockpos;
		this.contentLayer.addChild(this.block);
		this.blockBody = this.physics.makeRectangle(this.block.width, this.block.height, true, .2);
	
		this.blockBody.x = this.blockpos;
		this.blockBody.y = 600;

		this.physics.addMap(this.blockBody, this.block);
		
		zim.Ticker.add(event => {
			this.moving();
		}, this.stage);
        this.stage.update();
      });
    },
    createButton () {
      	this.optionContainers = [];
		this.buttonarea.removeAllChildren();
		for (let i = 0; i < 3; i++) {

			let _optionBg;
			if(i == 0) _optionBg = this.frame.asset("button1.png");
			else if(i == 1) _optionBg = this.frame.asset("button2.png");
			else _optionBg = this.frame.asset("button3.png");
			_optionBg.scale = 0.8;
			let _optionContainer = new zim.Container(25 ,0 , _optionBg.width, _optionBg.height * 0.8);
			
			_optionContainer.bg = _optionBg;

			_optionContainer.y = 400 + 100 * i;
			_optionContainer.displayWidth = _optionBg.width;
			this.buttonarea.addChild(_optionContainer);
			
			this.optionContainers[i] = _optionContainer;
			_optionContainer.on('click', () => {
				if(this.catBody.y < 554) return;
				//
				if(this.checking) return;
				if(this.optionContainers[i].correct)
				{
					this.catBody.ApplyImpulse(new b2Vec2(0, -200), this.catBody.GetWorldCenter());
				}
				else
				{
					this.checking = true;
					this.movingstop = true;
				//	this.monster.x = 40;
					this.monster.gotoAndPlay("catch");
					this.physics.removeMap(this.catBody);
					this.physics.remove(this.catBody);	
					this.contentLayer.removeChild(this.cat);
					this.handleWrong();
					if (this.noOfLifeRemained > 0) {
						setTimeout(() => {
						this.showNextQuestion();
						}, this.waitForNext);
					}
				}
				this.stage.update();
     		})
		}
		this.setOptionContent({ alpha: 0.8, shiftY: 0.1, color: "white"});
	},
	moving(){
		if(!this.gameStarted) return;
		if(this.movingstop) return;
		this.blockBody.SetAwake(true);
		this.blockBody.SetLinearVelocity(new b2Vec2(-3, 0));

		if(this.cat.hitTestBounds(this.block))
		{
			this.checking = true;
			this.movingstop = true;
		//	this.monster.x = 40;
			let caty = this.cat.y;
			this.monster.gotoAndPlay("catch");
			this.physics.removeMap(this.catBody);
			this.physics.remove(this.catBody);	
			this.contentLayer.removeChild(this.cat);
			this.handleWrong();
			console.log(caty);
			if(caty > 550)
				this.blockBody.ApplyImpulse(new b2Vec2(20, -30), this.blockBody.GetWorldCenter());
			else
				this.blockBody.ApplyImpulse(new b2Vec2(15, -5), new b2Vec2(0.1, 0.1));
			if (this.noOfLifeRemained > 0) {
				setTimeout(() => {
				this.showNextQuestion();
				}, this.waitForNext);
			}
		}

		if(this.block.x < 100)
		{
			this.handleCorrect();
			this.resetblock();
	  		this.setQuestion();
			this.createButton();
			this.checked = false;
			this.checking = false;
		}
		if(this.blockBody.x < -100) {
			this.resetblock();
	  		this.setQuestion();
			this.createButton();
			this.checked = false;
			this.checking = false;
		}
		for(let i = 0; i < 2; i ++)
		{
			this.brickfloor[i].x -= 2;
			if(this.brickfloor[i].x == 780 * (i - 1))
				this.brickfloor[i].x = 780 * i;
		}
	},
	resetblock(){
		this.physics.removeMap(this.blockBody);
		this.physics.remove(this.blockBody);	
		this.blockBody = this.physics.makeRectangle(this.block.width, this.block.height, true, .2);
	
		this.blockBody.x = this.blockpos;
		this.blockBody.y = 600;

		this.physics.addMap(this.blockBody, this.block);
	},
	resetCat(){
		this.contentLayer.removeChild(this.cat);
		this.cat = this.getCat();
		this.cat.gotoAndPlay("move");
		this.cat.scale = 0.5;
		this.cat.x = 280;
		this.cat.y = 50;
		this.cat.centerReg();
		this.contentLayer.addChild(this.cat);
		this.catBody = this.physics.makeRectangle(this.cat.width, this.cat.height, true, .2);
	
		this.catBody.x = 280;
		this.catBody.y = this.cat.y;

		this.physics.addMap(this.catBody, this.cat);
	},
	getCat(){
		return new zim.Sprite({
			image: this.frame.asset("Cat-sprites.png"),
			cols:10,
			rows:1,
			animations:{
				move: [0, 3, 'move', 0.05],
          		crash: { frames: [9]},
			}
      	})
	},
  	initObjects() {
		  console.log("A");
		this.resetblock();
		this.monster.x = -80;
		this.checking = false;
		this.checked = false;
		this.movingstop = false;
		this.createButton();
		this.monster.gotoAndPlay("move");
		this.resetCat();
		this.stage.update();
	},
    showNextQuestion() {
	  this.initObjects();
	  this.setQuestion();
    },
    startGame() {
      this.showNextQuestion();
	},
	checkanswer()
	{
		
	},    
    startGame () {
      this.showNextQuestion()
    }
  },
  mounted() {
    this.initGameShell();
  },
  beforeDestroy() {
    this.cleanUp();
  }
};
</script>