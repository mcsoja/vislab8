d3.csv("driving.csv", d3.autoType).then(data => {

    console.log(data)
    var gasList = []
    for (i = 0; i < data.length; i++) {
      gasList.push(data[i].gas);
    }
    var milesList = []
    for (i = 0; i < data.length; i++) {
      milesList.push(data[i].miles);
    }    
    
    const margin = ({top: 25, right: 10, bottom: 25, left: 40})
    const width = 550 - margin.left - margin.right,
    height = 550 - margin.top - margin.bottom;

    const svg = d3.select(".chart").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .attr('x', 100)

    const Gas = d3
      .scaleLinear()
      .domain(d3.extent(gasList)).nice()
      //.domain([1,10])
      .range([width, 0])

    const Miles = d3
      .scaleLinear()
      .domain(d3.extent(milesList)).nice()
      .range([0,height])

    var dollarFormat = function(d) { return '$' + d3.format('.2f')(d) };
    var tick = function(d) { return d3.format(',')(d) };

      const line = d3
      .line()
      .x(function(d) {
          return Miles(d.miles)
      })
      .y(function (d){
          return Gas(d.gas)
      });

   svg.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line)
      .attr("stroke", "black")
      .attr("stroke-width", 2)
      .attr("fill", "#FFFFFF");

      var dot = svg.append("g")
      .selectAll("dot")
      .data(data)
      .enter()
      .append("g")

    // svg.selectAll('.chart')
    //   .data(data)
    //   .enter()

    function position(d) {
        const t = d3.select(this);
        switch (d.side) {
          case "top":
            t.attr("text-anchor", "middle").attr("dy", "-0.7em");
            break;
          case "right":
            t.attr("dx", "0.5em")
              .attr("dy", "0.32em")
              .attr("text-anchor", "start");
            break;
          case "bottom":
            t.attr("text-anchor", "middle").attr("dy", "1.4em");
            break;
          case "left":
            t.attr("dx", "-0.5em")
              .attr("dy", "0.32em")
              .attr("text-anchor", "end");
            break;
        }
      }

      function halo(text) {
        text
          .select(function() {
            return this.parentNode.insertBefore(this.cloneNode(true), this);
          })
          .attr("fill", "none")
          .attr("stroke", "white")
          .attr("stroke-width", 4)
          .attr("stroke-linejoin", "round");
      }

//     const line = d3
//       .line()
//       .x(function(d) {
//           return Miles(d.miles)
//       })
//       .y(function (d){
//           return Gas(d.gas)
//       });

//    svg.append("path")
//       .datum(data)
//       .attr("class", "line")
//       .attr("d", line)
//       .attr("stroke", "black")
//       .attr("stroke-width", 2)
//       .attr("fill", "#FFFFFF");

    dot.append('circle')
      .attr('class', 'dot')
      .attr('cx', (d,i)=>Miles(d.miles))
      .attr('cy', (d,i)=>Gas(d.gas))
      .attr('fill', 'white') 
      .attr('r',4)
      .attr('opacity', 2)
      .attr('stroke', 'black')
      .attr('stroke-width', '1.2')
      
     dot
        .append('text')
        .attr("class", "label")
		.attr('x', (d)=>Miles(d.miles)+6)
        .attr('y', (d)=>Gas(d.gas))
        .attr("font-size", 10)
        .each(position)
		.text(function(d){
			return d.year
        })
        
    svg.selectAll('text')
    .each(position)
    .call(halo)

    
      const xAxis = d3.axisBottom()
      .scale(Miles)
      .ticks(5, "s")
      .tickFormat(tick)
      
    
    // Draw the axis
    let xAxisGroup = svg.append("g")
      .attr("class", "axis x-axis")
      .call(xAxis)   
      .attr("transform", `translate(0, ${height})`)
  
      const yAxis = d3.axisLeft()
          .scale(Gas)
          .ticks(8, "s")
          .tickFormat(dollarFormat)


    xAxisGroup.select(".domain").remove()
    
    // Draw the axis
    let yAxisGroup = svg.append("g")
      .attr("class", "axis y-axis")
      .call(yAxis)   
      //.attr("transform", `0, translate(${width})`)

      yAxisGroup.select(".domain").remove()
   

    xAxisGroup.selectAll(".tick line")
    .clone()
    .attr("y2", -height)
    .attr("stroke-opacity", 0.1) // make it transparent

    yAxisGroup.selectAll(".tick line")
    .clone()
    .attr("x2", width)
    .attr("stroke-opacity", 0.1) // make it transparent
      
    svg.append("text")
      .attr('x', 320)
      .attr('y', 495)
      .text("Miles per person per year")
      .attr('font-weight', 'bold')
      .attr('font-size',13)
      .call(halo)

    svg.append("text")
      .attr('x', 10)
      .attr('y', 5)
      .attr('font-size',13)
      .text("Cost per gallon")
      .attr('font-weight', 'bold')
      .call(halo)




})