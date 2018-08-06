var detailsVM = {};
$(document).ready(function () {

    let domain = window.location.protocol + '://' + document.location.hostname;

    if (domain.includes('localhost')) {

        domain += ':' + window.location.port;
    }

   

    $("#instancename").autocomplete({
        source: function (request, response) {
            $.ajax({               
                url:  "api/home/getinstanceinfo",
                data: {
                    name: request.term
                },
                success: function (data) {
                   
                    //var items = [];
                    //$.each(data, function (index, item) {                        
                    //    console.log(item);
                    //    items.push({ label : item.instanceName, value:  item });                       
                    //});
                    //data = items;
                    console.log(data);
                    var result = []
                    data.forEach(function (value, index) {
                        // add 'data', remove 'value', select will be rendered from 'label'
                        // If you want display value (Tel) after selection, use this:
                        // result.push({label:value.Name, value:value.Tel, data:value });
                        result.push({ label: value.instanceName, data: value });
                    });

                    //var array = data.length ? [] : $.map(data, function (m) {
                    //    return {
                    //        label: m.instanceName,
                    //        value: m
                    //    };
                    //});
                    response(result);

                   // response(array);
                    
                }
            });
        },
        minLength: 1,
        select: function (event, ui) {


            ko.cleanNode(document.getElementById("instanceDetails"));
            
            //detailsVM.company(ui.item.data.company)
            //detailsVM.edition(ui.item.data.edition)
            //detailsVM.status(ui.item.data.status)


            // Here's my data model
            detailsVM = function (vm) {
                this.company = ko.observable(vm.company);
                this.edition = ko.observable(vm.edition);
                this.status = ko.observable(vm.status);

                this.supportedBy = ko.observable(vm.supportedBy);
                this.version = ko.observable(vm.version);
                this.virtual = ko.observable(vm.isVirtual);

                this.machineName = ko.observable(vm.machineName);
                this.servicePack = ko.observable(vm.servicePack);
                this.projectUsing = ko.observable(vm.projectsUsing);

                this.ipAddress = ko.observable(vm.iPAddress);
                this.os = ko.observable(vm.oS);
                this.monitor = ko.observable(vm.monitor);

                this.contact = ko.observable(vm.contact);
                
            };

            ko.applyBindings(new detailsVM(ui.item.data), document.getElementById("instanceDetails")); // This makes Knockout get to work


            //log("Selected: " + ui.item.value + " aka " + ui.item.id);
        }
    });


});