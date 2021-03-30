run_q2();

function run_q2(){

    // Create svg for graph 2
    let svg = d3.select("#graph2")
        .append("svg")
        .attr("width", graph_2_width - margin.left - margin.right)
        .attr("height", graph_2_height)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Map
    var path = d3.geoPath();
    var projection = d3.geoMercator()
      .scale(110)
      .center([105,0])
      .translate([graph_2_width / 2, graph_2_height / 2]);

    // Color scale
    colorRange = ["#f0e6c9"]
    var i;
    colors = d3.quantize(d3.interpolateHcl("#56042C","#FEC310"), 10)
    for (i=0; i<colors.length;i++){
        colorRange.push(colors[i])
    }
    colorRange.push()
    var data = d3.map();
    var colorScale = d3.scaleThreshold()
        .domain([1,2,3,4,5,6,7,8,9,10])
        .range(colorRange);


    // Load data
    promises = [];
    promises.push(d3.json("./data/world.geojson"));
    promises.push(d3.csv("./data/football_q2.csv", function(d) { data.set(d.code, [parseInt(d.rank),parseFloat(d.win_pct)]); }));

    Promise.all(promises).then(ready);

    function ready(topo){

        // Add tooltip
        var tooltip = d3.select("#graph2")
           .append("div")
           .style("opacity", 0)
           .attr("class", "tooltip")
           .style("background-color", "white")
           .style("border", "solid")
           .style("border-width", "2px")
           .style("border-radius", "5px")
           .style("padding", "5px")


        // Define moveover function - map
        let mouseOver = function(d) {
        tooltip.style("opacity",1);
        d3.selectAll(".Country")
          .style("opacity", .5);
        d3.select(this)
          .style("opacity", 1)
          .style("stroke", "black");
        }

        // Define moveover function - tooltip
        let mouseMove = function(d){
            var name = d.properties.name;
            if (d.total == 0){
                tooltip.html(name + "</br>Unranked")
                    .style("left", (d3.mouse(this)[0]+100) + "px")
                    .style("top", (d3.mouse(this)[1]+50) + "px");
            }else{
                var pct = parseFloat(d.total[1]*100).toFixed(1);
                var rank = d.total[0]
                tooltip.html(name + "</br>No. " + rank + "</br>Winning %: " + pct)
                    .style("left", (d3.mouse(this)[0]+100) + "px")
                    .style("top", (d3.mouse(this)[1]+50) + "px");

            }

        };

        // Define mouseout function - map
        let mouseOut = function(d) {
        tooltip.style("opacity",0);
        d3.selectAll(".Country")
          .style("opacity", .8);
        d3.select(this)
          .style("stroke", "white");
        }

        // Add map
        svg.append("g")
            .selectAll("path")
            .data(topo[0].features)
            .enter()
            .append("path")
                .attr("d", d3.geoPath()
                    .projection(projection))
                .attr("fill", function (d) {
                    d.total = data.get(d.id) || 0;
                    if (d.total == 0){
                        return colorScale(d.total);
                    }else{
                        return colorScale(d.total[0]);
                    }

                })
                .style("stroke", "white")
                .attr("class", function(d){ return "Country" } )
                .style("opacity", .8)
                .on("mouseover", mouseOver )
                .on("mouseout", mouseOut )
                .on("mousemove", mouseMove );


    };

}
