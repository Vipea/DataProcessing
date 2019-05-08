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
    .style("font-family", "sans-serif")
    .append("h1")
    .text("Bar Chart");

  d3.select("body")
    .append("h2")
    .text("Max Frings")

  d3.select("body")
    .append("h3")
    .text("10544429")

  d3.select("body")
    .append("p")
    .text("Ozone concentrations in The Netherlands and global " +
          "average throughout the years 1980 - 2012 in Dobson units");

  d3.select("body")
    .append("div")
    .attr("class", "legend")
    .attr("id", "legend-nl");

    d3.select("body")
    .append("span")
    .text("Netherlands");

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
    .attr("id", "text-world")
    .text("Global average");

  d3.select("body")
    .append("br");

  // SVG width and height
  const w = 950;
  const h = 400;

  // Add padding to the bars
  const barPadding = 5;

  // Initialize empty lists and push data
  const ozoneData = d3.json("data.json");
  ozoneData.then(function(data) {

                                  // Find maximum value in dataset
                                  let ozoneMax = Number.NEGATIVE_INFINITY;
                                  let tmp;
                                  for (let i = Object.values(data).length - 1;
                                      i >= 0; i--) {
                                      tmp = Object.values(data)[i].Netherlands;
                                      if (tmp > ozoneMax) ozoneMax = tmp;
  };

    // Set margin and the inner width and height of the SVG
    const margin = {top: 30, right: 50, bottom: 30, left: 50};
    const innerWidth = w - margin.right - margin.left;
    const innerHeight = h - margin.top - margin.bottom;

    // Set x and y start values to display bar chart properly
    const axesLabelOffset = 8;

    // Set x scale
    const xScale = d3.scaleBand()
      .domain(Object.keys(data))
      .range([0, innerWidth]);

    // Set y scale
    const yScale = d3.scaleLinear()
     .domain([0, ozoneMax])
     .range([innerHeight,0]);

    // Create div to show bar value on mouse hover
    const div = d3.select("body").append("div")
      .attr("class", "tooltip-donut")
      .style("opacity", 0);

    //Create SVG element
    const svg = d3.select("body")
      .append("svg")
      .attr("width", w)
      .attr("height", h)
      .attr("margin-top", margin.top)
      .attr("margin-right", margin.right)
      .attr("margin-bottom", margin.bottom)
      .attr("margin-left", margin.left);

    // Function to create bars
    function createBars(region, color, xOffset)
    {

      // Create rectangle for each data point
      const rectangles = svg.selectAll("." + region)
       .data(Object.keys(data))
       .enter()
       .append("rect")
       .attr("class", region)
       .attr("fill", color);

      // Set the x location of the rectangle
      rectangles.attr("x", function(d, i) {
                                            return i *
                                            (innerWidth /
                                            Object.keys(data).length) +
                                            margin.left + ((innerWidth /
                                            Object.keys(data).length -
                                            barPadding) / 2) * xOffset +
                                            barPadding / 2;
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
                        div.html(data[d][region])
                        .style("left", (
                              d3.event.pageX + 10) + "px")
                        .style("top", (
                              d3.event.pageY - 15) + "px");
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

      // Make bars fly in with an animation
      .attr("y", h - margin.bottom)
      .transition("flyIn")
      .duration(2500)
      .delay(function (d, i) {
                               return i * 50;
                             })

      // Set rectangle height                       
      .attr("height", function(d) {
                                    return innerHeight -
                                           yScale(data[d][region]);
                                 })

               // Set the y location of the rectangle
               .attr("y", function(d) {
                                         return yScale(data[d][region]) + margin.top;
                                      })
    };

    // Create bar charts for The Netherlands and the world
    createBars("Netherlands", "lightblue", 0);
    createBars("World", "#3399ff", 1);

    // Set footer with the dataset source
    d3.select("body")
      .append("footer")
      .append("a")
      .attr("href", "https://www.clo.nl/en/indicators/en0218-ozone-layer")
      .attr("target", "_blank")
      .text("Dataset source");

    // Set title
    svg.append("text")
        .attr("x", margin.left)
        .attr("y", margin.top / 2)
        .attr("text-anchor", "left")
        .style("font-size", "14px")
        .style("font-weight", "bold")
        .text("Ozone concentration in Dobson units (DU)");

    // Append x axis to the SVG
    const xAxis = svg.append("g")
      .classed("xAxis", true)
      .attr('transform', `translate(${margin.left},
                                    ${innerHeight + margin.top})`)
      .call(d3.axisBottom(xScale))

      // Rotate the x axis tick tags so they don't overlap
      .selectAll("text")
      .attr("y", 0)
      .attr("x", 9)
      .attr("dy", ".35em")
      .attr("transform", "rotate(60)")
      .style("text-anchor", "start");

      svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", w)
    .attr("y", h - axesLabelOffset)
    .text("Years");


    // Append y axis to the SVG
    const yAxis = svg.append("g")
      .classed("yAxis", true)
      .attr('transform', `translate(${margin.left}, ${margin.top})`)
      .call(d3.axisLeft(yScale));

      svg.append("text")
          .attr("class", "y label")
          .attr("text-anchor", "end")
          .attr("y", 0)
          .attr("x", - h / 3)
          .attr("dy", ".75em")
          .attr("transform", "rotate(-90)")
          .text("Dobson units");

  });
});
