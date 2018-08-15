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

var regionSelected = '';
var companySelected = '';

$(document).ready(function () {

    $("#companiesSelector").change(function () {
        console.log("Server Type changed")
        var selectedValue = this.options[this.selectedIndex].value;
        if (!selectedValue) {
            return;
        }

        companySelected = selectedValue
        //alert($('option:selected', this).text());
        console.log('get individual servers data');
        getIndividulaServersData();
        
    });

    $("#regionSelector").change(function () {
        console.log("Server Type changed")
        var selectedValue = this.options[this.selectedIndex].value;
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
            console.log(data);
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
            console.log(data);
            serverAnalysisData = data;

            let techDetailsCanvas = document.getElementById("TechDetailsCanvas-rg");
            let envDetailsCanvas = document.getElementById("EnvDetailsCanvas-rg");
            let lsaDetailsCanvas = document.getElementById("LSADetailsCanvas-rg");




           let TechDetails = data.technologyDetails;
           let EnvDetails = data.environmentDetails;
           let LSADetails = data.lsaDetails;


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
                opts.data = data.technologyCount.map(c => Object.values(c)[1]);
                opts.labels = data.technologyCount.map(c => Object.values(c)[0] + 'Servers (' + Object.values(c)[1] + ')');

                opts.colors = ["rgb(255, 99, 132)",
                    "rgb(54, 162, 235)",
                    "rgb(255, 205, 86)"
                ];
                opts.legendCtrl = $("#tech-details-legend-rg");

                var tchartt = bindDataServerInfoToCharts(opts, techDetailsCanvas);

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

                var echartt = bindDataServerInfoToCharts(opts, envDetailsCanvas);

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

                var echartt = bindDataServerInfoToCharts(opts, lsaDetailsCanvas);

            }

          

        })
            .fail(function (error) {
                console.log(error);
            })
            .always(function () {
            });
    }
    function bindDataServerInfoToCharts(opts, canvas) {

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
                        data: opts.data,
                        backgroundColor: opts.colors
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

        //canvasCharts.forEach(function (item, index) {

        //    if (item && item.destroy) {
        //        item.destroy();
        //    }

        //})


        let techDetailsCanvas = document.getElementById("serverTechDetailsCanvas-Byrnc")
        let envDetailsCanvas = document.getElementById("serverEnvDetailsCanvas-Byrnc")
        let serverTypeDetailsCanvas = document.getElementById("serverTypeDetailsCanvas-Byrnc")
        
        let prodSqlServersCanvas = document.getElementById("prodSqlServersCanvas-Byrnc")
        let prodDB2ServersCanvas = document.getElementById("prodDB2ServersCanvas-Byrnc")
        let prodOracleServersCanvas = document.getElementById("prodOracleServersCanvas-Byrnc")
        
        let nonProdSqlServersCanvas = document.getElementById("nonProdSqlServersCanvas-Byrnc")
        let nonProdDB2ServersCanvas = document.getElementById("nonProdDB2ServersCanvas-Byrnc")
        let nonProdOracleServersCanvas = document.getElementById("nonProdOracleServersCanvas-Byrnc")

        //$('.serverAnalysisBlock canvas').each(function (index, item) {
        //    clearCanvas(this);
        //})




        var techDetails = data.technologyCount;
        var envDetails = data.enviromnetCount;
        var typeDetails = data.lsaCount;
        var prodColor = "rgba(0, 164, 255, 0.35)";
        var pordBorderColor = "rgb(0, 164, 255)";

        var nonProdColor = "rgba(255,61,103,0.35)";
        var nonPordBorderColor = "rgb(255,61,103)";

        if (TechDetailsCanvas && techDetails) {

            opts = {};
            opts.data = data.technologyCount.map(c => Object.values(c)[1]);
            opts.labels = data.technologyCount.map(c => Object.values(c)[0] + 'Servers (' + Object.values(c)[1] + ')');

            opts.colors = ["rgb(255, 99, 132)",
                "rgb(54, 162, 235)",
                "rgb(255, 205, 86)"
            ];
            opts.legendCtrl = $("#server-tech-details-legend-Byrnc");

            instanceServerTechInfoChart = bindDataServerInfoToCharts(opts, techDetailsCanvas);

        }

        if (envDetailsCanvas && envDetails) {

            opts.data = data.enviromnetCount.map(c => Object.values(c)[1]);
            opts.labels = data.enviromnetCount.map(c => Object.values(c)[0] + 'Servers(' + Object.values(c)[1] + ')');

            opts.colors = [
                "rgb(255, 99, 132)",
                "rgb(54, 162, 235)",
                "rgb(255, 205, 86)"
            ];
            opts.legendCtrl = $("#server-env-details-legend-Byrnc");

            instanceServerEnvInfoChart = bindDataServerInfoToCharts(opts, envDetailsCanvas);

        }

        if (serverTypeDetailsCanvas && typeDetails) {


            opts.data = data.lsaCount.map(c => Object.values(c)[1]);
            opts.labels = data.lsaCount.map(c => Object.values(c)[0] + ' Servers (' + Object.values(c)[1] + ')');

            opts.colors = [
                "rgb(255, 99, 132)",
                "rgb(54, 162, 235)",
                "rgb(245, 185, 76)"
            ];
            opts.legendCtrl = $("#server-type-details-legend-Byrnc");

            instanceServerTypeInfoChart = bindDataServerInfoToCharts(opts, serverTypeDetailsCanvas);
            
        }
        debugger;
        if (prodSqlServersCanvas && data.sqlServersProd) {

            $(prodSqlServersCanvas).parent().show();

            

            opts.data = data.sqlServersProd.map(c => Object.values(c)[1]);
            opts.labels = data.sqlServersProd.map(c => Object.values(c)[0] + ' Servers (' + Object.values(c)[1] + ')');

            opts.colors = [
                "rgb(255, 99, 132)",
                "rgb(54, 162, 235)",
                "rgb(245, 185, 76)"
            ];
            opts.legendCtrl = $("#sql-servers-prod-legend-Byrnc");

            mssqlServerProdInfoChart = bindDataServerInfoToCharts(opts, prodSqlServersCanvas);

        } else {
            $(prodSqlServersCanvas).parent().hide();
        }

        if (prodDB2ServersCanvas && data.dB2ServersProd) {

            opts.data = data.dB2ServersProd.map(c => Object.values(c)[1]);
            opts.labels = data.dB2ServersProd.map(c => Object.values(c)[0] + ' Servers (' + Object.values(c)[1] + ')');

            opts.colors = [
                "rgb(255, 99, 132)",
                "rgb(54, 162, 235)",
                "rgb(245, 185, 76)"
            ];
            opts.legendCtrl = $("#db2-servers-prod-legend");

            db2ServerProdInfoChart = bindDataServerInfoToCharts(opts, prodDB2ServersCanvas);

        } else {
            $(prodDB2ServersCanvas).parent().hide();
        }

        if (prodOracleServersCanvas && data.oracleServersProd) {

            opts.data = data.oracleServersProd.map(c => Object.values(c)[1]);
            opts.labels = data.oracleServersProd.map(c => Object.values(c)[0] + ' Servers (' + Object.values(c)[1] + ')');

            opts.colors = [
                "rgb(255, 99, 132)",
                "rgb(54, 162, 235)",
                "rgb(245, 185, 76)"
            ];
            opts.legendCtrl = $("#oracle-servers-prod-legend");

            oracleServerProdInfoChart = bindDataServerInfoToCharts(opts, prodOracleServersCanvas);

        } else {
            $(prodOracleServersCanvas).parent().hide();
        }


        if (nonProdSqlServersCanvas && data.sqlServersNonProd) {

            
            $(nonProdSqlServersCanvas).parent().show();            

            opts.data = data.sqlServersNonProd.map(c => Object.values(c)[1]);
            opts.labels = data.sqlServersNonProd.map(c => Object.values(c)[0] + ' Servers (' + Object.values(c)[1] + ')');

            opts.colors = [
                "rgb(255, 99, 132)",
                "rgb(54, 162, 235)",
                "rgb(245, 185, 76)"
            ];
            opts.legendCtrl = $("#sql-servers-nonprod-legend-Byrnc");

            mssqlServerProdInfoChart = bindDataServerInfoToCharts(opts, nonProdSqlServersCanvas);



        } else {
            $(nonProdSqlServersCanvas).parent().hide();
        }

        if (nonProdDB2ServersCanvas && data.dB2ServersNonProd) {

            $(nonProdDB2ServersCanvas).parent().show();

            opts.data = data.dB2ServersNonProd.map(c => Object.values(c)[1]);
            opts.labels = data.dB2ServersNonProd.map(c => Object.values(c)[0] + ' Servers (' + Object.values(c)[1] + ')');

            opts.colors = [
                "rgb(255, 99, 132)",
                "rgb(54, 162, 235)",
                "rgb(245, 185, 76)"
            ];
            opts.legendCtrl = $("#db2-servers-nonprod-legend");

            db2ServerNonProdInfoChart = bindDataServerInfoToCharts(opts, nonProdDB2ServersCanvas);

            
        } else {
            $(nonProdDB2ServersCanvas).parent().hide();
        }

        if (nonProdOracleServersCanvas && data.oracleServersNonProd) {

            $(nonProdOracleServersCanvas).parent().show();


            opts.data = data.dB2ServersNonProd.map(c => Object.values(c)[1]);
            opts.labels = data.dB2ServersNonProd.map(c => Object.values(c)[0] + ' Servers (' + Object.values(c)[1] + ')');

            opts.colors = [
                "rgb(255, 99, 132)",
                "rgb(54, 162, 235)",
                "rgb(245, 185, 76)"
            ];
            opts.legendCtrl = $("#oracle-servers-nonprod-legend");

            oracleServerNonProdInfoChart = bindDataServerInfoToCharts(opts, nonProdOracleServersCanvas);

            



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


