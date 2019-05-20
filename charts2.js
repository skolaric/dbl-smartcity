class Chart2 
{
  constructor(container, featureDblUuid) 
	{
    this.container = container;
    this.featureDblUuid = featureDblUuid; // featureDblUuid
  }

	// the following function is called in index.js, see the line:
	//   chart2.showPlotlyInstances(featureDblUuid);
  async showPlotlyInstances() 
	{
    const plotlyInstancesContainerDiv = "chart_sensorData_temperature";
    this.createContainer(plotlyInstancesContainerDiv);
    this.deleteExistingPlotlyInstances(plotlyInstancesContainerDiv);

    const featureData = await this.requestFeatureData(this.featureDblUuid);
    const plotlyInstancesData = this.extractDataForPlotlyInstances(featureData);
    this.drawPlotlyInstances(plotlyInstancesData, plotlyInstancesContainerDiv);
  }

  requestFeatureData(featureDblUuid) {
    return new Promise((resolve, reject) => {
      fetch(`/sensordata?id=${featureDblUuid}`).then(response => {
        response.json().then(featureData => {
          resolve(featureData);
        });
      });
    });
  }
	
  extractDataForPlotlyInstances(featureData) {
    return featureData.map(plotlyLineData => {
      return {
        title: plotlyLineData.title,
        data: [
          {
            x: this.extractColumnFromDataSet(plotlyLineData.data, "datetime"),
            y: this.extractColumnFromDataSet(plotlyLineData.data, "value"),
            type: "scatter"
          }
        ]
      };
    });
  }	

  drawPlotlyInstances(plotlyInstancesData, plotlyInstancesContainerDiv) {
    plotlyInstancesData.forEach(plotlyData => {
      this.drawPlotlyInstance(plotlyData, plotlyInstancesContainerDiv);
    });
  }  


  createContainer(plotlyInstancesContainerDiv) {
    let containerDivElement = document.getElementById(plotlyInstancesContainerDiv);
    if (containerDivElement) return;

    containerDivElement = document.createElement("div");
    containerDivElement.id = plotlyInstancesContainerDiv;
    this.container.appendChild(containerDivElement);
  }

  drawPlotlyInstance(plotlyData, plotlyInstancesContainerDiv) {
    const containerDiv = document.getElementById(plotlyInstancesContainerDiv);
    const plotlyElement = document.createElement("div");
    plotlyElement.className = "chart";

    if (plotlyData.data[0].y.length) {
      this.attachChart(plotlyElement, plotlyData);
    } else {
      plotlyElement.innerHTML = "No data available for this object.";
    }
    containerDiv.appendChild(plotlyElement);
  }
  

  deleteExistingPlotlyInstances(plotlyInstancesContainerDiv) 
	{
    const containerDiv = document.getElementById(plotlyInstancesContainerDiv);
    if (containerDiv) 
		{
      containerDiv.innerHTML = "";
    }
  }

  extractColumnFromDataSet(data, columnName) {
    return data.map(item => {
      return item[columnName];
    });
  }
  
  attachChart(elementToAttach, plotlyData) 
	{
    var layout = {
      title: plotlyData.title,
      displayModeBar: false,			
			automargin: true, 
			autosize: false,
			width: 300,
			height: 370,
			margin: {
				l: 40,
				r: 40,
				b: 50,
				t: 40,
				pad: 0
			},
      responsive: true,
      xaxis: {
        autorange: true,
        range: ["2018-09-17", "2018-09-25"], //"2018-10-17"],
        type: "date"
      },
      yaxis: {
        autorange: true,
        type: "linear"
      }
    };

    Plotly.newPlot(elementToAttach, plotlyData.data, layout);
  }
}
