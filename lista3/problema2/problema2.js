var algo;
var stratify;


var width = 1000,
    height = 500;

var nest = d3.nest()
  .key(function(d) { return d.orgao_nome; })
  .key(function(d) { return d.unidade_nome; })
  .rollup(function(d) { return d3.sum(d, function(d) { return Math.abs(parseFloat(d.valor_pago.replace(',', '.'))); }); });

var treemap = d3.treemap()
  .size([width, height])
  .padding(1)
  .round(true);

  categories = [
    "GABINETE DO PREFEITO",
    "GABINETE DO VICE-PREFEITO",
    "SECRETARIA DE EDUCAÇÃO",
    "SECRETARIA DE MOBILIDADE E CONTROLE URBANO",
    "SECRETARIA DE SAÚDE",
    "SECRETARIA DE MULHER",
    "SECRETARIA DE HABITAÇÃO",
    "SECRETARIA DE ENFRENTAMENTO AO CRACK E OUTRAS DROGAS",
    "SECRETARIA DE IMPRENSA",
    "SECRETARIA DE JUVENTUDE E QUALIFICAÇÃO PROFISSIONAL"
  ]

  var format = d3.formatLocale({
  decimal: ".",
  thousands: ",",
  grouping: [3],
  currency: ["R$", " "]
  }).format("$,d");

  var color = d3.scaleOrdinal()
    .range(d3.schemeCategory10
        .map(function(c) { c = d3.rgb(c); c.opacity = 0.6; return c; }))
        .domain(categories);


d3.csv("dados.csv", function(error, all_data) {
  if (error) throw error;

  data = all_data.filter(function(d){
      return categories.includes(d.orgao_nome);
  });

  var root = d3.hierarchy({values: nest.entries(data)}, function(d) { return d.values; })
      .sum(function(d) { return d.value; })
      .sort(function(a, b) { return b.value - a.value; });

  treemap(root);

  var node = d3.select("body")
    .selectAll(".node")
    .data(root.leaves())
    .enter().append("div")
      .attr("class", "node")
      .style("left", function(d) { return d.x0 + "px"; })
      .style("top", function(d) { return d.y0 + "px"; })
      .style("width", function(d) { return d.x1 - d.x0 + "px"; })
      .style("height", function(d) { return d.y1 - d.y0 + "px"; })
      .style("background", function(d) { while (d.depth > 1) d = d.parent.data.key; return color(d); });

    node.append("div")
        .attr("class", "node-label")
        .text(function(d) { return d.parent.data.key + "\n" + (d.data.key).split(" - ")[1]; });

    node.append("div")
        .attr("class", "node-value")
        .text(function(d) { return format(d.value); });
  });


  function type(d) {
    d.valor_pago = +d.valor_pago;
    return d;
  }
