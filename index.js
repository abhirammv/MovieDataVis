
//SVG VARIABLES
var margin=20; // the space between the edges of the svg
var header=180; //the offset from top to chart
var sidebarwidth=150;
var width=$(window).width()-margin;  //svg width
var height=2500; //svg height
var chartwidth=width-sidebarwidth; //space for sidebar on right
var charcolumn=110; //width of column for all the characters

var svg = d3.select("body")
			.append("svg")
         .attr("width",width)
			.attr("height",height)
			.attr("style","background: #fffff");

var title = d3.select("svg")
         .append("text")
         .attr("x", "20px")
         .attr("y", "50px")
         .text("Marvel Movie Characters")
         .style("font-size", "40px")
         .style("color", "black")
         .style("text-align", "center")
         .style("letter-spacing", ".1em");

//GROUP VARIABLES
var charactergroup=svg.append("g").attr("id","charactergroup");
var moviegroup=svg.append("g").attr("id","moviegroup");
var sidebargroup=svg.append("g").attr("id", "sidebargroup");
var timegroup=svg.append("g").attr("id","timegroup");

//DATA VARIABLE
var csvdata=[];
var characters=[];
var movies=[];

//FUNCTIONS---------------------------------------------------------------------------------------
//Builds new character and movie arrays based on a CSV sort
function buildArrays(){
	//EMPTY ARRAYS IF THEY ARENT ALREADY
	while(characters.length>0){
		characters.pop();
	}
	while(movies.length>0){
		movies.pop();
	}
	//BUILD LABEL ARRAYS
	for(var i=0;i<csvdata.length;i++){
		//Temp variables for array creation
		var ctemp=csvdata[i].charactername;
		var mtemp=csvdata[i].moviename;
		//var ttemp=csvdata[i].screentime;
		var charfound=false;
		var moviefound=false;
		for(var j=0;j<characters.length && !charfound;j++){
			if(ctemp==characters[j]){
				charfound=true;
			}
		}
		//if character not found add to list
		if(!charfound){
			characters.push(ctemp);
		}
			
		for(var j=0;j<movies.length && !moviefound; j++){
			if(mtemp==movies[j]){
				moviefound=true;
			}
		}
		//if movie not found add to list
		if(!moviefound){
			movies.push(mtemp);
		}
	}	
}
//Draws the character and movie labels along with rectangles for the first time
function drawData(){
	buildArrays();
	//VARIABLES
	var numberofcharacters =characters.length;
	var numberofmovies=movies.length;

	//CREATE LABLES
	var characterlabels = svg.selectAll("charactergroup")
					.data(characters)
					.enter()
					.append("text")
					.attr("x",margin/2)
					//change height to account for margin    divide by number of characters+1 for formating   offset iterator by 1     shift by half the margin for formating
					.attr("y",function(d,i){return ((height-margin-header)/(numberofcharacters+1)*(i+1)+margin/2+header);})
					.text(function(d,i){return characters[i];});

	var movielabels=svg.selectAll("moviegroup")
					.data(movies)
					.enter()
					.append("text")
					.text(function(d,i){return movies[i];})
					.attr("transform", function (d,i) {
						var xText = ((chartwidth-180)/(numberofmovies+1)*(i+1)+charcolumn);
						var yText = header;
						return "translate(" + xText + "," + yText + ") rotate(-30)";
					});

	//CREATE TIMEBOXES	   
	var offset = (chartwidth-180)/(numberofmovies+1);
	var timeboxes=svg.selectAll("timegroup")
				.data(csvdata)
				.enter()
				.append("rect")
				.attr("x", function (d, i) {
					//120 = amt to translate by
					//return Math.floor((i)/numberofcharacters+1)*100;
					//return (chartwidth-180)/(numberofmovies+1)*(i+1)+(charcolumn-20);
					return (Math.floor((i)%numberofmovies+1)*(offset))+charcolumn-20;

				})
				.attr("y", function (d, i) {
					return (height-margin-header)/(numberofcharacters+1)*Math.floor(i/numberofmovies)+header+margin;
				})
				.attr("width", function (d,i) {
					var colW = (chartwidth-180)/(numberofmovies+1)-1;
					return d.screentime / 77.25 * (colW);
                  
				})
				.attr("height", 10);

	//DRAW LINES FOR ORGANIZATION
	var index = 0;
	var verticallines = svg.selectAll("moviegroup")
				.data(movies)
				.enter()
				.append("line")
				.attr("x1", function(d,i) {
					index++;
					return (chartwidth-180)/(numberofmovies+1)*(i+1)+(charcolumn-20);
				})
				.attr("y1", header)
				.attr("x2", function(d,i) {
					return (chartwidth-180)/(numberofmovies+1)*(i+1)+(charcolumn-20);
				})
				.attr("y2", height-margin)
				.attr("stroke", "#737984");

	//Create the last line
	var oneline = ["movie"];
	var lastline = svg.selectAll("moviegroup")
				.data(oneline)
				.enter()
				.append("line")
				.attr("x1", (chartwidth-180)/(numberofmovies+1)*(index+1)+(charcolumn-20))
				.attr("y1", header)
				.attr("x2", (chartwidth-180)/(numberofmovies+1)*(index+1)+(charcolumn-20))
				.attr("y2", height-margin)
				.attr("stroke", "#737984");
}
//Used to determine which transition to do based on current filter selections
//then does the transition
function filterSelection(ccf,cmf){//ccf= currentcharacterfilter cmf=currentmoviefilter
	//Alpha Alpha
	if(ccf=="alpha" && cmf=="alpha"){
		console.log("a a");
		//Resort data for current filter
		csvdata.sort(sortAlphaCharacterAlphaMovie);
		//sorts character and movie arrays
		buildArrays();
		//do transition for character group-----------currently doesnt work
		svg.selectAll("charactergroup")
				.data(characters)
				.transition()
				.duration(2000)
				.attr("x",margin/2)
				.attr("y",function(d,i){return ((height-margin-header)/(numberofcharacters+1)*(i+1)+margin/2+header);});
	}
	//Alpha Release
	else if(ccf=="alpha" && cmf=="release"){
		console.log("a r");
	}
	//Alpha Chrono
	else if(ccf=="alpha" && cmf=="chrono"){
		console.log("a c");
	}
	//Screentime Alpha
	else if(ccf=="screentime" && cmf=="alpha"){
		console.log("s a");
	}
	//Screentime Release
	else if(ccf=="screentime" && cmf=="release"){
		console.log("s r");
	}
	//Screentime Chrono
	else if(ccf=="screentime" && cmf=="chrono"){
		console.log("s c");
	}else{
		console.log("default");
		//verticallines.attr("stroke","red");
	}
}
//Draws the filter selection area
function drawFilters(){
	var sideX = width-sidebarwidth-70;
	var sideWidth = sidebarwidth-margin+70;
	var textX = sideX+15;
	//var filters = ["alphabetical by character", "highest screentime", "movie release date", "chronological story order", "largest cast"];
	var characterfilters= ["alphabetically","total screen time"];
	var moviefilters=["alphabetically","release order","chronological order"];
	//Current Filters
	var currentcharacterfilter="alpha";
	var currentmoviefilter="alpha";
	//CHARACTER FILTER
	//Draw Filter Header
	var sidebarTitle=d3.select("svg")
               .append("text")
               .attr("x", textX)
               .attr("y", header+30)
               .text("character filter:")
               .style("font-style", "italic")
               .style("font-size", "18px");
	//Draw Filters		   
	var filterCharacters=svg.selectAll("body")
               .data(characterfilters)
               .enter()
               .append("a")
               .attr("id", function (d) { return d; })
               .append("text")
               .attr("x", textX)
               .attr("y", function (d, i) { return header+50+(i*20);})
               .text(function (d) { return d; });
			   
	filterCharacters.on("click",function(){
					if(d3.select(this).text()=="alphabetically"){
						//set the filter
						currentcharacterfilter="alpha";
						//call the selection function
						filterSelection(currentcharacterfilter,currentmoviefilter);
					}else if(d3.select(this).text()=="total screen time"){
						currentcharacterfilter="screentime";	
						filterSelection(currentcharacterfilter,currentmoviefilter);						
					}else{
						console.log("invaild character filter click...");
					}
               })
               .on("mouseover", function(d,i) {
                  filterCharacters.style("cursor", "pointer")
                  d3.select(this).style("font-size", "14px");
               })
               .on("mouseout", function (d,i) {
                  d3.select(this).style("font-size", "13px");
               })
	//MOVIE FILTER
	//Draw Filter Header
	sidebarTitle=d3.select("svg")
               .append("text")
               .attr("x", textX)
               .attr("y", header+180)
               .text("movie filter:")
               .style("font-style", "italic")
               .style("font-size", "18px");
	//Draw Filters		   
	var filterMovies=svg.selectAll("body")
               .data(moviefilters)
               .enter()
               .append("a")

               .attr("id", function (d) { return d; })
               .append("text")
               .attr("x", textX)
               .attr("y", function (d, i) { return header+200+(i*20);})
               .text(function (d) { return d; });
			   
	filterMovies.on("click", function () {
					if(d3.select(this).text()=="alphabetically"){
						currentmoviefilter="alpha";
						filterSelection(currentcharacterfilter,currentmoviefilter);
					}else if(d3.select(this).text()=="release order"){
						currentmoviefilter="release";
						filterSelection(currentcharacterfilter,currentmoviefilter);
					}
					else if(d3.select(this).text()=="chronological order"){
						currentmoviefilter="chrono";
						filterSelection(currentcharacterfilter,currentmoviefilter);
					}else{
						console.log("invaild movie filter click...");
					}
               })
               .on("mouseover", function(d,i) {
                  filterMovies.style("cursor", "pointer")
                  d3.select(this).style("font-size", "14px");
               })
               .on("mouseout", function (d,i) {
                  d3.select(this).style("font-size", "13px");
               })
}
//CSV SORTS--------------------------------------------------------------------------------------
//--------------------------------------------------------------
//TO DO LIST
//--------------------------------------------------------------
//1. Alphabetical Character -- Alphabetical Movie           (DONE)
//2. Alphabetical Character -- Release Order				(DONE)
//3. Alphabetical Character -- Chronological Order			(DONE)
//4. Character Screen Time -- Alphabetical Movie			(DONE)
//5. Character Screen Time -- Release Order Movie			(DONE)
//6. Charatcer Screen Time -- Chronological Order Movie		(DONE)
//
//
//--------------------------------------------------------------

