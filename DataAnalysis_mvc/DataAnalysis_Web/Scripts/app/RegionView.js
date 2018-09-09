var serverAnalysisData = {};
var regionCharts = [];

var techDetailsByrncCanvas = {};
var techInfoChartByRegionandCompany = {};
var instanceServerEnvInfoChart = {};
var instanceServerTypeInfoChart = {};


var lsachartt = {};
var echartt = {};
var tchartt = {};

var techInfoByRNC = {};
var envDetailsByRNC = {};
var serverDetailsByRNC = {};

var prodOracleServersInfoChart = {};
var prodDB2ServerInfoChart = {};
var prodSqlServersByRNC = {};

var nonProdOracleServersInfoChart = {};
var db2ServerNonProdInfoChart = {};
var nonProdSqlServersByRNC = {};

var regionSelected = '';
var companySelected = '';

var regCharts = {

    techInfoByRNC: {},
    envDetailsByRNC: {},
    serverDetailsByRNC: {},

    prodSqlServersByRNC: {},
    prodDB2ServersInfoChart: {},
    prodOracleServersInfoChart: {},

    nonProdSqlServersByRNC: {},
    nonProdDB2ServersInfoChart: {},
    nonProdOracleServersInfoChart: {}

}

function getColorPallate(n) {

    if (n <= 0) {
        return [];
    }

    let colorpallet = [];
    var h = -45;
    for (let n = 0; n < 10; n++) {
        var color = new KolorWheel([h, 100, 50]);
        colorpallet.push(color.getHex());
      
        h += 45;
    } // for hue
    return colorpallet;
}

function toggleLegend(el) {
    $(el).toggleClass("strikeoff");
}
function bindDataServerInfoToCharts(opts, canvas, field,container,legend) {



    // reset canvas 
    if (legend) {
        

        //let rootid = "serverTechDetailsByrnc";
        //container = '#' + rootid + '-container';
        //legend =  rootid + '-legend';
        //field =  rootid + '-canvas';

        $(container).empty();
        let cnv = $('<canvas />').attr({ id: field, width : "400", height : "400" })
        $(container).append(cnv);
        $(container).append($('<div />').attr({ id: legend, class: "chart-legend vertical-margin align-legend-bottom" }));
        opts.legendCtrl = $("#" + legend);
        canvas = $('#' + field);
        //ctx = canvas.getContext('2d');
        //ctx.canvas.width = $('#graph').width(); // resize to parent width
        //ctx.canvas.height = $('#graph').height(); // resize to parent height
        //var x = canvas.width / 2;
        //var y = canvas.height / 2;
        //ctx.font = '10pt Verdana';
        //ctx.textAlign = 'center';
        //ctx.fillText('This text is centered on the canvas', x, y);


    }
  

  

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
        },

        tooltips:  {
            callbacks: {
                label: function (tooltipItem, data) {
                    debugger;
                    //get the concerned dataset
                    var dataset = data.datasets[tooltipItem.datasetIndex];
                    //calculate the total of this data set
                    var total = dataset.data.reduce(function (previousValue, currentValue, currentIndex, array) {
                        return previousValue + currentValue;
                    });
                    //get the current items value
                    var currentValue = dataset.data[tooltipItem.index];
                    //calculate the precentage based on the total and current item, also this does a rough rounding to give a whole number
                    var percentage = Math.floor(((currentValue / total) * 100) + 0.5);

                    return data.labels[tooltipItem.index];

                    //afterLabel: function(tooltipItem, data) {
                    //    var sum = data.datasets.reduce((sum, dataset) => {
                    //        return sum + dataset.data[tooltipItem.index];
                    //    }, 0);
                    //    var percent = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index] / sum * 100;
                    //    percent = percent.toFixed(2); // make a nice string
                    //    return data.datasets[tooltipItem.datasetIndex].label + ': ' + percent + '%';
                    //}

                }
            }
        } 
    }



    let legendToggleFunction = function (e) {

        if (e && e.data && e.data.chart) {


            var chart = e.data.chart;
            if (chart.data.datasets[0].data["tdToggleRg" + $(this).index()]) {
                chart.data.datasets[0].data["tdToggleRg" + $(this).index()] = false;
                chart.data.datasets[0].data[$(this).index()] = chart.data.datasets[0].data["tdToggleValueRg" + $(this).index()]

            } else {
                chart.data.datasets[0].data["tdToggleRg" + $(this).index()] = true;
                chart.data.datasets[0].data["tdToggleValueRg" + $(this).index()] = chart.data.datasets[0].data[$(this).index()];
                chart.data.datasets[0].data[$(this).index()] = 0;
            }
            //   pieChart.data.datasets[0].data[$(this).index()] += 50;
            chart.update();
            // console.log('legend: ' + data.datasets[0].data[$(this).index()]);
        }
    };

    if (canvas) {
        Chart.defaults.global.defaultFontFamily = "Lato";
        Chart.defaults.global.defaultFontSize = 16;



        var chartData = {
            labels: opts.labels,
            datasets: [
                {
                    data: opts.data,
                    backgroundColor: opts.colors
                }]
        };

        if (field) {
            
            regCharts[field] = new Chart(canvas, {
                type: 'doughnutLabels',
                data: chartData,
                options: otherOptions

            });
            $(opts.legendCtrl).html(regCharts[field].generateLegend());
            $(opts.legendCtrl).on('click', "li", { chart: regCharts[field] }, legendToggleFunction);

            return regCharts[field];
        } else {



            var donutChart = new Chart(canvas, {
                type: 'doughnutLabels',
                data: chartData,
                options: otherOptions

            });
            $(opts.legendCtrl).html(donutChart.generateLegend());
            $(opts.legendCtrl).on('click', "li", { chart: donutChart }, legendToggleFunction);

            return donutChart;
        }

    } else {
        return null;
    }



}

