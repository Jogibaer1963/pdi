if (Meteor.isClient) {

        Template.reviewList.helpers({

            reviewMachine: function() {
                event.preventDefault();
                var machineCheck =  MachineReady.find({ _id: "NL7QP97zbG3yMZndd"});
                console.log(machineCheck);
            }


        })

}