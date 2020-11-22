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
    var samples = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var samplesArray = samples.filter(sampleObj => sampleObj.id == sample);
    // D3-1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata = data.metadata;
    var metadataArray = metadata.filter(sampleObj => sampleObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var result = samplesArray[0];
    // console.log(result);
    // D3-2. Create a variable that holds the first sample in the metadata array.
    var metResult = metadataArray[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIds = result.otu_ids;
    //console.log(otuIds);

    var otuLabels = result.otu_labels;

    var sampleValues = result.sample_values;

    // D3-3. Create a variable that holds the washing frequency.
    var wfreq = parseFloat(metResult.wfreq);

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var topTenIds = otuIds.slice(0, 10);
    var idsSortedDesc = topTenIds.reverse();

    var topTenValues = sampleValues.slice(0, 10);
    var valuesSortedDesc = topTenValues.reverse();

    var yticks = idsSortedDesc.map(otuIds => `OTU ${otuIds}`);
    var xticks = valuesSortedDesc;
    var labels = otuLabels.slice(0, 10).reverse();

    // 8. Create the trace for the bar chart. 
    var trace = [{
      x: xticks,
      y: yticks,
      text: labels,
      type: "bar",
      orientation: "h",
      marker: {color: "skyblue"}
    }];

    var barData = trace;

    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      hovermode: "closest",
      plot_bgcolor: "rgba(0,0,0,0)",
      paper_bgcolor: "rgba(0,0,0,0)",
      font: {
        color: "white"
      }
    };

    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    // 1. Create the trace for the bubble chart.
    var bubbleTrace = [{
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: "markers",
      marker: {size: sampleValues, color: otuIds, colorscale: "Portland"}
    }];

    var bubbleData = bubbleTrace

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title:{
        text: "Bacteria Cultures per Sample"},
        font: {
          family: "Arial"
        },
      xaxis: {
        title: {
          text: "OTU ID"
        }
      },
      hovermode: "closest",
      height: 600,
      plot_bgcolor: "rgba(0,0,0,0)",
      paper_bgcolor: "rgba(0,0,0,0)",
      font: {
        color: "white"
      }
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    // 2. Create a variable that holds the first sample in the metadata array.
    var result = resultArray[0];
    // 3. Create a variable that holds the washing frequency.
    var frequency = result.wfreq
    console.log(frequency)

    // 4. Create the trace for the gauge chart.
    var gaugeTrace = [{
      type: "indicator",
      mode: "gauge+number",
      value: wfreq,
      title: {text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week"},
      //marker: {colors: []}
      gauge: {
        axis: {
          range: [null, 10],
          tickwidth: 1, tickcolor: "black", dtick: 2
        },
        bar: { color: "black"},
        borderwidth: 2,
        bordercolor: "darkgrey",
        steps: [
          {range: [0, 2], color: "firebrick"},
          {range: [2, 4], color: "orangered"},
          {range: [4, 6], color: "gold"},
          {range: [6, 8], color: "mediumaquamarine"},
          {range: [8, 10], color: "teal"}
        ],
      }
     
    }];
    
    var gaugeData = gaugeTrace

    // 5. Create the layout for the gauge chart.
    var gaugeLayout = {
      margin: { t: 0, b: 0},
      plot_bgcolor: "rgba(0,0,0,0)",
      paper_bgcolor: "rgba(0,0,0,0)",
      font: {
        color: "white"
      }
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}