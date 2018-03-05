var w = 605,
    h = 405;

var networkData = {
nodes: [ { name: "Manhattan" }, { name: "Brooklyn" }, { name: "Queens" },
         { name: "The Bronx" }, { name: "Staten Island" }
       ],
edges: [ { source: 0, target: 1 }, { source: 0, target: 2 }, { source: 0, target: 3 }, { source: 0, target: 4 }, { source: 1, target: 3 },
         { source: 2, target: 3 }, { source: 2, target: 4 }, { source: 3, target: 4 }, ]
};

var svgNetwork = d3.select(".network").append("svg")
  .attr("width", w)
  .attr("height", h);

var force = d3.forceSimulation(networkData.nodes).force("charge", d3.forceManyBody())
  .force("link", d3.forceLink(networkData.edges))
  .force("center", d3.forceCenter().x(w/2).y(h/2));

var edges = svgNetwork.selectAll("line").data(networkData.edges)
   .enter()
   .append("line")
   .style("stroke", "#ccc")
   .style("stroke-width", 1);

var nodes = svgNetwork.selectAll("circle").data(networkData.nodes)
  .enter()
  .append("circle")
  .attr("r", 10)
  .style("fill", function(d, i) {
    return color[i];
  })
  .call(d3.drag()
  .on("drag", dragging)
  .on("end", dragEnded)
  );

function dragStarted(d) {
  if (!d3.event.active) force.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragging(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragEnded(d) {
  if (!d3.event.active) force.alphaTarget(0); d.fx = null;
  d.fy = null;
}


force.on("tick", function() {
  edges.attr("x1", function(d) {
    return d.source.x;
  })
  .attr("y1", function(d) {
    return d.source.y;
  })
  .attr("x2", function(d) {
    return d.target.x;
  })
  .attr("y2", function(d) {
    return d.target.y;
  });

  nodes.attr("cx", function(d) {
    return d.x;
  })
  .attr("cy", function(d) {
    return d.y; });
});

// nodes.append("title").text(function(d) {
//   return d.name;
// });
