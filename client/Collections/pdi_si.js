/**
 * Created by Jogibaer on 29.06.2016.
 */
if(Meteor.isClient) {

    
    Template.si.events({
        
        'submit .siItems': function() {
            event.preventDefault();
            const machine = event.target.siMachine.value;
            const siItemText = event.target.siItemText.value;
            Meteor.call('siList', machine, siItemText);
            event.target.siMachine.value="";
            event.target.siItemText.value="";
        },
    });

    Template.si.helpers({

        siList: function() {
            event.preventDefault();
            return siList.find();
        },

       failureList: function () {
            Session.set('selectedNewFailure', "");
            return FailuresList.find({}, {sort: {error_describ: 1}});
        },

        'selectedItem': function() {
            event.preventDefault();
            const checkPoint = this._id;
            const selectedCheckPoint = Session.get('selectedNewFailure');
            if (selectedCheckPoint === checkPoint) {
                return "selected"
            }
        }


    })

}