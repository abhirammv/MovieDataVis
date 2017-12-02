
//SVG VARIABLES
//var width=1500;  //svg width
//var height=800; //svg height

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

function sortAlpha(a,b){
	if(a.charactername < b.charactername && a.moviename < b.moviename){
		return -1;
	}
}
//CSV SORTS
//Sorts Characters Alphabetically Then By Movie Alphabetically
function sortAlphaCharacterMovie(a,b){
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
//Sorts By TotalScreenTime Then Alphabetically By Movie
function sortTotalScreenTimeAplhaMovie(a,b){
	if(a.totalscreentime > b.totalscreentime){
		return -1;
	}else if(a.totalscreentime < b.totalscreentime){
		return 1;
	}else{
		if(a.moviename < b.moviename)
			return -1;
		else if(a.moviename > b.moviename)
			return 1;
		else
			return 0;
	}
}

function sortAlphaMovie(a,b){
	if(a.moviename < b.moviename)
		return -1;
	else if(a.moviename > b.moviename)
		return 1;
	else
		return 0;
}

function sortScreentime(a, b) {

}

//Character Sorts
//sort csv by movie name and total time
function sortTotalScreenTime(a,b){
	if(a.time > b.time){
		return -1;
	}else if(a.time < b.time){
		return 1;
	}else{
		return 0;
	}
}

d3.csv("characters2.csv",function(data){
       data.forEach(function(d){
        //format incoming data
        var temp={
			moviename: d.moviename,
			charactername: d.charactername,
		    screentime: parseFloat(d.time),
			totalscreentime: parseFloat(d.totaltime)
		};
        //add the data to the csv data
        csvdata.push(temp);
		//Temp variables for array creation
		var ctemp=d.charactername;
		var mtemp=d.moviename;
		var ttemp=parseFloat(d.time);
		var charfound=false;
		var moviefound=false;
		for(var i=0;i<characters.length && !charfound;i++){
			if(ctemp==characters[i].name){
				charfound=true;
				characters[i].time+=ttemp;
			}
		}
		//if character not found add to list
		if(!charfound){
			var temp2={
				name: ctemp,
				time: ttemp
			}
			characters.push(temp2);
		}
		
		for(var i=0;i<movies.length && !moviefound; i++){
			if(mtemp==movies[i]){
				moviefound=true;
			}
		}
		//if movie not found add to list
		if(!moviefound){
			movies.push(mtemp);
		}


    })
	
	csvdata.sort(sortAlphaCharacterMovie);
	//console.log(csvdata);
	//characters.sort(sortTotalScreenTime);
	//console.log(characters);
	//csvdata.sort(sortTotalScreenTimeAplhaMovie);
	//csvdata.sort(sortAlphaMovieCharacter);
	console.log(csvdata);
	
	//DRAW DATA FUNCTION
	
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
					.text(function(d,i){return characters[i].name;});

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


	//DRAW THE SIDEBAR
	var sideX = width-sidebarwidth-70;
	var sideWidth = sidebarwidth-margin+70;
	var textX = sideX+15;
	var filters = ["alphabetical by character", "highest screentime", "movie release date", "chronological story order", "largest cast"];

	//TITLE
	var sidebarTitle=d3.select("svg")
               .append("text")
               .attr("x", textX)
               .attr("y", header+30)
               .text("filter by:")
               .style("font-style", "italic")
               .style("font-size", "18px");

	var filterNames=svg.selectAll("body")
               .data(filters)
               .enter()
               .append("a")

               .attr("id", function (d) { return d; })
               .append("text")
               .attr("x", textX)
               .attr("y", function (d, i) { return header+50+(i*20);})
               .text(function (d) { return d; });

	filterNames
               .on("click", function () {
                  //function to redraw the data
               })
               .on("mouseover", function(d,i) {
                  filterNames.style("cursor", "pointer")
                  d3.select(this).style("font-size", "14px");
               })
               .on("mouseout", function (d,i) {
                  d3.select(this).style("font-size", "13px");
               })

})
