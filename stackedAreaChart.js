//Width and height
var w = 800;
var h = 500;
var padding = 20;

var dataset, xScale, yScale, xAxis, yAxis, area;  //Empty, for now

var color = ["#8C5B79", "#777DA3", "#49A1B4", "#41BFA4", "#88D57F", "#E2E062"]; //d3.scaleOrdinal(d3.schemeCategory10c);

//For converting strings to Dates
var parseTime = d3.timeParse("%b");
//For converting Dates to strings
var formatTime = d3.timeFormat("%b");

//Function for converting CSV values from strings to Dates and numbers
//We assume one column named 'Date' plus several others that will be converted to ints 
var rowConverter = function(d, i, cols) {
  //Initial 'row' object includes only date
  var row = {
    month: parseTime(d.MONTH),  //Make a new Date object for each year + month
  };
  //Loop once for each vehicle type
  for (var i = 1; i < cols.length; i++) {
    var col = cols[i];
    //If the value exists…
    if (d[cols[i]]) {
      row[cols[i]] = +d[cols[i]];  //Convert from string to int
    } else {  //Otherwise…
      row[cols[i]] = 0;  //Set to zero
    }
  }
  return row;
}

//Set up stack method
var stack = d3.stack()
    .order(d3.stackOrderDescending);  // <-- Flipped stacking order

//Load in data
d3.csv("crime_types.csv", rowConverter, function(data) {
var dataset = data;
console.log(dataset);
//Now that we know the column names in the data…
var keys = dataset.columns;
keys.shift();  //Remove first column name ('Date')
stack.keys(keys);  //Stack using what's left (the car names)
//Data, stacked
var series = stack(dataset);

// var x = d3.scaleTime()
//   .domain([new Date(2016, 0, 1), new Date(2016, 11, 31)])
//   .range([padding, w - padding * 2]);
  
// var y = d3.scaleLinear()
//   .domain([1,5])
//   .range([h, 0]);

var x = d3.scaleTime()
.domain([
 d3.min(dataset, function(d) { return d.month; }),
 d3.max(dataset, function(d) { return d.month; })
])
.range([padding, w - padding * 2]);

// console.log(d3.min(dataset, function(d) { return d.MONTH; }));

y = d3.scaleLinear()
.domain([
 0,
 d3.max(dataset, function(d) {
   var sum = 0;
   //Loops once for each row, to calculate
   //the total (sum) of sales of all vehicles
   for (var i = 0; i < keys.length; i++) {
     sum += d[keys[i]];
   };
   return sum;
 })
])
.range([h - padding, padding / 2])
.nice();

//Define axes
xAxis = d3.axisBottom()
      .scale(x)
      .ticks(12)
      .tickFormat(formatTime);
      
//Define Y axis
yAxis = d3.axisRight()
      .scale(y)
      .ticks(5);
      
// Define the div for the tooltip
var tooltip = d3.select(".stackedAreaChart").append("div")	
.attr("class", "tooltip")				
.style("opacity", 0);

//Define area generator
area = d3.area()
    .x(function(d) { return x(d.data.month); })
    .y0(function(d) { return y(d[0]); })
    .y1(function(d) { return y(d[1]); });

//Create SVG element
var svg = d3.select(".stackedAreaChart")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

//Create areas
svg.selectAll("path")
  .data(series)
  .enter()
  .append("path")
  .attr("class", "area")
  .attr("d", area)
  .attr("fill", function(d, i) {
    return color[i];
    });   

svg.selectAll('.area')
    .attr("class", function(d) {
      console.log(d);
    })
    .on("mouseover", function(d) {
      tooltip.transition()		
                .duration(200)		
                .style("opacity", .9);		
            tooltip	.html(d.key)	
                .style("left", (d3.event.pageX) + "px")		
                .style("top", (d3.event.pageY - 28) + "px");
            })					
        .on("mouseout", function(d) {		
            tooltip.transition()		
                .duration(500)		
                .style("opacity", 0);	
        });

//Create axes
svg.append("g")
  .attr("class", "axis")
  .attr("transform", "translate(0," + (h - padding) + ")")
  .call(xAxis);
svg.append("g")
  .attr("class", "axis")
  .attr("transform", "translate(" + (w - padding * 2) + ",0)")
  .call(yAxis);
});