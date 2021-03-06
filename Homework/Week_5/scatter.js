/*
Name: Max Frings
Course: Data Processing 2018/2019 (Semester 2)
Student number: 10544429
Dataset source: https://data.oecd.org/
*/

window.onload = function() {
  const teensInViolentArea = "https://stats.oecd.org/SDMX-JSON/data/CWB/AUS+AUT+BEL+BEL-VLG+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LTU+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+OAVG+NMEC+BRA+BGR+CHN+COL+CRI+HRV+CYP+IND+IDN+MLT+PER+ROU+RUS+ZAF.CWB11/all?startTime=2010&endTime=2017"
  const teenPregnancies = "https://stats.oecd.org/SDMX-JSON/data/CWB/AUS+AUT+BEL+BEL-VLG+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LTU+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+OAVG+NMEC+BRA+BGR+CHN+COL+CRI+HRV+CYP+IND+IDN+MLT+PER+ROU+RUS+ZAF.CWB46/all?startTime=1960&endTime=2017"
  const GDP = "https://stats.oecd.org/SDMX-JSON/data/SNA_TABLE1/AUS+AUT+BEL+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LTU+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+EU28+EU15+OECDE+OECD+OTF+NMEC+ARG+BRA+BGR+CHN+COL+CRI+HRV+CYP+IND+IDN+MLT+ROU+RUS+SAU+ZAF+FRME+DEW.B1_GE.HCPC/all?startTime=2010&endTime=2018&dimensionAtObservation=allDimensions"
  const requests = [d3.json(teensInViolentArea), d3.json(teenPregnancies), d3.json(GDP)];

  Promise.all(requests).then(function(response) {
    const teenViolData = transformResponse(response[0]);
    const teenPregData = transformResponse(response[1]);
    const GDPData = transformResponseGDP(response[2]);

    // Configure dataset
    datasets = ["teenViolence", "teenPregnancy", "GDP"];
    dataset = {};
    dataset[datasets[0]] = teenViolData;
    dataset[datasets[1]] = teenPregData;
    dataset[datasets[2]] = GDPData;

    // Set constants
    const w = 1400;
    const h = 500;
    const start_year = 2010;
    const end_year = 2014;
    let scatter_this_year = 2010;
    const margin = {
      top: 30,
      right: 50,
      bottom: 50,
      left: 50
    };
    const innerWidth = w - margin.right - margin.left;
    const innerHeight = h - margin.top - margin.bottom;

    // Structure data in a D3-friendly way
    let years = restructureData(dataset, start_year, end_year);

    // Set title and subheading
    makeTitle("Scatter Plot", "Max Frings", "10544429", "Scatter plot of " +
      "teen pregnancy and teen violence rates between " +
      "2010 - 2014 for 30 different countries. The surface area of " +
      "each data point represents the GDP of that country.");

    // Create div to show value on hover
    const div = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    // Create SVG element
    var svg = d3.select("body")
      .append("svg")
      .attr("width", w)
      .attr("height", h);

    // Create a circle datapoint per data object
    let circles = svg.selectAll(".datapoint")
      .data(years[start_year])
      .enter()
      .append("circle")
      .attr("class", "datapoint");

    // This function gets the maximum value from an object
    function getMax(arr, prop) {
      var max;
      for (var i = 0; i < arr.length; i++) {
        if (!max || parseInt(arr[i][prop]) > parseInt(max[prop]))
          max = arr[i];
      }
      return max;
    }

    // Set the y scale
    let yScale = d3.scaleLinear()
      .domain([0, getMax(years[scatter_this_year], "teenViolence").
        teenViolence
      ])
      .range([innerHeight, 0]);

    // Set the x scale
    let xScale = d3.scaleLinear()
      .domain([0, getMax(years[scatter_this_year], "teenPregnancy").
        teenPregnancy
      ])
      .range([0, innerWidth]);

    // This function creates a scatterplot
    function createScatter(scatterYear) {

      // Sets x and y location of datapoints
      svg.selectAll(".datapoint").data(years[start_year])
        .attr("cx", function(d) {
          return xScale(d.teenPregnancy) + margin.left;
        })
        .attr("cy", function(d) {
          return yScale(d.teenViolence) + margin.top;
        })

        // Sets the surface area of the circles
        .attr("r", function(d) {
          return Math.sqrt(d.GDP) / 30;
        })
        .attr("fill", "#3399ff");

      // Add hover effect on mouse over
      circles.on('mouseover',
          function(d, i) {
            d3.select(
                this).transition("barOpacity")
              .attr('opacity', '.5')

            // Makes div appear on hover
            div.transition("divAppear")
              .style("opacity", 1)
            div.html(d.country + "\n$" + Math.round(d.GDP))
              .style("left", (
                d3.event.pageX + 10) + "px")
              .style("top", (
                d3.event.pageY - 15) + "px");
          })

        // Disable hover effect on mouse out
        .on('mouseout', function(d, i) {
          d3.select(this).transition(
              "barDisappear")
            .attr('opacity', '1');

          // Make the div disappear
          div.transition("divAppear")
            .style("opacity", 0);
        });
      return;
    };

    // Set footer with the dataset source
    d3.select("body")
      .append("footer")
      .append("a")
      .attr("href", "https://data.oecd.org/")
      .attr("target", "_blank")
      .text("Dataset source");

    // Set title
    svg.append("text")
      .attr("x", margin.left)
      .attr("y", margin.top / 2)
      .attr("text-anchor", "left")
      .style("font-size", "14px")
      .style("font-weight", "bold")
      .text("Scatter plot of teen pregnancy rates and teen violence rates");

    // Append x axis to the SVG
    const xAxis = svg.append("g")
      .classed("xAxis", true)
      .attr('transform', `translate(${margin.left},
                                          ${innerHeight + margin.top})`)
      .call(d3.axisBottom(xScale));

    // Set x label
    svg.append("text")
      .attr("class", "x label")
      .attr("text-anchor", "end")
      .attr("x", w / 2)
      .attr("y", h - 10)
      .text("Adolescent fertility rate (%)");

    // Append y axis to the SVG
    const yAxis = svg.append("g")
      .classed("yAxis", true)
      .attr('transform', `translate(${margin.left}, ${margin.top})`)
      .call(d3.axisLeft(yScale));

    // Set y label
    svg.append("text")
      .attr("class", "y label")
      .attr("text-anchor", "end")
      .attr("y", 0)
      .attr("x", -40)
      .attr("dy", ".75em")
      .attr("transform", "rotate(-90)")
      .text("Children (0-17) living in areas with crime or violence (%)");

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

    // Create a legend
    svg.append("circle").attr("cx", margin.left + 30).attr("cy", margin.top + 20).attr("r", Math.sqrt(20000) / 30).style("fill", "#3399ff")
    svg.append("circle").attr("cx", margin.left + 30).attr("cy", margin.top + 50).attr("r", Math.sqrt(50000) / 30).style("fill", "#3399ff")
    svg.append("circle").attr("cx", margin.left + 30).attr("cy", margin.top + 80).attr("r", Math.sqrt(100000) / 30).style("fill", "#3399ff")
    svg.append("text").attr("x", margin.left + 50).attr("y", margin.top + 20).text("$20.000").style("font-size", "15px").attr("alignment-baseline", "middle")
    svg.append("text").attr("x", margin.left + 50).attr("y", margin.top + 50).text("$50.000").style("font-size", "15px").attr("alignment-baseline", "middle")
    svg.append("text").attr("x", margin.left + 50).attr("y", margin.top + 80).text("$100.000").style("font-size", "15px").attr("alignment-baseline", "middle")

    function changeYear(year) {

      // Update the y scale
      let yScale = d3.scaleLinear()
        .domain([0, getMax(years[year], "teenViolence").teenViolence])
        .range([innerHeight, 0]);

      // Update the x scale
      let xScale = d3.scaleLinear()
        .domain([0, getMax(years[year], "teenPregnancy").teenPregnancy])
        .range([0, innerWidth]);

      // Set the y axis
      d3.selectAll(".yAxis")
        .attr('transform', `translate(${margin.left}, ${margin.top})`)
        .call(d3.axisLeft(yScale));

      // Set the x axis
      d3.select(".xAxis")
        .attr('transform', `translate(${margin.left},
                                      ${innerHeight + margin.top})`)
        .call(d3.axisBottom(xScale))

      // Update size and location of circles using a transition
      let circles = svg.selectAll(".datapoint")
        .data(years[year])
        .transition()
        .duration(1000)
        .delay(200)
        .attr("cx", function(d) {
          return xScale(d.teenPregnancy) + margin.left;
        })
        .attr("cy", function(d) {
          return yScale(d.teenViolence) + margin.top;
        })
        .attr("r", function(d) {
          return Math.sqrt(d.GDP) / 30
        })

      // Shows the year that is currently selected
      output.innerHTML = slider.value;
    };

    // Changes the datapoint every time the slider is moved
    slider.oninput = function() {
      changeYear(this.value);
    };

    // Initialize scatterplot
    createScatter(2010)

  }).catch(function(e) {
    throw (e);
  });
};

