var livemap;
scope.rotation = [97, -30];

function redraw() {
  d3.select("#map-wrapper").html('');
  init();
}// redraw


function init() {
  livemap = new Datamap({...})

  var drag = d3.behavior.drag().on('drag', function() {
    var dx = d3.event.dx;
    var dy = d3.event.dy;

    var rotation = livemap.projection.rotate();
    var radius = livemap.projection.scale();
    var scale = d3.scale.linear().domain([-1 * radius, radius]).range([-90, 90]);
    var degX = scale(dx);
    var degY = scale(dy);
    rotation[0] += degX;
    rotation[1] -= degY;
    if (rotation[1] > 90) rotation[1] = 90;
    if (rotation[1] < -90) rotation[1] = -90;

    if (rotation[0] >= 180) rotation[0] -= 360;
    scope.rotation = rotation;
    redraw();
  })

 d3.select("#map-wrapper").select("svg").call(drag);

}// init
