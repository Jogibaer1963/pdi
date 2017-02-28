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
            const openRepair = this._id;
            var selectedMachineId = Session.get('selectedMachineId');
            if (selectedMachineId == openRepair) {
                return "selected_2"
            }
        }


    });

    Template.repairMachine.events({

        'click .openInspections': function() {
            const openRepair = this._id;
            Session.set('selectedMachineId', openRepair);

        },

        'submit .repairFinnish': function(event) {
            event.preventDefault();
            const machineRepaired = Session.get('selectedMachineId');
            const workingHour = event.target.workingHours.value;
            Meteor.call('machineRep', machineRepaired, workingHour);
        },

        'submit .locationId': function(event) {
            event.preventDefault();
            var selectedPdiMachine = Session.get('selectedMachineId');
            if(typeof selectedPdiMachine === 'undefined') {
                console.log('undefined');
                alert('Mark the Machine first before update the Location');
            }
            const locationId = event.target.locationId.value;
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
            return MachineReady.find({$and: [{pdiStatus: 0}, {$or: [{shipStatus: 0}, {shipStatus: 2}]}]}, {sort: {date: 1}});
        }

    });

}
