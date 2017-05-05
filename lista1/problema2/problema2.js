var margin = {top: 20, right: 20, bottom: 20, left: 20};
var width = 300 - margin.left - margin.right;
var height = 300 - margin.top - margin.bottom;

//Definindo margens e SVG
var mySVG = d3.select("#chart").append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("transform", "translate("+margin.left+ ","+margin.top +")");

d3.select("#chart").attr("align","left");

var myButton = d3.select("#button").append("button")
									.text("Update")
								  .attr("class", "btn btn-danger btn-md");

//Button position
myButton.style("position", "absolute").style("left", "20px").style("top", "290px");

//Definindo escalas
var xScale = d3.scaleLinear().domain([0,100]).range([0+margin.left,width - margin.right]);
var yScale = d3.scaleLinear().domain([0,100]).range([height - margin.top,0 + margin.bottom]);
var zScale = d3.scaleLinear().domain([0, 100]).range([0, 10]);
var wScale = d3.scaleLinear().domain([0,100]).range(["#C4C4C4","#021664"]);

var N = getRandomInt(10, 50);
var dataset = getData(N, 0, 100);

var myNumber = d3.select("#number").append("p")
																		.attr("class", "textnumber")
																	 .text("N = " + N);


myNumber.style("position", "absolute").style("left",  margin.left + "px").style("top", "10px")

//var N = 5;
//var dataset = [[20,0, 50, 20], [40, 0, 50, 40], [60, 0, 50, 60], [80,0, 50, 80], [100,0, 50, 100]]

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
.attr("r",function(d){return zScale(d[2]);})
.attr("fill", function(d){return wScale(d[3]);});

var xAxis = d3.axisBottom(xScale).ticks(5).tickSize(4);
var yAxis = d3.axisLeft(yScale).ticks(5).tickSize(4);

xAxisGroup.call(xAxis);
yAxisGroup.call(yAxis);

//remove 0 from xAxis
xAxisGroup.selectAll(".tick")
    .each(function (d, i) {
			//console.log(i);
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

var N = myButton.on("click", function(){
											var N = getRandomInt(10, 50);
											var dataset = getData(N, 0, 100);

											var myNumber = d3.select("#number")
																			 .select("p")
																			 .text("N = " + N);

											var circles = d3.select("g")
																			.selectAll("circle")
																			.data(dataset)
											//Vendo quem ta fora e removendo
											circles.exit().transition()
															.duration(1000)
    													.attr("r", 0)
    													.remove();

											//Criando novos circulos
											circles
												.enter()
												.append("circle")
												.attr("cx",function(d){return xScale(d[0]);})
												.attr("cy",function(d){return yScale(d[1]);})
												//.attr("r", 0)
  											.transition()
												.duration(1000)
												.attr("r",function(d){return zScale(d[2]);})
												.attr("fill", function(d){return wScale(d[3]);});


												console.log(N);


										})
