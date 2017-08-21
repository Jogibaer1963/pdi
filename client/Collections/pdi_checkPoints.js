if (Meteor.isClient) {

    Template.inputNewCheckPoint.events({

        'submit .inputNewCheck': function (event) {
            event.preventDefault();
            const errorPos = event.target.newPosition.value;
            const errorDescription = event.target.errorDescription.value;
            const machineRangeStart = event.target.machineRangeStart.value;
            const machineRangeEnd = event.target.machineRangeEnd.value;
            const resultStart = machineRangeStart.split(" ");
            const resultEnd = machineRangeEnd.split(" ");
            console.log(resultEnd);
           const range = [];
           $('input[name=range]:checked').each(function() {
                range.push($(this).val());
            });
            const status = 1;
           Meteor.call('inputNewCheckPoint', status, errorPos, errorDescription,
                           range, resultStart, resultEnd);
            event.target.newPosition.value = "";
            event.target.errorDescription.value = "";
            event.target.C77.checked = false;
            event.target.C78.checked = false;
            event.target.C79.checked = false;
            event.target.machineRangeStart.value = "";
            event.target.machineRangeEnd.value = "";
        }

    });


    Template.newListOfFailures.helpers({

        newFailureList: function () {
            Session.set('selectedNewFailure', "");
            return FailuresList.find({}, {sort: {error_describ: 1}});
        },

        'selectedClass': function() {
            const checkPoint = this._id;
            const selectedCheckPoint = Session.get('selectedNewFailure');
            if (selectedCheckPoint === checkPoint) {
                return "selected"
            }
        }
    });

    Template.newListOfFailures.events({

        'click .showFailureList': function() {
            event.preventDefault();
            const failureId = this._id;
            Session.set('selectedNewFailure', failureId);
            const newErrorNr = FailuresList.findOne({_id: failureId}).errorid;
            Session.set('selectedNewErrorId', newErrorNr);
        }
    });


    Template.input_new_checklistItems.events({

        "submit .inputNewCheckListItems": function() {
            event.preventDefault();
            const errorPos = event.target.newPosition.value;
            const errorDescription = event.target.errorDescription.value;
            const machineType = event.target.machineType.value;
            const machineArray = machineType.split(",");
            const status = 1;
            const checkId = Session.get('selectedCheckPoint');
            Meteor.call('editCheckPoint', checkId, status, errorPos, errorDescription, machineArray);
            event.target.newPosition.value = "";
            event.target.errorDescription.value = "";
            event.target.machineType.value = "";
            },


        'click .deActiveCheck': function() {
            event.preventDefault();
            const deactivateCheck = Session.get('selectedCheckPoint');
            const status = 0;
            Meteor.call('deactivateCheckPoint', deactivateCheck, status);
        },

        'click .showCheckList': function() {
            event.preventDefault();
            const checkPoint = this._id;
            Session.set('selectedCheckPoint', checkPoint);
            }


    });

    Template.input_new_checklistItems.helpers({

        checkList: function () {
            event.preventDefault();
            Session.set('selectedCheckPoint', '');
            return checkPoints.find({status: 1}, {sort: {errorPos: 1}});
        },

        'selectedClass': function () {
            const checkPoint = this._id;
            const selectedCheckPoint = Session.get('selectedCheckPoint');
            if (selectedCheckPoint === checkPoint) {
                return "selected"
            }
        },


        editCheckpoint: function () {
            const editCheckPoint = Session.get('selectedCheckPoint');
            return checkPoints.findOne({_id: editCheckPoint});
        }

    });

    
    Template.deactivatedCheckPoints.helpers({

      inActiveCheckPoints: function() {
           event.preventDefault();
           return checkPoints.find({status: 0}, {sort: {errorPos: 1}});
       },

        'selectedClass': function() {
            const checkPoint = this._id;
            const selectedCheckPoint = Session.get('selectedCheckPoint');
            if (selectedCheckPoint === checkPoint) {
                return "selected"
            }
        }
    });

    Template.deactivatedCheckPoints.events({

        'click .showCheckList': function() {
            event.preventDefault();
            const checkPoint = this._id;
            Session.set('selectedCheckPoint', checkPoint);
        }
    });





    Template.chooseListOfFailures.helpers({

        failureList: function () {
            Session.set('selectedFailure', "");
            return FailuresList.find({}, {sort: {error_describ: 1}});
        },

        'selectedClass': function() {
            const checkPoint = this._id;
            const selectedCheckPoint = Session.get('selectedFailure');
            if (selectedCheckPoint === checkPoint) {
                return "selected"
            }
        }
    });

    Template.chooseListOfFailures.events({

        'click .showFailureList': function() {
            event.preventDefault();
            const failureId = this._id;
            Session.set('selectedFailure', failureId);
            const errorNr = FailuresList.findOne({_id: failureId}).errorid;
            Session.set('selectedErrorId', errorNr);
        }
    })

}
