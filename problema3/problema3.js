//Data arrangement
var average = [22.1, 	22.4, 	21.8,	19.7, 	17.4, 16.3, 15.8, 17.1, 17.9, 19, 20.2, 19.2];
var average_high = [27.3, 28, 27.2, 25.1, 23, 21.8, 21.8, 23.3, 23.9, 24.8, 25.9, 26.3, 24.9];
var average_low = [18.7, 18.8, 18.2, 16.3, 13.8, 12.4, 11.7, 12.8, 13.9, 15.3, 16.6, 17.7, 15.5];
var dates = [];
for(var i = 0; i < 12; i++){
    dates.push(new Date(1990, i, 1));
}

dataset = [average,average_high,average_low]

var margin = {top: 20, right: 20, bottom: 20, left: 20};
var width = 600 - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;

//Definindo margens e SVG
var mySVG = d3.select("#chart").append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("transform", "translate("+margin.left+ ","+margin.top +")");

d3.select("#chart").attr("align","left");

//min and max temperature
var min_temp = Math.min.apply(Math, average_low);
var max_temp = Math.max.apply(Math, average_high);
xScale = d3.scaleLinear().domain([new Date(1990, 0, 1), new Date(1990, 11, 1)]).range([0+margin.left, width - margin.right]);
yScale = d3.scaleLinear().domain([min_temp,max_temp]).range([height - margin.top,0 + margin.bottom]);

var xAxisGroup = mySVG.append("g")
                      .attr("class","axis")
                      //.attr("transform", "translate(0,"+(height-margin.top)+")");
                      .attr("transform", "translate(" + 10  + ","+margin.top+")");

var yAxisGroup = mySVG.append("g")
                      .attr("class","axis")
                      .attr("transform", "translate("+(margin.left )+"," + 10 +")");

var xAxis = d3.axisBottom(xScale).tickSize(0).tickValues(dates).tickFormat(d3.timeFormat("%b")).tickPadding(-15);
var yAxis = d3.axisLeft(yScale).ticks(8).tickSize(0);

xAxisGroup.call(xAxis);
yAxisGroup.call(yAxis);
