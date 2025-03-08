// Delete this text and put the JS you get from ChatGPT in this file.
const width = 820, height = 640, margin = 64;

const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width + margin * 2)
    .attr("height", height + margin * 2)
    .append("g")
    .attr("transform", `translate(${margin}, ${margin})`);

svg.append("text")
    .attr("x", width / 2)
    .attr("y", -40)
    .attr("text-anchor", "middle")
    .style("font-size", "20px")
    .style("font-weight", "bold")
    .text("News Stories Scatterplot");

svg.append("text")
    .attr("x", width / 2)
    .attr("y", -20)
    .attr("text-anchor", "middle")
    .style("font-size", "14px")
    .style("fill", "gray")
    .text("Visualization of news stories mentioning 'Musk' or 'DOGE' in February 2025");


const tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip");

d3.csv("../stories-with-embeddings.csv").then(data => {
    data.forEach(d => {
        d.x = +d.x;
        d.y = +d.y;
    });

    const xScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.x))
        .range([0, width]);

    const yScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.y))
        .range([height, 0]);

    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(xScale));

    svg.append("g")
        .call(d3.axisLeft(yScale));

    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height + 40)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .text("X Axis Label");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -40)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .text("Y Axis Label");

    const colorScale = d3.scaleOrdinal()
        .domain(["newsweek.com", "nytimes.com", "usatoday.com", "cnn.com", "politico.com", "theguardian.com", "cnbc.com", "latimes.com", "foxnews.com", "nypost.com", "cbsnews.com", "breitbart.com", "buzzfeed.com"])
        .range(d3.schemeCategory10);

        let circles = svg.selectAll("circle")
        .data(data)
        .enter().append("circle")
        .attr("cx", d => xScale(d.x))
        .attr("cy", d => yScale(d.y))
        .attr("r", 5)
        .attr("fill", d => colorScale(d.domain))
        .attr("opacity", 0.7)
        .on("mouseover", (event, d) => {
            tooltip.style("opacity", 1)
                .html(`<strong>${d.title}</strong><br>${d.publication_date}<br>${d.domain}`)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 10) + "px");
        })
        .on("mousemove", event => {
            tooltip.style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 10) + "px");
        })
        .on("mouseout", () => {
            tooltip.style("opacity", 0);
        });
      

    d3.select("#searchBox").on("input", function() {
        const searchTerm = this.value.toLowerCase();
        circles.attr("opacity", d => d.title.toLowerCase().includes(searchTerm) ? 1 : 0.2);
    });

    const legend = svg.append("g")
        .attr("transform", `translate(${width - margin}, 20)`);
    
    colorScale.domain().forEach((domain, i) => {
        const legendRow = legend.append("g")
            .attr("transform", `translate(0, ${i * 20})`);
        
        legendRow.append("rect")
            .attr("width", 10)
            .attr("height", 10)
            .attr("fill", colorScale(domain));
        
        legendRow.append("text")
            .attr("x", 15)
            .attr("y", 10)
            .attr("text-anchor", "start")
            .style("font-size", "12px")
            .text(domain);
    });
});
