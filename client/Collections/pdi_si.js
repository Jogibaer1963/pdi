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
            const siItem = this._id;
            const selectedSiItem = Session.get('selectedSiItem');
            if (selectedSiItem == siItem) {
                return "selected_2"
            }
        },

        reworkList: function() {
            event.preventDefault();
            return reworkMachineList.find({active: 1});
        },

        deactivateList: function() {
            event.preventDefault();
            return reworkMachineList.find({active: 0});
        },

        listContent: function() {
            const selectedSiItem = Session.get('selectedSiItem');
            return reworkMachineList.find({_id: selectedSiItem}).fetch();

        }

     });
    
    Template.siItemList.events({

        'click .selectedSiItem': function() {
            event.preventDefault();
            const newSiItem = this._id;
            Session.set('selectedSiItem', newSiItem);
        } 
    });
    
    
    Template.si.events({
        
        'submit .siItems': function() {
            event.preventDefault();
            const machine = event.target.siMachine.value;
            const siItemText = event.target.siItemText.value;
            Meteor.call('siList', machine, siItemText);
            event.target.siMachine.value="";
            event.target.siItemText.value="";
        },

        'submit .machineList': function() {
            event.preventDefault();
            const newPosition = event.target.newPosition.value;
            const errorValue = event.target.errorNr.value;
            const failureDescription = event.target.failureDescription.value;
            const nameMachineList = event.target.nameMachineList.value;
            Meteor.call('reworkMachineList', newPosition, errorValue, failureDescription, nameMachineList);
            event.target.errorNr.value.value="";
            event.target.failureDescription.value="";
            event.target.nameMachineList.value="";
        },

        'click .siItemRemove': function() {
            event.preventDefault();
            const removeSiItem = Session.get('selectedSiItem');
            Meteor.call('removeSiMachine', removeSiItem);
            Meteor.call('deactivateRework', removeSiItem);
        },

        'click #buttonDownload': function () {
            const siId = Session.get('selectedSiItem');
            const nameFile = 'fileDownloaded.csv';
            Meteor.call('download_3', siId, function (err, fileContent) {
                if (fileContent) {
                    const blob = new Blob([fileContent], {type: "text/plain;charset=utf-8"});
                    saveAs(blob, nameFile);
                }
            });
        }
    });

    Template.si.helpers({

       failureList: function () {
            Session.set('selectedNewFailure', "");
            return FailuresList.find({}, {sort: {error_describ: 1}});
        },

        'selectedClass': function() {
            event.preventDefault();
            const checkPoint = this._id;
            const selectedCheckPoint = Session.get('selectedNewFailure');
            if (selectedCheckPoint == checkPoint) {

                return "selected"
            }
        },

        errorNew: function () {
            event.preventDefault();
            return errorNewId = Session.get('selectedNewErrorId');
            // return errorNewId;
        }


    })

}