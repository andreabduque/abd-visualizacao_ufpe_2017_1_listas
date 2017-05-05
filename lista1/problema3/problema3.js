//Data arrangement
var average = [22.1, 	22.4, 	21.8,	19.7, 	17.4, 16.3, 15.8, 17.1, 17.9, 19, 20.2, 19.2];
var average_high = [27.3, 28, 27.2, 25.1, 23, 21.8, 21.8, 23.3, 23.9, 24.8, 25.9, 26.3, 24.9];
var average_low = [18.7, 18.8, 18.2, 16.3, 13.8, 12.4, 11.7, 12.8, 13.9, 15.3, 16.6, 17.7, 15.5];
var dates = ["1-Jan-12", "1-Feb-12", "1-Mar-12", "1-Apr-12", "1-May-12", "1-Jun-12", "1-Jul-12", "1-Aug-12", "1-Sep-12", "1-Oct-12", "1-Nov-12", "1-Dec-12"];

var parseTime = d3.timeParse("%d-%b-%y");

dataset_low = []
for(var i = 0; i < 12; i++){
    dataset_low.push([average_low[i] , dates[i]]);
}

dataset_avg = []
for(var i = 0; i < 12; i++){
    dataset_avg.push([average[i] , dates[i]]);
}
dataset_high = []
for(var i = 0; i < 12; i++){
    dataset_high.push([average_high[i] , dates[i]]);
}

classes = ["Low", "Avg", "High"]
dataset = [[dataset_low, "Low"], [dataset_avg, "Avg"], [dataset_high, "High"]];

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
//var min_temp = Math.min.apply(Math, average_low); -- NAO FAÇA MAIS NUNCA NA VIDA
//var max_temp = Math.max.apply(Math, average_high);
xScale = d3.scaleTime().domain([parseTime("1-Jan-12"), parseTime("1-Dec-12")]).range([0+margin.left, width - margin.right]);
yScale = d3.scaleLinear().domain([10,30]).range([height - margin.top,0 + margin.bottom]);


var xAxisGroup = mySVG.append("g")
                      .attr("class","axis")
                      .attr("transform", "translate(" + 0  + ","+margin.top+")");

var yAxisGroup = mySVG.append("g")
                      .attr("class","axis")
                      .attr("transform", "translate("+(margin.left )+"," + 0 +")");

var xAxis = d3.axisBottom(xScale).tickSize(0).tickPadding(-20).ticks(11).tickFormat(d3.timeFormat("%b"));
var yAxis = d3.axisRight(yScale).tickSize(width-margin.left - margin.right).tickPadding(-width).ticks(8);

xAxisGroup.call(xAxis);
yAxisGroup.call(yAxis);

//Drawing function lines
//Line colors
colorLineScale = d3.scaleOrdinal()
                    .domain(classes)
                    .range(["steelblue","Khaki","LightCoral"]);

//Circle colors
circleScale = d3.scaleOrdinal()
                    .domain(classes)
                    .range(["#294a66","#8c8012","#5b0b0b"]);

//Line function
var linePath =  d3.line().curve(d3.curveLinear)
                          .x(function(d) {return xScale(parseTime(d[1])); })
                          .y(function(d) {return yScale(d[0]); });
//Drawing Lines
mySVG.selectAll(".line")
      .data(dataset)
      .enter()
      .append("path")
      .attr("class", "line")
      .style("stroke", function(d) {return colorLineScale(d[1]); })
      .attr("d", function (d){ return linePath( d[0].map(function(pair){ return pair;}));});

//Drawing circles
mySVG.selectAll(".scatter1")
      .data(dataset[0][0])
      .enter()
      .append("circle")
      .attr("class", "scatter1")
      .attr("cx", function(d) { return xScale(parseTime(d[1])); })
      .attr("cy",function(d) {return yScale(d[0]); })
      .attr("r", 2)
      .attr("fill", function(d) {return circleScale(dataset[0][1]); });

mySVG .selectAll(".scatter2")
      .data(dataset[1][0])
      .enter()
      .append("circle")
      .attr("class", "scatter2")
      .attr("cx", function(d) { return xScale(parseTime(d[1])); })
      .attr("cy",function(d) {return yScale(d[0]); })
      .attr("r", 2)
      .attr("fill", function(d) {return circleScale(dataset[1][1]); });

mySVG .selectAll(".scatter3")
      .data(dataset[2][0])
      .enter()
      .append("circle")
      .attr("class", "scatter3")
      .attr("cx", function(d) { return xScale(parseTime(d[1])); })
      .attr("cy",function(d) {return yScale(d[0]); })
      .attr("r", 2)
      .attr("fill", function(d) {return circleScale(dataset[2][1]); });
