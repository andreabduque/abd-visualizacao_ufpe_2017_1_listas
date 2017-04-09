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
  return ntrips;
};

c_scat = d3.scaleOrdinal().range(["orange", "red", "blue"]).domain(carriers);

var margin = {top: 20, right: 20, bottom: 20, left: 30};
var width = 600 - margin.left - margin.right;
var height = 400 - margin.top - margin.bottom;
//Definindo margens e SVG
var mySVG = d3.select("body").append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom);

var myHistogram = d3.select("svg")
                		.append("g")
                    .attr("class", "hist")
                		.attr("transform", "translate("+margin.left+ ","+margin.top +")");

//histogram scales
x = d3.scaleBand()
      .rangeRound([0, width/3])
      .padding(0.1)
      .domain(carriers);
y = d3.scaleLinear().rangeRound([0, height]).domain([0, trips.length]);

var ntrips = count_trip(trips)
var bar = myHistogram.selectAll(".bar")
                      .data(ntrips)
                      .enter()
                      .append("g")
                      .attr("transform", "translate(" + 0 + ","+ height+")")
                      .attr("transform", "scale(" + 1 + ","+ -1+")")
                      .attr("class", "bar");

bar.append("rect")
.attr("x", function(d) { return x(d.carrier); })
.attr("y", -height)
.attr("width", x.bandwidth())
.attr("height", function(d) { return y(d.count); })
.attr("fill", function(d) {return c_scat(d.carrier)});

bar.append("text")
  .attr("dy", ".90em")
  .attr("y", function(d) { return height - y(d.count); })
  .attr("x", function(d) { return x(d.carrier) + x.bandwidth()/2; })
  .attr("text-anchor", "middle")
  .attr("transform", "scale(" + 1 + ","+ -1+")")
  .text(function(d) { return d.count; });

// add the x Axis
myHistogram.append("g")
    .attr("transform", "translate(0," + height + ")")
    .attr("class", "axis--x")
    .call(d3.axisBottom(x));

var myScatter = d3.select("svg")
              		.append("g")
                  .attr("class", "scat")
              	//	.attr("transform", "translate("+margin.left+ ","+margin.top +")")
                  .attr("transform", "translate("+250+ ","+margin.top +")");

function diffDays(date1, date2){
  return Math.round(Math.abs(date1.getTime() - date2.getTime())/(24*60*60*1000));
};

function parseDate(str){
    date = str.split("/")
    year = date[2];
    month = date[1];
    day = date[0];

    return new Date(year,month,day);
};

var minDiff = d3.min(trips.map(
  function(d){
    return diffDays(parseDate(d.start), parseDate(d.post));
  }
));

var maxDiff = d3.max(trips.map(
  function(d){
    return diffDays(parseDate(d.start), parseDate(d.post));
  }
));

var minPrice = d3.min(trips.map(
  function(d){
    return d.price;
  }
));

var maxPrice = d3.max(trips.map(
  function(d){
    return d.price;
  }
));

//Plot scales
x_scat =  d3.scaleLinear().rangeRound([0, width/2]).domain([0, maxDiff]);
y_scat = d3.scaleLinear().rangeRound([height, 0]).domain([0, maxPrice]);

var xAxisGroup = myScatter.append("g")
                      .attr("class","axis")
                      //.attr("transform", "translate(0,"+(height-margin.top)+")");
                      .attr("transform", "translate(" + 0  + ","+height+")");

var yAxisGroup = myScatter.append("g")
                      .attr("class","axis");
                      //.attr("transform", "translate("+(margin.left )+"," + 0 +")");

xAxisGroup.call(d3.axisBottom(x_scat));
yAxisGroup.call(d3.axisLeft(y_scat));

var teste = myScatter
              .selectAll("circle")
              .data(trips)
              .enter()
              .append("circle")
              .attr("cx", function(d){ return x_scat(diffDays(parseDate(d.start), parseDate(d.post))); })
              .attr("cy", function(d) { return y_scat(d.price); })
              .attr("r", 2)
              .attr("fill", function(d) { return c_scat(d.carrier);});

//Brush
myScatter.append("g")
      .call(d3.brush().extent([[0, 0], [width, height]]).on("brush", brushMoved).on("end", brushEnded));

function brushMoved(){
  var screenSelection = d3.event.selection;
  var selectedData = [];
  myScatter.selectAll("circle").attr("fill", function(d){
    var x_pos = x_scat(diffDays(parseDate(d.start), parseDate(d.post)));
    var y_pos =  y_scat(d.price);

    if(screenSelection[0][0]<= x_pos && x_pos <= screenSelection[1][0] &&
		   screenSelection[0][1]<= y_pos && y_pos <= screenSelection[1][1]){
         selectedData.push(d);
         return "brown";
    }
    else{
        return c_scat(d.carrier);
    }
  });

  myDispatch.call("selectionChanged",{caller:"scatter",items:selectedData});
}

function brushEnded(){
  if(!d3.event.selection){
    myScatter.selectAll("circle")
      .attr("fill", function(d){
            return c_scat(d.carrier);
      });
      myDispatch.call("selectionChanged",{caller:"scatter",items:trips});
  }
}

function updateHist(trips){
  var ntrips = count_trip(trips);
  var oldBar =  myHistogram.selectAll(".bar")
                  .data(ntrips);
  //console.log(oldBar);
  oldBar//.select("text")
  .select("rect")
  .transition()
  .duration(300)
  .attr("height", function(d) { return y(d.count); });

  oldBar
  .select("text")
  .transition()
  .duration(300)
  .attr("y", function(d) { return height - y(d.count); })
  .attr("x", function(d) { return x(d.carrier) + x.bandwidth()/2; })
  .text(function(d) { return d.count; });

}

function updateScatter(new_trips){
  var newScatter = myScatter
                      .selectAll("circle")
                      .data([]);
                    //  .enter();  //
newScatter.exit().remove();
console.log(new_trips);
  myScatter
      .selectAll("circle")
      .data(new_trips)
      .enter()
      .append("circle")
      .attr("cx", function(d){ return x_scat(diffDays(parseDate(d.start), parseDate(d.post))); })
      .attr("cy", function(d) { return y_scat(d.price); })
      .attr("r", 2)
      .attr("fill", function(d) { return c_scat(d.carrier);});
};

var myDispatch = d3.dispatch("selectionChanged");
var myDispatch2 = d3.dispatch("clickHist");

myHistogram.selectAll(".bar").select("rect").on("click", function(d){
  var new_trips = [];
  trips.forEach(function(i){
      if(i.carrier == d.carrier){
        new_trips.push(i);
      }
    });
  myDispatch2.call("clickHist",{caller:"show",items:new_trips});
});


myDispatch.on("selectionChanged",function(){
    if(this.caller == "scatter"){
      updateHist(this.items);
    }

});

myDispatch2.on("clickHist", function(){
  if(this.caller == "show"){
    updateScatter(this.items);
  }
});


// // add the y Axis
// mySVG.append("g")
//     .call(d3.axisLeft(y));

//Scatterplot
