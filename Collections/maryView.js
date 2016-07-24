if (Meteor.isClient) {


    Template.overViewListMaryView.helpers({

       overView: function() {
           return MachineReady.find({
               machineId: {$gt: 'C00000'}, $or: [{shipStatus: 0},
                   {shipStatus: 2}]}, {sort: {date: 1}}).fetch();
       },

        'selectedClass2': function(){
            var selectedTruck = this._id;
            var selectedMachineId = Session.get('selectedMachineId');
            if (selectedMachineId == selectedTruck) {
                return "selected_2"
            }
        }
    });


    Template.overViewListMaryView.events({

        'click .truckStatus': function() {
            var openRepair = this._id;
            Session.set('selectedMachineId', openRepair);
        },

        'click .addTruck': function() {
            event.preventDefault();
            var truckStatus = 1;
            var machineId = Session.get('selectedMachineId');
            Meteor.call('truckOrdered', machineId, truckStatus);
        },

        'click .removeTruck': function() {
            event.preventDefault();
            var truckStatus = 0;
            var machineId = Session.get('selectedMachineId');
            Meteor.call('truckRemoved', machineId, truckStatus);
        }

    });


    Template.headerListMaryView.helpers({
        overView: function() {
            return MachineReady.find( {headId: {$gt:'00'}, $or: [{shipStatus: 0},{shipStatus: 2}]},
                {sort: {date: 1}});
        }
    });

    
}


