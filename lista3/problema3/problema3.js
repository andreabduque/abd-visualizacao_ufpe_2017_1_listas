//Width and height
var w = 1500;
var h = 1300;

var projection = d3.geoAlbersUsa()
                  .translate([w/2, h/3])
                  .scale([1000]);
var path = d3.geoPath().projection(projection);

//Create SVG element
var svg = d3.select("body")
      .append("svg")
      .attr("width", w)
      .attr("height", h)
      .call(d3.zoom().on("zoom", function () {
       svg.attr("transform", d3.event.transform)
    }))
    .append("g");

d3.csv("us-ag-productivity-2004.csv", function(data) {
  var color = d3.scaleLinear().domain([ d3.min(data, function(d) { return d.value; }),d3.max(data, function(d) { return d.value; }) ])
        //	.range(["#e5f5f9","#2ca25f"]);
            .range(["#fee8c8", "#e34a33"]);

          d3.json("us-states.json", function(json) {
                for (var i = 0; i < data.length; i++) {
                    var dataState = data[i].state;
                    var dataValue = parseFloat(data[i].value);
                    for (var j = 0; j < json.features.length; j++) {
                      var jsonState = json.features[j].properties.name;
                      if (dataState == jsonState) {
                        json.features[j].properties.value = dataValue;
                        break;
                      }
                    }
                 }

               //Bind data and create one path per GeoJSON feature
               svg.selectAll("path")
                  .data(json.features)
                  .enter()
                  .append("path")
                  .attr("d", path)
                  .style("fill", function(d){
                    var value = d.properties.value;
                    return color(value);
                  });
          })
})
