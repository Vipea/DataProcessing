//
// Configuration
//

// [year: {}
//    year
//    year ]
alldata = {}
let yearSelect = 1961

// add live animal slaughter counters, also per country

$.getJSON("data.json", function( data ) {
  console.log(data[0])
  values = Object.values(data)
  console.log(values)
  values.forEach(function(element) {
    animalList = [{"animal": "Pigs", "killed":element.Pigs}, {"animal": "Cattle", "killed":element.Cattle}, {"animal": "Sheep", "killed":element.Sheep}, {"animal": "Turkeys", "killed":element.Turkeys}, {"animal": "Chickens", "killed":element.Chickens}, {"animal": "Goat", "killed":element.Goat}]
    animalList.forEach(function(item, index, object) {
      if (item.killed == null) {
        object.splice(index, 1)
      }
    })
    if (alldata[element.Year]) {
      alldata[element.Year][element.Entity] = animalList
    }
    else {
      var dict = {}      // key2 = ;
      dict[element.Entity] = animalList
      // dict = {key2: }
      alldata[element.Year] = dict
    }
  })
  console.log(alldata)

  w = 500
  h = 500
  // Create SVG element
  // var svg = d3.select("body")
  //   .append("svg")
  //   .attr("width", 500)
  //   .attr("height", 500);

  console.log(alldata["1961"]["China"])


    const rectangles = svg.selectAll(".datapoint")
     .data(alldata["1961"]["China"])
     .enter()
     .append("rect")
     .attr("class", datapoint)
     .attr("fill", "blue");

    // Set the x location of the rectangle
    rectangles.attr("x", function(d, i) {
                                          return i *
                                          (w /
                                        alldata["1961"]["China"].length)
                                       })

    // Add hover effect on mouse over
    .on('mouseover',
    function (d, i) {
                       d3.select(
                       this).transition("barOpacity")
                      .duration(50)
                      .attr('opacity', '.8')

                      // Makes div appear on hover
                      div.transition("divAppear")
                      .duration(50)
                      .style("opacity", 1)
                    })

    // Disable hover effect on mouse out
    .on('mouseout', function (d, i) {
                                      d3.select(this).transition(
                                                      "barDisappear")
                                      .duration(50)
                                      .attr('opacity', '1');

                                      // Make the div disappear
                                      div.transition("divDisappear")
                                      .duration('50')
                                      .style("opacity", 0);
                                    })

    // Set rectangle width
    .attr("width", (xScale.bandwidth() - barPadding) / 2)
});

const start_year = 1961;
const end_year = 2014;
// Create slider to select years
d3.select("body")
  .append("div")
  .attr("class", "slidecontainer")
  .append("input")
  .attr("type", "range")
  .attr("min", start_year)
  .attr("max", end_year)
  .attr("value", "50")
  .attr("class", "slider")
  .attr("id", "myRange");

// Show the value of the slider
d3.select("body")
  .append("span")
  .attr("id", "showVal");

// Show the value of the slider in the HTML page
let slider = document.getElementById("myRange");
let output = document.getElementById("showVal");
output.innerHTML = slider.value;

function changeYear(year) {

  // Shows the year that is currently selected
  output.innerHTML = slider.value;
};

// Changes the datapoint every time the slider is moved
slider.oninput = function() {
  changeYear(this.value);
  yearSelect = this.value
};

// ms to wait after dragging before auto-rotating
var rotationDelay = 3000
// scale of the globe (not the canvas element)
var scaleFactor = 0.9
// autorotation speed
var degPerSec = 6
// start angles
var angles = { x: -20, y: 40, z: 0}
// colors
var colorWater = '#fff'
var colorLand = '#111'
var colorGraticule = '#ccc'
var colorCountry = '#a00'
// {
//   'value':500,
//   'animal':'chicken'
// }

//
// Handler
//

// add dictionary and display that country value?
var animaldata = {'United States': {'total': 2000, 'piechart': [500, 500, 500, 500]}}

// maak objecten die bij elke hover de totale waarde weegeven, bij een onclick maak enter je steeds de subgroupen per land en laat je een bar chart zien

function enter(country) {
  var country = countryList.find(function(c) {
    return c.id === country.id
  })

  // Which text to display on hover
  let totalKills = 0;
  alldata[yearSelect][country.name].forEach(function(element) {
    totalKills += element.killed;
  });

  current.text(country && country.name + ' killed ' + totalKills + ' animals in ' + yearSelect || '');
  console.log(country);
}

function leave(country) {
  current.text('')
}

//
// Variables
//



