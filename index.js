
//SVG VARIABLES
var width=1500;  //svg width
//var height=800; //svg height
var height=2500;
//var width=$(window).width()-margin;  //svg width
//var height=$(window).height()-margin; //svg height
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
var timegroup=svg.append("g").attr("id","timegroup");

//DATA VARIABLE
var csvdata=[];
var characters=[];
var movies=[];

function sortAlpha(a,b){

}

function sortAlphaCharacter(a,b){
	if(a.charactername < b.charactername)
		return -1;
	else if(a.charactername > b.charactername)
		return 1;
	else	
		return 0;
}

function sortAlphaMovie(a,b){
	if(a.moviename < b.moviename)
		return -1;
	else if(a.moviename > b.moviename)
		return 1;
	else	
		return 0;
}

d3.csv("characters2.csv",function(data){
       data.forEach(function(d){
		//format incoming data
        var temp={
			moviename: d.moviename,
			charactername: d.charactername,
			screentime: parseFloat(d.time)
		};
		//make character and movie array
		
		//add the data to csv data
		csvdata.push(temp);
		
		
		
		
		
		var ctemp=d.charactername;
		var mtemp=d.moviename;
		var charfound=false;
		var moviefound=false;
		for(var i=0;i<characters.length && !charfound;i++){
			if(ctemp==characters[i]){
				charfound=true;
			}
		}
		//if character not found add to list
		if(!charfound){
			characters.push(ctemp);
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
    //Sort movie array alphabetically
	//movies.sort();
	//Sort character array alphabetically
	//characters.sort();
    //sort csv
	//csvdata.sort(sortAlphaCharacter);
	//csvdata.sort(sortAlphaMovie);
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
						var xText = ((width-180)/(numberofmovies+1)*(i+1)+50);
						var yText = header;
						return "translate(" + xText + "," + yText + ") rotate(-30)";
					});
	//CREATE TIMEBOXS
	/*for(var j=0;j<numberofmovies;j++){
		var timeboxes=svg.selectAll("timegroup")
					.data(characters)
					.enter()
					.append("rect")
					.attr("x",function(d,i){return ((width-180)/(numberofmovies+1)*(j+1)+50);})
					.attr("y",function(d,i){return ((height-margin-header)/(numberofcharacters+1)*(i+1)+margin/2+header);})
					.attr("width",10)
					.attr("height",10);
	}*/
	var timeboxes=svg.selectAll("timegroup")
				.data(csvdata)
				.enter()
				.append("rect")
				//.attr("x",function(d,i){return ((width-180)/(numberofmovies+1)*((i/numberofcharacters)+1)+50)})
				.attr("x",function(d,i){return Math.floor((i)/numberofcharacters+1)*120;})
				.attr("y",function(d,i){
					return ((height-margin-header)/(numberofcharacters+1)*Math.floor(i%numberofcharacters)+180);
					})
				.attr("width",10)
				//.attr("height",function(d,i){return d.screentime;});
				.attr("height",10);
	
    //DRAW LINES FOR ORGANIZATION
    var index = 0;
    var verticallines = svg.selectAll("moviegroup")
               .data(movies)
               .enter()
               .append("line")
               .attr("x1", function(d,i) {
                  index++;
                  return (width-180)/(numberofmovies+1)*(i+1)+30;
               })
               .attr("y1", header)
               .attr("x2", function(d,i) {
                  return (width-180)/(numberofmovies+1)*(i+1)+30;
               })
               .attr("y2", height-margin)
               .attr("stroke", "#737984");

    //Create the last line using regular Javascript because it's not bound to any data
    var oneline = ["movie"];
    var lastline = svg.selectAll("moviegroup")
               .data(oneline)
               .enter()
               .append("line")
               .attr("x1", (width-180)/(numberofmovies+1)*(index+1)+30)
               .attr("y1", header)
               .attr("x2", (width-180)/(numberofmovies+1)*(index+1)+30)
               .attr("y2", height-margin)
               .attr("stroke", "#737984");
			   
	//console.log(csvdata);
	
	//new csv code
	
	/*
	var t;
	var b=true;
	for(var i=0;i<numberofmovies;i++){
		for(var j=0;j<numberofcharacters;j++){
			for(var k=0;k<csvdata.length;k++){
				//console.log(csvdata[k].moviename)
				if(movies[i]==csvdata[k].moviename && characters[j]==csvdata[k].charactername){
					t=csvdata[k].screentime;
					console.log(movies[i]+","+characters[j]+","+t);
					b=false;
				}else if(b){
					t=0;
				}
			}
			if(t==0){
				console.log(movies[i]+","+characters[j]+","+t);
			}
			b=true;
		}
	}*/
	
	
	
	
	
	
	
	
	
})
