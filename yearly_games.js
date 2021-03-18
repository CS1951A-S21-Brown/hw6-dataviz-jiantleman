run_q1();

function run_q1(){

    // Default slider values
    let cur_start_year = 1989;
    let cur_end_year = 2019;
    updateGraph();

    // Create svg for graph 1
    let svg = d3.select("#graph1")
        .append("svg")
        .attr("width", graph_1_width)
        .attr("height", graph_1_height)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Set up reference to count SVG group
    let countRef = svg.append("g");
    // Set up reference to y axis label
    let x_axis_label = svg.append("g");

    // Create linear scale for y axis
    let y = d3.scaleLinear()
        .range([0,graph_1_height - margin.top - margin.bottom]);

    // Create linear scale for x axis
    let x = d3.scaleBand()
        .range([0,graph_1_width - margin.left - margin.right])
        .padding(0.1);

    // Add x-axis label
    svg.append("text")
        .attr("transform", `translate(${graph_1_width/2 - margin.left}, ${graph_1_height - margin.top})`)
        .style("text-anchor", "middle")
        .text("Year");

    // Add y-axis label
    svg.append("text")
        .style("text-anchor", "middle")
        .text("Number of Football Games")
        .attr("transform", `translate(-20,${graph_1_height/2 - margin.top})rotate(-90)`);

    // Slider control
    var slider = new Slider('#yearSelect', {});
    slider.on("slideStop", function(range) {
        cur_start_year = range[0];
        cur_end_year = range[1];
        updateGraph();
    });

    function updateGraph (){
        d3.csv("../data/football_q1.csv").then(function(data){

            yearlyGames = cleanData_graph1(data, cur_start_year, cur_end_year);

            // y axis domain
            y.domain([d3.max(yearlyGames, function(d) {return d.count}),0]);

            // x axis domain
            x.domain(yearlyGames.map(x => x.year));

            // Add x-axis label
            x_axis_label.call(d3.axisBottom(x).tickSize(5).tickPadding(10))
                .style("text-anchor", "end")
                .style("font-size", Math.min(x.bandwidth()*0.4,15))
                .attr("transform", `translate(0, ${graph_1_height - margin.top - margin.bottom})`)
                .selectAll("text")
                    .attr("transform", "translate(-10,0)rotate(-45)");

            // Define color scale
            var max = d3.max(yearlyGames, function(d) {return d.count});
            var min = d3.min(yearlyGames, function(d) {return d.count});
            let color = d3.scaleQuantize()
                .domain([min,Math.max(max,min+1)+1])
                .range(d3.quantize(d3.interpolateHcl("#FEC310", "#56042C"), Math.max(max,min+1)+1-min));

            // Render bar elements
            let bars = svg.selectAll("rect").data(yearlyGames);
            bars.enter()
                .append("rect")
                .merge(bars)
                .attr("y", function(d) {return y(d.count)})
                .attr("x", function(d) {return x(d.year)})
                .attr("height", function(d) {return graph_1_height - margin.top - margin.bottom - y(d.count)})
                .attr("width",  x.bandwidth())
                .attr("fill", function(d) { return color(d.count)});

            // Display count
            let counts = countRef.selectAll("text").data(yearlyGames);

            counts.enter()
                .append("text")
                .merge(counts)
                .attr("y", function(d) {return y(d.count) - 5})
                .attr("x", function(d) {return x(d.year) + (4-d.count.toString().length) * x.bandwidth()* 0.1})
                .style("text-anchor", "start")
                .style("font-size", Math.min(x.bandwidth()*0.5,15))
                .text(function(d){return d.count});

            bars.exit().remove();
            counts.exit().remove();


        })
    };

    function cleanData_graph1(data, cur_start_year, cur_end_year){


        var i;
        for (i=0;i< data.length; i++){
            var date = new Date(data[i].year);
            data[i].year = date.getFullYear();
            data[i].count = parseInt(data[i].count);
        }
        return data.slice(cur_start_year - 1872,cur_end_year+1 - 1872);

        /* Old code for data cleaning using JS
        // Change data type
        var i;
        for (i=0;i< data.length; i++){
            var date = new Date(data[i].date);
            data[i].date = date.getFullYear();
            data[i].home_score = parseInt(data[i].home_score);
            data[i].away_score = parseInt(data[i].away_score);
        }

        // Group by year
        let yearlyGames_int = data.reduce((acc,value)=>{
            if(!acc[value.date]){
                acc[value.date] = [];
            }
            acc[value.date].push(value);
            return acc;
        }, {});

        // Convert from object to array
        var yearlyGames = [];
        for (const [key, value] of Object.entries(yearlyGames_int)){
            var date = new Date(key);
            yearlyGames.push({"year":date.getFullYear(), "count":value.length});
        }
        return yearlyGames.slice(cur_start_year - 1872,cur_end_year+1 - 1872);

        */
    }
}