//1. Sorts By Alphabetical Character -- Alphabetical Movie
function sortAlphaCharacterAlphaMovie(a,b){
	if(a.charactername < b.charactername)
		return -1;
	else if(a.charactername > b.charactername)
		return 1;
	else{
		if(a.moviename < b.moviename){
			return -1;
		}else if(a.moviename > b.moviename){
			return 1;
		}else{
			return 0;
		}
	}	
}
//2. Sorts By Character Screen Time -- Release Order Movie
function sortAlphaCharacterReleaseOrder(a,b){
	if(a.charactername < b.charactername)
		return -1;
	else if(a.charactername > b.charactername)
		return 1;
	else{
		if(a.releaseorder < b.releaseorder){
			return -1;
		}else if(a.releaseorder > b.releaseorder){
			return 1;
		}else{
			return 0;
		}
	}	
}
//3. Sorts By Alphabetical Character -- Chronological Order
function sortAlphaCharacterChronoOrder(a,b){
	if(a.charactername < b.charactername)
		return -1;
	else if(a.charactername > b.charactername)
		return 1;
	else{
		if(a.chronoorder < b.chronoorder){
			return -1;
		}else if(a.chronoorder > b.chronoorder){
			return 1;
		}else{
			return 0;
		}
	}
}
//4. Sorts By Character Screen Time -- Alphabetical Movie
function sortTotalScreenTimeAplhaMovie(a,b){
	if(a.totalscreentime > b.totalscreentime){
		return -1;
	}else if(a.totalscreentime < b.totalscreentime){
		return 1;
	}else{
		if(a.moviename < b.moviename){
			return -1;
		}else if(a.moviename > b.moviename){
			return 1;
		}else{
			return 0;
		}
	}
}
//5. Sorts By Character Screen Time -- Release Order Movie
function sortTotalScreenTimeReleaseOrder(a,b){
	if(a.totalscreentime > b.totalscreentime){
		return -1;
	}else if(a.totalscreentime < b.totalscreentime){
		return 1;
	}else{
		if(a.releaseorder < b.releaseorder){
			return -1;
		}else if(a.releaseorder > b.releaseorder){
			return 1;
		}else{
			return 0;
		}
	}
}
//6. Charatcer Screen Time -- Chronological Order Movie
function sortTotalScreenTimeChronoOrder(a,b){
	if(a.totalscreentime > b.totalscreentime){
		return -1;
	}else if(a.totalscreentime < b.totalscreentime){
		return 1;
	}else{
		if(a.chronoorder < b.chronoorder){
			return -1;
		}else if(a.chronoorder > b.chronoorder){
			return 1;
		}else{
			return 0;
		}
	}
}
//GET DATA FROM CSV FILE----------------------------------------------------------------------------------
d3.csv("characters2.csv",function(data){
       data.forEach(function(d){
        //format incoming data
        var temp={
			moviename: d.moviename,
			charactername: d.charactername,
		    screentime: parseFloat(d.time),
			totalscreentime: parseFloat(d.totaltime),
			releaseorder: parseInt(d.release),
			chronoorder: parseInt(d.chrono)
		};
        //add the data to the csv data
        csvdata.push(temp);
    })
	//DRAWS DEFAULT DATA
	csvdata.sort(sortAlphaCharacterAlphaMovie);
	drawData();
	//DRAW THE SIDEBAR (FILTERS)
	drawFilters();
})