// Sets the title and subheadings for the HTML page
function makeTitle(title1, name, studentID, subtitle) {
  d3.select("head")
    .append("title")
    .text(title1);

  d3.select("body")
    .style("text-align", "center")
    .style("font-family", "sans-serif")
    .append("h1")
    .text(title1);

  d3.select("body")
    .append("h2")
    .text(name)

  d3.select("body")
    .append("h3")
    .text(studentID)

  d3.select("body")
    .append("p")
    .text(subtitle);
}


// Restructure dataset per year so D3 can scatter the data
function restructureData(dataset, start_year, end_year) {
  years = {};

  // For each year
  for (year = start_year; year <= end_year; year++) {
    years[year] = [];

    // For each country
    Object.keys(dataset["GDP"]).forEach(function(country) {
      if (dataset["teenViolence"].hasOwnProperty(country) && dataset["teenPregnancy"].hasOwnProperty(country)) {
        new_dataset = {};
        new_dataset["country"] = country;

        // For each dataset
        for (i = 0; i < datasets.length; i++) {
          dataset[datasets[i]][country].forEach(function(this_year) {
            if (year == this_year.Year) {
              new_dataset[datasets[i]] = this_year.Datapoint;
              return;
            } else if (year == this_year.Time) {
              new_dataset[datasets[i]] = this_year.Datapoint;
              return;
            };
          });
        };
        years[year].push(new_dataset);
      };
    });
  };
  console.log(years)
  return years;
};


