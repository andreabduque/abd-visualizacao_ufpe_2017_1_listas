d3.select("body")
  .append("div")
  .append("strong")
  .text("N")

var dropdown = d3.select("body")
    .append("div")
    .append("select")
    .attr("name", "K neighbors")
    .attr("id", "select");

var button = d3.select("body")
                .append("div")
                .append("button")
                .attr("value", "calcular")
                .text("Calcular");

neigh = []
for(n = 1; n < 16; n++){
  neigh.push(n)
}

dropdown.selectAll("option")
        .data(neigh)
        .enter()
        .append("option")
        .attr("value", function(d) { return d; })
        .text(function(d) { return d; });



var margin = {top: 0, right: 0, bottom: 0, left: 0};
var width = 1024 - margin.left - margin.right;
var height = 800 - margin.top - margin.bottom;

var svg = d3.select("body").append("svg")
			       .attr("width", width + margin.left + margin.right)
			      .attr("height", height + margin.top + margin.bottom);

color_scale = d3.scaleOrdinal().range(["orange", "red", "blue"]).domain(["setosa", "virginica", "versicolor"]);


function gera_grafo(){
  var simulation = d3.forceSimulation()
      .force("link", d3.forceLink().id(function(d) { return d.id; }))
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(width / 2, height / 2));

  K = d3.select("#select").node().value;

  ranges = get_iris_range();
  graph = [];
  nodes = [];
  for (let i = 0; i < iris.length; i++) {
    nodes.push({id: i, color : iris[i].species});
    kneigh = kneighbors(iris, ranges, K, i, iris[i]);
    graph = graph.concat(kneigh);
  }

  graph = graph.reduce(
    (list, x) => {
      let put = true;

      for (let element of list) {
        if (x.source === element.target && x.target === element.source) {
          put = false;
          break;
        }
      }
      if (put) {
        list.push(x);
      }

      return list;
    }
  , []);

  dragstarted = function(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  dragged = function(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  dragended = function (d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

  //Remove previous graph
  svg.select(".links").remove()
  svg.select(".nodes").remove()


  var link = svg.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(graph)
      .enter().append("line")
      .attr("stroke-width", function(d) { return 5*d.value; });


    var node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(nodes)
        .enter().append("circle")
        .attr("r", 5)
        .attr("fill", function(d) { return color_scale(d.color); })
        .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended));

      simulation
          .nodes(nodes)
          .on("tick", ticked);

      simulation.force("link")
          .links(graph);

      function ticked() {
        link
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        node
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });
      }

  // var node = svg.append("g")
  //     .attr("class", "nodes")
  //   .selectAll("circle")
  //   .data(graph.nodes)
  //   .enter().append("circle")
  //     .attr("r", 5)
  //     .attr("fill", function(d) { return color(d.group); })
  //     .call(d3.drag()
  //         .on("start", dragstarted)
  //         .on("drag", dragged)
  //         .on("end", dragended));

}

button.on("click", gera_grafo);
