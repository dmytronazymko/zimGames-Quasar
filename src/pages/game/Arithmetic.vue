<template>
  <div style="width: 100%; text-align: center;">
    <div :id="holder + 'Container'"><div :id="holder"></div></div>
  </div>
</template>

<script>
import GameShellMixin from '../../library/mixins/zimGameShell'
export default {
  name: "arithmetic",
  mixins: [GameShellMixin],
  data() {
    return {
      assets: [
		"background.png",
		"pad.png",
		"pad.json",
		"box.png",
		"box.json",
		"pad-plus.png",
		"pad-plus.json",
		"pad-div.png",
		"pad-div.json",
		"pad-mult.png",
		"pad-mult.json",
		"pad-minus.png",
		"pad-minus.json",
		"submit.png",
		"reset.png",
		"check.png",
		"cross.png",
      ],
	  path: "statics/game/arithmetic/",
	  backarea: null,
	  boxcnt: 0,
	  boxes:[],
	  expression: [],
	  check: null,
	  cross: null,
	  checking : false,
	  numcons: [],
	  opcons:[],
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
		
        this.backarea = new zim.Container(0 ,0 , this.width, this.height);
		this.contentLayer.addChild(this.backarea);
		this.check = this.frame.asset("check.png");
		this.check.scale = 0.6;
		this.check.x = 600;
		this.check.y = 60;
		this.contentLayer.addChild(this.check);

		this.cross = this.frame.asset("cross.png");
		this.cross.scale = 0.6;
		this.cross.x = 600;
		this.cross.y = 60;
		this.contentLayer.addChild(this.cross);
		this.cross.alpha = 0;
		this.check.alpha = 0;
		let _reset = this.frame.asset("reset.png");
		_reset.scale = 0.55;
		_reset.x = 10;
		_reset.y = 600;
		this.panelLayer.addChild(_reset);
		_reset.on("click", () => {
			if(this.checking) return;
			this.showNextQuestion();
		});
		let _submit = this.frame.asset("submit.png");
		_submit.scale = 0.8;
		_submit.x = 10;
		_submit.y = 450;
		_submit.on("click", () => {
			if(this.checking) return;
			if(this.expression.length % 2 == 0) return;
			this.checking = true;
			let str = '';
			for(let i = 0; i < this.boxcnt; i ++)
			{
				if(i % 2 == 0)
					str += this.currentQuestion.numbers[this.expression[i]];
				else
				{
					switch(this.currentQuestion.operators[this.expression[i]])
					{
						case '+': str += '+'; break;
						case '-': str += '-'; break;
						case '*': str += '*'; break;
						case '/': str += '/'; break;
					}
				}
			}
			if(this.computeAnother(str) == this.currentQuestion.target)
			{
				this.handleCorrect();
				this.check.alpha = 1;
			}	
			else
			{
				this.handleWrong();
				this.cross.alpha = 1;
			}
			if (this.noOfLifeRemained > 0) {
				setTimeout(() => {
					this.showNextQuestion();
			}, this.waitForNext);
		}
	 	});
		this.panelLayer.addChild(_submit);
		zim.Ticker.add(event => {
		});
        this.stage.update();
      });
	},
	computeAnother(str) {
		let nums = [];
		let numcnt = 0;
		let ops = [];
		let opcnt = 0;
		for(let i = 0; i < str.length; i ++)
		{
			if(str[i]>= '0' && str[i] <= '9')
			{
				nums[numcnt] = str[i] - '0';
				numcnt ++;
			}
			if(str[i] == '+' || str[i] == '-')
			{
				ops[opcnt] = str[i];
				opcnt ++;
			}
			if(str[i - 1] == '*')
			{
				let k = nums[numcnt - 2] * nums[numcnt - 1];
				nums[numcnt - 2] = k;
				numcnt --;
			}
			if(str[i - 1] == '/')
			{
				let k = nums[numcnt - 2] / nums[numcnt - 1];
				nums[numcnt - 2] = k;
				numcnt --;
			}
		}
		let result = nums[0];
		for(let i = 0; i < opcnt; i ++)
		{
			if(ops[i] == '+')
				result += nums[i + 1];
			else
				result -= nums[i + 1];
		}
		console.log(result);
		return result;
    },
	maketarget(){
		this.backarea.removeAllChildren();
		let _text = new zim.Label({
			text: 'Target',
			size: 30,
			font: 'Comic Sans MS',
			color: 'white',
			align: 'center',
			valign: 'center'
		});
		_text.x = 280;
		_text.y = 110;
		this.backarea.addChild(_text);
		let _target = new zim.Label({
			text: this.currentQuestion.target,
			size: 40,
			font: 'STENCIL',
			color: 'green',
			align: 'center',
			valign: 'center'
		});
		_target.x = 480;
		_target.y = 110;
		this.backarea.addChild(_target);
	},
	makebox(){
		if(this.boxcnt >= this.currentQuestion.numbers.length * 2 - 1) return;
		let _box = new zim.Sprite({json: this.frame.asset("box.json")});
		_box.scale = 0.5;
		_box.x = 145 + this.boxcnt * 53;
		_box.y = 230;
		this.backarea.addChild(_box);
		_box.setBounds(0, 0, _box.width, _box.height);
		this.boxes[this.boxcnt] = _box;
		if(this.boxcnt % 2 == 1)
		{
			for(let i = 0; i < this.currentQuestion.numbers.length; i ++)
				if(this.numcons[i].y > 250)
					this.numcons[i].alpha = 0.5;
			for(let i = 0; i < this.currentQuestion.operators.length; i ++)
				this.opcons[i].alpha = 1;
		}else{
			for(let i = 0; i < this.currentQuestion.numbers.length; i ++)
				this.numcons[i].alpha = 1;
			for(let i = 0; i < this.currentQuestion.operators.length; i ++)
				this.opcons[i].alpha = 0.5;
		}
	},
	makenumbers(){
		for(let i = 0; i < this.currentQuestion.numbers.length; i ++)
		{
			let _pad = new zim.Sprite({json: this.frame.asset("pad.json")});
			_pad.scale = 0.5;
			let _text = new zim.Label({
				text: this.currentQuestion.numbers[i],
				size: 30,
				font: 'Comic Sans MS',
				color: 'white',
				align: 'center',
				valign: 'center'
			});
			_text.x = 25;
			_text.y = 40;
			let _padcontainer = new zim.Container(0 ,0 , 200, 200);
			_padcontainer.x = 150 + i * 100;
			_padcontainer.y = 350;
			_padcontainer.addChild(_pad, _text);
			this.backarea.addChild(_padcontainer);
			_padcontainer.nIndex = i;
			_padcontainer.ppp = this;
			_padcontainer.on("pressmove", function(e){
				if(this.ppp.boxcnt % 2 == 0) return;
				if(this.ppp.boxcnt > this.ppp.currentQuestion.numbers.length * 2 - 1) return;
				if(this.ppp.checking) return;
				this.x = e.stageX - this.mx;
				this.y = e.stageY - this.my;
				this.stage.update();
			});
			_padcontainer.on("mousedown", function(e){				
				this.mx = e.stageX - this.x;
				this.my = e.stageY - this.y;				
			});
			_padcontainer.on("pressup", function(e){
				if(this.ppp.boxcnt % 2 == 0) return;
				if(this.ppp.boxcnt > this.ppp.currentQuestion.numbers.length * 2 - 1) return;
				if(this.ppp.checking) return;
				if(this.hitTestBounds(this.ppp.boxes[this.ppp.boxcnt - 1]))
				{
					this.x = 145 + (this.ppp.boxcnt - 1) * 53;
					this.y = 230;
					this.ppp.expression[this.ppp.boxcnt - 1] = i;
					this.ppp.makebox();
					this.ppp.boxcnt++;
				}
				else
				{
					this.x = 150 + this.nIndex * 100;
					this.y = 350;
				}
				this.ppp.stage.update();
			});
			this.numcons[i] = _padcontainer;
		}
		this.makebox();	
		this.boxcnt ++;
	},
	makeop(index){
		let _pad;
		if(this.currentQuestion.operators[index] == '+')
			_pad = new zim.Sprite({json: this.frame.asset("pad-plus.json")});
		else if(this.currentQuestion.operators[index] == '/')
			_pad = new zim.Sprite({json: this.frame.asset("pad-div.json")});
		else if(this.currentQuestion.operators[index] == '*')
			_pad = new zim.Sprite({json: this.frame.asset("pad-mult.json")});
		else if(this.currentQuestion.operators[index] == '-')
			_pad = new zim.Sprite({json: this.frame.asset("pad-minus.json")});
		_pad.scale = 0.5;
		_pad.x = 145 + (this.boxcnt - 1) * 53;
		_pad.y = 230;
		this.backarea.addChild(_pad);
	},
	makeoperator(){
		for(let i = 0; i < this.currentQuestion.operators.length; i ++)
		{
			let _pad;
			if(this.currentQuestion.operators[i] == '+')
				_pad = new zim.Sprite({json: this.frame.asset("pad-plus.json")});
			else if(this.currentQuestion.operators[i] == '/')
				_pad = new zim.Sprite({json: this.frame.asset("pad-div.json")});
			else if(this.currentQuestion.operators[i] == '*')
				_pad = new zim.Sprite({json: this.frame.asset("pad-mult.json")});
			else if(this.currentQuestion.operators[i] == '-')
				_pad = new zim.Sprite({json: this.frame.asset("pad-minus.json")});
			_pad.scale = 0.5;
			
			let _padcontainer = new zim.Container(0 ,0 , 200, 200);
			_padcontainer.x = 200 + i * 100;
			_padcontainer.y = 450;
			_padcontainer.addChild(_pad);
			this.backarea.addChild(_padcontainer);
			_padcontainer.nIndex = i;
			_padcontainer.ppp = this;
			_padcontainer.on("pressmove", function(e){
				if(this.ppp.boxcnt % 2 == 1) return;
				if(this.ppp.boxcnt > this.ppp.currentQuestion.numbers.length * 2 - 1) return;
				if(this.ppp.checking) return;
				this.x = e.stageX - this.mx;
				this.y = e.stageY - this.my;
				this.ppp.stage.update();
			});
			_padcontainer.on("mousedown", function(e){
				this.mx = e.stageX - this.x;
				this.my = e.stageY - this.y;				
			});
			_padcontainer.on("pressup", function(e){
				if(this.ppp.boxcnt % 2 == 1) return;
				if(this.ppp.boxcnt > this.ppp.currentQuestion.numbers.length * 2 - 1) return;
				if(this.ppp.checking) return;
				if(this.hitTestBounds(this.ppp.boxes[this.ppp.boxcnt - 1]))
				{
					this.x = 200 + this.nIndex * 100;
					this.y = 450;
					this.ppp.expression[this.ppp.boxcnt - 1] = i;
					this.ppp.makeop(i);
					this.ppp.makebox();
					this.ppp.boxcnt ++;
				}
				else
				{
					this.x = 200 + this.nIndex * 100;
					this.y = 450;
				}
				this.ppp.stage.update();
			});
			this.opcons[i] = _padcontainer;
		}
	},
  	initObjects() {
		this.boxcnt = 0;
		this.checking = false;
		for(let i = 0; i < 5; i ++)
			this.expression[i] = 'n';
		this.maketarget();
		this.makeoperator();
		this.makenumbers();
		this.check.alpha = 0;
		this.cross.alpha = 0;
        this.stage.update();
	},
    showNextQuestion() {
	  this.initObjects();
	 // this.setQuestion();
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