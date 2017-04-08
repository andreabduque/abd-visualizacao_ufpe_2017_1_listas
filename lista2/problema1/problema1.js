var carriers = ["Gol", "Tam", "Azul"]
function count_trip(trips){
  ntrips = [{carrier: "Gol", count:0 }, {carrier: "Tam", count:0 }, {carrier: "Azul", count:0 }];
  for(i = 0; i < trips.length; i++){
    for (j = 0; j < ntrips.length; j++) {
      if(ntrips[j].carrier == trips[i].carrier){
        ntrips[j].count += 1;
      }
    }
  }
  console.log("done");
  return ntrips;
};

var margin = {top: 20, right: 20, bottom: 20, left: 30};
var width = 300 - margin.left - margin.right;
var height = 300 - margin.top - margin.bottom;
//Definindo margens e SVG
var mySVG = d3.select("#histogram").append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("transform", "translate("+margin.left+ ","+margin.top +")");

//histogram scales
x = d3.scaleBand()
      .rangeRound([0, width])
      .padding(0.1)
      .domain(carriers);
y = d3.scaleLinear().rangeRound([height, 0]).domain([0, trips.length]);

var ntrips = count_trip(trips)
var bar = mySVG.selectAll(".bar")
      .data(ntrips)
      .enter()
      .append("g")
      .attr("class", "bar");

bar.append("rect")
.attr("x", function(d) { return x(d.carrier); })
.attr("y", function(d) { return y(d.count); })
.attr("width", x.bandwidth())
.attr("height", function(d) { return height - y(d.count); });

bar.append("text")
  .attr("dy", ".90em")
  .attr("y", function(d){ return y(d.count);})
  .attr("x", function(d) { return x(d.carrier) + x.bandwidth()/2; })
  .attr("text-anchor", "middle")
  .text(function(d) { return d.count; });

// add the x Axis
mySVG.append("g")
    .attr("transform", "translate(0," + height + ")")
    .attr("class", "axis--x")
    .call(d3.axisBottom(x));


// // add the y Axis
// mySVG.append("g")
//     .call(d3.axisLeft(y));
