(function(){

    let svg = d3.select("#graph3")
        .append("svg")
        .attr("width", graph_3_width)
        .attr("height", graph_3_height)
        .append("g")
        .attr("transform", `translate(${margin.left/2}, ${margin.top})`);


    d3.csv("./data/football_q3.csv").then(function(data){

        // Clean data
        var i;
        for (i=0;i< data.length; i++){
            data[i].won = parseInt(data[i].won);
            data[i].goal_diff = parseInt(data[i].goal_diff);
            data[i].score = parseFloat(data[i].score);
        }

        // Define x_axis
        let x = d3.scaleLinear()
            .domain([d3.min(data, function(d) { return d.goal_diff; })-1, d3.max(data, function(d) { return d.goal_diff; })+1])
            .range([0, graph_3_width - margin.right]);

        // Define y_axis
        let y = d3.scaleLinear()
            .domain([0, d3.max(data, function(d) { return d.won; })+1])
            .range([graph_3_height - margin.top - margin.bottom,0]);

        //Add x-axis label
        svg.append("g")
            .call(d3.axisBottom(x))
            .attr("transform", `translate(0, ${graph_3_height - margin.top - margin.bottom})`);

        // Add y-axis label
        svg.append("g")
            .call(d3.axisLeft(y))
            .attr("transform", `translate(121.5, 0)`);

        // Add y-axis title
        svg.append("text")
            .attr("transform", `translate(121.5, -10)`)
            .style("text-anchor", "middle")
            .text("Number of Wins");


        // Add x-axis title
        svg.append("text")
            .attr("transform", `translate(${(graph_3_width-margin.right) / 2},
                                        ${(graph_3_height - margin.top - margin.bottom) + 40})`)       // HINT: Place this at the bottom middle edge of the graph
            .style("text-anchor", "middle")
            .text("Goal Difference");

        // Define color scale
        var max = d3.max(data, function(d) {return d.score});
        var min = d3.min(data, function(d) {return d.score});
        let color = d3.scaleQuantize()
            .domain([min,max])
            .range(d3.quantize(d3.interpolateHcl("#FEC310", "#56042C"), max-min));

        //Create tooltip
        var tooltip = d3.select("#graph3")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "5px")

        var mouseover = function(d) {
            tooltip
              .style("opacity", 1)
            d3.select(this)
              .style("stroke", "black")
        }
        var mousemove = function(d) {
            tooltip
              .html(d.country + " - #"+ d.rank + ", W: " + d.won  + ", GD: " + d.goal_diff + "")
              .style("left", (d3.mouse(this)[0]) + "px")
              .style("top", (d3.mouse(this)[1]) + "px")
        }
        var mouseleave = function(d) {
            tooltip
                .style("opacity", 0)
            d3.select(this)
              .style("stroke", "grey")
        }


        // Add scatterplot
        let dots = svg.selectAll("dot").data(data);
        dots.enter()
            .append("circle")
            .attr("cx", function (d) { return x(d.goal_diff) + Math.random()*10; })
            .attr("cy", function (d) { return y(d.won) + Math.random()*10; })
            .attr("r", 6)
            .style("fill",  function(d){ return color(d.score); })
            .style("stroke", "grey")
            .on("mouseenter", mouseover)
            .on("mouseleave", mouseleave)
            .on("mousemove", mousemove);

    });

})();
