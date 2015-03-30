
Please go here for a demo: http://codepen.io/pancham348/pen/yywEvR

This LinkCounter is built using Javascript, jQuery and Chart.js. The purpose of this project is to build a small app that keeps rack of how many times each link on a page has been clicked. The number of clicks for each link on a given page is displayed on three different types of charts - a bar graph, polar area chart and a line chart.

##Some technical features include:##
	* Gets and tracks all valid link included on the webpage.
	* Determines Labels based on the text attribute for each link. If a link does not have a text attribute, then the href string is parsed to determine the appropriate label.
	* Updates Charts based on click and right click events on each link. 
	* Utilizes hashes for quick lookup of count and color properties.
	* Colors for the representation of each link are the same on each graph. All links have unique colors acheived through a random color generator and validColor function.


