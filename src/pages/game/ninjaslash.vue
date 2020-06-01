<template>
  <div style="width: 100%; text-align: center;">
    <div :id="holder + 'Container'"><div :id="holder"></div></div>
  </div>
</template>

<script>
import GameShellMixin from '../../library/mixins/zimGameShell'
export default {
  name: "ninja-slash",
  mixins: [GameShellMixin],
  data() {
    return {
      assets: [
		"background.png",
		"wall-side.png",
		"wall-side.json",
		"question-bg.png",
		"button-slash.png",
		"button-jump.png",
		"ninja.png",
		"blade.png",
		"blade.json",
		"answer-paper.png",
		"answer-paper.json",
		"spike1.png",
		"spike1.json",
		"spike2.png",
		"spike2.json",
      ],
	  path: "statics/game/ninjaslash/",
	  leftwall: [],
	  rightwall: [],
	  hero: null,
	  answerarea: null,
	  blockarea: null,
	  heropos: "right",
	  movecnt: 0,
	  block:[],
	  blocktype:[],
	  blockhits:[],
	  slashed:"null",
	  yPos : -1580,
	  speed : 0,
	  slashcnt: 0,
	  slashcheck:-1,
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
		
		this.blockarea = new zim.Container(0, 0, _background.width, _background.height);
		this.blockarea.x = 0;
		this.blockarea.y = 0;
		this.contentLayer.addChild(this.blockarea);
		this.createblocks();
				
		for(let i = 0; i < 3; i ++)
		{
			this.leftwall[i] = new zim.Sprite({
        		json: this.frame.asset("wall-side.json")
			});
			this.leftwall[i].y = this.height / 2 * (i - 1);
			this.leftwall[i].height = this.height / 2;
			   this.contentLayer.addChild(this.leftwall[i]);
			   
			this.rightwall[i] = new zim.Sprite({
        		json: this.frame.asset("wall-side.json")
			});
			this.rightwall[i].x = 580;
			this.rightwall[i].y = this.height / 2 * (i - 1);
			this.rightwall[i].height = this.height / 2;
       		this.contentLayer.addChild(this.rightwall[i]);
		}
		this.answerarea = new zim.Container(0, 0, _background.width, _background.height);
		this.answerarea.x = 0;
		this.answerarea.y = 0;
		this.contentLayer.addChild(this.answerarea);
		
		let _wbottom = this.frame.asset("question-bg.png");
		_wbottom.width = 300;
		_wbottom.x = 200;
		_wbottom.y = this.height - 100;
        this.backgroundLayer.addChild(_wbottom);
		let _questionContainer = new zim.Container(0, 0, _wbottom.width, _wbottom.height * 0.8);
		_questionContainer.x = 200;
		_questionContainer.y = this.height - 90;
		_questionContainer.color = zim.white;
		this.questionContainer = _questionContainer;
        this.questionContainer.displayWidth = _wbottom.width;
		this.backgroundLayer.addChild(_questionContainer);
		
		this.createAnswers();
		this.createhero();
		///create button///
		let _slashbutton = this.frame.asset("button-slash.png");
		_slashbutton.scale = 0.7;
        _slashbutton.y = this.height - 220;
		_slashbutton.on('click', () => {
			if(!this.gameStarted) return;
			if(this.noOfLifeRemained == 0) return;
			if(this.slashcnt != 0) return;
			this.slashcnt = 20;
			this.slashhero();
      	})
		this.panelLayer.addChild(_slashbutton);
		let _jumpbutton = this.frame.asset("button-jump.png");
		_jumpbutton.scale = 0.7;
		_jumpbutton.y = this.height - 120;
		_jumpbutton.on('click', () => {
			if(!this.gameStarted) return;
			if(this.noOfLifeRemained == 0) return;
			if(this.hero.y < 30) return;
			if(this.heropos == "right")
			{
				this.movecnt = 10;
				this.heropos = "jumpingleft";
				this.hero.gotoAndPlay("pjumpleft");
			}
			if(this.heropos == "left")
			{
				this.movecnt = 10;
				this.heropos = "jumpingright";
				this.hero.gotoAndPlay("pjumpright");
			}	
      	})
		this.panelLayer.addChild(_jumpbutton);

		zim.Ticker.add(event => {
			this.moving();
		}, this.stage);
        this.stage.update();
      });
	},
	createblocks(){
		this.blockarea.removeAllChildren();
		for(let i = 0; i < 3; i ++){
			let rand = Math.random() * 10;
			this.blocktype[i] = 1;
			if(rand < 3.3)
			{
				this.block[i] = new zim.Sprite({
					json: this.frame.asset("spike2.json")
				});
			}
			else if(rand > 6.6)
			{
				this.block[i] = new zim.Sprite({
					json: this.frame.asset("spike2.json")
				});
			}else{				
				this.blocktype[i] = 0;
				this.block[i] = new zim.Sprite({
					json: this.frame.asset("blade.json")
				});
			}
			//this.block[i].scale = 0.15;
			this.block[i].gotoAndPlay("blade");
			this.block[i].centerReg();
			this.block[i].height = 95.7;
			
			if(Math.random() * 10 > 5)
			{
				if(this.blocktype[i] == 1)
				{
					this.block[i].rotation = 180;
					this.block[i].x = 105;
				}
				else
					this.block[i].x = 88;
			}
			else{
				if(this.blocktype[i] == 1)
					this.block[i].x = 565;
				else
					this.block[i].x = 583;
			}
			this.block[i].y = -300 - i * 500;
			
			this.blockarea.addChild(this.block[i]);
		}
	},
	createAnswers(){
		this.optionContainers = [];
		this.answerarea.removeAllChildren();
		for (let i = 0; i < this.currentOptions.length; i++) {

			let _optionBg = new zim.Sprite({json: this.frame.asset("answer-paper.json")});
			_optionBg.scale = 0.15;
			_optionBg.gotoAndPlay('paper');
			let _optionContainer = new zim.Container(0 ,0 , _optionBg.width, _optionBg.height * 0.8);
			_optionContainer.bg = _optionBg;
			if(Math.random() * 10 > 5)
				_optionContainer.x = 5;
			else
				_optionContainer.x = 585;
			_optionContainer.y = -580 - i * 500;
			
			_optionContainer.displayWidth = _optionBg.width - 10;
			this.answerarea.addChild(_optionContainer);
			_optionContainer.outline()
		//	this.answerarea.addChild(_optionBg);
			this.optionContainers[i] = _optionContainer;
		}
		this.setOptionContent({ alpha: 0.8, shiftY: 0.1});
	},
    createhero() {
		this.hero = this.gethero();
		this.hero.gotoAndPlay("idleright");
		this.hero.scale = 0.15;
		this.hero.x = 485;
		this.hero.y = this.height - 300;
		this.contentLayer.addChild(this.hero);
	},
	gethero(){
		return new zim.Sprite({
			image: this.frame.asset("ninja.png"),
			cols:7,
			rows:4,
			animations:{
          		idleleft: { frames: [19]},
          		idleright: { frames: [5]},
				slashleft: [20, 25, 'idleleft', 0.1],
				slashright: [6, 11, 'idleright', 0.1],
				pjumpleft: { frames: [13], "next": "jumpingleft", "speed": 0.1},
				pjumpright: { frames: [27], "next": "jumpingright", "speed": 0.1},
				jumpingleft: [14, 18, 'idleleft', 1],
				jumpingright: [0, 5, 'idleright', 1],
			}
      	})
	},
	slashhero(){
		if(this.heropos == "right")
		{
			this.hero.gotoAndPlay("slashright");
		}
		if(this.heropos == "left")
		{
			this.hero.gotoAndPlay("slashleft");
		}
		if(this.slashed != "null") return;
		for(let i = 0; i < 3; i ++)
		{
			console.log(this.optionContainers[i].y + ":" + this.hero.y);
			if(this.optionContainers[i].x < 300 && this.hero.x > 300) continue;
			if(this.optionContainers[i].x > 300 && this.hero.x < 300) continue;
			if((this.optionContainers[i].y - this.hero.y < this.hero.height - 30 && this.optionContainers[i].y - this.hero.y > 0) ||
			(this.hero.y - this.optionContainers[i].y < this.optionContainers[i].height - 10 && this.hero.y - this.optionContainers[i].y> 0))
			{
				if(this.optionContainers[i].correct)
				{
					this.slashed = "correct";
				}
				else
				{
					this.slashed = "wrong";
				}
				this.slashcheck = i;	
				break;
			}			
		}
		this.stage.update();
	},
	moving(){
		if(!this.gameStarted) return;
		if(this.noOfLifeRemained == 0) return;
		if(this.slashcnt)
		{
			this.slashcnt --;
			if(this.slashcnt == 0 && this.slashed != "null" && this.slashcheck != -1 )
			{
				let j = this.slashcheck;
				let _rect = new zim.Shape();
				if(this.optionContainers[j].correct)
					_rect.graphics.setStrokeStyle(1).beginStroke("rgba(255, 255, 255, 0)").beginFill("rgba(0, 255, 0, 0.5)").rect(0, 0, this.optionContainers[j].width, this.optionContainers[j].height + 10).closePath();
				else
					_rect.graphics.setStrokeStyle(1).beginStroke("rgba(255, 255, 255, 0)").beginFill("rgba(255, 0, 0, 0.5)").rect(0, 0, this.optionContainers[j].width, this.optionContainers[j].height + 10).closePath();
				this.optionContainers[j].addChild(_rect);
				if(this.slashed == "correct") this.handleCorrect();
				else this.handleWrong();
				this.slashcheck = -1;
			}
		}
		this.yPos += this.speed * 2;
		if(this.yPos > 760)
		{
			if(this.slashed == "null")
				this.handleWrong();
			this.showNextQuestion();			
		}
		for(let i = 0; i < 3; i ++)
		{
			this.block[i].y += this.speed * 2;
			if(this.blocktype[i] != 0) continue;
			if(this.block[i].x == 88)
				this.block[i].rotation += 2;
			else
				this.block[i].rotation -= 2;
			if(this.block[i].rotation >= 360) this.block[i].rotation -= 360;
			if(this.block[i].rotation < 0) this.block[i].rotation += 360;
		}
		for(let i = 0; i < 3; i ++)
		{
			this.leftwall[i].y += this.speed;
			this.rightwall[i].y += this.speed;
		}
		for(let i = 0; i < 3; i ++)
		{
			this.optionContainers[i].y += this.speed * 2;
		}
		if(this.leftwall[0].y == 0)
		{
			for(let i = 0; i < 3; i ++)
			{
				this.leftwall[i].y = this.height / 2 * (i - 1);
				this.rightwall[i].y = this.height / 2 * (i - 1);
			}
		}
		if(this.movecnt)
		{
			if(this.heropos == "jumpingleft")
				this.hero.x -= 44.5;
			if(this.heropos == "jumpingright")
				this.hero.x += 44.5;
			this.movecnt --;
			if(this.movecnt == 0 && this.heropos == "jumpingleft")
				this.heropos = "left";
			if(this.movecnt == 0 && this.heropos == "jumpingright")
				this.heropos = "right";
			this.hero.y -= 10;
		}
		else
			this.hero.y += this.speed;
		if(this.hero.y > 760)
		{
			this.handleWrong();
			if (this.noOfLifeRemained > 0) {
				setTimeout(() => {
				this.showNextQuestion();
				}, this.waitForNext);
			}
			this.hero.x = 485;
			this.hero.y = this.height - 300;
			this.heropos = "right";
			this.hero.gotoAndPlay("idleright");
			this.gameStarted = false;
		}
		for(let i = 0; i < 3; i ++)
		{
			if(this.blockhits[i] != 0) continue;
			if((this.hero.x == 40 && this.block[i].x < 300) || (this.hero.x == 485 && this.block[i].x > 300))
			{
				if((this.hero.y - this.block[i].y < this.block[i].height / 2 - 30 && this.hero.y - this.block[i].y > 0) || 
				(this.block[i].y - this.hero.y < this.hero.height + this.block[i].height / 2 - 50  && this.block[i].y - this.hero.y > 0))
				{
					this.blockhits[i] = 1;
					console.log("A" + i + ' ' + this.blockhits[i]);
					this.handleWrong();
				}
			}
		}
	},
  	initObjects() {
		for(let i = 0; i < 3; i ++)
			this.blockhits[i] = 0;
		this.slashed = "null";
		this.speed = 1;
		this.createAnswers();
		this.createblocks();
		this.gameStarted = true;
		this.yPos = -1580;
	},
    showNextQuestion() {
	  this.initObjects();
	  this.setQuestion({ color: 'white' });
    },
    startGame() {
      this.showNextQuestion();
	},
	checkanswer()
	{		
		if (this.noOfLifeRemained > 0) {
			setTimeout(() => {
			this.showNextQuestion();
			}, this.waitForNext);
		}
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