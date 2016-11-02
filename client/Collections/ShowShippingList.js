if (Meteor.isClient) {


    Template.shippingMachines.events({
       'click .headerShip': function() {
           FlowRouter.go('headerShipList');
       }

    });

    Template.inputMachine.events({
        "submit .inputNewMachine": function(event) {
            event.preventDefault();
            var createUnixTime = Date.now();
            var startDate = moment.tz(createUnixTime, "America/Chicago").format().slice(0, 19);
            var createDate = startDate.slice(0,10);
            var createTime = startDate.slice(-8);
            var newMachineInput = event.target.newMachine.value;
            var newShippingDate = event.target.newDate.value;
            var newShippingDestination = event.target.newDestination.value;
            var newShippingTransporter = event.target.newTransporter.value;
            var newShippingKit= [];
            $('input[name=newKit]:checked').each(function() {
                newShippingKit.push($(this).val());
            });
            var newShippingTireTrack = event.target.newTireTrack.value;
            var newShippingComment = event.target.newComment.value;
            Meteor.call('addToShipList', newMachineInput, newShippingDate,
                createUnixTime, createDate, createTime, newShippingDestination,
                newShippingTransporter, newShippingKit, newShippingTireTrack, newShippingComment );
            event.target.newMachine.value="";
            event.target.newDate.value="";
            event.target.newDestination.value="";
            event.target.newTransporter.value="";
            document.getElementById('newKit1').checked= false;
            document.getElementById('newKit2').checked= false;
            document.getElementById('newKit3').checked= false;
            document.getElementById('newKit4').checked= false;
            document.getElementById('newKit5').checked= false;
            document.getElementById('newKit6').checked= false;
            event.target.newTireTrack.value="";
            event.target.newComment.value="";
        },

        'click .maryView': function() {
            event.preventDefault();
            FlowRouter.go('maryView');
        },

        'submit .searchMachines': function() {
            event.preventDefault();
            var selectedMachine = event.target.inputSearch.value;
            var idFinder = MachineReady.find({machineId: selectedMachine}, {fields: {_id: 1}}).fetch();
            var idString = JSON.stringify(idFinder);
            var idExtract = idString.slice(9, 26);
            if(typeof idExtract == 'string' ) {
                Session.set('editSelectedMachine', idExtract);
                FlowRouter.go('editMachine');
            }
        }
    });

    Template.inputMachine.helpers({
        editMachine: function() {
            var selectedMachine = Session.get('selectedMachine');
           return MachineReady.findOne({_id: selectedMachine});
        }

    });

    Template.shippingList.helpers({

        shippList: function () {
            // Order of shipping date
            return MachineReady.find({machineId: {$gt:'C0000000'}}, {sort: {date: -1}});
        },

        'selectedClass': function() {
            var shippingMachine = this._id;
            var selectedMachine = Session.get('selectedMachine');
            if (shippingMachine == selectedMachine) {
               return "selected"
           }
       }

    });


    Template.shippingList.events({
        'click .newShippingMachine': function() {
            event.preventDefault();
            var shippingMachine = this._id;
            Session.set('selectedMachine', shippingMachine );
        },

        'click .buttonPositionId3': function() {
            event.preventDefault();
            var selectedMachine = Session.get('selectedMachine');
            Meteor.call('removeFromShipList', selectedMachine)
        },

        'click .buttonEdit': function() {
            var selectedMachine = Session.get('selectedMachine');
            Session.set('editSelectedMachine', selectedMachine);
            if(typeof selectedMachine == 'string' ) {
            FlowRouter.go('editMachine');
            }
        }
    });

}

