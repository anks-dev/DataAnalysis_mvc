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
   
    var jqxhr = $.ajax({
        method: "GET",
        url: "api/home/getServersCountGlobally",

    }).done(function (data) {
        console.log(data);
        serverAnalysisData = data;

       let techDetails_GlobalCanvas = document.getElementById("TechDetailsCanvas-global");
       let envDetails_GlobalCanvas = document.getElementById("EnvDetailsCanvas-global");
       let lsaDetails_GlobalCanvas = document.getElementById("LSADetailsCanvas-global");        

        let TechDetails = data.technologyDetails;
        let EnvDetails = data.environmentDetails;
        let LSADetails = data.lsaDetails;


        let legendToggleFunction = function (e) {

            if (e && e.data && e.data.chart) {


                let chart = e.data.chart;
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

        if (techDetails_GlobalCanvas) {

            opts = {};
            opts.data = data.technologyCount.map(c => Object.values(c)[1]);
            opts.labels = data.technologyCount.map(c => Object.values(c)[0] + 'Servers (' + Object.values(c)[1] +')');
            opts.colors = ["rgb(255, 99, 132)",  "rgb(54, 162, 235)", "rgb(255, 205, 86)"
            ];
            opts.legendCtrl = $("#tech-details-legend-global");

            var tchartt = bindDataServerInfoToCharts(opts, techDetails_GlobalCanvas);

        }

        if (envDetails_GlobalCanvas) {

            opts.data = data.enviromnetCount.map(c => Object.values(c)[1]);
            opts.labels = data.enviromnetCount.map(c => Object.values(c)[0] + 'Servers(' + Object.values(c)[1] +')');
            opts.colors = [
                "rgb(255, 99, 132)",
                "rgb(54, 162, 235)",
                "rgb(255, 205, 86)"
            ];
            opts.legendCtrl = $("#env-details-legend-global");

            var echartt = bindDataServerInfoToCharts(opts, envDetails_GlobalCanvas);

        }

        if (lsaDetails_GlobalCanvas) {


            opts.data = data.lsaCount.map(c => Object.values(c)[1]);
            opts.labels = data.lsaCount.map(c => Object.values(c)[0] + ' Servers (' + Object.values(c)[1] +')');
            opts.colors = [
                "rgb(255, 99, 132)",
                "rgb(54, 162, 235)",
                "rgb(1,132,143)",
                "rgb(245, 185, 76)"
            ];
            opts.legendCtrl = $("#lsa-details-legend-global");

            var echartt = bindDataServerInfoToCharts(opts, lsaDetails_GlobalCanvas);            
        }

       // $("#dataServerType").trigger('change');

    })
      .fail(function (error) {
            console.log(error);
        })
      .always(function () {
        });

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




})


