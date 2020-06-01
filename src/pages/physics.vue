<template>
  <div></div>
</template>

<script>
export default {
  name: 'physics',
  methods: {
    init () {
      var scaling = "fit" // this will resize to fit inside the screen dimensions
      var width = 1000
      var height = 800
      var color = zim.dark // or any HTML color such as "violet" or "#333333"
      var outerColor = zim.light
      var frame = new zim.Frame(scaling, width, height, color, outerColor);
      frame.on("ready", function() {
        zog("ready from ZIM Frame")
        var stage = frame.stage
        var stageW = frame.width
        var stageH = frame.height
        var borders = {x:0, y:0, width:stageW, height:stageH}
        var physics = new zim.Physics(frame, borders)
        var barW = 400;
	var barH = 20;
	var circleR = 30;
	var boxW = 150;
	var boxH = 150;
	var tri1 = 200;
	var tri2 = 150;
	var tri3 = 132;
	// ANGLED BAR
	// 4. create Box2D body assets specifying dynamic and other properties
	// dynamic defaults to true and means the body will move
	// here we set the bar to not be dynamic so it is fixed
	// width, height, dynamic, friction, angular, density, restitution, maskBits, categoryBits
	var barBody = physics.makeRectangle(barW, barH, false);
	// 5. position and rotate the bodies (only at start)
	barBody.x = 300;
	barBody.y = 300;
	barBody.rotation = 30;
	// CIRCLE
	// 4. create Box2D body assets specifying dynamic and other properties
	// can use ZIM DUO for these parameters too
	// angular is how much it will stop turning with 0 being not at all and 1 being hardly turning
	// restitution is how bouncy with 0 being not bouncy and 1 being fully bouncy
	// radius, dynamic, friction, angular, density, restitution, maskBits, categoryBits
	var circleBody = physics.makeCircle({
		radius:circleR,
		angular:.75,
		restitution:.5
	});
	// 5. position and rotate the bodies (only at start)
	circleBody.x = 400;
	circleBody.y = 200;
	// BOX
	// 4. create Box2D body assets specifying dynamic and other properties
	// friction means how much the body will slow down sliding
	// with 0 meaning very little slowdown and 1 being lots of slowdown (Sticky)
	// width, height, dynamic, friction, angular, density, restitution, maskBits, categoryBits
	var boxBody = physics.makeRectangle(boxW, boxH, true, .2);
	// 5. position and rotate the bodies (only at start)
	boxBody.x = 200;
	boxBody.y = 40;
	// TRIANGLE
	// 4. create Box2D body assets specifying dynamic and other properties
	// triangles match the ZIM triangle with the length of three sides
	// unlike the ZIM triangle, all sides must be specified
	// a, b, c, dynamic, friction, angular, density, restitution, maskBits, categoryBits
	var triBody = physics.makeTriangle(tri1, tri2, tri3, true, .2);
	// 5. position and rotate the bodies (only at start)
	triBody.x = 616;
	triBody.y = 100;
	// MOUSE
	// 6. set optional mouse dragging
	// optionally pass in a list of bodies to receive mouse movement
	// otherwise defaults to all moveable bodies
	// physics.drag([boxBody, triangleBody]); // would not drag circleBody
	physics.drag();
	// 7. set optional debug canvas showing Box2D shapes
	// DEBUG
	// optionally see the BOX 2D debug canvas - uncomment below
	// physics.debug();
	// frame.on("resize", function() {
	// 	physics.updateDebug();
	// });
	// 8. create ZIM assets to match physics world
	// Box2D bodies (made by physics.js) have centered positions
	// so center the registration points for ZIM assets
	var bar = new zim.Rectangle(barW, barH, frame.silver);
	bar.centerReg();
	var circle = new zim.Circle(circleR, frame.pink)
		.center();
	circle.cursor = "pointer";
		// add a little inner circle to see it spin
		var inner = new zim.Circle(circleR/2, frame.green);
		inner.x = circleR/4;
		circle.addChild(inner);
	var tri = new zim.Triangle(tri1, tri2, tri3, frame.yellow)
		.centerReg();
	tri.cursor = "pointer";
	var box = new zim.Rectangle(boxW, boxH, frame.orange)
		.centerReg();
	box.cursor = "pointer";
	// MAPPING
	// 9. map the ZIM assets to the Box2D assets
	// this puts the ZIM assets on the Box2D assets
	// and rotates them to the same rotation
	physics.addMap(barBody, bar);
	physics.addMap(circleBody, circle);
	physics.addMap(triBody, tri);
	physics.addMap(boxBody, box);
      })
    }
  },
  mounted () {
    this.init()
  }
}
</script>