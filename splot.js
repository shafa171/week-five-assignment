//define the svg area
var margin = {top: 30, right: 10, bottom: 10, left: 10},
    width = 1200 - margin.left - margin.right,
    height = 550 - margin.top - margin.bottom;

//define the the axes of the scatter plot
var x = d3.scale.linear().range([50, width]),
    y = d3.scale.linear().range([height-20,0]);



//define the array for multi-dimensional data
var cars = []; 

//define the array to hold all lines
//var  dots = [];

//create the svg
var svg = d3.select(".chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//read the data from a file
d3.csv("cars.csv", type, function(error, data) {
    cars = data;//assign the data to the array
    drawSPlot();//draw the graph
});

//draw scatter plot
function drawSPlot(){

    //define axes
    var xAxis = d3.svg.axis()
	   .scale(x)
	   .orient("bottom");
    
    var yAxis = d3.svg.axis()
	   .scale(y)
	   .orient("left");
    
    x.domain([d3.min(cars, function(d) { return d.year; }),
			 d3.max(cars, function(d) { return d.year; })]);
    y.domain([d3.min(cars, function(d) { return d.power; }),
			d3.max(cars, function(d) { return d.power; })]);
    //draw axes
    var xPosition = height -20;
    svg.append("g")
	   .attr("class", "xaxis")
	   .attr("transform", "translate(0," + xPosition + ")")
	   .call(xAxis);

    var yPosition = 50;
    svg.append("g")
	   .attr("class", "yaxis")
	   .attr("transform", "translate(" + yPosition + ", 0)")
	   .call(yAxis);
    
    //draw dots
    for (var i=0; i<cars.length; i++) {
     
     //draw a dot
     var dot = svg.append("g")
	   .append("circle")
	   .attr("class", "dot")
	   .attr("cx", function(d) { return x(cars[i].year); })
	   .attr("cy", function(d) { return y(cars[i].power); })
	   .attr("idx", i)
	   .attr("r", 3)
    	   .style("fill", "black")
	   .on("mouseover", function(d) {
               d3.select(this).style("fill", "red").attr("r", 5);  })                  
	   .on("mouseout", function(d) {
               d3.select(this).style("fill", "black").attr("r", 3);  });                  
     
     //dots.push(dot);//push the dot to the array
    }
}


//function to coerce numerial data
function type(d) {
    d.economy = +d.economy; // coerce to number
    d.displacement = +d.displacement; // coerce to number
    d.power = +d.power; // coerce to number
    d.weight = +d.weight; // coerce to number
    d.year = +d.year;
	return d;
}
