<template>
  <div style="width: 100%; text-align: center;">
    <div :id="holder + 'Container'"><div :id="holder"></div></div>
  </div>
</template>

<script>
import GameShellMixin from '../../library/mixins/zimGameShell'
export default {
  name: "sumpuzzle",
  mixins: [GameShellMixin],
  data() {
    return {
      assets: [
		"background.png",
		"notebook.png",
		"submit.png",
		"grapes.png",
		"grape.json",
		"top.png",
		"top.json",
		"bird.png",
		"bird.json",
		"answer-box.png",
		"answer-box.json",
		"check.png",
		"cross.png"
      ],
	  path: "statics/game/sumPuzzle/",
	  table:[],
	  tablearea: null,
	  answerarea: null,
	  cells:[],
	  answer:[],
	  slider:[],
	  max: 10,
	  checking: false,
	  correctimg: null,
	  wrongimg: null,
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
		
		let _notebook = this.frame.asset("notebook.png");
		_notebook.scale = 0.6;
        _notebook.x = 200;
        _notebook.y = 100;
		this.backgroundLayer.addChild(_notebook);
		
		let _submit = this.frame.asset("submit.png");
		_submit.x = 20;
		_submit.y = 550;
		this.panelLayer.addChild(_submit);
		_submit.on('click', () => {
			if(this.checking) return;
			
			this.checking = true;
			let i = 0;
			for(i = 0; i < 3; i ++)
				if(this.answer[i] != this.currentQuestion.numbers[i]) break;
			if(i == 3){
				this.handleCorrect();
				this.correctimg.x = 580;
				setTimeout(() => {
					this.showNextQuestion();
				}, this.waitForNext);
			}
			else{
				this.handleWrong();
				this.wrongimg.x = 580;
				if (this.noOfLifeRemained > 0) {
					setTimeout(() => {
						this.showNextQuestion();
					}, this.waitForNext);
				}
			}
		});
		this.tablearea = new zim.Container(0 ,0 , 500, 500);
		this.tablearea.x = 225;
		this.tablearea.y = 140;
		this.contentLayer.addChild(this.tablearea);
		
		for(let i = 0; i < 3; i ++)
		{
			let _box = new zim.Sprite({json: this.frame.asset("answer-box.json")});
			_box.scale = 0.6;
			_box.x = 500;
			_box.y = 580 + i * 50;
			this.contentLayer.addChild(_box);
		}
		this.answerarea = new zim.Container(0, 0, 80, 200);
		this.answerarea.x = 500;
		this.answerarea.y = 580;
		this.contentLayer.addChild(this.answerarea);
		
		for(let i = 0; i < 3; i ++){
			let _line = new zim.Shape();
			_line.graphics.setStrokeStyle(3).beginStroke("#000000").moveTo(220, 600 + i * 50).lineTo(470, 600 + i * 50).closePath();
			this.contentLayer.addChild(_line);
		}
		for(let i = 0; i < 3; i ++){
			if(i == 0)
				this.slider[i] = new zim.Sprite({json: this.frame.asset("bird.json")});
			else if(i == 1)
				this.slider[i] = new zim.Sprite({json: this.frame.asset("top.json")});
			else
				this.slider[i] = new zim.Sprite({json: this.frame.asset("grape.json")});
			this.slider[i].scale = 0.3;
			this.slider[i].x = 200;
			this.slider[i].y = 580 + 50 * i;
			this.contentLayer.addChild(this.slider[i]);
			this.slider[i].mx = 200;
			this.slider[i].on("pressmove", function(e){
				this.x = e.stageX - this.mx;
				if(this.x < 200) this.x = 200;
				if(this.x > 450) this.x = 450;				
			});
			this.slider[i].on("mousedown", function(e){
				this.mx = e.stageX - this.x;
			});
		}
		
		this.correctimg = this.frame.asset("check.png"); 
		this.correctimg.scale = 0.5;
		this.contentLayer.addChild(this.correctimg);
		this.wrongimg = this.frame.asset("cross.png"); 
		this.wrongimg.scale = 0.5;
		this.contentLayer.addChild(this.wrongimg);

		this.correctimg.x = -200;
		this.wrongimg.x = -200;
		this.correctimg.y = 610;
		this.wrongimg.y = 610;
		
		zim.Ticker.add(event => {
			this.checkingslider();
		}, this.stage);
        this.stage.update();
      });
	},
	setmax(){
		this.max = this.currentQuestion.numbers[0];
		for(i  = 1; i < 3; i ++)
			if(this.max < this.currentQuestion.numbers[i])
				this.max = this.currentQuestion.numbers[i];
	},
	checkingslider(){
		for(let i = 0; i < 3; i ++)
			this.answer[i] = Math.floor((this.slider[i].x - 200) / (250 / this.max));
		this.resetanswers();
	},
	resetanswers(){
		this.answerarea.removeAllChildren();
		for(let i = 0; i < 3; i ++)
		{
			let _text = new zim.Label({
				text: this.answer[i],
				size: 30,
				font: 'Comic Sans MS',
				color: 'black',
				align: 'center',
				valign: 'center'
			});
			_text.x = 25;
			_text.y = 20 + 50 * i;
			this.answerarea.addChild(_text);
		}
	},
    createTable() {
		this.tablearea.removeAllChildren();
		this.cells = [];
		for(let i = 0; i < 9; i ++)
			this.table[i] = -1;
		let cellcnt = 9;
		for(let i = 0; i < 3; i ++)
		{
			let cnt = 2 + Math.floor((Math.random() * 50)) % 3;
			if(i == 2)
				cnt = cellcnt;
			else
				cellcnt -= cnt;
			if(i == 1 && cellcnt == 5)
			{
				cellcnt = 7;
				i--;
				continue;
			}
			if(i == 1 && cellcnt == 1)
			{
				cellcnt = 5;
				i--;
				continue;
			}
			while(cnt) 
			{
				let rand = (Math.random() * 50) % 9;
				rand = Math.floor(rand);
				if(this.table[rand] != -1) continue;
				let _cell;
				if(i == 0) _cell = new zim.Sprite({json: this.frame.asset("bird.json")});
				else if(i == 1) _cell = new zim.Sprite({json: this.frame.asset("top.json")});
				else _cell = new zim.Sprite({json: this.frame.asset("grape.json")});
				_cell.scale = 0.7;
				_cell.x = 100 * (rand % 3);
				_cell.y = 100 * Math.floor(rand / 3);
				
				this.tablearea.addChild(_cell);
				this.cells[rand] = _cell;
				this.table[rand] = i;
				cnt --;
			}
		}
		for(let i = 0; i < 3; i ++)
		{
			let rowsum = this.currentQuestion.numbers[this.table[i * 3]] + this.currentQuestion.numbers[this.table[i * 3 + 1]] + this.currentQuestion.numbers[this.table[i * 3 + 2]];
			let _text = new zim.Label({
				text: rowsum,
				size: 60,
				font: 'Comic Sans MS',
				color: 'black',
				align: 'center',
				valign: 'center'
			});
			_text.x = 360;
			_text.y = 30 + 110 * i;
			this.tablearea.addChild(_text);
			if(this.max < rowsum)
				this.max = rowsum;
		}
		for(let i = 0; i < 3; i ++)
		{
			let colsum = this.currentQuestion.numbers[this.table[i]] + this.currentQuestion.numbers[this.table[i + 3]] + this.currentQuestion.numbers[this.table[i + 6]];
			let _text = new zim.Label({
				text: colsum,
				size: 60,
				font: 'Comic Sans MS',
				color: 'black',
				align: 'center',
				valign: 'center'
			});
			_text.x = 30 + 110 * i;
			_text.y = 350;			
			this.tablearea.addChild(_text);
			if(this.max < colsum)
				this.max = colsum;
		}
		for(let i = 0; i < 3; i ++)
		{
			this.slider[i].x = 200;
			this.answer[i] = 0;
		}
	},
  	initObjects() {
		this.setmax();
		this.createTable();
		this.resetanswers();
		this.checking = false;
		this.correctimg.x = -200;
		this.wrongimg.x = -200;
        this.stage.update();
	},
    showNextQuestion() {
	  this.initObjects();
	 // this.setQuestion();
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
    this.initGameShell()
  },
  beforeDestroy() {
    this.cleanUp();
  }
};
</script>