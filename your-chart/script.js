// Delete this text and put the JS you get from ChatGPT in this file.
const width = 800, height = 600, margin = 40;

const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width + margin * 2)
    .attr("height", height + margin * 2)
    .append("g")
    .attr("transform", `translate(${margin}, ${margin})`);

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

    let circles = svg.selectAll("circle")
        .data(data)
        .enter().append("circle")
        .attr("cx", d => xScale(d.x))
        .attr("cy", d => yScale(d.y))
        .attr("r", 5)
        .attr("fill", "steelblue")
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
});
