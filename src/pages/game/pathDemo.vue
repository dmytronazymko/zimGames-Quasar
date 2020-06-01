<template>
  <div></div>
</template>

<script>

export default {
  name: 'path-demo',
  methods: {
    init () {
      var scaling = "fit"; // fit scales to fit the browser window while keeping the aspect ratio
      var width = 1024; // can go higher...
      var height = 768;

      /*
      window.blue = zim.blue
      window.light = zim.light
      window.dark = zim.dark
      window.pink = zim.pink
      window.yellow = zim.yellow
      window.purple = zim.purple
      */

      var frame = new zim.Frame({
        scaling: scaling, 
        width: width,
        height: height,
        assets: ["logo.png"],
        path: "statics/game/tutorial/"
      })
      frame.on("ready", function() {
        zog("ready from ZIM Frame");

        var stage = frame.stage;
        var stageW = frame.width;
        var stageH = frame.height;
        frame.color = frame.yellow;
        frame.outerColor = frame.dark;

        // let _logo = frame.asset('logo.png')
        let _logo = new zim.Sprite({
          image: frame.asset("logo.png"),
          cols:1,
          rows:1,
          animations:{
            logo: 0
          }
        })
        _logo.gotoAndPlay('logo')

        stage.addChild(_logo)

        var path = new zim.Squiggle({
          points: [[-169,115.7,0,0,100,0,50,0,"mirror"],[50.1,-36.3,0,0,194.4,11.3,-194.4,-11.3,"mirror"],[141.2,126.7,0,0,-112.1,0,112.1,0,"mirror"],[193.2,-158.4,0,0,186.4,-19.3,-186.4,19.3,"mirror"],[395.6,135.7,0,0,-70.7,4.8,70.7,-4.8,"mirror"],[519.3,-12.2,0,0,184.8,14.5,-184.8,-14.5,"mirror"],[652.9,120.9,0,0,-102.4,40.2,102.4,-40.2,"mirror"]],
          onTop:false
        }).center();
        /*
        new zim.Circle(10, red).addTo().animate({path:path}, 10000);
        */

       setInterval(() => {
         _logo.animate({ props: { scale: 1.3 }, time: 100, rewind: true })
       }, 1000)

        stage.update();
      }); // end of ready
    }
  },
  mounted () {
    this.init()
  },
  beforeDestroy () {
  }
}
</script>