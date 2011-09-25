var draw_irpf = function(senators) {
    var width = 1000;
    var height = 4000;
    
    var irpf = [];
    irpf = senators.map(function(senator){return senator.irpf;});

    var x_total = Math.abs(d3.min(irpf)) + Math.abs(d3.max(irpf));

    var x = d3.scale.linear()
	.domain([d3.min(irpf),0, d3.max(irpf)])
	.range([ (Math.abs(d3.min(irpf))/x_total)*width,"0", (Math.abs(d3.max(irpf))/x_total)*width]);

    var y = d3.scale.ordinal()
        .domain(irpf)
        .rangeBands([0, height]);

    var chart = d3.select("#irpfChart")
	.append("svg:svg")
	.attr("class", "bar_chart")
	.attr("width", width + 100)
	.attr("height", height + 40)
	.append("svg:g")
	.attr("transform", "translate("+x(d3.min(irpf))+",40)");

    chart.selectAll(".barbg")
	.data(irpf)
	.enter()
	.append("svg:rect")
	.attr("class","barbg")
	.attr("y", y)
	.attr("x", -x(d3.min(irpf)))
	.attr("height", y.rangeBand())
	.attr("width", width)    
    ;

    chart.selectAll("line")
	.data(x.ticks(10))
	.enter().append("svg:line")
	.attr("x1", x)
	.attr("x2", x)
	.attr("y1", 0)
	.attr("y2", height)
	.attr("stroke", "#ccc");

    chart.selectAll(".bar")
	.data(irpf)
	.enter()
	.append("svg:rect")
	.attr("class","bar")
	.attr("y", y)
	.attr("x", function(d) {return (d >= 0) ? 0 : -x(d);})
	.attr("height", y.rangeBand())
	.attr("width", 0)
	.transition()
	.duration(1000)
	.ease("bounce")
	.attr("width", x)
    ;

    chart.selectAll("text")
	.data(irpf)
	.enter().append("svg:text")
	.attr("x", x)
	.attr("y", function(d) { return y(d) + y.rangeBand() / 2; })
	.attr("dx", 4) // padding-left
	.attr("dy", ".35em") // vertical-align: middle
	.attr("text-anchor", "start") // text-align: right
	.attr("opacity", 0)
	.text(String)
	.transition()
	.delay(1000)
	.duration(1000)
	.attr("opacity", 1)
    ;

    chart.selectAll("text.rule")
	.data(x.ticks(10))
	.enter().append("svg:text")
	.attr("class", "rule")
	.attr("x", x)
	.attr("y", 0)
	.attr("dy", -5)
	.attr("text-anchor", "middle")
	.text(String);

    chart.selectAll(".barbg").on("mouseover", function() {
				   d3.select(this).attr("class", "selected");
			       });

    chart.selectAll(".barbg").on("mouseout", function() {
				   d3.select(this).attr("class","barbg");
			       });

};

main = draw_irpf;
