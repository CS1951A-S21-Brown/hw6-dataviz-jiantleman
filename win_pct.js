run_q2();

function run_q2(){

    let svg = d3.select("#graph2")
        .append("svg")
        .attr("width", graph_2_width)
        .attr("height", graph_2_height)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Map and projection
    var path = d3.geoPath();
    var projection = d3.geoMercator()
      .scale(120)
      .center([70,0])
      .translate([graph_2_width / 2, graph_2_height / 2]);

    // Data and color scale
    colorRange = ["#f0e6c9"]
    var i;
    // colors = d3.quantize(d3.interpolateHcl("#49BCE3", "#1077C3"), 6)
    colors = d3.quantize(d3.interpolateHcl("#56042C","#FEC310"), 10)
    for (i=0; i<colors.length;i++){
        colorRange.push(colors[i])
    }
    colorRange.push()
    var data = d3.map();
    var colorScale = d3.scaleThreshold()
        .domain([1,2,3,4,5,6,7,8,9,10])
        .range(colorRange);



    // Load external data and boot
    promises = [];
    promises.push(d3.json("../data/world.geojson"));
    promises.push(d3.csv("../data/football_q2.csv", function(d) { data.set(d.code, [d.rank,d.win_pct]); }));

    Promise.all(promises).then(ready);

    function ready(topo){

        var tooltip = d3.select("#graph2")
           .append("div")
           .style("opacity", 0)
           .attr("class", "tooltip")
           .style("background-color", "white")
           .style("border", "solid")
           .style("border-width", "2px")
           .style("border-radius", "5px")
           .style("padding", "5px")

        let mouseOver = function(d) {
        tooltip.style("opacity",1);
        d3.selectAll(".Country")
          .style("opacity", .5);
        d3.select(this)
          .style("opacity", 1)
          .style("stroke", "black");
        }

        let mouseMove = function(d){
            var name = d.properties.name;
            if (d.total == 0){
                tooltip.html(name + " (unranked)")
                    .style("left", (d3.mouse(this)[0]) + "px")
                    .style("top", (d3.mouse(this)[1]+50) + "px");
            }else{
                var pct = parseFloat(d.total[1]*100).toFixed(1)+"%";
                var rank = d.total[0]
                tooltip.html(name + " (No. " + rank + ", Winning %: " + pct +")")
                    .style("left", (d3.mouse(this)[0]) + "px")
                    .style("top", (d3.mouse(this)[1]+50) + "px");

            }

        };

        let mouseOut = function(d) {
        tooltip.style("opacity",0);
        d3.selectAll(".Country")
          .style("opacity", .8);
        d3.select(this)
          .style("stroke", "transparent");
        }

        svg.append("g")
            .selectAll("path")
            .data(topo[0].features)
            .enter()
            .append("path")
      // draw each country
                .attr("d", d3.geoPath()
                    .projection(projection))

      // set the color of each country
                .attr("fill", function (d) {
                    d.total = data.get(d.id) || 0;
                    if (d.total == 0){
                        return colorScale(d.total);
                    }else{
                        return colorScale(d.total[0]);
                    }

                })
                .style("stroke", "transparent")
                .attr("class", function(d){ return "Country" } )
                .style("opacity", .8)
                .on("mouseover", mouseOver )
                .on("mouseleave", mouseOut )
                .on("mousemove", mouseMove );


    };

}
