/*
Name: Max Frings
Course: Data Processing 2018/2019 (Semester 2)
Student number: 10544429
Dataset source: https://www.clo.nl/en/indicators/en0218-ozone-layer
*/

window.onload = function() {

  console.log('Yes, you can!')
  const teensInViolentArea = "https://stats.oecd.org/SDMX-JSON/data/CWB/AUS+AUT+BEL+BEL-VLG+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LTU+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+OAVG+NMEC+BRA+BGR+CHN+COL+CRI+HRV+CYP+IND+IDN+MLT+PER+ROU+RUS+ZAF.CWB11/all?startTime=2010&endTime=2017"
  const teenPregnancies = "https://stats.oecd.org/SDMX-JSON/data/CWB/AUS+AUT+BEL+BEL-VLG+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LTU+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+OAVG+NMEC+BRA+BGR+CHN+COL+CRI+HRV+CYP+IND+IDN+MLT+PER+ROU+RUS+ZAF.CWB46/all?startTime=1960&endTime=2017"
  const GDP = "https://stats.oecd.org/SDMX-JSON/data/SNA_TABLE1/AUS+AUT+BEL+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LTU+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+EU28+EU15+OECDE+OECD+OTF+NMEC+ARG+BRA+BGR+CHN+COL+CRI+HRV+CYP+IND+IDN+MLT+ROU+RUS+SAU+ZAF+FRME+DEW.B1_GE.HCPC/all?startTime=2012&endTime=2018&dimensionAtObservation=allDimensions"
  const requests = [d3.json(teensInViolentArea), d3.json(teenPregnancies), d3.json(GDP)];

Promise.all(requests).then(function(response) {
    const teenViolData = transformResponse(response[0]);
    const teenPregData = transformResponse(response[1]);
    const GDPData = transformResponseGDP(response[2]);
    console.log("teenViolData")
    console.log(teenViolData)
    console.log("teenPregData")
    console.log(teenPregData)
    console.log("GDPData")
    console.log(GDPData)

    // SVG width and height
    const w = 950;
    const h = 400;

    const start_year = 2012
    const end_year = 2016
    const scatter_years = []

    for (i = start_year; i <= end_year; i++) {
      scatter_years.push(i)
    }

    datasets = ["teenViolence", "teenPregnancy", "GDP"]
    dataset = {};
    dataset[datasets[0]] = teenViolData;
    dataset[datasets[1]] = teenPregData;
    dataset[datasets[2]] = GDPData;
    GDP2016 = {};
    nicedata = {};
    new_dataset = {}

    data_by_group = {}
    for (i = 0; i < datasets.length; i++) {
      data_by_group[datasets[i]] = {}
    }

    years = {}



    // For each year
    for (year = start_year; year <= end_year; year++) {
      years[year] = []


      // For each country
      Object.keys(dataset["GDP"]).forEach(function(country) {
        if (dataset["teenViolence"].hasOwnProperty(country) && dataset["teenPregnancy"].hasOwnProperty(country)) {
          new_dataset = {}
          new_dataset["country"] = country

          // For each dataset
          for (i=0; i < datasets.length; i++) {

            dataset[datasets[i]][country].forEach(function(this_year) {
            if (year == this_year.Year) {
              new_dataset[datasets[i]] = this_year.Datapoint
              return
            }
            else if (year == this_year.Time) {
              new_dataset[datasets[i]] = this_year.Datapoint
              return
            }
          })
          } // closes for each dataset
          years[year].push(new_dataset)
        } // closes common countries
    }) // closes countries for each

  } // closes for each year



    // COUNTRY -> Violence/Pregnancy/GDP -> Value

    // ??? missing countries or values ?



    // console.log(GDP2016)
    var scatter_this_year = 2012

    const margin = {top: 30, right: 50, bottom: 50, left: 50};
    const innerWidth = w - margin.right - margin.left;
    const innerHeight = h - margin.top - margin.bottom;

    const yScale = d3.scaleLinear()
     .domain([0, 30]) // !!! don't hardcode
     .range([innerHeight, 0]);


   const xScale = d3.scaleLinear()
    .domain([0, 30]) // !!! don't hardcode
    .range([0, innerWidth]);

    // Create div to show value on hover
    const div = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    // Create SVG element
    var svg = d3.select("body")
                .append("svg")
                .attr("width", w)
                .attr("height", h);



    const circles = svg.selectAll("circle")
       .data(years[scatter_this_year])
       .enter()
       .append("circle")
       .attr("cx", function(d) {
            return xScale(d.teenPregnancy);
        })
        .attr("cy", function(d) {
             return yScale(d.teenViolence);
        })

        // Sets the surface area of the circle in such a way that the circle surface areas correspond with the GDP
        .attr("r", function(d) {
            return Math.sqrt(d.GDP) / 30
          })
        .attr("fill", "#3399ff");

            // Add hover effect on mouse over
            circles.on('mouseover',
            function (d, i) {
                               d3.select(
                               this).transition("barOpacity")

                              .attr('opacity', '.5')

                              // Makes div appear on hover
                              div.transition("divAppear")

                              .style("opacity", 1)
                              div.html(Math.round(d.GDP))
                              .style("left", (
                                    d3.event.pageX + 10) + "px")
                              .style("top", (
                                    d3.event.pageY - 15) + "px");
                            })

            // Disable hover effect on mouse out
            .on('mouseout', function (d, i) {
                                              d3.select(this).transition(
                                                              "barDisappear")

                                              .attr('opacity', '1');

                                              // Make the div disappear
                                              div.transition("divDisappear")

                                              .style("opacity", 0);
                                            })


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
            .text("Scatter plot of teen pregnancy rates and teen violence rates");

        // Append x axis to the SVG
        const xAxis = svg.append("g")
          .classed("xAxis", true)
          .attr('transform', `translate(${margin.left},
                                        ${innerHeight + margin.top})`)
          .call(d3.axisBottom(xScale))

          svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", w/2)
        .attr("y", h - 10)
        .text("Teen pregnancy");


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
              .text("Teen violence");

              // Create select dropdown
              var svg = d3.select("body")
              for (i = start_year; i <= end_year; i++) {
              .append("select");
            } // ??? kan dit

}).catch(function(e){
    throw(e);
});
};







