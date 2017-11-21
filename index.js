
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
var characters=["character1","character2","character3","character4","character5","character6","character7","character8","character9","character10","character11","character12","character13",
"character14","character15","character16","character17","character18","character19","character20","character21","character22","character23","character24","character25","character26",
"character27","character28","character29","character30","character31","character32","character33","character34","character35"];
var movies=["movie1","movie1","movie1","movie1","movie1","movie1","movie1","movie1","movie1","movie1","movie1","movie1","movie1","movie1","movie1","movie1"];
var numberofcharacters=characters.length;
var numberofmovies=movies.length;


d3.csv("marvel_data.csv",function(data){
       data.forEach(function(d){
         //var tmp_char=JSON.parse(d.cast_crew);
         var temp={
			 id:d.id,
			 title: d.title,
			 characters:d.cast_crew
		 };
		 csvdata.push(temp);
    })


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
