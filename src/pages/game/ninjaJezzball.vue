<template>
  <div style="width: 100%; text-align: center;">
    <div :id="holder + 'Container'"><div :id="holder"></div></div>
  </div>
</template>

<script>
import GameShellMixin from '../../library/mixins/zimGameShell'
export default {
  name: "ninja-jezzball",
  mixins: [GameShellMixin],
  data() {
    return {
      assets: [
		"bg.png",
		"board.png",
		"wood-bottom.png",
		"ninja.png",
		"ninja.json",
		"wood-number.png",
		"wood-number.json",
		"top-blank.png",
		"top-eyeball.png"
      ],
	  path: "statics/game/ninjajezzball/",
	  hero: null,
	  dotline: null,
	  answerarea: null,
	  redcross: null,
	  herodirection: "no",
	  preX: 0,
	  preY: 0,
	  dot: 0,
	  startedborder: "null",
	  xArray:[],
	  yArray:[],
	  pointCnt:0,
	  checking:false,
	  redX: 1,
	  redY: 1,
	  redAngle: 0,
    };
  },
  methods: {
    initGame() {
      this.frame.loadAssets(this.assets, this.path);

      this.frame.on("complete", () => {
        let _background = this.frame.asset("bg.png");
        _background.width = this.width;
        _background.height = this.height;
        this.backgroundLayer.addChild(_background);
        let _board = this.frame.asset("board.png");
		_board.height = this.height - 200;
		_board.x = 100;
		_board.y = 60;
        this.backgroundLayer.addChild(_board);
        let _wbottom = this.frame.asset("wood-bottom.png");
		_wbottom.width = this.width - 450;
		_wbottom.x = 100;
		_wbottom.y = this.height - 100;
        this.backgroundLayer.addChild(_wbottom);

        this.objectLayer = new zim.Container();
		
        this.dotline = new zim.Container(0, 0, _board.width, _board.height);
		this.dotline.x = 100;
		this.dotline.y = 60;
		this.contentLayer.addChild(this.dotline);


        this.answerarea = new zim.Container(0, 0, _board.width, _board.height);
		this.answerarea.x = 100;
		this.answerarea.y = 60;
		this.contentLayer.addChild(this.answerarea);
        this.movingArea = new zim.Container(0, 0, _board.width, _board.height);
		this.movingArea.x = 100;
		this.movingArea.y = 60;
		this.contentLayer.addChild(this.movingArea);
		//this.createAnswers();
        this.createPlatform();
		let _questionContainer = new zim.Container(0, 0, _wbottom.width, _wbottom.height * 0.8);
		_questionContainer.x = 100;
		_questionContainer.y = this.height - 90;
        this.questionContainer = _questionContainer;
        this.questionContainer.displayWidth = _wbottom.width;
		this.backgroundLayer.addChild(_questionContainer);

		zim.Ticker.add(event => {
			this.moving();
		}, this.stage);
        this.stage.update();
      });
    },
    createPlatform() {
		
		let _redcross = this.frame.asset("top-blank.png");
		_redcross.scale = 0.4;
		let _redeye = this.geteye();
		_redeye.gotoAndPlay("anim");
		_redeye.scale = 0.4;
		_redeye.x = _redcross.width / 2 - _redeye.width / 2;
		_redeye.y = _redcross.height / 2 - _redeye.height / 2;
		this.redcross = new zim.Container(0, 0, _redcross.width, _redcross.height);
		this.redcross.regX = _redcross.width / 2;
		this.redcross.regY = _redcross.height / 2;
		this.redcross.x = 400;
		this.redcross.y = 300;
		this.redcross.addChild(_redcross);
		this.redcross.addChild(_redeye);
		this.movingArea.addChild(this.redcross);
		
		this.hero = new zim.Sprite({
        	json: this.frame.asset("ninja.json")
     	});
		this.hero.gotoAndPlay("front");
		this.hero.x = this.movingArea.width / 2;
		this.hero.y = this.movingArea.height + 5;
		this.hero.regX = this.hero.width / 2;
		this.hero.regY = this.hero.height;
		this.hero.scale = 0.6;
		this.movingArea.addChild(this.hero);
	},
	getcover(params){
		for(let i = 0; i < params.index; i++)
		{
			let distance = Math.sqrt(Math.pow(this.optionContainers[i].x - params.x, 2) + Math.pow(this.optionContainers[i].y - params.y, 2));
			if(distance < 100) return true;
		}
		return false;
	},
	createAnswers(){
		this.optionContainers = [];
		this.answerarea.removeAllChildren();
		for (let i = 0; i < this.currentOptions.length; i++) {

			let _optionBg = new zim.Sprite({json: this.frame.asset("wood-number.json")});
			_optionBg.scale = 0.8;
			_optionBg.gotoAndPlay('box');
			let _optionContainer = new zim.Container(0 ,0 , _optionBg.width, _optionBg.height);
			_optionContainer.bg = _optionBg;
			_optionContainer.x = _optionBg.width + Math.random() * (this.answerarea.width - _optionBg.width * 2);
			_optionContainer.y = _optionBg.height + Math.random() * (this.answerarea.height - _optionBg.height * 2);
			if(this.getcover({index:i, x:_optionContainer.x, y:_optionContainer.y}))
			{
				i --;
				continue;
			}
			_optionContainer.regX = _optionBg.width / 2;
			_optionContainer.regY = _optionBg.height / 2;
			
			_optionContainer.displayWidth = _optionBg.width - 10;
			this.answerarea.addChild(_optionContainer);
		//	this.answerarea.addChild(_optionBg);
			this.optionContainers[i] = _optionContainer;
		}
		this.setOptionContent({ alpha: 0.8 });		
	},
	geteye(){
		return new zim.Sprite({
        image: this.frame.asset("top-eyeball.png"),
        cols:5,
        rows:2,
        animations:{
          anim: [0, 8, 'anim', 0.05]          
        }
      })
	},
	getcheck()
	{
		let min = 9999;
		for(let i = 0; i < this.pointCnt; i ++)
		{
			let distance = Math.sqrt(Math.pow(this.xArray[i] - this.redcross.x, 2) + Math.pow(this.yArray[i] - this.redcross.y, 2));
			if(distance < min)
				min = distance;
		}
		if(min < 28) return true;
		return false;
	},
	moving(){
		if(!this.gameStarted) return;
		if(this.checking) return;

		this.redAngle += 4;
		if(this.redAngle >= 360) this.redAngle -= 360;
		this.redcross.rotation = this.redAngle;
		if(this.getcheck())
		{
			this.pointCnt = 0;
			this.handleWrong();
			this.checking = true;
			if (this.noOfLifeRemained > 0) {
				setTimeout(() => {
				this.showNextQuestion();
				}, this.waitForNext);
			}
			return;
		}
		this.redcross.x += this.redX * 1;
		this.redcross.y += this.redY * 1;
		if(this.redcross.x >= 540 || this.redcross.x < 30)	this.redX *= -1;
		if(this.redcross.y >= 540 || this.redcross.y < 30)	this.redY *= -1;
		
		if(this.herodirection == "no") return;
		if(this.hero.x <= -30 && this.herodirection == "left")
		{
			this.herodirection = "no";
			this.hero.gotoAndPlay("left");
			return;
		}
		if(this.hero.x >= 580 && this.herodirection == "right")
		{
			this.herodirection = "no";
			this.hero.gotoAndPlay("right");
			this.dotline.removeAllChildren();
			return;
		}
		if(this.hero.y <= -1 && this.herodirection == "up")
		{
			this.herodirection = "no";
			this.hero.gotoAndPlay("back");
			return;
		}
		if(this.hero.y > 570 && this.herodirection == "down")
		{
			this.herodirection = "no";
			this.hero.gotoAndPlay("front");
			return;
		}
		if(this.hero.y > 568 || this.hero.y <= 1 || this.hero.x < 1 || this.hero.x > 563){
			if(this.startedborder != "null")
			{
				if(this.startedborder == "left")
				{
					if(this.hero.y > 568){
						this.xArray[this.pointCnt] = 0;
						this.yArray[this.pointCnt++] = 568;
					}
					else if(this.hero.y <= 1){
						this.xArray[this.pointCnt] = 0;
						this.yArray[this.pointCnt++] = 0;
					}
					if(this.hero.x > 563){
						if(this.hero.y < 568 / 2){
							this.xArray[this.pointCnt] = 563;
							this.yArray[this.pointCnt++] = 0;
							this.xArray[this.pointCnt] = 0;
							this.yArray[this.pointCnt++] = 0;
						}else{
							this.xArray[this.pointCnt] = 563;
							this.yArray[this.pointCnt++] = 565;
							this.xArray[this.pointCnt] = 0;
							this.yArray[this.pointCnt++] = 565;
						}
					}
				}
				if(this.startedborder == "right")
				{
					if(this.hero.y > 568){
						this.xArray[this.pointCnt] = 563;
						this.yArray[this.pointCnt++] = 568;
					}
					else if(this.hero.y <= 1){
						this.xArray[this.pointCnt] = 563;
						this.yArray[this.pointCnt++] = 0;
					}
					if(this.hero.x < 1){
						if(this.hero.y < 568 / 2){
							this.xArray[this.pointCnt] = 0;
							this.yArray[this.pointCnt++] = 0;
							this.xArray[this.pointCnt] = 563;
							this.yArray[this.pointCnt++] = 0;
						}else{
							this.xArray[this.pointCnt] = 0;
							this.yArray[this.pointCnt++] = 565;
							this.xArray[this.pointCnt] = 563;
							this.yArray[this.pointCnt++] = 565;
						}
					}
				}
				if(this.startedborder == "top")
				{
					if(this.hero.x > 563){
						this.xArray[this.pointCnt] = 563;
						this.yArray[this.pointCnt++] = 0;
					}
					else if(this.hero.x < 1){
						this.xArray[this.pointCnt] = 0;
						this.yArray[this.pointCnt++] = 0;
					}
					if(this.hero.y > 568){
						if(this.hero.x < 563 / 2){
							this.xArray[this.pointCnt] = 0;
							this.yArray[this.pointCnt++] = 565;
							this.xArray[this.pointCnt] = 0;
							this.yArray[this.pointCnt++] = 0;
						}else{
							this.xArray[this.pointCnt] = 563;
							this.yArray[this.pointCnt++] = 565;
							this.xArray[this.pointCnt] = 563;
							this.yArray[this.pointCnt++] = 0;
						}
					}
				}
				if(this.startedborder == "bottom")
				{
					if(this.hero.x > 563){
						this.xArray[this.pointCnt] = 563;
						this.yArray[this.pointCnt++] = 565;
					}
					else if(this.hero.x < 1){
						this.xArray[this.pointCnt] = 0;
						this.yArray[this.pointCnt++] = 565;
					}
					if(this.hero.y <= 1){
						if(this.hero.x < 563 / 2){
							this.xArray[this.pointCnt] = 0;
							this.yArray[this.pointCnt++] = 0;
							this.xArray[this.pointCnt] = 0;
							this.yArray[this.pointCnt++] = 565;
						}else{
							this.xArray[this.pointCnt] = 563;
							this.yArray[this.pointCnt++] = 0;
							this.xArray[this.pointCnt] = 563;
							this.yArray[this.pointCnt++] = 565;
						}
					}
				}
				this.checkanswer();
			}
			this.startedborder = "null";
			this.dotline.removeAllChildren();
		}
		switch(this.herodirection)
		{
		case "left":this.hero.x -= 2;break;
		case "right":this.hero.x += 2;break;
		case "down":this.hero.y += 2;break;
		case "up":this.hero.y -= 2;break;
		}
		this.dot ++;
		if(this.dot == 2) this.dot = 0;
		if(this.preX > 0 && this.preY < 568 && this.preX < 563 && this.preY > 1 && this.dot == 1)
		{
			this.xArray[this.pointCnt] = this.preX;
			this.yArray[this.pointCnt] = this.preY;
			this.pointCnt ++;
			if(this.startedborder == "null")
			{
				if(this.herodirection == "left") this.startedborder = "right";
				if(this.herodirection == "right") this.startedborder = "left";
				if(this.herodirection == "down") this.startedborder = "top";
				if(this.herodirection == "up") this.startedborder = "bottom";
				this.xArray = [];
				this.yArray = [];
				this.pointCnt = 0;
			}
			let _dotline = new zim.Shape();
			_dotline.graphics.setStrokeStyle(1).beginStroke("#000000").moveTo(this.preX, this.preY).lineTo(this.hero.x, this.hero.y).closePath();
			this.dotline.addChild(_dotline);
		}
		this.preX = this.hero.x;
		this.preY = this.hero.y;
	},
  	initObjects() {
		this.dotline.removeAllChildren();
		this.checking = false;
		this.answerarea.removeAllChildren();
		this.createAnswers();
		this.hero.x = this.movingArea.width / 2;
		this.hero.y = this.movingArea.height + 5;
	},
    showNextQuestion() {
	  this.initObjects();
	  this.setQuestion();
    },
    startGame() {
      this.showNextQuestion();
	},
	pointInPolygon (params){
		let xi, yi, xj, yj, i, intersect,
            x = params.x,
            y = params.y,
            inside = false;
        for (let i = 0, j = this.pointCnt - 1; i < this.pointCnt; j = i++) {
          xi = this.xArray[i];
          yi = this.yArray[i];
          xj = this.xArray[j];
          yj = this.yArray[j];
          intersect = ((yi > y) != (yj > y))
              && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
          if (intersect) inside = !inside;
        }
        return inside;
	},
	checkanswer()
	{
		this.checking = true;
		let fcnt = 0;
		let index = -1;
		for(let i = 0; i < this.optionContainers.length; i ++)
		{
			if(this.pointInPolygon({x:this.optionContainers[i].x + 5, y:this.optionContainers[i].y + 5}))
			{
				fcnt ++;
				index = i;
				let _rect = new zim.Shape();
				if(this.optionContainers[i].correct)
					_rect.graphics.setStrokeStyle(1).beginStroke("rgba(255, 255, 255, 0)").beginFill("rgba(0, 255, 0, 0.5)").rect(0, 0, this.optionContainers[i].width, this.optionContainers[i].height + 10).closePath();
				else
					_rect.graphics.setStrokeStyle(1).beginStroke("rgba(255, 255, 255, 0)").beginFill("rgba(255, 0, 0, 0.5)").rect(0, 0, this.optionContainers[i].width, this.optionContainers[i].height + 10).closePath();
      			this.optionContainers[i].addChild(_rect)
        		this.stage.update();				
			}
		}
		this.pointCnt = 0;
		if(fcnt == 0)
		{
			this.checking = false;
			return;
		}
		if(fcnt == 1 && this.optionContainers[index].correct)
			this.handleCorrect();
		else
			this.handleWrong();
		if (this.noOfLifeRemained > 0) {
			setTimeout(() => {
			this.showNextQuestion();
			}, this.waitForNext);
		}
	},
    moveLeftStart () { 
		if(this.herodirection == "no")
			this.hero.gotoAndPlay("moveleft");
		this.herodirection = "left";
		this.preX = this.hero.x;
		this.preY = this.hero.y;
    },
    moveLeftStop () { 
		this.herodirection = "no";
		this.hero.gotoAndPlay("left");
	},
    moveRightStart () { 
		if(this.herodirection == "no")
			this.hero.gotoAndPlay("moveright");
		this.herodirection = "right";
		this.preX = this.hero.x;
		this.preY = this.hero.y;
    },
    moveRightStop () { 
		this.herodirection = "no";
		this.hero.gotoAndPlay("right");
	},
    moveUpStart () { 
		if(this.herodirection == "no")
			this.hero.gotoAndPlay("moveup");
		this.herodirection = "up";
		this.preX = this.hero.x;
		this.preY = this.hero.y;
    },
    moveUpStop () { 
		this.herodirection = "no";
		this.hero.gotoAndPlay("back");
	},
    moveDownStart () { 
		if(this.herodirection == "no")
			this.hero.gotoAndPlay("movedown");
		this.herodirection = "down";
		this.preX = this.hero.x;
		this.preY = this.hero.y;
    },
    moveDownStop () { 
		this.herodirection = "no";
		this.hero.gotoAndPlay("front");
	},
    startGame () {
      this.showNextQuestion()
    }
  },
  mounted() {
    this.initGameShell({ arrowControl: true })
  },
  beforeDestroy() {
    this.cleanUp();
  }
};
</script>