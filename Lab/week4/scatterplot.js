var margin = {top: 120, right: 20, bottom: 60, left: 80},
    width = 960 - margin.left - margin.right,
    height = 630 - margin.top - margin.bottom;

var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.category10();

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var legendaNames = ["<22000", "22000-26000","26000-30000", ">30000"]

var infocircles = [
  {"x":145, "y":-15, "infobox":"Equal to 1 minus the intergenerational income elasticity"},  
  {"x":285, "y":height + 42, "infobox":"Percentage of children that grow up in a household where the equalized household income is 50% of the median"}
];

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<span>" + d.infobox + "</span>";
  })

var countrytip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<span>" + d.country + "</span>";
  })

svg.call(tip);
svg.call(countrytip);

// load the data
d3.json("scatterjson.json", function(error, data) {

    data.forEach(function(d) {
        d.relative_childpoverty = +d.relative_childpoverty;
        d.intergenerational_mobility = +d.intergenerational_mobility;
        d.population = +d.population;
        d.infobox = +d.infobox;
    });
  
  // scale the range of the data
  x.domain(data.map(function(d) { return d.relative_childpoverty; }));
  y.domain([0, d3.max(data, function(d) { return d.intergenerational_mobility; })]);

  x.domain(d3.extent(data, function(d) { return d.relative_childpoverty; })).nice();
  var yrange = d3.extent(data, function(d) { return d.intergenerational_mobility; });
  y.domain( [yrange[0] - 0.05, yrange[1]] ).nice()


  /* Define the data for the circles */
    var elem = svg.selectAll("g myCircleText")
        .data(infocircles)
  
    /*Create and place the "blocks" containing the circle and the text */  
    var elemEnter = elem.enter()
      .append("g")
      .attr("transform", function(d){return "translate("+d.x+","+d.y+")"})
 
    /*Create the circle for each block */
    var circle = elemEnter.append("text")
      .attr('font-family', 'FontAwesome')
      .attr('font-size', 18)
      .text(function(d) { return '\uf05a' })
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)

  // x axis
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("y", +40)
      .style("text-anchor", "begin")
      .text("Relative Child Poverty, Percentage")

  // y axis
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("y", -30)
      .attr("x", 140)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Economic Mobility, index")

  // datadots
  svg.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", function(d) { return (6 + d.population / 8000000); })
      .attr("cx", function(d) { return x(d.relative_childpoverty); })
      .attr("cy", function(d) { return y(d.intergenerational_mobility); })
      .style("fill", function(d) { return color(d.color); })
      .on('mouseover', countrytip.show)
      .on('mouseout', countrytip.hide)

  // legenda title
  svg.append("text")
       .attr("class", "legendatitle")
       .attr("x",860)
       .attr("y",-5)
       .style("text-anchor", "end")
       .text("Median Household Income")

  // legenda
  var legend = svg.selectAll(".legend")
      .data(color.domain())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  legend.append("text")
      .data(legendaNames)
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });

});

function type(d) {
  d.frequency = +d.frequency;
  return d;
}