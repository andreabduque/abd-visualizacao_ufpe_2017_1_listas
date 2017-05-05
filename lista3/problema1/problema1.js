d3.select("body")
  .append("div")
  .append("strong")
  .text("N")

var dropdown = d3.select("body")
    .append("div")
    .append("select")
    .attr("name", "K neighbors");

neigh = []
for(n = 5; n < 16; n++){
  neigh.push(n)
}

dropdown.selectAll("option")
        .data(neigh)
        .enter()
        .append("option")
        .attr("value", function(d) { return d; })
        .text(function(d) { return d; });

ranges = get_iris_range()





function menuChanged(){
  N = this.value
}
dropdown.on("change", menuChanged);
