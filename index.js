
//SVG VARIABLES
var width=1000;  //svg width
var height=800; //svg height
var margin=20; // the space between the edges of the svg
var header=150; //the offset from top to chart
var svg = d3.select("body")
			.append("svg")
            .attr("width",width)
			.attr("height",height)
			.attr("style","background: red;");

//GROUP VARIABLES
var charactergroup=svg.append("g").attr("id","charactergroup");
var moviegroup=svg.append("g").attr("id","moviegroup");

//DATA VARIABLE
var csvdata=[];
var character=[];
var movies=[];

d3.csv("characters.csv",function(data){
       data.forEach(function(d){
         temp={
			movie_name: d.moviename,
			character_name: d.charactername,
			time: d.screentime
		 };
		 
		//make character and movie array
		var ctemp=d.charactername;
		var mtemp=d.moviename;
		var charfound=false;
		var moviefound=false;
		for(var i=0;i<character.length && !charfound;i++){
			if(ctemp==character[i]){
				charfound=true;
			}
		}
		//if character not found add to list
		if(!charfound){
			character.push(ctemp);
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
		//add the data to csv data
		csvdata.push(temp);
   })
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
					.data(csvdata)
					.enter()
					.append("text")
					.text(function(d,i){return d.title;})
					.attr("transform", function (d,i) {
						var xText = ((width-180)/(numberofmovies+1)*(i+1)+50);
						var yText = header;
						return "translate(" + xText + "," + yText + ") rotate(-30)";
					});

	console.log(csvdata);
})
