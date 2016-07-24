/**
 * Created by Jogibaer on 07.06.2016.
 */
if (Meteor.isClient) {



    Template.machineSearch.events({
        "submit .searchMachine": function (event) {
            event.preventDefault();
            var findMachine = event.target.searchId.value;;
            Session.set('findMachine', findMachine);
           
        }
    });


    Template.machineSearch.helpers({
        machineSearchShow: function() {
            event.preventDefault();
            var findMachine = Session.get('findMachine');
            if(findMachine === undefined) {
            } else {
            return MachineReady.find({machineId: findMachine});
            }
        }


    })
}