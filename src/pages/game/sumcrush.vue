<template>
  <div style="width: 100%; text-align: center;">
    <div :id="holder + 'Container'"><div :id="holder"></div></div>
  </div>
</template>

<script>
import GameShellMixin from '../../library/mixins/zimGameShell'
export default {
  name: "sumcrush",
  mixins: [GameShellMixin],
  data() {
    return {
      assets: [
		"background.png",
		"1.png",
		"2.png",
		"3.png",
		"4.png",
		"5.png",
		"6.png",
		"7.png",
		"8.png",
		"9.png",
		"poof.png",
      ],
	  path: "statics/game/sumCrush/",
	  blocks: [],
	  blockvalue: [],
	  blockarea: null,
	  selarea: null,
	  optype: 1,
	  opvalue: 12,
	  oparea: null,
	  opalpha: 300,
	  selop: [],
	  selcnt: 0,
	  checking : false,
	  totalcnt : 25,
	  bangcnt : 0,
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
		
		this.blockarea = new zim.Container(0 ,0 , 400, 400);
		this.blockarea.x = 200;
		this.blockarea.y = 300;
		this.contentLayer.addChild(this.blockarea);

		this.selarea = new zim.Container(0 ,0 , 400, 400);
		this.selarea.x = 200;
		this.selarea.y = 300;
		this.contentLayer.addChild(this.selarea);
		
		this.oparea = new zim.Container(0 ,0 , 250, 200);
		this.oparea.x = 100;
		this.oparea.y = 50;
		this.contentLayer.addChild(this.oparea);
		zim.Ticker.add(event => {
			if(!this.gameStarted) return;
			if(!this.checking)
			{
				this.resetquestion();
				this.makeselection();
				return;
			} 
			if(this.bangcnt)
			{
				if(this.bangcnt == 1)
				{
					this.selarea.removeAllChildren();
					this.selcnt = 0;

					this.blockvalue[this.selop[0][0]][this.selop[0][1]] = -1;
					this.blockvalue[this.selop[1][0]][this.selop[1][1]] = -1;
					this.totalcnt -= 2;
					if(this.totalcnt == 1)
					{
						this.updateCurrentQuestionIndex();
						this.createBlocks();
						this.makequestion();
					}
					else
					{
						this.removespace();
						this.removespace();
						this.movecolleft();
						this.movecolleft();
						this.checking = false;
						this.makequestion();
						this.stage.update();
					}
				}
				this.bangcnt --;
			}
		}, this.stage);
        this.stage.update();
      });
	},
	movecolleft(){
		let i, j;
		for(i = 0; i < 5; i ++)
		{
			for(j = 0; j < 5; j++)
			{
				if(this.blockvalue[i][j] != -1)
					break;
			}
			if(j == 5)
			{
				for(j = i; j < 4; j ++)
				{
					for(let k = 0; k < 5; k ++)
					{
						this.blockvalue[j][k] = this.blockvalue[j + 1][k];
						this.blocks[j][k] = this.blocks[j + 1][k];
						if(this.blockvalue[j][k] != -1)
							this.blocks[j][k].x = j * 80;
					}
				}
				for(j = 0; j < 5; j ++)
				{
					this.blocks[4][j] = null;
					this.blockvalue[4][j] = -1;
				}
				break;
			}
		}
	},
	removespace()
	{
		for(let i = 0; i < 5; i ++)
			for(let j = 4; j >= 1; j --)
			{
				if(this.blockvalue[i][j] == -1)
				{
					for(let k = j; k >= 1; k --)
					{
						this.blockvalue[i][k] = this.blockvalue[i][k - 1];
						this.blocks[i][k] = this.blocks[i][k - 1];
						if(this.blockvalue[i][k] != -1)
							this.blocks[i][k].y = k * 80;
					}
					this.blockvalue[i][0] = -1;
					this.blocks[i][0] = null;
				/*	j ++;
					continue;*/
				}
			}
	},
	makeselection(){
		this.selarea.removeAllChildren();
		for(let i = 0; i < this.selcnt; i ++)
		{
			let _rect = new zim.Shape();
			_rect.graphics.setStrokeStyle(5).beginStroke("rgba(255, 255, 0, 1)").beginFill("rgba(0, 255, 0, 0)").rect(80 * this.selop[i][0], 80 * this.selop[i][1], 80, 80).closePath();
			this.selarea.addChild(_rect);
		}
		if(this.selcnt == 2)
		{
			let first = this.blockvalue[this.selop[0][0]][this.selop[0][1]];
			let second = this.blockvalue[this.selop[1][0]][this.selop[1][1]];
			let result;
			if(this.optype == '+') result = first + second;
			else if(this.optype == '-') result = first - second;
			else result = first * second;
			if(result == this.opvalue)
			{
				this.addScore();
			//	this.updateCurrentQuestionIndex();
				this.checking = true;
				for(let i = 0; i < 2; i ++)
				{
					let _bang = this.getbang();
					_bang.x = this.selop[i][0] * 80 - 20;
					_bang.y = this.selop[i][1] * 80 - 20;
					this.selarea.addChild(_bang);
					_bang.gotoAndPlay('bang');
				}
				this.bangcnt = 100;
				
				this.blockarea.removeChild(this.blocks[this.selop[0][0]][this.selop[0][1]]);
				this.blockarea.removeChild(this.blocks[this.selop[1][0]][this.selop[1][1]]);
				console.log(this.currentQuestion.operator);
			}
		}
	},
	getblock(index){
		return new zim.Sprite({
			image: this.frame.asset(""+ index + ".png"),
			cols:1,
			rows:1,
			animations:{
          		block: { frames: [0]},
			}
      	})
	},
	getbang(){
		return new zim.Sprite({
			image: this.frame.asset("poof.png"),
			cols:3,
			rows:3,
			animations:{
          		bang : [0, 9, '', 0.1],
			}
      	})
	},
	createBlocks(){
		this.blockarea.removeAllChildren();
		this.optype = this.currentQuestion.operator;
		this.totalcnt = 25;
		this.checking = false;
		this.blocks = [];
		this.blockvalue = [];
		for(let i = 0; i < 5; i ++)
		{
			this.blocks[i] = [];
			this.blockvalue[i] = [];
		}	
		for(let i = 0; i < 5; i ++)
			for(let j = 0; j < 5; j ++)
			{
				let _rand = Math.floor(Math.random() * 100) % this.currentQuestion.numbers.length;
				let _block = this.getblock(this.currentQuestion.numbers[_rand]);
				_block.width = 80;
				_block.x = i * 80;
				_block.y = j * 80;
				this.blockarea.addChild(_block);
				_block.selcnt = 0;
				_block.on('mousedown', () => {
					if(!this.gameStarted) return;
					if(this.checking) return;
					if(this.opalpha <= 0 ) return;
					console.log(_block.x / 80 + ' ' + _block.y / 80)
					let sx = _block.x / 80;
					let sy = _block.y / 80;
					if(this.selcnt == 0)
					{
						this.selop[0] = [];
						this.selop[1] = [];
						this.selop[0][0] = sx;
						this.selop[0][1] = sy;
						this.selcnt ++;
					}
					if(this.selcnt == 1)
					{
						if((sx == this.selop[0][0] && (sy == this.selop[0][1] - 1 || sy == this.selop[0][1] + 1)) ||
							(sy == this.selop[0][1] && (sx == this.selop[0][0] - 1 || sx == this.selop[0][0] + 1)))
						{
							this.selop[1][0] = sx;
							this.selop[1][1] = sy;
							this.selcnt ++;
						}
						else
						{
							this.selop[0][0] = sx;
							this.selop[0][1] = sy;
						}
					}
					else
					{
						this.selop[0][0] = sx;
						this.selop[0][1] = sy;
						this.selcnt = 1;
					}
				});
				_block.ppp = this;
				_block.on("pressmove", function(e){
					
					let sx = Math.floor((e.stageX - 200) / 80);
					let sy = Math.floor((e.stageY - 300) / 80);
					if(this.ppp.blockvalue[sx][sy] == -1) return;
					if(this.ppp.selcnt == 1)
					{
						if((sx == this.ppp.selop[0][0] && (sy == this.ppp.selop[0][1] - 1 || sy == this.ppp.selop[0][1] + 1)) ||
							(sy == this.ppp.selop[0][1] && (sx == this.ppp.selop[0][0] - 1 || sx == this.ppp.selop[0][0] + 1)))
						{
							this.ppp.selop[1][0] = sx;
							this.ppp.selop[1][1] = sy;
							this.ppp.selcnt ++;
						}
						else
						{
							this.ppp.selop[0][0] = sx;
							this.ppp.selop[0][1] = sy;
						}
					}
					console.log("df")
				});
				this.blocks[i][j] = _block;
				this.blockvalue[i][j] = this.currentQuestion.numbers[_rand];
			}

		
	},
	resetquestion(){
		this.oparea.removeAllChildren();
		{
			let _text = new zim.Label({
					text: this.opvalue,
					size: 60,
					font: 'Comic Sans MS',
					color: 'white',
					align: 'center',
					valign: 'center'
			});
			_text.x = 80;
			_text.y = 120;
			_text.alpha = this.opalpha / 300;
			this.oparea.addChild(_text);
		}
		{
			let str;
			if(this.optype == '+') str = '? + ? =';
			else if(this.optype == '-') str = '? - ? =';
			else str = '? * ? =';
			let _text = new zim.Label({
					text: str,
					size: 40,
					font: 'Comic Sans MS',
					color: 'white',
					align: 'center',
					valign: 'center'
			});
			_text.x = 100;
			_text.y = 40;
			_text.alpha = this.opalpha / 300;
			this.oparea.addChild(_text);
		}
		this.opalpha -= 0.5;
		if(this.opalpha == 0)
		{
			this.deduceLife()
			this.opalpha = -1;
			if (this.noOfLifeRemained > 0) {
				setTimeout(() => {
					this.checking = false;
					this.selcnt = 0;
					this.makequestion();
				}, this.waitForNext);
			}
		}		
	},
	makequestion(){
		this.opalpha = 300;
		while(1)
		{
			let x = Math.floor(Math.random()*100) % 5;
			let y = Math.floor(Math.random()*100) % 5;
			if(this.blockvalue[x][y] == -1) continue;
			let nei = [];
			let cnt = 0;
			if(x > 1 && this.blockvalue[x - 1][y] != -1) nei[cnt ++] = this.blockvalue[x - 1][y];
			if(x < 4 && this.blockvalue[x + 1][y] != -1) nei[cnt ++] = this.blockvalue[x + 1][y];
			if(y > 1 && this.blockvalue[x][y - 1] != -1) nei[cnt ++] = this.blockvalue[x][y - 1];
			if(y < 4 && this.blockvalue[x][y + 1] != -1) nei[cnt ++] = this.blockvalue[x][y + 1];
			if(cnt == 0)
			{
				this.updateCurrentQuestionIndex();
				this.createBlocks();
				return;
			}
			let rand = Math.floor(Math.random()*100) % cnt;
			if(this.optype == '+')
				this.opvalue = this.blockvalue[x][y] + nei[rand];
			else if(this.optype == '-')
			{
				this.opvalue = this.blockvalue[x][y] - nei[rand];
				if(this.currentQuestion.positveOnly && this.opvalue < 0)
					continue;
			}	
			else
				this.opvalue = this.blockvalue[x][y] * nei[rand];
			break;
		}
	},
  	initObjects() {
		this.selcnt = 0;
		this.createBlocks();
		this.makequestion();
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