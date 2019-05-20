var http = require('http');
var fs = require('fs');

process.on('uncaughtException', function (err) {
  console.log('Caught exception: ', err);
});

var i = 0;

function getRealTimeMARTABusData()
{
  console.log('===============================================================================');  
  console.log('getRealTimeMARTABusData() call, at ', Date() );


  http.get(
    'http://developer.itsmarta.com/BRDRestService/RestBusRealTimeService/GetAllBus', 
    res => {
      res.setEncoding("utf8");
      let body = "";
      
      res.on("data", data => {
        body += data;
      });
      
      res.on(
        "end", 
        () => {
          var current_MARTA_RT_bus_JSON_data = JSON.parse(body);
          var json = JSON.stringify(current_MARTA_RT_bus_JSON_data); 
          
          //var outputFilename = 'MARTA-buses-RT-'+i+'.json';
          outputFilename = 'current-bus-locations.json';
          console.log('  outputFilename: ' + outputFilename);
          
          fs.writeFile(outputFilename, json);  // change this to 'current-bus-locations.json' during deployment
          i++;
          
          // call this function again, after a timeout:
          var timeout_ms = 5000;
          setTimeout(getRealTimeMARTABusData, timeout_ms);        
        }
      );
    }
  );
}


getRealTimeMARTABusData();