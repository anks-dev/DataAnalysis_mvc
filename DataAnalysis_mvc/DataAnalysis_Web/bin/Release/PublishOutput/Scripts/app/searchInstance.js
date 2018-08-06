var tableColumns = [];
var searchTable = [];
function getInstanceInfoDetails(params) {

    let domain = window.location.protocol + '://' + document.location.hostname;


    if (domain.includes('localhost')) {

        domain += ':' + window.location.port;
    }

    

    var searchxhr = $.ajax({
        method: "GET",
        url: "api/home/getInstancesList",        
        data: {
            "company": params.company,
            "version": params.version,
        },


    })
       .done(function (data) {

           var dataArray = [];
           var columns = [];
           var colDefs = [];
           searchTable = data;
           data.forEach(function (value,index) {
               var values = [];
               for (var key in value) {
                   values.push(value[key]);
               }
               // add 'data', remove 'value', select will be rendered from 'label'
               // If you want display value (Tel) after selection, use this:
               // result.push({label:value.Name, value:value.Tel, data:value });


               if (!dataArray.length) {

                   keys = Object.keys(value);
                   tableColumns = keys;
                   bindTableColumnsToDropdown();
                   for (var i = 0, len = keys.length; i < len; i++) {
                       columns.push({ title: keys[i] })
                       // colDefs.push({ width:"100%", targets:i})
                   }

                   //$.each(keys, function (index, value) {
                   //    columns.push({title:value})
                   //})m 
                   //columns = Object.keys(value);                  
               }
               dataArray.push(values);
           });

           colDefs.push(

                           {
                               // The `data` parameter refers to the data for the cell (defined by the
                               // `data` option, which defaults to the column being worked with, in
                               // this case `data: 0`.
                               "render": function (data, type, row) {
                                   // return '<div class="overflow-ellips">' + data + '</div>';
                                   if (data && data.length) {
                                       var extract = data.substring(0, 50);;
                                       var elment = '<a tabindex="0" role="button" data-toggle="popover" data-trigger="focus" title="Contact"' +
                                           +' data-content="' + data + '">' + extract + '</a>';
                                       return elment;
                                   } else {
                                       return data;
                                   }
                               },
                               "targets": -1
                           }

               );

           $('#instancesList').DataTable({
               "data": dataArray,
               "columns": columns,
               "bDestroy": true,
               "scrollX": true,
               "autoWidth": true,
               "lengthMenu": [[7, 10, 25, 50, -1], [7, 10, 25, 50, "All"]],
               "columnDefs": colDefs,
               dom: 'Bfrtip',
               buttons: [
                  
            'pageLength',
                   
            {
                extend: 'excelHtml5',
                title: 'Instances List'
            },
            {
                extend: 'csvHtml5',
                title: 'Instances List'
            }
               ]
           });


           console.log(data);

       })
       .fail(function () {
           console.log("error");
       })
       .always(function () {
       });
}

$('.severOpt').change(function () {
    $('#clearFilter').trigger('click');
});


$(".searchlsa").click(function () {
    
    console.log("Search lsa")
    $('#matchValue').val('');
    //var selectedValue = this.options[this.selectedIndex].value;
    //if (!selectedValue) {
    //    return;
    //}
    var params = {};
    params.company = $('#companyName').val().toLowerCase();
    params.version = $('#technologyName').val().toLowerCase();

    if (!params.company || !params.version)
    {
        return;
    }
    //alert($('option:selected', this).text());


    getInstanceInfoDetails(params)
    

});

