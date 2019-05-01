/*
Name: Max Frings
Course: Data Processing 2018/2019 (Semester 2)
Student number: 10544429
Dataset source: http://projects.knmi.nl/klimatologie/daggegevens/selectie.cgi
*/

// Load KNMI wind gust data from json
var fileName = "data.json";
var txtFile = new XMLHttpRequest();
txtFile.onreadystatechange = function() {
    if (txtFile.readyState === 4 && txtFile.status == 200) {
        var jsonData = JSON.parse(txtFile.responseText);

        // Push windgust data to array, in order to extract the maximum value
        windgusts = [];
        for (i=0; i<Object.values(jsonData).length; i++) {
          windgusts.push(Object.values(jsonData)[i].FXX);
        };
        max_y = Math.max(...windgusts);

        // Initialize dates dictionary
        dates = {};

        // Set x and y domain and sufficient range to display graph properly
        domain_x = [1, Object.values(jsonData).length];
        range_x = [120, 900];
        trans_x = createTransform(domain_x, range_x);
        domain_y = [0, max_y]; // !!! automate this
        range_y = [100, 450];
        trans_y = createTransform(domain_y, range_y);

        // Get the HTML canvas element and set its settings
        const canvas = document.getElementById('my-canvas');
        const ctx = canvas.getContext('2d');
        ctx.lineWidth = 1;

        // Draw the x and y axes
        ctx.moveTo(trans_x(domain_x[0]), trans_y(domain_y[1]));
        ctx.lineTo(trans_x(domain_x[1]), trans_y(domain_y[1]));
        ctx.moveTo(trans_x(domain_x[0]), trans_y(domain_y[1]));
        ctx.lineTo(trans_x(domain_x[0]), trans_y(0));

        // x ticks
        var days_of_months_cumulative = [["Jan", 31], ["Feb", 59], ["Mar", 90],
                                         ["Apr", 120], ["May", 151],
                                         ["Jun", 181], ["Jul", 212],
                                         ["Aug", 243], ["Sep", 273],
                                         ["Oct", 304], ["Nov", 334],
                                         ["Dec", 365]];

        var amount_of_months = 12;
        for (i = 0; i < amount_of_months; i++) {
          ctx.moveTo(trans_x(days_of_months_cumulative[i][1]),
                             trans_y(domain_y[1]));
          ctx.lineTo(trans_x(days_of_months_cumulative[i][1]),
                             trans_y(domain_y[1]+10));

          ctx.textAlign = "center";
          ctx.font = "12px Helvetica";
          ctx.fillText(days_of_months_cumulative[i][0],
                       trans_x(days_of_months_cumulative[i][1]) - 31,
                       trans_y(domain_y[1]+12));
        };

        // y ticks
        for (i = 0; i < domain_y[1]; i+= 50) {
          ctx.setLineDash([]);
          ctx.moveTo(trans_x(domain_x[0]), trans_y(i));
          ctx.lineTo(trans_x(domain_x[0])-10, trans_y(i));
          ctx.textAlign = "left";
          ctx.font = "11px Helvetica";
          ctx.fillText(domain_y[1] - i, domain_x[0]+80, trans_y(i));
          ctx.lineWidth = 0.1;
          ctx.moveTo(trans_x(domain_x[0]+2), trans_y(i));
          ctx.lineTo(trans_x(domain_x[1])-2, trans_y(i));
        }
        ctx.stroke();

        // Draw wind gust data
        var i = 1;
        ctx.lineWidth = 0.5;
        ctx.moveTo(trans_x(i), trans_y(jsonData[20180101].FXX));
        i++;
        ctx.beginPath();
        ctx.strokeStyle="red";
        Object.keys(jsonData).forEach(function(element) {
          ctx.lineTo(trans_x(i), trans_y(domain_y[1] - jsonData[element].FXX));
          dates[i] = jsonData[element].FXX;
          i++;
        });
        ctx.stroke();

        // set title, move to middle x location and upper y
        ctx.font = "30px Helvetica";
        ctx.textAlign = "center";
        ctx.fillText("Strongest wind gust speed per day at " +
                     "De Bilt in 0.1 m/s (2018)", range_x[1]/2 + 60, 50);

        // x axis note, move to below the x axis line
        ctx.font = "15px Helvetica";
        ctx.fillText("Month", range_x[1]/2, range_y[1]+50);
+
        // y axis note, move to left of y axis line
        ctx.fillText("0.1 m/s", 45, range_y[1]/2);

        // Extra feature that shows the wind gust speed in KPH at mouse location
        detrans_y = deTrans_y(domain_y, range_y);
        var show_gust = $("#gust");
        ctx.canvas.addEventListener("mousemove", function (event) {
          var mouseY = detrans_y(event.clientY - ctx.canvas.offsetTop);
          if (mouseY <= max_y && mouseY >= 0) {
            show_gust.html("Wind gust speed at your mouse location in KPH: " +
                           Math.round(mouseY * 0.36) + " kilometers per hour");
          };
        });
    };
};

txtFile.open("GET", fileName);
txtFile.send();

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

function deTrans_y(domain, range){
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

    // returns the value that is associated with this coordinate
    return function(x){
      return max_y - (x - beta) / alpha;
    }
}
