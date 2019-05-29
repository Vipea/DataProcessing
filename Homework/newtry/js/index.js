/* Name: Max Frings
   Student number: 10544429
   Course: Data Processing 2018/2019 (Semester 2)
   This file's purpose in life is to visualize animals killed around the globe
   http://www.fao.org/faostat/en/#data/QL/metadata */

alldata = {}
let yearSelect = 1961
totalList = {}
let mintotal = 1000000
let maxtotal = 1000000
var countryinfo;

// Get JSON data and store it into variables
$.getJSON("data.json", function(data) {
  values = Object.values(data)
  values.forEach(function(element) {

    animalList = [{
      "animal": "Pigs",
      "killed": element.Pigs
    }, {
      "animal": "Cattle",
      "killed": element.Cattle
    }, {
      "animal": "Sheep",
      "killed": element.Sheep
    }, {
      "animal": "Turkeys",
      "killed": element.Turkeys
    }, {
      "animal": "Chickens",
      "killed": element.Chickens
    }, {
      "animal": "Goat",
      "killed": element.Goat
    }]
    total = element.Pigs + element.Cattle + element.Sheep + element.Turkeys + element.Chickens + element.Goat

    if (totalList[element.Year] == null) {
      totalList[element.Year] = {}
    } else {
      totalList[element.Year][element.Entity] = total
    }
    if (total < mintotal) {
      mintotal = total
    }
    if (total > maxtotal) {
      maxtotal = total
    }
    animalList.forEach(function(item, index, object) {
      if (item.killed == null) {
        object.splice(index, 1)
      }
    })
    if (alldata[element.Year]) {
      alldata[element.Year][element.Entity] = animalList
    } else {
      var dict = {} // key2 = ;
      dict[element.Entity] = animalList
      // dict = {key2: }
      alldata[element.Year] = dict
    }
  })

  const start_year = 1961;
  const end_year = 2014;

  // Create slider to select years
  d3.select(".container")
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
  d3.select(".container")
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

  colorRange = ["#ffffb2", "#fed976", "#feb24c", "#fd8d3c", "#f03b20", "#bd0026"]
  var myColor = d3.scaleLinear()
    .domain([mintotal, maxtotal / 100000, maxtotal / 10000, maxtotal / 1000, maxtotal / 100, maxtotal / 10])
    .range(colorRange);

  var legendSvg = d3.select("#my_dataviz")
    .append("svg")
    .attr("width", 300)
    .attr("height", 410);

  legendWidth = 200
  legendHeight = 300
  legendMargin = 30

  // make text for the legend
  legendSvg.append("rect")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("fill", "white");

  legendSvg.append("text")
    .attr("x", 0)
    .attr("y", 80)
    .attr("dy", ".25em")
    .text("Animals killed for meat")
    .attr("fill", "black")
    .style("font-size", 20)
    .style("font-family", "sans-serif")

  // make the bar gradient
  var gradient = legendSvg.append('defs')
    .append('linearGradient')
    .attr('id', 'gradient')
    .attr('x1', '0%')
    .attr('y1', '100%')
    .attr('x2', '0%')
    .attr('y2', '0%')
    .attr('spreadMethod', 'pad');

  // create legendscale for yaxis
  var legendScale = d3.scaleLinear()
    .domain([0, maxtotal / 10])
    .range([legendHeight, 0]);

  // create axis for the legend
  var legendAxis = d3.axisRight()
    .scale(legendScale)
    .ticks(10)

  // insert the legend axis
  legendSvg.append("g")
    .attr("class", "z axis")
    .attr("transform", "translate(" + (legendWidth - legendMargin) + ", 100)")
    .call(legendAxis);

  // Calculates linspace
  function linspace(start, end, n) {
    var out = [];
    var delta = (end - start) / (n - 1);
    var i = 0;
    while (i < (n - 1)) {
      out.push(start + (i * delta));
      i++;
    }
    out.push(end);
    return out;
  }

  // make the colorScaling grdient
  var pct = linspace(0, 100, colorRange.length).map(function(d) {
    return Math.round(d) + '%';
  });

  var colourPct = d3.zip(pct, colorRange);

  colourPct.forEach(function(d) {
    gradient.append('stop')
      .attr('offset', d[0])
      .attr('stop-color', d[1])
      .attr('stop-opacity', 1);
  });

  // make the coloured rectangle
  legendSvg.append('rect')
    .attr('x', 0)
    .attr('y', 100)
    .attr('width', legendWidth - legendMargin)
    .attr('height', legendHeight)
    .style('fill', 'url(#gradient)');



  // set the dimensions and margins of the graph
  var width = $("#my_dataviz").width() + 100
  height = width
  margin = 100

  // The radius of the pieplot is half the width or half the height (smallest one). I substract a bit of margin.
  var radius = Math.min(width, height) / 2 - margin

  var svg = d3.select("#my_dataviz")
    .append("svg")
    .attr('id', 'globeinfo')
    .attr("width", width)
    .attr("height", height - 80)
    .append("g")

  // define animals
  animals = ["Pigs", "Cattle", "Sheep", "Turkeys", "Chickens", "Goat"]

  // set the color scale
  var color = d3.scaleOrdinal()
    .domain(animals)
    .range(d3.schemeSet2);

  // make a legend for the pie chart
  const legend = svg.selectAll(".legendElement")
    .data(animals)
    .enter()
    .append('circle')
    .attr('r', 10)
    .attr('cx', 150)
    .attr('cy', function(d, i) {
      return i * 30 - 65
    })
    .attr('fill', function(d) {
      return color(d)
    })

  // set legend text for the pie chart
  const legendtext = svg.selectAll(".legendElement")
    .data(animals)
    .enter()
    .append('text')
    .text(function(d) {
      return d
    })
    .attr('x', 170)
    .attr('y', function(d, i) {
      return i * 30 - 60
    })
    .style("font-size", "14px")

  // Counter
  var i = parseInt($('#count').text());
  var tim;

  function run() {
    tim = setInterval(function() {
      i = i + 87
      $('#count').html("<span id='killcount'>" + i + "</span>" + " animals were killed since you opened this page");
    }, 50);
  }

  run();


  // A function that create / update the plot for a given variable:
  function update(data, year, country, isfirst) {
    let countryinfo = d3.select(".countryinfo")
    countryinfo.remove()

    d3.select("#globeinfo")
      .append("text")
      .text(country + " " + year)
      .attr('x', 140)
      .attr('y', 80)
      .attr("class", "countryinfo")
      .style("font-size", 20)
      .style("font-family", "sans-serif")

    //Compute the position of each group on the pie:
    var pie = d3.pie()
      .value(function(d) {
        return d.value.killed;
      })
    var data_ready = pie(d3.entries(data[year][country]))

    var arcGenerator = d3.arc()
      .innerRadius(0)
      .outerRadius(radius)

    svg
      .selectAll('mySlices')
      .data(data_ready)
      .enter()

    var u = svg.selectAll("path")
      .data(data_ready)
      .attr("id", "pie")

    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    u
      .enter()
      .append('path')
      .merge(u)
      .transition()
      .duration(1000)
      .attr('d', d3.arc()
        .innerRadius(0)
        .outerRadius(radius)
      )
      .attr('fill', function(d) {
        return (color(d.data.value.animal))
      })
      .attr("stroke", "white")
      .style("stroke-width", "1px")
      .style("opacity", 1)

    pielabels = svg
      .selectAll('#mySlices')

    pielabels
      .exit()
      .remove()

    u
      .exit()
      .remove()
  }

  svg.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  var key = function(d) {
    return d.data.label;
  };

  // ms to wait after dragging before auto-rotating
  var rotationDelay = 3000
  // scale of the globe (not the canvas element)
  var scaleFactor = 0.9
  // autorotation speed
  var degPerSec = 6
  // start angles
  var angles = {
    x: -20,
    y: 40,
    z: 0
  }
  // colors
  var colorWater = '#fff'
  var colorLand = '#111'
  var colorGraticule = '#ccc'
  var colorCountry = 'yellow'
  var animaldata = {
    'United States': {
      'total': 2000,
      'piechart': [500, 500, 500, 500]
    }
  }

  function enter(country) {
    var country = countryList.find(function(c) {
      return c.id === country.id
    })

    // Display text on hover
    current.text(country && country.name + ' killed ' + totalList[yearSelect][country.name].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' animals in ' + yearSelect || '');
  }

  function leave(country) {
    current.text('')
  }

  var current = d3.select('#current')
  var canvas = d3.select('#globe')
  var context = canvas.node().getContext('2d')
  var water = {
    type: 'Sphere'
  }
  var projection = d3.geoOrthographic().precision(0.1)
  var graticule = d3.geoGraticule10()
  var path = d3.geoPath(projection).context(context)
  var v0 // Mouse position in Cartesian coordinates at start of drag gesture.
  var r0 // Projection rotation as Euler angles at start.
  var q0 // Projection rotation as versor at start.
  var lastTime = d3.now()
  var degPerMs = degPerSec / 1000 // !!! was / 1000
  var width, height
  var land, countries
  var countryList
  var autorotate, now, diff, roation
  var currentCountry

  function setAngles() {
    var rotation = projection.rotate()
    rotation[0] = angles.y
    rotation[1] = angles.x
    rotation[2] = angles.z
    projection.rotate(rotation)
  }

  function scale() {
    width = $("#globediv").width()
    height = $("#globediv").width()
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
    fill(water, "#3296CB")
    stroke(graticule, colorGraticule)
    countries.features.forEach(function(element) {
      if (totalList[slider.value][element.country] == null) {
        fill(element, "lightgrey")
      } else {
        fill(element, myColor(totalList[slider.value][element.country]))
      }
    })
    if (currentCountry) {
      fill(currentCountry,
        colorCountry)
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
    var x = point[0],
      y = point[1]
    var x0 = p[0],
      y0 = p[1]
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

  function mouseclick() {
    var country = getCountry(this)

    var country = countryList.find(function(c) {
      return c.id === country.id
    })
    country = country.name
    update(alldata, slider.value, country, true)
  }

  update(alldata, "1961", "Netherlands", false)

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

  setAngles()

  canvas
    .call(d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended)
    )
    .on('mousemove', mousemove)
    .on('click', mouseclick)

  loadData(function(world, cList) {
    land = topojson.feature(world, world.objects.land)
    countries = topojson.feature(world, world.objects.countries)
    countryList = cList

    countries.features.forEach(function(element) {
      countryList.forEach(function(country) {
        if (element.id == country.id) {
          element.country = country.name
        }
      })
    })

    window.addEventListener('resize', scale)
    scale()
    autorotate = d3.timer(rotate)
  })

  function toColor(countryPosition) {
    return countries.features.find(function(f) {
      return f.geometry.coordinates.find(function(c1) {
        return polygonContains(c1, countryPosition) || c1.find(function(c2) {
          return polygonContains(c2, countryPosition)
        })
      })
    })
  }

  var counter_list = [10, 10000, 10000];
  var str_counter_0 = counter_list[0];
  var str_counter_1 = counter_list[1];
  var str_counter_2 = counter_list[2];
  var display_str = "";
  var display_div = document.getElementById("display_div_id");


});
