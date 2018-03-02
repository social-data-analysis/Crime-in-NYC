var width = 605,
    height = 405;

var legendRectSize = 20;                               
var legendSpacing = 10;    

var outerRadius = width / 3;
var innerRadius = width / 4.5;

var arc = d3.arc()
  .innerRadius(innerRadius)
  .outerRadius(outerRadius);

var pie = d3.pie();

var color = ["#8C5B79", "#777DA3", "#49A1B4", "#41BFA4", "#88D57F", "#E2E062"]; //d3.scaleOrdinal(d3.schemeCategory10c);

//Create SVG element
var svg = d3.select(".doughnutChart")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

// Count the total number of crimes in each of the 5 boroughs in 2016
d3.csv("./sample_data.csv", function(error, data) {
  if (error) throw error;

  const boroughs = ["Manhattan", "Brooklyn", "Queens", "The Bronx", "Staten Island"];
  const boroughsComplaints = boroughs.map(item => 0);
  data = data.filter(item => item['CMPLNT_FR_DT'].split('/')[2] === '2015'); // keep only complaints from 2016
  let normalizedValues = [];
  data.forEach(function(complaint) {
    if (complaint["BORO_NM"] === "MANHATTAN")
      boroughsComplaints[0] += 1;
    else if (complaint["BORO_NM"] === "BROOKLYN")
      boroughsComplaints[1] += 1;
    else if (complaint["BORO_NM"] === "QUEENS")
      boroughsComplaints[2] += 1;
    else if (complaint["BORO_NM"] === "BRONX")
      boroughsComplaints[3] += 1;
    else if (complaint["BORO_NM"] === "STATEN ISLAND")
       boroughsComplaints[4] += 1;
  });
  const sum = boroughsComplaints.reduce((a, b) => a + b);
  normalizedValues = boroughsComplaints.map(val => val / sum); 
  console.log(normalizedValues);
  console.log(boroughsComplaints);
  
  //Set up groups
  var arcs = svg.selectAll("g.arc")
    .data(pie(normalizedValues))
    .enter()
    .append("g")
    .attr("class", "arc")
    .attr("transform", "translate(" + outerRadius + "," + outerRadius + ")");

  //Draw arc paths
  arcs.append("path")
    .attr("fill", function(d, i) {
    return color[i];
    })
    .attr("d", arc);

  //Labels
  arcs.append("text")
    .attr("transform", function(d) {
    return "translate(" + arc.centroid(d) + ")";
    })
    .attr("text-anchor", "middle")
    .attr("fill", "white")
    .attr("font-size", "14px")
    .text(function(d) {
    return Number(d.value).toFixed(2) * 100 + "%";
    });

  // Add legend
  var legend = svg.selectAll(".legend")                     
  .data(boroughs)                                   
  .enter()                                                
  .append("g")                                            
  .attr("class", "legend")                                
  .attr("transform", function(d, i) {                     
    var height = legendRectSize + legendSpacing;          
    var offset =  height * color.length / 2;     
    var horiz = 24 * legendRectSize;                       
    var vert = i * height + offset / 2;                      
    return "translate(" + horiz + "," + vert + ")";        
  });           
                                            
legend.append("circle")                                     
  .attr("cx", legendRectSize / 2)                          
  .attr("cy", legendRectSize / 2) 
  .attr("r", legendRectSize / 2)            
  .style("fill", function(d, i) {
    return color[i];
    });                              

legend.append("text")                                     
  .attr("x", legendRectSize + legendSpacing)              
  .attr("y", legendRectSize - legendSpacing + 6)              
  .text(function(d) { return d; });                       
})