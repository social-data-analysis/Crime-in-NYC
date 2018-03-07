//----------------------------------------------------------------------------------------------------------------------
// HISTOGRAM
//----------------------------------------------------------------------------------------------------------------------

// Define SVG dimensions.
var histogramWidth = 600,
    histogramHeight = 500;

var padding = 40;

var firstRead = true;

var tickValues = d3.range(24);

var updatedData = [];
var allPoints = [];

// Create SVG element
var svgHistogram = d3.select(".histogram").append("svg")
  .attr("width", histogramWidth)
  .attr("height", histogramHeight);

// Process and plot data.
readFromCSV();

// Read CSV file.
function readFromCSV() {
    d3.csv("murders.csv", function(data) {
      allPoints = data;
      createBins(data);
    });
}

// Create dictionary from timestamps to count occurrences.
function createBins(data) {
  var arr = [];
  var counts = {};
  var processedData = [];
      
  // Populate array with hour values.
  for (var index in data) {
      // Ignore csv header row.
      if (data[index][0] !== 'INDEX') {
          arr.push(data[index].CMPLNT_FR_TM.substring(0, 2));
      }
  }

  // Populate dictionary.
  for (var i = 0; i < arr.length; i++) {
      var num = arr[i];
      counts[num] = counts[num] ? counts[num] + 1 : 1;
  }

  // Cnvert object into a format that can be visualized easily.
  for (var key in counts){
      if (counts.hasOwnProperty(key)) {
          if (key.substring(0, 1) === '0') {
              processedData.push({'hour': key.substring(1, 2), 'count': counts[key]});
          }
          else {
              processedData.push({'hour': key, 'count': counts[key]});
          }
          
      }
  }

  createBarPlot(processedData);
}

function createBarPlot(data) {
  var maxHRange = 0;

  // Get max value for the scale.
  data.forEach(function(d) {
      if (d.count > maxHRange) {
        maxHRange = d.count;
      }
    });

  xScale = d3.scaleBand()
    .domain(tickValues)
    .rangeRound([padding, histogramWidth - padding])
    .paddingInner(0.2);

  xAxis = d3.axisBottom()
    .scale(xScale);

  yScale = d3.scaleLinear()
    .domain([0, maxHRange])
    .range([histogramHeight - padding, padding]);

  yAxis = d3.axisLeft()
    .scale(yScale)
    .ticks(10);

  firstRead ? createRectangles(data) : updateBins(data, maxHRange);
  firstRead = false;
}

function createRectangles(data) {
  svgHistogram.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", function(d) {
      return xScale(d.hour);
    })
    .attr("y", function(d) {
      return yScale(d.count);
    })
    .attr("width", xScale.bandwidth())
    .attr("height", function(d) {
      return histogramHeight - padding - yScale(d.count);
    })
    .attr('fill', '#5da7a9');

  svgHistogram.append("g")
    .attr("class", "axisX")
    .attr("transform", "translate(0," + (histogramHeight - padding) + ")")
    .call(xAxis);

  svgHistogram.append("g")
    .attr("class", "axisY")
    .attr("transform", "translate(" + padding + ",0)")
    .call(yAxis);

  svgHistogram.append("text")
    .attr("transform", "translate(" + (histogramWidth / 2) + "," + (histogramHeight) + ")")
    .style("text-anchor", "middle")
    .style("font-size", "15px")
    .text("Hour");

  svgHistogram.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0)
    .attr("x", 0 - (histogramHeight / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .style("font-size", "15px")
    .text("Count");
}

//----------------------------------------------------------------------------------------------------------------------
// NYC MAP
//----------------------------------------------------------------------------------------------------------------------

var w = 600,
    h = 600;

var color = ["#8C5B79", "#777DA3", "#49A1B4", "#41BFA4", "#88D57F", "#E2E062"];

var svg = d3.select("body").select(".map").append("svg")
  .attr("width", w)
  .attr("height", h);

var projection = d3.geoMercator()
  .scale([50000])
  .center([-73.94, 40.70])
  .translate([w / 2, h / 2])

var path = d3.geoPath().projection(projection);

d3.json("boroughs.geojson", function(json) {
  svg.selectAll("path")
     .data(json.features)
     .enter()
     .append("path")
     .attr("d", path)
     .style("fill", function(d, i) {
       return color[i]
     })
     .style("z-index", 1);

     d3.csv("murders.csv", function(data) {
        svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function(d) {
          return projection([d.Longitude, d.Latitude])[0];
        })
        .attr("cy", function(d) {
          return projection([d.Longitude, d.Latitude])[1];
        })
        .attr("r", 2)
        .attr("class", "non_brushed")
        .style("z-index", 3)
     });
});
 
function highlightBrushedCircles() {
  if (d3.event.selection != null) {
      // revert circles to initial style
      svg.selectAll("circle").attr("class", "non_brushed");
      var brush_coords = d3.brushSelection(this);
      // style brushed circles
      svg.selectAll("circle").filter(function (){
                 var cx = d3.select(this).attr("cx"),
                     cy = d3.select(this).attr("cy");
                 return isBrushed(brush_coords, cx, cy);
             })
             .attr("class", "brushed");
            showHistogramInRealTime();
  }
}

function renderHistogram() {
  var d_brushed =  d3.selectAll(".brushed").data();
  
  // populate histogram if one or more elements is brushed
  if (d_brushed.length > 0) {
      d_brushed.forEach(dataPoint =>  updatedData.push(dataPoint))
      createBins(updatedData);
      updatedData = [];
  } else {
    createBins(allPoints);
  }
}

function showHistogramInRealTime() {
  if (!d3.event.selection) return;
  renderHistogram();
}

function displayHistogram() {
  if (!d3.event.selection) return;
  d3.select(this).call(brush.move, null);
  renderHistogram();
}

var brush = d3.brush()
  .on("brush", highlightBrushedCircles)
  .on("end", displayHistogram); 

svg.append("g")
  .call(brush);

function isBrushed(brush_coords, cx, cy) {

     var x0 = brush_coords[0][0],
         x1 = brush_coords[1][0],
         y0 = brush_coords[0][1],
         y1 = brush_coords[1][1];

    return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;
}

function updateBins(data, maxHRange) {
    svgHistogram.selectAll("rect")
      .data(data)
      .transition()
      .duration(1000)
      .attr("y", function(d) {
        return yScale(d.count);
      })
      .attr("height", function(d) {
        return histogramHeight - padding - yScale(d.count);
      });

    svgHistogram.select(".axisX")
      .transition()
      .duration(1000)
      .call(xAxis);
  
    svgHistogram.select(".axisY")
      .transition()
      .duration(1000)
      .call(yAxis);
}