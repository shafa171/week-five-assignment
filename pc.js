// pc.js (D3 v3) - Parallel Coordinates (Coordinated)
// Exposes: window.renderPC(data, svgSelector)

window.renderPC = function(data, svgSelector) {
  var margin = {top: 30, right: 10, bottom: 10, left: 10},
      outerW = 520,
      outerH = 450,
      width  = outerW - margin.left - margin.right,
      height = outerH - margin.top - margin.bottom;

  d3.select(svgSelector).selectAll("*").remove();

  var svg = d3.select(svgSelector)
    .attr("width", outerW)
    .attr("height", outerH)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Coerce numeric values for all keys except name/__id__
  data.forEach(function(d) {
    for (var k in d) {
      if (k !== "name" && k !== "__id__") {
        var v = +d[k];
        if (!isNaN(v)) d[k] = v;
      }
    }
  });

  var x = d3.scale.ordinal().rangePoints([0, width], 1);
  var y = {};

  var line = d3.svg.line()
    .x(function(d) { return d.x; })
    .y(function(d) { return d.y; })
    .interpolate("linear");

  var axis = d3.svg.axis().orient("left");

  // Use numeric dimensions only
  var dimensions = d3.keys(data[0]).filter(function(dim) {
    if (dim === "name" || dim === "__id__") return false;

    var ok = data.some(function(p) { return !isNaN(+p[dim]); });
    if (!ok) return false;

    y[dim] = d3.scale.linear()
      .domain(d3.extent(data, function(p) { return +p[dim]; }))
      .range([height, 0]);

    return true;
  });

  x.domain(dimensions);

  // Draw one polyline per row + add data-id for coordination
  data.forEach(function(row) {
    var lineData = dimensions.map(function(dim) {
      return { x: x(dim), y: y[dim](+row[dim]) };
    });

    svg.append("path")
      .attr("class", "pc-line")
      .attr("data-id", row.__id__)
      .attr("d", line(lineData))
      .on("mouseover", function() {
        if (window.highlightById) window.highlightById(row.__id__);
      })
      .on("mouseout", function() {
        if (window.unhighlightById) window.unhighlightById(row.__id__);
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
