// splot.js (D3 v3) - Scatter Plot for Task 1
// Exposes: window.renderScatter(data, svgSelector, xKey, yKey)

window.renderScatter = function(data, svgSelector, xKey, yKey) {
  var margin = {top: 30, right: 10, bottom: 45, left: 55},
      outerW = 520,
      outerH = 450,
      width  = outerW - margin.left - margin.right,
      height = outerH - margin.top - margin.bottom;

  // Clear target svg
  d3.select(svgSelector).selectAll("*").remove();

  var svg = d3.select(svgSelector)
    .attr("width", outerW)
    .attr("height", outerH)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Coerce numeric (keeps consistent behavior)
  data.forEach(function(d) {
    d[xKey] = +d[xKey];
    d[yKey] = +d[yKey];
  });

  // Scales
  var x = d3.scale.linear().range([0, width]);
  var y = d3.scale.linear().range([height, 0]);

  x.domain(d3.extent(data, function(d){ return d[xKey]; })).nice();
  y.domain(d3.extent(data, function(d){ return d[yKey]; })).nice();

  // Axes
  var xAxis = d3.svg.axis().scale(x).orient("bottom");
  var yAxis = d3.svg.axis().scale(y).orient("left");

  svg.append("g")
    .attr("class", "xaxis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  svg.append("g")
    .attr("class", "yaxis")
    .call(yAxis);

  // Axis labels (rubric)
  svg.append("text")
    .attr("text-anchor", "middle")
    .attr("x", width / 2)
    .attr("y", height + 35)
    .text(xKey);

  svg.append("text")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", -40)
    .text(yKey);

  // Dots
  svg.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "sp-dot")
    .attr("cx", function(d){ return x(d[xKey]); })
    .attr("cy", function(d){ return y(d[yKey]); })
    .attr("r", 3)
    .on("mouseover", function() {
      d3.select(this).style("fill", "red").attr("r", 5).style("opacity", 1);
    })
    .on("mouseout", function() {
      d3.select(this).style("fill", "black").attr("r", 3).style("opacity", 0.75);
    });
};
