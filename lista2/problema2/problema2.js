var random = d3.randomNormal(0, 0.2),
    sqrt3 = Math.sqrt(3),
    points0 = d3.range(300).map(function() { return [random() + sqrt3, random() + 1, 0]; }),
    points1 = d3.range(300).map(function() { return [random() - sqrt3, random() + 1, 1]; }),
    points2 = d3.range(300).map(function() { return [random(), random() - 1, 2]; }),
    points = d3.merge([points0, points1, points2]);


var margin = {top: 20, right: 20, bottom: 20, left: 20};
var width = 300 - margin.left - margin.right;
var height = 300 - margin.top - margin.bottom;

//Definindo margens e SVG
var mySVG = d3.select("body").append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("transform", "translate("+margin.left+ ","+margin.top +")");

var xMin = d3.min(points.map( function(d){
      return d[0];
  }
));
var xMax = d3.max(points.map( function(d){
      return d[0];
  }
));
var yMin = d3.min(points.map( function(d){
      return d[1];
  }
));
var yMax = d3.max(points.map( function(d){
      return d[1];
  }
));
var classes = points.map( function(d){
  return d[2];
}
);

var xScale = d3.scaleLinear().range([0,width]).domain([Math.floor(xMin), Math.ceil(xMax)]);
var yScale = d3.scaleLinear().range([height, 0]).domain([Math.floor(yMin), Math.ceil(yMax)]);
var zScale = d3.scaleLinear().range(["red", "yellow", "blue"]).domain([0,1,2]);

//Define axis
var xAxisGroup = mySVG.append("g")
                      .attr("class","axis")
                      //.attr("transform", "translate(0,"+(height-margin.top)+")");
                      .attr("transform", "translate(" + margin.left  + ","+(height)+")");

var yAxisGroup = mySVG.append("g")
                      .attr("class","axis")
                      .attr("transform", "translate("+(margin.left )+"," + 0 +")");

mySVG
.selectAll("circle")
.data(points)
.enter()
.append("circle")
.attr("cx",function(d){return xScale(d[0]);})
.attr("cy",function(d){return yScale(d[1]);})
.attr("r", 2)
.attr("fill", function(d){return zScale(d[2]);});

var xAxis = d3.axisBottom(xScale);
var yAxis = d3.axisLeft(yScale);

xAxisGroup.call(xAxis);
yAxisGroup.call(yAxis);
