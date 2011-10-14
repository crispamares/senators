var tip;

var draw_irpf = function(senators) {
    var width = 1000;
    var height = 800;
    
    
    var irpf = [];
    irpf = senators.map(function(senator){return senator.irpf;});

    var group = senators.map(function(senator){return senator.group;});

    var x, y;

    var chart = d3.select("#irpfChart")
	.attr("width", width + 135)
	.attr("height", height + 100)
	.append("svg:svg")
	.attr("class", "bar_chart")
	.attr("width", width + 135)
	.attr("height", height + 50)
	.append("svg:g");

    // Each object has a layer. Fix the z-index lack
    var barbg_g = chart.append("svg:g");
    var line_g = chart.append("svg:g");
    var bar_g = chart.append("svg:g");
    var tip_g = chart.append("svg:g");

    var draw = function() {
	
	var x_total = Math.abs(d3.min(irpf)) + Math.abs(d3.max(irpf));

	x = d3.scale.linear()
	    .domain([d3.min(irpf),0, d3.max(irpf)])
	    .range([ (Math.abs(d3.min(irpf))/x_total)*width,"0", (Math.abs(d3.max(irpf))/x_total)*width]);

	y = d3.scale.ordinal()
	    .domain(irpf)
            .rangeBands([0, height]);

	chart.attr("transform", "translate("+x(d3.min(irpf))+",40)");


	var barbg = barbg_g.selectAll(".barbg").data(irpf);
	barbg.exit().remove();
	barbg.enter().append("svg:rect");
	barbg.attr("class","barbg")
	    .attr("y", y)
	    .attr("x", -x(d3.min(irpf)))
	    .attr("height", y.rangeBand())
	    .attr("width", width)    
	;

	var line = line_g.selectAll("line").data(x.ticks(10));
	line.exit().remove();
	line.enter().append("svg:line");
	line.attr("x1", x)
	    .attr("x2", x)
	    .attr("y1", 0)
	    .attr("y2", height)
	    .attr("stroke", "#ccc");

	var bar = bar_g.selectAll(".bar").data(irpf);
	bar.exit().remove();
	bar.enter().append("svg:rect");
	bar.attr("class",function (d, i) {return "bar " + group[i];})
	    .attr("y", y)
	    .attr("x", function(d) {return (d >= 0) ? 0 : -x(d);})
	    .attr("height", y.rangeBand())
	    .attr("width", 0)
	    .transition()
	    .duration(1000)
	    .ease("bounce")
	    .attr("width", x)
	;
	
	tip = tip_g.selectAll(".tip")
	    .data([0])
	    .enter()
	    .append("svg:g")
	    .attr("class", "tip")
	    .attr("transform", function(d) 
		  {return "translate("+x(irpf[d])+","+ (y(irpf[d]) + (y.rangeBand() / 2)) +")";})
	;

	tip.append("svg:rect")
	    .attr("width", "8em")
	    .attr("height", "1.4em")
	    .attr("x", ".2em")
	    .attr("y", "-0.7em")
	    .attr("rx", 5)
	    .attr("ry", 5)
	;

	tip.append("svg:text")
	    .attr("dx", "1.5em") // padding-left
	    .attr("dy", ".35em")
	    .text(function (d) {return String(d)+ " €";});


	var rule = chart.selectAll("text.rule").data(x.ticks(10));
	rule.exit().remove();
	rule.enter().append("svg:text");
	rule.attr("class", "rule")
	    .attr("text-anchor", "middle")
	    .attr("y", 0)
	    .attr("dy", -5)
	    .transition(100)
	    .attr("x", x)
	    .text(function (d) {return String(d)+ " €";});


	var on_mouseover = function(d, i) {
	    d3.select(this).classed("selected", true);
	    d3.select(".tip")
		.data([i])
		.transition()
		.duration(250)
		.ease("bounce")
		.attr("transform", function(d) 
		      {return "translate("+x(irpf[d])+","+ (y(irpf[d]) + (y.rangeBand() / 2)) +")";})
		.each("end", function () {
			  d3.select(".tip text")
			      .data([i])
			      .text(function(d) {return String(irpf[d].toFixed(2))+ " €";})	
			  ;
		      }
		     );
	};

	var on_mouseout = function(d, i) {
	    d3.select(this).classed("selected",false);
	};
	
	chart.selectAll(".barbg").on("mouseover", on_mouseover );
	chart.selectAll(".bar").on("mouseover", on_mouseover );

	chart.selectAll(".barbg").on("mouseout", on_mouseout);
	chart.selectAll(".bar").on("mouseout", on_mouseout);
	
    };

    var drill_up = function() {
 	group = [];
	irpf = [];
	var data = {};
	senators.map(function (d) {
			 if (data[d.group] == undefined)
			     data[d.group] = d.irpf;
			 else
			     data[d.group] += d.irpf;
		     });
	group = d3.keys(data);
	irpf = d3.values(data);

	draw();
    };

    var drill_down = function() {
	irpf = senators.map(function(senator){return senator.irpf;});
	group = senators.map(function(senator){return senator.group;});
	
	draw();
    };


    var btn_array = d3.select("#irpfChart").insert("div", ".bar_chart")
	.classed("button_array", true)
    ;


    var sort_by_amount = function(sen_a, sen_b) {return d3.descending(sen_a.irpf, sen_b.irpf);};

    var sort_by_group = function(sen_a, sen_b) {
	if (sen_a.group == sen_b.group) 
	    return d3.descending(sen_a.irpf, sen_b.irpf);
	else
	    return d3.descending(sen_a.group, sen_b.group);
    };


    btn_array.append("span").text("   Values per:  ");

    btn_array.append("button")
	.classed("first", true)
	.text("Senator")
	.on("click", drill_down)
    ;
    btn_array.append("button")
	.classed("last", true)
	.text("Group")
	.on("click", drill_up)
    ;
    btn_array.append("span").text("   Order by:  ");

    btn_array.append("button")
	.classed("first", true)
	.text("Amount")
	.on("click", function(){draw_sorted(sort_by_amount);})
    ;
    btn_array.append("button")
	.classed("last", true)
	.text("Group")
	.on("click", function(){draw_sorted(sort_by_group);})
    ;



    var draw_sorted = function(ordering) {
	var zip = d3.zip(group, irpf).map(function(d) {return {group:d[0], irpf:d[1]};});

	y.domain(zip.sort(ordering).map(function(senator){return senator.irpf;}));

	chart.selectAll(".bar")
	    .data(irpf)
	    .transition()
	    .attr("y", y)
	    ;
	chart.selectAll(".barbg")
	    .data(irpf)
	    .transition()
	    .attr("y", y)
	    ;
	
    };


    draw();

};

main = draw_irpf;
