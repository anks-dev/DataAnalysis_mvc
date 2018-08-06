
function getSummaryDetails() {


    let domain = window.location.protocol + '://' + document.location.hostname;


    if (domain.includes('localhost')) {

        domain += ':' + window.location.port;
    }

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
        url: domain + "api/home/getsummaries",
    })
        .done(function (data) {

            var dataArray = [];
            var columns = [];
            var colDefs = [];
            var summaries = {};

            $.each(data, function (i, item) {

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
                "data": summaries.mSSQLSummary.dataArray,
                "columns": summaries.mSSQLSummary.columns,               
            }, dtOptions)));

            var mvs = $('#mssqlVersionSummary').DataTable(setDatatableHeight( $.extend({
                "data": summaries.mSSQLVersionSummary.dataArray,
                "columns": summaries.mSSQLVersionSummary.columns,                
            }, dtOptions)));

            var os = $('#oracleSummary').DataTable(setDatatableHeight( $.extend({
                "data": summaries.oracleSummary.dataArray,
                "columns": summaries.oracleSummary.columns,
            }, dtOptions)));

            var ovs = $('#oracleVersionSummary').DataTable(setDatatableHeight( $.extend({
                "data": summaries.oracleVersionSummary.dataArray,
                "columns": summaries.oracleVersionSummary.columns,
            }, dtOptions)));

            var db2s = $('#db2Summary').DataTable(setDatatableHeight( $.extend({
                "data": summaries.dB2Summary.dataArray,
                "columns": summaries.dB2Summary.columns,
            }, dtOptions)));

            var db2vs = $('#db2VersionSummary').DataTable(setDatatableHeight( $.extend({
                "data": summaries.dB2VersionSummary.dataArray,
                "columns": summaries.dB2VersionSummary.columns,
            }, dtOptions)));

            var lsas = $('#lsaSummary');



            lsas.DataTable(setDatatableHeight( $.extend({
                "data": summaries.lSASummary.dataArray,
                "columns": summaries.lSASummary.columns,
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

