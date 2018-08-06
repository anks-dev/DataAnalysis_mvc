
function getSummaryDetails() {


   
    var dtOptions = {
        "scrollY": '40vh',
        "bDestroy": true,
        "scrollX": true,
        "autoWidth": true,
        "searching": false,
        "paging": false,
    };

    var searchxhr = $.ajax({
        method: "GET",        
        url: "api/home/getsummaries",
    })
        .done(function (data) {

            var dataArray = [];
            var columns = [];
            var colDefs = [];
            var summaries = {};

            $.each(data, function (i, item) {

                if (Object.prototype.toString.call(item) !== '[object Array]' || typeof item !== 'object') {
                    return true;
                }

                $.each(item, function (index, value) {

                    if (!value) {
                        return true;
                    }
                    var values = [];
                    for (var key in value) {
                        values.push(value[key]);
                    }
                    // add 'data', remove 'value', select will be rendered from 'label'
                    // If you want display value (Tel) after selection, use this:
                    // result.push({label:value.Name, value:value.Tel, data:value });


                    if (!dataArray.length) {

                        keys = Object.keys(value);

                        for (var i = 0, len = keys.length; i < len; i++) {
                            columns.push({ title: keys[i], defaultContent: "" })
                            // colDefs.push({ width:"100%", targets:i})
                        }

                        //$.each(keys, function (index, value) {
                        //    columns.push({title:value})
                        //})m 
                        //columns = Object.keys(value);                  
                    }
                    dataArray.push(values);
                });

                if (dataArray.length, columns.length) {
                    summaries[i] = { dataArray: dataArray, columns: columns };
                    dataArray = [];
                    columns = [];
                }


            });

            console.log(summaries);


            var ts = $('#technologySummary').DataTable(setDatatableHeight( $.extend({
                "data": summaries.technologySummary.dataArray,
                "columns": summaries.technologySummary.columns,                
            }, dtOptions)));

            var ms = $('#mssqlSummary').DataTable(setDatatableHeight( $.extend( {
                "data": summaries.mssqlSummary.dataArray,
                "columns": summaries.mssqlSummary.columns,               
            }, dtOptions)));

            var mvs = $('#mssqlVersionSummary').DataTable( $.extend({
                "data": summaries.mssqlVersionSummary.dataArray,
                "columns": summaries.mssqlVersionSummary.columns,                
            }, dtOptions));

            var os = $('#oracleSummary').DataTable( $.extend({
                "data": summaries.oracleSummary.dataArray,
                "columns": summaries.oracleSummary.columns,
            }, dtOptions));

            var ovs = $('#oracleVersionSummary').DataTable( $.extend({
                "data": summaries.oracleVersionSummary.dataArray,
                "columns": summaries.oracleVersionSummary.columns,
            }, dtOptions));

            var db2s = $('#db2Summary').DataTable( $.extend({
                "data": summaries.dB2Summary.dataArray,
                "columns": summaries.dB2Summary.columns,
            }, dtOptions));

            var db2vs = $('#db2VersionSummary').DataTable( $.extend({
                "data": summaries.dB2VersionSummary.dataArray,
                "columns": summaries.dB2VersionSummary.columns,
            }, dtOptions));

            var lsas = $('#lsaSummary');



            lsas.DataTable(setDatatableHeight( $.extend({
                "data": summaries.lsaSummary.dataArray,
                "columns": summaries.lsaSummary.columns,
            }, dtOptions)));

            //setTimeout(function () {           
            //    $('table thead th').trigger('click')
            //}, 2000)


            console.log(data);

        })
        .fail(function () {
            console.log("error");
        })
        .always(function () {
        });
}



getSummaryDetails();


function setDatatableHeight(options) {

    if (options && options.data && options.data.length <= 9) {

        delete options.scrollY;
    }
    return options;
}


$('#summary-tab').click(function () {
    setTimeout(function () {
        $('table thead th').trigger('click')
    }, 1200)
})

