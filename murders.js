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
        .style("fill", "black")
        .style("z-index", 3)
     });
});
