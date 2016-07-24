
if(Meteor.isClient) {


    Template.openPdi.helpers({
        countPdi: function() {
            return MachineReady.find({$or:[{pdiStatus: 0},{pdiStatus: 2}]}, {sort: {date: 1}}) .count();
        }
    });


    Template.inspection.helpers({
         shippList: function () {
           Session.set('selectedPdiMachine', '');
         // Order of shipping date
              return MachineReady.find({$or:[{pdiStatus: 0},{pdiStatus: 2}]}, {sort: {date: 1}});
            },
        
        'selectedClass': function(){
            var openInspect = this._id;
            var selectedPdiMachine = Session.get('selectedPdiMachine');
            if (selectedPdiMachine == openInspect) {
                return "selected_2"
                  }
             }
        });

    Template.inspection.events({
        'click .openInspections': function() {
            var openInspect = this._id;
            localStorage.setItem('selectedPdi', openInspect);
            Session.set('selectedPdiMachine', localStorage.getItem('selectedPdi'));
            var machineId = MachineReady.findOne({_id: openInspect}).machineId;
            localStorage.setItem('pdiMachine', machineId);
            Session.set('pdiMachineNumber', localStorage.getItem('pdiMachine'));
            var user = Meteor.user().username;
            Session.setPersistent('currentLoggedInUser', user);
            },

        'click .machinePdi': function() {
            var selectedPdiMachineId = Session.get('selectedPdiMachine');
            var selectedPdiMachineNr = Session.get('pdiMachineNumber');
            var firstRange =  JSON.stringify(selectedPdiMachineNr).slice(1,4);
            var range = ["All Machines"];
            range.push(firstRange);
            var dateStart = Date.now();
            Meteor.call('generatePdiList', selectedPdiMachineId, dateStart, selectedPdiMachineNr, range);
            FlowRouter.go('machineInspect');
        },

        'click .stopPdiProcess': function() {
            event.preventDefault();
            var pdiMachineId = Session.get('selectedPdiMachine');
            Meteor.call('cancelPdi', pdiMachineId);
            Session.set('selectedProfiCam', '');
            Session.set('selectedTeraTrackOm', '');
            Session.set('selectedCemosOm', '');
            Session.set('selectedUnloadOm', '');
            Session.set('selectedSuppOm', '');
            Session.set('selectedMainOm', '');
        },
        
        'click .machineSkipPdi': function() {
            event.preventDefault();
            var pdiMachineId = Session.get('selectedPdiMachine');
            Meteor.call('skipPdi', pdiMachineId);
        },

        'click .resumePdi': function() {
            event.preventDefault();
            FlowRouter.go('machineInspect_2');
        },
        
        'submit .locationId': function(event) {
            event.preventDefault();
            var selectedPdiMachine = Session.get('selectedPdiMachine');
            if(typeof selectedPdiMachine === 'undefined') {
                alert('Mark the Machine first before update the Location');
            }
            var locationId = event.target.locationId.value;
            Meteor.call('locationUpdate', selectedPdiMachine, locationId);
            event.target.locationId.value="";
            Session.set('selectedPdiMachine', '');
        },
        
        'submit .reservedId': function(event) {
            event.preventDefault();
            var selectedPdiMachine = Session.get('selectedPdiMachine');
            if(typeof selectedPdiMachine === 'undefined') {
                alert('Mark the Machine first before you reserve');
            }
            var reservedId = event.target.reservedId.value;
            Meteor.call('reserveUpdate', selectedPdiMachine, reservedId);
            event.target.reservedId.value="";
            Session.set('selectedPdiMachine', '');
            
        }

    });


    Template.inspectionHeads.helpers({
        shippList: function () {
            Session.set('selectedPdiMachine', '');
            // Order of shipping date
            return MachineReady.find({$or: [{pdiStatus: 0}, {pdiStatus: 2}]}, {sort: {date: 1}});
        }
    });

    Handlebars.registerHelper('inActive', function() {
        var inActiveStatus = Session.get('inActiveState');
        if(inActiveStatus == 0) {
            return 'inActiveButton';
        }
    });
        
}




