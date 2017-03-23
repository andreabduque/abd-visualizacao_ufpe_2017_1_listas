var margin = {top: 20, right: 20, bottom: 20, left: 20};
var width = 400 - margin.left - margin.right;
var height = 400 - margin.top - margin.bottom;

//Definindo margens e SVG
var mySVG = d3.select("body").append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("transform", "translate("+margin.left+ ","+margin.top +")");


//Definindo escalas
var xScale = d3.scaleLinear().domain([0,100]).range([0+margin.left,width - margin.right]);
var yScale = d3.scaleLinear().domain([0,100]).range([height - margin.top,0]);
//--------Raio maior que a margem!!!!! CORRIGIR---------
var zScale = d3.scaleLinear().domain([0, 100]).range([0, 30])

var N = getRandomInt(10, 50);
var dataset = getData(N, 0, 100);
//

//var dataset = [[0,0, 40], [0, 20, 100], [20, 0, 100], [60,60, 0]]

 //Define axis
var xAxisGroup = mySVG.append("g")
                      .attr("class","axis")
                      //.attr("transform", "translate(0,"+(height-margin.top)+")");
                      .attr("transform", "translate(" + 0  + ","+(height-margin.top)+")");

var yAxisGroup = mySVG.append("g")
                      .attr("class","axis")
                      .attr("transform", "translate("+(margin.left )+"," + 0 +")");

	   
mySVG
.selectAll("circle")
.data(dataset)
.enter()
.append("circle")
.attr("cx",function(d){return xScale(d[0]);})
.attr("cy",function(d){return yScale(d[1]);})
.attr("r",function(d){return zScale(d[2]);});

// mySVG
// .selectAll("text")
// .data(dataset)
// .enter()
// .append("text")
// .attr("x",function(d){return xScale(d[0]);})
// .attr("y",function(d){return yScale(d[1]);})
// .attr("fill","red")
// .text(function(d){return d;});


//Eixos
////.tickSize
var xAxis = d3.axisBottom(xScale).ticks(5).tickSize(0);
var yAxis = d3.axisLeft(yScale).ticks(5).tickSize(0);
xAxisGroup.call(xAxis);
yAxisGroup.call(yAxis);

//-------fazer os ticks mudarem com o numero de bolinhas------------
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