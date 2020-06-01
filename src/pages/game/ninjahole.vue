<template>
  <div style="width: 100%; text-align: center;">
    <div :id="holder + 'Container'"><div :id="holder"></div></div>
  </div>
</template>

<script>
import GameShellMixin from '../../library/mixins/zimGameShell'
export default {
  name: "ninja-hole",
  mixins: [GameShellMixin],
  data() {
    return {
      assets: [
		"background.png",
		"ninja-direction.png",
		"ninja-direction.json",
		"ninja.png"
      ],
	  path: "statics/game/ninja-hole/",
	  question: null,
	  compass: null,
	  butarea: null,
	  holearea : null,
	  questiontxt : ['NorthWest', 'NORTH', 'NorthEast', 'EAST', 'SouthEast', 'SOUTH', 'SouthWest', 'WEST'],
	  questionid : 0,
	  butname: ['button-top-left', 'button-top', 'button-top-right', 'button-right', 'button-bot-right', 'button-bottom', 'button-bot-left', 'button-left'],
	  butx : [0, 60, 120, 120, 120, 60, 0, 0],
	  buty : [0, 0, 0, 60, 120, 120, 120, 60],
	  posx : [70, 230, 390, 390, 390, 230, 70, 70],
	  posy : [50, 50, 50, 210, 370, 370, 370, 210],
	  angle : 0,
	  hero : null,
	  targetX: 0,
	  targetY: 0,
	  heroXY: '',
	  herodirection: 'down',
	  checking: 0,
	  holes:[],
	  selid: 0,
	  holeindex: [0, 1, 2, 5, 8, 7, 6, 3],
	  timeleft: 960,
	  timearea: null,
	  stepy: 0,
	  clicked: false,
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
		
		let _qback = new zim.Sprite({
        	json: this.frame.asset("ninja-direction.json")
		});
		_qback.gotoAndPlay("direction-box");
		_qback.x = 30;
		_qback.y = 10;
		_qback.scale = 0.8;
		this.contentLayer.addChild(_qback);

		this.compass = new zim.Sprite({
        	json: this.frame.asset("ninja-direction.json")
		});
		this.compass.gotoAndPlay("compass");
		this.compass.centerReg();
		this.compass.x = 650;
		this.compass.y = 80;
		this.compass.scale = 0.8;
		//this.compass.rotation = 80;
		this.contentLayer.addChild(this.compass);

		this.butarea = new zim.Container(0 , 0 , 200, 200);
		this.butarea.x = 30;
		this.butarea.y = 500;
		this.panelLayer.addChild(this.butarea);

		this.holearea = new zim.Container(0 , 0 , 500, 500);
		this.holearea.x = 150;
		this.holearea.y = 200;
		this.contentLayer.addChild(this.holearea);

		let _tback = new zim.Sprite({
        	json: this.frame.asset("ninja-direction.json")
		});
		_tback.gotoAndPlay("timer-box");
		_tback.x = 10;
		_tback.y = 250;
		_tback.scale = 0.7;
		this.panelLayer.addChild(_tback);
		
		zim.Ticker.add(event => {
			this.move();
		}, this.stage);
        this.stage.update();
      });
	},
	move(){
		if(!this.gameStarted) return;		
		if(this.checking > 0)
		{
			if(this.checking > 1)
			{
				if(this.checking == 100)
				{
					let selid = this.questionid;
					if(this.currentQuestion.noOfDirection == 4)
						selid += this.angle * 2;
					else
						selid += this.angle;
					if(selid > 8) selid -= 8;
					for(let i = 0; i < 9; i ++)
					{
						if(this.holeindex[selid] != i)
							this.holes[i].gotoAndPlay('hole');
					}
				}
				this.checking --;
				this.hero.scale = this.checking / 200;
				if(this.checking == 1)
				{
					this.handleWrong();
					if (this.noOfLifeRemained > 0) {
						setTimeout(() => {
							this.showNextQuestion();
						}, this.waitForNext);
					}
					this.checking = 0;
				}
				this.stage.update();
				return;
			}
			for(let i = 0; i < 9; i ++)
			{
				if(this.holeindex[this.selid] != i)
					this.holes[i].gotoAndPlay('hole');
			}
			this.handleCorrect();
			setTimeout(() => {
				this.showNextQuestion();
			}, this.waitForNext);
			this.checking = 0;
			this.stage.update();
		}
		if(this.checking == 0) return;
		if(this.timeleft < 59)
		{
			this.checking = 100;
		}
		if(this.hero.x == this.targetX && this.hero.y == this.targetY)
			this.timeshow();
		if(this.hero.x != this.targetX)
		{
			if(this.hero.x < this.targetX)
			{
				this.hero.x += 2;
				if(this.hero.x > this.targetX) this.hero.x = this.targetX;
			}
			else
			{
				this.hero.x -= 2;
				if(this.hero.x < this.targetX) this.hero.x = this.targetX;
			//	this.heroXY = 'x';
			}
		//	return;
		}
		if(this.hero.y < this.targetY)
		{
			this.hero.y += this.stepy;
			this.herodirection = 'down';
			if(this.hero.y > this.targetY) this.hero.y = this.targetY;
			return;
		}
		if(this.hero.y > this.targetY)
		{
			this.hero.y -= this.stepy;
			this.herodirection = 'up';
			if(this.hero.y < this.targetY) this.hero.y = this.targetY;
			return;
		}
		if(this.hero.x != this.targetX) return;
		if(this.herodirection == 'up')
			this.hero.gotoAndPlay('idleup');
		else
			this.hero.gotoAndPlay('idledown');
		let i;
		for(i = 0; i < 8; i ++)
		{
			if(this.hero.x == this.posx[i] && this.hero.y == this.posy[i])
				break;
		}
		this.selid = i;
		if(this.currentQuestion.noOfDirection == 4)
			i -= this.angle * 2;
		else
		    i -= this.angle;
		if(i < 0) i += 8;
		if(i == this.questionid)
		{
			this.checking = 1;		
			console.log("A");	
		}
		else if(!(this.targetX == 230 && this.targetY == 210))
		{
			this.checking = 100;
		}	
	},
	timeshow(){
		this.timeleft --;
		this.panelLayer.removeChild(this.timearea);
		let txt;
		if(Math.floor(this.timeleft / 60) > 9)
			txt = "00:" + Math.floor(this.timeleft / 60);
		else
			txt = "00:0" + Math.floor(this.timeleft / 60);
		this.timearea = new zim.Label({
				text: txt,
				size: 40,
				font: 'Comic Sans MS',
				color: 'white',
				align: 'left',
				valign: 'top'
		});
		this.timearea.x = 65;
		this.timearea.y = 270;
		this.panelLayer.addChild(this.timearea);
	},
	createdirectionbut(){
		this.butarea.removeAllChildren();
		this.clicked = false;
		for(let i = 0 ; i < 8; i ++)
		{
			if(this.currentQuestion.noOfDirection == 4 && i % 2 == 0) continue;
			let _but = new zim.Sprite({
        		json: this.frame.asset("ninja-direction.json")
			});
			_but.gotoAndPlay(this.butname[i]);
			_but.x = this.butx[i];
			_but.y = this.buty[i];
			_but.scale = 0.6;
			_but.on('click', () => {
				if(this.checking != -1) return;
				if(this.clicked) return;
				this.clicked = true;
				this.targetX = this.posx[i];
				this.targetY = this.posy[i];
				let xct = (this.targetX - this.hero.x) / 2
				if(xct != 0)
					this.stepy = Math.abs((this.targetY - this.hero.y) / xct);
					
				if(this.targetY > this.hero.y)
				{
					this.hero.gotoAndPlay('down')
					this.herodirection = 'down';
					this.stepy = 2;
				}
				if(this.targetY < this.hero.y)
				{
					this.hero.gotoAndPlay('up')
					this.herodirection = 'up';
					this.stepy = 2;
				}

				if(this.targetX > this.hero.x)
				{
					if(this.herodirection == 'down')
						this.hero.gotoAndPlay('dright')
					else
						this.hero.gotoAndPlay('uright')
				//	this.heroXY = 'x';
					return;
				}
				if(this.targetX < this.hero.x)
				{
					if(this.herodirection == 'down')
						this.hero.gotoAndPlay('dleft')
					else
						this.hero.gotoAndPlay('uleft')
				//	this.heroXY = 'x';
					return;
				}
      		})
			this.butarea.addChild(_but);
			this.stage.update();
		}
	},
	setcompassangle(){
		if(this.currentQuestion.compassRotation)
		{
			this.angle = (Math.floor(Math.random() * 100) % this.currentQuestion.noOfDirection);
		}
		else
			this.angle = 0;
		this.compass.rotation = this.angle  * (360 / this.currentQuestion.noOfDirection);
	},
	makequestion(){
		this.checking = -1;
		this.contentLayer.removeChild(this.question);
		this.questionid = Math.floor(Math.random() * 100) % this.currentQuestion.noOfDirection;
		if(this.currentQuestion.noOfDirection == 4)
			this.questionid = this.questionid * 2 + 1;
		this.question = new zim.Label({
				text: 'GO TO ' + this.questiontxt[this.questionid],
				size: 40,
				font: 'Comic Sans MS',
				color: 'white',
				align: 'center',
				valign: 'center'
		});
		this.question.x = 230;
		this.question.y = 60;
		this.contentLayer.addChild(this.question);
	},
	createholes(){
		this.holearea.removeAllChildren();
		this.holes = [];
		for(let i = 0; i < 9; i ++)
		{
			let _hole = new zim.Sprite({
        		json: this.frame.asset("ninja-direction.json")
			});
			_hole.gotoAndPlay('holestop');
			_hole.x = 160 * (i % 3);
			_hole.y = 160 * Math.floor(i / 3);
			_hole.scale = 0.6;
			this.holearea.addChild(_hole);
			this.holes[i] = _hole;
		}
	},
	createhero(){
		this.hero = this.gethero();
		this.hero.gotoAndPlay('idle');
		this.hero.scale = 0.5;
		this.holearea.addChild(this.hero);
		this.hero.regX = 150;
		this.hero.regY = 200;
		this.hero.x = 230;
		this.hero.y = 210;
		this.targetX = 230;
		this.targetY = 210;
		this.herodirection = 'down';
	},
	gethero(){
		return new zim.Sprite({
			image: this.frame.asset("ninja.png"),
			cols:24,
			rows:1,
			animations:{
				idledown: [3],
				idleup: [7],
          		down : [0, 3, 'down', 0.1],
          		up : [4, 7, 'up', 0.1],
          		dright : [8, 11, 'dright', 0.1],
          		dleft : [12, 15, 'dleft', 0.1],
          		uleft : [16, 19, 'uleft', 0.1],
          		uright : [20, 23, 'uright', 0.1],
			}
      	})
	},
  	initObjects() {
		this.timeleft = 960;
		this.checking = -1;
		this.clicked = false;
		this.createdirectionbut();
		this.setcompassangle();
		this.makequestion();
		this.createholes();
		this.createhero();
		this.stage.update();
	},
    showNextQuestion() {
	  this.initObjects();
    },
    startGame() {
	  this.showNextQuestion();
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