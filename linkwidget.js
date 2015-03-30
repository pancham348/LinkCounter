String.prototype.capitalize = function(){
	var firstLetter = this[0].toUpperCase();
	return firstLetter + this.slice(1, this.length)
};

// skips links without a hostname
function skipIfInvalid(link){
  if ((link.hostname === "") || $(link).is(':empty')) {
	  return true; 
  }
}
//create a hash storing all links and their properties
var getlinks = function() {
	var links = {};
	var idx = 0;
  $("a").each(function(){

	  if ((this.hostname === "") || $(this).is(':empty')) {
		  return true; 
	  }
	  var name;
	  if (this.text) {
	  	name = this.text
	  }else{
		  if (this.hostname.startsWith("www")) {
			  name = this.hostname.substring(4);
			  name = name.slice(0, name.length - 4).capitalize();
		  }else{
		  	name = this.hostname.slice(0, this.hostname.length - 4).capitalize();
		  }
		  
	  }
	  
	  var color;
	  var colorHash = {};
	  color = getRandomColor()
	  while(!validColor(colorHash, color)){ //avoid color collisions between links
	  	color = getRandomColor()
	  }
	  
	  colorHash[color] = true;
	  
	  $(this).attr('data-color', color)
	  $(this).attr('id', idx)
	  $(this).attr('class', 'valid')
	  links[this.href] = {text: name, count: 0, index: idx, color: color}
	  idx++;
  })
  return links
};

var linkCounts = getlinks()

//generates random colors for all links
function getRandomColor(){
	var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

//ensures that there are no collisions between colors
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

//chart.js polar and piechart data is an array of objects
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

//initialize datasets
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

var options = {
    animation: true,
    scaleoverride: true,
    responsive: false,
    maintainAspectRatio: false
}

//draw charts
var barctx = $("#myBarChart").get(0).getContext("2d");
var linectx = $("#myLineChart").get(0).getContext("2d");
var piectx = $("#myPieChart").get(0).getContext("2d");
var myBarChart = new Chart(barctx).Bar(data, options);
var myLineChart = new Chart(linectx).Line(data, options);
var myPieChart = new Chart(piectx).PolarArea(pieData, options);
legend(document.getElementById("pieLegend"), pieData)

//add colors to bar chart
$(".valid").each(function(){
    skipIfInvalid(this)
	myBarChart.datasets[0].bars[this.id].fillColor = $(this).attr("data-color")
	myBarChart.update()
});

//add colors to line chart
$(".valid").each(function(){
    skipIfInvalid(this)
	myLineChart.datasets[0].points[this.id].fillColor = $(this).attr("data-color")
	myLineChart.update()
});

//left or richt clicking incrments count of link
$(".valid").mousedown(function(){
	linkCounts[this.href].count++;
	myBarChart.datasets[0].bars[this.id].value = linkCounts[this.href].count
	myLineChart.datasets[0].points[this.id].value = linkCounts[this.href].count
	myPieChart.segments[this.id].value = linkCounts[this.href].count
	myBarChart.update();
	myLineChart.update()
	myPieChart.update()
})