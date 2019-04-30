var fileName = "data.json";
var txtFile = new XMLHttpRequest();
txtFile.onreadystatechange = function() {
    if (txtFile.readyState === 4 && txtFile.status == 200) {
        let jsonData = JSON.parse(txtFile.responseText);
        console.log(jsonData);
        console.log(Object.values(jsonData));
        var dates = {};
        var i = 1;
        domain_x = [1, 365]; // !!! automate this
        range_x = [100, 900]; // !!! what kind of y data?
        trans_x = createTransform(domain_x, range_x)

        domain_y = [0, 300]; // !!! automate this
        range_y = [100, 450]
        trans_y = createTransform(domain_y, range_y)

        // !!! doe getwidth en length uit HTML in plaats van hardcode
        const canvas = document.getElementById('my-house');
        const ctx = canvas.getContext('2d');
        ctx.lineWidth = 1;
        ctx.moveTo(trans_x(domain_x[0]), trans_y(domain_y[1]))
        ctx.lineTo(trans_x(domain_x[1]), trans_y(domain_y[1]))
        ctx.moveTo(trans_x(domain_x[0]), trans_y(domain_y[1]))
        ctx.lineTo(trans_x(domain_x[0]), trans_y(0))
        ctx.lineWidth = 0.5;
        // startpoint
        ctx.moveTo(trans_x(i), trans_y(jsonData[20180101].FXX))
        i++

        // loop over all datapoint and draw lines in between
        Object.keys(jsonData).forEach(function(element) {
          ctx.lineTo(trans_x(i), trans_y(domain_y[1] - jsonData[element].FXX));
          dates[i] = jsonData[element].FXX
          i++
        });

        // set title, move to middle x location and upper y
        ctx.moveTo(trans_x(domain_x[1]), trans_y(0))
        ctx.font = "30px Helvetica";
        ctx.textAlign = "left";
        ctx.fillText("Windstoot snelheid in m/s-1", 10, 50);
        ctx.stroke();


    };
};

txtFile.open("GET", fileName);
txtFile.send();

$( document ).ready(function() {
  const heen = $("#test")
  console.log(heen)
  $("#test").html("");
  console.log("h1 is nu halo")

  // const canvas = document.getElementById('my-house');
  // const ctx = canvas.getContext('2d');
  //
  // // Set line width
  // ctx.lineWidth = 10;
  //
  // // Wall
  // ctx.strokeRect(75, 140, 150, 110);
  //
  // // Door
  // ctx.fillRect(130, 190, 40, 60);
  //
  // // Roof
  // ctx.moveTo(50, 140);
  // ctx.lineTo(150, 60);
  // ctx.lineTo(250, 140);
  // ctx.closePath();
  // ctx.stroke();

});



function createTransform(domain, range){
	// domain is a two-element array of the data bounds [domain_min, domain_max]
	// range is a two-element array of the screen bounds [range_min, range_max]
	// this gives you two equations to solve:
	// range_min = alpha * domain_min + beta
	// range_max = alpha * domain_max + beta
 		// a solution would be:

    var domain_min = domain[0]
    var domain_max = domain[1]
    var range_min = range[0]
    var range_max = range[1]

    // formulas to calculate the alpha and the beta
   	var alpha = (range_max - range_min) / (domain_max - domain_min)
    var beta = range_max - alpha * domain_max

    // returns the function for the linear transformation (y= a * x + b)
    return function(x){
      return alpha * x + beta;
    }
}
