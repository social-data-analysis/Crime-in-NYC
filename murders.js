function rect(x, y, w, h) {
  return "M"+[x,y]+" l"+[w,0]+" l"+[0,h]+" l"+[-w,0]+"z";
}

var w = 600,
    h = 600;

var color = ["#8C5B79", "#777DA3", "#49A1B4", "#41BFA4", "#88D57F", "#E2E062"];

var selection = svg.append("path")
  .attr("class", "selection")
  .attr("visibility", "hidden");

var startSelection = function(start) {
    selection.attr("d", rect(start[0], start[0], 0, 0))
      .attr("visibility", "visible");
};

var moveSelection = function(start, moved) {
  selection.attr("d", rect(start[0], start[1], moved[0]-start[0], moved[1]-start[1]));
};

var endSelection = function(start, end) {
selection.attr("visibility", "hidden");
};

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
        .style("fill", "black")
        .style("z-index", 3)
     });
});

svg.selectAll("circle")
  .on("mousedown", function() {
    console.log("Here");
    var subject = d3.select(window), parent = this.parentNode,
        start = d3.mouse(parent);
      startSelection(start);
      subject
        .on("mousemove.selection", function() {
          moveSelection(start, d3.mouse(parent));
        }).on("mouseup.selection", function() {
          endSelection(start, d3.mouse(parent));
          subject.on("mousemove.selection", null).on("mouseup.selection", null);
        });
  });
