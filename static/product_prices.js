query = 'http://127.0.0.1:5000/api/datacall'

function init() {
  
    // Function to update the Demographic Info 
    d3.json(query).then((PriceData) => {
      var products = PriceData;
      
      // Array to hold results of the price difference and change
      priceDiff = []
      priceChange = []
  
      // Loop through each row to get price difference and change year over year
      products.forEach((PriceData) => { 
          priceDiff.push(PriceData.price_difference); 
          priceChange.push(PriceData.price_percent_change); 
      });
      
      // Count how many results in items are positive numbers (Increased)
      var increasedCount = 0;
          for(var i = 0; i < priceDiff.length; ++i){
          if(priceDiff[i] > 0)
          increasedCount++;
      }
  
      // Count how many results in items are negative numbers (Decreased)
      var decreasedCount = 0;
          for(var i = 0; i < priceDiff.length; ++i){
          if(priceDiff[i] < 0)
          decreasedCount++;
      }
  
      // Count how many results in items are 0 (Same)
      var sameCount = 0;
          for(var i = 0; i < priceDiff.length; ++i){
          if(priceDiff[i] === 0)
          sameCount++;
      }
  
      // Count of how many increased by more than 10%
      var increasedChangeLess10 = 0;
          for(var i = 0; i < priceChange.length; ++i){
          if(priceChange[i] > 0 && priceChange[i] < 10)
          increasedChangeLess10++;
      }
      var increasedChange10 = 0;
          for(var i = 0; i < priceChange.length; ++i){
          if(priceChange[i] >= 10)
          increasedChange10++;
      }
  
      // Pie Chart Percentage Calculations
      // Total Count
      var total = Object.keys(products).length;
      // Percentage that increased 0 to 9%
      var pincreasedChangeLess10 = parseFloat((increasedChangeLess10 / total * 100).toFixed(2));
      // Percentage that increased 10+%
      var pincreasedChange10 = parseFloat((increasedChange10 / total * 100).toFixed(2));
      // Percentage that decreased
      var pdecreasedChange = parseFloat((decreasedCount / total * 100).toFixed(2));
      // Percentage that had  no change
      var pnoChange = parseFloat((sameCount / total * 100).toFixed(2));
  

      
      // Custom color set for CanvasJS charts
      // -------------------------------------------------     
      CanvasJS.addColorSet("cyborgColors",
            [//colorSet Array
            '#6f42c1','#fd7e14','#2a9fd6','#20c997'                
            ]);
      
      // CanvasJS Bar Chart
      // -------------------------------------------------
      var chart = new CanvasJS.Chart("barContainer", {
          animationEnabled: true,
          theme: "dark1", // "light1", "light2", "dark1", "dark2"
          // title:{
          //     text: "Top Oil Reserves"
          // },
          colorSet: "cyborgColors",
          axisY: {
              title: "Product Count"
          },
          data: [{        
              type: "column",  
              showInLegend: false, 
              legendMarkerColor: "grey",
              legendText: "MMbbl = one million barrels",
              dataPoints: [      
                  { y: increasedCount, label: "Increased" },
                  { y: decreasedCount,  label: "Decreased" },
                  { y: sameCount,  label: "No Change" }
              ]
          }]
      });
      chart.render();
      // -------------------------------------------------
  
      // CanvasJS Pie Chart
      // -------------------------------------------------
      var options = {
          // title: {
          //     text: "Website Traffic Source"
          // },
          theme: "dark1",
          colorSet: "cyborgColors",
          data: [{
                  type: "pie",
                  startAngle: 45,
                  showInLegend: "true",
                  legendText: "{label}",
                  indexLabel: "{label} ({y}{per})",
                  // yValueFormatString:"#,##0.#"%"",
                  dataPoints: [
                      { label: "0 to 9% Increase", y: pincreasedChangeLess10, per: "%" },           
                      { label: "Decrease", y: pdecreasedChange, per: "%" },
                      { label: "No Change", y: pnoChange, per: "%" },
                      { label: "10%+ Increase", y: pincreasedChange10, per: "%" },
                      
                  ]
          }]
      };
      $("#pieContainer").CanvasJSChart(options);
      // -------------------------------------------------
      
  });
  }
  
  // Initialize the dashboard
  init();
