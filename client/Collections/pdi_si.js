/**
 * Created by Jogibaer on 29.06.2016.
 */
if(Meteor.isClient) {

    
    Template.si.events({

        'click .selectedSiItem': function () {
            const checkPoint = this._id;
            Session.set('selectedItem', checkPoint);
        },
        
        'submit .siItems': function() {
            event.preventDefault();
            const machine = event.target.siMachine.value;
            const siItemText = event.target.siItemText.value;
            Meteor.call('siList', machine, siItemText);
            event.target.siMachine.value="";
            event.target.siItemText.value="";
        },

        'submit .removeSiItem': function () {
            event.preventDefault();
            const siItem = Session.get('selectedItem');
            console.log(siItem);
            Meteor.call('removeFromSiList', siItem);

        }
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

        'selectedLineItem': function() {
            event.preventDefault();
            const checkPoint = this._id;
            const selectedCheckPoint = Session.get('selectedItem');
            if (selectedCheckPoint === checkPoint) {
                return "selected"
            }
        }


    })

}