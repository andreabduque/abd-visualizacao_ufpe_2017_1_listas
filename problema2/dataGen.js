function getRandomInt(min, max) {

  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function getData(nsamples, min, max){
	var dataset = [];

	for (var i = 0; i < nsamples; i++) {
		dataset.push([getRandomInt(min, max), getRandomInt(min, max), getRandomInt(min, max), getRandomInt(min, max)] );
    console.log(dataset[i]);
	}
	return dataset
}
