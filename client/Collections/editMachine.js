if(Meteor.isClient) {

    Template.editMachine.helpers({
        showEditMachine: function() {
            var selectedMachine = Session.get('editSelectedMachine');
            var kitSaved = MachineReady.find({_id: selectedMachine}, {fields: {"kit": 1}}).fetch();
            var kitString = JSON.stringify(kitSaved);
            var kitExtract = kitString.slice(8, -28);
            var myString = kitExtract.replace(/"/g, "");
            var a = myString.indexOf('C03_0019', 0);
            if(a >= 0){
                var kit_1 = 'C03_0019';
                Session.set('kit_1', kit_1);
            } else {
                 Session.set('kit_1', undefined);
              }

            var b = myString.indexOf('C03_0065', 0);
            if(b >= 0){
                var kit_2 = 'C03_0065';
                Session.set('kit_2', kit_2);
            } else {
                Session.set('kit_2', undefined);
            }

            var c = myString.indexOf('C03_0165', 0);
            if(c >= 0){
                var kit_3 = 'C03_0165';
                Session.set('kit_3', kit_3);
            } else {
                Session.set('kit_3', undefined);
            }

            var d = myString.indexOf('B05_0120', 0);
            if(d >= 0){
                var kit_4 = 'B05_0120';
                Session.set('kit_4', kit_4);
            } else {
                Session.set('kit_4', undefined);
            }

            var e = myString.indexOf('B05_0130', 0);
            if(e >= 0){
                var kit_5 = 'B05_0130';
                Session.set('kit_5', kit_5);
            } else {
                Session.set('kit_5', undefined);
            }

            return MachineReady.findOne({_id: selectedMachine});
        },

         'newKit1': function() {
                 var kit_1 = Session.get('kit_1');
                 if(kit_1 == 'C03_0019') {
                     return 'checked';
                 }
         },

        'newKit2': function() {
            var kit_2 = Session.get('kit_2');
            if(kit_2 == 'C03_0065') {
                return 'checked';
            }
        },

        'newKit3': function() {
            var kit_3 = Session.get('kit_3');
            if(kit_3 == 'C03_0165') {
                return 'checked';
            }
        },

        'newKit4': function() {
            var kit_4 = Session.get('kit_4');
            if(kit_4 == 'B05_0120') {
                return 'checked';
            }
        },

        'newKit5': function() {
            var kit_5 = Session.get('kit_5');
            if(kit_5 == 'B05_0130') {
                return 'checked';
           }
        }

    });

    Template.editMachine.events({
        "submit .inputEditMachine": function(event) {
            event.preventDefault();
            var selectedMachine = Session.get('editSelectedMachine');
            var newMachine = event.target.newMachine.value;
            var newShippingDate = event.target.newDate.value;
            var newShippingDestination = event.target.newDestination.value;
            var newShippingTransporter = event.target.newTransporter.value;
            var newShippingTireTrack = event.target.newTireTrack.value;
            var newShippingKit= [];
            $('input[name=newKit]:checked').each(function() {
                newShippingKit.push($(this).val());
            });
            var newShippingComment = event.target.newComment.value;
            Meteor.call('editShipInfo', selectedMachine, newMachine, newShippingDate, newShippingDestination, newShippingTransporter, newShippingTireTrack, newShippingKit, newShippingComment );
            FlowRouter.go ('shippingMachines');
        }
    });

}