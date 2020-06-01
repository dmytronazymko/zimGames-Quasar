<template>
  <div style="width: 100%; text-align: center;">
    <div :id="holder + 'Container'"><div :id="holder"></div></div>
  </div>
</template>

<script>
import GameShellMixin from '../../library/mixins/zimGameShell'
export default {
  name: "ninja-dart",
  mixins: [GameShellMixin],
  data() {
    return {
      assets: [
		"background.png",
		"board.png",
		"board.json",
		"button-center.png",
		"button-left.png",
		"button-right.png",
		"ninja.png",
		"answer.png",
		"answer.json",
		"circle.json",
		"circle.png",
		"dart.json",
		"dart.png",
      ],
	  path: "statics/game/ninjadart/",
	  questionarea: null,
	  heroarea: null,
	  heros : [],
	  herobody: [],
	  answered: [],
	  direction: [],
	  hanswer: [],
	  currentIndex: 0,
	  circles:[],
	  speeds: []
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
		
		for(let i = 0; i < 3; i ++)
		{
			let _board = new zim.Sprite({json: this.frame.asset("board.json")})
			_board.scale = 0.7;
			_board.x = 50 + i * 230;
			_board.y = 140;
			this.backgroundLayer.addChild(_board);
		}

		let _butleft = this.frame.asset("button-left.png");
		_butleft.scale = 0.4;
		_butleft.x = 5;
		_butleft.y = 550;
		this.panelLayer.addChild(_butleft);
		let _butmiddle = this.frame.asset("button-center.png");
		_butmiddle.scale = 0.4;
		_butmiddle.x = 90;
		_butmiddle.y = 550;
		this.panelLayer.addChild(_butmiddle);
		let _butright = this.frame.asset("button-right.png");
		_butright.scale = 0.4;
		_butright.x = 175;
		_butright.y = 550;
		this.panelLayer.addChild(_butright);

		_butleft.on('click', () => {
			if(!this.gameStarted) return;
			if(this.currentIndex > 2) return;
			if(this.direction[this.currentIndex] == 'left')
				this.herobody[this.currentIndex].gotoAndPlay("shootl");
			else
				this.herobody[this.currentIndex].gotoAndPlay("shootr");
			console.log(this.currentQuestion);
			if(this.currentQuestion[0].answer == this.hanswer[this.currentIndex])
			{
				this.addScore();
			}
			else
			{
				this.deduceLife();
				if (this.noOfLifeRemained > 0) {
					setTimeout(() => {
						//this.showNextQuestion();
					}, this.waitForNext);
				}else{
					this.gameStarted = false;
					for(let j = 0; j < 3; j ++)
						if(this.direction[j] == 'left')
							this.herobody[j].gotoAndPlay("idlel")
						else
							this.herobody[j].gotoAndPlay("idler")
				}
			}
			this.answered[this.currentIndex] = 1;
			this.currentIndex ++;
			if(this.currentIndex < 3)
			{
				let _circle = new zim.Sprite({json: this.frame.asset("circle.json")})
				_circle.scale = 0.6;
				_circle.y = 80;
				this.heros[this.currentIndex].addChild(_circle);
				this.circles[this.currentIndex] = _circle;
				this.heros[this.currentIndex - 1].removeChild(this.circles[this.currentIndex - 1]);
			}
			let _dart = new zim.Sprite({json: this.frame.asset("dart.json")})
			_dart.scale = 0.4;
			_dart.x = 145;
			_dart.y = 210;
			this.heroarea.addChild(_dart);
		});
		_butmiddle.on('click', () => {
			if(!this.gameStarted) return;
			if(this.currentIndex > 2) return;
			if(this.direction[this.currentIndex] == 'left')
				this.herobody[this.currentIndex].gotoAndPlay("shootl");
			else
				this.herobody[this.currentIndex].gotoAndPlay("shootr");
			console.log(this.currentQuestion);

			if(this.currentQuestion[1].answer == this.hanswer[this.currentIndex])
			{
				this.addScore();
			}
			else
			{
				this.deduceLife();
				if (this.noOfLifeRemained > 0) {
					setTimeout(() => {
					}, this.waitForNext);
				}else{
					this.gameStarted = false;
					for(let j = 0; j < 3; j ++)
						if(this.direction[j] == 'left')
							this.herobody[j].gotoAndPlay("idlel")
						else
							this.herobody[j].gotoAndPlay("idler")
				}
			}
			this.answered[this.currentIndex] = 1;
			this.currentIndex ++;
			if(this.currentIndex < 3)
			{
				let _circle = new zim.Sprite({json: this.frame.asset("circle.json")})
				_circle.scale = 0.6;
				_circle.y = 80;
				this.heros[this.currentIndex].addChild(_circle);
				this.circles[this.currentIndex] = _circle;
				this.heros[this.currentIndex - 1].removeChild(this.circles[this.currentIndex - 1]);
			}
			let _dart = new zim.Sprite({json: this.frame.asset("dart.json")})
			_dart.scale = 0.4;
			_dart.x = 375;
			_dart.y = 210;
			this.heroarea.addChild(_dart);
		});
		_butright.on('click', () => {
			if(!this.gameStarted) return;
			if(this.currentIndex > 2) return;
			if(this.direction[this.currentIndex] == 'left')
				this.herobody[this.currentIndex].gotoAndPlay("shootl");
			else
				this.herobody[this.currentIndex].gotoAndPlay("shootr");
			console.log(this.currentQuestion);

			if(this.currentQuestion[2].answer == this.hanswer[this.currentIndex])
			{
				this.addScore();
			}
			else
			{
				this.deduceLife();
				if (this.noOfLifeRemained > 0) {
					setTimeout(() => {
					}, this.waitForNext);
				}else{
					this.gameStarted = false;
					for(let j = 0; j < 3; j ++)
						if(this.direction[j] == 'left')
							this.herobody[j].gotoAndPlay("idlel")
						else
							this.herobody[j].gotoAndPlay("idler")
				}
			}
			this.answered[this.currentIndex] = 1;
			this.currentIndex ++;
			if(this.currentIndex < 3)
			{
				let _circle = new zim.Sprite({json: this.frame.asset("circle.json")})
				_circle.scale = 0.6;
				_circle.y = 80;
				this.heros[this.currentIndex].addChild(_circle);
				this.circles[this.currentIndex] = _circle;
				this.heros[this.currentIndex - 1].removeChild(this.circles[this.currentIndex - 1]);
			}
			let _dart = new zim.Sprite({json: this.frame.asset("dart.json")})
			_dart.scale = 0.4;
			_dart.x = 605;
			_dart.y = 210;
			this.heroarea.addChild(_dart);
		});
		this.questionarea = new zim.Container(0 , 0 , 700, 200);
		this.questionarea.x = 50;
		this.questionarea.y = 140;
		this.contentLayer.addChild(this.questionarea);

		this.heroarea = new zim.Container(0 , 0 , this.width, this.height);
		this.contentLayer.addChild(this.heroarea);

		zim.Ticker.add(event => {
			this.move();
		}, this.stage);
        this.stage.update();
      });
	},
	makequestion(){
		this.questionarea.removeAllChildren();
		for(let i = 0; i < 3; i ++)
		{
			let _questionc = new zim.Container(0, 0, 200, 50)
			_questionc.x = 5 + i * 230;
			_questionc.y = 140;
			this.questionContainers[i] = _questionc
			this.questionContainers[i].displayWidth = 160
			this.questionarea.addChild(_questionc);
		}
	},
	makeheros(){
		this.heroarea.removeAllChildren();
		this.heros = [];
		for(let i = 0; i < 3; i ++)
			this.hanswer[i] = -1;
		for(let i = 0; i < 3; i ++)
		{
			let rand = Math.floor(Math.random()* 100) % 3;
			if(this.hanswer[rand] != -1)
			{
				i --;
				continue;
			}
			this.hanswer[rand] = this.currentQuestion[i].answer;
		}
		for(let i = 0; i < 3; i ++)
		{
			let _answer = new zim.Sprite({json: this.frame.asset("answer.json")})
			_answer.scale = 0.7;
			_answer.y = -50;
			let _text = new zim.Label({
					text: this.hanswer[i],
					size: 40,
					font: 'Comic Sans MS',
					color: 'black',
					align: 'center',
					valign: 'center'
			});
			_text.y = -20;
			_text.x = 50;

			this.answered[i] = 0;
			this.direction[i] = 'left';
			let _hero = this.gethero();
			this.herobody[i] = _hero;
			_hero.gotoAndPlay("left");
			this.heros[i] = new zim.Container(0, 0, 300, 300);
			this.heros[i].addChild(_hero, _answer, _text);
			this.heroarea.addChild(this.heros[i]);
			this.heros[i].scale = 0.7;
			this.heros[i].x = 800 + i * 300;
			this.heros[i].y = 500 + i * 50;
		}
		let _circle = new zim.Sprite({json: this.frame.asset("circle.json")})
		_circle.scale = 0.6;
		_circle.y = 80;
		this.heros[0].addChild(_circle);
		this.circles[0] = _circle;
		this.currentIndex = 0;
	},
	gethero(){
		return new zim.Sprite({
			image: this.frame.asset("ninja.png"),
			cols:5,
			rows:2,
			animations:{
				idlel: [5],
				idler: [0],
          		shootr : [3, 4, 'right', 0.1],
          		shootl : [8, 9, 'left', 0.1],
          		right : [0, 2, 'right', 0.2],
          		left : [5, 7, 'left', 0.2],
			}
      	})
	},
	move(){
		if(!this.gameStarted) return;	
		for(let i = 0; i < 3; i ++)
		{
			if(this.direction[i] == 'left'){
				this.heros[i].x -= this.speeds[i];
				if(this.heros[i].x < 0){
					this.direction[i] = 'right';
					this.herobody[i].gotoAndPlay("right");
				}
			}
			else{
				if(this.answered[i] == -1) continue;
				this.heros[i].x += this.speeds[i];
				if(this.answered[i] == 0 && this.heros[i].x > 770)
				{
					this.answered[i] = -1;
					this.deduceLife();
					let _circle = new zim.Sprite({json: this.frame.asset("circle.json")})
					_circle.scale = 0.6;
					_circle.y = 80;
					this.currentIndex ++;
					this.heros[this.currentIndex].addChild(_circle);
					this.circles[this.currentIndex] = _circle;
					this.heros[this.currentIndex - 1].removeChild(this.circles[this.currentIndex - 1]);
					if (this.noOfLifeRemained > 0) {
						setTimeout(() => {
							//this.showNextQuestion();
						}, this.waitForNext);
					}else{
						this.gameStarted = false;
						for(let j = 0; j < 3; j ++)
							if(this.direction[j] == 'left')
								this.herobody[j].gotoAndPlay("idlel")
							else
								this.herobody[j].gotoAndPlay("idler")
					}
				}				
			}
		}
		if(this.heros[2].x > 770 && this.direction[2] == 'right')
		{
			this.updateCurrentQuestionIndex()
			this.showNextQuestion();
		}
	},
  	initObjects() {
		for(let i = 0; i < 3; i ++)
			this.speeds[i] = 2 + Math.random() * 1;
		this.makequestion();
		this.makeheros();
	},
    showNextQuestion() {
		this.initObjects();
		this.setQuestions({ shiftX: 0.3, color: 'white' });
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