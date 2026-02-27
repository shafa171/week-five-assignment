// splot.js (D3 v3) - Scatter Plot (Coordinated + Bonus dropdown updates)
// Exposes:
//   window.renderScatter(data, svgSelector, xKey, yKey)
//   window.updateScatterAxes(xKey, yKey)

var sp = {}; // namespace

window.renderScatter = function(data, svgSelector, xKey, yKey) {
  sp.data = data;
  sp.svgSelector = svgSelector;

  var margin = {top: 30, right: 10, bottom: 45, left: 55},
      outerW = 520,
      outerH = 450;

  sp.margin = margin;
  sp.outerW = outerW;
  sp.outerH = outerH;
  sp.width  = outerW - margin.left - margin.right;
  sp.height = outerH - margin.top - margin.bottom;

  // clear
  d3.select(svgSelector).selectAll("*").remove();

  sp.root = d3.select(svgSelector)
    .attr("width", outerW)
    .attr("height", outerH)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // scales + axes
  sp.x = d3.scale.linear().range([0, sp.width]);
  sp.y = d3.scale.linear().range([sp.height, 0]);
  sp.xAxis = d3.svg.axis().scale(sp.x).orient("bottom");
  sp.yAxis = d3.svg.axis().scale(sp.y).orient("left");

  sp.xG = sp.root.append("g")
    .attr("class", "xaxis")
    .attr("transform", "translate(0," + sp.height + ")");

  sp.yG = sp.root.append("g")
    .attr("class", "yaxis");

  // labels
  sp.xLabel = sp.root.append("text")
    .attr("text-anchor", "middle")
    .attr("x", sp.width / 2)
    .attr("y", sp.height + 35);

  sp.yLabel = sp.root.append("text")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .attr("x", -sp.height / 2)
    .attr("y", -40);

  // first draw
  updateScatterInternal(xKey, yKey, true);
};

function updateScatterInternal(xKey, yKey, first) {
  sp.xKey = xKey;
  sp.yKey = yKey;

  // coerce
  sp.data.forEach(function(d) {
    d[xKey] = +d[xKey];
    d[yKey] = +d[yKey];
  });

  sp.x.domain(d3.extent(sp.data, function(d){ return d[xKey]; })).nice();
  sp.y.domain(d3.extent(sp.data, function(d){ return d[yKey]; })).nice();

  sp.xG.call(sp.xAxis);
  sp.yG.call(sp.yAxis);

  sp.xLabel.text(xKey);
  sp.yLabel.text(yKey);

  var dots = sp.root.selectAll("circle")
    .data(sp.data, function(d){ return d.__id__; });

  // enter
  dots.enter().append("circle")
    .attr("class", "sp-dot")
    .attr("data-id", function(d){ return d.__id__; })
    .attr("r", 3)
    .on("mouseover", function(d){
      if (window.highlightById) window.highlightById(d.__id__);
    })
    .on("mouseout", function(d){
      if (window.unhighlightById) window.unhighlightById(d.__id__);
    });

  // update positions
  if (first) {
    dots.attr("cx", function(d){ return sp.x(d[xKey]); })
        .attr("cy", function(d){ return sp.y(d[yKey]); });
  } else {
    sp.root.selectAll("circle")
      .transition().duration(300)
      .attr("cx", function(d){ return sp.x(d[xKey]); })
      .attr("cy", function(d){ return sp.y(d[yKey]); });
  }

  dots.exit().remove();
}

window.updateScatterAxes = function(xKey, yKey) {
  updateScatterInternal(xKey, yKey, false);
};
