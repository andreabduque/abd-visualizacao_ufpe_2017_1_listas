
var margin = {top: 20, right: 20, bottom: 20, left: 20};
var width = 300 - margin.left - margin.right;
var height = 300 - margin.top - margin.bottom;

//Definindo margens e SVG
var mySVG = d3.select("body").append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("transform", "translate("+margin.left+ ","+margin.top +")");

xDomain = [-3,3];
yDomain = [-2,2];
var xScale = d3.scaleLinear().range([0,width]).domain(xDomain);
var yScale = d3.scaleLinear().range([height, 0]).domain(yDomain);
var zScale = d3.scaleLinear().range(["red", "yellow", "blue"]).domain([0,1,2]);

//Define axis
var xAxisGroup = mySVG.append("g")
                      .attr("class","xAxis")
                      //.attr("transform", "translate(0,"+(height-margin.top)+")");
                      .attr("transform", "translate(" + margin.left  + ","+(height)+")");

var yAxisGroup = mySVG.append("g")
                      .attr("class","yAxis")
                      .attr("transform", "translate("+(margin.left )+"," + 0 +")");

var circleGroup = mySVG
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


mySVG.append("g").call(d3.brush().extent([[0, 0], [width, height]]).on("brush", brushMoved).on("end", brushEnded));

var selectedData = [];
function brushMoved(){
  selectedData = [];
  var screenSelection = d3.event.selection;
  mySVG.selectAll("circle").attr("fill", function(d){
      var x = xScale(d[0]);
      var y = yScale(d[1]);

      if(screenSelection[0][0]<= x && x <= screenSelection[1][0] &&
  		   screenSelection[0][1]<= y && y <= screenSelection[1][1]){
           selectedData.push(d);
           return "brown";
      }
      else{
          return zScale(d[2]);
      }
  });
}
function brushEnded(){
    var screenSelection = d3.event.selection;

    if(!screenSelection){
      mySVG.selectAll("circle").attr("fill", function(d){
          return zScale(d[2]);
      });

      if(selectedData.length){
        console.log("selecionou isso:")
        console.log(selectedData);
        //Update X
        min_new = d3.min(selectedData.map( function(d){
              return d[0]; }
        ));
        max_new = d3.max(selectedData.map( function(d){
              return d[0]; }
        ));
        console.log([min_new, max_new]);
        xScale.domain([Math.floor(min_new), Math.ceil(max_new)]);
        xAxisGroup.call(xAxis)
        //Update Y
        min_new = d3.min(selectedData.map( function(d){
              return d[1]; }
        ));
        max_new = d3.max(selectedData.map( function(d){
              return d[1]; }
        ));
        yScale.domain([Math.floor(min_new), Math.ceil(max_new)]);
        yAxisGroup.call(yAxis)
      }
      else{
        xScale.domain(xDomain);
        xAxisGroup.call(xAxis)
        yScale.domain(yDomain);
        yAxisGroup.call(yAxis)
      }
      selectedData = [];
    }else{
        console.log("nenhuma selecao");
    }

    mySVG.selectAll("circle")
      .attr("cx", function(d) { return xScale(d[0]); })
      .attr("cy", function(d) { return yScale(d[1]); });

}
