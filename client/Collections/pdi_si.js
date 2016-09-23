/**
 * Created by Jogibaer on 29.06.2016.
 */
if(Meteor.isClient) {
    
    Template.siItemList.helpers({
        
        siList: function() {
            event.preventDefault();
            return siList.find();
        },

        'selectedItem': function(){
            var siItem = this._id;
            var selectedSiItem = Session.get('selectedSiItem');
            if (selectedSiItem == siItem) {
                return "selected_2"
            }
        }
     });
    
    Template.siItemList.events({

        'click .selectedSiItem': function() {
            event.preventDefault();
            var newSiItem = this._id;
            Session.set('selectedSiItem', newSiItem);
        } 
    });
    
    
    Template.si.events({
        
        'submit .siItems': function() {
            event.preventDefault();
            var machine = event.target.siMachine.value;
            var siItemText = event.target.siItemText.value;
            Meteor.call('siList', machine, siItemText);
            event.target.siMachine.value="";
            event.target.siItemText.value="";
        },

        'click .siItemRemove': function() {
            event.preventDefault();
            var removeSiItem = Session.get('selectedSiItem');
            Meteor.call('removeSiMachine', removeSiItem)
        }
    })

}