$('.addConstraint').on('click',function () {

    //var constblock = $('#constBlock');
    //$('.constContainer').append(constblock);

   // $('div.constBlock:first').clone(true).insertAfter(".constContainer div.constBlock:last");

    
    // get the block"
    var block = $('div.constBlock:first').clone(true);

 
    var num = $('div.constBlock').length +1;

    // assign the new ID 
    $(block).find('#matchValue').prop({ 'id': 'matchValue' + num , 'class': 'form-control typeahead' });

    // Finally insert wherever you want
    $(block).insertAfter(".constContainer div.constBlock:last");



    setTimeout(function () {
                       
        $('.typeahead').on('keydown', function () {
            var ele = $(this);
            $(this).typeahead({
            source: function (request, response) {

                var result = {}
                var tag = event.selector;
                var field = ele.closest('.constBlock').find('#tableColumn').val();

                if (!field) {
                    response(Object.keys(result));
                }

                console.log(searchTable);
                searchTable.forEach(function (item, index) {
                    result[(item[field])] = (item[field]);
                });

                response(Object.keys(result));
            },
            autoSelect: true
        });

        });
    }, 1000);
    
});

$('.removeConstraint').on('click', function () {

    //var constblock = $('#constBlock');
    //$('.constContainer').append(constblock);
    if ($('.constBlock').length == 1)
    {
        return;
    }

    $(this).closest('.constBlock').remove();

});

$('#filter').on('click', function(e){
    e.preventDefault();
    
    var table = $('#instancesList');
    var queryConstraints = $('.constBlock');
    var dtColumn = '', operator = '', dtValue = '';
    var qOptions = [];
    $.each(queryConstraints, function (index,value) {

        var dtColumn = $(this).find('#tableColumn').val(),
            operator = $(this).find('#operator').val(),
            dtValue = $(this).find('#matchValue').val();

        qOptions.push(
            {
                column: dtColumn,
                operator: operator,
                value:dtValue
            }
            )
    });
    filterByQuery(qOptions); // We call our filter function    
    table.dataTable().fnDraw(); // Manually redraw the table after filtering
});
  
// Clear the filter. Unlike normal filters in Datatables,
// custom filters need to be removed from the afnFiltering array.
$('#clearFilter').on('click', function (e) {

    $('#matchValue').val('');
    e.preventDefault();
    var table = $('#instancesList');
    $.fn.dataTableExt.afnFiltering.length = 0;
    table.dataTable().fnDraw();
});
 

var bindTableColumnsToDropdown = function () {

    if (tableColumns.length) {

        for (i = 0; i < tableColumns.length; i++) {
            var data = '<option>' + tableColumns[i] + '</option>'           
            $('#tableColumn').append(data);
        }
    }
}


/* Our main filter function
 * We pass the column location, the start date, and the end date
 */
var filterByQuery = function (qOptions) {
    // Custom filter syntax requires pushing the new filter to the global filter array
    $.fn.dataTableExt.afnFiltering.push(
        function (oSettings, aData, iDataIndex) {

            var result = false;

            

            $.each(qOptions, function (index,item) {

                colIndex = $.each(oSettings.aoColumns, function (i, col) {

                    if (col.sTitle == item.column) {
                                                    
                            result = evaluate[item.operator](item.value, (aData[col.idx]+"").toLowerCase())                        
                    }

                })               
            })

            return result;
          //  var rowDate = normalizeDate(aData[column]),
          //start = normalizeDate(startDate),
          //end = normalizeDate(endDate);
          
          //  // If our date from the row is between the start and end
          //  if (start <= rowDate && rowDate <= end) {
          //      return true;
          //  } else if (rowDate >= start && end === '' && start !== ''){
          //      return true;
          //  } else if (rowDate <= end && start === '' && end !== ''){
          //      return true;
          //  } else {
          //      return false;
          //  }
        }
    );
};

// converts date strings to a Date object, then normalized into a YYYYMMMDD format (ex: 20131220). Makes comparing dates easier. ex: 20131220 > 20121220
var normalizeDate = function(dateString) {
    var date = new Date(dateString);
    var normalized = date.getFullYear() + '' + (("0" + (date.getMonth() + 1)).slice(-2)) + '' + ("0" + date.getDate()).slice(-2);
    return normalized;
}

