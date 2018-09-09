var serverAnalysisData = {};
var canvasCharts = [];
var instanceServerTechInfoChart = {};
var instanceServerEnvInfoChart = {};
var instanceServerTypeInfoChart = {};

var oracleServerProdInfoChart = {};
var db2ServerProdInfoChart = {};
var mssqlServerProdInfoChart = {};

var oracleServerNonProdInfoChart = {};
var db2ServerNonProdInfoChart = {};
var mssqlServerNonProdInfoChart = {};


function toggleLegend(el) {         
        $(el).toggleClass("strikeoff");   
}

function clearCanvas(cnv) {
    var ctx = cnv.getContext('2d');     // gets reference to canvas context
    ctx.beginPath();    // clear existing drawing paths
    ctx.save();         // store the current transformation matrix

    // Use the identity matrix while clearing the canvas
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, cnv.width, cnv.height);

    ctx.restore();        // restore the transform
}

$(document).ready(function () {   

    $("#dataServerType").change(function () {
        console.log("Server Type changed")
        var selectedValue = this.options[this.selectedIndex].value;
        if (!selectedValue) {
            return;
        }
        selectedValue = selectedValue.toLowerCase();
        //alert($('option:selected', this).text());

        switch (selectedValue) {

            case 'zna':         bindIndividualServerData(serverAnalysisData.znaServersAnalysis);
                                break;

            case 'farmers':     bindIndividualServerData(serverAnalysisData.farmersAnalysis);
                                break;

            case 'emea':        bindIndividualServerData(serverAnalysisData.emeaServersAnalysis);
                                break;

            case '21stcentury': bindIndividualServerData(serverAnalysisData._21stCenturyServersAnalysis);
                                break;
        }
    });
 
    //var vm = this.serversService.GetServersTechnologyDetails();
    //var total = vm.MSSQLServersCount + vm.OracleServersCount + vm.DB2ServersCount;


    //var oracleServersPercent = System.Math.Round((float)vm.OracleServersCount / total * 100, 2);
    //var mssqlServersPercent = System.Math.Round((float)vm.MSSQLServersCount / total * 100, 2);
    //var bd2serversPercent = System.Math.Round((float)vm.DB2ServersCount / total * 100, 2);

    //((PieSeries)mcChartTech.Series[0]).ItemsSource =
    //new KeyValuePair<string, int>[]{
    //    new KeyValuePair<string,int>(string.Format("Orace Servers ({0}) {1}%", vm.OracleServersCount, oracleServersPercent), vm.OracleServersCount),
    //    new KeyValuePair<string,int>(string.Format("MSSQL Servers ({0}) {1}%",vm.MSSQLServersCount ,mssqlServersPercent), vm.MSSQLServersCount),
    //    new KeyValuePair<string,int>(string.Format("DB2 Servers ({0}) {1}%",vm.DB2ServersCount ,bd2serversPercent), vm.DB2ServersCount)

    //};


    // Assign handlers immediately after making the request,
    // and remember the jqXHR object for this request
    var tooltipOptions = {
        custom: function (tooltip) {
            //tooltip.x = 0;
            //tooltip.y = 0;
        },
        mode: 'single',
        callbacks: {
            label: function (tooltipItems, data) {
                var sum = data.datasets[0].data.reduce(add, 0);
                function add(a, b) {
                    return a + b;
                }

                return parseInt((data.datasets[0].data[tooltipItems.index] / sum * 100), 10) + ' %';
            },
            beforeLabel: function (tooltipItems, data) {
                return data.datasets[0].data[tooltipItems.index];
            }
        }
    };
    var otherOptions = {
        animation: {
            animateRotate: true,
            animateScale: true
        },
        legend: false,
        legendCallback: function (chart) {
            var text = [];
            text.push('<ul  class=list-unstyled "' + chart.id + '-legend">');
            for (var i = 0; i < chart.data.datasets[0].data.length; i++) {
                text.push('<li onclick="toggleLegend(this)" class="legend" role="button" data-toggle="button" aria-pressed="false" autocomplete="off" ><span class="legend-icon" style="background-color:' + chart.data.datasets[0].backgroundColor[i] + '"></span><span class="legend-text">');
                if (chart.data.labels[i]) {
                    text.push(chart.data.labels[i]);
                }
                text.push('</span></li>');
            }
            text.push('</ul>');
            return text.join("");
        }
    }

    let domain = window.location.protocol + '://' + document.location.hostname;


    if (domain.includes('localhost')) {

        domain += ':' + window.location.port;
    }



    var jqxhr = $.ajax({
        method: "GET",       
        url: "api/home/getanlysisdata",       
       
    }).done(function (data) {
          console.log(data);
          serverAnalysisData = data;

          var techDetailsCanvas = document.getElementById("TechDetailsCanvas");
          var envDetailsCanvas = document.getElementById("EnvDetailsCanvas");
          var lsaDetailsCanvas = document.getElementById("LSADetailsCanvas");

          


          var TechDetails = data.technologyDetails;
          var EnvDetails = data.environmentDetails;
          var LSADetails = data.lsaDetails;


          var legendToggleFunction = function (e) {
              
              if (e && e.data && e.data.chart) {


                  var chart = e.data.chart;
                  if (chart.data.datasets[0].data["tdToggle" + $(this).index()]) {
                      chart.data.datasets[0].data["tdToggle" + $(this).index()] = false;
                      chart.data.datasets[0].data[$(this).index()] = chart.data.datasets[0].data["tdToggleValue" + $(this).index()]

                  } else {
                      chart.data.datasets[0].data["tdToggle" + $(this).index()] = true;
                      chart.data.datasets[0].data["tdToggleValue" + $(this).index()] = chart.data.datasets[0].data[$(this).index()];
                      chart.data.datasets[0].data[$(this).index()] = 0;
                  }
                  //   pieChart.data.datasets[0].data[$(this).index()] += 50;
                  chart.update();
                  // console.log('legend: ' + data.datasets[0].data[$(this).index()]);
              }
          };
          var opts
          
          if (TechDetailsCanvas) {
             
              opts = {};
              opts.data = [TechDetails.oracleServersCount,
                           TechDetails.mssqlServersCount,
                           TechDetails.dB2ServersCount
              ];
              opts.labels = ["Orace Servers",
                     "MSSQL Servers",
                     "DB2 Servers"
              ];
              opts.colors = ["rgb(255, 99, 132)",
                              "rgb(54, 162, 235)",
                              "rgb(255, 205, 86)"
              ];
              opts.legendCtrl = $("#tech-details-legend");
              
              var  tchartt = bindDataServerInfoToCharts(opts,techDetailsCanvas);                                         
             
          }

          if (envDetailsCanvas) {
             
              opts.data = [EnvDetails.envProdCount,
                              EnvDetails.envNonProdCount,
              ];
              opts.labels = [
                      "Prod Servers",
                  "Non Prod Servers"
              ];
              opts.colors = [
                              "rgb(255, 99, 132)",
                              "rgb(54, 162, 235)",
                              "rgb(255, 205, 86)"
              ];
              opts.legendCtrl = $("#env-details-legend");
              
              var echartt = bindDataServerInfoToCharts(opts, envDetailsCanvas);
                            
          }

          if (lsaDetailsCanvas) {


              opts.data = [LSADetails.emeaCount,
                              LSADetails.znaCount,
                              LSADetails.farmersCount,
                               LSADetails._21CenturyCount
              ];
              opts.labels = [
                      "EMEA Servers",
                      "ZNA Servers",
                      "FARMERS Servers",
                      "21CENTURY Servers"

              ];
              opts.colors = [
                              "rgb(255, 99, 132)",
                              "rgb(54, 162, 235)",
                              "rgb(1,132,143)",
                              "rgb(245, 185, 76)"
              ];
              opts.legendCtrl = $("#lsa-details-legend");

              var echartt = bindDataServerInfoToCharts(opts, lsaDetailsCanvas);



              //var serverCountData = {
              //    labels: [
              //        "EMEA Servers",
              //        "ZNA Servers",
              //        "FARMERS Servers",
              //        "21CENTURY Servers"

              //    ],
              //    datasets: [
              //        {
              //            data: [LSADetails.eMEACount,
              //                LSADetails.zNACount,
              //                LSADetails.framersCount,
              //                 LSADetails._21CenturyCount                                     
              //            ],
              //            backgroundColor: [
              //                "rgb(255, 99, 132)",
              //                "rgb(54, 162, 235)",
              //                "rgb(255, 205, 86)",
              //                "rgb(245, 185, 76)"
              //            ]
              //        }]
              //};              

              //var lsaPieChart = new Chart(lsaDetailsCanvas, {
              //    type: 'doughnutLabels',
              //    data: serverCountData,                 
              //    options: otherOptions

              //});
              //$("#lsa-details-legend").html(lsaPieChart.generateLegend());
              //$("#lsa-details-legend").on('click', "li", { chart:lsaPieChart},legendToggleFunction);

          }
          
          $("#dataServerType").trigger('change');         

      })
      .fail(function (error) {
          console.log(error);
      })
      .always(function () {         
      });

    function bindDataServerInfoToCharts(opts,canvas)
    {

        var otherOptions = {
            animation: {
                animateRotate: true,
                animateScale: true
            },
            legend: false,
            legendCallback: function (chart) {
                var text = [];
                text.push('<ul  class=list-unstyled "' + chart.id + '-legend">');
                for (var i = 0; i < chart.data.datasets[0].data.length; i++) {
                    text.push('<li onclick="toggleLegend(this)" class="legend" role="button" data-toggle="button" aria-pressed="false" autocomplete="off" ><span class="legend-icon" style="background-color:' + chart.data.datasets[0].backgroundColor[i] + '"></span><span class="legend-text">');
                    if (chart.data.labels[i]) {
                        text.push(chart.data.labels[i]);
                    }
                    text.push('</span></li>');
                }
                text.push('</ul>');
                return text.join("");
            }
        }       
                

        var legendToggleFunction = function (e) {

            if (e && e.data && e.data.chart) {


                var chart = e.data.chart;
                if (chart.data.datasets[0].data["tdToggle" + $(this).index()]) {
                    chart.data.datasets[0].data["tdToggle" + $(this).index()] = false;
                    chart.data.datasets[0].data[$(this).index()] = chart.data.datasets[0].data["tdToggleValue" + $(this).index()]

                } else {
                    chart.data.datasets[0].data["tdToggle" + $(this).index()] = true;
                    chart.data.datasets[0].data["tdToggleValue" + $(this).index()] = chart.data.datasets[0].data[$(this).index()];
                    chart.data.datasets[0].data[$(this).index()] = 0;
                }
                //   pieChart.data.datasets[0].data[$(this).index()] += 50;
                chart.update();
                // console.log('legend: ' + data.datasets[0].data[$(this).index()]);
            }
        };

        if (canvas) {
            Chart.defaults.global.defaultFontFamily = "Lato";
            Chart.defaults.global.defaultFontSize = 18;

           

            var chartData = {
                labels: opts.labels,
                datasets: [
                    {
                        data: opts.data ,
                        backgroundColor:opts.colors
                    }]
            };

            var donutChart = new Chart(canvas, {
                type: 'doughnutLabels',
                data: chartData,
                options: otherOptions

            });
            $(opts.legendCtrl).html(donutChart.generateLegend());
            $(opts.legendCtrl).on('click', "li", { chart: donutChart }, legendToggleFunction);

            return donutChart;

        } else {
            return null;
        }



    }

    function setTicks(data,barOptions)
    {       
        var options = Object.assign({}, barOptions);
        if (Math.max(...data) < 10) {
            options.scales.yAxes[0].ticks.fixedStepSize = 1;
        } else {
            delete options.scales.yAxes[0].ticks.fixedStepSize;
        }

        return options;
    }

    function bindIndividualServerData(data)
    {
        if (!data)
        {
            return;
        }

        canvasCharts.forEach(function (item, index) {

            if(item && item.destroy)
            {
                item.destroy();
            }

        })
       


        var barOptions = {
            legend: {
                display: true,
                position: 'top',
                
            },
            responsive: true,
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        steps: 10,                                             
                        
                    }
                }],
                xAxes: [{
                    ticks: {
                        autoSkip: false
                    }
                }]
            
            }
        };

        

        var techDetailsCanvas = document.getElementById("serverTechDetailsCanvas")      
        var envDetailsCanvas = document.getElementById("serverEnvDetailsCanvas")        
        var serverTypeDetailsCanvas = document.getElementById("serverTypeDetailsCanvas")
        
        var prodSqlServersCanvas = document.getElementById("prodSqlServersCanvas")
        var prodDB2ServersCanvas = document.getElementById("prodDB2ServersCanvas")
        var prodOracleServersCanvas = document.getElementById("prodOracleServersCanvas")

        var nonProdSqlServersCanvas = document.getElementById("nonProdSqlServersCanvas")
        var nonProdDB2ServersCanvas = document.getElementById("nonProdDB2ServersCanvas")
        var nonProdOracleServersCanvas = document.getElementById("nonProdOracleServersCanvas")

        $('.serverAnalysisBlock canvas').each(function (index, item) {            
           clearCanvas(this);
        })



       
        var techDetails = data.techDetails;
        var envDetails = data.envDetails;
        var typeDetails = data.serverTypeDetails;
        var prodColor = "rgba(0, 164, 255, 0.35)";
        var pordBorderColor = "rgb(0, 164, 255)";

        var nonProdColor = "rgba(255,61,103,0.35)";
        var nonPordBorderColor = "rgb(255,61,103)";

        if (TechDetailsCanvas && techDetails) {

            opts = {};
            opts.data = [techDetails.oracleServersCount,
                         techDetails.mssqlServersCount,
                         techDetails.dB2ServersCount
            ];
            opts.labels = ["Orace Servers",
                   "MSSQL Servers",
                   "DB2 Servers"
            ];
            opts.colors = ["rgb(255, 99, 132)",
                            "rgb(54, 162, 235)",
                            "rgb(255, 205, 86)"
            ];
            opts.legendCtrl = $("#server-tech-details-legend");

            instanceServerTechInfoChart = bindDataServerInfoToCharts(opts, techDetailsCanvas);

        }

        if (envDetailsCanvas && envDetails) {

            opts.data = [envDetails.envProdCount,
                            envDetails.envNonProdCount,
            ];
            opts.labels = [
                    "Prod Servers",
                "Non Prod Servers"
            ];
            opts.colors = [
                            "rgb(255, 99, 132)",
                            "rgb(54, 162, 235)",
                            "rgb(255, 205, 86)"
            ];
            opts.legendCtrl = $("#server-env-details-legend");

            instanceServerEnvInfoChart = bindDataServerInfoToCharts(opts, envDetailsCanvas);

        }

        if (serverTypeDetailsCanvas && typeDetails) {


            opts.data = [   typeDetails.devServersCount,
                            typeDetails.testServersCount,
                            typeDetails.qaServersCount 
            ];
            opts.labels = [
                    "Dev Servers",
                    "QA Servers",
                    "TEST Servers"                   

            ];
            opts.colors = [
                            "rgb(255, 99, 132)",
                            "rgb(54, 162, 235)",
                            "rgb(245, 185, 76)"
            ];
            opts.legendCtrl = $("#server-type-details-legend");

            instanceServerTypeInfoChart = bindDataServerInfoToCharts(opts, serverTypeDetailsCanvas);




        }

        if (prodSqlServersCanvas && data.sqlServersProd) {

            $(prodSqlServersCanvas).parent().show();

            var values = Object.values(data.sqlServersProd);
            var options = setTicks(values, barOptions);

            var dataset = {
                label: ' SQL Servers Count',
                data: Object.values(data.sqlServersProd),
                backgroundColor: prodColor,
                borderColor: pordBorderColor,
                borderWidth:1                

            };

            mssqlServerProdInfoChart = new Chart(prodSqlServersCanvas, {
                type: 'bar',
                data: {
                    labels: Object.keys(data.sqlServersProd),
                    datasets: [dataset]                    
                },
                options: options
            });

        } else {
            $(prodSqlServersCanvas).parent().hide();
        }

        if (prodDB2ServersCanvas && data.dB2ServersProd) {

            var values = Object.values(data.dB2ServersProd);
            var options = setTicks(values, barOptions);

            $(prodDB2ServersCanvas).parent().show();


            var dataset = {
                label: ' DB2 Servers Count',
                backgroundColor: prodColor,
                borderColor: pordBorderColor,
                data: values
            };

            db2ServerProdInfoChart = new Chart(prodDB2ServersCanvas, {
                type: 'bar',
                data: {
                    labels: Object.keys(data.dB2ServersProd),
                    datasets: [dataset]
                },
                options: options
            });
        } else {
            $(prodDB2ServersCanvas).parent().hide();
        }

        if (prodOracleServersCanvas && data.oracleServersProd) {

            var values = Object.values(data.oracleServersProd);
            var options = setTicks(values, barOptions);
            $(prodOracleServersCanvas).parent().show();
            var dataset = {
                label: ' ORACLE Servers Count',
                backgroundColor: prodColor,
                borderColor: pordBorderColor,
                data: Object.values(data.oracleServersProd)
            };

            oracleServerProdInfoChart = new Chart(prodOracleServersCanvas, {
                type: 'bar',
                data: {
                    labels: Object.keys(data.oracleServersProd),
                    datasets: [dataset]
                },
                options: options
            });



        } else {
            $(prodOracleServersCanvas).parent().hide();
        }


        if (nonProdSqlServersCanvas && data.sqlServersNonProd) {

            var values = Object.values(data.sqlServersNonProd);
            var options = setTicks(values, barOptions);

            $(nonProdSqlServersCanvas).parent().show();

            var dataset = {
                label: ' Non Prod SQL Servers Count',
                data: Object.values(data.sqlServersNonProd),
                backgroundColor: nonProdColor,
                borderColor: nonPordBorderColor,
                borderWidth: 1

            };
            mssqlServerNonProdInfoChart = new Chart(nonProdSqlServersCanvas, {
                type: 'bar',
                data: {
                    labels: Object.keys(data.sqlServersNonProd),
                    datasets: [dataset]
                },
                options: options
            });

        } else {
            $(nonProdSqlServersCanvas).parent().hide();
        }

        if (nonProdDB2ServersCanvas && data.dB2ServersNonProd) {

            $(nonProdDB2ServersCanvas).parent().show();

            var dataset = {
                label: ' Non Prod DB2 Servers Count',
                backgroundColor: nonProdColor,
                borderColor: nonPordBorderColor,
                data: Object.values(data.dB2ServersNonProd)
            };

            db2ServerNonProdInfoChart = new Chart(nonProdDB2ServersCanvas, {
                type: 'bar',
                data: {
                    labels: Object.keys(data.dB2ServersNonProd),
                    datasets: [dataset]
                },
                options: barOptions
            });
        } else {
            $(nonProdDB2ServersCanvas).parent().hide();
        }

        if (nonProdOracleServersCanvas && data.oracleServersNonProd) {

            $(nonProdOracleServersCanvas).parent().show();
            var dataset = {
                label: ' Non Prod ORACLE Servers Count',
                backgroundColor: nonProdColor,
                borderColor: nonPordBorderColor,
                data: Object.values(data.oracleServersNonProd)
            };

            oracleServerNonProdInfoChart = new Chart(nonProdOracleServersCanvas, {
                type: 'bar',
                data: {
                    labels: Object.keys(data.oracleServersNonProd),             
                    datasets: [dataset]
                },
                options: barOptions
            });



        } else {
            $(nonProdOracleServersCanvas).parent().hide();
        }



        canvasCharts.push(instanceServerTechInfoChart);
        canvasCharts.push(instanceServerEnvInfoChart);
        canvasCharts.push(instanceServerTypeInfoChart);;

        canvasCharts.push(oracleServerProdInfoChart);;
        canvasCharts.push(db2ServerProdInfoChart);;
        canvasCharts.push(mssqlServerProdInfoChart);;

        canvasCharts.push(oracleServerNonProdInfoChart);;
        canvasCharts.push(db2ServerNonProdInfoChart);;
        canvasCharts.push(mssqlServerNonProdInfoChart);;

    }

      

})