function transformResponse(data) {

  // Save data
  let originalData = data;

  // access data property of the response
  let dataHere = data.dataSets[0].series;

  // access variables in the response and save length for later
  let series = data.structure.dimensions.series;
  let seriesLength = series.length;

  // set up array of variables and array of lengths
  let varArray = [];
  let lenArray = [];

  series.forEach(function(serie) {
    varArray.push(serie);
    lenArray.push(serie.values.length);
  });

  // get the time periods in the dataset
  let observation = data.structure.dimensions.observation[0];

  // add time periods to the variables, but since it's not included in the
  // 0:0:0 format it's not included in the array of lengths
  varArray.push(observation);

  // create array with all possible combinations of the 0:0:0 format
  let strings = Object.keys(dataHere);

  // set up output object, an object with each country being a key and an array
  // as value
  let dataObject = {};

  // for each string that we created
  strings.forEach(function(string) {
    // for each observation and its index
    observation.values.forEach(function(obs, index) {
      let data = dataHere[string].observations[index];
      if (data != undefined) {

        // set up temporary object
        let tempObj = {};

        let tempString = string.split(":").slice(0, -1);
        tempString.forEach(function(s, indexi) {
          tempObj[varArray[indexi].name] = varArray[indexi].values[s].name;
        });

        // every datapoint has a time and ofcourse a datapoint
        tempObj["Time"] = obs.name;
        tempObj["Datapoint"] = data[0];
        tempObj["Indicator"] = originalData.structure.dimensions.series[1].values[0].name;

        // Add to total object
        if (dataObject[tempObj["Country"]] == undefined) {
          dataObject[tempObj["Country"]] = [tempObj];
        } else {
          dataObject[tempObj["Country"]].push(tempObj);
        };
      };
    });
  });

  // return the finished product!
  return dataObject;
}

function transformResponseGDP(data) {

  // Save data
  let originalData = data;

  // access data
  let dataHere = data.dataSets[0].observations;

  // access variables in the response and save length for later
  let series = data.structure.dimensions.observation;
  let seriesLength = series.length;

  // get the time periods in the dataset
  let observation = data.structure.dimensions.observation[0];

  // set up array of variables and array of lengths
  let varArray = [];
  let lenArray = [];

  series.forEach(function(serie) {
    varArray.push(serie);
    lenArray.push(serie.values.length);
  });

  // add time periods to the variables, but since it's not included in the
  // 0:0:0 format it's not included in the array of lengths
  varArray.push(observation);

  // create array with all possible combinations of the 0:0:0 format
  let strings = Object.keys(dataHere);

  // set up output array, an array of objects, each containing a single datapoint
  // and the descriptors for that datapoint
  let dataObject = {};

  // for each string that we created
  strings.forEach(function(string) {
    observation.values.forEach(function(obs, index) {
      let data = dataHere[string];
      if (data != undefined) {

        // set up temporary object
        let tempObj = {};

        // split string into array of elements seperated by ':'
        let tempString = string.split(":")
        tempString.forEach(function(s, index) {
          tempObj[varArray[index].name] = varArray[index].values[s].name;
        });

        tempObj["Datapoint"] = data[0];

        // Add to total object
        if (dataObject[tempObj["Country"]] == undefined) {
          dataObject[tempObj["Country"]] = [tempObj];
        } else if (dataObject[tempObj["Country"]][dataObject[tempObj["Country"]].length - 1]["Year"] != tempObj["Year"]) {
          dataObject[tempObj["Country"]].push(tempObj);
        };

      }
    });
  });

  return dataObject;
}
