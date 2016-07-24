if(Meteor.isClient) {

    Template.pdi_repairList.helpers({

        showList: function() {
            event.preventDefault();
            return  MachineReady.find({machineId: {$gt:'C6700000'}}, {sort: {date: -1}});
        },

        'selectedClass': function(){
            var openInspect = this._id;
            var selectedPdiMachine = Session.get('selectedPdiMachine');
            if (selectedPdiMachine == openInspect) {
                return "selected_2"
            }
        }

    });


    Template.pdi_repairList.events({

        'click .showPdiResult': function() {
            var pdiMachine = this._id;
            Session.set('selectedPdiMachine', pdiMachine);
        },

        'click .showPdiSummary': function() {
            event.preventDefault();
        },

        'click #buttonDownload': function () {
            var machineId = Session.get('selectedPdiMachine');
            var result = MachineReady.find({_id:machineId}, {fields: {machineId: 1}}).fetch();
            var machineNr = JSON.stringify(result).slice(15, 23);
            var nameFile = 'fileDownloaded.csv';
           Meteor.call('download_2', machineNr, function (err, fileContent) {
                if (fileContent) {
                    var blob = new Blob([fileContent], {type: "text/plain;charset=utf-8"});
                    saveAs(blob, nameFile);
                }
            });
        }

    });

    Template.pdiInspectList.helpers({

        listContent: function() {
            var pdiMachine = Session.get('selectedPdiMachine');
            return MachineReady.find({_id: pdiMachine}).fetch();
        }
    });


}