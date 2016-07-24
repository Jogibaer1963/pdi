/**
 * Created by Jogibaer on 12.06.2016.
 */
if (Meteor.isClient) {

    Template.machineLocation.helpers({
        overView: function() {
            return MachineReady.find( {machineId: {$gt: 'C00000'}, $or: [{shipStatus: 0}, {shipStatus: 2}]}, {sort: {date: 1}});
        },

        'selectedClass': function(){
            var openInspect = this._id;
            var selectedLocation = Session.get('selectedLocation');
            if (selectedLocation == openInspect) {
                return "selected"
            }
        }
    });

    Template.machineLocation.events({

        'click .locationUpdate': function() {
            event.preventDefault();
            var newLocation = this._id;
            Session.set('selectedLocation', newLocation);
        },

        'submit .locationId': function() {
            event.preventDefault();
            var machineId = Session.get('selectedLocation');
            var locationUpdate = event.target.locationId.value;
            if(typeof locationUpdate === 'undefined') {
                alert('Mark the Machine first before update the Location');
            }
            Meteor.call('locationUpdate', machineId, locationUpdate);
            event.target.locationId.value="";
            Session.set('selectedPdiMachine', '');
        }

    });

}