//////////////////////////////////////////////////////////////////////
// ??? github layout
// ??? header load files?
function transformResponse(data){

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

    series.forEach(function(serie){
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
    strings.forEach(function(string){
        // for each observation and its index
        observation.values.forEach(function(obs, index){
            let data = dataHere[string].observations[index];
            if (data != undefined){

                // set up temporary object
                let tempObj = {};

                let tempString = string.split(":").slice(0, -1);
                tempString.forEach(function(s, indexi){
                    tempObj[varArray[indexi].name] = varArray[indexi].values[s].name;
                });

                // every datapoint has a time and ofcourse a datapoint
                tempObj["Time"] = obs.name;
                tempObj["Datapoint"] = data[0];
                tempObj["Indicator"] = originalData.structure.dimensions.series[1].values[0].name;

                // Add to total object
                if (dataObject[tempObj["Country"]] == undefined){
                  dataObject[tempObj["Country"]] = [tempObj];
                } else {
                  dataObject[tempObj["Country"]].push(tempObj);
                };
            }
        });
    });

    // return the finished product!
    return dataObject;
}

function transformResponseGDP(data){

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

    series.forEach(function(serie){
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
    strings.forEach(function(string){
        observation.values.forEach(function(obs, index){
            let data = dataHere[string];
            if (data != undefined){

                // set up temporary object
                let tempObj = {};

                // split string into array of elements seperated by ':'
                let tempString = string.split(":")
                tempString.forEach(function(s, index){
                    tempObj[varArray[index].name] = varArray[index].values[s].name;
                });

                tempObj["Datapoint"] = data[0];

                // Add to total object
                if (dataObject[tempObj["Country"]] == undefined){
                  dataObject[tempObj["Country"]] = [tempObj];
                } else if (dataObject[tempObj["Country"]][dataObject[tempObj["Country"]].length - 1]["Year"] != tempObj["Year"]) {
                    dataObject[tempObj["Country"]].push(tempObj);
                };

            }
        });
    });

    // return the finished product!
    return dataObject;
}
