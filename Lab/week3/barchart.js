var padding = 100, // space around the chart, not including labels,
    width = 700,
    height = 400;


// set the ranges
var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);

var y = d3.scale.linear().range([height, 0]);

// define the axis
var xAxis = d3.svg.axis().outerTickSize(0)
    .scale(x)
    .orient("bottom")


var yAxis = d3.svg.axis().outerTickSize(0)
    .scale(y)
    .orient("left")
    .ticks(10);

// add the SVG element
var svg = d3.select("body").append("svg")
    .attr("width", width + padding + padding)
    .attr("height", height + padding + padding)
  .append("g")
    .attr("transform", 
          "translate(" + padding + "," + padding + ")");
 


// load the data
d3.json("jsonfile.json", function(error, data) {

    data.forEach(function(d) {
        d.firstkey = d.firstkey;
        d.secondkey = +d.secondkey;
    });
  
  // scale the range of the data
  x.domain(data.map(function(d) { return d.firstkey; }));
  y.domain([0, d3.max(data, function(d) { return d.secondkey; })]);

  // add axis
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("transform", "translate("+ ((width/2)) +",50)")
      .style("text-anchor", "middle")
      .style("font-size", "16px")
      .text("AVERAGE MONTHLY PRECIPITATION");


  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 5)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("milimeters");


  // Add bar chart
  svg.selectAll("bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.firstkey); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.secondkey); })
      .attr("height", function(d) { return height - y(d.secondkey); });

  svg.selectAll("text")
      .data(data)
    .enter().append("text")
      .attr("x", function(d) { return x(d.firstkey); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.secondkey) -10; })
      .attr("dy", ".75em")
      .text(function(d) { return d.secondkey; });

});