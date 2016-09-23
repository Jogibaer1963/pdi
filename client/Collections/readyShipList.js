if (Meteor.isClient) {


    Template.overViewReadyList.helpers({
        overView: function () {
            return MachineReady.find({shipStatus: 0, pdiStatus: 1, repairStatus: 1, washStatus: 1}, {sort: {date: 1}});
        },

        'selectedClass': function() {
            var checkPoint = this._id;
            var selectedCheckPoint = Session.get('selectedMachine');
            if (selectedCheckPoint == checkPoint) {
                return "selected_2"
            }
        }
    });

    Template.overViewReadyList.events({

        'click .readyList': function() {
            var readyMachine = this._id;
            Session.set('selectedMachine', readyMachine );
        },

        'submit .shipMe': function(event) {
            event.preventDefault();
            var selectedCheckPoint = Session.get('selectedMachine');
           Meteor.call('shipMeInProcess', selectedCheckPoint);

        },

        'click .machineOnTrailer': function() {
            event.preventDefault();
            var selectedCheckPoint = Session.get('selectedMachine');
            Meteor.call('machineIsGone', selectedCheckPoint);
        },

        'submit .locationId': function(event) {
            event.preventDefault();
            var selectedPdiMachine = Session.get('selectedMachine');
            if(typeof selectedPdiMachine === 'undefined') {
                alert('Mark the Machine first before update the Location');
            }
            var locationId = event.target.locationId.value;
            Meteor.call('locationUpdate', selectedPdiMachine, locationId);
            event.target.locationId.value="";
            Session.set('selectedMachine', '');
        }
    });



    Template.shippingInProcess.helpers({
        shippingOverView: function() {
            return MachineReady.find({shipStatus: 2}, {sort: {date: 1}});
        },

        'selectedClass': function() {
            var shippingMachine = this._id;
            var selectedMachine = Session.get('selectedMachine');
            if (shippingMachine == selectedMachine) {
                return "selected"
            }
        }
    });


    Template.shippingInProcess.events({
        'click .machineReadyShip': function () {
            var shippingMachine = this._id;
            Session.set('selectedMachine', shippingMachine);

        },

        'click .machineOnTrailer': function() {
            var selectedCheckPoint = Session.get('selectedMachine');
            Meteor.call('machineIsGone', selectedCheckPoint);
        }
    });



}