$(document).ready(function () {

    $("#companiesSelector").change(function () {
       // console.log("Server Type changed")
        let selectedValue = this.options[this.selectedIndex].value;
        if (!selectedValue) {
            return;
        }

        companySelected = selectedValue
        //alert($('option:selected', this).text());
        //console.log('get individual servers data');
        getIndividulaServersData();
        
    });

    $("#regionSelector").change(function () {
        console.log("Server Type changed")
        let selectedValue = this.options[this.selectedIndex].value;
        if (!selectedValue) {
            return;
        }

        regionSelected = selectedValue
        //alert($('option:selected', this).text());
        setServersDetailsByRegion();
        getCompanyDetailsByRegion();
    });

   
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

     $.ajax({
        method: "GET",
        url: "api/home/getregions",

    }).done(function (data) {
      console.log(data);
        if (data.length) {
            regionSelected = data[0];

            for (var i = 0; i < data.length; i++) {               
                $("#regionSelector").append("<option value=\"" + data[i] + "\">" + data[i] + "</option>");
            }
           
            setServersDetailsByRegion();
            getCompanyDetailsByRegion();
        }

       

    }).fail(function (error) {
            console.log(error);
        });

    function getCompanyDetailsByRegion() {
        var params = { region: regionSelected };
        $.ajax({
            method: "GET",
            url: "api/home/getCompanyByRegion",
            data: params

        }).done(function (data) {
           // console.log(data);
            if (data.length) {
                companySelected = data[0];
                $("#companiesSelector").html("");
                for (var i = 0; i < data.length; i++) {
                    $("#companiesSelector").append("<option value=\"" + data[i] + "\">" + data[i] + "</option>");
                }

                $("#companiesSelector").trigger('change');
            }

           

        }).fail(function (error) {
            console.log(error);
        });
    }

    function getIndividulaServersData() {
        var params = { region: regionSelected, company: companySelected };


        $.ajax({
            method: "GET",
            url: "api/home/getanlysisdataByRegionandCompany",
            data: params

        }).done(function (data) {
            console.log(data);
            //serverAnalysisData = data;                       
            bindIndividualServerData(data);
        })
            .fail(function (error) {
                console.log(error);
            })
            .always(function () {
            }); 
    }

    function setServersDetailsByRegion() {
        var params = { region: regionSelected };


        $.ajax({
            method: "GET",
            url: "api/home/getServersCountByRegion",
            data: params

        }).done(function (data) {
          //  console.log(data);
            serverAnalysisData = data;

            let techDetailsCanvas = document.getElementById("TechDetailsCanvas-rg");
            let envDetailsCanvas = document.getElementById("EnvDetailsCanvas-rg");
            let lsaDetailsCanvas = document.getElementById("LSADetailsCanvas-rg");




           let TechDetails = data.technologyDetails;
           let EnvDetails = data.environmentDetails;
           let LSADetails = data.lsaDetails;


           
            let opts = {};

            if (techDetailsCanvas) {

              
                opts.data = data.technologyCount.map(c => Object.values(c)[1]);
                opts.labels = data.technologyCount.map(c => Object.values(c)[0] + 'Servers (' + Object.values(c)[1] + ')');

                opts.colors = ["rgb(255, 99, 132)",
                    "rgb(54, 162, 235)",
                    "rgb(255, 205, 86)"
                ];
                opts.legendCtrl = $("#tech-details-legend-rg");

                 tchartt = bindDataServerInfoToCharts(opts, techDetailsCanvas);

            }

            if (envDetailsCanvas) {

                opts.data = data.enviromnetCount.map(c => Object.values(c)[1]);
                opts.labels = data.enviromnetCount.map(c => Object.values(c)[0] + 'Servers(' + Object.values(c)[1] + ')');

                opts.colors = [
                    "rgb(255, 99, 132)",
                    "rgb(54, 162, 235)",
                    "rgb(255, 205, 86)"
                ];
                opts.legendCtrl = $("#env-details-legend-rg");

                 echartt = bindDataServerInfoToCharts(opts, envDetailsCanvas);

            }

            if (lsaDetailsCanvas) {


                opts.data = data.lsaCount.map(c => Object.values(c)[1]);
                opts.labels = data.lsaCount.map(c => Object.values(c)[0] + ' Servers (' + Object.values(c)[1] + ')');

                opts.colors = [
                    "rgb(255, 99, 132)",
                    "rgb(54, 162, 235)",
                    "rgb(1,132,143)",
                    "rgb(245, 185, 76)"
                ];
                opts.legendCtrl = $("#lsa-details-legend-rg");

                lsachartt = bindDataServerInfoToCharts(opts, lsaDetailsCanvas);

            }

          

        })
            .fail(function (error) {
                console.log(error);
            })
            .always(function () {
            });
    }


    function setTicks(data, barOptions) {
        var options = Object.assign({}, barOptions);
        if (Math.max(...data) < 10) {
            options.scales.yAxes[0].ticks.fixedStepSize = 1;
        } else {
            delete options.scales.yAxes[0].ticks.fixedStepSize;
        }

        return options;
    }

    function bindIndividualServerData(data) {
        if (!data) {
            return;
        }

        regionCharts.forEach(function (item, index) {

            if (item && item.destroy) {
                console.log('UPDATED');
                console.log(item);
                
              //  item.destroy();
            }

        })


        regionCharts.forEach(function (item, index) {
            let ctx =   item.ctx;

            if (!ctx) {
                return;
            }
            ctx.beginPath();    // clear existing drawing paths
            ctx.save();         // store the current transformation matrix

            // Use the identity matrix while clearing the canvas
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(0, 0, item.width, item.height);

            ctx.restore(); 


            
        })
       


         techDetailsByrncCanvas = document.getElementById("serverTechDetailsCanvas-Byrnc")
        let envDetailsCanvas = document.getElementById("serverEnvDetailsCanvas-Byrnc")
        let serverTypeDetailsCanvas = document.getElementById("serverTypeDetailsCanvas-Byrnc")
        
        let prodSqlServersCanvas = document.getElementById("prodSqlServersCanvas-Byrnc")
        let prodDB2ServersCanvas = document.getElementById("prodDB2ServersCanvas-Byrnc")
        let prodOracleServersCanvas = document.getElementById("prodOracleServersCanvas-Byrnc")
        
        let nonProdSqlServersCanvas = document.getElementById("nonProdSqlServersCanvas-Byrnc")
        let nonProdDB2ServersCanvas = document.getElementById("nonProdDB2ServersCanvas-Byrnc")
        let nonProdOracleServersCanvas = document.getElementById("nonProdOracleServersCanvas-Byrnc")


        $('.chartsByRegionAndCompany canvas').each(function (index, item) {
          // clearCanvas(this);
        })

        regionCharts = [];

        var techDetails = data.technologyCount;
        var envDetails = data.enviromnetCount;
        var typeDetails = data.lsaCount;
        var prodColor = "rgba(0, 164, 255, 0.35)";
        var pordBorderColor = "rgb(0, 164, 255)";

        var nonProdColor = "rgba(255,61,103,0.35)";
        var nonPordBorderColor = "rgb(255,61,103)";

        opts = {};

        if (techDetails) {

           
            opts.data = data.technologyCount.map(c => Object.values(c)[1]);
            
            let total = opts.data.reduce((a, b) => a + b, 0);

            opts.labels = data.technologyCount.map(c => {
                
                let percentage = Math.floor(((Object.values(c)[1] / total) * 100) + 0.5);
                return Object.values(c)[0] + 'Servers : ' + Object.values(c)[1] + ' : ' + percentage + '%'
            });


            opts.colors = ["rgb(255, 99, 132)",
                "rgb(54, 162, 235)",
                "rgb(255, 205, 86)"
            ];
            //opts.legendCtrl = $("#server-tech-details-legend-Byrnc");

            let rootid = "serverTechDetailsByrnc";
            let container = '#' + rootid + '-container';
            let legend = rootid + '-legend';
            let field = rootid + '-canvas';
            
            bindDataServerInfoToCharts(opts, techDetailsByrncCanvas, field, container, legend);
            
            

        }

        if ( envDetails) {

            opts.data = data.enviromnetCount.map(c => Object.values(c)[1]);
            let total = opts.data.reduce((a, b) => a + b, 0);
            opts.labels = data.enviromnetCount.map(c => {

                let percentage = Math.floor(((Object.values(c)[1] / total) * 100) + 0.5);
                return Object.values(c)[0] + 'Servers : ' + Object.values(c)[1] + ' : ' + percentage + '%'
            });
            opts.colors = [
                "rgb(255, 99, 132)",
                "rgb(54, 162, 235)",
                "rgb(255, 205, 86)"
            ];
            //opts.legendCtrl = $("#server-env-details-legend-Byrnc");

            let rootid = "serverEnvDetailsByrnc";
            let container = '#' + rootid + '-container';
            let legend = rootid + '-legend';
            let field = rootid + '-canvas';

            bindDataServerInfoToCharts(opts, envDetailsCanvas, field, container, legend);

        }

        if (typeDetails) {


            opts.data = data.lsaCount.map(c => Object.values(c)[1]);
            let total = opts.data.reduce((a, b) => a + b, 0);
            opts.labels = data.lsaCount.map(c => {
                let percentage = Math.floor(((Object.values(c)[1] / total) * 100) + 0.5);
                return Object.values(c)[0] + 'Servers : ' + Object.values(c)[1] + ' : ' + percentage + '%'
            });
            opts.colors = [
                "rgb(255, 99, 132)",
                "rgb(54, 162, 235)",
                "rgb(245, 185, 76)"
            ];
            //opts.legendCtrl = $("#server-type-details-legend-Byrnc");

            let rootid = "serverTypeDetailsByrnc";
            let container = '#' + rootid + '-container';
            let legend = rootid + '-legend';
            let field = rootid + '-canvas';

            bindDataServerInfoToCharts(opts, serverTypeDetailsCanvas, field, container, legend);
            
        }
        
        if (data.sqlServersProd) {

            $(prodSqlServersCanvas).parent().show();

            

            opts.data = data.sqlServersProd.map(c => Object.values(c)[1]);
            let total = opts.data.reduce((a, b) => a + b, 0);
            opts.labels = data.sqlServersProd.map(c => {
                let percentage = Math.floor(((Object.values(c)[1] / total) * 100) + 0.5);
                return Object.values(c)[0] + 'Servers : ' + Object.values(c)[1] + ' : ' + percentage + '%'
            });
            opts.colors = [
                "rgb(255, 99, 132)",
                "rgb(54, 162, 235)",
                "rgb(245, 185, 76)"
            ];
            opts.colors = getColorPallate(opts.data.length);

            //opts.legendCtrl = $("#sql-servers-prod-legend-Byrnc");
            let rootid = "prodSqlServersByrnc";
            let container = '#' + rootid + '-container';
            let legend = rootid + '-legend';
            let field = rootid + '-canvas';

            bindDataServerInfoToCharts(opts, prodSqlServersCanvas, field, container, legend);

        } else {
            $(prodSqlServersCanvas).parent().hide();
        }

        if (data.dB2ServersProd) {

            opts.data = data.dB2ServersProd.map(c => Object.values(c)[1]);
            let total = opts.data.reduce((a, b) => a + b, 0);
            opts.labels = data.dB2ServersProd.map(c => {
                let percentage = Math.floor(((Object.values(c)[1] / total) * 100) + 0.5);
                return Object.values(c)[0] + 'Servers : ' + Object.values(c)[1] + ' : ' + percentage + '%'
            });
            opts.colors = [
                "rgb(255, 99, 132)",
                "rgb(54, 162, 235)",
                "rgb(245, 185, 76)"
            ];
            //opts.legendCtrl = $("#db2-servers-prod-legend");
            opts.colors = getColorPallate(opts.data.length);

            let rootid = "prodDB2ServersByrnc";
            let container = '#' + rootid + '-container';
            let legend = rootid + '-legend';
            let field = rootid + '-canvas';

            bindDataServerInfoToCharts(opts, prodDB2ServersCanvas, field, container, legend);

        } else {
            $(prodDB2ServersCanvas).parent().hide();
        }

        if (data.oracleServersProd) {

            opts.data = data.oracleServersProd.map(c => Object.values(c)[1]);
            opts.labels = data.oracleServersProd.map(c => Object.values(c)[0] + ' Servers (' + Object.values(c)[1] + ')');

            opts.colors = [
                "rgb(255, 99, 132)",
                "rgb(54, 162, 235)",
                "rgb(245, 185, 76)"
            ];
            //opts.legendCtrl = $("#oracle-servers-prod-legend");
            opts.colors = getColorPallate(opts.data.length);

            let rootid = "prodOracleServersByrnc";
            let container = '#' + rootid + '-container';
            let legend = rootid + '-legend';
            let field = rootid + '-canvas';
            bindDataServerInfoToCharts(opts, prodOracleServersCanvas, field, container, legend);

        } else {
            $(prodOracleServersCanvas).parent().hide();
        }


        if (data.sqlServersNonProd) {

            
           // $(nonProdSqlServersCanvas).parent().show();            

            opts.data = data.sqlServersNonProd.map(c => Object.values(c)[1]);
            opts.labels = data.sqlServersNonProd.map(c => Object.values(c)[0] + ' Servers (' + Object.values(c)[1] + ')');

            opts.colors = [
                "rgb(255, 99, 132)",
                "rgb(54, 162, 235)",
                "rgb(245, 185, 76)"
            ];
           // opts.legendCtrl = $("#sql-servers-nonprod-legend-Byrnc");
            opts.colors = getColorPallate(opts.data.length);

            let rootid = "nonProdSqlServersByrnc";
            let container = '#' + rootid + '-container';
            let legend = rootid + '-legend';
            let field = rootid + '-canvas';

            bindDataServerInfoToCharts(opts, nonProdSqlServersCanvas, field, container, legend);



        } else {
            $(nonProdSqlServersCanvas).parent().hide();
        }

        if (data.dB2ServersNonProd) {

           // $(nonProdDB2ServersCanvas).parent().show();

            opts.data = data.dB2ServersNonProd.map(c => Object.values(c)[1]);
            opts.labels = data.dB2ServersNonProd.map(c => Object.values(c)[0] + ' Servers (' + Object.values(c)[1] + ')');

            opts.colors = [
                "rgb(255, 99, 132)",
                "rgb(54, 162, 235)",
                "rgb(245, 185, 76)"
            ];
            //opts.legendCtrl = $("#db2-servers-nonprod-legend");
            opts.colors = getColorPallate(opts.data.length);


            let rootid = "nonProdDB2ServersByrnc";
            let container = '#' + rootid + '-container';
            let legend = rootid + '-legend';
            let field = rootid + '-canvas';

            bindDataServerInfoToCharts(opts, nonProdDB2ServersCanvas, field, container, legend);

            
        } else {
            $(nonProdDB2ServersCanvas).parent().hide();
        }

        if ( data.oracleServersNonProd) {

           // $(nonProdOracleServersCanvas).parent().show();


            opts.data = data.oracleServersNonProd.map(c => Object.values(c)[1]);
            opts.labels = data.oracleServersNonProd.map(c => Object.values(c)[0] + ' Servers (' + Object.values(c)[1] + ')');

            opts.colors = [
                "rgb(255, 99, 132)",
                "rgb(54, 162, 235)",
                "rgb(245, 185, 76)"
            ];
            //opts.legendCtrl = $("#oracle-servers-nonprod-legend");
            opts.colors = getColorPallate(opts.data.length);


            let rootid = "nonProdOracleServersByrnc";
            let container = '#' + rootid + '-container';
            let legend = rootid + '-legend';
            let field = rootid + '-canvas';

            nonProdOracleServersInfoChart = bindDataServerInfoToCharts(opts, nonProdOracleServersCanvas, field, container, legend);
            

        } else {
            $(nonProdOracleServersCanvas).parent().hide();
        }


       // techInfoByRNC.update();
       
       //regionCharts.push(techInfoByRNC);
       // regionCharts.push(envDetailsByRNC);
       
       //regionCharts.push(serverDetailsByRNC);;
       //
       //regionCharts.push(prodOracleServersInfoChart);;
       //regionCharts.push(prodDB2ServersInfoChart);;
       //regionCharts.push(prodSqlServersByRNC);;
       //
       //regionCharts.push(nonProdOracleServersInfoChart);;
       //regionCharts.push(nonProdDB2ServersInfoChart);;
       //regionCharts.push(nonProdSqlServersByRNC);;

    }

})