var current = d3.select('#current')
var canvas = d3.select('#globe')
var context = canvas.node().getContext('2d')
var water = {type: 'Sphere'}
var projection = d3.geoOrthographic().precision(0.1)
var graticule = d3.geoGraticule10()
var path = d3.geoPath(projection).context(context)
var v0 // Mouse position in Cartesian coordinates at start of drag gesture.
var r0 // Projection rotation as Euler angles at start.
var q0 // Projection rotation as versor at start.
var lastTime = d3.now()
var degPerMs = degPerSec / 1000
var width, height
var land, countries
var countryList
var autorotate, now, diff, roation
var currentCountry

//
// Functions
//

function setAngles() {
  var rotation = projection.rotate()
  rotation[0] = angles.y
  rotation[1] = angles.x
  rotation[2] = angles.z
  projection.rotate(rotation)
}

function scale() {
  width = document.documentElement.clientWidth
  height = document.documentElement.clientHeight
  canvas.attr('width', width).attr('height', height)
  projection
    .scale((scaleFactor * Math.min(width, height)) / 2)
    .translate([width / 2, height / 2])
  render()
}

function startRotation(delay) {
  autorotate.restart(rotate, delay || 0)
}

function stopRotation() {
  autorotate.stop()
}

function dragstarted() {
  v0 = versor.cartesian(projection.invert(d3.mouse(this)))
  r0 = projection.rotate()
  q0 = versor(r0)
  stopRotation()
}

function dragged() {
  var v1 = versor.cartesian(projection.rotate(r0).invert(d3.mouse(this)))
  var q1 = versor.multiply(q0, versor.delta(v0, v1))
  var r1 = versor.rotation(q1)
  projection.rotate(r1)
  render()
}

function dragended() {
  startRotation(rotationDelay)
}

function render() {
  context.clearRect(0, 0, width, height)
  fill(water, colorWater)
  stroke(graticule, colorGraticule)
  fill(land, colorLand)
  if (currentCountry) {
    fill(currentCountry, colorCountry)
  }
}

function fill(obj, color) {
  context.beginPath()
  path(obj)
  context.fillStyle = color
  context.fill()
}

function stroke(obj, color) {
  context.beginPath()
  path(obj)
  context.strokeStyle = color
  context.stroke()
}

function rotate(elapsed) {
  now = d3.now()
  diff = now - lastTime
  if (diff < elapsed) {
    rotation = projection.rotate()
    rotation[0] += diff * degPerMs
    projection.rotate(rotation)
    render()
  }
  lastTime = now
}

function loadData(cb) {
  d3.json('https://unpkg.com/world-atlas@1/world/110m.json', function(error, world) {
    if (error) throw error
    d3.tsv('https://gist.githubusercontent.com/mbostock/4090846/raw/07e73f3c2d21558489604a0bc434b3a5cf41a867/world-country-names.tsv', function(error, countries) {
      if (error) throw error
      cb(world, countries)
    })
  })
}

// https://github.com/d3/d3-polygon
function polygonContains(polygon, point) {
  var n = polygon.length
  var p = polygon[n - 1]
  var x = point[0], y = point[1]
  var x0 = p[0], y0 = p[1]
  var x1, y1
  var inside = false
  for (var i = 0; i < n; ++i) {
    p = polygon[i], x1 = p[0], y1 = p[1]
    if (((y1 > y) !== (y0 > y)) && (x < (x0 - x1) * (y - y1) / (y0 - y1) + x1)) inside = !inside
    x0 = x1, y0 = y1
  }
  return inside
}

function mousemove() {
  var c = getCountry(this)
  if (!c) {
    if (currentCountry) {
      leave(currentCountry)
      currentCountry = undefined
      render()
    }
    return
  }
  if (c === currentCountry) {
    return
  }
  currentCountry = c
  render()
  enter(c)
}

function getCountry(event) {
  var pos = projection.invert(d3.mouse(event))
  return countries.features.find(function(f) {
    return f.geometry.coordinates.find(function(c1) {
      return polygonContains(c1, pos) || c1.find(function(c2) {
        return polygonContains(c2, pos)
      })
    })
  })
}


//
// Initialization
//

setAngles()

canvas
  .call(d3.drag()
    .on('start', dragstarted)
    .on('drag', dragged)
    .on('end', dragended)
   )
  .on('mousemove', mousemove)

loadData(function(world, cList) {
  land = topojson.feature(world, world.objects.land)
  countries = topojson.feature(world, world.objects.countries)
  countryList = cList

  window.addEventListener('resize', scale)
  scale()
  autorotate = d3.timer(rotate)
})



// ??? missing country names
