
class Point{
	constructor(theta,phi,r){
		this.theta = theta;
		this.phi = phi;
		this.r = r;
	}

	get_cartesian(){
		var x = this.r * Math.cos(this.theta) * Math.sin(this.phi)
		var y = this.r * Math.sin(this.theta) * Math.sin(this.phi)
		var z = this.r * Math.cos(this.phi)

		var res = {
			"x":x,
			"y":y,
			"z":z
		}

		return res
	}
}

class Edge{
	constructor(pt1,pt2){
		pt1 = pt1.get_cartesian()
		pt2 = pt2.get_cartesian()

		this.x1 = pt1["x"]
		this.x2 = pt2["x"]
		this.z1 = pt1["z"]
		this.z2 = pt2["z"]
	}
}

class Shape{
	constructor(pointNum){
		this.points = []
		this.edges = []
		for(var i=0;i<pointNum;i++){
			var theta = (Math.PI/2)*((i%4))+(Math.random()*(Math.PI/2)); //gross math to make sure we gen in all quads
			var phi = (1/6)*Math.PI+((i%2) * (Math.PI/3))+(Math.random()*(Math.PI/3)); //same but for top half, bottom half
			var r = (Math.random() * 50) + 51;

			var pt = new Point(theta,phi,r);
			this.points.push(pt)
		}

		this.edges = this.update_edges(this.points)

		
	}

	rotate(rad){
		for(var i=0;i<this.points.length;i++){
			var new_theta = (this.points[i].theta + rad)% (2*Math.PI)
			this.points[i].theta = new_theta
		}

		this.edges = this.update_edges(this.points)
	}

	update_edges(points){
		var edges = []
		points.sort(function(a,b) {return (a.phi > b.phi) ? 1 : ((b.phi > a.phi) ? -1 : 0);} );

		for(var i = 1;i<this.points.length;i++){
			var pt1 = this.points[i-1]
			var pt2 = this.points[i]

			var edge = new Edge(pt1,pt2)
			edges.push(edge)
		}

		return edges
	}

	get_points(){
		var cartesian_pts = []
		for(var i = 0;i<this.points.length;i++){
			var point = this.points[i]
			var pt = point.get_cartesian()
			cartesian_pts.push(pt)
		}

		return cartesian_pts;
	}

	get_edges(){
		return this.edges;
	}
}


var margin = {top: 40, right: 40, bottom: 60, left: 80},
		width = 500,
	height = 500;

var xScale = d3.scaleLinear()
				.domain([-100,100])
				.range([0,width])

var zScale = d3.scaleLinear()
				.domain([-100,100])
				.range([height,0])

	var yScale = d3.scaleLinear()
					.domain([-100,100])
					.range([2,10])

var canvas = d3.select("#chart").append("svg")
			.attr("display","block")
			.attr("margin","auto")
			.attr("height",height + margin.top + margin.bottom)
			.attr("width",width + margin.left + margin.right)
			.append("g")
    		.attr("transform", "translate(" + margin.left + "," + margin.top + ")")

draw_shape();

function draw_shape(){
	canvas.selectAll("*").remove()

	var myShape = new Shape(30)

	points = myShape.get_points();
	edges = myShape.get_edges();

	var pts = canvas.selectAll("point")
		.data(points).enter()
		.append("circle")
		.attr("r",function(d){return yScale(d["y"]) })
		.attr("cx",function(d) {return xScale(d["x"])})
		.attr("cy",function(d) {return zScale(d["z"])})

	var edges = canvas.selectAll("edge")
		.data(edges).enter()
		.append("line")
		.attr("x1",function(d){return xScale(d["x1"])})
		.attr("y1",function(d){return zScale(d["z1"])})
		.attr("x2",function(d){return xScale(d["x2"])})
		.attr("y2",function(d){return zScale(d["z2"])})
		.attr("stroke-width",2)
		.attr("stroke","black")

	
	repeat();
		
	function repeat(){
		myShape.rotate(Math.PI/4);
		points = myShape.get_points()
		edges = myShape.get_edges()


		canvas.selectAll("circle")
			.data(points)
			.transition()
			.duration(3000)
			.attr("r",function(d){return yScale(d["y"]) })
			.attr("cx",function(d) {return xScale(d["x"])})
			.attr("cy",function(d) {return zScale(d["z"])})
			.on("end",repeat)

		canvas.selectAll("line")
			.data(edges)
			.transition()
			.duration(3000)
			.attr("x1",function(d){return xScale(d["x1"])})
			.attr("y1",function(d){return zScale(d["z1"])})
			.attr("x2",function(d){return xScale(d["x2"])})
			.attr("y2",function(d){return zScale(d["z2"])})
			.attr("stroke-width",2)
			.attr("stroke","black")

	}
}

function morph_shape(){

	var myShape = new Shape(30)

	points = myShape.get_points();
	edges = myShape.get_edges();

	var pts = canvas.selectAll("point")
		.data(points).transition()
		.duration(3000)
		.attr("r",function(d){return yScale(d["y"]) })
		.attr("cx",function(d) {return xScale(d["x"])})
		.attr("cy",function(d) {return zScale(d["z"])})

	var edges = canvas.selectAll("edge")
		.data(edges).transition()
		.duration(3000)
		.attr("x1",function(d){return xScale(d["x1"])})
		.attr("y1",function(d){return zScale(d["z1"])})
		.attr("x2",function(d){return xScale(d["x2"])})
		.attr("y2",function(d){return zScale(d["z2"])})
		.attr("stroke-width",2)
		.attr("stroke","black")

	
	repeat();
		
	function repeat(){
		myShape.rotate(Math.PI/4);
		points = myShape.get_points()
		edges = myShape.get_edges()


		canvas.selectAll("circle")
			.data(points)
			.transition()
			.duration(3000)
			.attr("r",function(d){return yScale(d["y"]) })
			.attr("cx",function(d) {return xScale(d["x"])})
			.attr("cy",function(d) {return zScale(d["z"])})
			.on("end",repeat)

		canvas.selectAll("line")
			.data(edges)
			.transition()
			.duration(3000)
			.attr("x1",function(d){return xScale(d["x1"])})
			.attr("y1",function(d){return zScale(d["z1"])})
			.attr("x2",function(d){return xScale(d["x2"])})
			.attr("y2",function(d){return zScale(d["z2"])})
			.attr("stroke-width",2)
			.attr("stroke","black")

	}
}

setInterval ( morph_shape, 12000 );