var evaluate = {
    '<': function (x, y) { return x < y },
    '<=': function (x, y) { return x <= y },
    '>': function (x, y) { return x > y },
    '>=': function (x, y) { return x >= y },
    '==': function (x, y) { return x == y },
    '!=': function (x, y) { return x != y }
}


// apply autocomplete for all input tags

function setAutocomplete() {

    $('#matchValue').on('focus', function () {

        //var field = $(this).closest('.constBlock').find('#tableColumn').val();
        $('#matchValue').typeahead({
                source: function (request, response) {

                    var result = {}
                
                    var field = $('#matchValue').closest('.constBlock').find('#tableColumn').val();

                    if (!field) {
                        response(Object.keys(result));
                    }

                    console.log(searchTable);
                    var sval =""
                    searchTable.forEach(function (item, index) {
                        sval = (item[field] + "").toLowerCase().trim();
                        if (sval) {
                            result[sval] = sval;
                        }
                    });

                    response(Object.keys(result));
                },
                
            autoSelect: true
        });


    });


};

setAutocomplete();

var src = ["PAAPP2278", "PAAPP4631", "PACLD3928", "PACLG2200", "PACLG2705\PACLG2705", "PACLG3548\DB01", "PACLG3549\DB02", "PACLG4750", "PACLG4990\DB01", "PADBRP010", "PADBRX010", "PADBS1648", "PADBS1649", "PADBS1730", "PADBS1730\APEX_PROD", "PADBS1730\FINANCE_PROD", "PADBS1730\TFS_PROD", "PADBS2741", "PADBS3450", "PADBS3758", "PADBS3826\RAPIDS_PROD", "PADBS3826\TFS2013", "EXISOKP1791", "FAAPCDP0614V", "FAAPCDP0664V", "FAAPCDP1882V", "FAAPCDT0198V", "FAAPCDT0631V", "FAAPCDT1883V\OTDEV", "FAAPCDT2112V", "FAAPCDT2113V", "FAAPCDT2260V", "FAAPOKP0193V", "FAAPOKP0194V", "FADBCDD0253V", "FADBCDD0529", "FADBCDD0581", "FADBCDD0582", "FADBCDD0800V", "FADBCDD0950V", "FADBCDD1014V\EA_POLICYDOC_DEV", "FADBCDD1014V\EA_POLICYDOC_QA", "FADBCDD1041V", "FADBCDD1758V", "FADBCDD1758V\MIQA", "FADBCDD2523V", "FADBCDD2523V\DB01", "FADBCDP0197V", "FADBCDP0246V", "FADBCDP0256V", "FADBCDP0257V", "FADBCDP0268V", "FADBCDP0445V", "FADBCDP0534", "FADBCDP0535", "FADBCDP0536", "FADBCDP0537", "FADBCDP0539", "FADBCDP0798V", "FADBCDP1675V", "FADBCDP1688V", "FADBCDP1719", "FADBCDP1723V", "FADBCDP1935V", "FADBCDP1938V", "FADBCDP1953", "FADBCDP1955", "FADBCDP2257V", "FADBCDP2488v", "FADBCDP2520V\DB01", "FADBCDQ0530", "FADBCDQ0531", "FADBCDQ0533", "FADBCDQ1193V", "FADBCDQ1478V", "FADBCDQ1951", "FADBCDQ1952", "FADBCDT0258V", "FADBCDT0917V", "FADBCLCDP0217P", "FADBCLCDP0217Q\FADBCLCDP0217Q", "FADBCLCDP1483Q", "FADBCLCDP1483R\DB01", "FADBCLCDP2333P\FLPROD", "FADBCLCDP2333Q\MIPROD", "FADBMCCDP0390Q", "FADBMCCDP1339PV", "FADBMCCDP1500P", "FADBMCCDQ1458P", "FADBMCOKP2428PV", "FADBMCOKQ2429PV", "FADBOKD0304V", "FADBOKP0319V", "FADBOKP0320V", "FADBOKP0321V", "FADBOKP0322V", "FADBOKP0323V", "PADBS4746", "PADBS5103", "PAINFDBS104"]