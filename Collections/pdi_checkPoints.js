if (Meteor.isClient) {

    Template.inputNewCheckPoint.events({

        'submit .inputNewCheck': function (event) {
            event.preventDefault();
            var errorPos = event.target.newPosition.value;
            var errorNr = event.target.errorNr.value;
            var errorDescription = event.target.errorDescription.value;
            var range = [];
            $('input[name=range]:checked').each(function() {
                range.push($(this).val());
            });
            var status = 1;
            Meteor.call('inputNewCheckPoint', status, errorPos, errorNr, errorDescription, range);
            event.target.newPosition.value = "";
            event.target.errorNr.value = "";
            event.target.errorDescription.value = "";
            event.target.machineRange.value = "";
        }

    });

    Template.inputNewCheckPoint.helpers({

        errorNew: function () {
            event.preventDefault();
            var errorNewId = Session.get('selectedNewErrorId');
            return errorNewId;
        }

    });


    Template.newListOfFailures.helpers({

        newFailureList: function () {
            Session.set('selectedNewFailure', "");
            return FailuresList.find({}, {sort: {error_describ: 1}});
        },

        'selectedClass': function() {
            event.preventDefault();
            var checkPoint = this._id;
            var selectedCheckPoint = Session.get('selectedNewFailure');
            if (selectedCheckPoint == checkPoint) {
                return "selected"
            }
        }
    });

    Template.newListOfFailures.events({

        'click .showFailureList': function() {
            event.preventDefault();
            var failureId = this._id;
            Session.set('selectedNewFailure', failureId);
            var newErrorNr = FailuresList.findOne({_id: failureId}).errorid;
            Session.set('selectedNewErrorId', newErrorNr);
        }
    });


    Template.input_new_checklistItems.events({

        "submit .inputNewCheckListItems": function() {
            event.preventDefault();
            var errorPos = event.target.newPosition.value;
            var errorNr = event.target.errorNr.value;
            var errorDescription = event.target.errorDescription.value;
            var machineRange = event.target.machineRange.value;
            var machineArray = machineRange.split(",");
            var status = 1;
            var checkId = Session.get('selectedCheckPoint');
            Meteor.call('editCheckPoint', checkId, status, errorPos, errorNr, errorDescription, machineArray);
            event.target.newPosition.value = "";
            event.target.errorNr.value = "";
            event.target.errorDescription.value = "";
            event.target.machineRange.value = "";
            },

    /*    'click .reActiveCheck': function() {
            event.preventDefault();
            var reActivateCheck = Session.get('selectedCheckPoint');
            var status = 1;
            Meteor.call('reActiveCheck', reActivateCheck, status);
            },   */

        'click .deActiveCheck': function() {
            event.preventDefault();
            var deactivateCheck = Session.get('selectedCheckPoint');
            var status = 0;
            Meteor.call('deactivateCheckPoint', deactivateCheck, status);
        },

        'click .showCheckList': function() {
            event.preventDefault();
            var checkPoint = this._id;
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
            event.preventDefault();
            var checkPoint = this._id;
            var selectedCheckPoint = Session.get('selectedCheckPoint');
            if (selectedCheckPoint == checkPoint) {
                return "selected"
            }
        },

        errorId: function () {
            event.preventDefault();
            var errorSelect = Session.get('selectedErrorId');
        //    Session.set('selectedErrorId', '');
            return errorSelect;
        },

        editCheckpoint: function () {
            event.preventDefault();
            var editCheckPoint = Session.get('selectedCheckPoint');
            return checkPoints.findOne({_id: editCheckPoint});
        }

    });

    
    Template.deactivatedCheckPoints.helpers({

      inActiveCheckPoints: function() {
           event.preventDefault();
           return checkPoints.find({status: 0}, {sort: {errorPos: 1}});
       },

        'selectedClass': function() {
            event.preventDefault();
            var checkPoint = this._id;
            var selectedCheckPoint = Session.get('selectedCheckPoint');
            if (selectedCheckPoint == checkPoint) {
                return "selected"
            }
        }
    });

    Template.deactivatedCheckPoints.events({

        'click .showCheckList': function() {
            event.preventDefault();
            var checkPoint = this._id;
            Session.set('selectedCheckPoint', checkPoint);
        }
    });





    Template.chooseListOfFailures.helpers({

        failureList: function () {
            Session.set('selectedFailure', "");
            return FailuresList.find({}, {sort: {error_describ: 1}});
        },

        'selectedClass': function() {
            event.preventDefault();
            var checkPoint = this._id;
            var selectedCheckPoint = Session.get('selectedFailure');
            if (selectedCheckPoint == checkPoint) {
                return "selected"
            }
        }
    });

    Template.chooseListOfFailures.events({

        'click .showFailureList': function() {
            event.preventDefault();
            var failureId = this._id;
            Session.set('selectedFailure', failureId);
            var errorNr = FailuresList.findOne({_id: failureId}).errorid;
            Session.set('selectedErrorId', errorNr);
        }
    })

}
