/*
Name: Max Frings
Course: Data Processing 2018/2019 (Semester 2)
Student number: 10544429
Dataset source: https://www.clo.nl/en/indicators/en0218-ozone-layer
*/

// Wait for it ...
$( document ).ready(function() {

  // Make a HTML website without typing HTML, say what?
  d3.select("head")
    .append("title")
    .text("Bar Chart");

  d3.select("body")
    .style("text-align", "center")
    .style("font-family", "sans-serif").append("h1")
    .text("Bar Chart");

  d3.select("h1")
    .style("color", "lightblue");

  d3.select("body").append("h2")
    .text("Max Frings")
    .style("color", "lightblue");

  d3.select("body")
    .append("h3")
    .text("10544429")
    .style("color", "lightblue");

  d3.select("body")
    .append("p")
    .text("Ozone concentrations in The Netherlands and global " +
          "average throughout the years 1980 - 2012 in Dobson units");

  d3.select("body")
    .append("div")
    .attr("class", "legend")
    .attr("id", "legend-nl");

    d3.select("body")
    .append("span").text("Netherlands");

  d3.select("body")
    .append("br");

  d3.select("body")
    .append("br");

  d3.select("body")
    .append("div")
    .attr("class", "legend")
    .attr("id", "legend-world");

  d3.select("body")
    .append("span")
    .text("Global");

  d3.select("body")
    .append("br");

  // SVG width and height
  const w = 950;
  const h = 400;

  // Add padding to the bars
  const barPadding = 5;

  // Initialize empty lists and push data
  const years = [];
  const ozoneNL = [];
  const ozoneData = d3.json("data.json");
  ozoneData.then(function(data) {
    console.log(data);
    Object.values(data).forEach(function(d) {
      ozoneNL.push(d.Netherlands);
    })
    Object.keys(data).forEach(function(d) {
      years.push(d);
    }) // !!! in 1 loop of verwijder lijsten

    // Set margin and the inner width and height of the SVG
    const margin = { top: 20, right: 40, bottom: 30, left: 40 };
    const innerWidth = w - margin.right - margin.left;
    const innerHeight = h - margin.top - margin.bottom;

    // Set x and y start values to display bar chart properly
    const xStart = 20;
    const yStart = 20;
    const xAxisStart = 30;

    // Set x scale
    const xScale = d3.scaleBand()
      .domain(years)
      .range([0, innerWidth - barPadding]);

    // Set y scale
    const yScale = d3.scaleLinear()
     .domain([0, d3.max(ozoneNL)])
     .range([innerHeight+xStart,yStart]).nice();

    // Create div to show bar value on mouse hover
    const div = d3.select("body").append("div")
      .attr("class", "tooltip-donut")
      .style("opacity", 0);

    //Create SVG element
    const svg = d3.select("body")
      .append("svg")
      .attr("width", w)
      .attr("height", h);

    // Function to create bars
    function createBars(region, color)
    {

       // Create rectangle for each data point
       const rectangles = svg.selectAll("." + region)
         .data(Object.keys(data))
         .enter()
         .append("rect")
         .attr("class", region);

       // Set the x location of the rectangle
       rectangles.attr("x", function(d, i) {
                                              return i *
                                              (innerWidth/
                                              years.length) +
                                              xAxisStart;
                                           })

               // Set the y location of the rectangle
               .attr("y", function(d) {
                                         return (innerHeight +
                                                yStart -
                                                data[d][region]);
                                      })

               // Set rectangle width, height and color
               .attr("width", innerWidth / years.length - barPadding)
               .attr("height", function(d) {
                                              return data[d][region];
                                           })
               .attr("fill", color)

               // Add hover effect on mouse over
               .on('mouseover',
               function (d, i) {
                                  d3.select(
                                  this).transition()
                                 .duration('50')
                                 .attr('opacity', '.8')

                                 // Makes div appear on hover
                                 div.transition()
                                 .duration(50)
                                 .style("opacity", 1)
                                 div.html(data[d][region])
                                 .style("left", (
                                       d3.event.pageX + 10) + "px")
                                 .style("top", (
                                       d3.event.pageY - 15) + "px");
                               })

             // Disable hover effect on mouse out
             .on('mouseout',
             function (d, i) {
                               d3.select(this).transition()
                               .duration('50')
                               .attr('opacity', '1');

                               // Make the div disappear
                               div.transition()
                               .duration('50')
                               .style("opacity", 0);
                            });
    };

    // Create bar charts for The Netherlands and the world
    createBars("Netherlands", "lightblue");
    createBars("World", "#3399ff");

    // Append x axis to the SVG
    const xAxis = svg.append("g")
      .classed("xAxis", true)
      .attr('transform', `translate(${xAxisStart},${innerHeight + yStart})`) // !!! remove hardcode ??? wat hier in de translate?
      .call(d3.axisBottom(xScale))

      // Rotate the x axis tick tags so they don't overlap
      .selectAll("text")
      .attr("y", 0)
      .attr("x", 9)
      .attr("dy", ".35em")
      .attr("transform", "rotate(60)")
      .style("text-anchor", "start");

    // Append y axis to the SVG
    const yAxis = svg.append("g")
      .classed("yAxis", true)
      .attr('transform', `translate(${xAxisStart},0)`)
      .call(d3.axisLeft(yScale));

  });
});
