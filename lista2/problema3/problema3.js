var width = 960,
    size = 184,
    padding = 35,
    n = 5;

var x = d3.scaleLinear()
    .range([padding / 2, size - padding / 2]);

var y = d3.scaleLinear()
    .range([size - padding / 2, padding / 2]);

var xAxis = d3.axisBottom(x).ticks(4).tickSize(size*n).tickFormat(d3.format(".2s"));
var yAxis = d3.axisLeft(y).ticks(4).tickSize(-size*n).tickFormat(d3.format(".2s"));
// xAxisGroup.call(xAxis);
// yAxisGroup.call(yAxis);

color = d3.scaleOrdinal(d3.schemeCategory10);

//Reading data
d3.json("egrid2010.json", function(egrid) {

  var domainByFuel = {};
  var classes =  d3.map(egrid, function(d){
      return d.fuel;
    }).keys();

    classes.forEach(function(cl) {
      domainByFuel[cl] = egrid.filter(function(d){return d.fuel==cl;});
    });

    color.domain(classes);

    var domainByTrait = {};
    var traits = d3.keys(egrid[0]).filter(function(d) { return d != "fuel" && d != "age"; });
    traits.forEach(function(trait) {
      domainByTrait[trait] = d3.extent(egrid, function(d) { return d[trait]; });
    });

    var mySVG = d3.select("body").append("svg")
      .attr("width", size*n + padding)
      .attr("height", size*n + padding)
      .append("g")
      .attr("transform", "translate(" + padding + "," + padding / 2 + ")");

    mySVG.selectAll(".x.axis")
    .data(traits)
    .enter().append("g")
    .attr("class", "x axis")
    .attr("transform", function(d, i) { return "translate(" + (n - i - 1)*size + ",0)"; })
    .each(function(d) { x.domain(domainByTrait[d]); d3.select(this).call(xAxis); });

    mySVG.selectAll(".y.axis")
    .data(traits)
    .enter().append("g")
    .attr("class", "y axis")
    .attr("transform", function(d, i) { return "translate(0," + i*size + ")"; })
    .each(function(d) {y.domain(domainByTrait[d]); d3.select(this).call(yAxis); });

    var cell = mySVG.selectAll(".cell")
      .data(cross(traits, traits))
      .enter().append("g")
      .attr("class", "cell")
      .attr("transform", function(d) { return "translate(" + (n - d.i - 1) * size + "," + d.j * size + ")"; })
      .each(plot);

      // Titles for the diagonal.
  cell.filter(function(d) { return d.i === d.j; }).append("text")
      .attr("x", padding)
      .attr("y", padding)
      .attr("dy", ".71em")
      .text(function(d) { return d.x; });

  function plot(p) {
    var cell = d3.select(this);

    x.domain(domainByTrait[p.x]);
    y.domain(domainByTrait[p.y]);

    cell.append("rect")
        .attr("class", "frame")
        .attr("x", padding / 2)
        .attr("y", padding / 2)
        .attr("width", size - padding)
        .attr("height", size - padding);

    cell.selectAll("circle")
        .data(egrid)
        .enter().append("circle")
        .attr("cx", function(d) { return x(d[p.x]); })
        .attr("cy", function(d) { return y(d[p.y]); })
        .attr("r", 4)
        .style("fill",
            function(d) { return color(d.fuel);
             });
   }


});

function cross(a, b) {
  var c = [], n = a.length, m = b.length, i, j;
  for (i = -1; ++i < n;) for (j = -1; ++j < m;) c.push({x: a[i], i: i, y: b[j], j: j});
  return c;
}
