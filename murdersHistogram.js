// Define SVG dimensions.
var w = 600,
    h = 600;

var padding = 40;

// Create SVG element
var svgHistogram = d3.select(".histogram").append("svg")
  .attr("width", w)
  .attr("height", h);

// Process and plot data.
readFromCSV();

// Read CSV file.
function readFromCSV() {
    d3.csv("murders.csv", function(data) {
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
    // Get max value for the scale.
    var maxHRange = 0;
    data.forEach(function(d) {
        if (d.count > maxHRange) {
          maxHRange = d.count;
        }
      });

    var tickValues = d3.range(24);

    xScale = d3.scaleBand()
      .domain(tickValues)
      .rangeRound([padding, w - padding])
      .paddingInner(0.2);
  
    xAxis = d3.axisBottom()
      .scale(xScale);
  
    yScale = d3.scaleLinear()
      .domain([0, maxHRange])
      .range([h - padding, padding]);
  
    yAxis = d3.axisLeft()
      .scale(yScale)
      .ticks(10);

    createRectangles(data);
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
        return h - padding - yScale(d.count);
      })
      .attr('fill', '#5da7a9');
  
    svgHistogram.append("g")
      .attr("class", "axisX")
      .attr("transform", "translate(0," + (h - padding) + ")")
      .call(xAxis);
  
    svgHistogram.append("g")
      .attr("class", "axisY")
      .attr("transform", "translate(" + padding + ",0)")
      .call(yAxis);

    svgHistogram.append("text")
      .attr("transform", "translate(" + (w / 2) + "," + (h) + ")")
      .style("text-anchor", "middle")
      .style("font-size", "15px")
      .text("Hour");
  
    svgHistogram.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0)
      .attr("x", 0 - (h / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("font-size", "15px")
      .text("Count");
}