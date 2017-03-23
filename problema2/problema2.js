var margin = {top: 20, right: 30, bottom: 20, left: 30};
var width = 500- margin.left - margin.right;
var height = 350 - margin.top - margin.bottom;

//Definindo margens e SVG
var mySVG = d3.select("body").append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("transform", "translate("+margin.left+ ","+margin.top +")");


//Definindo escalas
var xScale = d3.scaleLinear().domain([0,100]).range([0,width]);
var yScale = d3.scaleLinear().domain([0,100]).range([height,0]);

var dataset = [[50,95, "Brasil"],[5000,25, "Brasil"],[50,50, "EUA"],[30,20, "Argentina"],[10,64, "EUA"],[27,39, "UK"]];

 //Define axis
var xAxisGroup = mySVG.append("g")
                      .attr("class","axis")
                      //.attr("transform", "translate(0,"+(height-margin.top)+")");
                      .attr("transform", "translate(" + 20  + ","+(height-margin.top)+")");

var yAxisGroup = mySVG.append("g")
                      .attr("class","axis")
                      .attr("transform", "translate("+(margin.left )+"," + -10 +")");

	   
mySVG
.selectAll("circle")
.data(dataset)
.enter()
.append("circle")
.attr("r","5")
.attr("cx",function(d){return xScale(d[0]);})
.attr("cy",function(d){return yScale(d[1]);});

mySVG
.selectAll("text")
.data(dataset)
.enter()
.append("text")
.attr("x",function(d){return xScale(d[0]);})
.attr("y",function(d){return yScale(d[1]);})
.attr("fill","red")
.text(function(d){return d;});


//Eixos
////.tickSize
var xAxis = d3.axisBottom(xScale).ticks(5).tickSize(0);
var yAxis = d3.axisLeft(yScale).ticks(5).tickSize(0);
xAxisGroup.call(xAxis);
yAxisGroup.call(yAxis);

//remove 0 from xAxis
xAxisGroup.selectAll(".tick")
    .each(function (d, i) {
        if ( d == 0 ) {
            this.remove();
        }
    });

//remove 0 from yAxis
yAxisGroup.selectAll(".tick")
    .each(function (d, i) {
        if ( d == 0 ) {
            this.remove();
        }
    });