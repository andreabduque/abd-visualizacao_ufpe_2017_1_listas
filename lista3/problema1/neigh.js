// var iris = JSON.parse(iris);
//normalized euclidean distance
var attributes = ["sepal_length", "sepal_width", "petal_length", "petal_width"]

function get_iris_range(){
  var ranges = []
  for(i = 0; i < attributes.length; i++){
    att = attributes[i]
    min = d3.min(iris, function(d) { return d[att]; })
    max = d3.max(iris, function(d) { return d[att]; })
    ranges.push([min, max])
  }
  return ranges
}
//normalized euclidean distance
function euclid_distance_normal(item1, item2, ranges){
  sum_square = 0
  for(i = 0; i < attributes.length; i++){
    att = attributes[i]
    diff = item1[att] - item2[att]
    sum_square += Math.pow(diff/(ranges[i][1] - ranges[i][0]), 2)
  }

  return Math.sqrt(sum_square)
}
//Get k nearest neighbors
 function kneighbors(data, ranges, k){
   near_neigh = []
   //for every item
   for(i = 0; i < data.length; i++){
     //get nearest neighbors
      item = data[i]
      neigh = []
      for(j = 0; j < data.length; j++){
          other_item = data[j]
          val = euclid_distance_normal(item, other_item, ranges)
          //Ignore himself
          if(val != 0){
            obj = {id: j, dist: val}
            neigh.push(obj)
          }
      }

      //Sort by minimum distances
      neigh.sort(function(a,b) {
          return a.dist - b.dist;
      });

      near_neigh.push(neigh.slice(0,k))
      break
   }
   return near_neigh
 }
