var dataCounts = []

var getlinks = function() {
	var links = {};
	var idx = 0;
  $("a").each(function(){
	  var name;
	  
	  if (this.text) {
	  	name = this.text
	  }else{
		name = this.href  	
	  }
	  
	  var color;
	  var colorHash = {};
	  color = getRandomColor()
	  while(!validColor(colorHash, color)){
	  	color = getRandomColor()
	  }
	  
	  colorHash[color] = true;
	  
	  $(this).attr('data-color', color)
	  $(this).attr('id', idx)
	  links[this.href] = {text: name, count: 0, index: idx, color: color}
	  idx++;
  })
  return links
};

var linkCounts = getlinks()

function getRandomColor(){
	var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function validColor(colorsHash, color){
	if (colorsHash[color]) {
		return false
	}else{
		return true
	}
}

function updateDataSetCount(obj){
	var dataCount = []
	for(var key in obj){
		dataCount.push(obj[key].count)
	}
	
	return dataCount
}

function updateDataLabels(obj){
	var dataLabels = []
	for(var key in obj){
		dataLabels.push(obj[key].text)
	}
	
	return dataLabels
}

function generatePieData(obj){
	var pieObjs = []
	for(var key in obj){
		var pieObj = {
			value: obj[key].count,
		    color: obj[key].color,
		    highlight: "#C69CBE",
		    label: obj[key].text
		};
		pieObjs.push(pieObj)
	}
	return pieObjs;
}

var dataCounts = updateDataSetCount(linkCounts)

var dataLabels = updateDataLabels(linkCounts)

var pieData = generatePieData(linkCounts)
console.log(pieData)
var data = {
    labels: dataLabels,
    datasets: [
        {
            label: "Count the Links",
            fillColor: "rgba(220,220,220,0.5)",
            strokeColor: "rgba(220,220,220,0.8)",
            highlightFill: "rgba(220,220,220,0.75)",
            highlightStroke: "rgba(220,220,220,1)",
            data: dataCounts
        }
    ]
};

var barctx = $("#myBarChart").get(0).getContext("2d");
var piectx = $("#myPieChart").get(0).getContext("2d");
var linectx = $("#myLineChart").get(0).getContext("2d");
var myBarChart = new Chart(barctx).Bar(data);
var myPieChart = new Chart(piectx).PolarArea(pieData);
var myLineChart = new Chart(linectx).Line(data);

$("a").each(function(){
	myBarChart.datasets[0].bars[this.id].fillColor = $(this).attr("data-color")
	myBarChart.update()
});

$("a").each(function(){
	myLineChart.datasets[0].points[this.id].fillColor = $(this).attr("data-color")
	myLineChart.update()
});

$("a").mousedown(function(){
	linkCounts[this.href].count++;
	myBarChart.datasets[0].bars[this.id].value = linkCounts[this.href].count
	myLineChart.datasets[0].points[this.id].value = linkCounts[this.href].count
	myPieChart.segments[this.id].value = linkCounts[this.href].count
	myBarChart.update();
	myLineChart.update()
	myPieChart.update()
})