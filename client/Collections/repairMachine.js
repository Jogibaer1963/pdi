if(Meteor.isClient) {


    Template.repairMachine.helpers({
        shippList: function () {
            // Order of shipping date
            return MachineReady.find({$and: [
                {pdiStatus: 1},
                {$or: [{repairStatus: 0}, {repairStatus: 2}]}
                 ]}, {sort: {date: 1}});
        },

        'selectedClass2': function(){
            var openRepair = this._id;
            var selectedMachineId = Session.get('selectedMachineId');
            if (selectedMachineId == openRepair) {
                return "selected_2"
            }
        }


    });

    Template.repairMachine.events({

        'click .openInspections': function() {
            var openRepair = this._id;
            Session.set('selectedMachineId', openRepair);

        },

        'click .startRepair': function() {
            event.preventDefault();
            var machineRepaired = Session.get('selectedMachineId');
            Meteor.call('machineRep', machineRepaired);
        },

        'submit .locationId': function(event) {
            event.preventDefault();
            var selectedPdiMachine = Session.get('selectedMachineId');
            if(typeof selectedPdiMachine === 'undefined') {
                console.log('undefined');
                alert('Mark the Machine first before update the Location');
            }
            var locationId = event.target.locationId.value;
            Meteor.call('locationUpdate', selectedPdiMachine, locationId);
            event.target.locationId.value="";
            Session.set('selectedMachineId', '');
        }
    });

    Template.washBayRepairMessage.events({
        'submit .messageToWashBay': function() {
            event.preventDefault();
            var washMessage = event.target.message.value;
            var machine_id = Session.get('selectedMachineId');
            var machineTestId = MachineReady.findOne({_id: machine_id}).machineId;
            Meteor.call('messageToWashBay', machineTestId, washMessage, machine_id);
            event.target.message.value = '';
        }


    });

    Template.upcomings.helpers({

        upcomingList: function () {
            // Order of shipping date
            return MachineReady.find({machineId: {$gt: 'C00000'}, $or: [{shipStatus: 0},
                {shipStatus: 2}]}, {sort: {date: 1}});
        }

    });

}
