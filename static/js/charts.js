function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    const allSamples = data.samples;

    console.log("Step 3 (allSamples): ");
    console.log(allSamples);

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    let selSample = allSamples.filter(selected => selected.id == sample);

    console.log("Step 4 (selSample): ");
    console.log(selSample);

    //  5. Create a variable that holds the first sample in the array.
    let firstSample = selSample[0];
    console.log("Step 5 (firstSample): ");
    console.log(firstSample);

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    let selOTUId = firstSample.otu_ids;
    let selOTULabel = firstSample.otu_labels;
    let selSampleValue = firstSample.sample_values;

    console.log("Step 6 (firstSample.x): ");
    console.log("OTU ID: ", selOTUId);
    console.log("OTU Label: ", selOTULabel);
    console.log("Sample Values: ", selSampleValue);

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last.
    var xticks = selSampleValue.slice(0, 10).reverse();
    var yticks = selOTUId.slice(0, 10).map(selOTUId => "OTU " + selOTUId).reverse();

    console.log("Step 7 (top 10 desc): ");
    console.log("x (reverse) : ", xticks);
    console.log("y (reverse) : ", yticks);

    // 8. Create the trace for the bar chart. 
    var barData = [
      {
        x: xticks,
        y: yticks,
        type: 'bar',
        orientation: 'h'
      }
    ];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    // Bubble Chart section
    // 1. Create the trace for the bubble chart.
    var bubbleData = [
      xticksb = selOTUId  // otu_ids
      yticksb = selSampleValue  // sample value
      zticksb = selOTULabel // otu labels

      mode = 'markers'
      marker = dict(
        color= ['rgb(93, 164, 214)', 'rgb(255, 144, 14)', 'rgb(44, 160, 101)', 'rgb(255, 65, 54)'], // Color
        showscale=True  // Colorscale
        size=size,  // Size
        sizemode='area'
        sizeref= 2.*max(size)/(40.**2)
      )
    ];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis = dict(
        title="OTU ID"
      )
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble', bubbleData, bubbleLayout);; 

  });
}
