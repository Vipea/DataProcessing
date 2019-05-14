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

    new_dataset = {}
    Object.keys(dataset["GDP"]).forEach(function(country) {
      if (dataset["teenViolence"].hasOwnProperty(country) && dataset["teenPregnancy"].hasOwnProperty(country)) {
        new_dataset[country] = {}
      }
    })

    // For each year
    for (year = start_year; year <= end_year; year++) {
      years[year] = []


      // For each country
      Object.keys(dataset["GDP"]).forEach(function(country) {
        if (dataset["teenViolence"].hasOwnProperty(country) && dataset["teenPregnancy"].hasOwnProperty(country)) {

          // For each dataset
          for (i=0; i < datasets.length; i++) {

            dataset[datasets[i]][country].forEach(function(this_year) {
            if (year == this_year.Year) {
              console.log("INCLUDE THIS " + datasets[i] + " VALUE OF " + country + " IN THE YEAR " + this_year.Year)
              new_dataset[country][datasets[i]] = this_year.Datapoint
              console.log(this_year.Datapoint)
              return
            }
            else if (scatter_years.includes(parseInt(this_year.Time))) {
              console.log("INCLUDE THIS " + datasets[i] + " VALUE OF " + country + " IN THE YEAR " + this_year.Time)
              new_dataset[country][datasets[i]] = this_year.Datapoint
              console.log(this_year.Datapoint)
              return
            }
          })
          } // closes for each dataset
        } // closes common countries
    }) // closes countries for each
    years[year].push(new_dataset)
  } // closes for each year
  console.log(years)

    exit()



    // COUNTRY -> Violence/Pregnancy/GDP -> Value

    // ??? missing countries or values ?

    countries_in_common = []

    Object.keys(dataset["GDP"]).forEach(function(country) {
      if (dataset["teenViolence"].hasOwnProperty(country) && dataset["teenPregnancy"].hasOwnProperty(country)) {
        countries_in_common.push(country)
        new_dataset[country] = years


        // Put all values in their place within the new_dataset
        for (i=0; i < datasets.length; i++) {

          // tester = 0

            dataset[datasets[i]][country].forEach(function(this_year) {
              // tester++
              // if (tester == 30) {
              //   exit()
              // }
              if (scatter_years.includes(parseInt(this_year.Year))) {
                console.log("INCLUDE THIS " + datasets[i] + " VALUE OF " + country + " IN THE YEAR " + this_year.Year)
                new_dataset[country][this_year.Year][datasets[i]] = this_year.Datapoint
                console.log(this_year.Datapoint)
              }
              else if (scatter_years.includes(parseInt(this_year.Time))) {
                console.log("INCLUDE THIS " + datasets[i] + " VALUE OF " + country + " IN THE YEAR " + this_year.Time)
                new_dataset[country][this_year.Time][datasets[i]] = this_year.Datapoint
                console.log(this_year.Datapoint)
              }
            })
        }
      }
      // {YEAR: [ COUNTRY: {}
        //
    }) // end for each country
    console.log(new_dataset)
    console.log([dataset.GDP])
    console.log([dataset.teenViolence])

    // console.log(GDP2016)

    //Create SVG element
    var svg = d3.select("body")
                .append("svg")
                .attr("width", w)
                .attr("height", h);

    svg.selectAll("circle")
       .data(Object.keys(dataset))
       .enter()
       .append("circle")
       // .attr("cx", function(d) {
       //      return d[0];
       //  })
       //  .attr("cy", function(d) {
       //       return d[1];
       //  })
       //  .attr("r", 5);

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
