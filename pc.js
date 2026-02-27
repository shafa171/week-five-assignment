// pc.js (D3 v3) - Parallel Coordinates for Task 1
// Exposes: window.renderPC(data, svgSelector)

window.renderPC = function(data, svgSelector) {
  var margin = {top: 30, right: 10, bottom: 10, left: 10},
      outerW = 520,
      outerH = 450,
      width  = outerW - margin.left - margin.right,
      height = outerH - margin.top - margin.bottom;

  // Clear target svg
  d3.select(svgSelector).selectAll("*").remove();

  // Root group
  var svg = d3.select(svgSelector)
    .attr("width", outerW)
    .attr("height", outerH)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Coerce numeric values where possible (keeps your original behavior)
  data.forEach(function(d) {
    for (var k in d) {
      if (k !== "name") {
        var v = +d[k];
        if (!isNaN(v)) d[k] = v;
      }
    }
  });

  // Scales
  var x = d3.scale.ordinal().rangePoints([0, width], 1);
  var y = {};

  var line = d3.svg.line()
    .x(function(d) { return d.x; })
    .y(function(d) { return d.y; })
    .interpolate("linear");

  var axis = d3.svg.axis().orient("left");

  // Dimensions: all numeric columns except "name"
  var dimensions = d3.keys(data[0]).filter(function(dim) {
    if (dim === "name") return false;

    // only keep dimensions that are numeric in the data
    var ok = data.some(function(p) { return !isNaN(+p[dim]); });
    if (!ok) return false;

    y[dim] = d3.scale.linear()
      .domain(d3.extent(data, function(p) { return +p[dim]; }))
      .range([height, 0]);

    return true;
  });

  x.domain(dimensions);

  // Draw polylines (one per row)
  data.forEach(function(row) {
    var lineData = dimensions.map(function(dim) {
      return { x: x(dim), y: y[dim](+row[dim]) };
    });

    svg.append("path")
      .attr("class", "pc-line")
      .attr("d", line(lineData))
      .on("mouseover", function() {
        d3.select(this).style("stroke", "red").style("stroke-width", 3).style("opacity", 1);
      })
      .on("mouseout", function() {
        d3.select(this).style("stroke", "#666").style("stroke-width", 1).style("opacity", 0.35);
      });
  });

  // Axes
  var g = svg.selectAll(".dimension")
    .data(dimensions)
    .enter().append("g")
    .attr("class", "dimension")
    .attr("transform", function(d) { return "translate(" + x(d) + ")"; });

  g.append("g")
    .attr("class", "axis")
    .each(function(d) { d3.select(this).call(axis.scale(y[d])); })
    .append("text")
    .style("text-anchor", "middle")
    .attr("y", -9)
    .text(function(d) { return d; });
};
