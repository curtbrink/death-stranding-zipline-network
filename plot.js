// SVG dimensions
var width = 1000,
    height = 1000;

// Create the main SVG
var svg = d3.select("#container")
    .append("svg:svg")
    .attr("width", width)
    .attr("height", height);

// Setup scales to map game co-ordinates to dimensions
var xScale = d3.scaleLinear()
    .domain(scale.x)
    .range([0, width]);
var yScale = d3.scaleLinear()
    .domain(scale.y)
    .range([0, height]);

// Draw the prepper circles
svg.selectAll("circles")
    .data(preppers)
    .enter()
    .append("svg:circle")
    .attr("class", "prepper")
    .attr("cx", function(d) { return Math.round(xScale(d.x)); })
    .attr("cy", function(d) { return Math.round(yScale(d.y)); })
    .attr("r", "7px")
    .append("svg:title")
    .text(function(d) { return d.name });

// Calculate which ziplines will connect
// Does not take in to account any obstacles between ziplines
var links = [];
var shortest = 1000000;
var longest = 0;
for (i = 0; i < ziplines.length; i++) {
    for (j = i + 1; j < ziplines.length; j++) {
        var length = Math.floor(Math.hypot(ziplines[i].x - ziplines[j].x, ziplines[i].y - ziplines[j].y));
        var required_length = (ziplines[i].level + ziplines[j].level > 2 ? 350 : 300);
        if (length <= required_length) {
            links.push({ source: ziplines[i], target: ziplines[j] });
            if (length > longest) {
                longest = length;
            }
            if (length < shortest) {
                shortest = length;
            }
        }
    }
}

// Draw lines between the connected ziplines
svg.selectAll(".line")
    .data(links)
    .enter()
    .append("line")
    .attr("class", "line")
    .attr("x1", function(d) { return xScale(d.source.x) })
    .attr("y1", function(d) { return yScale(d.source.y) })
    .attr("x2", function(d) { return xScale(d.target.x) })
    .attr("y2", function(d) { return yScale(d.target.y) });

// Draw the zipline circles
svg.selectAll("circles")
    .data(ziplines)
    .enter()
    .append("svg:circle")
    .attr("class", function(d) { return (d.mine ? "zipline_mine" : "zipline_not_mine") })
    .attr("cx", function(d) { return Math.round(xScale(d.x)) })
    .attr("cy", function(d) { return Math.round(yScale(d.y)) })
    .attr("r", "5px")
    .append("svg:title")
    .text(function(d) { return "X: " + d.x + ", Y: " + d.y + ", Level: " + d.level });

// Label the prepper circles
svg.selectAll("text")
    .data(preppers)
    .enter()
    .append("text")
    .attr("class", "prepper")
    .attr("x", function(d) { return Math.round(xScale(d.x)) + 7; })
    .attr("y", function(d) { return Math.round(yScale(d.y)) - 7; })
    .text(function(d) { return d.short; });

// Add some stats
var mine = ziplines.filter(d => d.mine == true).length;
svg.append("text")
    .attr("x", 20)
    .attr("y", 30)
    .attr("class", "zipline_mine")
    .text("My Zipline Count: " + mine +
        " (" + (mine * 500).toLocaleString('en') + " / 41,220 Max Bandwidth)");
svg.append("text")
    .attr("x", 20)
    .attr("y", 50)
    .attr("class", "zipline_not_mine")
    .text("Borrowed Zipline Count: " + ziplines.filter(d => d.mine == false).length);
svg.append("text")
    .attr("x", 20)
    .attr("y", 70)
    .attr("class", "zipline_mine")
    .text("Connected Ziplines Count: " + links.length);
svg.append("text")
    .attr("x", 20)
    .attr("y", 90)
    .attr("class", "zipline_mine")
    .text("Shortest Connection: " + shortest + "m");
svg.append("text")
    .attr("x", 20)
    .attr("y", 110)
    .attr("class", "zipline_mine")
    .text("Longest Connection: " + longest + "m");